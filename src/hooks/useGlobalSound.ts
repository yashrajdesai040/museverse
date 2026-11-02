'use client';

import { useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';

/* ═════════════════════════════════════════════════════════════════════
   MUSEO MASTER HIGH-FIDELITY SONORIC ARCHITECTURE (V4 FLAWLESS EDITION)
   Awwwards-Tier Cinematic Audio Engine & Tactile Haptic System:
   - Purposeful, selective audio design: SFX only where intentionally needed.
   - Multi-Layered Real Studio Acoustic Foley (CC0 1.0 Universal)
   - Studio-Recorded Cinematic Ambient Drones with Dynamic Crossfades
   - Real Tactile Clicks (Crisp 115ms Studio Switch Transient)
   - Organic Stereo Velvet Hover Ticks with ±3% Humanized Pitch Drift
   - Universal Web Audio Decoder (Promise + Callback Support for Safari/Firefox)
   - Bespoke Curatorial Sound Effects:
     • playInspect: Precision optical lens / specimen focus
     • playMintCert: Layered parchment rustle + physical wax stamp
     • playBookmark: Crystalline double-bell discovery harmonic
     • playEpochShift: Space-time cosmic time dilation + sub-boom
     • playScannerBeam: Spectral radiometric laser sweep
     • playCaliperMeasure: Precision dimensional caliper tick
   ═════════════════════════════════════════════════════════════════════ */

interface SoundConfig {
  url: string;
  volume: number;
  pitchVar?: number; // Random pitch variation (e.g. 0.03 = +/- 3%)
}

interface AmbientConfig {
  url: string;
  volume: number;
  baseCutoff: number;
}

const SOUND_LIBRARY: Record<string, SoundConfig> = {
  click:        { url: '/audio/click.wav',           volume: 0.32, pitchVar: 0.02 },
  hover:        { url: '/audio/hover.wav',           volume: 0.08, pitchVar: 0.03 },
  select:       { url: '/audio/calibrate.wav',       volume: 0.30, pitchVar: 0.02 },
  confirm:      { url: '/audio/unlock.wav',          volume: 0.32, pitchVar: 0.02 },
  stamp:        { url: '/audio/stamp.wav',           volume: 0.44, pitchVar: 0.02 },
  tear:         { url: '/audio/tear.wav',            volume: 0.30, pitchVar: 0.03 },
  laser:        { url: '/audio/laser.wav',           volume: 0.22, pitchVar: 0.02 },
  footstep:     { url: '/audio/footstep_l.wav',      volume: 0.24, pitchVar: 0.05 },
  footstep_l:   { url: '/audio/footstep_l.wav',      volume: 0.24, pitchVar: 0.05 },
  footstep_r:   { url: '/audio/footstep_r.wav',      volume: 0.24, pitchVar: 0.05 },
  chime:        { url: '/audio/chime.wav',           volume: 0.32, pitchVar: 0.01 },
  bell:         { url: '/audio/bell.wav',            volume: 0.32, pitchVar: 0.01 },
  singing_bowl: { url: '/audio/singing_bowl.mp3',    volume: 0.34, pitchVar: 0.01 },
  shatter:      { url: '/audio/shatter.wav',         volume: 0.28, pitchVar: 0.04 },
  warp:         { url: '/audio/warp.wav',            volume: 0.30, pitchVar: 0.02 },
  calibrate:    { url: '/audio/calibrate.wav',       volume: 0.24, pitchVar: 0.02 },
  seismic:      { url: '/audio/seismic.wav',         volume: 0.46, pitchVar: 0.02 },
  unlock:       { url: '/audio/unlock.wav',          volume: 0.30, pitchVar: 0.02 },
  toggle_on:    { url: '/audio/toggle_on.wav',       volume: 0.26, pitchVar: 0.02 },
  toggle_off:   { url: '/audio/toggle_off.wav',      volume: 0.26, pitchVar: 0.02 },
  drawer_open:  { url: '/audio/drawer_open.wav',     volume: 0.30, pitchVar: 0.02 },
  drawer_close: { url: '/audio/drawer_close.wav',    volume: 0.28, pitchVar: 0.02 },
  typewriter:   { url: '/audio/typewriter.wav',      volume: 0.22, pitchVar: 0.04 },
  tick:         { url: '/audio/tick_001.wav',        volume: 0.20, pitchVar: 0.02 },
  swipe:        { url: '/audio/swipe.wav',           volume: 0.16, pitchVar: 0.03 },
  impact:       { url: '/audio/impact.wav',          volume: 0.46, pitchVar: 0.02 },
  glass:        { url: '/audio/glass.wav',           volume: 0.24, pitchVar: 0.02 },
  whoosh:       { url: '/audio/swipe.wav',           volume: 0.14, pitchVar: 0.02 },
  gate_echo:    { url: '/audio/gate_echo.wav',       volume: 0.34, pitchVar: 0.03 },
};

const AMBIENT_CATALOG: Record<string, AmbientConfig> = {
  '01-hadean':     { url: '/audio/deep_tones.mp3',              volume: 0.15, baseCutoff: 320 },
  'hadean':        { url: '/audio/deep_tones.mp3',              volume: 0.15, baseCutoff: 320 },
  '02-archean':    { url: '/audio/binaural_theta.wav',          volume: 0.13, baseCutoff: 360 },
  'archean':       { url: '/audio/binaural_theta.wav',          volume: 0.13, baseCutoff: 360 },
  '03-proterozoic':{ url: '/audio/alien_spaceship_ambient.mp3', volume: 0.14, baseCutoff: 400 },
  'proterozoic':   { url: '/audio/alien_spaceship_ambient.mp3', volume: 0.14, baseCutoff: 400 },
  '04-paleozoic':  { url: '/audio/temple_ambience.mp3',         volume: 0.14, baseCutoff: 460 },
  'paleozoic':     { url: '/audio/temple_ambience.mp3',         volume: 0.14, baseCutoff: 460 },
  'classical':     { url: '/audio/temple_ambience.mp3',         volume: 0.14, baseCutoff: 460 },
  '05-mesozoic':   { url: '/audio/deep_tones.mp3',              volume: 0.15, baseCutoff: 500 },
  'mesozoic':      { url: '/audio/deep_tones.mp3',              volume: 0.15, baseCutoff: 500 },
  '06-cenozoic':   { url: '/audio/library_ambience.mp3',        volume: 0.15, baseCutoff: 620 },
  'cenozoic':      { url: '/audio/library_ambience.mp3',        volume: 0.15, baseCutoff: 620 },
  'interstellar':  { url: '/audio/alien_spaceship_ambient.mp3', volume: 0.14, baseCutoff: 440 },
  'space':         { url: '/audio/alien_spaceship_ambient.mp3', volume: 0.14, baseCutoff: 440 },
  'default':       { url: '/audio/deep_tones.mp3',              volume: 0.15, baseCutoff: 380 },
};

class MasterSoundEngine {
  private ctx: AudioContext | null = null;
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private pendingFetches: Map<string, Promise<AudioBuffer | null>> = new Map();
  private lastHoverTime = 0;
  private footstepToggle = false;
  private hasPreloaded = false;

  // Generative & Recorded Ambient Atmosphere Nodes
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientPanner: StereoPannerNode | null = null;
  private isAmbientRunning = false;
  private currentBaseCutoff = 380;
  private currentEpoch = 'default';
  private targetAmbientVolume = 0.15;
  private stopAmbientTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const idleCallback = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1000));
      idleCallback(() => {
        this.preloadEssentialSounds();
      });
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          return null;
        }
      }
    }
    return this.ctx;
  }

  public async unlockAudio(): Promise<AudioContext | null> {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {}
    }
    this.preloadEssentialSounds();
    return ctx;
  }

  // Preload essential UI sounds into memory for instantaneous response
  private preloadEssentialSounds() {
    if (this.hasPreloaded) return;
    this.hasPreloaded = true;

    const primaryKeys = [
      'click',
      'hover',
      'select',
      'confirm',
      'toggle_on',
      'toggle_off',
      'drawer_open',
      'drawer_close',
      'typewriter',
      'tick',
      'stamp',
      'laser',
      'chime',
      'footstep_l',
      'footstep_r',
      'swipe',
      'impact',
      'bell',
      'glass',
      'singing_bowl',
    ];

    primaryKeys.forEach((key) => {
      this.loadBuffer(key).catch(() => {});
    });

    // Also preload default ambient track
    this.loadBufferFromUrl('/audio/deep_tones.mp3').catch(() => {});
  }

  // Load and decode an audio asset by sound key
  private async loadBuffer(key: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(key)) {
      return this.bufferCache.get(key)!;
    }
    const config = SOUND_LIBRARY[key];
    if (!config) return null;
    return this.loadBufferFromUrl(config.url, key);
  }

  // Load and decode directly from URL with cache and cross-browser safety
  private async loadBufferFromUrl(url: string, cacheKey?: string): Promise<AudioBuffer | null> {
    const key = cacheKey || url;
    if (this.bufferCache.has(key)) {
      return this.bufferCache.get(key)!;
    }
    if (this.pendingFetches.has(key)) {
      return this.pendingFetches.get(key)!;
    }

    const ctx = this.getContext();
    if (!ctx) return null;

    const fetchPromise = (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arrayBuf = await res.arrayBuffer();
        const bufferCopy = arrayBuf.slice(0);

        // Universal Promise + Callback decoder safe across all browsers
        const decoded = await new Promise<AudioBuffer>((resolve, reject) => {
          try {
            const ret = ctx.decodeAudioData(bufferCopy, resolve, reject);
            if (ret && typeof ret.then === 'function') {
              ret.then(resolve).catch(reject);
            }
          } catch (e) {
            reject(e);
          }
        });

        this.bufferCache.set(key, decoded);
        return decoded;
      } catch (err) {
        return null;
      } finally {
        this.pendingFetches.delete(key);
      }
    })();

    this.pendingFetches.set(key, fetchPromise);
    return fetchPromise;
  }

  // Play pre-rendered studio sample with sub-millisecond precision
  public async playSample(key: string, customVolMultiplier = 1.0) {
    const ctx = this.getContext();
    if (!ctx || ctx.state === 'closed') return;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return;
      }
    }
    if (ctx.state !== 'running') return;

    const config = SOUND_LIBRARY[key];
    if (!config) return;

    let buffer = this.bufferCache.get(key);
    if (!buffer) {
      buffer = (await this.loadBuffer(key)) || undefined;
    }

    if (buffer && ctx.state === 'running') {
      try {
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        // Apply natural humanized micro-pitch drift
        if (config.pitchVar) {
          const delta = (Math.random() * 2 - 1) * config.pitchVar;
          source.playbackRate.setValueAtTime(1.0 + delta, ctx.currentTime);
        }

        const gainNode = ctx.createGain();
        const targetVol = config.volume * customVolMultiplier;
        gainNode.gain.setValueAtTime(targetVol, ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(ctx.currentTime);
        return;
      } catch {
        // Fallback below
      }
    }

    this.proceduralFallback(key, ctx);
  }

  // Pure studio tactile switch click (clean transient, zero synthetic buzz)
  public playClick() {
    this.playSample('click');
  }

  // Velvet hover tick (debounced to 75ms to guarantee quiet dignity)
  public playHover() {
    const now = performance.now();
    if (now - this.lastHoverTime < 75) return;
    this.lastHoverTime = now;
    this.playSample('hover');
  }

  // Smooth procedural fallback if an asset is still fetching
  private proceduralFallback(key: string, ctx: AudioContext) {
    try {
      const now = ctx.currentTime;
      if (key === 'click' || key === 'toggle_on' || key === 'toggle_off') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.026);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.026);
      } else if (key === 'hover') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.012, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.012);
      }
    } catch {}
  }

  // ── Public SFX Playback Triggers ─────────────────────────────

  playSelect() {
    this.playSample('select');
  }

  playConfirm() {
    this.playSample('confirm');
  }

  playStamp() {
    this.playSample('stamp');
  }

  playTear() {
    this.playSample('tear');
  }

  playLaser() {
    this.playSample('laser');
  }

  playFootstep() {
    this.footstepToggle = !this.footstepToggle;
    this.playSample(this.footstepToggle ? 'footstep_l' : 'footstep_r');
  }

  playToggle(isOn = true) {
    this.playSample(isOn ? 'toggle_on' : 'toggle_off');
  }

  playDrawerOpen() {
    this.playSample('drawer_open');
  }

  playDrawerClose() {
    this.playSample('drawer_close');
  }

  playTypewriter() {
    this.playSample('typewriter');
  }

  playSwipe() {
    this.playSample('swipe');
  }

  playImpact() {
    this.playSample('impact');
  }

  playBell() {
    this.playSample('bell');
  }

  playSingingBowl() {
    this.playSample('singing_bowl');
  }

  playGlass() {
    this.playSample('glass');
  }

  playWhoosh() {
    this.playSample('whoosh');
  }

  playGateEcho() {
    this.playSample('gate_echo');
  }

  playChime() {
    this.playSample('chime');
  }

  playShatter() {
    this.playSample('shatter');
  }

  playWarp() {
    this.playSample('warp');
  }

  playCalibrate() {
    this.playSample('calibrate');
  }

  playTick() {
    this.playSample('tick');
  }

  playSeismicRumble() {
    this.playSample('seismic');
  }

  playUnlock() {
    this.playSample('unlock');
  }

  // ── Bespoke Curatorial Sound Effects (Added for High-Value Moments) ──

  // Precision optical lens / specimen focus click
  playInspect() {
    this.playSample('glass', 0.9);
    setTimeout(() => {
      this.playSample('click', 0.6);
    }, 45);
  }

  // Physical wax seal stamp + parchment slide rustle (Certificate / Ticket Mint)
  playMintCert() {
    this.playSample('tear', 0.85);
    setTimeout(() => {
      this.playSample('stamp', 1.0);
    }, 180);
    setTimeout(() => {
      this.playSample('chime', 0.7);
    }, 480);
  }

  // Crystalline discovery double-harmonic (Bookmark / Passport Stamp)
  playBookmark() {
    this.playSample('select', 1.0);
    setTimeout(() => {
      this.playSample('singing_bowl', 0.75);
    }, 120);
  }

  // Space-time cosmic time dilation + sub-boom (Geological Epoch Shift)
  playEpochShift() {
    this.playSample('warp', 1.0);
    setTimeout(() => {
      this.playSample('seismic', 0.75);
    }, 200);
  }

  // High-tech spectral radiometric laser sweep
  playScannerBeam() {
    this.playSample('laser', 1.0);
  }

  // Precision dimensional caliper tick
  playCaliperMeasure() {
    this.playSample('calibrate', 1.0);
  }

  // ─── Dual-Engine Cinematic Ambient Soundscape ───

  public async startAmbient(epochId = '01-hadean') {
    if (this.isAmbientRunning && this.currentEpoch === epochId) {
      return;
    }
    const ctx = this.getContext();
    if (!ctx || ctx.state === 'closed') return;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return;
      }
    }
    if (ctx.state !== 'running') return;

    this.currentEpoch = epochId;
    const config = AMBIENT_CATALOG[epochId] || AMBIENT_CATALOG['default'];
    this.targetAmbientVolume = config.volume;
    this.currentBaseCutoff = config.baseCutoff;

    if (this.stopAmbientTimer) {
      clearTimeout(this.stopAmbientTimer);
      this.stopAmbientTimer = null;
    }

    try {
      // 1. If already running, perform smooth crossfade
      if (this.isAmbientRunning && this.ambientGain && this.ambientFilter) {
        this.crossfadeAmbientTrack(config);
        return;
      }

      // 2. Setup Audio Graph
      // Master Ambient Gain Node
      const masterGain = ctx.createGain();
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(this.targetAmbientVolume, now + 1.8);
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      // Resonant Lowpass Filter (Warm acoustic air without harshness)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(config.baseCutoff, now);
      filter.Q.setValueAtTime(1.2, now);
      this.ambientFilter = filter;

      // Stereo Field Panner
      if (ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(0, now);
        filter.connect(panner);
        panner.connect(masterGain);
        this.ambientPanner = panner;
      } else {
        filter.connect(masterGain);
      }

      this.isAmbientRunning = true;

      // 3. Load & Loop the Cinematic Studio Recording (No synthetic buzzing)
      this.playAmbientBuffer(config.url, filter);
    } catch {
      // Safe fallback on restricted audio contexts
    }
  }

  private async playAmbientBuffer(url: string, destinationNode: AudioNode) {
    const ctx = this.getContext();
    if (!ctx || ctx.state === 'closed') return;

    try {
      const buffer = await this.loadBufferFromUrl(url);
      if (!buffer || !this.isAmbientRunning) return;

      // Stop previous source if any
      if (this.ambientSource) {
        try {
          this.ambientSource.stop();
          this.ambientSource.disconnect();
        } catch {}
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(destinationNode);
      source.start();
      this.ambientSource = source;
    } catch {}
  }

  private async crossfadeAmbientTrack(config: AmbientConfig) {
    const ctx = this.getContext();
    if (!ctx || !this.ambientFilter || ctx.state !== 'running') return;

    try {
      const now = ctx.currentTime;
      // Morph filter cutoff smoothly to new epoch aesthetic
      this.ambientFilter.frequency.setTargetAtTime(config.baseCutoff, now, 0.8);
      this.currentBaseCutoff = config.baseCutoff;

      // Load new buffer
      const newBuffer = await this.loadBufferFromUrl(config.url);
      if (!newBuffer || !this.isAmbientRunning) return;

      const oldSource = this.ambientSource;

      // Create new buffer source with its own fade-in gain
      const newSource = ctx.createBufferSource();
      newSource.buffer = newBuffer;
      newSource.loop = true;

      const trackGain = ctx.createGain();
      trackGain.gain.setValueAtTime(0.0001, now);
      trackGain.gain.linearRampToValueAtTime(1.0, now + 1.4);

      newSource.connect(trackGain);
      trackGain.connect(this.ambientFilter);
      newSource.start();
      this.ambientSource = newSource;

      // Fade out and stop old source
      if (oldSource) {
        setTimeout(() => {
          try {
            oldSource.stop();
            oldSource.disconnect();
          } catch {}
        }, 1500);
      }
    } catch {}
  }

  public setAmbientEpoch(epochId: string) {
    if (!this.isAmbientRunning) {
      this.startAmbient(epochId);
      return;
    }
    const config = AMBIENT_CATALOG[epochId] || AMBIENT_CATALOG['default'];
    this.currentEpoch = epochId;
    this.crossfadeAmbientTrack(config);
  }

  public stopAmbient() {
    if (!this.isAmbientRunning || !this.ctx || !this.ambientGain) return;
    try {
      const now = this.ctx.currentTime;
      const currentVal = Math.max(0.0001, this.ambientGain.gain.value);
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(currentVal, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);

      if (this.stopAmbientTimer) {
        clearTimeout(this.stopAmbientTimer);
      }

      this.stopAmbientTimer = setTimeout(() => {
        try {
          if (this.ambientSource) {
            this.ambientSource.stop();
            this.ambientSource.disconnect();
          }
        } catch {}
        this.isAmbientRunning = false;
        this.ambientGain = null;
        this.ambientSource = null;
        this.ambientFilter = null;
        this.ambientPanner = null;
        this.stopAmbientTimer = null;
      }, 650);
    } catch {
      this.isAmbientRunning = false;
    }
  }

  // Interactive Sonoric Landscape modulation via cursor dynamics
  public modulateAmbientWithCursor(normX: number, normY: number, velocity: number) {
    if (!this.isAmbientRunning || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      // Stereo Field Panning (-0.45 to +0.45)
      if (this.ambientPanner) {
        this.ambientPanner.pan.setTargetAtTime(Math.max(-0.45, Math.min(0.45, normX * 0.4)), now, 0.12);
      }
      // Dynamic Filter Air & Brightness
      if (this.ambientFilter) {
        const targetFreq = Math.max(160, Math.min(1100, this.currentBaseCutoff + normY * 360));
        this.ambientFilter.frequency.setTargetAtTime(targetFreq, now, 0.14);
      }
    } catch {}
  }

  // Duck ambient volume when tab is blurred or during high-impact sequences
  public duckAmbient(isDucked: boolean) {
    if (!this.isAmbientRunning || !this.ctx || !this.ambientGain || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const target = isDucked ? 0.0001 : this.targetAmbientVolume;
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setTargetAtTime(target, now, 0.35);
    } catch {}
  }
}

// Global Singleton Instance
export const soundEngine = new MasterSoundEngine();

export function useGlobalSound() {
  const audioMuted = useAppStore((s) => s.audioMuted);

  const playClick = useCallback(() => {
    if (!audioMuted) soundEngine.playClick();
  }, [audioMuted]);

  const playHover = useCallback(() => {
    if (!audioMuted) soundEngine.playHover();
  }, [audioMuted]);

  const playSelect = useCallback(() => {
    if (!audioMuted) soundEngine.playSelect();
  }, [audioMuted]);

  const playConfirm = useCallback(() => {
    if (!audioMuted) soundEngine.playConfirm();
  }, [audioMuted]);

  const playStamp = useCallback(() => {
    if (!audioMuted) soundEngine.playStamp();
  }, [audioMuted]);

  const playLaser = useCallback(() => {
    if (!audioMuted) soundEngine.playLaser();
  }, [audioMuted]);

  const playFootstep = useCallback(() => {
    if (!audioMuted) soundEngine.playFootstep();
  }, [audioMuted]);

  const playChime = useCallback(() => {
    if (!audioMuted) soundEngine.playChime();
  }, [audioMuted]);

  const playSingingBowl = useCallback(() => {
    if (!audioMuted) soundEngine.playSingingBowl();
  }, [audioMuted]);

  const playShatter = useCallback(() => {
    if (!audioMuted) soundEngine.playShatter();
  }, [audioMuted]);

  const playWarp = useCallback(() => {
    if (!audioMuted) soundEngine.playWarp();
  }, [audioMuted]);

  const playCalibrate = useCallback(() => {
    if (!audioMuted) soundEngine.playCalibrate();
  }, [audioMuted]);

  const playTick = useCallback(() => {
    if (!audioMuted) soundEngine.playTick();
  }, [audioMuted]);

  const playSeismicRumble = useCallback(() => {
    if (!audioMuted) soundEngine.playSeismicRumble();
  }, [audioMuted]);

  const playUnlock = useCallback(() => {
    if (!audioMuted) soundEngine.playUnlock();
  }, [audioMuted]);

  const playToggle = useCallback(
    (isOn?: boolean) => {
      if (!audioMuted) soundEngine.playToggle(isOn);
    },
    [audioMuted]
  );

  const playDrawerOpen = useCallback(() => {
    if (!audioMuted) soundEngine.playDrawerOpen();
  }, [audioMuted]);

  const playDrawerClose = useCallback(() => {
    if (!audioMuted) soundEngine.playDrawerClose();
  }, [audioMuted]);

  const playTypewriter = useCallback(() => {
    if (!audioMuted) soundEngine.playTypewriter();
  }, [audioMuted]);

  const playSwipe = useCallback(() => {
    if (!audioMuted) soundEngine.playSwipe();
  }, [audioMuted]);

  const playImpact = useCallback(() => {
    if (!audioMuted) soundEngine.playImpact();
  }, [audioMuted]);

  const playBell = useCallback(() => {
    if (!audioMuted) soundEngine.playBell();
  }, [audioMuted]);

  const playGlass = useCallback(() => {
    if (!audioMuted) soundEngine.playGlass();
  }, [audioMuted]);

  const playWhoosh = useCallback(() => {
    if (!audioMuted) soundEngine.playWhoosh();
  }, [audioMuted]);

  const playGateEcho = useCallback(() => {
    if (!audioMuted) soundEngine.playGateEcho();
  }, [audioMuted]);

  // ── Bespoke Handlers ──
  const playInspect = useCallback(() => {
    if (!audioMuted) soundEngine.playInspect();
  }, [audioMuted]);

  const playMintCert = useCallback(() => {
    if (!audioMuted) soundEngine.playMintCert();
  }, [audioMuted]);

  const playBookmark = useCallback(() => {
    if (!audioMuted) soundEngine.playBookmark();
  }, [audioMuted]);

  const playEpochShift = useCallback(() => {
    if (!audioMuted) soundEngine.playEpochShift();
  }, [audioMuted]);

  const playScannerBeam = useCallback(() => {
    if (!audioMuted) soundEngine.playScannerBeam();
  }, [audioMuted]);

  const playCaliperMeasure = useCallback(() => {
    if (!audioMuted) soundEngine.playCaliperMeasure();
  }, [audioMuted]);

  const startAmbient = useCallback(
    (epochId?: string) => {
      if (!audioMuted) soundEngine.startAmbient(epochId);
    },
    [audioMuted]
  );

  const setAmbientEpoch = useCallback((epochId: string) => {
    soundEngine.setAmbientEpoch(epochId);
  }, []);

  const stopAmbient = useCallback(() => {
    soundEngine.stopAmbient();
  }, []);

  const playTear = useCallback(() => {
    if (!audioMuted) soundEngine.playTear();
  }, [audioMuted]);

  const unlockAudio = useCallback(() => {
    soundEngine.unlockAudio();
  }, []);

  const modulateAmbientWithCursor = useCallback(
    (normX: number, normY: number, velocity: number) => {
      if (!audioMuted) soundEngine.modulateAmbientWithCursor(normX, normY, velocity);
    },
    [audioMuted]
  );

  return {
    playClick,
    playHover,
    playSelect,
    playConfirm,
    playStamp,
    playTear,
    playLaser,
    playFootstep,
    playChime,
    playSingingBowl,
    playShatter,
    playWarp,
    playCalibrate,
    playTick,
    playSeismicRumble,
    playUnlock,
    playToggle,
    playDrawerOpen,
    playDrawerClose,
    playTypewriter,
    playSwipe,
    playImpact,
    playBell,
    playGlass,
    playWhoosh,
    playGateEcho,
    // Bespoke actions
    playInspect,
    playMintCert,
    playBookmark,
    playEpochShift,
    playScannerBeam,
    playCaliperMeasure,
    // Ambient controls
    startAmbient,
    setAmbientEpoch,
    stopAmbient,
    unlockAudio,
    modulateAmbientWithCursor,
  };
}
