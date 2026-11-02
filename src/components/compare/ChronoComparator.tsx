'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { MuseumEntity } from '@/types/museum';
import { entities } from '@/data/entities';
import { Specimen3DViewer, LightingPreset } from '@/components/canvas/Specimen3DViewer';
import { useAppStore } from '@/stores/useAppStore';

interface ChronoComparatorProps {
  initialItem1Id?: string;
  initialItem2Id?: string;
}

function formatYears(years: number): string {
  if (years >= 1_000_000_000) return `${(years / 1_000_000_000).toFixed(2)} Billion Years Ago`;
  if (years >= 1_000_000) return `${(years / 1_000_000).toFixed(1)} Million Years Ago`;
  if (years >= 1_000) return `${(years / 1_000).toFixed(0)}k Years Ago`;
  return `${years.toLocaleString()} Years Ago`;
}

export function ChronoComparator({
  initialItem1Id = 'trex-sue',
  initialItem2Id = 'rosetta-stone',
}: ChronoComparatorProps) {
  const [item1Id, setItem1Id] = useState<string>(initialItem1Id);
  const [item2Id, setItem2Id] = useState<string>(initialItem2Id);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('dramatic');
  const [syncRotate, setSyncRotate] = useState<boolean>(true);
  const [explodedView, setExplodedView] = useState<boolean>(false);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(false);

  const performanceMode = useAppStore((s) => s.performanceMode);
  const isHighQ = performanceMode === 'high';

  const entity1 = useMemo(() => entities.find((e) => e.id === item1Id) || entities[0], [item1Id]);
  const entity2 = useMemo(() => entities.find((e) => e.id === item2Id) || entities[1], [item2Id]);

  // Compute temporal separation delta
  const older = entity1.yearsAgo >= entity2.yearsAgo ? entity1 : entity2;
  const newer = entity1.yearsAgo < entity2.yearsAgo ? entity1 : entity2;
  const timeDelta = older.yearsAgo - newer.yearsAgo;

  const handleSwap = () => {
    setItem1Id(item2Id);
    setItem2Id(item1Id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-space">
      {/* ─── CONTROLS HEADER ─── */}
      <div className="bg-[#1a1a1a] text-white p-6 border-3 border-black shadow-[8px_8px_0px_#ffd700] flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Specimen 1 Selector */}
        <div className="w-full md:w-5/12">
          <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#ffd700] mb-2">
            Specimen Alpha:
          </label>
          <select
            value={item1Id}
            onChange={(e) => setItem1Id(e.target.value)}
            className="w-full bg-neutral-900 border-2 border-neutral-700 text-white px-3 py-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#ffd700] cursor-pointer"
          >
            {entities.map((e) => (
              <option key={e.id} value={e.id} disabled={e.id === item2Id}>
                {e.name} ({e.periodLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="p-3 bg-[#ffd700] text-black border-2 border-black font-mono font-black text-sm uppercase shadow-[3px_3px_0px_#000] hover:scale-105 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          title="Swap Left and Right"
        >
          ⇄ SWAP
        </button>

        {/* Specimen 2 Selector */}
        <div className="w-full md:w-5/12">
          <label className="block text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2">
            Specimen Beta:
          </label>
          <select
            value={item2Id}
            onChange={(e) => setItem2Id(e.target.value)}
            className="w-full bg-neutral-900 border-2 border-neutral-700 text-white px-3 py-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {entities.map((e) => (
              <option key={e.id} value={e.id} disabled={e.id === item1Id}>
                {e.name} ({e.periodLabel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── TIME DELTA CHRONO-GAUGE ─── */}
      <div className="bg-[#ffd700] text-black border-3 border-black p-6 shadow-[8px_8px_0px_#000]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-black pb-4 mb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider block text-black/80">
              Temporal Separation Delta:
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-outfit uppercase">
              {formatYears(timeDelta)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Lighting selector */}
            <div className="flex items-center gap-1 bg-black p-1 text-white font-mono text-[10px]">
              {(['dramatic', 'museum', 'uv', 'xray'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setLightingPreset(preset)}
                  className={`px-2 py-0.5 capitalize font-bold ${
                    lightingPreset === preset ? 'bg-[#ffd700] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Sync Toggle */}
            <button
              onClick={() => setSyncRotate(!syncRotate)}
              className={`px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-black cursor-pointer transition-colors ${
                syncRotate ? 'bg-black text-[#ffd700]' : 'bg-white text-black'
              }`}
            >
              {syncRotate ? 'Sync Spin ✓' : 'Independent'}
            </button>

            {/* Exploded View Toggle */}
            <button
              onClick={() => setExplodedView(!explodedView)}
              className={`px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-black cursor-pointer transition-colors ${
                explodedView ? 'bg-amber-400 text-black' : 'bg-white text-black'
              }`}
              title="Toggle Exploded Anatomy on both specimens"
            >
              {explodedView ? '💥 Exploded ON' : '💥 Exploded OFF'}
            </button>

            {/* 3D Model Feature Labels Toggle */}
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-black cursor-pointer transition-colors ${
                showAnnotations ? 'bg-cyan-400 text-black' : 'bg-white text-black'
              }`}
              title="Toggle 3D Feature Hotspot Labels on Models"
            >
              {showAnnotations ? '🏷️ Labels ON' : '🏷️ Labels OFF'}
            </button>
          </div>
        </div>

        {/* Deep Time Timeline Bar */}
        <div className="relative w-full h-9 bg-black/10 border-2 border-black flex items-center px-3 sm:px-4">
          <div className="absolute left-0 top-0 bottom-0 bg-neutral-900/20 w-full" />
          <div className="relative z-10 w-full flex justify-between items-center gap-2 text-[10px] font-mono font-bold">
            <span className="bg-black text-[#ffd700] px-2 py-0.5 border border-black truncate max-w-[48%]" title={`${older.name}: ${formatYears(older.yearsAgo)}`}>
              {older.name}: {formatYears(older.yearsAgo)}
            </span>
            <span className="bg-[#0055ff] text-white px-2 py-0.5 border border-black truncate max-w-[48%]" title={`${newer.name}: ${formatYears(newer.yearsAgo)}`}>
              {newer.name}: {formatYears(newer.yearsAgo)}
            </span>
          </div>
        </div>
      </div>

      {/* ─── DUAL 3D WEBGL VIEWPORTS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Viewport 1: Specimen Alpha */}
        <div className="bg-[#0d0d0d] border-3 border-black shadow-[8px_8px_0px_#ffd700] flex flex-col justify-between h-[450px] relative p-4 overflow-hidden">
          {/* Top Model Label Bar */}
          <div className="relative z-20 flex items-center justify-between gap-3 w-full pointer-events-none">
            <span
              className="bg-[#ffd700] text-black font-mono font-bold text-xs px-2.5 py-1 border border-black shadow-[2px_2px_0px_#000] truncate max-w-[calc(100%-125px)]"
              title={entity1.name}
            >
              {entity1.name}
            </span>
            <Link
              href={`/museum/${entity1.id}`}
              className="pointer-events-auto bg-black text-[#ffd700] hover:bg-[#ffd700] hover:text-black font-mono text-[10px] font-bold px-2.5 py-1 border border-neutral-700 uppercase shrink-0 transition-colors shadow-[2px_2px_0px_#000]"
            >
              Inspect Solo ↗
            </Link>
          </div>

          {/* 3D Canvas */}
          <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas
              camera={{ position: [0, 0, 6], fov: 42 }}
              dpr={isHighQ ? [1, 1.5] : [1, 1]}
              gl={{ antialias: true }}
            >
              <Specimen3DViewer
                entity={entity1}
                lightingPreset={lightingPreset}
                autoRotate={syncRotate}
                explodedView={explodedView}
                showAnnotations={showAnnotations}
                enablePostprocessing={false}
              />
            </Canvas>
          </div>

          {/* Bottom Model Meta Label Bar */}
          <div className="relative z-20 mx-auto max-w-[90%] pointer-events-none">
            <div className="text-[10px] font-mono font-bold text-neutral-300 text-center bg-black/85 backdrop-blur-md px-3 py-1 border border-neutral-700 shadow-[2px_2px_0px_#000] truncate">
              {entity1.periodLabel} • {formatYears(entity1.yearsAgo)}
            </div>
          </div>
        </div>

        {/* Viewport 2: Specimen Beta */}
        <div className="bg-[#0d0d0d] border-3 border-black shadow-[8px_8px_0px_#0055ff] flex flex-col justify-between h-[450px] relative p-4 overflow-hidden">
          {/* Top Model Label Bar */}
          <div className="relative z-20 flex items-center justify-between gap-3 w-full pointer-events-none">
            <span
              className="bg-cyan-400 text-black font-mono font-bold text-xs px-2.5 py-1 border border-black shadow-[2px_2px_0px_#000] truncate max-w-[calc(100%-125px)]"
              title={entity2.name}
            >
              {entity2.name}
            </span>
            <Link
              href={`/museum/${entity2.id}`}
              className="pointer-events-auto bg-black text-cyan-400 hover:bg-cyan-400 hover:text-black font-mono text-[10px] font-bold px-2.5 py-1 border border-neutral-700 uppercase shrink-0 transition-colors shadow-[2px_2px_0px_#000]"
            >
              Inspect Solo ↗
            </Link>
          </div>

          {/* 3D Canvas */}
          <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas
              camera={{ position: [0, 0, 6], fov: 42 }}
              dpr={isHighQ ? [1, 1.5] : [1, 1]}
              gl={{ antialias: true }}
            >
              <Specimen3DViewer
                entity={entity2}
                lightingPreset={lightingPreset}
                autoRotate={syncRotate}
                explodedView={explodedView}
                showAnnotations={showAnnotations}
                enablePostprocessing={false}
              />
            </Canvas>
          </div>

          {/* Bottom Model Meta Label Bar */}
          <div className="relative z-20 mx-auto max-w-[90%] pointer-events-none">
            <div className="text-[10px] font-mono font-bold text-neutral-300 text-center bg-black/85 backdrop-blur-md px-3 py-1 border border-neutral-700 shadow-[2px_2px_0px_#000] truncate">
              {entity2.periodLabel} • {formatYears(entity2.yearsAgo)}
            </div>
          </div>
        </div>
      </div>

      {/* ─── SIDE-BY-SIDE METRIC COMPARISON MATRIX ─── */}
      <div className="bg-white border-3 border-black p-6 shadow-[8px_8px_0px_#000]">
        <h3 className="text-lg font-outfit font-extrabold uppercase tracking-tight text-black mb-6 border-b-2 border-black pb-3">
          Specimen Telemetry & Metric Comparison Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-black bg-neutral-100">
                <th className="p-3 uppercase text-neutral-600 font-bold w-1/4">Metric</th>
                <th className="p-3 uppercase text-black font-extrabold w-3/8 bg-[#ffd700]/30">{entity1.name}</th>
                <th className="p-3 uppercase text-black font-extrabold w-3/8 bg-cyan-400/20">{entity2.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              <tr>
                <td className="p-3 font-bold text-neutral-500 uppercase">Age Timeline</td>
                <td className="p-3 font-bold text-black">{formatYears(entity1.yearsAgo)}</td>
                <td className="p-3 font-bold text-black">{formatYears(entity2.yearsAgo)}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-neutral-500 uppercase">Geological Epoch</td>
                <td className="p-3 font-bold text-black">{entity1.periodLabel}</td>
                <td className="p-3 font-bold text-black">{entity2.periodLabel}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-neutral-500 uppercase">Category</td>
                <td className="p-3 font-bold text-black">{entity1.category} ({entity1.type})</td>
                <td className="p-3 font-bold text-black">{entity2.category} ({entity2.type})</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-neutral-500 uppercase">Current Location</td>
                <td className="p-3 text-black">{entity1.currentLocation}</td>
                <td className="p-3 text-black">{entity2.currentLocation}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-neutral-500 uppercase">Significance</td>
                <td className="p-3 text-neutral-800 text-[11px] leading-relaxed font-space">{entity1.significance}</td>
                <td className="p-3 text-neutral-800 text-[11px] leading-relaxed font-space">{entity2.significance}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-neutral-500 uppercase">Preservation Condition</td>
                <td className="p-3 font-bold text-black">{entity1.condition || 'Good'}</td>
                <td className="p-3 font-bold text-black">{entity2.condition || 'Good'}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-neutral-500 uppercase">Dimensions / Specs</td>
                <td className="p-3 text-black">{entity1.dimensions || 'Archival standard'}</td>
                <td className="p-3 text-black">{entity2.dimensions || 'Archival standard'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
