'use client';

import React, { useRef, useEffect } from 'react';
import { animate, spring } from 'animejs';
import { gsap } from '@/lib/gsap';
import { useLoginStore } from '@/stores/useLoginStore';
import { useLoginAudio } from '@/hooks/useLoginAudio';
import { AnimatedCheckIcon } from './LoginIcons';

/* ═══════════════════════════════════════════════════════
   BRUTALIST AUTH RESULT — Scene 5A & 5B
   Full-screen stamp overlays rendered ABOVE the ticket card.
   
   Stamps are flex-centered in a fixed full-screen container
   so they always appear dead-center on screen regardless
   of ticket card transforms (scaleY, shake, etc.).
   ═══════════════════════════════════════════════════════ */

export default function AuthResult() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const laserRef = useRef<HTMLDivElement>(null);
  const deniedRef = useRef<HTMLDivElement>(null);

  const scene = useLoginStore((s) => s.scene);
  const reducedMotion = useLoginStore((s) => s.reducedMotion);
  const { playStamp, playDenied: playDeniedSound } = useLoginAudio();

  // ── SUCCESS: Metallic Gold Stamp + Full-screen golden glow ──
  useEffect(() => {
    if (scene !== 'SUCCESS' || !sealRef.current || !glowRef.current) return;

    playStamp();

    // Golden screen glow pulse
    const glowTl = gsap.timeline();
    glowTl.to(glowRef.current, {
      opacity: 0.6,
      duration: 0.3,
      ease: 'power2.out',
    });
    glowTl.to(glowRef.current, {
      opacity: 0,
      duration: 1.2,
      delay: 1.5,
      ease: 'power1.in',
    });

    // Stamp slam animation — fast, punchy tactile impact
    const anim = animate(sealRef.current, {
      opacity: [0, 1],
      scale: [2.2, 1],
      rotate: [-12, -2],
      duration: reducedMotion ? 150 : 350,
      ease: reducedMotion ? 'outQuad' : spring({ stiffness: 260, damping: 14, mass: 1.1 }),
    });

    // Fade out stamp after 2s
    const fadeTimer = setTimeout(() => {
      if (sealRef.current) {
        gsap.to(sealRef.current, { opacity: 0, scale: 0.8, duration: 0.5, ease: 'power2.in' });
      }
    }, 2200);

    return () => {
      anim.pause();
      glowTl.kill();
      clearTimeout(fadeTimer);
    };
  }, [scene, reducedMotion, playStamp]);

  // ── DENIED: Laser scan + Red stamp slam ──
  useEffect(() => {
    if (scene !== 'DENIED' || !laserRef.current || !deniedRef.current) return;

    playDeniedSound();

    const tl = gsap.timeline();

    // Laser scan line sweeps top to bottom
    tl.set(laserRef.current, { opacity: 1, top: '0%' });
    tl.to(laserRef.current, {
      top: '100%',
      duration: reducedMotion ? 0.2 : 0.5,
      ease: 'power1.inOut',
    });
    tl.to(laserRef.current, { opacity: 0, duration: 0.1 });

    // Denied stamp slams in after laser
    const animDenied = animate(deniedRef.current, {
      opacity: [0, 1],
      scale: [2.8, 1],
      rotate: [-12, -3],
      delay: reducedMotion ? 100 : 400,
      duration: reducedMotion ? 200 : 700,
      ease: reducedMotion ? 'outQuad' : spring({ stiffness: 200, damping: 12, mass: 1.3 }),
    });

    // Shake the denied stamp
    const shakeTimer = setTimeout(() => {
      if (deniedRef.current) {
        gsap.to(deniedRef.current, {
          keyframes: [
            { x: -6, duration: 0.04 },
            { x: 6, duration: 0.04 },
            { x: -4, duration: 0.04 },
            { x: 4, duration: 0.04 },
            { x: 0, duration: 0.04 },
          ],
          ease: 'none',
        });
      }
    }, 900);

    // Fade out denied stamp
    const fadeTimer = setTimeout(() => {
      if (deniedRef.current) {
        gsap.to(deniedRef.current, { opacity: 0, scale: 0.85, duration: 0.4, ease: 'power2.in' });
      }
    }, 2000);

    return () => {
      tl.kill();
      animDenied.pause();
      clearTimeout(shakeTimer);
      clearTimeout(fadeTimer);
    };
  }, [scene, reducedMotion, playDeniedSound]);

  // Reset state when returning to LOGIN_FORM
  useEffect(() => {
    if (scene === 'LOGIN_FORM') {
      [sealRef, deniedRef].forEach((ref) => {
        if (ref.current) gsap.set(ref.current, { opacity: 0, scale: 2.5, rotation: -12 });
      });
      if (laserRef.current) gsap.set(laserRef.current, { opacity: 0, top: '0%' });
      if (glowRef.current) gsap.set(glowRef.current, { opacity: 0 });
    }
  }, [scene]);

  const isVisible = scene === 'SUCCESS' || scene === 'DENIED' || scene === 'LOGIN_FORM';
  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Screen Reader Announcement */}
      <div className="sr-only" aria-live="assertive" role="alert">
        {scene === 'SUCCESS' && 'Authentication successful. Access Granted.'}
        {scene === 'DENIED' && 'Access Denied. Invalid email or password.'}
      </div>

      {/* Full-screen golden glow flash on SUCCESS */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0.15) 50%, transparent 80%)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ✓ VERIFIED // ACCESS GRANTED — Metallic Gold Stamp */}
      <div
        ref={sealRef}
        style={{
          opacity: 0,
          background: 'linear-gradient(135deg, #fff9db 0%, #D4AF37 40%, #997a15 70%, #D4AF37 100%)',
          color: '#000000',
          border: '4px solid #000000',
          padding: '20px 36px',
          boxShadow: '0 0 60px rgba(212,175,55,0.9), 0 0 120px rgba(212,175,55,0.4), 8px 8px 0px #000000',
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'none' as const,
          position: 'absolute' as const,
        }}
      >
        <div className="flex items-center justify-center p-1">
          <AnimatedCheckIcon className="w-10 h-10 text-black stroke-[3.5]" />
        </div>
        <span style={{
          fontFamily: 'var(--font-outfit), Outfit, sans-serif',
          fontSize: '18px',
          fontWeight: 900,
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
        }}>
          VERIFIED // ACCESS GRANTED
        </span>
      </div>

      {/* Laser Scan Line */}
      <div
        ref={laserRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: '#e03131',
          boxShadow: '0 0 20px #e03131, 0 0 60px rgba(224,49,49,0.5)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ACCESS DENIED — Red Stamp */}
      <div
        ref={deniedRef}
        style={{
          opacity: 0,
          background: '#e03131',
          color: '#ffffff',
          fontFamily: 'var(--font-outfit), Outfit, sans-serif',
          fontSize: 'clamp(16px, 3.5vw, 26px)',
          fontWeight: 900,
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          border: '4px solid #000000',
          padding: '18px 36px',
          boxShadow: '0 0 40px rgba(224,49,49,0.7), 8px 8px 0px #000000',
          pointerEvents: 'none' as const,
          whiteSpace: 'nowrap' as const,
          textAlign: 'center' as const,
          position: 'absolute' as const,
        }}
      >
        ACCESS DENIED // INVALID CREDENTIAL
      </div>
    </div>
  );
}
