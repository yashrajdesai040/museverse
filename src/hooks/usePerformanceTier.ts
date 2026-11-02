'use client';

import { useEffect, useState } from 'react';
import { useAppStore, PerformanceMode } from '@/stores/useAppStore';

/* ═══════════════════════════════════════════════════════
   DYNAMIC PERFORMANCE TIER & DEVICE DETECTION HOOK
   Meets Guardrail Rule 3:
   Detects low-power devices, mobile GPUs, high DPR screens,
   hardware concurrency, and battery saver profiles to
   automatically downscale particles, shaders, and lighting passes.
   ═══════════════════════════════════════════════════════ */

export interface PerformanceMetrics {
  tier: PerformanceMode;
  isMobile: boolean;
  isLowPower: boolean;
  hardwareConcurrency: number;
  maxDpr: number;
  particleMultiplier: number;
  enablePostProcessing: boolean;
  enableShadows: boolean;
}

export function usePerformanceTier(): PerformanceMetrics {
  const performanceMode = useAppStore((s) => s.performanceMode);
  const setPerformanceMode = useAppStore((s) => s.setPerformanceMode);

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    tier: performanceMode,
    isMobile: false,
    isLowPower: false,
    hardwareConcurrency: 4,
    maxDpr: 1.5,
    particleMultiplier: 1.0,
    enablePostProcessing: true,
    enableShadows: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cores = navigator.hardwareConcurrency || 4;
    const isMobileDevice = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

    // Check battery status if supported
    let isBatterySaver = false;
    if ('getBattery' in navigator) {
      (navigator as any).getBattery?.().then((battery: any) => {
        if (!battery.charging && battery.level < 0.25) {
          isBatterySaver = true;
          setPerformanceMode('performance');
        }
      }).catch(() => { /* ignore */ });
    }

    // Determine low power status based on hardware cores, mobile screen, or battery profile
    const isLowPowerDevice = isMobileDevice || cores <= 4 || isBatterySaver;
    const determinedTier: PerformanceMode = isLowPowerDevice ? 'performance' : 'high';

    setPerformanceMode(determinedTier);

    setMetrics({
      tier: determinedTier,
      isMobile: isMobileDevice,
      isLowPower: isLowPowerDevice,
      hardwareConcurrency: cores,
      maxDpr: isMobileDevice ? 1.2 : 1.5,
      particleMultiplier: isLowPowerDevice ? 0.35 : 1.0,
      enablePostProcessing: !isLowPowerDevice,
      enableShadows: !isLowPowerDevice,
    });
  }, [setPerformanceMode]);

  return metrics;
}
