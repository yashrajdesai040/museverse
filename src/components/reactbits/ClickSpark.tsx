'use client';

import React, { useRef, useState, useCallback } from 'react';

export interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  className?: string;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

/**
 * ClickSpark from React Bits (https://reactbits.dev/)
 * Radiates geometric spark particles outward upon user interaction.
 * Performance optimized: Canvas mounts ONLY on active click and automatically unmounts when idle.
 */
export function ClickSpark({
  children,
  sparkColor = '#FFD400',
  sparkSize = 8,
  sparkRadius = 24,
  sparkCount = 8,
  duration = 380,
  className = '',
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const [isSparking, setIsSparking] = useState(false);

  const animate = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = time - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const ease = 1 - Math.pow(1 - progress, 3);
        const distance = ease * sparkRadius;
        const lineLength = sparkSize * (1 - ease);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      if (sparksRef.current.length > 0) {
        requestAnimationFrame(animate);
      } else {
        setIsSparking(false);
      }
    },
    [duration, sparkRadius, sparkSize, sparkColor]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const now = performance.now();
      const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }));

      sparksRef.current.push(...newSparks);
      setIsSparking(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(animate);
      });
    },
    [animate, sparkCount]
  );

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative inline-block ${className}`}
    >
      {isSparking && (
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="pointer-events-none absolute inset-0 w-full h-full z-30"
        />
      )}
      {children}
    </div>
  );
}

export default ClickSpark;
