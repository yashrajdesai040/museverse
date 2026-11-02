'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import { useLoginStore } from '@/stores/useLoginStore';
import InkEffect from './InkEffect';
import {
  AnimatedCompassIcon,
  AnimatedArrowUpRightIcon,
  AnimatedArrowRightIcon,
  AnimatedBoltIcon,
} from './LoginIcons';

/* ═══════════════════════════════════════════════════════
   BRUTALIST ADMISSION LOGIN TICKET
   - Fast, instant authentication with zero artificial hold
   - Zero AI slop, zero experimental clutter
   - Distinct, elegant typography and tactile micro-interactions
   ═══════════════════════════════════════════════════════ */

export default function TicketCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const scene = useLoginStore((s) => s.scene);
  const email = useLoginStore((s) => s.email);
  const password = useLoginStore((s) => s.password);
  const rememberMe = useLoginStore((s) => s.rememberMe);
  const error = useLoginStore((s) => s.error);
  const setEmail = useLoginStore((s) => s.setEmail);
  const setPassword = useLoginStore((s) => s.setPassword);
  const setRememberMe = useLoginStore((s) => s.setRememberMe);
  const authenticateAsync = useLoginStore((s) => s.authenticateAsync);
  const authenticateGuestAsync = useLoginStore((s) => s.authenticateGuestAsync);
  const autoFillDemo = useLoginStore((s) => s.autoFillDemo);
  const setScene = useLoginStore((s) => s.setScene);
  const reducedMotion = useLoginStore((s) => s.reducedMotion);
  const hydrateRememberMe = useLoginStore((s) => s.hydrateRememberMe);

  const [isLoading, setIsLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(false);

  // Hydrate Remember Me email from storage on mount
  useEffect(() => {
    hydrateRememberMe();
  }, [hydrateRememberMe]);

  // 3D Mouse Parallax & Paper Tilt Physics
  useEffect(() => {
    if (reducedMotion || !cardRef.current) return;

    const card = cardRef.current;
    const xTo = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power1.out' });
    const yTo = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power1.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const mouseX = (e.clientX / innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / innerHeight - 0.5) * 2;
      xTo(mouseX * 6);
      yTo(-mouseY * 6);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reducedMotion]);

  // Smooth entrance
  useEffect(() => {
    if (!cardRef.current) return;
    cardRef.current.classList.add('visible');

    if (!reducedMotion) {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.97, y: 10, opacity: 0.8 },
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [reducedMotion]);

  // Fast Instant Sign In Handler (no artificial preload gates)
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading) return;

      setIsLoading(true);
      setScene('VERIFYING');

      const success = await authenticateAsync();
      setIsLoading(false);
      setScene(success ? 'SUCCESS' : 'DENIED');
    },
    [isLoading, authenticateAsync, setScene]
  );

  // Instant Guest Visitor Admission Handler
  const handleGuestAdmission = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setScene('VERIFYING');

    const success = await authenticateGuestAsync();
    setIsLoading(false);
    setScene(success ? 'SUCCESS' : 'DENIED');
  }, [isLoading, authenticateGuestAsync, setScene]);

  // Success animation
  useEffect(() => {
    if (scene !== 'SUCCESS' || !cardRef.current) return;

    const tl = gsap.timeline();
    tl.to(cardRef.current, {
      boxShadow: '0 0 50px rgba(212, 175, 55, 0.95), 12px 12px 0px #000000',
      duration: 0.25,
      ease: 'power2.out',
    });
    tl.to(
      cardRef.current,
      {
        scaleY: 0.9,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      },
      '+=0.1'
    );

    return () => {
      tl.kill();
    };
  }, [scene]);

  // Denied animation (quick shake and auto-reset)
  useEffect(() => {
    if (scene !== 'DENIED' || !cardRef.current) return;

    const tl = gsap.timeline();
    tl.to(cardRef.current, {
      delay: 0.05,
      keyframes: [
        { x: -8, duration: 0.04 },
        { x: 8, duration: 0.04 },
        { x: -6, duration: 0.04 },
        { x: 6, duration: 0.04 },
        { x: -3, duration: 0.04 },
        { x: 0, duration: 0.04 },
      ],
      ease: 'none',
    });
    tl.call(
      () => {
        useLoginStore.getState().reset();
      },
      [],
      '+=0.3'
    );

    return () => {
      tl.kill();
    };
  }, [scene]);

  const isDisabled = isLoading || scene === 'VERIFYING' || scene === 'SUCCESS';
  const isApproved = scene === 'SUCCESS';

  return (
    <div className="ticket-layer">
      <div
        ref={cardRef}
        className={`ticket-card visible ${isApproved ? 'approved' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Ticket Header: Pure Curatorial Identity */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2.5 mb-3">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              MUSEO CURATORIAL ARCHIVE
            </div>
            <div className="font-sans text-xl sm:text-2xl font-black uppercase tracking-tight text-black leading-none mt-0.5">
              ADMISSION PASS
            </div>
          </div>
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-black bg-white shadow-[1px_1px_0px_#000]">
            EST. 4.6 GA
          </span>
        </div>

        {/* Clean, Fast Authentication Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
          {/* Email Address Field */}
          <InkEffect
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="patron@museo.archive or email"
            label="EMAIL OR IDENTIFIER"
            autoFocus
          />

          {/* Password Field */}
          <InkEffect
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter password (e.g. museo2025)"
            label="ARCHIVAL PASSWORD"
          />

          {/* Remember Me & Demo Shortcut Row */}
          <div className="flex items-center justify-between pt-0.5 pb-0.5 font-mono text-[11px] font-bold uppercase">
            <label className="flex items-center gap-1.5 cursor-pointer select-none group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 bg-white border-2 border-black peer-checked:bg-[#ffd700] peer-checked:border-black flex items-center justify-center transition-all shadow-[1px_1px_0px_#000]">
                  {rememberMe && (
                    <svg className="w-3 h-3 text-black stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-black group-hover:underline">Remember Me</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setForgotMsg(true);
                autoFillDemo();
                setTimeout(() => setForgotMsg(false), 3500);
              }}
              className="text-neutral-700 underline hover:text-black transition-colors cursor-pointer"
            >
              Demo Account?
            </button>
          </div>

          {/* Demo Hint Notification */}
          {forgotMsg && (
            <div className="p-2 bg-[#ffd700] text-black border-2 border-black font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0px_#000]">
              Demo credentials filled: yashrajdesai044@gmail.com / museo2025
            </div>
          )}

          {/* Primary Sign In Button */}
          <button
            type="submit"
            className="ticket-enter-btn flex items-center justify-center gap-2 mt-2"
            disabled={isDisabled}
            style={{
              opacity: isDisabled ? 0.75 : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>VERIFYING PASS...</span>
              </>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>ENTER MUSEUM</span>
                <AnimatedArrowUpRightIcon className="w-4 h-4" />
              </span>
            )}
          </button>

          {/* Error Message */}
          {error && scene === 'DENIED' && (
            <div className="p-2 bg-red-600 text-white border-2 border-black font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0px_#000]">
              {error}
            </div>
          )}

          {/* Guest Admission and Public Exhibit */}
          <div className="pt-2 border-t border-neutral-300 flex items-center justify-between font-mono text-[10px]">
            <button
              type="button"
              onClick={handleGuestAdmission}
              disabled={isDisabled}
              className="text-neutral-800 hover:text-black font-bold uppercase underline hover:no-underline flex items-center gap-1.5 cursor-pointer group"
            >
              <AnimatedCompassIcon className="w-3.5 h-3.5 text-black" />
              <span>Guest Pass</span>
              <AnimatedArrowRightIcon className="w-3 h-3 text-black" />
            </button>
            <Link
              href="/museum"
              className="text-neutral-500 hover:text-black font-bold uppercase transition-colors flex items-center gap-1 group"
            >
              <span>Explore Gallery</span>
              <AnimatedArrowUpRightIcon className="w-3 h-3 text-neutral-500 group-hover:text-black" />
            </Link>
          </div>
        </form>

        {/* Perforation edge */}
        <div className="ticket-perforation" />

        {/* Burn overlay */}
        <div
          className="ticket-burn-overlay"
          style={{ opacity: scene === 'DENIED' ? 1 : 0, transition: 'opacity 0.3s 0.8s' }}
        />
      </div>
    </div>
  );
}
