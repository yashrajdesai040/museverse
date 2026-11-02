'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/stores/useAppStore';
import { useGlobalSound } from '@/hooks/useGlobalSound';

export function ArchivalHUD() {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeStr, setTimeStr] = useState('');
  const { openShortcutsModal, audioMuted, toggleAudio } = useAppStore();
  const { playClick, playHover } = useGlobalSound();

  useEffect(() => {
    // Live UTC Clock
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setTimeStr(`${h}:${m}:${s} UTC`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let ticking = false;
    let lastProgress = -1;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight <= 0) {
            if (lastProgress !== 0) {
              lastProgress = 0;
              setScrollProgress(0);
            }
          } else {
            const rawProgress = (window.scrollY / totalHeight) * 100;
            const progress = Math.min(100, Math.max(0, Math.round(rawProgress)));
            if (progress !== lastProgress) {
              lastProgress = progress;
              setScrollProgress(progress);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine Deep-Time Era Based on Scroll Depth
  const getEpochFromScroll = (pct: number) => {
    if (pct < 20) return 'STAGE 05 / CENOZOIC (0 MA)';
    if (pct < 45) return 'STAGE 04 / MESOZOIC (66 MA)';
    if (pct < 70) return 'STAGE 03 / PALEOZOIC (252 MA)';
    if (pct < 90) return 'STAGE 02 / PROTEROZOIC (2,500 MA)';
    return 'STAGE 01 / HADEAN-ARCHEAN (4,600 MA)';
  };

  // Hide HUD on login or full 3D interactive routes
  if (
    pathname === '/login' ||
    pathname?.startsWith('/evolution') ||
    pathname?.startsWith('/hall') ||
    pathname?.startsWith('/compare')
  ) {
    return null;
  }

  return (
    <>
      {/* ── Viewport Reticles (Bauhaus Corner Marks) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9980] overflow-hidden hidden md:block select-none"
      >
        <div className="absolute top-22 left-6 font-mono text-[9px] text-[#0E0E0E]/60 font-bold">
          [ 20°41&apos;N // 89°31&apos;W ]
        </div>
        <div className="absolute top-22 right-6 font-mono text-[9px] text-[#0E0E0E]/60 font-bold text-right">
          [ MATRIX 4.6 GA ]
        </div>
      </div>

      {/* ── Persistent Floating HUD Bar (Bottom Viewport) ── */}
      <aside
        aria-label="Archive Telemetry HUD"
        className="fixed bottom-3 left-4 right-4 z-[9985] pointer-events-none flex items-center justify-between font-mono text-[10px] uppercase font-bold"
      >
        {/* Left Telemetry Cluster */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-3 bg-[#F2EDE4] px-3.5 py-1.5 border-2 border-[#0E0E0E] shadow-[3px_3px_0px_#0E0E0E] text-[#0E0E0E]">
          <span className="inline-flex items-center gap-1.5 text-[#0E0E0E]">
            <span className="w-2 h-2 bg-[#FFD400] border border-[#0E0E0E]" />
            LIVE
          </span>
          <span className="text-[#0E0E0E]/30">|</span>
          <span className="tracking-widest">{timeStr || '00:00:00 UTC'}</span>
          <span className="text-[#0E0E0E]/30 hidden lg:inline">|</span>
          <span className="hidden lg:inline text-[#0E0E0E]">
            {getEpochFromScroll(scrollProgress)}
          </span>
        </div>

        {/* Right HUD Controls: Sound Toggle, Scroll Depth & Shortcuts */}
        <div className="pointer-events-auto ml-auto flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              playClick();
              toggleAudio();
            }}
            onMouseEnter={playHover}
            className={`px-3 py-1.5 border-2 border-[#0E0E0E] shadow-[3px_3px_0px_#0E0E0E] font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${
              !audioMuted
                ? 'bg-[#FFD400] text-[#0E0E0E]'
                : 'bg-[#F2EDE4] text-[#0E0E0E]/60 hover:text-[#0E0E0E]'
            }`}
            title="Toggle Sound Design (Mute / Unmute)"
            data-cursor
          >
            {audioMuted ? 'SOUND: OFF' : 'SOUND: ON'}
          </button>

          {/* Scroll Progress Meter */}
          <div className="flex items-center gap-2 bg-[#F2EDE4] px-3 py-1.5 border-2 border-[#0E0E0E] shadow-[3px_3px_0px_#0E0E0E] text-[#0E0E0E]">
            <span className="text-[#0E0E0E]/60 font-bold">DEPTH</span>
            <span className="w-8 text-right font-bold text-[#0E0E0E]">
              {scrollProgress}%
            </span>
            <div className="w-12 h-2 bg-white border border-[#0E0E0E] overflow-hidden ml-1 hidden sm:block">
              <div
                className="h-full bg-[#FFD400] transition-all duration-100 ease-out"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>

          {/* Shortcuts Trigger */}
          <button
            onClick={() => {
              playClick();
              openShortcutsModal();
            }}
            onMouseEnter={playHover}
            className="flex items-center gap-1.5 bg-[#0E0E0E] text-[#F2EDE4] hover:bg-[#FFD400] hover:text-[#0E0E0E] px-2.5 py-1.5 border-2 border-[#0E0E0E] shadow-[3px_3px_0px_#0E0E0E] transition-all cursor-pointer"
            title="Keyboard Shortcuts Cheatsheet"
            data-cursor
          >
            <kbd className="text-[10px] font-bold">[ ? ]</kbd>
            <span className="hidden md:inline text-[9px] tracking-wider font-bold">HOTKEYS</span>
          </button>
        </div>
      </aside>
    </>
  );
}
