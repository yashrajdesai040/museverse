'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { AntikytheraModel } from '@/components/canvas/AntikytheraModel';

const TOTAL_FRAMES = 240;

function getFramePath(index: number): string {
  const padded = String(Math.max(0, Math.min(TOTAL_FRAMES - 1, index))).padStart(6, '0');
  return `/frames/frame_${padded}.jpg`;
}

// 4 Major Epoch Panels for the Horizontal Track
const HORIZONTAL_PANELS = [
  {
    id: 'panel-1',
    stageNumber: '01',
    bgNumber: '01',
    era: '3.8 BILLION Y.A. — ARCHEAN EON',
    title: 'THE PRIMORDIAL OCEANS & FIRST LIFE',
    description: 'RNA/DNA emergence, hydrothermal deep-sea vents, and ancient cyanobacteria building the earliest oxygenating Stromatolite mats.',
    badge: 'STAGE 01',
    specimen: {
      name: 'Pilbara Stromatolite',
      location: 'Western Australian Museum',
      age: '3.48 Billion Years Old',
      link: '/museum/stromatolite-pilbara',
    },
    accent: '#00f0ff',
  },
  {
    id: 'panel-2',
    stageNumber: '02',
    bgNumber: '02',
    era: '252 TO 66 MILLION Y.A. — MESOZOIC',
    title: 'THE AGE OF DINOSAURS & REPTILES',
    description: 'Pangaea supercontinent breakup, lush flora expansion, and apex reptilian dominance across land, sea, and air.',
    badge: 'STAGE 02',
    specimen: {
      name: '"Sue" the T. rex',
      location: 'Field Museum, Chicago',
      age: '90% Complete Skeleton',
      link: '/museum/trex-sue',
    },
    accent: '#ffd700',
  },
  {
    id: 'panel-3',
    stageNumber: '03',
    bgNumber: '03',
    era: '66 TO 15,000 Y.A. — CENOZOIC',
    title: 'IMPACT EXTINCTION & RISE OF MAMMALS',
    description: 'The Chicxulub asteroid strike erased non-avian dinosaurs, clearing the biosphere for rapid mammalian diversification and Ice Age megafauna.',
    badge: 'STAGE 03-04',
    specimen: {
      name: 'Lyuba Woolly Mammoth',
      location: 'Shemanovsky Museum',
      age: '42,000 Years Old (Intact Permafrost)',
      link: '/museum/mammoth-lyuba',
    },
    accent: '#ff9900',
  },
  {
    id: 'panel-4',
    stageNumber: '04',
    bgNumber: '04',
    era: '300,000 Y.A. TO PRESENT — ANTHROPOCENE',
    title: 'DAWN OF MANKIND & HUMAN HISTORY',
    description: 'From fire creation and ancient bronze analog computers to modern digital archives — human history recorded on a shared axis.',
    badge: 'STAGE 05',
    hasReal3DModel: true,
    specimen: {
      name: 'Antikythera Mechanism',
      location: 'National Museum, Athens',
      age: '2,100 Years Old (First Computer)',
      link: '/museum/antikythera-mechanism',
    },
    accent: '#00ffaa',
  },
];

export function HorizontalScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload video frames asynchronously
  useEffect(() => {
    let active = true;
    const images: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (!active) return;
        count++;
        if (count >= 10 && !isLoaded) {
          setIsLoaded(true);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;
    return () => {
      active = false;
    };
  }, [isLoaded]);

  // Draw current frame on canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;

    let drawW = w;
    let drawH = h;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawH = w / imgRatio;
      offsetY = (h - drawH) / 2;
    } else {
      drawW = h * imgRatio;
      offsetX = (w - drawW) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrame);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrame, drawFrame]);

  // Redraw when frame updates
  useEffect(() => {
    drawFrame(currentFrame);
  }, [currentFrame, drawFrame]);

  // GSAP Horizontal Pinned ScrollTrigger
  useGSAP(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const totalPanels = HORIZONTAL_PANELS.length;
    const xOffset = -((totalPanels - 1) / totalPanels) * 100;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${window.innerWidth * (totalPanels - 0.5)}`,
      pin: true,
      scrub: 0.8,
      onUpdate: (self) => {
        const prog = self.progress;
        setScrollProgress(prog);

        // Update horizontal position
        gsap.set(track, { xPercent: prog * xOffset });

        // Parallax background numbers
        gsap.set('.parallax-bg-num', {
          xPercent: prog * -120,
        });

        // Update frame index (0 to 239)
        const frameIdx = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(prog * (TOTAL_FRAMES - 1))
        );
        setCurrentFrame(frameIdx);

        // Update active panel index (0 to 3)
        const pIdx = Math.min(
          totalPanels - 1,
          Math.floor(prog * totalPanels)
        );
        setActivePanelIndex(pIdx);
      },
    });

    scrollTriggerRef.current = st;

    return () => {
      st.kill();
    };
  }, { scope: sectionRef });

  // Direct panel jump handler on indicator click
  const jumpToPanel = (panelIndex: number) => {
    const st = scrollTriggerRef.current;
    if (!st) return;
    const totalPanels = HORIZONTAL_PANELS.length;
    const targetProgress = panelIndex / (totalPanels - 1);
    const targetScroll = st.start + targetProgress * (st.end - st.start);

    gsap.to(window, {
      scrollTo: targetScroll,
      duration: 1.2,
      ease: 'power2.inOut',
    });
  };

  const progressPct = Math.round(scrollProgress * 100);
  const currentPanel = HORIZONTAL_PANELS[activePanelIndex];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#05060a] text-white border-b-3 border-black overflow-hidden font-space"
    >
      {/* ── Dynamic Ambient Color Glow Backdrop ── */}
      <div
        className="absolute inset-0 z-0 opacity-25 transition-colors duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 60% 50%, ${currentPanel.accent} 0%, transparent 65%)`,
        }}
      />

      {/* ── Background Video Frame Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-45 mix-blend-luminosity"
      />

      {/* ── Dark Vignette Gradient Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/90 pointer-events-none z-10" />

      {/* ── TOP HUD HEADER BAR ── */}
      <div className="absolute top-6 left-6 right-6 z-30 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <span
          className="px-3 py-1 bg-black font-mono font-bold text-[10px] uppercase tracking-[0.15em] border-2 shadow-[3px_3px_0px_#000] transition-colors duration-300"
          style={{ borderColor: currentPanel.accent, color: currentPanel.accent }}
        >
          [ HORIZONTAL TIMELINE — 4.5B Y.A. TO PRESENT ]
        </span>

        <div className="flex items-center gap-3 font-mono text-[10px] pointer-events-auto">
          <span className="px-3 py-1 bg-black/80 border border-neutral-700 text-neutral-400 uppercase tracking-widest hidden sm:inline-block">
            FRAME: {String(currentFrame + 1).padStart(3, '0')} / {TOTAL_FRAMES}
          </span>
          <span
            className="px-3 py-1 text-black font-bold uppercase tracking-widest border border-black shadow-[2px_2px_0px_#000] transition-colors duration-300"
            style={{ backgroundColor: currentPanel.accent }}
          >
            {currentPanel.badge}
          </span>
        </div>
      </div>

      {/* ── 4-PANEL HORIZONTAL TRACK ── */}
      <div
        ref={trackRef}
        className="relative z-20 flex h-full w-[400vw] will-change-transform"
      >
        {HORIZONTAL_PANELS.map((panel, idx) => (
          <div
            key={panel.id}
            className="w-[100vw] h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 relative select-none"
          >
            {/* Parallax Background Number (Stroke outline) */}
            <span className="parallax-bg-num absolute right-12 bottom-12 font-outfit text-[18vw] font-black text-transparent stroke-text opacity-10 pointer-events-none leading-none select-none">
              {panel.bgNumber}
            </span>

            <div className="max-w-2xl bg-black/85 p-8 md:p-12 border-3 border-black shadow-[14px_14px_0px_#000] backdrop-blur-md relative overflow-hidden">
              {/* Accent top border stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-2 transition-colors duration-500"
                style={{ backgroundColor: panel.accent }}
              />

              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-mono text-4xl font-extrabold"
                  style={{ color: panel.accent }}
                >
                  {panel.stageNumber}
                </span>
                <span
                  className="font-mono text-xs font-bold uppercase tracking-widest"
                  style={{ color: panel.accent }}
                >
                  {panel.era}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-outfit text-white uppercase leading-tight mb-6 variable-heading">
                {panel.title}
              </h2>

              <p className="text-sm md:text-base font-space text-neutral-300 leading-relaxed font-medium mb-8">
                {panel.description}
              </p>

              {/* Panel 4 Embedded Real 3D Canvas Model Widget */}
              {panel.hasReal3DModel ? (
                <div className="bg-neutral-950 p-5 border-2 border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="w-full sm:w-36 h-36 relative bg-[#1a1a1a] border border-neutral-700 overflow-hidden cursor-grab active:cursor-grabbing">
                    <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 1.5]}>
                      <ambientLight intensity={1.5} color="#ffffff" />
                      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#00ffaa" />
                      <AntikytheraModel factor={0.65} />
                      <OrbitControls enableZoom={false} enablePan={false} />
                    </Canvas>
                    <span className="absolute bottom-1 left-1.5 text-[8px] font-mono text-white/70 uppercase">
                      3D Interactive
                    </span>
                  </div>

                  <div className="flex-1">
                    <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest mb-1">
                      Featured Specimen Record
                    </span>
                    <p className="text-base font-bold font-outfit text-white">
                      {panel.specimen.name}
                    </p>
                    <p className="text-xs font-mono text-neutral-400 mt-1 mb-4">
                      {panel.specimen.location} &bull; {panel.specimen.age}
                    </p>
                    <Link
                      href={panel.specimen.link}
                      className="inline-block px-4 py-2 bg-[#00ffaa] hover:bg-white text-black border-2 border-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_#000]"
                    >
                      Inspect Specimen ↗
                    </Link>
                  </div>
                </div>
              ) : (
                /* Standard Specimen Callout Card */
                <div className="bg-neutral-900/95 p-5 border-2 border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest mb-1">
                      Featured Specimen Record
                    </span>
                    <p className="text-base font-bold font-outfit text-white">
                      {panel.specimen.name}
                    </p>
                    <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                      {panel.specimen.location} &bull; {panel.specimen.age}
                    </p>
                  </div>

                  <Link
                    href={panel.specimen.link}
                    className="px-4 py-2.5 bg-black hover:bg-[#ffd700] hover:text-black text-white border-2 border-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_#fff] whitespace-nowrap text-center"
                  >
                    Inspect Specimen ↗
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM INTERACTIVE TIMELINE CONTROLS ── */}
      <div className="absolute bottom-6 left-6 right-6 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Progress bar */}
        <div className="flex-1 flex items-center gap-4">
          <span
            className="font-mono text-xs font-bold transition-colors duration-300"
            style={{ color: currentPanel.accent }}
          >
            0%
          </span>
          <div className="flex-1 h-3 bg-neutral-900 border-2 border-neutral-700 overflow-hidden relative">
            <div
              className="h-full transition-all duration-150 ease-out"
              style={{
                width: `${progressPct}%`,
                backgroundColor: currentPanel.accent,
              }}
            />
          </div>
          <span
            className="font-mono text-xs font-bold transition-colors duration-300"
            style={{ color: currentPanel.accent }}
          >
            100%
          </span>
        </div>

        {/* Clickable Panel Jump Indicators & Arrow Controls */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            disabled={activePanelIndex === 0}
            onClick={() => jumpToPanel(Math.max(0, activePanelIndex - 1))}
            className="px-3 py-1 bg-black/80 text-white border-2 border-neutral-700 hover:border-white disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-bold uppercase transition-all shadow-[2px_2px_0px_#000]"
            title="Previous Era"
          >
            ← Prev
          </button>

          <div className="flex items-center gap-2">
            {HORIZONTAL_PANELS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => jumpToPanel(i)}
                className={`w-3.5 h-3.5 border border-black transition-all cursor-pointer ${
                  i === activePanelIndex ? 'scale-125 shadow-[2px_2px_0px_#000]' : 'bg-neutral-800 hover:bg-neutral-600'
                }`}
                style={{
                  backgroundColor: i === activePanelIndex ? p.accent : undefined,
                }}
                title={`Jump to ${p.era}`}
              />
            ))}
          </div>

          <button
            disabled={activePanelIndex === HORIZONTAL_PANELS.length - 1}
            onClick={() => jumpToPanel(Math.min(HORIZONTAL_PANELS.length - 1, activePanelIndex + 1))}
            className="px-3 py-1 bg-black/80 text-white border-2 border-neutral-700 hover:border-white disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-bold uppercase transition-all shadow-[2px_2px_0px_#000]"
            title="Next Era"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
