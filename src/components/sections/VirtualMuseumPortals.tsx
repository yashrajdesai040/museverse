'use client';

import React from 'react';
import Link from 'next/link';
import { useGlobalSound } from '@/hooks/useGlobalSound';

export function VirtualMuseumPortals() {
  const { playClick, playLaser, playChime, playCalibrate, playHover } = useGlobalSound();

  const portals = [
    {
      id: 'evolution',
      protocol: 'PROTOCOL 01 • DEEP-TIME ENGINE',
      fps: '60 FPS HDR',
      title: 'Chrono-Terra Evolution 3.0',
      description:
        'A real-time 3D planetary simulator traversing 4.54 billion years. Features dynamic Chicxulub asteroid impact with shockwaves, tectonic thermal heat maps, and generative ambient acoustics.',
      accent: 'border-[#0E0E0E] text-[#0E0E0E]',
      badgeColor: 'text-[#0E0E0E] border-[#0E0E0E] bg-[#FFD400]',
      btnBg: 'bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] font-extrabold border-2 border-[#0E0E0E] shadow-[3px_3px_0px_#0E0E0E]',
      href: '/evolution',
      ctaText: 'Launch Chrono-Terra 3.0',
      soundFn: () => playLaser(),
      features: [
        '6 continuous geological biospheres',
        'Volumetric asteroid impact & shockwaves',
        'Tectonic, thermal & biosphere modes',
      ],
      previewGraphic: (
        <div className="w-full h-40 bg-[#0E0E0E] border-2 border-[#0E0E0E] p-3 relative overflow-hidden flex flex-col justify-between text-[#F2EDE4] select-none">
          {/* Top Status */}
          <div className="flex justify-between items-center text-[10px] font-mono font-bold z-10">
            <span className="text-[#FFD400] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400] animate-pulse" />
              PLANETARY CORE
            </span>
            <span className="text-[#F2EDE4]/70">4.54 GA → 0 GA</span>
          </div>

          {/* Animated Planetary SVG Wireframe */}
          <div className="relative flex-1 flex items-center justify-center my-1">
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Outer Rotating Ring */}
              <div
                className="absolute inset-0 rounded-full border border-dashed border-[#FFD400]/60 animate-spin"
                style={{ animationDuration: '16s' }}
              />
              {/* Core Glow */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF4500] via-[#D97706] to-[#FFD400] opacity-80 flex items-center justify-center shadow-[0_0_20px_rgba(255,212,0,0.3)]">
                <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
              </div>
              {/* Chicxulub Crosshair Vector */}
              <div className="absolute top-1 right-1 text-[8px] font-mono text-[#FF4500] font-bold">
                ⊕ 66.0 Ma
              </div>
            </div>
          </div>

          {/* Bottom Telemetry */}
          <div className="flex justify-between items-center text-[9px] font-mono text-[#F2EDE4]/80 z-10 border-t border-[#F2EDE4]/20 pt-1">
            <span>CHICXULUB IMPACT</span>
            <span className="text-[#FFD400] font-bold">ACTIVE SIMULATION</span>
          </div>
        </div>
      ),
    },
    {
      id: 'hall',
      protocol: 'PROTOCOL 02 • FIRST-PERSON WALKTHROUGH',
      fps: '60 FPS 360°',
      title: 'Grand Exhibition Hall 3D',
      description:
        'Step inside the full-scale neoclassical gallery. Walk freely using WASD between glowing marble pedestals, trigger proximity spotlights, and inspect artifacts with real-time radar.',
      accent: 'border-[#0E0E0E] text-[#0E0E0E]',
      badgeColor: 'text-[#0E0E0E] border-[#0E0E0E] bg-white',
      btnBg: 'bg-[#0E0E0E] hover:bg-[#222222] text-[#F2EDE4] font-bold border-2 border-[#0E0E0E] shadow-[3px_3px_0px_#0E0E0E]',
      href: '/hall',
      ctaText: 'Enter 3D Grand Hall',
      soundFn: () => playClick(),
      features: [
        'WASD first-person walking & looking',
        'Dynamic proximity spotlight sensors',
        'Autopilot exhibit teleportation & radar',
      ],
      previewGraphic: (
        <div className="w-full h-40 bg-[#161616] border-2 border-[#0E0E0E] p-3 relative overflow-hidden flex flex-col justify-between text-[#F2EDE4] select-none">
          {/* Top Status */}
          <div className="flex justify-between items-center text-[10px] font-mono font-bold z-10">
            <span className="text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ROTUNDA MATRIX
            </span>
            <span className="text-white/60">WASD CONTROLS</span>
          </div>

          {/* Animated 3D Hall Radar Sweep */}
          <div className="relative flex-1 flex items-center justify-center my-1">
            <div className="relative w-20 h-20 rounded-full border border-neutral-700 flex items-center justify-center overflow-hidden bg-neutral-900/80">
              {/* Radar Grid Circles */}
              <div className="absolute inset-2 rounded-full border border-neutral-700/60" />
              <div className="absolute inset-5 rounded-full border border-neutral-700/40" />
              {/* Radar Sweeping Beam */}
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  animationDuration: '4s',
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(255,212,0,0.35) 360deg)',
                }}
              />
              {/* Pedestal Blips */}
              <div className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
              <div className="absolute bottom-5 right-5 w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
              <div className="absolute top-6 right-4 w-1.5 h-1.5 rounded-full bg-white" />
              {/* Player Position */}
              <div className="w-2.5 h-2.5 bg-emerald-400 border border-white z-10" />
            </div>
          </div>

          {/* Bottom Telemetry */}
          <div className="flex justify-between items-center text-[9px] font-mono text-[#F2EDE4]/80 z-10 border-t border-[#F2EDE4]/20 pt-1">
            <span>PEDESTALS: 9 LOADED</span>
            <span className="text-emerald-400 font-bold">MARBLE ACOUSTICS</span>
          </div>
        </div>
      ),
    },
    {
      id: 'compare',
      protocol: 'PROTOCOL 03 • DUAL VIEWPORT LAB',
      fps: 'DUAL 3D MESH',
      title: 'Chrono Lab 3D Specimen Analyzer',
      description:
        'Simultaneously orbit and scrutinize any two specimens side-by-side. Synchronize camera orientations in real time, calculate temporal divergence across epochs, and analyze physical dimensions.',
      accent: 'border-[#0E0E0E] text-[#0E0E0E]',
      badgeColor: 'text-[#0E0E0E] border-[#0E0E0E] bg-[#F2EDE4]',
      btnBg: 'bg-[#F2EDE4] hover:bg-[#FFD400] text-[#0E0E0E] font-bold border-2 border-[#0E0E0E] shadow-[3px_3px_0px_#0E0E0E]',
      href: '/compare',
      ctaText: 'Open Chrono Lab 3D',
      soundFn: () => playCalibrate(),
      features: [
        'Dual hardware-accelerated viewports',
        'Synchronized 3D orbital inspection',
        'Logarithmic temporal divergence gauge',
      ],
      previewGraphic: (
        <div className="w-full h-40 bg-[#0E0E0E] border-2 border-[#0E0E0E] p-3 relative overflow-hidden flex flex-col justify-between text-[#F2EDE4] select-none">
          {/* Top Status */}
          <div className="flex justify-between items-center text-[10px] font-mono font-bold z-10">
            <span className="text-[#38BDF8] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              DUAL VIEWPORT
            </span>
            <span className="text-[#FFD400] font-bold">Δ 66.8M YRS</span>
          </div>

          {/* Split Comparison Viewports */}
          <div className="relative flex-1 grid grid-cols-2 gap-2 my-1 items-center">
            {/* Left Box: Sue T-Rex */}
            <div className="h-full bg-neutral-900 border border-neutral-700 p-2 flex flex-col justify-between items-center relative overflow-hidden">
              <span className="text-[8px] font-mono text-neutral-400 self-start">SPECIMEN A</span>
              <div className="text-xl">🦖</div>
              <span className="text-[8px] font-mono text-[#FFD400] font-bold">67.0 MA</span>
            </div>
            {/* Center Sync Indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[#FFD400] text-[#0E0E0E] px-1 py-0.5 font-mono text-[8px] font-extrabold border border-[#0E0E0E]">
              SYNC
            </div>
            {/* Right Box: Antikythera */}
            <div className="h-full bg-neutral-900 border border-neutral-700 p-2 flex flex-col justify-between items-center relative overflow-hidden">
              <span className="text-[8px] font-mono text-neutral-400 self-start">SPECIMEN B</span>
              <div className="text-xl">⚙️</div>
              <span className="text-[8px] font-mono text-[#38BDF8] font-bold">2,150 YA</span>
            </div>
          </div>

          {/* Bottom Telemetry */}
          <div className="flex justify-between items-center text-[9px] font-mono text-[#F2EDE4]/80 z-10 border-t border-[#F2EDE4]/20 pt-1">
            <span>ROTATION LOCK</span>
            <span className="text-[#38BDF8] font-bold">ISOMETRIC SYNC</span>
          </div>
        </div>
      ),
    },
    {
      id: 'museum',
      protocol: 'PROTOCOL 04 • CURATED VAULT & PASSPORT',
      fps: '24 SPECIMENS',
      title: 'Curated Specimen Vault & Passport',
      description:
        'Traverse 24 verified specimens spanning fossils, ancient artifacts, and human relics. Listen to neural synthesized voiceover lectures, mint 1600px provenance certificates, and log collector stamps.',
      accent: 'border-[#0E0E0E] text-[#0E0E0E]',
      badgeColor: 'text-[#0E0E0E] border-[#0E0E0E] bg-white',
      btnBg: 'bg-white hover:bg-[#FFD400] text-[#0E0E0E] font-bold border-2 border-[#0E0E0E] shadow-[3px_3px_0px_#0E0E0E]',
      href: '/museum',
      ctaText: 'Browse Specimen Vault',
      soundFn: () => playChime(),
      features: [
        '24 verified academic museum records',
        'Client-side 1600px certificate PNG minting',
        'Curatorial explorer ranks & passport stamps',
      ],
      previewGraphic: (
        <div className="w-full h-40 bg-[#0E0E0E] border-2 border-[#0E0E0E] p-3 relative overflow-hidden flex flex-col justify-between text-[#F2EDE4] select-none">
          {/* Top Status */}
          <div className="flex justify-between items-center text-[10px] font-mono font-bold z-10">
            <span className="text-[#FFD400] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400] animate-pulse" />
              ARCHIVAL VAULT
            </span>
            <span className="text-white/60">24 VERIFIED</span>
          </div>

          {/* Specimen Matrix & Barcode Visual */}
          <div className="relative flex-1 flex flex-col justify-center gap-1.5 my-1">
            {/* Specimen Progress Grid */}
            <div className="grid grid-cols-6 gap-1 px-1">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 border border-[#0E0E0E] ${
                    i % 3 === 0
                      ? 'bg-[#FFD400]'
                      : i % 2 === 0
                      ? 'bg-white'
                      : 'bg-neutral-700'
                  }`}
                />
              ))}
            </div>
            {/* Barcode Graphic */}
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex gap-0.5 items-end h-4">
                {[3, 6, 2, 8, 4, 7, 3, 5, 8, 2, 6, 4, 7, 5, 3].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-white"
                    style={{ height: `${h * 2}px` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[9px] text-[#FFD400] font-bold">
                ISO-21127
              </span>
            </div>
          </div>

          {/* Bottom Telemetry */}
          <div className="flex justify-between items-center text-[9px] font-mono text-[#F2EDE4]/80 z-10 border-t border-[#F2EDE4]/20 pt-1">
            <span>PROVENANCE MINTING</span>
            <span className="text-[#FFD400] font-bold">1600PX PNG</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full bg-[#F2EDE4] text-[#0E0E0E] py-28 px-6 md:px-12 lg:px-20 border-b-3 border-[#0E0E0E] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-[#FFD400] border border-[#0E0E0E] inline-block animate-ping" />
              <span className="px-3 py-1 bg-white text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#0E0E0E]">
                SIMULATION SUITE // 01–04
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-space uppercase tracking-tight text-[#0E0E0E] mt-1">
              Four Flagship 3D Environments
            </h2>
            <p className="text-[#0E0E0E]/80 font-space text-sm sm:text-base max-w-2xl mt-2 font-normal">
              Four hardware-accelerated WebGL environments engineered to bring 4.54 billion years of planetary
              relics into tactile, real-time spatial exploration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#0E0E0E] font-bold uppercase px-3 py-1.5 bg-white border-2 border-[#0E0E0E] shadow-[2px_2px_0px_#0E0E0E] hidden sm:inline tracking-wider">
              WebGL 2.0 • 60 FPS HDR
            </span>
          </div>
        </div>

        {/* 4 Flagship Simulation Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portals.map((portal) => (
            <div
              key={portal.id}
              className="portal-card bg-white border-3 border-[#0E0E0E] flex flex-col justify-between p-6 sm:p-7 shadow-[6px_6px_0px_#0E0E0E] hover:shadow-[10px_10px_0px_#FFD400] hover:-translate-y-2 active:translate-y-0.5 active:shadow-[2px_2px_0px_#0E0E0E] transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group relative overflow-hidden will-change-transform"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border-2 border-[#0E0E0E] ${portal.badgeColor}`}
                  >
                    {portal.protocol}
                  </span>
                  <span className="font-mono text-[9px] text-[#0E0E0E]/70 font-bold">
                    {portal.fps}
                  </span>
                </div>

                {/* Simulation Preview Box */}
                <div className="mb-5">{portal.previewGraphic}</div>

                <h3 className="text-xl font-bold font-space uppercase text-[#0E0E0E] mb-2 group-hover:text-[#B3261E] transition-colors leading-snug">
                  {portal.title}
                </h3>

                <p className="text-[#0E0E0E]/75 text-xs font-space leading-relaxed mb-5 font-normal">
                  {portal.description}
                </p>

                {/* Feature Bullet Points */}
                <div className="space-y-1.5 font-mono text-[10px] text-[#0E0E0E] border-t-2 border-[#0E0E0E]/15 pt-4 mb-6">
                  {portal.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[#0E0E0E] font-bold bg-[#FFD400] px-1 text-[9px] border border-[#0E0E0E]">✓</span>
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={portal.href}
                onClick={portal.soundFn}
                onMouseEnter={() => playHover()}
                className={`w-full py-3.5 ${portal.btnBg} font-mono text-xs font-bold uppercase tracking-wider text-center transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1`}
                data-cursor
                data-label="PORTAL"
              >
                <span>{portal.ctaText}</span>
                <span className="font-bold">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
