'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface AnimatedContentProps {
  children: React.ReactNode;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  config?: { tension?: number; friction?: number; mass?: number };
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * AnimatedContent from React Bits (https://reactbits.dev/)
 * Physics-based spring reveal animation with translation and blur.
 */
export function AnimatedContent({
  children,
  distance = 50,
  direction = 'vertical',
  reverse = false,
  config,
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  duration = 0.6,
  className = '',
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const offset = reverse ? -distance : distance;
  const initialX = direction === 'horizontal' ? offset : 0;
  const initialY = direction === 'vertical' ? offset : 0;

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: animateOpacity ? initialOpacity : 1,
        x: initialX,
        y: initialY,
        scale,
        filter: 'blur(4px)',
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
            }
          : undefined
      }
      transition={
        config
          ? {
              type: 'spring',
              stiffness: config.tension ?? 100,
              damping: config.friction ?? 15,
              mass: config.mass ?? 1,
              delay: delay > 10 ? delay / 1000 : delay,
            }
          : {
              type: 'spring',
              stiffness: 90,
              damping: 14,
              mass: 0.9,
              delay: delay > 10 ? delay / 1000 : delay,
              duration,
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedContent;
