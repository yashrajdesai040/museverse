'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { useLoginStore } from '@/stores/useLoginStore';

/* ═══════════════════════════════════════════════════════
   BRUTALIST MUSEUM FACADE — Scene 1 & 2
   Monolithic architectural facade matching MUSEO styling.
   Heavy dark metal structure, crisp yellow neon sign,
   black outlines, and rain-soaked entrance.
   ═══════════════════════════════════════════════════════ */

export default function MuseumFacade() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gateLeftRef = useRef<HTMLDivElement>(null);
  const gateRightRef = useRef<HTMLDivElement>(null);

  const scene = useLoginStore((s) => s.scene);
  const reducedMotion = useLoginStore((s) => s.reducedMotion);

  // Camera dolly on APPROACH / Reset on ARRIVAL
  useEffect(() => {
    if (!containerRef.current || reducedMotion) return;
    if (scene === 'APPROACH') {
      gsap.to(containerRef.current, {
        scale: 1.35,
        y: -20,
        duration: 2.2,
        ease: 'power1.inOut',
      });
    } else if (scene === 'ARRIVAL') {
      gsap.to(containerRef.current, {
        scale: 1,
        y: 0,
        filter: 'blur(0px) brightness(1)',
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }, [scene, reducedMotion]);

  // Blur facade when ticket appears
  useEffect(() => {
    if (!containerRef.current) return;
    const blurScenes = ['TICKET_PRINT', 'LOGIN_FORM', 'VERIFYING', 'SUCCESS', 'DENIED'];
    if (blurScenes.includes(scene)) {
      gsap.to(containerRef.current, {
        filter: 'blur(8px) brightness(0.4)',
        duration: 1.2,
        ease: 'power2.out',
      });
    }
  }, [scene]);

  // Gate animations
  useEffect(() => {
    if (!gateLeftRef.current || !gateRightRef.current) return;

    if (scene === 'SUCCESS') {
      gsap.to(gateLeftRef.current, {
        x: '-105%',
        duration: 1.8,
        delay: 1.2,
        ease: 'power2.inOut',
      });
      gsap.to(gateRightRef.current, {
        x: '105%',
        duration: 1.8,
        delay: 1.2,
        ease: 'power2.inOut',
      });
    } else if (scene === 'DENIED') {
      gsap.to(gateLeftRef.current, {
        x: '0%',
        duration: 0.2,
        ease: 'power4.in',
      });
      gsap.to(gateRightRef.current, {
        x: '0%',
        duration: 0.2,
        ease: 'power4.in',
      });
    }
  }, [scene]);

  return (
    <div className="facade-container" ref={containerRef}>
      {/* Sky */}
      <div className="facade-sky">
        <div className="facade-stars" />
      </div>

      {/* Building */}
      <div className="facade-building">
        <div className="facade-pediment" />
        <div className="facade-cornice" />

        {/* Windows */}
        <div className="facade-windows">
          <div className="facade-window" />
          <div className="facade-window" />
          <div className="facade-window" />
        </div>

        {/* Entrance */}
        <div className="facade-entrance">
          <div className="facade-entrance-glow" />
          <div className="facade-entrance-arch" />
          {/* Gate panels */}
          <div ref={gateLeftRef} className="facade-gate-panel facade-gate-left" />
          <div ref={gateRightRef} className="facade-gate-panel facade-gate-right" />
        </div>
      </div>

      {/* Outer Pillars */}
      <div className="facade-pillar facade-pillar-left" />
      <div className="facade-pillar facade-pillar-right" />

      {/* Inner Pillars */}
      <div className="facade-pillar facade-pillar-inner left" />
      <div className="facade-pillar facade-pillar-inner right" />

      {/* Steps */}
      <div className="facade-steps" />

      {/* Floor */}
      <div className="facade-floor" />

      {/* Rain */}
      <div className="facade-rain">
        <div className="facade-rain-layer" />
        <div className="facade-rain-layer-2" />
      </div>

      {/* Fog */}
      <div className="facade-fog-bottom" />

      {/* Brutalist Sign */}
      <div className="facade-sign">
        <div className="facade-sign-badge">MUSEO ARCHIVE</div>
        <div className="facade-sign-text">MUSEO</div>
      </div>
    </div>
  );
}
