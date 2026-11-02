'use client';

import React, { useRef, useEffect, useCallback } from 'react';

export interface SquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  className?: string;
}

/**
 * High-Performance Squares (React Bits optimized)
 * - Base grid rendered via 0-overhead GPU composited CSS pattern.
 * - Interactive hover cell lights up with smooth fade-out.
 * - ZERO continuous requestAnimationFrame loops when idle.
 */
export function Squares({
  squareSize = 48,
  borderColor = 'rgba(14, 14, 14, 0.05)',
  hoverFillColor = 'rgba(255, 212, 0, 0.25)',
  className = '',
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef<{ x: number; y: number; opacity: number } | null>(null);
  const isAnimatingRef = useRef(false);

  const drawHover = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (hoverRef.current && hoverRef.current.opacity > 0.01) {
      const { x, y, opacity } = hoverRef.current;
      const cellX = Math.floor(x / squareSize) * squareSize;
      const cellY = Math.floor(y / squareSize) * squareSize;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = hoverFillColor;
      ctx.fillRect(cellX, cellY, squareSize, squareSize);
      ctx.restore();

      // Soft decay
      hoverRef.current.opacity *= 0.92;
      requestAnimationFrame(drawHover);
    } else {
      hoverRef.current = null;
      isAnimatingRef.current = false;
    }
  }, [squareSize, hoverFillColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, []);

  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (canvasRef.current) {
      rectRef.current = canvasRef.current.getBoundingClientRect();
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (!rectRef.current) {
        rectRef.current = canvas.getBoundingClientRect();
      }
      const rect = rectRef.current;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      hoverRef.current = { x, y, opacity: 1 };

      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        requestAnimationFrame(drawHover);
      }
    },
    [drawHover]
  );

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null;
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`absolute inset-0 pointer-events-auto overflow-hidden select-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, ${borderColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${borderColor} 1px, transparent 1px)
        `,
        backgroundSize: `${squareSize}px ${squareSize}px`,
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}

export default Squares;
