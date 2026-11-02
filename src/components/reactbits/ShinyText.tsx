'use client';

import React from 'react';

export interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  shimmerColor?: string;
}

/**
 * ShinyText from React Bits (https://reactbits.dev/)
 * Subtle shimmering light beam sweeping across text.
 */
export function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
  shimmerColor = 'rgba(255, 212, 0, 0.85)',
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block relative overflow-hidden bg-clip-text ${
        disabled ? '' : 'animate-shimmer'
      } ${className}`}
      style={{
        backgroundImage: disabled
          ? 'none'
          : `linear-gradient(120deg, currentColor 0%, currentColor 38%, ${shimmerColor} 50%, currentColor 62%, currentColor 100%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration,
      }}
    >
      {text}
    </span>
  );
}
export default ShinyText;
