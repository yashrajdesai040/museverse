'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useLoginStore, type LoginScene } from '@/stores/useLoginStore';

/* ═══════════════════════════════════════════════════════
   CANVAS 2D PARTICLE ENGINE
   Modes: ambient dust, golden ticket trail, keystroke burst
   FPS monitoring with auto-downgrade for performance.
   ═══════════════════════════════════════════════════════ */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  type: 'dust' | 'golden' | 'burst';
}

// Colors for different particle types
const DUST_COLORS = [
  'rgba(255,235,180,', // warm ivory
  'rgba(255,220,150,', // golden
  'rgba(200,200,220,', // cool white
];

const GOLDEN_COLORS = [
  'rgba(255,215,0,',
  'rgba(255,195,50,',
  'rgba(212,175,55,',
];

// Scenes where ambient dust is active
const DUST_SCENES: LoginScene[] = ['ARRIVAL', 'APPROACH', 'TICKET_PRINT', 'LOGIN_FORM', 'VERIFYING', 'SUCCESS', 'DENIED'];

export default function DustParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const fpsRef = useRef({ frames: 0, last: 0, fps: 60 });
  const maxParticlesRef = useRef(80);
  const sceneRef = useRef<LoginScene>('ARRIVAL');
  const reducedMotionRef = useRef(false);

  // Subscribe to scene changes
  useEffect(() => {
    const unsub = useLoginStore.subscribe((s) => {
      sceneRef.current = s.scene;
      reducedMotionRef.current = s.reducedMotion;
    });
    // Initial sync
    sceneRef.current = useLoginStore.getState().scene;
    reducedMotionRef.current = useLoginStore.getState().reducedMotion;
    return unsub;
  }, []);

  // Spawn a single ambient dust particle
  const spawnDust = useCallback((w: number, h: number): Particle => {
    const colorBase = DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)];
    const maxAlpha = 0.15 + Math.random() * 0.25;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.1 - Math.random() * 0.2, // drift upward
      size: 1 + Math.random() * 2.5,
      alpha: 0,
      maxAlpha,
      life: 0,
      maxLife: 200 + Math.random() * 300,
      color: colorBase,
      type: 'dust',
    };
  }, []);

  // Burst particles (for keystroke effects)
  const spawnBurst = useCallback((x: number, y: number): Particle[] => {
    const count = 4 + Math.floor(Math.random() * 4);
    const out: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2;
      const colorBase = GOLDEN_COLORS[Math.floor(Math.random() * GOLDEN_COLORS.length)];
      out.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2,
        alpha: 0.6 + Math.random() * 0.4,
        maxAlpha: 1,
        life: 0,
        maxLife: 30 + Math.random() * 30,
        color: colorBase,
        type: 'burst',
      });
    }
    return out;
  }, []);

  // Expose burst trigger globally for InkEffect
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__dustBurst = (x: number, y: number) => {
      const burst = spawnBurst(x, y);
      particlesRef.current.push(...burst);
    };
    return () => {
      delete (window as unknown as Record<string, unknown>).__dustBurst;
    };
  }, [spawnBurst]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handler using ResizeObserver for mobile orientation & container shifts
    const resize = () => {
      const parent = canvas.parentElement || document.body;
      const w = parent.clientWidth || window.innerWidth;
      const h = parent.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas.parentElement || document.body);

    // FPS monitoring — auto-downgrade particle count
    const monitorFPS = (now: number) => {
      fpsRef.current.frames++;
      if (now - fpsRef.current.last >= 1000) {
        fpsRef.current.fps = fpsRef.current.frames;
        fpsRef.current.frames = 0;
        fpsRef.current.last = now;

        // Auto-downgrade
        if (fpsRef.current.fps < 30) {
          maxParticlesRef.current = Math.max(20, maxParticlesRef.current - 10);
        } else if (fpsRef.current.fps > 55 && maxParticlesRef.current < 80) {
          maxParticlesRef.current = Math.min(80, maxParticlesRef.current + 5);
        }
      }
    };

    // Animation loop
    const animate = (now: number) => {
      rafRef.current = requestAnimationFrame(animate);
      monitorFPS(now);

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Skip particles if reduced motion
      if (reducedMotionRef.current) return;

      const scene = sceneRef.current;
      let dustCount = 0;
      const alive: Particle[] = [];
      for (const p of particlesRef.current) {
        p.life++;
        if (p.life >= p.maxLife) continue;

        if (p.type === 'dust') dustCount++;
        p.x += p.vx;
        p.y += p.vy;

        // Fade in/out
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) {
          p.alpha = p.maxAlpha * (lifeRatio / 0.1);
        } else if (lifeRatio > 0.7) {
          p.alpha = p.maxAlpha * (1 - (lifeRatio - 0.7) / 0.3);
        } else {
          p.alpha = p.maxAlpha;
        }

        // Wrap dust particles
        if (p.type === 'dust') {
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
        }

        // Slow down burst particles
        if (p.type === 'burst') {
          p.vx *= 0.95;
          p.vy *= 0.95;
        }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha.toFixed(3) + ')';
        ctx.fill();

        // Glow for golden/burst particles
        if (p.type !== 'dust' && p.alpha > 0.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color + (p.alpha * 0.15).toFixed(3) + ')';
          ctx.fill();
        }

        alive.push(p);
      }

      // Spawn ambient dust if below max
      if (DUST_SCENES.includes(scene) && dustCount < maxParticlesRef.current) {
        alive.push(spawnDust(w, h));
      }

      particlesRef.current = alive;
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [spawnDust]);

  return <canvas ref={canvasRef} className="dust-canvas" />;
}
