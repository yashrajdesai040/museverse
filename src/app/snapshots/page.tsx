'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import {
  SNAPSHOT_ITEMS,
  SnapshotItem,
  SnapshotCategory,
} from './snapshotRegistry';
import { Offscreen3DRig } from './offscreen3DRig';
import { ComponentStageRenderer } from './componentStageRenderer';
import {
  packageZipArchive,
  generateMasterContactSheet,
  triggerDownload,
} from './exportEngine';

export default function SnapshotStudioPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [renderMode, setRenderMode] = useState<'pbr' | 'wireframe' | 'xray'>('pbr');
  const [capturedImages, setCapturedImages] = useState<Map<string, string>>(new Map());
  const [isCapturingAll, setIsCapturingAll] = useState(false);
  const [captureProgress, setCaptureProgress] = useState({ current: 0, total: SNAPSHOT_ITEMS.length });
  const [activeCapturingId, setActiveCapturingId] = useState<string | null>(null);
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<SnapshotItem | null>(null);

  // Dedicated offscreen DOM capture container
  const hiddenStageRef = useRef<HTMLDivElement>(null);
  const offscreen3DRef = useRef<Offscreen3DRig | null>(null);

  useEffect(() => {
    offscreen3DRef.current = new Offscreen3DRig(1200, 1200);
    return () => {
      offscreen3DRef.current?.dispose();
    };
  }, []);

  const filteredItems = useMemo(() => {
    return SNAPSHOT_ITEMS.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        searchFilter === '' ||
        item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.filename.toLowerCase().includes(searchFilter.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchFilter]);

  // Capture Single Item
  const captureItem = async (item: SnapshotItem): Promise<string> => {
    setActiveCapturingId(item.id);
    let dataUrl = '';

    try {
      if (item.category === '03-3d-models') {
        if (!offscreen3DRef.current) {
          offscreen3DRef.current = new Offscreen3DRig(1200, 1200);
        }
        dataUrl = await offscreen3DRef.current.renderModelToDataUrl(item.id, renderMode);
      } else {
        // DOM-to-canvas rasterizer
        const stage = hiddenStageRef.current;
        if (stage) {
          // Wait 150ms for fonts/animations to settle
          await new Promise((res) => setTimeout(res, 180));
          dataUrl = await toPng(stage, {
            pixelRatio: 2,
            cacheBust: true,
            backgroundColor: '#0A0A0C',
          });
        }
      }

      setCapturedImages((prev) => {
        const next = new Map(prev);
        next.set(item.id, dataUrl);
        return next;
      });
    } catch (err) {
      console.error(`Failed to capture ${item.id}`, err);
    } finally {
      setActiveCapturingId(null);
    }

    return dataUrl;
  };

  // Batch Export All Sequential Runner
  const runBatchCapture = async () => {
    if (isCapturingAll) return;
    setIsCapturingAll(true);
    setCaptureProgress({ current: 0, total: SNAPSHOT_ITEMS.length });

    const newlyCaptured = new Map<string, string>();

    for (let i = 0; i < SNAPSHOT_ITEMS.length; i++) {
      const item = SNAPSHOT_ITEMS[i];
      setCaptureProgress({ current: i + 1, total: SNAPSHOT_ITEMS.length });
      setActiveCapturingId(item.id);

      // Render offscreen item into DOM container if not 3D
      if (item.category !== '03-3d-models') {
        setSelectedPreviewItem(item);
        await new Promise((res) => setTimeout(res, 220));
      }

      const dataUrl = await captureItem(item);
      if (dataUrl) {
        newlyCaptured.set(item.id, dataUrl);
      }
    }

    setIsCapturingAll(false);
    setActiveCapturingId(null);

    // Auto-package ZIP once finished
    await packageAndDownloadZip(newlyCaptured);
  };

  const packageAndDownloadZip = async (sourceMap?: Map<string, string>) => {
    const mapToUse = sourceMap || capturedImages;
    if (mapToUse.size === 0) {
      alert('Please capture screenshots before generating a ZIP archive.');
      return;
    }

    const blobMap = new Map<string, { blob: Blob; filename: string; folder: string }>();

    for (const [id, dataUrl] of mapToUse.entries()) {
      const meta = SNAPSHOT_ITEMS.find((it) => it.id === id);
      if (meta) {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        blobMap.set(id, {
          blob,
          filename: meta.filename,
          folder: meta.folder,
        });
      }
    }

    const zipBlob = await packageZipArchive(blobMap);
    triggerDownload(zipBlob, 'paleolith-complete-screenshots.zip');
  };

  const exportContactSheet = async () => {
    if (capturedImages.size === 0) {
      alert('No screenshots captured yet. Please click "Capture & Download Full Archive (.ZIP)" or capture individual items first.');
      return;
    }
    const sheetBlob = await generateMasterContactSheet(capturedImages);
    triggerDownload(sheetBlob, 'paleolith-master-contact-sheet.png');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F5F3EF] font-mono selection:bg-[#FFD400] selection:text-[#0A0A0C]">
      {/* Offscreen Hidden Stage for DOM Component Rasterization */}
      <div className="absolute -left-[9999px] top-0 pointer-events-none opacity-0">
        <div ref={hiddenStageRef} className="w-[1280px] min-h-[720px] bg-[#0A0A0C] p-8">
          {selectedPreviewItem && <ComponentStageRenderer item={selectedPreviewItem} />}
        </div>
      </div>

      {/* Top Studio Control Bar */}
      <header className="sticky top-0 z-50 bg-[#141418]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-3.5 h-3.5 bg-[#FFD400]" />
          <div>
            <h1 className="text-base font-black tracking-tight text-white uppercase">
              VISUAL AUDIT & BATCH SCREENSHOT EXPORTER
            </h1>
            <p className="text-[11px] text-neutral-400">
              ISOLATED STUDIO &bull; 63 EXHAUSTIVE TARGETS &bull; ACC-STUDIO-v1.0
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Render Mode Select */}
          <div className="flex items-center gap-1 bg-black/60 border border-white/20 p-1 text-xs">
            <span className="text-[10px] text-neutral-400 px-2 uppercase">3D Mode:</span>
            {(['pbr', 'wireframe', 'xray'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setRenderMode(m)}
                className={`px-2.5 py-1 text-[11px] uppercase transition-colors ${
                  renderMode === m ? 'bg-[#FFD400] text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={runBatchCapture}
            disabled={isCapturingAll}
            className="px-5 py-2.5 bg-[#FFD400] hover:bg-[#ffe14d] text-black font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-[4px_4px_0px_#ffffff]"
          >
            {isCapturingAll ? `Capturing (${captureProgress.current}/${captureProgress.total})...` : 'Capture & Download (.ZIP)'}
          </button>

          <button
            onClick={() => packageAndDownloadZip()}
            disabled={capturedImages.size === 0}
            className="px-4 py-2.5 border border-white/30 hover:border-white text-white font-bold text-xs uppercase tracking-wider disabled:opacity-30"
          >
            Download ZIP
          </button>

          <button
            onClick={exportContactSheet}
            disabled={capturedImages.size === 0}
            className="px-4 py-2.5 border border-[#FFD400]/40 text-[#FFD400] hover:bg-[#FFD400]/10 font-bold text-xs uppercase tracking-wider disabled:opacity-30"
          >
            Export Sheet (.PNG)
          </button>

          <Link
            href="/"
            className="px-3 py-2 text-neutral-400 hover:text-white text-xs uppercase border border-white/10"
          >
            &larr; Public Site
          </Link>
        </div>
      </header>

      {/* Progress Telemetry Ribbon */}
      {isCapturingAll && (
        <div className="bg-[#1C1C22] border-b border-[#FFD400]/30 px-6 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#FFD400] animate-ping" />
            <span className="text-[#FFD400] font-bold">
              BATCH CAPTURE ENGINE RUNNING:
            </span>
            <span className="text-neutral-300">
              Rendering {activeCapturingId || 'Item'}
            </span>
          </div>
          <div className="font-mono text-neutral-400 tabular-nums">
            Captured {captureProgress.current} / {captureProgress.total} (
            {Math.round((captureProgress.current / captureProgress.total) * 100)}%)
          </div>
        </div>
      )}

      {/* Main Filter & Category Bar */}
      <div className="border-b border-white/10 bg-[#0E0E12] px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'all', label: 'ALL TARGETS (63)' },
            { id: '01-pages', label: 'PAGES (6)' },
            { id: '02-home-sections', label: 'HOME SECTIONS (8)' },
            { id: '03-3d-models', label: '3D MODELS & SCENES (25)' },
            { id: '04-ui-components', label: 'UI PRIMITIVES (11)' },
            { id: '05-reactbits', label: 'REACTBITS (11)' },
            { id: '06-modals', label: 'MODALS (2)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 uppercase transition-all ${
                activeCategory === cat.id
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Filter */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search items by name, id or tag..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="bg-black/60 border border-white/20 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD400] w-64"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="text-neutral-400 hover:text-white text-xs px-2"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Contact Sheet Grid */}
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const isCaptured = capturedImages.has(item.id);
            const dataUrl = capturedImages.get(item.id);
            const isCurrent = activeCapturingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-[#141418] border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Visual Viewport Preview */}
                <div className="relative aspect-video bg-[#0A0A0C] border-b border-white/10 overflow-hidden flex items-center justify-center">
                  {isCaptured && dataUrl ? (
                    <img
                      src={dataUrl}
                      alt={item.name}
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={() => {
                        setSelectedPreviewItem(item);
                      }}
                    />
                  ) : (
                    <div className="p-6 text-center text-neutral-500 flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border border-neutral-700 flex items-center justify-center text-xs">
                        {item.category === '03-3d-models' ? '3D' : 'DOM'}
                      </div>
                      <span className="text-[11px] uppercase tracking-wider">
                        {isCurrent ? 'RENDERING FRAME...' : 'PENDING CAPTURE'}
                      </span>
                    </div>
                  )}

                  {/* Corner Accession Badge */}
                  <div className="absolute top-2 left-2 bg-black/80 border border-white/20 px-2 py-0.5 text-[9px] text-[#FFD400] font-bold uppercase">
                    {item.folder}
                  </div>

                  {isCaptured && (
                    <div className="absolute top-2 right-2 bg-emerald-950/80 border border-emerald-500 text-emerald-300 px-2 py-0.5 text-[9px] font-bold uppercase">
                      READY
                    </div>
                  )}
                </div>

                {/* Specimen Metadata & Capture Action */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xs font-bold text-white mb-1 uppercase tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-neutral-500 uppercase truncate">
                      {item.filename}
                    </span>

                    <button
                      onClick={async () => {
                        setSelectedPreviewItem(item);
                        await captureItem(item);
                      }}
                      disabled={isCapturingAll}
                      className="px-3 py-1 bg-white/10 hover:bg-[#FFD400] hover:text-black text-white text-[10px] uppercase font-bold tracking-wider transition-colors"
                    >
                      {isCaptured ? 'Re-Snap' : 'Snapshot'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Developer Launcher Indicator */}
      <div className="fixed bottom-4 right-4 z-40 bg-black/90 border border-white/20 px-3 py-2 text-[10px] text-neutral-400 flex items-center gap-3 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#FFD400]" />
        <span>STUDIO ROUTE: /_snapshots</span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-white hover:text-[#FFD400] underline uppercase"
        >
          Top
        </button>
      </div>
    </div>
  );
}
