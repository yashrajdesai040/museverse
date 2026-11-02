'use client';

import { useEffect, useRef } from 'react';

/**
 * useGyroscope
 * Maps DeviceOrientation beta/gamma to a camera offset ref.
 * Pass the returned offsetRef into your R3F useFrame camera lerp.
 */
export function useGyroscope() {
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('DeviceOrientationEvent' in window)) return;

    // iOS 13+ requires permission
    const requestPerm = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const perm = await (DeviceOrientationEvent as any).requestPermission();
          if (perm !== 'granted') return;
        } catch {
          return;
        }
      }
      window.addEventListener('deviceorientation', handleOrientation);
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      // beta: front-back tilt (-90 to 90), gamma: left-right tilt (-90 to 90)
      offsetRef.current = {
        x: (e.gamma / 90) * 0.3,   // ±0.3 units horizontal
        y: (e.beta / 90) * 0.2,    // ±0.2 units vertical
      };
    };

    requestPerm();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return offsetRef;
}
