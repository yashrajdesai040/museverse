'use client';

import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
  wrap,
} from 'framer-motion';

export interface VelocityScrollProps {
  text: string;
  defaultVelocity?: number;
  className?: string;
}

interface ParallaxProps {
  children: string;
  baseVelocity: number;
  className?: string;
}

function ParallaxText({ children, baseVelocity = 100, className = '' }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="w-full overflow-hidden whitespace-nowrap flex flex-nowrap select-none">
      <motion.div className={`inline-flex whitespace-nowrap ${className}`} style={{ x }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="block mr-8">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function VelocityScroll({
  text,
  defaultVelocity = 3,
  className = '',
}: VelocityScrollProps) {
  return (
    <section className="relative w-full">
      <ParallaxText baseVelocity={defaultVelocity} className={className}>
        {text}
      </ParallaxText>
      <ParallaxText baseVelocity={-defaultVelocity} className={className}>
        {text}
      </ParallaxText>
    </section>
  );
}

export default VelocityScroll;
