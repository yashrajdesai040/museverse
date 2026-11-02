'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { useLoginStore } from '@/stores/useLoginStore';
import { useLoginAudio } from '@/hooks/useLoginAudio';

/* ═══════════════════════════════════════════════════════
   BRUTALIST MUSEUM FLYTHROUGH — Scene 6
   Fast-forward through museum galleries with bold
   brutalist section headers (#000 background, 3px border,
   #ffd700 yellow offset shadows).
   ═══════════════════════════════════════════════════════ */

const SECTIONS = [
  { className: 'flythrough-hallway', label: '[ 01. GRAND HALLWAY ]' },
  { className: 'flythrough-sculptures', label: '[ 02. MARBLE SCULPTURES ]' },
  { className: 'flythrough-artifacts', label: '[ 03. ANCIENT ARTIFACTS ]' },
  { className: 'flythrough-holograms', label: '[ 04. DIGITAL HOLOGRAMS ]' },
  { className: 'flythrough-dinosaur', label: '[ 05. DINOSAUR WING ]' },
  { className: 'flythrough-egyptian', label: '[ 06. EGYPTIAN GALLERY ]' },
  { className: 'flythrough-space', label: '[ 07. SPACE EXHIBIT ]' },
  { className: 'flythrough-welcome', label: '[ 08. WELCOME TO MUSEO ]' },
];

interface MuseumFlythroughProps {
  onComplete: () => void;
}

export default function MuseumFlythrough({ onComplete }: MuseumFlythroughProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  const scene = useLoginStore((s) => s.scene);
  const reducedMotion = useLoginStore((s) => s.reducedMotion);
  const { playFootsteps, playGateOpen } = useLoginAudio();

  useEffect(() => {
    if (scene !== 'FLYTHROUGH') return;
    if (!containerRef.current || !trackRef.current || !blurRef.current) return;

    const totalHeight = SECTIONS.length * window.innerHeight * 0.5;

    playGateOpen();
    setTimeout(() => playFootsteps(), 400);

    if (reducedMotion) {
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          onComplete: () => {
            setTimeout(onComplete, 800);
          },
        },
      );
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 500);
      },
    });

    tl.set(containerRef.current, { opacity: 1 });

    tl.to(
      blurRef.current,
      {
        opacity: 0.7,
        duration: 0.5,
      },
      0,
    );

    tl.fromTo(
      trackRef.current,
      { y: 0 },
      {
        y: -totalHeight + window.innerHeight,
        duration: 3.2,
        ease: 'power2.in',
      },
      0,
    );

    tl.to(
      blurRef.current,
      {
        opacity: 0.95,
        duration: 1.0,
      },
      0.4,
    );

    tl.to(
      blurRef.current,
      {
        opacity: 0,
        duration: 0.8,
      },
      2.4,
    );

    tl.to(
      containerRef.current,
      {
        background: '#ffd700',
        duration: 0.4,
      },
      3.1,
    );

    return () => { tl.kill(); };
  }, [scene, reducedMotion, onComplete, playFootsteps, playGateOpen]);

  if (scene !== 'FLYTHROUGH' && scene !== 'SUCCESS') return null;

  return (
    <div
      ref={containerRef}
      className="flythrough-container"
      style={{ opacity: 0 }}
    >
      <div ref={trackRef} className="flythrough-track">
        {SECTIONS.map((section) => (
          <div
            key={section.className}
            className={`flythrough-section ${section.className}`}
          >
            <div className="flythrough-section-bg" />
            <span className="flythrough-section-label">{section.label}</span>
          </div>
        ))}
      </div>

      <div ref={blurRef} className="flythrough-blur" />
    </div>
  );
}
