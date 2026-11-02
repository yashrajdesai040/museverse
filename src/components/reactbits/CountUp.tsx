'use client';

import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, animate } from 'framer-motion';

export interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * CountUp from React Bits (https://reactbits.dev/)
 * High-speed chronometric numerical ticker.
 */
export function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  decimals = 0,
  prefix = '',
  suffix = '',
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const startVal = direction === 'down' ? to : from;
  const endVal = direction === 'down' ? from : to;

  const motionVal = useMotionValue(startVal);

  const formatNumber = (val: number) => {
    const formatted = val.toFixed(decimals);
    if (separator) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return parts.join('.');
    }
    return formatted;
  };

  useEffect(() => {
    if (isInView && startWhen) {
      onStart?.();
      const controls = animate(motionVal, endVal, {
        duration,
        delay,
        ease: 'easeOut',
        onComplete: onEnd,
      });

      return () => controls.stop();
    }
  }, [isInView, startWhen, endVal, duration, delay, motionVal, onStart, onEnd]);

  useEffect(() => {
    return motionVal.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${formatNumber(latest)}${suffix}`;
      }
    });
  }, [motionVal, decimals, separator, prefix, suffix]);

  return (
    <span ref={ref} className={`inline-block tabular-nums ${className}`}>
      {prefix}
      {formatNumber(startVal)}
      {suffix}
    </span>
  );
}

export default CountUp;
