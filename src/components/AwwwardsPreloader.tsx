'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { useAppStore } from '@/stores/useAppStore';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { TiltedCard } from '@/components/reactbits/TiltedCard';
import { Magnet } from '@/components/reactbits/Magnet';
import { ClickSpark } from '@/components/reactbits/ClickSpark';

export function AwwwardsPreloader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [maCounter, setMaCounter] = useState(4600);
  const [ticketPrinted, setTicketPrinted] = useState(false);
  const [soundChoice, setSoundChoice] = useState<'enabled' | 'muted'>('enabled');
  const [isOpening, setIsOpening] = useState(false);

  const { playClick, playStamp, playLaser, unlockAudio } = useGlobalSound();
  const { setAudioMuted } = useAppStore();

  const PHASES = [
    '01 // ACCRETION & MAGMA COOLING',
    '02 // THE GREAT OXIDATION EVENT',
    '03 // CAMBRIAN PALEOZOIC EXPLOSION',
    '04 // MESOZOIC DINOSAUR REIGN',
    '05 // CENOZOIC & ANTHROPOCENE',
  ];

  const currentPhaseIndex = Math.min(
    PHASES.length - 1,
    Math.floor((progress / 100) * PHASES.length)
  );

  useEffect(() => {
    // Only show on home arrival screen ('/')
    if (pathname !== '/') {
      return;
    }

    // Check if user already saw the entrance preloader this session or prefers reduced motion
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('museo_entrance_seen');
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (seen || prefersReduced) {
        return;
      }
    }

    setVisible(true);

    const start = performance.now();
    const duration = 2200; // 2.2 seconds for cinematic pacing
    let lastProgress = -1;
    let lastUpdate = 0;

    const updateFrame = (now: number) => {
      const elapsed = now - start;
      const rawPct = Math.min(1, elapsed / duration);

      // Snappy cubic ease
      const easePct = rawPct === 1 ? 1 : 1 - Math.pow(2, -10 * rawPct);
      const currentProgress = Math.round(easePct * 100);

      // Throttle state updates: trigger at most ~20 times/sec instead of 120 times/sec
      if (currentProgress - lastProgress >= 2 || rawPct === 1 || now - lastUpdate > 50) {
        lastProgress = currentProgress;
        lastUpdate = now;
        setProgress(currentProgress);

        // Interpolate geological age from 4,600 Ma down to 0 Ma
        const currentMa = Math.round((1 - easePct) * 4600);
        setMaCounter(currentMa);
      }

      if (rawPct >= 0.85) {
        setTicketPrinted(true);
      }

      if (rawPct < 1) {
        requestAnimationFrame(updateFrame);
      }
    };

    const animId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleEnter = useCallback(() => {
    if (soundChoice === 'enabled') {
      unlockAudio?.();
      setAudioMuted(false);
      localStorage.setItem('museo_sound_pref', 'enabled');
      playStamp();
    } else {
      setAudioMuted(true);
      localStorage.setItem('museo_sound_pref', 'muted');
      playClick();
    }

    setIsOpening(true);
    sessionStorage.setItem('museo_entrance_seen', 'true');
    setTimeout(() => {
      setVisible(false);
    }, 600);
  }, [soundChoice, unlockAudio, setAudioMuted, playStamp, playClick]);

  // Global Escape key shortcut to skip preloader
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible && !isOpening) {
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, isOpening, handleEnter]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed inset-0 z-[999999] pointer-events-auto flex flex-col justify-between overflow-hidden select-none bg-[#F2EDE4]"
    >
      {/* ── Top Hard Wipe Shutter Panel ── */}
      <div
        className={`absolute inset-x-0 top-0 h-1/2 bg-[#0E0E0E] border-b-4 border-[#FFD400] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] ${
          isOpening ? '-translate-y-full' : 'translate-y-0'
        }`}
      />

      {/* ── Bottom Hard Wipe Shutter Panel ── */}
      <div
        className={`absolute inset-x-0 bottom-0 h-1/2 bg-[#0E0E0E] border-t-4 border-[#FFD400] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] ${
          isOpening ? 'translate-y-full' : 'translate-y-0'
        }`}
      />

      {/* ── Central Bauhaus Admission Screen ── */}
      <div
        className={`relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-12 text-[#F2EDE4] transition-opacity duration-300 ${
          isOpening ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[#F2EDE4]/70">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#FFD400] border border-[#0E0E0E]" />
            <span className="font-bold text-[#F2EDE4]">MUSEO // DEEP TIME ARCHIVE</span>
            <span className="text-[#F2EDE4]/30 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-[#FFD400]">4.6 BILLION YEARS OF TERRESTRIAL REALITY</span>
          </div>

          <button
            onClick={handleEnter}
            className="px-3 py-1 bg-[#1C1C1C] hover:bg-[#FFD400] hover:text-[#0E0E0E] border border-[#F2EDE4]/30 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            SKIP INTRO [ESC] →
          </button>
        </div>

        {/* Center Countdown & Printed Ticket */}
        <div className="my-auto max-w-4xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 py-8">
          {/* Left: Oversized Ma Counter */}
          <div className="flex-1">
            <div className="font-mono text-xs text-[#FFD400] font-bold uppercase tracking-wider mb-2">
              <DecryptedText
                text={PHASES[currentPhaseIndex]}
                speed={30}
                animateOn="view"
                className="text-[#FFD400]"
                encryptedClassName="text-white"
              />
            </div>
            <div className="font-space text-6xl sm:text-8xl md:text-9xl font-bold tracking-tighter text-[#F2EDE4] tabular-nums leading-none">
              {maCounter}
              <span className="text-3xl sm:text-5xl font-mono text-[#FFD400] ml-2">MA</span>
            </div>
            <p className="font-space text-sm text-[#F2EDE4]/70 mt-4 max-w-md">
              Synchronizing continental crust, atmospheric gas concentrations, and 24 verified specimens...
            </p>
          </div>

          {/* Right: Bauhaus Printed Admission Pass with React Bits TiltedCard */}
          <TiltedCard maxAngle={8} scale={1.02} glare={true} className="w-full max-w-sm">
            <div
              className={`w-full bg-[#F2EDE4] text-[#0E0E0E] border-3 border-[#0E0E0E] shadow-[8px_8px_0px_#FFD400] p-6 transition-all duration-500 ${
                ticketPrinted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="flex items-center justify-between border-b-2 border-[#0E0E0E] pb-3 mb-4">
                <span className="font-mono text-xs font-bold uppercase">PATRON ADMISSION TICKET</span>
                <span className="px-2 py-0.5 bg-[#FFD400] border border-[#0E0E0E] font-mono text-[10px] font-bold">
                  NO. 004600
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-[#0E0E0E]/60">EXHIBITION:</span>
                  <span className="font-bold">MUSEUM OF DEEP TIME</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#0E0E0E]/60">TIMELINE:</span>
                  <span className="font-bold">4,600 MA → PRESENT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#0E0E0E]/60">SPECIMENS:</span>
                  <span className="font-bold">24 VERIFIED ENTITIES</span>
                </div>
              </div>

              {/* Sound Opt-In Selector */}
              <div className="border-t-2 border-dashed border-[#0E0E0E] pt-4 mb-4">
                <p className="font-mono text-[10px] font-bold uppercase text-[#0E0E0E]/70 mb-2">
                  SELECT AUDIO PREFERENCE (AUTOPLAY POLICY):
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setSoundChoice('enabled');
                    }}
                    className={`py-2 text-xs font-mono font-bold uppercase border-2 border-[#0E0E0E] transition-all cursor-pointer ${
                      soundChoice === 'enabled'
                        ? 'bg-[#FFD400] text-[#0E0E0E] shadow-[2px_2px_0_#0E0E0E]'
                        : 'bg-white text-[#0E0E0E]/60'
                    }`}
                  >
                    🔊 SOUND ON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setSoundChoice('muted');
                    }}
                    className={`py-2 text-xs font-mono font-bold uppercase border-2 border-[#0E0E0E] transition-all cursor-pointer ${
                      soundChoice === 'muted'
                        ? 'bg-[#0E0E0E] text-[#F2EDE4] shadow-[2px_2px_0_#0E0E0E]'
                        : 'bg-white text-[#0E0E0E]/60'
                    }`}
                  >
                    🔇 MUTED
                  </button>
                </div>
              </div>

              {/* Enter Button with Magnet & ClickSpark */}
              <Magnet padding={25} magnetStrength={0.2} className="w-full">
                <ClickSpark sparkColor="#0E0E0E" sparkCount={6} className="w-full">
                  <button
                    onClick={handleEnter}
                    className="w-full py-3 bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] border-2 border-[#0E0E0E] shadow-[4px_4px_0_#0E0E0E] font-space font-bold text-sm uppercase tracking-wider transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#0E0E0E] cursor-pointer"
                  >
                    <ShinyText text="ENTER THE MUSEUM →" speed={2.5} shimmerColor="rgba(14, 14, 14, 0.85)" />
                  </button>
                </ClickSpark>
              </Magnet>
            </div>
          </TiltedCard>
        </div>

        {/* Bottom Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between font-mono text-xs uppercase mb-2 text-[#F2EDE4]/70">
            <span>CALIBRATION PROGRESS</span>
            <span className="font-bold text-[#FFD400]">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-[#1C1C1C] border border-[#F2EDE4]/30 overflow-hidden">
            <div
              className="h-full bg-[#FFD400] transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
