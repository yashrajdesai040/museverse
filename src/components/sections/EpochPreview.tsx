'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { useEvolutionStore } from '@/stores/useEvolutionStore';

const SIX_EPOCHS = [
  {
    idx: 0,
    number: '01',
    name: 'Hadean Eon',
    time: '4.54 Billion Y.A.',
    summary: 'Molten silicate magma oceans, extreme asteroidal bombardment, and Theia cataclysm forming the Moon.',
    accent: '#FF4500',
    temp: '1,200°C',
    tempPercent: 100,
    o2: '0.00%',
    o2Percent: 0,
    holotype: 'Primordial Zircon Crystal',
  },
  {
    idx: 1,
    number: '02',
    name: 'Archean Eon',
    time: '3.80 Billion Y.A.',
    summary: 'Crust cooling, primordial green seas, and first cyanobacteria constructing photosynthetic stromatolite reefs.',
    accent: '#0284C7',
    temp: '55°C',
    tempPercent: 55,
    o2: '0.02%',
    o2Percent: 2,
    holotype: 'Pilbara Apex Chert Stromatolite',
  },
  {
    idx: 2,
    number: '03',
    name: 'Proterozoic Eon',
    time: '2.50 Billion Y.A.',
    summary: 'The Great Oxidation Event, banded iron formations precipitation, and runaway global Snowball Earth glaciation.',
    accent: '#0EA5E9',
    temp: '-40°C',
    tempPercent: 10,
    o2: '2.10%',
    o2Percent: 12,
    holotype: 'Banded Iron Formation (BIF)',
  },
  {
    idx: 3,
    number: '04',
    name: 'Mesozoic Era',
    time: '252 Million Y.A.',
    summary: 'Pangaea supercontinent rifting, apex reptilian dominance, lush gymnosperm forests, and terminal Chicxulub bolide impact.',
    accent: '#EAB308',
    temp: '22°C',
    tempPercent: 42,
    o2: '28.0%',
    o2Percent: 100,
    holotype: 'T. Rex "Sue" (FMNH PR 2081)',
  },
  {
    idx: 4,
    number: '05',
    name: 'Pleistocene Epoch',
    time: '2.58 Million Y.A.',
    summary: 'Cyclical polar glaciations, mammoth steppe tundra, megafauna dispersal, and early hominid Neanderthal tool-making.',
    accent: '#3B82F6',
    temp: '6°C',
    tempPercent: 28,
    o2: '20.9%',
    o2Percent: 75,
    holotype: 'Woolly Mammoth Ivory Tusk',
  },
  {
    idx: 5,
    number: '06',
    name: 'Anthropocene',
    time: 'Present Day',
    summary: 'Technological civilization, global continental city grids, orbital satellite constellations, and human material transformations.',
    accent: '#D97706',
    temp: '15°C',
    tempPercent: 35,
    o2: '20.95%',
    o2Percent: 75,
    holotype: 'The Antikythera Mechanism',
  },
];

export default function EpochPreview() {
  const router = useRouter();
  const [selectedIdx, setSelectedIdx] = useState(3); // Default Mesozoic
  const { playClick, playLaser, playHover } = useGlobalSound();
  const { jumpToEpoch } = useEvolutionStore();

  const active = SIX_EPOCHS[selectedIdx] || SIX_EPOCHS[3];

  const handleLaunchStage = (idx: number) => {
    playLaser();
    jumpToEpoch(idx);
    router.push('/evolution');
  };

  return (
    <section className="border-b-3 border-[#0E0E0E] bg-[#F2EDE4] px-6 py-28 text-[#0E0E0E] md:px-12 lg:px-20 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b-3 border-[#0E0E0E] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-[#FFD400] border border-[#0E0E0E] animate-ping" />
              <span className="px-3 py-1 bg-white text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#0E0E0E]">
                CONTINUOUS CHRONOLOGICAL SEQUENCE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-space uppercase tracking-tight text-[#0E0E0E] mt-1">
              Six Epochs. 4.54 Billion Years.
            </h2>
            <p className="text-[#0E0E0E]/80 font-space text-sm sm:text-base max-w-2xl mt-2 font-normal">
              Traverse Earth’s complete thermodynamic, tectonic, and biological journey. Jump into any epoch
              inside the real-time Chrono-Terra 3D globe.
            </p>
          </div>

          <Link
            href="/evolution"
            onClick={() => playLaser()}
            onMouseEnter={() => playHover()}
            className="px-7 py-4 bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] border-3 border-[#0E0E0E] font-extrabold font-mono text-xs uppercase tracking-wider shadow-[4px_4px_0px_#0E0E0E] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#0E0E0E] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all self-start md:self-end shrink-0 cursor-pointer"
            data-cursor
          >
            Launch 3D Evolution Studio →
          </Link>
        </div>

        {/* Interactive Deep-Time Timeline Scrubber */}
        <div className="bg-white border-3 border-[#0E0E0E] p-6 sm:p-8 mb-12 shadow-[6px_6px_0px_#0E0E0E]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b-2 border-[#0E0E0E]/15 pb-4">
            <div>
              <span className="font-mono text-[10px] text-[#0E0E0E]/60 uppercase tracking-widest font-bold block">
                INTERACTIVE EPOCH SCRUBBER // SELECT TIMELINE NODE
              </span>
              <h3 className="font-space text-2xl font-bold uppercase text-[#0E0E0E]">
                {active.number} • {active.name} ({active.time})
              </h3>
            </div>

            <button
              onClick={() => handleLaunchStage(active.idx)}
              onMouseEnter={() => playHover()}
              className="px-5 py-2.5 bg-[#0E0E0E] hover:bg-[#222] text-[#FFD400] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-wider self-start sm:self-auto cursor-pointer shadow-[3px_3px_0px_#FFD400] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              Simulate Stage in 3D ➔
            </button>
          </div>

          {/* Timeline Nodes Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
            {SIX_EPOCHS.map((epoch) => {
              const isSelected = epoch.idx === selectedIdx;
              return (
                <button
                  key={epoch.idx}
                  onClick={() => {
                    playClick();
                    setSelectedIdx(epoch.idx);
                  }}
                  onMouseEnter={() => playHover()}
                  className={`p-3 text-left border-2 border-[#0E0E0E] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFD400] font-bold shadow-[3px_3px_0px_#0E0E0E] -translate-y-1'
                      : 'bg-[#F2EDE4] hover:bg-white text-[#0E0E0E]'
                  }`}
                >
                  <div className="font-mono text-[10px] text-[#0E0E0E]/60 font-bold">
                    STAGE {epoch.number}
                  </div>
                  <div className="font-space text-sm font-bold uppercase truncate">
                    {epoch.name}
                  </div>
                  <div className="font-mono text-[10px] text-[#0E0E0E]/80 truncate">
                    {epoch.time}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Epoch Sensor Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F2EDE4] border-2 border-[#0E0E0E] p-5">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#0E0E0E]/60 block mb-1">
                SUMMARY & GEODYNAMICS:
              </span>
              <p className="font-space text-xs sm:text-sm text-[#0E0E0E] leading-relaxed">
                {active.summary}
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-[#0E0E0E] mb-1">
                  <span>SURFACE TEMPERATURE</span>
                  <span>{active.temp}</span>
                </div>
                <div className="w-full h-2.5 bg-white border border-[#0E0E0E] overflow-hidden">
                  <div
                    className="h-full bg-[#FF4500] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ width: `${active.tempPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-[#0E0E0E] mb-1">
                  <span>ATMOSPHERIC O₂</span>
                  <span>{active.o2}</span>
                </div>
                <div className="w-full h-2.5 bg-white border border-[#0E0E0E] overflow-hidden">
                  <div
                    className="h-full bg-[#0284C7] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ width: `${active.o2Percent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l-2 border-[#0E0E0E]/15 pt-3 md:pt-0 md:pl-6">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#0E0E0E]/60 block mb-1">
                  CANONICAL SPECIMEN:
                </span>
                <span className="font-space text-sm font-bold text-[#0E0E0E] block">
                  {active.holotype}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#0E0E0E]/60 pt-2">
                ISO-21127 Biostratigraphic Datum
              </span>
            </div>
          </div>
        </div>

        {/* 6 Epochs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SIX_EPOCHS.map((epoch) => (
            <div
              key={epoch.idx}
              className="epoch-card bg-white border-3 border-[#0E0E0E] p-6 shadow-[5px_5px_0px_#0E0E0E] hover:shadow-[8px_8px_0px_#FFD400] hover:-translate-y-1.5 transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 border-b-2 border-[#0E0E0E]/15 pb-2">
                  <span className="font-mono text-xs font-bold text-[#0E0E0E]/70">
                    STAGE {epoch.number}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#0E0E0E] bg-[#FFD400] px-2 py-0.5 border border-[#0E0E0E]">
                    {epoch.time}
                  </span>
                </div>

                <h4 className="font-space text-xl font-bold uppercase text-[#0E0E0E] mb-2 leading-tight">
                  {epoch.name}
                </h4>

                <p className="font-space text-xs text-[#0E0E0E]/75 leading-relaxed mb-6 font-normal">
                  {epoch.summary}
                </p>
              </div>

              <div className="pt-4 border-t-2 border-[#0E0E0E]/15 flex items-center justify-between font-mono text-xs">
                <span className="text-[10px] text-[#0E0E0E]/70 font-bold uppercase truncate max-w-[150px]">
                  {epoch.holotype}
                </span>
                <button
                  onClick={() => handleLaunchStage(epoch.idx)}
                  className="font-bold uppercase text-[#0E0E0E] hover:text-[#B3261E] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Explore</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
