'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  maxAngle?: number;
  scale?: number;
  perspective?: number;
  glare?: boolean;
}

/**
 * TiltedCard from React Bits (https://reactbits.dev/)
 * Physical 3D tilt card with spring dampening on hover.
 * Zero-Reflow / Zero-Rerender: Directly mutates CSS variables on pointermove without layout thrashing.
 */
export function TiltedCard({
  children,
  className = '',
  maxAngle = 10,
  scale = 1.02,
  perspective = 1000,
  glare = true,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxAngle, -maxAngle]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxAngle, maxAngle]), springConfig);
  const cardScale = useSpring(1, springConfig);

  const [glareOpacity, setGlareOpacity] = useState(0);

  const handleMouseEnter = useCallback(() => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    cardScale.set(scale);
    if (glare) setGlareOpacity(0.15);
  }, [cardScale, scale, glare]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current && ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    if (!rect) return;

    const width = rect.width;
    const height = rect.height;
    if (width <= 0 || height <= 0) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    if (glare && glareRef.current) {
      const gx = (mouseX / width) * 100;
      const gy = (mouseY / height) * 100;
      glareRef.current.style.setProperty('--gx', `${gx}%`);
      glareRef.current.style.setProperty('--gy', `${gy}%`);
    }
  }, [x, y, glare]);

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null;
    cardScale.set(1);
    x.set(0);
    y.set(0);
    if (glare) setGlareOpacity(0);
  }, [cardScale, x, y, glare]);

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className="inline-block"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale: cardScale,
          transformStyle: 'preserve-3d',
        }}
        className={`relative ${className}`}
      >
        {children}

        {glare && (
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-none overflow-hidden"
            style={{
              opacity: glareOpacity,
              background: `radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 70%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

export default TiltedCard;
