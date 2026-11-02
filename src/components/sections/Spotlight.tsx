'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { entities } from '@/data/entities';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AntikytheraModel } from '@/components/canvas/AntikytheraModel';
import { useAppStore } from '@/stores/useAppStore';
import { useGlobalSound } from '@/hooks/useGlobalSound';

export default function Spotlight() {
  const entity = entities.find((e) => e.id === 'antikythera-mechanism') || entities[0];
  const performanceMode = useAppStore((s) => s.performanceMode);
  const { openEntityModal } = useAppStore();
  const isHighQuality = performanceMode === 'high';
  const { playClick, playLaser, playHover } = useGlobalSound();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!entity) return null;

  return (
    <section className="border-b-3 border-[#0E0E0E] bg-[#F2EDE4] text-[#0E0E0E] px-6 py-28 md:px-12 lg:px-20 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-12 items-center relative z-10">
        {/* 3D Model Pedestal: 7 Columns */}
        <div
          ref={containerRef}
          className="spotlight-canvas-col lg:col-span-7 relative flex aspect-square sm:aspect-[4/3] items-center justify-center bg-white border-3 border-[#0E0E0E] p-0 overflow-hidden shadow-[8px_8px_0px_#0E0E0E] group"
        >
          {/* Bauhaus Corner Reticles */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-3 border-l-3 border-[#0E0E0E] z-20 pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-3 border-r-3 border-[#0E0E0E] z-20 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-3 border-l-3 border-[#0E0E0E] z-20 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-3 border-r-3 border-[#0E0E0E] z-20 pointer-events-none" />

          {/* Pedestal Status Banner */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#0E0E0E] font-bold bg-[#FFD400] px-2.5 py-1 border-2 border-[#0E0E0E] shadow-[2px_2px_0px_#0E0E0E]">
              3D HOLOGRAPHIC PEDESTAL
            </span>
            <span className="font-mono text-[10px] text-[#0E0E0E] font-bold bg-white px-2.5 py-1 border-2 border-[#0E0E0E] shadow-[2px_2px_0px_#0E0E0E]">
              30+ BRONZE DIFFERENTIAL GEARS
            </span>
          </div>

          {/* Bauhaus Blueprint Precision Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden bg-[radial-gradient(#0E0E0E_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFD400]/5 to-transparent" />
          </div>

          {/* Three.js Canvas container */}
          <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas
              frameloop={isVisible ? 'always' : 'never'}
              camera={{ position: [0, 0, 5], fov: 45 }}
              dpr={isHighQuality ? [1, 1.5] : [1, 1]}
              gl={{
                powerPreference: isHighQuality ? 'high-performance' : 'low-power',
                antialias: isHighQuality,
                alpha: true,
              }}
            >
              <ambientLight intensity={1.8} color="#ffffff" />
              <directionalLight position={[5, 8, 5]} intensity={3.5} color="#fff8e7" />
              <directionalLight position={[-5, -4, -2]} intensity={1.6} color="#e0f2fe" />
              <AntikytheraModel factor={0.65} />
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                maxDistance={8}
                minDistance={2}
                autoRotate={autoRotate}
                autoRotateSpeed={1.5}
              />
            </Canvas>
          </div>

          {/* Interactive Overlay Toolbar */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-auto">
            <div className="bg-[#0E0E0E] text-[#F2EDE4] px-3 py-1.5 border-2 border-[#0E0E0E] text-[10px] font-mono uppercase tracking-widest shadow-[2px_2px_0px_#FFD400] font-bold">
              ↔ Drag to Orbit 360° • Scroll to Zoom
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClick();
                  setAutoRotate(!autoRotate);
                }}
                className="bg-white hover:bg-[#FFD400] text-[#0E0E0E] px-2.5 py-1.5 border-2 border-[#0E0E0E] font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0px_#0E0E0E] cursor-pointer transition-colors"
              >
                {autoRotate ? 'PAUSE ROTATION' : 'RESUME ROTATION'}
              </button>

              <button
                onClick={() => {
                  playLaser();
                  openEntityModal(entity.id);
                }}
                className="bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] px-2.5 py-1.5 border-2 border-[#0E0E0E] font-mono text-[10px] font-extrabold uppercase shadow-[2px_2px_0px_#0E0E0E] cursor-pointer transition-colors"
              >
                FULL 3D VIEWER ↗
              </button>
            </div>
          </div>
        </div>

        {/* Curatorial Text Placard: 5 Columns */}
        <div className="spotlight-text-col lg:col-span-5 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 mb-4 self-start">
            <span className="w-2.5 h-2.5 bg-[#FFD400] border border-[#0E0E0E] animate-ping" />
            <span className="px-3 py-1 bg-white text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#0E0E0E]">
              CURATORIAL OBJECT OF FOCUS
            </span>
          </div>

          <h2 className="mb-3 font-space text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-[#0E0E0E] leading-tight">
            {entity.name}
          </h2>

          <div className="font-mono text-xs text-[#0E0E0E] mb-6 font-bold flex flex-wrap gap-x-3 gap-y-1">
            <span className="bg-[#FFD400] px-2 py-0.5 border border-[#0E0E0E]">
              PERIOD: {entity.periodLabel.toUpperCase()}
            </span>
            <span className="bg-white px-2 py-0.5 border border-[#0E0E0E]">
              AGE: ~150 B.C. (2,150 YA)
            </span>
          </div>

          <p className="text-[#0E0E0E]/80 font-space text-sm sm:text-base leading-relaxed mb-6 font-normal">
            {entity.significance}
          </p>

          <div className="p-5 bg-white border-3 border-[#0E0E0E] font-mono text-xs text-[#0E0E0E] space-y-2 mb-8 shadow-[4px_4px_0px_#0E0E0E]">
            <div className="flex justify-between border-b-2 border-[#0E0E0E]/15 pb-2">
              <span className="text-[#0E0E0E]/60 uppercase font-bold">DISCOVERY LOCUS:</span>
              <span className="font-bold">{entity.placeOfDiscovery || 'Antikythera Shipwreck, Greece'}</span>
            </div>
            <div className="flex justify-between border-b-2 border-[#0E0E0E]/15 pb-2">
              <span className="text-[#0E0E0E]/60 uppercase font-bold">CURRENT LOCUS:</span>
              <span className="font-bold">{entity.currentLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#0E0E0E]/60 uppercase font-bold">CONSERVATION STATUS:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-1 border border-emerald-800">
                {entity.condition} (PBR Bronze Shader)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`/museum/${entity.id}`}
              onClick={() => playLaser()}
              onMouseEnter={() => playHover()}
              className="px-7 py-4 bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] font-extrabold font-mono text-xs uppercase tracking-wider border-3 border-[#0E0E0E] shadow-[4px_4px_0px_#0E0E0E] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#0E0E0E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
              data-cursor
              data-label="MONOGRAPH"
            >
              <span>Examine Full Catalog Record</span>
              <span className="font-bold">→</span>
            </Link>

            <Link
              href="/compare"
              onClick={() => playClick()}
              onMouseEnter={() => playHover()}
              className="px-6 py-4 bg-white hover:bg-[#F2EDE4] text-[#0E0E0E] border-3 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#0E0E0E] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#0E0E0E] transition-all flex items-center gap-2 cursor-pointer"
              data-cursor
              data-label="CHRONO LAB"
            >
              <span>Inspect in Chrono Lab</span>
              <span>⚖️</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
