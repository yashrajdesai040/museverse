'use client';

import React from 'react';

/**
 * Lightweight Archival Film Atmosphere Overlay
 * Pure CSS with zero expensive SVG feTurbulence calculation per frame.
 * Eliminates GPU rasterization lag while maintaining archival depth.
 */
export function FilmGrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9985] overflow-hidden select-none"
    >
      {/* Subtle Archival Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/10 pointer-events-none" />
    </div>
  );
}
