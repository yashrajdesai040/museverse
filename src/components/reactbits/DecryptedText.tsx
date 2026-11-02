'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover';
}

/**
 * DecryptedText from React Bits (https://reactbits.dev/)
 * Archival letter-by-letter decryption scramble effect.
 */
export function DecryptedText({
  text,
  speed = 45,
  maxIterations = 12,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&*[]//_<>~',
  className = '',
  encryptedClassName = 'text-[#FFD400]',
  parentClassName = '',
  animateOn = 'view',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter((char) => char !== ' ')
      : characters.split('');
  }, [text, useOriginalCharsOnly, characters]);

  const shuffleText = useCallback(
    (originalText: string, currentRevealed: Set<number>) => {
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
          return randomChar || char;
        })
        .join('');
    },
    [availableChars]
  );

  const getNextIndex = useCallback(
    (revealedSet: Set<number>, length: number): number => {
      const remaining: number[] = [];
      for (let i = 0; i < length; i++) {
        if (!revealedSet.has(i)) remaining.push(i);
      }
      if (remaining.length === 0) return -1;

      switch (revealDirection) {
        case 'start':
          return remaining[0];
        case 'end':
          return remaining[remaining.length - 1];
        case 'center': {
          const middle = Math.floor(length / 2);
          return remaining.reduce((closest, curr) =>
            Math.abs(curr - middle) < Math.abs(closest - middle) ? curr : closest
          );
        }
        default:
          return remaining[0];
      }
    },
    [revealDirection]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentIteration = 0;

    const startAnimation = () => {
      setIsScrambling(true);
      currentIteration = 0;
      const currentRevealed = new Set<number>();

      interval = setInterval(() => {
        if (sequential) {
          if (currentRevealed.size < text.length) {
            const nextIndex = getNextIndex(currentRevealed, text.length);
            if (nextIndex !== -1) {
              currentRevealed.add(nextIndex);
              setRevealedIndices(new Set(currentRevealed));
            }
            setDisplayText(shuffleText(text, currentRevealed));
          } else {
            clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(text);
          }
        } else {
          setDisplayText(shuffleText(text, currentRevealed));
          currentIteration++;
          if (currentIteration >= maxIterations) {
            clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(text);
          }
        }
      }, speed);
    };

    if (animateOn === 'view' && !hasAnimated) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              setHasAnimated(true);
              startAnimation();
            }
          });
        },
        { threshold: 0.1 }
      );

      const current = containerRef.current;
      if (current) observer.observe(current);
      return () => {
        if (current) observer.unobserve(current);
        clearInterval(interval);
      };
    } else if (animateOn === 'hover' && isHovering) {
      startAnimation();
      return () => clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    shuffleText,
    getNextIndex,
    animateOn,
    hasAnimated,
    isHovering,
  ]);

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      onMouseEnter={() => animateOn === 'hover' && setIsHovering(true)}
      onMouseLeave={() => animateOn === 'hover' && setIsHovering(false)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || !isScrambling;
          return (
            <span
              key={index}
              className={isRevealedOrDone ? className : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
export default DecryptedText;
