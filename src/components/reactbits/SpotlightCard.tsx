'use client';

import React, { useRef, useState, useCallback } from 'react';

export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * SpotlightCard from React Bits (https://reactbits.dev/)
 * Archival card with dynamic cursor-following spotlight glow.
 * Zero-Reflow / Zero-Rerender: Directly mutates CSS variables on pointermove without layout thrashing.
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 212, 0, 0.12)',
  onClick,
  onMouseEnter,
  onMouseLeave,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [opacity, setOpacity] = useState(0);

  const handleMouseEnter = useCallback(() => {
    if (divRef.current) {
      rectRef.current = divRef.current.getBoundingClientRect();
    }
    setOpacity(0.85);
    onMouseEnter?.();
  }, [onMouseEnter]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current && divRef.current) {
      rectRef.current = divRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    if (!rect || !spotlightRef.current) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.setProperty('--sx', `${x}px`);
    spotlightRef.current.style.setProperty('--sy', `${y}px`);
  }, []);

  const handleFocus = useCallback(() => {
    if (divRef.current) {
      rectRef.current = divRef.current.getBoundingClientRect();
    }
    setOpacity(0.85);
  }, []);

  const handleBlur = useCallback(() => {
    setOpacity(0);
    rectRef.current = null;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
    rectRef.current = null;
    onMouseLeave?.();
  }, [onMouseLeave]);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out z-10"
        style={{
          opacity,
          background: `radial-gradient(450px circle at var(--sx, 0px) var(--sy, 0px), ${spotlightColor}, transparent 75%)`,
        }}
      />
      {children}
    </div>
  );
}

export default SpotlightCard;
