'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import { useLoginStore } from '@/stores/useLoginStore';
import { useLoginAudio } from '@/hooks/useLoginAudio';

/* ═══════════════════════════════════════════════════════
   SCENE 6 — THE GRAND MUSEUM HALL GALLERY DASHBOARD
   Instead of an abrupt redirect, authentication opens the
   main museum hall where features are interactive exhibits!

   Exhibits:
   🏺 Gallery     — Specimen archive & 3D specimens
   📜 Collections — Epoch timelines & curated artifacts
   🗺 Explore     — Interactive origin map & spatial scale
   🎨 Exhibitions — Material degradation & degradation sandbox
   ⚙ Settings    — Performance, audio & graphics preferences
   ═══════════════════════════════════════════════════════ */

interface ExhibitItem {
  id: string;
  icon: string;
  title: string;
  code: string;
  description: string;
  href: string;
  badge: string;
}

const EXHIBITS: ExhibitItem[] = [
  {
    id: 'gallery',
    icon: '🏺',
    title: 'Gallery Archive',
    code: 'EXHIBIT // 01',
    description: 'Explore 24 verified specimens spanning 3.8 billion years of Earth history.',
    href: '/museum',
    badge: '24 SPECIMENS',
  },
  {
    id: 'collections',
    icon: '📜',
    title: 'Geological Epochs',
    code: 'EXHIBIT // 02',
    description: 'Chrono-timeline from Primordial Soup to Modern Human Civilization.',
    href: '/evolution',
    badge: '5 EPOCHS',
  },
  {
    id: 'explore',
    icon: '🗺',
    title: 'Topographic Origin Map',
    code: 'EXHIBIT // 03',
    description: 'Interactive global discovery coordinates and spatial distribution matrix.',
    href: '/#origin-map',
    badge: 'SPATIAL DATA',
  },
  {
    id: 'exhibitions',
    icon: '🎨',
    title: 'Material Degradation',
    code: 'EXHIBIT // 04',
    description: 'Real-time specimen decay sandbox and environmental simulation.',
    href: '/#degradation-sandbox',
    badge: 'SANDBOX',
  },
  {
    id: 'settings',
    icon: '⚙',
    title: 'System Preferences',
    code: 'EXHIBIT // 05',
    description: 'Audio soundscape, spatial audio, and high-performance WebGL settings.',
    href: '/#settings',
    badge: 'CONFIGURATION',
  },
];

export default function MuseumGalleryDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const scene = useLoginStore((s) => s.scene);
  const reducedMotion = useLoginStore((s) => s.reducedMotion);
  const email = useLoginStore((s) => s.email);
  const { playKeystroke } = useLoginAudio();

  // Entrance animation when entering GALLERY scene
  useEffect(() => {
    if (scene !== 'GALLERY' || !containerRef.current) return;

    const tl = gsap.timeline();

    // 1. Container fade in
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    });

    // 2. Title & badge reveal
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.3',
      );
    }

    // 3. Stagger exhibit cards entrance
    const validCards = cardsRef.current.filter(Boolean);
    if (validCards.length > 0) {
      tl.fromTo(
        validCards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
        },
        '-=0.2',
      );
    }

    return () => { tl.kill(); };
  }, [scene, reducedMotion]);

  const permitId = React.useMemo(() => Math.floor(100000 + Math.random() * 900000), []);

  if (scene !== 'GALLERY') return null;

  const visitorName = email.trim() ? email.split('@')[0].toUpperCase() : 'VISITOR';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#05060a] text-[#f5f0e8] overflow-y-auto px-6 py-12 md:py-16 hide-scrollbar flex flex-col justify-between"
      style={{ opacity: 0 }}
    >
      {/* ── Background Grid & Light Effects ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2438_1px,transparent_1px),linear-gradient(to_bottom,#1f2438_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-[#ffd700]/10 via-[#ffd700]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* ── Header Bar ── */}
        <div ref={titleRef} className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-3 border-[#1a1a1a]">
            <div>
              <span className="px-3 py-1 bg-[#ffd700] text-black font-mono text-xs font-extrabold uppercase tracking-[0.2em] shadow-[3px_3px_0px_#000] inline-block mb-3">
                [ ACCESS GRANTED // PERMIT #{permitId} ]
              </span>
              <h1 className="text-3xl md:text-5xl font-black font-outfit uppercase tracking-tight text-white flex items-center gap-4">
                Welcome, {visitorName}
              </h1>
              <p className="text-sm font-space text-neutral-400 mt-2">
                You stand in the Central Hall of Museo. Select an exhibit below to begin exploration.
              </p>
            </div>

            <Link
              href="/museum"
              className="px-6 py-3 bg-[#ffd700] text-black border-3 border-black font-mono text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_#000] hover:bg-white hover:text-black hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              onClick={() => playKeystroke()}
            >
              Enter Specimen Gallery ↗
            </Link>
          </div>
        </div>

        {/* ── Exhibit Pedestals Grid (Scene 6 Exhibits) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {EXHIBITS.map((exhibit, index) => (
            <Link
              key={exhibit.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              href={exhibit.href}
              className="group relative bg-[#0d0f18] border-3 border-black p-6 md:p-8 flex flex-col justify-between shadow-[6px_6px_0px_#000000] hover:shadow-[10px_10px_0px_#ffd700] hover:border-[#ffd700] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
              onClick={() => playKeystroke()}
            >
              {/* Exhibit Top Bar */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffd700] bg-black px-2.5 py-1 border border-[#ffd700]/40">
                    {exhibit.code}
                  </span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-900 px-2 py-1 border border-neutral-800">
                    {exhibit.badge}
                  </span>
                </div>

                {/* Exhibit Icon & Title */}
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 origin-left">
                  {exhibit.icon}
                </div>
                <h3 className="text-2xl font-black font-outfit uppercase tracking-tight text-white group-hover:text-[#ffd700] transition-colors mb-3">
                  {exhibit.title}
                </h3>
                <p className="text-xs font-space leading-relaxed text-neutral-400 group-hover:text-neutral-200 transition-colors">
                  {exhibit.description}
                </p>
              </div>

              {/* Exhibit Pedestal Action Footer */}
              <div className="mt-8 pt-4 border-t-2 border-neutral-800 flex items-center justify-between font-mono text-xs font-bold uppercase text-[#ffd700]">
                <span>INSPECT EXHIBIT</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Footer Status Strip ── */}
      <div className="max-w-7xl mx-auto w-full mt-12 pt-6 border-t-2 border-neutral-900 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-neutral-500">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SESSION ACTIVE // SINGLE DATA LAYER SYNCED</span>
        </div>
        <span>MUSEO DIGITAL ARCHIVE // 2026</span>
      </div>
    </div>
  );
}
