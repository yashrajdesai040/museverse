'use client';

import { useRef, useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { getEntityBySlug, entities } from '@/data/entities';
import { isCulturalArtifact, isFossil } from '@/types/museum';
import { Specimen3DViewer, LightingPreset, SpecimenHotspot } from '@/components/canvas/Specimen3DViewer';
import { ModelLoaderOverlay } from '@/components/canvas/ModelLoader';
import { MuseumAudioGuide } from '@/components/audio/MuseumAudioGuide';
import { ArchivalCertificateModal } from '@/components/certificate/ArchivalCertificateModal';
import { useAppStore } from '@/stores/useAppStore';
import { useCollectorStore } from '@/stores/useCollectorStore';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { gsap, useGSAP } from '@/lib/gsap';

export default function EntityPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const entity = getEntityBySlug(slug);
  const pageRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const {
    playClick,
    playStamp,
    playBookmark,
    playMintCert,
  } = useGlobalSound();

  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('museum');
  const [wireframe, setWireframe] = useState(false);

  // Collector Store integration
  const { stamps, toggleStamp, init: initCollector } = useCollectorStore();
  const collectedStamp = entity ? stamps.includes(entity.id) : false;

  useEffect(() => {
    initCollector();
  }, [initCollector]);

  // Certificate Modal State
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [snapshotDataUrl, setSnapshotDataUrl] = useState<string | null>(null);

  const performanceMode = useAppStore((s) => s.performanceMode);
  const isHighQ = performanceMode === 'high';

  const handleCollectStamp = () => {
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
        const dataUrl = canvas.toDataURL('image/png');
        setSnapshotDataUrl(dataUrl);
      }
    } catch (err) {
      console.warn('Canvas snapshot error:', err);
    }
    setIsCertOpen(true);
  };

  useGSAP(
    () => {
      if (!entity) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.detail-viewer',
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }
      )
        .fromTo('.detail-back', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4 }, 0.15)
        .fromTo('.detail-badge', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, 0.25)
        .fromTo(
          '.detail-name',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.35
        )
        .fromTo('.detail-significance', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, 0.45)
        .fromTo('.detail-audio', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, 0.55)
        .fromTo(
          '.detail-section',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          0.65
        );
    },
    { scope: pageRef, dependencies: [slug] }
  );

  if (!entity) {
    notFound();
  }

  // Related specimens in same era or category
  const related = entities
    .filter(
      (e) =>
        e.id !== entity.id &&
        (e.category === entity.category ||
          Math.abs(Math.log10(e.yearsAgo + 1) - Math.log10(entity.yearsAgo + 1)) < 1.5)
    )
    .slice(0, 3);

  return (
    <main
      ref={pageRef}
      className="min-h-screen bg-[#f5f0e8] text-[#1a1a1a] font-space flex flex-col lg:flex-row pt-[72px] selection:bg-yellow-200 selection:text-black"
    >
      {/* ─── LEFT COLUMN: HARDWARE 3D STUDIO VIEWER ─── */}
      <div
        className="detail-viewer w-full lg:w-1/2 h-[60vh] lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px] bg-[#0d0d0d] text-white relative border-b-3 lg:border-b-0 lg:border-r-3 border-black flex flex-col justify-between p-6 lg:p-8"
        style={{ opacity: 0 }}
      >
        {/* Top Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 z-10">
          <Link
            href="/museum"
            onClick={() => playClick()}
            className="detail-back text-xs font-mono font-bold uppercase tracking-wider text-black bg-[#ffd700] hover:bg-white hover:text-black flex items-center gap-2 transition-all px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000]"
          >
            ← Museum Gallery
          </Link>

          {/* 3D Mode & Lighting Preset Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/95 p-1.5 border-2 border-neutral-700 font-mono text-[10px] shadow-[3px_3px_0px_#000]">
            {(['museum', 'dramatic'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  playClick();
                  setLightingPreset(preset);
                }}
                className={`px-2.5 py-1 capitalize font-bold transition-colors cursor-pointer border border-transparent ${
                  lightingPreset === preset
                    ? 'bg-[#ffd700] text-black border-black shadow-[1px_1px_0px_#000]'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
                title={`Switch to ${preset} lighting pass`}
              >
                {preset}
              </button>
            ))}

            <span className="w-[1px] h-4 bg-neutral-700 mx-1" />

            {/* Wireframe Mesh Toggle */}
            <button
              onClick={() => {
                playClick();
                setWireframe(!wireframe);
              }}
              className={`px-2 py-1 font-bold transition-colors cursor-pointer border border-black ${
                wireframe ? 'bg-amber-400 text-black shadow-[1px_1px_0px_#000]' : 'text-neutral-400 hover:text-white border-transparent'
              }`}
              title="Toggle Wireframe Polygonal Mesh"
            >
              {wireframe ? '🕸️ Wire ON' : '🕸️ Wire'}
            </button>
          </div>
        </div>

        {/* 3D Canvas Viewport Container */}
        <div ref={canvasContainerRef} data-lenis-prevent className="absolute inset-0 cursor-grab active:cursor-grabbing">
          <ModelLoaderOverlay label={`INITIALIZING ${entity.name.toUpperCase()}...`} theme="dark" />
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 45 }}
            dpr={isHighQ ? [1, 1.25] : [1, 1]}
            performance={{ min: 0.5 }}
            gl={{
              alpha: true,
              antialias: isHighQ,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
            }}
          >
            <Specimen3DViewer
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

        {/* Bottom Status Overlay */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-neutral-400 pointer-events-none mt-auto pt-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div>
            Pass: <strong className="text-yellow-400 uppercase">{lightingPreset}</strong> • Drag to orbit • Scroll to zoom
          </div>
          <Link
            href={`/compare?item1=${entity.id}`}
            onClick={() => playClick()}
            className="pointer-events-auto bg-[#0055ff] hover:bg-white text-white hover:text-black px-3 py-1 font-bold border-2 border-black uppercase transition-colors shadow-[2px_2px_0px_#000]"
          >
            Compare in Chrono Lab ⚖️
          </Link>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: METADATA & DATA LAYER RECORD ─── */}
      <div className="w-full lg:w-1/2 min-h-screen p-6 md:p-10 lg:p-14">
        <div className="max-w-xl mx-auto lg:mx-0">
          {/* Header Badges & Actions */}
          <div className="detail-badge flex flex-wrap items-center justify-between gap-3 mb-4" style={{ opacity: 0 }}>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-black text-[#ffd700] font-bold border-2 border-black text-xs font-mono uppercase shadow-[3px_3px_0px_#000]">
                {entity.periodLabel}
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-700 bg-neutral-200 px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                {entity.category}
              </span>
            </div>

            {/* Passport Stamp & Certificate Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenCertificate}
                className="px-3 py-1 bg-[#ffd700] hover:bg-white text-black font-bold uppercase transition-all border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1 text-xs font-mono"
                title="Mint Official Curatorial Certificate"
              >
                <span>📜 Mint Certificate</span>
              </button>

              <button
                onClick={handleCollectStamp}
                className={`px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer ${
                  collectedStamp
                    ? 'bg-[#ffd700] text-black hover:bg-yellow-300'
                    : 'bg-white hover:bg-[#ffd700] text-black'
                }`}
                title={collectedStamp ? 'Click to toggle passport stamp' : 'Add to your curator collection'}
              >
                <span>{collectedStamp ? '✓ Stamped in Passport' : '✦ Stamp Passport'}</span>
              </button>

              {collectedStamp && (
                <Link
                  href="/profile"
                  className="px-2.5 py-1 bg-black text-[#ffd700] hover:bg-neutral-800 font-mono text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] transition-all flex items-center gap-1"
                  title="Open Curator Passport to view collection"
                >
                  <span>Passport ↗</span>
                </Link>
              )}
            </div>
          </div>

          <h1
            className="detail-name text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit text-black mb-3 tracking-tight"
            style={{ opacity: 0 }}
          >
            {entity.name}
          </h1>

          <div className="detail-badge font-mono text-xs text-neutral-600 mb-6 font-bold flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-black font-extrabold">
              {entity.yearsAgo > 1000000
                ? `${(entity.yearsAgo / 1000000).toFixed(1)} Million Years Ago`
                : `${entity.yearsAgo.toLocaleString()} Years Ago`}
            </span>
            <span>•</span>
            <span>📍 {entity.currentLocation}</span>
          </div>

          <p
            className="detail-significance text-base leading-relaxed text-neutral-800 font-space mb-8 font-medium"
            style={{ opacity: 0 }}
          >
            {entity.significance}
          </p>

          {/* AI Audio Curator Interactive Bar */}
          <div className="detail-audio mb-8" style={{ opacity: 0 }}>
            <MuseumAudioGuide entity={entity} />
          </div>

          <div className="space-y-6">
            {/* General Attributes Dossier */}
            <div
              className="detail-section bg-white p-6 border-3 border-black shadow-[6px_6px_0px_#000]"
              style={{ opacity: 0 }}
            >
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-black mb-4 border-b-2 border-black pb-2 flex items-center justify-between">
                <span>General Specimen Data</span>
                <span className="text-neutral-500 font-normal">Catalog Record: #{entity.id}</span>
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <dt className="text-neutral-500 font-bold uppercase mb-0.5">Age Timeline</dt>
                  <dd className="text-black font-bold">
                    {entity.yearsAgo > 1000000
                      ? `${(entity.yearsAgo / 1000000).toFixed(1)} Million Years Ago`
                      : `${entity.yearsAgo.toLocaleString()} Years Ago`}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500 font-bold uppercase mb-0.5">Current Location</dt>
                  <dd className="text-black font-bold">{entity.currentLocation}</dd>
                </div>
                {entity.material && (
                  <div>
                    <dt className="text-neutral-500 font-bold uppercase mb-0.5">Material Composition</dt>
                    <dd className="text-black font-bold">{entity.material}</dd>
                  </div>
                )}
                {entity.dimensions && (
                  <div>
                    <dt className="text-neutral-500 font-bold uppercase mb-0.5">Physical Dimensions</dt>
                    <dd className="text-black font-bold">{entity.dimensions}</dd>
                  </div>
                )}
                {entity.condition && (
                  <div>
                    <dt className="text-neutral-500 font-bold uppercase mb-0.5">Preservation Condition</dt>
                    <dd className="text-emerald-800 font-bold">{entity.condition}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Fossil Attributes */}
            {isFossil(entity) && (
              <div
                className="detail-section bg-[#ffd700] p-6 border-3 border-black shadow-[6px_6px_0px_#000]"
                style={{ opacity: 0 }}
              >
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-black mb-4 border-b-2 border-black pb-2">
                  Paleontological Record
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <dt className="text-black/70 font-bold uppercase mb-0.5">Species Name</dt>
                    <dd className="text-black font-bold italic">{entity.species}</dd>
                  </div>
                  <div>
                    <dt className="text-black/70 font-bold uppercase mb-0.5">Geological Period</dt>
                    <dd className="text-black font-bold">{entity.geologicalPeriod}</dd>
                  </div>
                  {entity.placeOfDiscovery && (
                    <div className="sm:col-span-2">
                      <dt className="text-black/70 font-bold uppercase mb-0.5">Discovery Site</dt>
                      <dd className="text-black font-bold">{entity.placeOfDiscovery}</dd>
                    </div>
                  )}
                  {entity.excavatedBy && (
                    <div>
                      <dt className="text-black/70 font-bold uppercase mb-0.5">Excavator / Paleontologist</dt>
                      <dd className="text-black font-bold">{entity.excavatedBy}</dd>
                    </div>
                  )}
                  {entity.discoveryDate && (
                    <div>
                      <dt className="text-black/70 font-bold uppercase mb-0.5">Discovery Year</dt>
                      <dd className="text-black font-bold">{entity.discoveryDate}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Cultural Artifact Attributes */}
            {isCulturalArtifact(entity) && (
              <div
                className="detail-section bg-cyan-400 p-6 border-3 border-black shadow-[6px_6px_0px_#000]"
                style={{ opacity: 0 }}
              >
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-black mb-4 border-b-2 border-black pb-2">
                  Archaeological & Cultural Record
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <dt className="text-black/70 font-bold uppercase mb-0.5">Civilization / Origin</dt>
                    <dd className="text-black font-bold">{entity.origin}</dd>
                  </div>
                  <div>
                    <dt className="text-black/70 font-bold uppercase mb-0.5">Artisan / Creator</dt>
                    <dd className="text-black font-bold">{entity.creator}</dd>
                  </div>
                  {entity.commissionedBy && (
                    <div className="sm:col-span-2">
                      <dt className="text-black/70 font-bold uppercase mb-0.5">Commissioned By</dt>
                      <dd className="text-black font-bold">{entity.commissionedBy}</dd>
                    </div>
                  )}
                  {entity.discoverer && (
                    <div>
                      <dt className="text-black/70 font-bold uppercase mb-0.5">Discoverer</dt>
                      <dd className="text-black font-bold">{entity.discoverer}</dd>
                    </div>
                  )}
                  {entity.placeOfDiscovery && (
                    <div>
                      <dt className="text-black/70 font-bold uppercase mb-0.5">Excavation Site</dt>
                      <dd className="text-black font-bold">{entity.placeOfDiscovery}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Related Specimens Cross-Links */}
            {related.length > 0 && (
              <div className="detail-section pt-4" style={{ opacity: 0 }}>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-black mb-3">
                  Chronologically Adjacent Specimens
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/museum/${rel.id}`}
                      onClick={() => playClick()}
                      className="p-3.5 bg-white hover:bg-[#ffd700] border-2 border-black font-mono text-xs shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] transition-all block group"
                    >
                      <span className="block font-bold truncate text-black group-hover:text-black">
                        {rel.name}
                      </span>
                      <span className="block text-[10px] text-neutral-600 group-hover:text-black mt-1 font-semibold">
                        {rel.periodLabel}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── ARCHIVAL CERTIFICATE GENERATOR MODAL ─── */}
      <ArchivalCertificateModal
        entity={entity}
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        snapshotDataUrl={snapshotDataUrl}
      />
    </main>
  );
}
