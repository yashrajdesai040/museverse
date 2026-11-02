'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';

export interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  className?: string;
  onClick?: () => void;
}

/**
 * Magnet from React Bits (https://reactbits.dev/)
 * Spring-based magnetic attraction toward cursor for buttons and badges.
 */
export function Magnet({
  children,
  padding = 50,
  disabled = false,
  magnetStrength = 0.35,
  className = '',
  onClick,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !ref.current) return;
      if (!rectRef.current) {
        rectRef.current = ref.current.getBoundingClientRect();
      }
      const { left, top, width, height } = rectRef.current;
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        x.set((e.clientX - centerX) * magnetStrength);
        y.set((e.clientY - centerY) * magnetStrength);
      } else {
        x.set(0);
        y.set(0);
      }
    },
    [disabled, padding, magnetStrength, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null;
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x, y }}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
export default Magnet;
