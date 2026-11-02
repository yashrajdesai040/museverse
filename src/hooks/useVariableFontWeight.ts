'use client';

import { useEffect } from 'react';

/**
 * useVariableFontWeight
 * Sets optimal static font-weight for museum typography.
 * Wheel reflow listeners removed to guarantee zero layout thrashing on scroll.
 */
export function useVariableFontWeight() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.style.setProperty('--scroll-font-weight', '700');
  }, []);
}
