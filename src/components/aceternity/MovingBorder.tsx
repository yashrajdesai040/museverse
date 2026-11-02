'use client';

import React, { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'framer-motion';

export interface MovingBorderProps {
  children?: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  className?: string;
}

export function MovingBorder({
  children,
  duration = 3500,
  rx = '0',
  ry = '0',
  className = '',
}: MovingBorderProps) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMs = length / duration;
      progress.set((time * pxPerMs) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y);

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <div className={`relative overflow-hidden p-[2px] ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'inline-block',
          transform,
        }}
      >
        <div className="h-12 w-12 bg-[radial-gradient(#FFD400_40%,transparent_60%)] opacity-90" />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default MovingBorder;
