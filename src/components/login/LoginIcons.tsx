'use client';

import React from 'react';

/**
 * Animated Lightning Bolt Icon
 * Subtle pulse and energy glow, replacing raw '⚡' emoji
 */
export function AnimatedBoltIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={`${className} transition-transform duration-200 group-hover:scale-110`}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Animated Sound Toggle Icon
 * Replaces '🔊' and '🔇' emojis with clean interactive SVG sound waves
 */
export function AnimatedSoundToggle({
  soundEnabled,
  className = 'w-4 h-4',
}: {
  soundEnabled: boolean;
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-hidden="true">
      {soundEnabled ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          {/* Speaker body */}
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
          {/* Animated sound wave 1 */}
          <path
            d="M15.54 8.46a5 5 0 0 1 0 7.07"
            className="animate-pulse"
            style={{ animationDuration: '1.2s' }}
          />
          {/* Animated sound wave 2 */}
          <path
            d="M19.07 4.93a10 10 0 0 1 0 14.14"
            className="animate-pulse"
            style={{ animationDuration: '1.6s', animationDelay: '0.2s' }}
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full opacity-80"
        >
          {/* Speaker body */}
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
          {/* Mute slash */}
          <line x1="23" y1="9" x2="17" y2="15" strokeWidth="2.5" />
          <line x1="17" y1="9" x2="23" y2="15" strokeWidth="2.5" />
        </svg>
      )}
    </div>
  );
}

/**
 * Animated Compass Icon
 * Replaces '🧭' emoji with precision museum exploration needle
 */
export function AnimatedCompassIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={`${className} transition-transform duration-500 ease-out group-hover:rotate-45`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon
        points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Animated Return / Back Arrow Icon
 * Replaces '←' with clean SVG arrow that glides on hover
 */
export function AnimatedArrowLeftIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={`${className} transition-transform duration-200 group-hover:-translate-x-1`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

/**
 * Animated Up-Right Arrow Icon
 * Replaces '↗' with clean directional SVG
 */
export function AnimatedArrowUpRightIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={`${className} transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/**
 * Animated Right Arrow Icon
 * Replaces '→' with clean forward arrow
 */
export function AnimatedArrowRightIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={`${className} transition-transform duration-200 group-hover:translate-x-1`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/**
 * Animated Pen / Fill Icon
 * Replaces '✎' with sleek brutalist pencil
 */
export function AnimatedPenIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg
      className={`${className} transition-transform duration-200 group-hover:rotate-12`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

/**
 * Animated Checkmark Icon
 * Replaces '✓' with bold checkmark
 */
export function AnimatedCheckIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
