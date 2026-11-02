/**
 * AssetPreloader Utility — Zero-Lag Background Preloader & GPU Texture Decoder
 * 
 * Provides:
 * 1. Tiered Priority Queue: Tier 1 (critical blocking) vs Tier 2 (idle background).
 * 2. Hardware GPU Decoding: Uses `Image.decode()` so raster textures decompress
 *    into GPU memory before navigation, eliminating main-thread decode jank.
 * 3. Cache API & Service Worker integration: Persists assets into CacheStorage.
 * 4. FontFace & DOM link preload/prefetch injection.
 * 5. Concurrent Auth Synchronization with strict timeout guardrail (maxHoldMs).
 * 6. Resilient failure isolation: individual asset errors never block auth.
 */

export type AssetType = 'image' | 'font' | 'audio' | 'route' | 'model' | 'svg';
export type AssetPriority = 'tier1' | 'tier2';

export interface PreloadAsset {
  id: string;
  url: string;
  type: AssetType;
  priority: AssetPriority;
  weight?: number; // relative weight for progress calculation (default 1)
  meta?: {
    fontSpec?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  };
}

export type AssetItemStatus = 'pending' | 'loading' | 'cached' | 'decoded' | 'failed' | 'timeout';

export interface AssetItemState {
  asset: PreloadAsset;
  status: AssetItemStatus;
  loadTimeMs?: number;
  error?: string;
}

export type LifecycleState = 
  | 'IDLE_ON_LOGIN'
  | 'PREFETCHING_STATIC'
  | 'AUTH_AND_DECODE_SYNC'
  | 'READY_TO_MOUNT';

export interface PreloaderProgress {
  state: LifecycleState;
  tier1Total: number;
  tier1Loaded: number;
  tier1Percent: number;
  tier2Total: number;
  tier2Loaded: number;
  tier2Percent: number;
  overallPercent: number;
  activeItem?: string;
}

export type ProgressListener = (progress: PreloaderProgress) => void;

// In-memory hot texture cache keeping decoded Image objects in GPU memory
const hotTextureStore = new Map<string, HTMLImageElement>();

// In-memory font loaded set
const loadedFontsSet = new Set<string>();

const CACHE_NAME = 'museo-preloaded-v1';

export class AssetPreloaderEngine {
  private assets = new Map<string, AssetItemState>();
  private listeners = new Set<ProgressListener>();
  private state: LifecycleState = 'IDLE_ON_LOGIN';
  private tier2Queue: PreloadAsset[] = [];
  private isProcessingTier2 = false;
  private tier1Promise: Promise<void> | null = null;
  private tier1Resolve: (() => void) | null = null;

  constructor() {
    // Check if running in browser
    if (typeof window !== 'undefined') {
      this.initCacheStorage();
    }
  }

  private async initCacheStorage() {
    try {
      if ('caches' in window) {
        await caches.open(CACHE_NAME);
      }
    } catch {
      // CacheStorage might be disabled in private/incognito mode or certain iframes
    }
  }

  /**
   * Register a batch of assets to preload
   */
  public register(assets: PreloadAsset[]): this {
    for (const asset of assets) {
      if (!this.assets.has(asset.id)) {
        this.assets.set(asset.id, {
          asset,
          status: 'pending',
        });
      }
    }
    return this;
  }

  /**
   * Subscribe to progress updates
   */
  public onProgress(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    listener(this.getProgress());
    return () => this.listeners.delete(listener);
  }

  public getState(): LifecycleState {
    return this.state;
  }

  public setState(next: LifecycleState): void {
    this.state = next;
    this.notify();
  }

  public getProgress(): PreloaderProgress {
    let tier1Total = 0;
    let tier1Loaded = 0;
    let tier1Weight = 0;
    let tier1LoadedWeight = 0;

    let tier2Total = 0;
    let tier2Loaded = 0;
    let tier2Weight = 0;
    let tier2LoadedWeight = 0;

    let activeItem: string | undefined;

    for (const item of this.assets.values()) {
      const weight = item.asset.weight || 1;
      const isDone = item.status === 'cached' || item.status === 'decoded' || item.status === 'failed' || item.status === 'timeout';

      if (item.status === 'loading') {
        activeItem = item.asset.id;
      }

      if (item.asset.priority === 'tier1') {
        tier1Total++;
        tier1Weight += weight;
        if (isDone) {
          tier1Loaded++;
          tier1LoadedWeight += weight;
        }
      } else {
        tier2Total++;
        tier2Weight += weight;
        if (isDone) {
          tier2Loaded++;
          tier2LoadedWeight += weight;
        }
      }
    }

    const tier1Percent = tier1Weight > 0 ? Math.round((tier1LoadedWeight / tier1Weight) * 100) : 100;
    const tier2Percent = tier2Weight > 0 ? Math.round((tier2LoadedWeight / tier2Weight) * 100) : 100;

    const totalWeight = tier1Weight + tier2Weight;
    const totalLoadedWeight = tier1LoadedWeight + tier2LoadedWeight;
    const overallPercent = totalWeight > 0 ? Math.round((totalLoadedWeight / totalWeight) * 100) : 100;

    return {
      state: this.state,
      tier1Total,
      tier1Loaded,
      tier1Percent,
      tier2Total,
      tier2Loaded,
      tier2Percent,
      overallPercent,
      activeItem,
    };
  }

  private notify(): void {
    const progress = this.getProgress();
    for (const listener of this.listeners) {
      try {
        listener(progress);
      } catch (err) {
        console.error('[AssetPreloader] Listener error:', err);
      }
    }
  }

  /**
   * Start preloading on Login Screen Mount
   * Fetches Tier 1 assets immediately and schedules Tier 2 on idle callbacks.
   */
  public startOnLoginMount(): void {
    if (this.state !== 'IDLE_ON_LOGIN') return;
    this.setState('PREFETCHING_STATIC');

    // Create Tier 1 completion promise
    this.tier1Promise = new Promise<void>((resolve) => {
      this.tier1Resolve = resolve;
    });

    const tier1Assets: PreloadAsset[] = [];
    const tier2Assets: PreloadAsset[] = [];

    for (const item of this.assets.values()) {
      if (item.status === 'pending') {
        if (item.asset.priority === 'tier1') {
          tier1Assets.push(item.asset);
        } else {
          tier2Assets.push(item.asset);
        }
      }
    }

    // Load Tier 1 in parallel immediately
    if (tier1Assets.length === 0) {
      this.checkTier1Completion();
    } else {
      Promise.allSettled(tier1Assets.map((asset) => this.loadAsset(asset))).then(() => {
        this.checkTier1Completion();
      });
    }

    // Schedule Tier 2 on idle ticks without blocking main thread
    this.tier2Queue.push(...tier2Assets);
    this.scheduleTier2Processing();
  }

  /**
   * Decode an image into GPU memory using Image.decode()
   */
  private async decodeImage(url: string, crossOrigin?: string): Promise<HTMLImageElement> {
    if (hotTextureStore.has(url)) {
      return hotTextureStore.get(url)!;
    }

    const img = new Image();
    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }

    const decodePromise = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = async () => {
        try {
          if ('decode' in img) {
            await img.decode();
          }
          hotTextureStore.set(url, img);
          resolve(img);
        } catch {
          // Even if decode fails, image is still loaded in DOM cache
          hotTextureStore.set(url, img);
          resolve(img);
        }
      };
      img.onerror = (e) => reject(e);
    });

    img.src = url;
    return decodePromise;
  }

  /**
   * Preload a font using CSS Font Loading API and dynamic link tag
   */
  private async loadFont(fontSpec?: string, url?: string): Promise<void> {
    if (fontSpec && loadedFontsSet.has(fontSpec)) return;

    if (url && typeof document !== 'undefined') {
      this.injectLinkTag(url, 'preload', 'font', 'anonymous');
    }

    if (fontSpec && typeof document !== 'undefined' && 'fonts' in document) {
      try {
        await document.fonts.load(fontSpec);
        loadedFontsSet.add(fontSpec);
      } catch (err) {
        console.warn(`[AssetPreloader] Font load notice for "${fontSpec}":`, err);
      }
    }
  }

  /**
   * Inject <link rel="preload" | "prefetch"> into <head> safely
   */
  private injectLinkTag(
    url: string,
    rel: 'preload' | 'prefetch',
    asType: string,
    crossOrigin?: string
  ): void {
    if (typeof document === 'undefined') return;

    // Check if link already exists
    const existing = document.querySelector(`link[href="${url}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = rel;
    link.href = url;
    if (asType) {
      link.as = asType;
    }
    if (crossOrigin) {
      link.crossOrigin = crossOrigin;
    }
    document.head.appendChild(link);
  }

  /**
   * Cache asset in CacheStorage if available
   */
  private async cacheInStorage(url: string): Promise<void> {
    if (typeof window === 'undefined' || !('caches' in window)) return;
    try {
      const cache = await caches.open(CACHE_NAME);
      const matched = await cache.match(url);
      if (!matched) {
        await cache.add(url);
      }
    } catch {
      // Non-blocking fallback
    }
  }

  /**
   * Load a single asset based on type with error resilience
   */
  private async loadAsset(asset: PreloadAsset): Promise<void> {
    const item = this.assets.get(asset.id);
    if (!item) return;

    item.status = 'loading';
    this.notify();

    const startTime = performance.now();

    try {
      switch (asset.type) {
        case 'image': {
          // Preload link + Cache API + Image.decode()
          this.injectLinkTag(asset.url, asset.priority === 'tier1' ? 'preload' : 'prefetch', 'image');
          await this.cacheInStorage(asset.url);
          await this.decodeImage(asset.url, asset.meta?.crossOrigin);
          item.status = 'decoded';
          break;
        }

        case 'font': {
          await this.loadFont(asset.meta?.fontSpec, asset.url);
          item.status = 'cached';
          break;
        }

        case 'route': {
          // Dynamic prefetch for Next.js route chunks
          this.injectLinkTag(asset.url, 'prefetch', 'fetch');
          item.status = 'cached';
          break;
        }

        case 'audio': {
          this.injectLinkTag(asset.url, 'prefetch', 'audio');
          await this.cacheInStorage(asset.url);
          item.status = 'cached';
          break;
        }

        case 'model':
        case 'svg':
        default: {
          this.injectLinkTag(asset.url, asset.priority === 'tier1' ? 'preload' : 'prefetch', 'fetch');
          await this.cacheInStorage(asset.url);
          item.status = 'cached';
          break;
        }
      }

      item.loadTimeMs = Math.round(performance.now() - startTime);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn(`[AssetPreloader] Non-critical asset failed: ${asset.id} (${asset.url})`, errorMessage);
      item.status = 'failed';
      item.error = errorMessage;
    } finally {
      this.notify();
    }
  }

  /**
   * Checks whether all Tier 1 assets are finished (cached, decoded, or failed/timed out)
   */
  private checkTier1Completion(): boolean {
    let allDone = true;
    for (const item of this.assets.values()) {
      if (item.asset.priority === 'tier1') {
        const isDone = item.status === 'cached' || item.status === 'decoded' || item.status === 'failed' || item.status === 'timeout';
        if (!isDone) {
          allDone = false;
          break;
        }
      }
    }

    if (allDone && this.tier1Resolve) {
      this.tier1Resolve();
      this.tier1Resolve = null;
    }

    return allDone;
  }

  /**
   * Wait for Tier 1 assets to finish with strict timeout guardrail
   */
  public async waitForTier1(maxHoldMs: number = 1500): Promise<void> {
    if (this.checkTier1Completion()) {
      return;
    }

    const timeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        // Guardrail timed out: mark remaining pending Tier 1 as 'timeout' to release the gate
        for (const item of this.assets.values()) {
          if (item.asset.priority === 'tier1' && (item.status === 'pending' || item.status === 'loading')) {
            item.status = 'timeout';
          }
        }
        this.checkTier1Completion();
        resolve();
      }, maxHoldMs);
    });

    const completionPromise = this.tier1Promise || Promise.resolve();

    await Promise.race([completionPromise, timeoutPromise]);
  }

  /**
   * Schedule Tier 2 asset processing on idle callbacks so the main thread
   * stays completely unblocked for smooth 60fps typing & interactions.
   */
  private scheduleTier2Processing(): void {
    if (this.isProcessingTier2 || this.tier2Queue.length === 0) return;
    this.isProcessingTier2 = true;

    const processNext = (deadline?: { timeRemaining: () => number; didTimeout?: boolean }) => {
      // Process while there is idle budget or if deadline timed out
      while (this.tier2Queue.length > 0 && (!deadline || deadline.timeRemaining() > 5 || deadline.didTimeout)) {
        const asset = this.tier2Queue.shift();
        if (asset) {
          this.loadAsset(asset);
        }
      }

      if (this.tier2Queue.length > 0) {
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          window.requestIdleCallback((d) => processNext(d), { timeout: 2000 });
        } else {
          setTimeout(() => processNext(), 30);
        }
      } else {
        this.isProcessingTier2 = false;
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback((d) => processNext(d), { timeout: 2000 });
    } else {
      setTimeout(() => processNext(), 30);
    }
  }

  /**
   * Synchronize Authentication API request with Tier 1 Preload Completion Gate
   * Concurrent Promise.all execution with timeout guardrail.
   */
  public async syncAuthAndPreload<T>(
    authPromise: Promise<T>,
    options: { maxHoldMs?: number } = {}
  ): Promise<{ authResult: T; preloaded: boolean; durationMs: number }> {
    const { maxHoldMs = 1500 } = options;
    const start = performance.now();

    this.setState('AUTH_AND_DECODE_SYNC');

    // Run Auth API and Tier 1 Asset Preloader concurrently
    const [authResult] = await Promise.all([
      authPromise,
      this.waitForTier1(maxHoldMs),
    ]);

    const durationMs = Math.round(performance.now() - start);
    this.setState('READY_TO_MOUNT');

    return {
      authResult,
      preloaded: true,
      durationMs,
    };
  }
}

// ── Default Museverse Asset Manifest ──
export const DEFAULT_MUSEO_ASSET_MANIFEST: PreloadAsset[] = [
  // ── Tier 1: Critical — Blocking Transition ──
  {
    id: 'font-space-grotesk',
    url: '/fonts/space-grotesk.woff2',
    type: 'font',
    priority: 'tier1',
    weight: 2,
    meta: { fontSpec: '700 1rem Space Grotesk' },
  },
  {
    id: 'font-space-mono',
    url: '/fonts/space-mono.woff2',
    type: 'font',
    priority: 'tier1',
    weight: 2,
    meta: { fontSpec: '400 1rem Space Mono' },
  },
  {
    id: 'hero-portal-arch',
    url: '/images/symphony_portal_arch.jpg',
    type: 'image',
    priority: 'tier1',
    weight: 4,
    meta: { crossOrigin: 'anonymous' },
  },
  {
    id: 'core-icon-globe',
    url: '/globe.svg',
    type: 'svg',
    priority: 'tier1',
    weight: 1,
  },
  {
    id: 'core-icon-window',
    url: '/window.svg',
    type: 'svg',
    priority: 'tier1',
    weight: 1,
  },
  {
    id: 'route-dashboard-home',
    url: '/',
    type: 'route',
    priority: 'tier1',
    weight: 3,
  },
  {
    id: 'route-museum-gallery',
    url: '/museum',
    type: 'route',
    priority: 'tier1',
    weight: 3,
  },

  // ── Tier 2: High — Background (Silently loaded via requestIdleCallback) ──
  {
    id: 'audio-spaceship-ambient',
    url: '/audio/alien_spaceship_ambient.mp3',
    type: 'audio',
    priority: 'tier2',
    weight: 3,
  },
  {
    id: 'audio-deep-tones',
    url: '/audio/deep_tones.mp3',
    type: 'audio',
    priority: 'tier2',
    weight: 3,
  },
  {
    id: 'audio-binaural-theta',
    url: '/audio/binaural_theta.wav',
    type: 'audio',
    priority: 'tier2',
    weight: 2,
  },
  {
    id: 'route-evolution',
    url: '/evolution',
    type: 'route',
    priority: 'tier2',
    weight: 2,
  },
  {
    id: 'route-compare',
    url: '/compare',
    type: 'route',
    priority: 'tier2',
    weight: 2,
  },
  {
    id: 'model-ammonite',
    url: '/models/ammonite.glb',
    type: 'model',
    priority: 'tier2',
    weight: 4,
  },
  {
    id: 'model-archaeopteryx',
    url: '/models/archaeopteryx.glb',
    type: 'model',
    priority: 'tier2',
    weight: 3,
  },
];

// Singleton instance for global state access across hooks and components
let globalPreloaderInstance: AssetPreloaderEngine | null = null;

export function getAssetPreloader(manifest: PreloadAsset[] = DEFAULT_MUSEO_ASSET_MANIFEST): AssetPreloaderEngine {
  if (!globalPreloaderInstance) {
    globalPreloaderInstance = new AssetPreloaderEngine();
    globalPreloaderInstance.register(manifest);
  }
  return globalPreloaderInstance;
}
