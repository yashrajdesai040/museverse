'use client';

import React, { useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginStore } from '@/stores/useLoginStore';
import { useLoginAudio } from '@/hooks/useLoginAudio';
import { useAssetPreloader } from '@/hooks/useAssetPreloader';

import InteractiveChronoVitrine from '@/components/login/InteractiveChronoVitrine';
import TicketCard from '@/components/login/TicketCard';
import AuthResult from '@/components/login/AuthResult';
import {
  AnimatedArrowLeftIcon,
  AnimatedSoundToggle,
  AnimatedBoltIcon,
  AnimatedPenIcon,
} from '@/components/login/LoginIcons';
import './login.css';

/* ═══════════════════════════════════════════════════════
   THE LIVING MUSEUM LOGIN EXPERIENCE
   - Interactive 3D Chrono Vitrine background (drag to orbit, cursor tilt)
   - Zero AI slop, zero experimental clutter
   - Fast, instant authentication with zero artificial gatekeeping
   - Background asset preloading without blocking user entry
   ═══════════════════════════════════════════════════════ */

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo') || '/';

  const scene = useLoginStore((s) => s.scene);
  const reducedMotion = useLoginStore((s) => s.reducedMotion);
  const setReducedMotion = useLoginStore((s) => s.setReducedMotion);
  const soundEnabled = useLoginStore((s) => s.soundEnabled);
  const toggleSound = useLoginStore((s) => s.toggleSound);
  const autoFillDemo = useLoginStore((s) => s.autoFillDemo);
  const { playAmbience, dispose } = useLoginAudio();

  // Background Asset Preloader: silent GPU textures pre-warming in background
  useAssetPreloader({
    autoStartOnMount: true,
  });

  // Prefetch destination route immediately into Next.js router cache
  useEffect(() => {
    if (redirectTo) {
      router.prefetch(redirectTo);
    }
  }, [router, redirectTo]);

  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Guarantee scene is always directly at LOGIN_FORM on mount
  useEffect(() => {
    useLoginStore.getState().reset();
  }, []);

  // Detect reduced motion preference
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [setReducedMotion]);

  // Handle user interaction to unlock Web Audio context cleanly
  const handleUserInteraction = useCallback(() => {
    if (!audioUnlocked) {
      setAudioUnlocked(true);
      playAmbience();
    }
  }, [audioUnlocked, playAmbience]);

  // Unlock audio on initial user gesture
  useEffect(() => {
    if (audioUnlocked) return;
    const unlockOnGesture = () => {
      handleUserInteraction();
    };
    window.addEventListener('click', unlockOnGesture, { once: true });
    window.addEventListener('keydown', unlockOnGesture, { once: true });
    return () => {
      window.removeEventListener('click', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
    };
  }, [audioUnlocked, handleUserInteraction]);

  // Global Escape key listener: jump to destination if already authenticated
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && scene === 'SUCCESS') {
        router.push(redirectTo);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene, router, redirectTo]);

  // Instant snappy redirect upon authentication success
  useEffect(() => {
    if (scene === 'SUCCESS') {
      const timer = setTimeout(() => {
        router.push(redirectTo);
      }, reducedMotion ? 80 : 260);
      return () => clearTimeout(timer);
    }
  }, [scene, reducedMotion, router, redirectTo]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      dispose();
    };
  }, [dispose]);

  return (
    <div
      className="login-universe fixed inset-0 z-50 h-screen max-h-screen w-screen overflow-hidden flex flex-col justify-between items-center px-4 py-3 sm:py-4 select-none"
      onClick={handleUserInteraction}
    >
      {/* ── Layer 1: New Interactive 3D Deep-Time Chrono Vitrine Background ── */}
      <InteractiveChronoVitrine />

      {/* ── Layer 2: Auth Result Stamp Overlays ── */}
      <AuthResult />

      {/* ─── TOP NAVIGATION HEADER BAR (Clean, Non-colliding, Elevated) ─── */}
      <header className="relative z-30 flex items-center justify-between w-full max-w-xl mx-auto flex-shrink-0 gap-3">
        {/* Left: Return to Museum Gallery */}
        <Link
          href="/museum"
          className="px-3 py-1.5 bg-black/90 hover:bg-[#ffd700] text-[#ffd700] hover:text-black border-2 border-neutral-700 hover:border-black font-mono text-[11px] font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_#000] flex items-center gap-2 backdrop-blur-md cursor-pointer group"
        >
          <AnimatedArrowLeftIcon className="w-3.5 h-3.5 text-[#ffd700] group-hover:text-black" />
          <span>Return to Museum</span>
        </Link>

        {/* Center: Museum Identity Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-black/85 border border-neutral-800 text-neutral-400 font-mono text-[10px] uppercase tracking-widest backdrop-blur-md shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] animate-pulse" />
          <span>MUSEO PORTAL</span>
          <span className="text-neutral-600">//</span>
          <span className="text-neutral-300">EST. 4.6 GA</span>
        </div>

        {/* Right: Sound Controls */}
        <button
          type="button"
          className="px-3 py-1.5 bg-black/90 hover:bg-[#ffd700] text-[#ffd700] hover:text-black border-2 border-neutral-700 hover:border-black font-mono text-[10px] font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_#000] backdrop-blur-md cursor-pointer flex items-center gap-2 group"
          onClick={(e) => {
            e.stopPropagation();
            toggleSound();
          }}
          aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          <AnimatedSoundToggle soundEnabled={soundEnabled} className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">{soundEnabled ? 'AUDIO ON' : 'MUTED'}</span>
        </button>
      </header>

      {/* ─── CENTER STAGE: BRUTALIST ADMISSION TICKET CARD ─── */}
      <main className="relative z-20 flex-1 flex items-center justify-center w-full min-h-0 my-auto">
        <TicketCard />
      </main>

      {/* ─── BOTTOM HELPER: FAST DEMO CREDENTIALS SHORTCUT ─── */}
      <footer className="relative z-30 flex items-center justify-center w-full flex-shrink-0 pt-1">
        <button
          type="button"
          onClick={() => autoFillDemo()}
          className="px-3.5 py-1.5 bg-black/95 hover:bg-[#ffd700] text-neutral-300 hover:text-black border-2 border-neutral-700 hover:border-black font-mono text-[10px] font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_#000] flex flex-wrap items-center justify-center gap-2 backdrop-blur-md cursor-pointer group"
          title="Click to automatically fill demo curator credentials"
        >
          <span className="text-[#ffd700] group-hover:text-black flex items-center gap-1">
            <AnimatedBoltIcon className="w-3 h-3 text-[#ffd700] group-hover:text-black" />
            <span>DEMO:</span>
          </span>
          <span className="text-white group-hover:text-black">yashrajdesai044@gmail.com</span>
          <span className="text-neutral-500 group-hover:text-neutral-700">/</span>
          <span className="text-white group-hover:text-black">museo2025</span>
          <span className="bg-neutral-800 group-hover:bg-black text-[#ffd700] px-1.5 py-0.5 font-bold uppercase text-[9px] flex items-center gap-1">
            <span>Auto-Fill</span>
            <AnimatedPenIcon className="w-2.5 h-2.5 text-[#ffd700]" />
          </span>
        </button>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="bg-black text-[#ffd700] fixed inset-0 flex items-center justify-center font-mono text-xs uppercase">
          [ LOADING ADMISSION PORTAL... ]
        </div>
      }
    >
      <LoginContent />
    </React.Suspense>
  );
}
