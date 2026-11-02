'use client';

import React, { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from '@/lib/gsap';

interface BlockWipeTransitionProps {
  children: React.ReactNode;
}

export function BlockWipeTransition({ children }: BlockWipeTransitionProps) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const blockInkRef = useRef<HTMLDivElement>(null);
  const blockYellowRef = useRef<HTMLDivElement>(null);
  const blockPaperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only animate on actual route transitions, not initial page load
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    // Check reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ink = blockInkRef.current;
    const yellow = blockYellowRef.current;
    const paper = blockPaperRef.current;

    if (!ink || !yellow || !paper) return;

    // Reset styles and prepare blocks
    gsap.set([ink, yellow, paper], {
      display: 'block',
      scaleX: 0,
      transformOrigin: 'left center',
    });

    // Neo-brutalist 3-block wipe sequence: fast & crisp (total ~450ms)
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set([ink, yellow, paper], {
          display: 'none',
          scaleX: 0,
          clearProps: 'transform',
        });
      },
    });

    // Wipe in from left
    tl.to(ink, {
      scaleX: 1,
      duration: 0.18,
      ease: 'power3.in',
    })
      .to(
        yellow,
        {
          scaleX: 1,
          duration: 0.18,
          ease: 'power3.in',
        },
        '-=0.1'
      )
      .to(
        paper,
        {
          scaleX: 1,
          duration: 0.18,
          ease: 'power3.in',
        },
        '-=0.1'
      )
      // Flip transform origin to right for wipe-out
      .set([ink, yellow, paper], {
        transformOrigin: 'right center',
      })
      // Wipe out towards right
      .to(paper, {
        scaleX: 0,
        duration: 0.22,
        ease: 'power3.out',
      })
      .to(
        yellow,
        {
          scaleX: 0,
          duration: 0.22,
          ease: 'power3.out',
        },
        '-=0.14'
      )
      .to(
        ink,
        {
          scaleX: 0,
          duration: 0.22,
          ease: 'power3.out',
        },
        '-=0.14'
      );

    return () => {
      tl.kill();
      // GUARANTEE: Never leave a white or colored block stuck covering the screen
      gsap.set([ink, yellow, paper], {
        display: 'none',
        scaleX: 0,
        clearProps: 'transform',
      });
    };
  }, [pathname]);

  return (
    <div className="relative w-full min-h-screen">
      {/* ── Hard-Edged Block Wipe Layers ── */}
      <div
        ref={blockInkRef}
        aria-hidden="true"
        className="fixed inset-0 z-[999990] bg-[#0E0E0E] pointer-events-none hidden border-r-4 border-[#0E0E0E]"
      />
      <div
        ref={blockYellowRef}
        aria-hidden="true"
        className="fixed inset-0 z-[999991] bg-[#FFD400] pointer-events-none hidden border-r-4 border-[#0E0E0E]"
      />
      <div
        ref={blockPaperRef}
        aria-hidden="true"
        className="fixed inset-0 z-[999992] bg-[#F2EDE4] pointer-events-none hidden border-r-4 border-[#0E0E0E]"
      />

      {/* ── Route Content ── */}
      {children}
    </div>
  );
}
