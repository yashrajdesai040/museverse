'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { useLoginStore } from '@/stores/useLoginStore';

/* ═══════════════════════════════════════════════════════
   TICKET PRINTER — Scene 2→3
   A robotic ticket machine prints an admission pass.
   The ticket emerges, tears off, floats up, rotates,
   and stops center-screen before unfolding into the
   login form (TicketCard takes over from there).
   ═══════════════════════════════════════════════════════ */

export default function TicketPrinter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  const scene = useLoginStore((s) => s.scene);
  const reducedMotion = useLoginStore((s) => s.reducedMotion);

  useEffect(() => {
    if (scene !== 'TICKET_PRINT') return;
    if (!containerRef.current || !slotRef.current || !ticketRef.current || !lightRef.current) return;
    if (reducedMotion) {
      useLoginStore.getState().setScene('LOGIN_FORM');
      return;
    }

    const tl = gsap.timeline();

    // 1. Printer slot fades in
    tl.to(slotRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    });

    // 2. Printer light activates
    tl.call(() => lightRef.current?.classList.add('active'), [], '+=0.2');

    // 3. Ticket begins emerging (height grows)
    tl.to(ticketRef.current, {
      height: 120,
      opacity: 1,
      duration: 1.2,
      ease: 'power1.out',
    }, '+=0.3');

    // 4. Tear off — quick upward jolt
    tl.to(ticketRef.current, {
      y: -10,
      duration: 0.1,
      ease: 'power4.out',
    });

    // 5. Float up to center screen with rotation
    tl.to(ticketRef.current, {
      y: -(window.innerHeight * 0.3),
      x: 0,
      scale: 1.8,
      rotateY: 360,
      rotateX: 5,
      duration: 1.8,
      ease: 'power2.inOut',
    });

    // 6. Fade out the entire printer container
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.in',
    }, '-=0.5');

    // 7. Advance to LOGIN_FORM
    tl.call(() => {
      useLoginStore.getState().setScene('LOGIN_FORM');
    });

    return () => {
      tl.kill();
    };
  }, [scene, reducedMotion]);

  // Hide during non-ticket scenes
  const isVisible = scene === 'TICKET_PRINT';

  if (!isVisible && scene !== 'APPROACH') return null;

  return (
    <div
      ref={containerRef}
      className="printer-container"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Printer Slot */}
      <div ref={slotRef} className="printer-slot" style={{ opacity: 0 }}>
        <div className="printer-slot-opening" />
        <div ref={lightRef} className="printer-light" />
      </div>

      {/* Emerging Ticket */}
      <div
        ref={ticketRef}
        style={{
          position: 'absolute',
          bottom: 'calc(30vh + 40px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 0,
          opacity: 0,
          background: 'linear-gradient(170deg, #faf5e8 0%, #f0e8d0 100%)',
          border: '1px solid rgba(196, 164, 90, 0.3)',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Ticket preview content */}
        <div style={{
          padding: '12px 16px',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: '#8b7355',
            marginBottom: 4,
          }}>
            MUSEO
          </div>
          <div style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: 14,
            fontWeight: 900,
            letterSpacing: '0.1em',
            color: '#2a1810',
          }}>
            ADMIT ONE
          </div>
          {/* Barcode */}
          <div style={{
            marginTop: 8,
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
          }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: Math.random() > 0.5 ? 2 : 1,
                  height: 20,
                  background: '#2a1810',
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
