'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { useEvolutionStore } from '@/stores/useEvolutionStore';

export function useEvolutionScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const setScrollProgress = useEvolutionStore((s) => s.setScrollProgress);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=500%',
      pin: true,
      scrub: 1.5,
      onUpdate: (self) => setScrollProgress(self.progress),
    });
  }, { scope: containerRef, dependencies: [setScrollProgress] });

  return containerRef;
}
