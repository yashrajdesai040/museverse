'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ThreeUIGallery } from '@/components/threeui/ThreeUIComponents';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { useAppStore } from '@/stores/useAppStore';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { Magnet } from '@/components/reactbits/Magnet';

interface GalleryPreset {
  id: string;
  name: string;
  hue: number;
  saturation: number;
  brightness: number;
  badgeColor: string;
  textColor: string;
}

const GALLERY_PRESETS: GalleryPreset[] = [
  {
    id: 'natural',
    name: 'NATURAL ARCHIVE',
    hue: 0,
    saturation: 1.0,
    brightness: 1.0,
    badgeColor: '#0E0E0E',
    textColor: '#F2EDE4',
  },
  {
    id: 'amber',
    name: 'BAUHAUS AMBER',
    hue: 38,
    saturation: 1.4,
    brightness: 1.05,
    badgeColor: '#FFD400',
    textColor: '#0E0E0E',
  },
  {
    id: 'crimson',
    name: 'PALEOZOIC RED',
    hue: 350,
    saturation: 1.35,
    brightness: 1.0,
    badgeColor: '#B3261E',
    textColor: '#FFFFFF',
  },
  {
    id: 'cyan',
    name: 'ABYSSAL BIOLUM',
    hue: 180,
    saturation: 1.25,
    brightness: 1.1,
    badgeColor: '#00E5FF',
    textColor: '#0E0E0E',
  },
];

const GALLERY_SPECIMENS = [
  {
    id: 'opabinia-regalis',
    name: 'Opabinia Regalis',
    era: 'Cambrian',
    age: '505 Ma',
    metric: '5 EYES / PROBOSCIS',
    accent: '#059669',
  },
  {
    id: 'anomalocaris-canadensis',
    name: 'Anomalocaris',
    era: 'Cambrian',
    age: '508 Ma',
    metric: 'SUPERPREDATOR',
    accent: '#0284C7',
  },
  {
    id: 'dunkleosteus-terrelli',
    name: 'Dunkleosteus',
    era: 'Devonian',
    age: '382 Ma',
    metric: 'GUILLOTINE JAWS',
    accent: '#B3261E',
  },
  {
    id: 'tiktaalik-roseae',
    name: 'Tiktaalik Roseae',
    era: 'Devonian',
    age: '375 Ma',
    metric: 'FIRST WRIST RIG',
    accent: '#D97706',
  },
  {
    id: 'dimetrodon-grandis',
    name: 'Dimetrodon Grandis',
    era: 'Permian',
    age: '295 Ma',
    metric: 'THERMAL SAIL',
    accent: '#EAB308',
  },
  {
    id: 'archaeopteryx-london',
    name: 'Archaeopteryx',
    era: 'Jurassic',
    age: '150 Ma',
    metric: 'PROTO-AVIALAN',
    accent: '#7C3AED',
  },
];

export function ThreeUIGallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [preset, setPreset] = useState<GalleryPreset>(GALLERY_PRESETS[1]); // default Bauhaus Amber

  const { playClick, playLaser, playHover, playToggle } = useGlobalSound();
  const { openEntityModal } = useAppStore();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePresetChange = (newPreset: GalleryPreset) => {
    playToggle(true);
    setPreset(newPreset);
  };

  const handleSpeedChange = (newSpeed: number) => {
    playClick();
    setSpeed(newSpeed);
  };

  const handleScaleChange = (newScale: number) => {
    playClick();
    setScale(newScale);
  };

  return (
    <section
      ref={sectionRef}
      id="threeui-matrix"
      className="w-full bg-[#0E0E0E] text-[#F2EDE4] py-24 sm:py-32 px-4 sm:px-8 md:px-12 lg:px-16 border-b-3 border-[#0E0E0E] relative overflow-hidden select-none"
    >
      {/* Subtle architectural grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ── HEADER BANNER ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b-2 border-white/15 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1C1C1C] border-2 border-[#FFD400] text-[#FFD400] font-mono text-[11px] font-bold uppercase tracking-widest mb-4 shadow-[3px_3px_0px_#FFD400]">
              <span className="w-2 h-2 rounded-full bg-[#FFD400] animate-ping" />
              <DecryptedText
                text="THREEUI SPATIAL REPOSITORY // 3D CYLINDRICAL MATRIX"
                speed={30}
                animateOn="view"
                className="text-[#FFD400]"
                encryptedClassName="text-white/60"
              />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-space uppercase tracking-tight text-[#F2EDE4] leading-[1.05]">
              Curved 3D Kinetic <br className="hidden sm:inline" />
              <ShinyText text="Archival Cylinder" speed={2.5} shimmerColor="rgba(255, 212, 0, 0.9)" />
            </h2>
          </div>

          <div className="max-w-md">
            <p className="font-space text-sm sm:text-base text-[#F2EDE4]/70 leading-relaxed mb-4">
              Real-time WebGL cylindrical rail renderer powered by <span className="text-[#FFD400] font-bold">ThreeUI</span>. 
              Drag, orbit, and adjust kinetic momentum to inspect deep-time visual artifacts mapped onto a curved non-Euclidean stage.
            </p>
            <div className="flex items-center gap-2 font-mono text-xs text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ORBIT PIPELINE: ACTIVE // WEBGL 2.0 DISPLACEMENT</span>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE TELEMETRY CONTROLS DECK ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-[#161616] p-4 sm:p-5 border-2 border-white/20 shadow-[4px_4px_0px_#FFD400]">
          
          {/* 1. Orbit Velocity Controls */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-white/60 font-bold uppercase tracking-wider">Orbit Velocity</span>
              <span className="text-[#FFD400] font-bold font-mono">
                {speed > 0 ? `+${speed.toFixed(1)}x` : `${speed.toFixed(1)}x`} ({Math.round(speed * 10.8)}°/s)
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: '0.5x', val: 0.5 },
                { label: '1.0x', val: 1.0 },
                { label: '2.0x', val: 2.0 },
                { label: 'REV', val: -1.0 },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => handleSpeedChange(btn.val)}
                  onMouseEnter={playHover}
                  className={`py-1.5 px-2 text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
                    speed === btn.val
                      ? 'bg-[#FFD400] text-[#0E0E0E] border-[#FFD400] shadow-[2px_2px_0px_#FFF]'
                      : 'bg-black/40 text-white/70 border-white/20 hover:border-white/60 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Chromatic Spectral Filter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-white/60 font-bold uppercase tracking-wider">Spectral Filter</span>
              <span className="text-[#FFD400] font-bold font-mono">{preset.name.split(' ')[0]}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {GALLERY_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePresetChange(p)}
                  onMouseEnter={playHover}
                  className={`py-1.5 px-1 text-[11px] font-mono font-bold uppercase border transition-all truncate cursor-pointer ${
                    preset.id === p.id
                      ? 'bg-white text-[#0E0E0E] border-white shadow-[2px_2px_0px_#FFD400]'
                      : 'bg-black/40 text-white/70 border-white/20 hover:border-white/60 hover:text-white'
                  }`}
                  title={p.name}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Radial Spatial Scale */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-white/60 font-bold uppercase tracking-wider">Cylinder Scale</span>
              <span className="text-[#FFD400] font-bold font-mono">{scale.toFixed(2)}x FOV</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: '0.85x', val: 0.85 },
                { label: '1.00x', val: 1.0 },
                { label: '1.15x', val: 1.15 },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => handleScaleChange(btn.val)}
                  onMouseEnter={playHover}
                  className={`py-1.5 px-2 text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
                    scale === btn.val
                      ? 'bg-[#FFD400] text-[#0E0E0E] border-[#FFD400] shadow-[2px_2px_0px_#FFF]'
                      : 'bg-black/40 text-white/70 border-white/20 hover:border-white/60 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ── THE FLAGSHIP 3D CYLINDER VIEWPORT ── */}
        <div className="relative w-full h-[460px] sm:h-[560px] md:h-[640px] bg-[#121212] border-3 border-white/30 rounded-none shadow-[10px_10px_0px_#0E0E0E] overflow-hidden group">
          
          {/* Top Frame Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-20 h-9 bg-[#0E0E0E]/90 backdrop-blur-md border-b border-white/20 px-4 flex items-center justify-between font-mono text-[11px] text-white/70 pointer-events-none select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white uppercase tracking-wider">
                CYLINDRICAL PROJECTION RAIL // THREEUI ENGINE
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-white/40">
              <span>HUE: {preset.hue}°</span>
              <span>SAT: {preset.saturation.toFixed(2)}</span>
              <span>SCALE: {scale}</span>
              <span className="text-[#FFD400] font-bold">DRAG OR SCROLL TO ROTATE</span>
            </div>
          </div>

          {/* Corner Crosshairs */}
          <div className="absolute top-12 left-4 z-20 font-mono text-[10px] text-white/40 pointer-events-none">
            + [TL 00:00:01]
          </div>
          <div className="absolute top-12 right-4 z-20 font-mono text-[10px] text-white/40 pointer-events-none text-right">
            [TR 360° FOV] +
          </div>
          <div className="absolute bottom-4 left-4 z-20 font-mono text-[10px] text-white/40 pointer-events-none">
            + [BL 4.54 GA BASELINE]
          </div>
          <div className="absolute bottom-4 right-4 z-20 font-mono text-[10px] text-white/40 pointer-events-none text-right">
            [BR ARCHIVAL REPOSITORY] +
          </div>

          {/* ThreeUI Flagship 3D Curved Cylinder Component */}
          <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
            {isInView ? (
              <ThreeUIGallery
                speed={speed}
                scale={scale}
                hue={preset.hue}
                saturation={preset.saturation}
                brightness={preset.brightness}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-[#161616] flex items-center justify-center font-mono text-xs text-white/40">
                ✦ INITIALIZING CYLINDER MATRIX RAIL ON VIEW...
              </div>
            )}
          </div>

          {/* Tactile Interaction Overlay Pill */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="px-4 py-2 bg-[#0E0E0E]/85 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 font-mono text-xs text-[#FFD400] shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-bold tracking-wider">CLICK & DRAG TO SPIN SPATIAL CYLINDER</span>
            </div>
          </div>
        </div>

        {/* ── FAST SPECIMEN ACCESS MATRIX ── */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FFD400]" />
              <span className="font-mono text-xs text-white/70 uppercase font-bold tracking-wider">
                CANONICAL SPECIMENS SYNCHRONIZED WITH CYLINDER
              </span>
            </div>
            <span className="font-mono text-[11px] text-white/40">
              SELECT TO LAUNCH 3D MODAL
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {GALLERY_SPECIMENS.map((specimen, idx) => (
              <Magnet key={specimen.id} padding={10} magnetStrength={0.15}>
                <button
                  onClick={() => {
                    playLaser();
                    openEntityModal(specimen.id);
                  }}
                  onMouseEnter={playHover}
                  className="w-full text-left p-3.5 bg-[#161616] hover:bg-[#1E1E1E] border-2 border-white/20 hover:border-[#FFD400] transition-all cursor-pointer group shadow-[3px_3px_0px_rgba(255,212,0,0.15)] hover:shadow-[3px_3px_0px_#FFD400]"
                >
                  <div className="flex justify-between items-center font-mono text-[10px] text-white/40 mb-1.5">
                    <span>0{idx + 1}</span>
                    <span className="text-[#FFD400] font-bold">{specimen.age}</span>
                  </div>
                  <h4 className="font-space font-bold text-xs sm:text-sm text-white group-hover:text-[#FFD400] transition-colors truncate">
                    {specimen.name}
                  </h4>
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-white/50">
                    <span className="truncate">{specimen.metric}</span>
                    <span className="text-[#FFD400] font-bold group-hover:translate-x-0.5 transition-transform">↗</span>
                  </div>
                </button>
              </Magnet>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
