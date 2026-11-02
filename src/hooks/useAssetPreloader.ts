'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getAssetPreloader,
  AssetPreloaderEngine,
  PreloadAsset,
  PreloaderProgress,
  LifecycleState,
} from '@/utils/assetPreloader';

export interface UseAssetPreloaderOptions {
  autoStartOnMount?: boolean;
  customManifest?: PreloadAsset[];
  maxHoldMs?: number;
}

export interface UseAssetPreloaderReturn {
  state: LifecycleState;
  progress: PreloaderProgress;
  isPreloading: boolean;
  isSynchronizing: boolean;
  isReadyToMount: boolean;
  tier1Complete: boolean;
  statusLabel: string;
  startPreload: () => void;
  syncAuthAndPreload: <T>(authPromise: Promise<T>) => Promise<{ authResult: T; preloaded: boolean; durationMs: number }>;
}

export function useAssetPreloader(options: UseAssetPreloaderOptions = {}): UseAssetPreloaderReturn {
  const { autoStartOnMount = true, customManifest, maxHoldMs = 1500 } = options;

  const preloaderRef = useRef<AssetPreloaderEngine>(getAssetPreloader(customManifest));
  const preloader = preloaderRef.current;

  const [progress, setProgress] = useState<PreloaderProgress>(() => preloader.getProgress());

  useEffect(() => {
    // Subscribe to asset engine progress updates
    const unsubscribe = preloader.onProgress((newProgress) => {
      setProgress(newProgress);
    });

    // Auto-start prefetching on Login Mount
    if (autoStartOnMount && preloader.getState() === 'IDLE_ON_LOGIN') {
      preloader.startOnLoginMount();
    }

    return () => {
      unsubscribe();
    };
  }, [preloader, autoStartOnMount]);

  const startPreload = useCallback(() => {
    preloader.startOnLoginMount();
  }, [preloader]);

  const syncAuthAndPreload = useCallback(
    async <T>(authPromise: Promise<T>) => {
      return await preloader.syncAuthAndPreload(authPromise, { maxHoldMs });
    },
    [preloader, maxHoldMs]
  );

  // Derive human-readable brutalist status label for micro-progress UI
  let statusLabel = 'STANDBY';
  switch (progress.state) {
    case 'IDLE_ON_LOGIN':
      statusLabel = 'INITIALIZING DEEP-TIME CACHE';
      break;
    case 'PREFETCHING_STATIC':
      statusLabel = progress.tier1Percent < 100
        ? `WARMING GPU TEXTURES [${progress.tier1Percent}%]`
        : `TIER 1 READY [${progress.tier1Loaded}/${progress.tier1Total}]`;
      break;
    case 'AUTH_AND_DECODE_SYNC':
      statusLabel = 'SYNCHRONIZING AUTH & DECODING DOM ASSETS';
      break;
    case 'READY_TO_MOUNT':
      statusLabel = 'ZERO-LAG TRANSITION READY';
      break;
  }

  const isPreloading = progress.state === 'PREFETCHING_STATIC';
  const isSynchronizing = progress.state === 'AUTH_AND_DECODE_SYNC';
  const isReadyToMount = progress.state === 'READY_TO_MOUNT';
  const tier1Complete = progress.tier1Percent >= 100;

  return {
    state: progress.state,
    progress,
    isPreloading,
    isSynchronizing,
    isReadyToMount,
    tier1Complete,
    statusLabel,
    startPreload,
    syncAuthAndPreload,
  };
}
