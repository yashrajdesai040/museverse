'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { HeroCanvas } from '@/components/canvas/HeroCanvas';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { useEvolutionStore } from '@/stores/useEvolutionStore';
import { SplitText } from '@/components/reactbits/SplitText';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { Magnet } from '@/components/reactbits/Magnet';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { Squares } from '@/components/reactbits/Squares';
import { ClickSpark } from '@/components/reactbits/ClickSpark';

const HERO_EPOCHS = [
  {
    idx: 0,
    tag: '01',
    name: 'Hadean',
    year: '4.54 Ga',
    temp: '1,200°C',
    o2: '0.00%',
    milestone: 'Molten Core & Lunar Impact',
    specimen: 'Primordial Zircon',
    accent: '#FF4500',
  },
  {
    idx: 1,
    tag: '02',
    name: 'Archean',
    year: '3.48 Ga',
    temp: '55°C',
    o2: '0.02%',
    milestone: 'First Cyanobacteria Reefs',
    specimen: 'Pilbara Stromatolite',
    accent: '#0284C7',
  },
  {
    idx: 2,
    tag: '03',
    name: 'Proterozoic',
    year: '2.50 Ga',
    temp: '-40°C',
    o2: '2.10%',
    milestone: 'Great Oxidation & Snowball Earth',
    specimen: 'Banded Iron Formations',
    accent: '#0EA5E9',
  },
  {
    idx: 3,
    tag: '04',
    name: 'Paleozoic',
    year: '505 Ma',
    temp: '20°C',
    o2: '15.0%',
    milestone: 'Cambrian Explosion & Marine Giants',
    specimen: 'Giant Paradoxides Trilobite',
    accent: '#059669',
  },
  {
    idx: 4,
    tag: '05',
    name: 'Mesozoic',
    year: '67.0 Ma',
    temp: '22°C',
    o2: '28.0%',
    milestone: 'Apex Dinosaurs & Chicxulub Bolide',
    specimen: 'T. Rex "Sue" (FMNH PR 2081)',
    accent: '#EAB308',
  },
  {
    idx: 5,
    tag: '06',
    name: 'Cenozoic',
    year: 'Present',
    temp: '15°C',
    o2: '20.9%',
    milestone: 'Human Antiquity & Civilization',
    specimen: 'The Antikythera Mechanism',
    accent: '#D97706',
  },
];

export default function HeroSection() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);

  const [activeEpochIndex, setActiveEpochIndex] = useState(4); // Default to Mesozoic
  const { playClick, playLaser, playHover } = useGlobalSound();
  const { jumpToEpoch } = useEvolutionStore();

  const activeEpoch = HERO_EPOCHS[activeEpochIndex] || HERO_EPOCHS[4];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Eyebrow badge
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
        0
      );

      // 2. Sub-headline
      tl.fromTo(
        subheadRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
        0.35
      );

      // 3. CTA Buttons
      if (buttonGroupRef.current) {
        tl.fromTo(
          buttonGroupRef.current.children,
          { opacity: 0, y: 12, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.35,
            ease: 'power2.out',
            stagger: 0.08,
          },
          0.5
        );
      }

      // 4. Telemetry Strip (Bottom)
      tl.fromTo(
        hudRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        0.75
      );

      // 5. Right-side Telemetry Terminal
      if (telemetryRef.current) {
        tl.fromTo(
          telemetryRef.current,
          { opacity: 0, x: 24, scale: 0.96 },
          { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: 'power3.out' },
          0.6
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleLaunchEvolution = (epochIdx: number) => {
    playLaser();
    jumpToEpoch(epochIdx);
    router.push('/evolution');
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center bg-[#F2EDE4] text-[#0E0E0E] overflow-hidden px-4 sm:px-8 md:px-16 border-b-3 border-[#0E0E0E] pt-28 pb-16"
    >
      {/* ── React Bits Bauhaus Squares Grid Background ── */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(14, 14, 14, 0.06)"
          squareSize={48}
          hoverFillColor="rgba(255, 212, 0, 0.25)"
        />
      </div>

      {/* ── BACKGROUND 3D CANVAS (Full Depth & Interaction) ── */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-100">
        <HeroCanvas />
      </div>

      {/* ── 12-COLUMN EDITORIAL GRID ── */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto grid grid-cols-12 gap-8 items-center">
        {/* TEXT CONTENT: 7 Columns Desktop, Full Mobile */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
          {/* Curatorial Status Eyebrow with DecryptedText */}
          <div
            ref={eyebrowRef}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#F2EDE4] border-2 border-[#0E0E0E] text-[#0E0E0E] font-mono text-[11px] font-bold uppercase tracking-widest mb-6 self-start shadow-[3px_3px_0px_#0E0E0E]"
          >
            <span className="w-2.5 h-2.5 bg-[#FFD400] border border-[#0E0E0E] shrink-0 animate-pulse" />
            <DecryptedText
              text="MUSEO 3.0 // ARCHIVAL DEEP-TIME PLATFORM"
              speed={35}
              animateOn="view"
              className="text-[#0E0E0E]"
              encryptedClassName="text-[#B3261E]"
            />
          </div>

          {/* Monumental Headline with React Bits SplitText */}
          <h1 className="text-[clamp(34px,6.2vw,82px)] leading-[0.94] tracking-[-0.03em] font-extrabold uppercase mb-8 font-space text-[#0E0E0E]">
            <SplitText
              text="From Primordial Oceans To Human Civilization."
              duration={0.6}
              stagger={0.03}
              splitBy="words"
              className="text-[#0E0E0E]"
            />
          </h1>

          {/* Editorial Subheadline */}
          <p
            ref={subheadRef}
            className="text-[15px] sm:text-[17px] leading-[1.65] max-w-xl mb-10 text-[#0E0E0E]/85 font-space font-medium"
          >
            A single unified scientific data architecture. Traverse molten Hadean genesis, dinosaur
            cataclysms, and historical human artifacts across four real-time WebGL simulation environments.
          </p>

          {/* Action Deck (Flagship Portals with React Bits Magnet) */}
          <div ref={buttonGroupRef} className="flex flex-wrap gap-3.5 items-center">
            {/* Primary: Earth Evolution 3.0 */}
            <Magnet padding={35} magnetStrength={0.3}>
              <ClickSpark sparkColor="#FFD400" sparkCount={8}>
                <Link
                  href="/evolution"
                  onClick={() => playLaser()}
                  onMouseEnter={() => playHover()}
                  className="tactile-lift relative overflow-hidden holographic-glint inline-flex items-center gap-2.5 px-8 py-4 bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] font-extrabold text-xs sm:text-sm uppercase tracking-wider border-3 border-[#0E0E0E] shadow-[6px_6px_0px_#0E0E0E] hover:shadow-[3px_3px_0px_#0E0E0E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-none cursor-pointer group"
                  data-cursor
                  data-label="EVOLUTION ✦"
                >
                  <ShinyText text="Earth Evolution 3.0" speed={3} shimmerColor="rgba(14, 14, 14, 0.8)" />
                  <span className="text-base group-hover:rotate-45 transition-transform duration-300">✦</span>
                </Link>
              </ClickSpark>
            </Magnet>

            {/* Secondary: 3D Grand Hall Walkthrough */}
            <Magnet padding={30} magnetStrength={0.25}>
              <Link
                href="/hall"
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className="tactile-lift inline-flex items-center gap-2 px-7 py-4 bg-white hover:bg-[#F2EDE4] text-[#0E0E0E] border-3 border-[#0E0E0E] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_#0E0E0E] hover:shadow-[2px_2px_0px_#0E0E0E] active:translate-x-1 active:translate-y-1 transition-all rounded-none cursor-pointer"
                data-cursor
                data-label="GRAND HALL"
              >
                <span>Grand Hall 3D</span>
                <span className="text-[10px] font-mono bg-[#0E0E0E] text-white px-1.5 py-0.5 font-bold">WASD</span>
              </Link>
            </Magnet>

            {/* Tertiary: Specimen Vault */}
            <Magnet padding={30} magnetStrength={0.25}>
              <Link
                href="/museum"
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className="tactile-lift inline-flex items-center gap-2 px-6 py-4 bg-[#0E0E0E] text-[#F2EDE4] hover:bg-[#FFD400] hover:text-[#0E0E0E] border-3 border-[#0E0E0E] font-bold text-xs uppercase tracking-wider shadow-[4px_4px_0px_#0E0E0E] hover:shadow-[2px_2px_0px_#0E0E0E] active:translate-x-1 active:translate-y-1 transition-all rounded-none cursor-pointer group"
                data-cursor
                data-label="ARCHIVE (24)"
              >
                <span>Specimen Vault (24)</span>
                <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </Link>
            </Magnet>
          </div>

          {/* Telemetry Status HUD (Bottom Strip) */}
          <div
            ref={hudRef}
            className="mt-12 pt-6 border-t-2 border-[#0E0E0E]/20 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#0E0E0E]/70"
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-[#0E0E0E] font-bold">
                <span className="w-2 h-2 bg-[#FFD400] border border-[#0E0E0E]" />
                WEBGL 2.0 • 60 FPS HDR
              </span>
              <span className="text-[#0E0E0E]/30">•</span>
              <span className="text-[#0E0E0E] font-medium">6 GEOLOGICAL EPOCHS</span>
              <span className="text-[#0E0E0E]/30">•</span>
              <span className="text-[#0E0E0E] font-medium">24 VERIFIED SPECIMENS</span>
            </div>

            <span className="text-[#0E0E0E]/80 hidden sm:inline text-[10px] tracking-wider uppercase font-bold">
              [DRAG GLOBE TO ROTATE 360°]
            </span>
          </div>
        </div>

        {/* RIGHT AREA: 5 Columns Desktop — Interactive Bauhaus Telemetry Command Matrix */}
        <div className="hidden lg:flex lg:col-span-5 flex-col items-end justify-center pointer-events-none pr-2">
          <div
            ref={telemetryRef}
            className="pointer-events-auto w-full max-w-md bg-[#F2EDE4]/95 backdrop-blur-md border-3 border-[#0E0E0E] p-6 shadow-[8px_8px_0px_#0E0E0E] select-none text-[#0E0E0E] flex flex-col gap-4 relative"
          >
            {/* Corner Reticles */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-[#0E0E0E]" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-[#0E0E0E]" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-[#0E0E0E]" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-[#0E0E0E]" />

            {/* Matrix Header */}
            <div className="flex items-center justify-between border-b-2 border-[#0E0E0E] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#FFD400] border border-[#0E0E0E] animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  CHRONO TELEMETRY MATRIX
                </span>
              </div>
              <span className="font-mono text-[10px] bg-[#0E0E0E] text-[#FFD400] px-2 py-0.5 font-bold uppercase">
                {activeEpoch.year}
              </span>
            </div>

            {/* 6-Epoch Quick Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] font-bold">
              {HERO_EPOCHS.map((epoch) => {
                const isSelected = epoch.idx === activeEpochIndex;
                return (
                  <button
                    key={epoch.idx}
                    onClick={() => {
                      playClick();
                      setActiveEpochIndex(epoch.idx);
                    }}
                    onMouseEnter={() => playHover()}
                    className={`py-1.5 px-2 text-center border-2 border-[#0E0E0E] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0E0E0E] text-[#FFD400] shadow-[2px_2px_0px_#FFD400] font-extrabold -translate-y-0.5'
                        : 'bg-white text-[#0E0E0E] hover:bg-[#FFD400]/40'
                    }`}
                  >
                    <span>{epoch.tag} </span>
                    <span>{epoch.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Telemetry Readout Box */}
            <div className="bg-white border-2 border-[#0E0E0E] p-4 flex flex-col gap-3 shadow-[3px_3px_0px_#0E0E0E]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] text-[#0E0E0E]/60 uppercase tracking-widest font-bold block">
                    STAGE {activeEpoch.tag} MILESTONE
                  </span>
                  <h4 className="font-space font-bold text-sm text-[#0E0E0E] leading-snug">
                    {activeEpoch.milestone}
                  </h4>
                </div>
                <span
                  className="w-3 h-3 rounded-full border border-[#0E0E0E] shrink-0 mt-1"
                  style={{ backgroundColor: activeEpoch.accent }}
                />
              </div>

              {/* Sensor Bars: Temp & O2 */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#0E0E0E]/15 font-mono text-xs">
                <div>
                  <div className="flex justify-between items-center text-[10px] text-[#0E0E0E]/70 font-bold mb-1">
                    <span>SURFACE TEMP</span>
                    <span className="text-[#0E0E0E]">{activeEpoch.temp}</span>
                  </div>
                  <div className="w-full h-2 bg-[#0E0E0E]/10 border border-[#0E0E0E] overflow-hidden">
                    <div
                      className="h-full bg-[#FF4500] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        width:
                          activeEpoch.idx === 0
                            ? '100%'
                            : activeEpoch.idx === 1
                            ? '55%'
                            : activeEpoch.idx === 2
                            ? '15%'
                            : activeEpoch.idx === 3
                            ? '40%'
                            : '30%',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] text-[#0E0E0E]/70 font-bold mb-1">
                    <span>OXYGEN (O₂)</span>
                    <span className="text-[#0E0E0E]">{activeEpoch.o2}</span>
                  </div>
                  <div className="w-full h-2 bg-[#0E0E0E]/10 border border-[#0E0E0E] overflow-hidden">
                    <div
                      className="h-full bg-[#0284C7] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        width:
                          activeEpoch.idx === 0
                            ? '2%'
                            : activeEpoch.idx === 1
                            ? '5%'
                            : activeEpoch.idx === 2
                            ? '12%'
                            : activeEpoch.idx === 3
                            ? '65%'
                            : activeEpoch.idx === 4
                            ? '100%'
                            : '80%',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Linked Specimen Tag */}
              <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                <span className="text-[#0E0E0E]/60 font-bold uppercase">HOLOTYPE:</span>
                <span className="text-[#0E0E0E] font-bold">{activeEpoch.specimen}</span>
              </div>
            </div>

            {/* Launch Evolution Stage Action */}
            <button
              onClick={() => handleLaunchEvolution(activeEpoch.idx)}
              onMouseEnter={() => playHover()}
              className="w-full py-2.5 bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_#0E0E0E] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#0E0E0E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Simulate {activeEpoch.name} In 3D</span>
              <span className="text-sm font-bold">➔</span>
            </button>

            {/* Bottom 3D Core Hint */}
            <div className="flex items-center justify-between text-[10px] font-mono text-[#0E0E0E]/70 font-bold pt-1">
              <span>[↺ DRAG TO ORBIT GLOBE]</span>
              <span className="text-[#0E0E0E]">SPATIAL AUDIO READY</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bauhaus "Scroll to Excavate" Tactile Indicator ── */}
      <div
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight * 0.92,
            behavior: 'smooth',
          });
        }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-1.5 cursor-pointer group select-none pointer-events-auto transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
      >
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#0E0E0E]/60 group-hover:text-[#0E0E0E] transition-colors flex items-center gap-1">
          <span>EXCAVATE ARCHIVE</span>
          <span className="animate-bounce">↓</span>
        </span>
        <div className="w-5 h-7 border-2 border-[#0E0E0E] rounded-full flex items-start justify-center p-1 bg-white/90 shadow-[2px_2px_0px_#0E0E0E]">
          <div className="w-1 h-2 bg-[#FFD400] border border-[#0E0E0E] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
