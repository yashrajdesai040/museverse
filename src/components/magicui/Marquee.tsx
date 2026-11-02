'use client';

import React from 'react';

export interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  speed?: number; // seconds per cycle
}

/**
 * Marquee from Magic UI (https://magicui.design/)
 * Infinite scrolling marquee with hardware-accelerated CSS animations.
 */
export function Marquee({
  className = '',
  reverse = false,
  pauseOnHover = true,
  children,
  vertical = false,
  repeat = 4,
  speed = 30,
}: MarqueeProps) {
  return (
    <div
      className={`group flex overflow-hidden p-2 select-none [--gap:1.5rem] [gap:var(--gap)] ${
        vertical ? 'flex-col' : 'flex-row'
      } ${className}`}
      style={{
        ['--duration' as any]: `${speed}s`,
      }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={`flex shrink-0 justify-around [gap:var(--gap)] ${
            vertical
              ? 'animate-marquee-vertical flex-col'
              : 'animate-marquee flex-row'
          } ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''} ${
            reverse ? '[animation-direction:reverse]' : ''
          }`}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

export default Marquee;
