'use client';

import React from 'react';
import { useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';

export function MuseumPerformance({ isMobile = false }: { isMobile?: boolean }) {
  const setDpr = useThree((state) => state.setDpr);

  return (
    <PerformanceMonitor
      flipflops={2}
      onDecline={() => {
        setDpr(isMobile ? 0.85 : 1);
      }}
      onIncline={() => {
        setDpr(isMobile ? 1 : 1.25);
      }}
    />
  );
}

export default MuseumPerformance;
