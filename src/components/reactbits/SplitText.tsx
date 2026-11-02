'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitBy?: 'words' | 'characters';
  textAlign?: 'left' | 'center' | 'right';
  stagger?: number;
}

/**
 * SplitText from React Bits (https://reactbits.dev/)
 * Fluid kinetic split text animation powered by Framer Motion.
 */
export function SplitText({
  text,
  className = '',
  delay = 0,
  duration = 0.5,
  splitBy = 'words',
  textAlign = 'left',
  stagger = 0.04,
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  const items = splitBy === 'words' ? text.split(' ') : text.split('');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1], // cinematic bezier
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`inline-flex flex-wrap ${
        textAlign === 'center'
          ? 'justify-center'
          : textAlign === 'right'
          ? 'justify-end'
          : 'justify-start'
      } ${className}`}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block whitespace-pre"
        >
          {item}
          {splitBy === 'words' && index < items.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.div>
  );
}
export default SplitText;
