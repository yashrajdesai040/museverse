'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '@/stores/useAppStore';
import { getEntityById, entities } from '@/data/entities';
import { isCulturalArtifact, isFossil, MuseumEntity } from '@/types/museum';
import { Specimen3DViewer, LightingPreset, SPECIMEN_HOTSPOTS } from '@/components/canvas/Specimen3DViewer';
import { ModelLoaderOverlay } from '@/components/canvas/ModelLoader';
import { ArchivalCertificateModal } from '@/components/certificate/ArchivalCertificateModal';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { useCollectorStore } from '@/stores/useCollectorStore';
import { gsap, useGSAP } from '@/lib/gsap';
import { getMuseumProvenance } from '@/utils/museumLinks';
import Link from 'next/link';

// ─── Helper: format years-ago cleanly ──────────────────────────────────────
function fmtAge(years: number): string {
  if (years >= 1_000_000_000) return `${(years / 1_000_000_000).toFixed(1)}B Years Ago`;
  if (years >= 1_000_000)     return `${(years / 1_000_000).toFixed(1)} Million Years Ago`;
  if (years >= 1_000)         return `${(years / 1_000).toFixed(0)},000 Years Ago`;
  return `${years.toLocaleString()} Years Ago`;
}

// ─── Main Modal ─────────────────────────────────────────────────────────────
export function EntityDetailModal() {
  const { activeEntityId, closeEntityModal, openEntityModal, performanceMode } = useAppStore();
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('dramatic');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [cameraKey, setCameraKey] = useState(0);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [snapshotDataUrl, setSnapshotDataUrl] = useState<string | null>(null);

  const { playClick, playInspect, playMintCert, playStamp, playBookmark } = useGlobalSound();

  // Reset viewer inspection state when entity changes
  useEffect(() => {
    setWireframe(false);
  }, [activeEntityId]);

  // Collector Store integration
  const { stamps, toggleStamp, init: initCollector } = useCollectorStore();

  useEffect(() => {
    initCollector();
  }, [initCollector]);

  // Refs for GSAP & Canvas
  const backdropRef        = useRef<HTMLDivElement>(null);
  const panelRef           = useRef<HTMLDivElement>(null);
  const modalContentRef    = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const entityIndex = entities.findIndex((e) => e.id === activeEntityId);
  const entity      = activeEntityId ? getEntityById(activeEntityId) : null;
  const isHighQ     = performanceMode === 'high';
  const provenance  = getMuseumProvenance(entity?.currentLocation, entity?.id);
  const discoveryLocality = entity
    ? entity.placeOfDiscovery || (isCulturalArtifact(entity) ? entity.origin : undefined) || 'Archival Field Locality'
    : 'Archival Field Locality';

  const isStamped = entity ? stamps.includes(entity.id) : false;

  const handleToggleStamp = () => {
    if (!entity) return;
    const isNowStamped = toggleStamp(entity.id);
    if (isNowStamped) {
      playStamp();
    } else {
      playBookmark();
    }
  };

  const handleOpenCertificate = () => {
    playMintCert();
    try {
      const canvas = canvasContainerRef.current?.querySelector('canvas');
      if (canvas) {
        setSnapshotDataUrl(canvas.toDataURL('image/png'));
      }
    } catch (err) {
      console.warn('Canvas snapshot error:', err);
    }
    setIsCertOpen(true);
  };

  // ─── Keyboard: Escape + Arrow navigation ──────────────────────────────
  useEffect(() => {
    if (!activeEntityId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEntityModal();
      if (e.key === 'ArrowRight' && entityIndex < entities.length - 1)
        openEntityModal(entities[entityIndex + 1].id);
      if (e.key === 'ArrowLeft' && entityIndex > 0)
        openEntityModal(entities[entityIndex - 1].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeEntityId, entityIndex, closeEntityModal, openEntityModal]);

  // ─── Entrance: Backdrop fade + Panel scale-up ─────────────────────────
  useGSAP(() => {
    if (!activeEntityId || !backdropRef.current || !panelRef.current) return;

    // Backdrop fades in over 150ms
    gsap.fromTo(backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.15, ease: 'none' }
    );

    // Panel scales up 0.96→1 over 200ms, starts immediately
    gsap.fromTo(panelRef.current,
      { opacity: 0, scale: 0.96, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: 'power2.out' }
    );
  }, { dependencies: [activeEntityId] });

  // ─── Top-to-bottom text assembly stagger (30ms between items) ─────────
  useGSAP(() => {
    if (!entity || !modalContentRef.current) return;

    // Reset to invisible first (handles entity switching)
    gsap.set('.modal-stagger-item', { opacity: 0, y: 14 });

    // Staggered reveal: each item 30ms apart
    gsap.to('.modal-stagger-item', {
      opacity: 1,
      y: 0,
      duration: 0.32,
      stagger: 0.03,
      ease: 'power2.out',
      delay: 0.1, // slight delay after panel entrance
    });
  }, { scope: modalContentRef, dependencies: [activeEntityId] });

  if (!activeEntityId || !entity) return null;

  return (
    // ── Backdrop ───────────────────────────────────────────────────────
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[99990] bg-[#1a1a1a]/95 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
      onClick={(e) => { if (e.target === e.currentTarget) closeEntityModal(); }}
    >
      {/* ── Modal Panel: Strict bounds with no border overflow ──────── */}
      <div
        ref={panelRef}
        className={`relative w-full max-w-6xl bg-[#f5f0e8] text-[#1a1a1a] border-3 border-black shadow-[14px_14px_0px_#000000] flex flex-col my-auto overflow-hidden transition-[max-height] ${
          isFullscreen ? 'h-screen max-h-screen' : 'h-[92vh] sm:h-[90vh] max-h-[92vh] sm:max-h-[90vh]'
        }`}
      >
        {/* ── Non-Colliding Curatorial Header Bar with Close Button ────── */}
        <header className="w-full bg-[#0E0E0E] text-[#F2EDE4] px-4 py-2.5 border-b-3 border-black flex items-center justify-between shrink-0 select-none z-30">
          <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD400] shadow-[0_0_8px_#FFD400] animate-pulse shrink-0" />
            <span className="text-[#FFD400] uppercase tracking-widest font-black">CURATORIAL DOSSIER</span>
            <span className="text-neutral-600 hidden sm:inline">|</span>
            <span className="text-neutral-300 font-mono text-[10px] hidden sm:inline uppercase">
              REF: {provenance.catalogId}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-[10px] font-mono text-neutral-400">
              ESC TO CLOSE • ← / → TO PAGE
            </span>
            <button
              onClick={closeEntityModal}
              className="px-2.5 py-1 bg-[#FFD400] hover:bg-white text-black font-mono font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5"
              title="Close Dossier (ESC)"
              aria-label="Close modal"
            >
              <span>CLOSE</span>
              <span className="font-black text-sm leading-none">✕</span>
            </button>
          </div>
        </header>

        {/* ── Modal Body: 3D Left Column + Dossier Right Column ──────── */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">

          {/* ════════════════════════════════════════════════════════════
              LEFT COLUMN — 58%: Interactive 3D Viewer
          ════════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[58%] h-[320px] sm:h-[380px] lg:h-full bg-[#1a1a1a] text-white relative border-b-3 lg:border-b-0 lg:border-r-3 border-black flex flex-col shrink-0 lg:shrink min-h-0">

            {/* Top bar: label + lighting switcher + 3D controls */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-1.5 p-2 bg-black/90 border-b border-neutral-800">
              <span className="px-2 py-0.5 bg-yellow-400 text-black border border-black text-[10px] font-mono font-bold uppercase shadow-[1px_1px_0px_#000]">
                3D WebGL 2.0
              </span>

              <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
                {/* Lighting presets */}
                <div className="flex items-center gap-0.5 bg-neutral-900 p-0.5 border border-neutral-700">
                  {(['museum', 'dramatic'] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        playInspect();
                        setLightingPreset(preset);
                      }}
                      className={`px-1.5 py-0.5 uppercase font-bold transition-all duration-100 cursor-pointer ${
                        lightingPreset === preset
                          ? 'bg-yellow-400 text-black'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Wireframe Mesh Toggle */}
                <button
                  onClick={() => {
                    playInspect();
                    setWireframe(!wireframe);
                  }}
                  className={`px-2 py-0.5 font-bold border transition-colors cursor-pointer ${
                    wireframe
                      ? 'bg-amber-400 text-black border-amber-300'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:text-white'
                  }`}
                  title="Toggle Wireframe Polygonal Mesh"
                >
                  {wireframe ? '🕸️ Wire ON' : '🕸️ Wire'}
                </button>

                {/* Mint Certificate */}
                <button
                  onClick={handleOpenCertificate}
                  className="px-2 py-0.5 bg-[#ffd700] hover:bg-white text-black font-bold border border-black shadow-[1px_1px_0px_#fff] cursor-pointer"
                  title="Mint Specimen Certificate"
                >
                  🖨️ Mint Cert
                </button>

                {/* Collector Passport Stamp */}
                <button
                  onClick={handleToggleStamp}
                  className={`px-2 py-0.5 font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                    isStamped
                      ? 'bg-[#ffd700] text-black border-yellow-300'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:text-white'
                  }`}
                  title={isStamped ? 'Remove from Collector Passport' : 'Stamp into Collector Passport'}
                >
                  <span>{isStamped ? '✓ Stamped' : '✦ Stamp'}</span>
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setIsFullscreen(!isFullscreen);
                  }}
                  className="px-2 py-0.5 bg-neutral-900 text-white border border-neutral-700 hover:border-yellow-400 hover:text-yellow-400 font-bold uppercase transition-colors cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? '↙' : '↗'}
                </button>
              </div>
            </div>

            {/* R3F Canvas Container */}
            <div ref={canvasContainerRef} data-lenis-prevent className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden min-h-0">
              <ModelLoaderOverlay label={`TRANSMITTING ${entity.name.toUpperCase()}...`} theme="dark" />

              {/* Navigation Hint */}
              <div className="absolute bottom-2.5 right-3 z-20 flex items-center gap-2 font-mono text-[10px] select-none">
                <span className="hidden sm:inline-block px-2 py-1 bg-black/70 text-neutral-400 border border-neutral-800 text-[9px]">
                  Orbit: Drag • Zoom: Scroll • Pan: Shift+Drag
                </span>
                <button
                  onClick={() => {
                    playClick();
                    setCameraKey((k) => k + 1);
                  }}
                  className="px-2 py-1 bg-black/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 font-bold cursor-pointer transition-colors shadow-[2px_2px_0px_#000]"
                  title="Reset Camera View"
                >
                  ⟲ Reset View
                </button>
              </div>

              <Canvas
                eventSource={canvasContainerRef as unknown as React.RefObject<HTMLElement>}
                camera={{ position: [0, 0, 5.8], fov: 42 }}
                dpr={isHighQ ? [1, 1.25] : [1, 1]}
                performance={{ min: 0.5 }}
                gl={{
                  powerPreference: 'high-performance',
                  antialias: true,
                  preserveDrawingBuffer: true,
                  stencil: false,
                }}
              >
                <Specimen3DViewer
                  key={`${entity.id}-${cameraKey}`}
                  entity={entity}
                  lightingPreset={lightingPreset}
                  autoRotate={false}
                  wireframe={wireframe}
                  explodedView={false}
                  showLaserPlane={false}
                  showCaliper={false}
                  showAnnotations={false}
                  enablePostprocessing={isHighQ && lightingPreset === 'dramatic'}
                />
              </Canvas>
            </div>

            {/* Bottom bar: navigation hint + telemetry */}
            <div className="relative z-20 flex justify-between items-center px-3 py-1.5 bg-black/90 border-t border-neutral-800 text-[10px] font-mono text-neutral-400 shrink-0">
              <span>← / → Arrow keys ({entityIndex + 1} / {entities.length})</span>
              <div className="flex items-center gap-3">
                {wireframe && <span className="text-amber-400 font-bold uppercase">WIREFRAME</span>}
                <span className="text-yellow-400 font-bold uppercase">{lightingPreset}</span>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              RIGHT COLUMN — 42%: Scrollable Archival Dossier
          ════════════════════════════════════════════════════════════ */}
          <div
            ref={modalContentRef}
            className="w-full lg:w-[42%] overflow-y-auto flex-1 p-5 sm:p-7 flex flex-col gap-5 min-h-0 bg-[#f5f0e8]"
          >
            {/* T+0ms: Category tag + period badge */}
            <div className="modal-stagger-item flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-[#0E0E0E] text-[#FFD400] font-mono font-bold border-2 border-[#0E0E0E] text-[10px] uppercase shadow-[2px_2px_0px_#0E0E0E]">
                {entity.periodLabel}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#0E0E0E] border-2 border-[#0E0E0E] px-2 py-0.5 bg-[#FFD400]">
                {isFossil(entity) ? 'FOSSIL SPECIMEN' : 'CULTURAL ARTIFACT'}
              </span>
              {entity.license && (
                <span className="text-[9px] font-mono text-[#0E0E0E]/70 border border-[#0E0E0E]/40 px-1.5 py-0.5 bg-white">
                  {entity.license}
                </span>
              )}
            </div>

            {/* T+30ms: Specimen name */}
            <h2 className="modal-stagger-item text-2xl sm:text-3xl lg:text-4xl font-bold font-space uppercase text-[#0E0E0E] leading-tight">
              {entity.name}
            </h2>

            {/* T+45ms: One-Line Hook */}
            {entity.hook && (
              <div className="modal-stagger-item p-3 bg-[#FFD400]/25 border-l-4 border-[#0E0E0E] font-space text-sm font-bold text-[#0E0E0E] italic">
                &ldquo;{entity.hook}&rdquo;
              </div>
            )}

            {/* T+60ms: 3D Digital Twin Technical Specifications Card */}
            <div className="modal-stagger-item bg-[#0E0E0E] text-[#F2EDE4] p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0px_#000]">
              <div className="flex items-center justify-between border-b border-neutral-700 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#FFD400] text-sm">📐</span>
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-[#FFD400]">
                    3D Digital Twin Telemetry
                  </h3>
                </div>
                <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 border border-neutral-600 text-[9px] font-mono font-bold uppercase">
                  PBR Standard
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-mono">
                <div>
                  <dt className="text-neutral-400 font-bold uppercase text-[10px] mb-0.5">Asset Format</dt>
                  <dd className="text-white font-bold">Khronos GLTF 2.0 (.glb)</dd>
                </div>
                <div>
                  <dt className="text-neutral-400 font-bold uppercase text-[10px] mb-0.5">Shader Pipeline</dt>
                  <dd className="text-white font-bold">Metallic-Roughness PBR</dd>
                </div>
                <div>
                  <dt className="text-neutral-400 font-bold uppercase text-[10px] mb-0.5">Texture Maps</dt>
                  <dd className="text-white font-bold">Albedo / Normal / Rough / AO</dd>
                </div>
                <div>
                  <dt className="text-neutral-400 font-bold uppercase text-[10px] mb-0.5">Color Science</dt>
                  <dd className="text-white font-bold">ACES Filmic / sRGB</dd>
                </div>
                <div className="col-span-2 pt-1 border-t border-neutral-800 flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400">Rendering Engine:</span>
                  <span className="text-white font-bold">Three.js WebGL 2.0 / R3F</span>
                </div>
                <div className="col-span-2 flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400">Digital Twin Rights:</span>
                  <span className="text-[#FFD400] font-bold">{entity.license || 'CC0 1.0 Universal'}</span>
                </div>
              </dl>
            </div>

            {/* T+70ms: Host Museum & Physical Provenance Card */}
            <div className="modal-stagger-item bg-white p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0px_#000]">
              <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏛️</span>
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-black">
                    Host Museum & Curatorial Record
                  </h3>
                </div>
                <span className="px-2 py-0.5 bg-[#FFD400] text-black border border-black text-[9px] font-mono font-bold uppercase">
                  {provenance.curatorialTier}
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-0.5">
                    Physical Host Repository
                  </span>
                  <span className="text-black font-black text-sm block">
                    {provenance.institutionName}
                  </span>
                  <span className="text-[11px] text-neutral-600 block mt-0.5">
                    📍 {provenance.cityCountry}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-0.5">
                    Curatorial Division / Department
                  </span>
                  <span className="text-black font-semibold text-xs block">
                    {provenance.archiveSection}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-neutral-200">
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-0.5">
                      Specimen Accession ID
                    </span>
                    <span className="text-black font-bold text-[11px]">
                      {provenance.catalogId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-0.5">
                      Discovery Site
                    </span>
                    <span className="text-black font-bold text-[11px]">
                      {discoveryLocality}
                    </span>
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href={provenance.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0E0E0E] hover:bg-neutral-800 text-[#FFD400] border-2 border-black font-mono font-bold text-xs uppercase transition-all shadow-[2px_2px_0px_#0E0E0E] active:translate-y-[1px]"
                  >
                    <span>🏛️ {provenance.shortName} Archive</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                  <Link
                    href={`/museum/${entity.id}`}
                    onClick={closeEntityModal}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FFD400] hover:bg-[#ffe033] text-black border-2 border-black font-mono font-bold text-xs uppercase transition-all shadow-[2px_2px_0px_#000] active:translate-y-[1px]"
                  >
                    <span>🌐 3D Gallery View</span>
                    <span className="text-[10px]">↗</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* T+80ms: Verified Story */}
            <div className="modal-stagger-item">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#0E0E0E] mb-1.5 border-b-2 border-[#0E0E0E] pb-1">
                Archival Story & Discovery
              </h3>
              <p className="text-sm text-[#0E0E0E] font-space leading-relaxed">
                {entity.story || entity.significance}
              </p>
            </div>

            {/* T+90ms: 3-5 Verified Key Facts */}
            {entity.facts && entity.facts.length > 0 && (
              <div className="modal-stagger-item p-4 bg-white border-2 border-[#0E0E0E] shadow-[3px_3px_0_#0E0E0E]">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#0E0E0E] mb-2 border-b border-[#0E0E0E] pb-1">
                  Verified Curatorial Facts
                </h3>
                <ul className="space-y-1.5">
                  {entity.facts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-space text-[#0E0E0E]">
                      <span className="text-[#FFD400] font-bold">▪</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* T+95ms: Why It Matters */}
            {entity.whyItMatters && (
              <div className="modal-stagger-item p-3 bg-[#F2EDE4] border-2 border-[#0E0E0E]">
                <span className="block text-[10px] font-mono font-bold uppercase text-[#0E0E0E]/70 mb-1">
                  WHY IT MATTERS:
                </span>
                <p className="text-xs font-space font-medium text-[#0E0E0E]">
                  {entity.whyItMatters}
                </p>
              </div>
            )}

            {/* T+100ms: General Data Table */}
            <div className="modal-stagger-item bg-white p-5 border-3 border-black shadow-[4px_4px_0px_#000]">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-black mb-3 border-b-2 border-black pb-1.5">
                General Catalog Data
              </h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs font-mono">
                <div>
                  <dt className="text-neutral-500 font-bold uppercase text-[10px] mb-0.5">Geologic / Calendar Age</dt>
                  <dd className="text-black font-bold">{entity.ageMa ? `${entity.ageMa} Ma (${fmtAge(entity.yearsAgo)})` : fmtAge(entity.yearsAgo)}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500 font-bold uppercase text-[10px] mb-0.5">Host Repository</dt>
                  <dd className="text-black font-bold">{entity.currentLocation}</dd>
                </div>
                {entity.source && (
                  <div className="col-span-2">
                    <dt className="text-neutral-500 font-bold uppercase text-[10px] mb-0.5">Verified Source</dt>
                    <dd className="text-black font-bold">{entity.source}</dd>
                  </div>
                )}
                {entity.material && (
                  <div>
                    <dt className="text-neutral-500 font-bold uppercase text-[10px] mb-0.5">Physical Material</dt>
                    <dd className="text-black font-bold">{entity.material}</dd>
                  </div>
                )}
                {entity.dimensions && (
                  <div>
                    <dt className="text-neutral-500 font-bold uppercase text-[10px] mb-0.5">Dimensions</dt>
                    <dd className="text-black font-bold">{entity.dimensions}</dd>
                  </div>
                )}
                {entity.condition && (
                  <div>
                    <dt className="text-neutral-500 font-bold uppercase text-[10px] mb-0.5">Preservation State</dt>
                    <dd className="text-black font-bold">{entity.condition}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* T+110ms: Discriminated Union — Fossil Paleontology Record */}
            {isFossil(entity) && (
              <div className="modal-stagger-item bg-yellow-400 p-5 border-3 border-black shadow-[4px_4px_0px_#000]">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-black mb-3 border-b-2 border-black pb-1.5">
                  Paleontology Record
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs font-mono">
                  <div>
                    <dt className="text-black/60 font-bold uppercase text-[10px] mb-0.5">Taxonomic Species</dt>
                    <dd className="text-black font-bold italic">{entity.species}</dd>
                  </div>
                  <div>
                    <dt className="text-black/60 font-bold uppercase text-[10px] mb-0.5">Geological Period</dt>
                    <dd className="text-black font-bold">{entity.geologicalPeriod}</dd>
                  </div>
                  {entity.placeOfDiscovery && (
                    <div className="col-span-2">
                      <dt className="text-black/60 font-bold uppercase text-[10px] mb-0.5">Discovery Site</dt>
                      <dd className="text-black font-bold">{entity.placeOfDiscovery}</dd>
                    </div>
                  )}
                  {entity.excavatedBy && (
                    <div>
                      <dt className="text-black/60 font-bold uppercase text-[10px] mb-0.5">Excavated By</dt>
                      <dd className="text-black font-bold">{entity.excavatedBy}</dd>
                    </div>
                  )}
                  {entity.discoveryDate && (
                    <div>
                      <dt className="text-black/60 font-bold uppercase text-[10px] mb-0.5">Discovery Date</dt>
                      <dd className="text-black font-bold">{entity.discoveryDate}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* T+110ms: Discriminated Union — Cultural Artifact History Record */}
            {isCulturalArtifact(entity) && (
              <div className="modal-stagger-item bg-[#c8f0ff] p-5 border-3 border-black shadow-[4px_4px_0px_#000]">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-black mb-3 border-b-2 border-black pb-1.5">
                  Cultural History Record
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs font-mono">
                  <div>
                    <dt className="text-black/60 font-bold uppercase text-[10px] mb-0.5">Origin</dt>
                    <dd className="text-black font-bold">{entity.origin}</dd>
                  </div>
                  <div>
                    <dt className="text-black/60 font-bold uppercase text-[10px] mb-0.5">Creator / Artisans</dt>
                    <dd className="text-black font-bold">{entity.creator}</dd>
                  </div>
                  {entity.commissionedBy && (
                    <div className="col-span-2">
                      <dt className="text-black/60 font-bold uppercase text-[10px] mb-0.5">Commissioned By</dt>
                      <dd className="text-black font-bold">{entity.commissionedBy}</dd>
                    </div>
                  )}
                  {entity.discoverer && (
                    <div>
                      <dt className="text-black/60 font-bold uppercase text-[10px] mb-0.5">Discoverer</dt>
                      <dd className="text-black font-bold">{entity.discoverer}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* T+120ms: Academic References */}
            {entity.references && entity.references.length > 0 && (
              <div className="modal-stagger-item">
                <span className="block text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 mb-2">
                  Academic References & Citations
                </span>
                <ul className="space-y-1">
                  {entity.references.map((ref, i) => (
                    <li key={i} className="text-[11px] font-mono text-neutral-600 pl-3 border-l-2 border-neutral-300">
                      {ref}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* T+130ms: Footer Navigation (Clean, Non-Colliding Layout) */}
            <div className="modal-stagger-item pt-4 border-t-2 border-black flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-auto bg-[#f5f0e8] pb-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/museum/${entity.id}`}
                  onClick={closeEntityModal}
                  className="flex-1 sm:flex-none text-center px-4 py-2 bg-[#FFD400] text-black hover:bg-black hover:text-white border-2 border-black font-mono font-bold text-xs uppercase transition-all shadow-[2px_2px_0px_#000]"
                >
                  Full Record ↗
                </Link>
                <Link
                  href={`/compare?item1=${entity.id}`}
                  onClick={closeEntityModal}
                  className="flex-1 sm:flex-none text-center px-3 py-2 bg-[#0055ff] text-white hover:bg-black hover:text-[#ffd700] border-2 border-black font-mono font-bold text-xs uppercase transition-all shadow-[2px_2px_0px_#000]"
                >
                  Compare 3D ⚖️
                </Link>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 font-mono text-xs font-bold">
                <button
                  disabled={entityIndex === 0}
                  onClick={() => openEntityModal(entities[entityIndex - 1].id)}
                  className="px-3 py-2 bg-white border-2 border-black hover:bg-black hover:text-white transition-all duration-100 disabled:opacity-30 disabled:cursor-not-allowed active:translate-y-[1px]"
                  title="Previous entity (←)"
                >
                  ← Prev
                </button>
                <span className="text-[10px] text-neutral-600 font-mono font-bold text-center px-1">
                  {entityIndex + 1} / {entities.length}
                </span>
                <button
                  disabled={entityIndex === entities.length - 1}
                  onClick={() => openEntityModal(entities[entityIndex + 1].id)}
                  className="px-3 py-2 bg-white border-2 border-black hover:bg-black hover:text-white transition-all duration-100 disabled:opacity-30 disabled:cursor-not-allowed active:translate-y-[1px]"
                  title="Next entity (→)"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Archival Certificate Modal ─── */}
      <ArchivalCertificateModal
        entity={entity}
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        snapshotDataUrl={snapshotDataUrl}
      />
    </div>
  );
}
