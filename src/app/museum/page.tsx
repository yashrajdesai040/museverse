'use client';

import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useMuseumStore } from '@/stores/useMuseumStore';
import { useCollectorStore } from '@/stores/useCollectorStore';
import { entities } from '@/data/entities';
import { EntityCard } from '@/components/EntityCard';
import { matchesCategoryTab, GalleryTab, isFossil } from '@/types/museum';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { SplitText } from '@/components/reactbits/SplitText';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { Magnet } from '@/components/reactbits/Magnet';
import { Squares } from '@/components/reactbits/Squares';

const TABS: GalleryTab[] = ['All Items', 'Fossils & Paleontology', 'Ancient Artifacts', 'Relics & Antiquities'];
const MAX_YEARS = 4_500_000_000;

// ─── Logarithmic Mapping Helpers ───────────────────────────────────────────
// Maps a 0→1 slider position to a yearsAgo value on a log scale
// so that human history (last 10k yrs) occupies a meaningful portion.
function sliderToYears(position: number): number {
  // position 0 = 2000 YA, position 1 = 4.5 Billion YA
  const minLog = Math.log10(2_000);
  const maxLog = Math.log10(MAX_YEARS);
  return Math.round(Math.pow(10, minLog + position * (maxLog - minLog)));
}

function yearsToSlider(years: number): number {
  const minLog = Math.log10(2_000);
  const maxLog = Math.log10(MAX_YEARS);
  return (Math.log10(Math.max(years, 2_000)) - minLog) / (maxLog - minLog);
}

function formatYearsAgo(years: number): string {
  if (years >= MAX_YEARS) return 'All Eras (4.5B Y.A.)';
  if (years >= 1_000_000_000) return `${(years / 1_000_000_000).toFixed(1)}B Years Ago`;
  if (years >= 1_000_000) return `${(years / 1_000_000).toFixed(0)}M Years Ago`;
  if (years >= 1_000) return `${(years / 1_000).toFixed(0)}k Years Ago`;
  return `${years.toLocaleString()} Years Ago`;
}

function formatSliderBadge(years: number): string {
  if (years >= 1_000_000_000) return `< ${(years / 1_000_000_000).toFixed(1)}B YA`;
  if (years >= 1_000_000) return `< ${(years / 1_000_000).toFixed(0)} MYA`;
  if (years >= 1_000) return `< ${(years / 1_000).toFixed(0)}k YA`;
  return `< ${years.toLocaleString()} YA`;
}

// ─── Logarithmic Slider Track Marks ─────────────────────────────────────────
const TRACK_MARKS = [
  { years: 500, label: '500 Y' },
  { years: 10_000, label: '10k Y' },
  { years: 100_000, label: '100k Y' },
  { years: 10_000_000, label: '10M Y' },
  { years: 100_000_000, label: '100M Y' },
  { years: 1_000_000_000, label: '1B Y' },
  { years: MAX_YEARS, label: '4.5B Y' },
];

export default function MuseumPage() {
  const {
    searchQuery, activeTab, sortBy,
    setSearchQuery, setActiveTab, setSortBy, resetFilters,
  } = useMuseumStore();

  const { playClick, playSelect } = useGlobalSound();
  const { stamps, init: initCollector } = useCollectorStore();
  const [onlyStamped, setOnlyStamped] = useState(false);

  useEffect(() => {
    initCollector();
  }, [initCollector]);

  // Slider state: store as 0–1 fractional position, derive years from it
  const [sliderPos, setSliderPos] = useState<number>(1); // 1 = max years (All Eras)
  const maxYearsAgo = sliderToYears(sliderPos);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const dragTimer = useRef<NodeJS.Timeout | null>(null);
  const pageRef = useRef<HTMLElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  // ─── Filtered + Sorted Entities ────────────────────────────────────────
  const filtered = useMemo(() => {
    return entities
      .filter((e) => matchesCategoryTab(e, activeTab))
      .filter((e) => (onlyStamped ? stamps.includes(e.id) : true))
      .filter((e) => e.yearsAgo <= maxYearsAgo)
      .filter((e) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const speciesMatch = isFossil(e) ? e.species.toLowerCase().includes(q) : false;
        return (
          e.name.toLowerCase().includes(q) ||
          e.significance.toLowerCase().includes(q) ||
          e.currentLocation.toLowerCase().includes(q) ||
          speciesMatch
        );
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') return b.yearsAgo - a.yearsAgo;
        if (sortBy === 'newest') return a.yearsAgo - b.yearsAgo;
        return a.name.localeCompare(b.name);
      });
  }, [activeTab, onlyStamped, stamps, searchQuery, sortBy, maxYearsAgo]);

  // ─── Card Stagger on Scroll ─────────────────────────────────────────────
  useGSAP(() => {
    ScrollTrigger.batch('.gallery-card-wrapper', {
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power2.out', overwrite: true },
        );
      },
      start: 'top 92%',
    });
  }, { scope: pageRef, dependencies: [activeTab] });

  // ─── Logarithmic Slider Handlers ────────────────────────────────────────
  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const pos = Number(e.target.value) / 1000; // input range is 0–1000
    setSliderPos(pos);
    setIsDragging(true);
    if (dragTimer.current) clearTimeout(dragTimer.current);
    dragTimer.current = setTimeout(() => setIsDragging(false), 600);
  }, []);

  const handleResetAll = useCallback(() => {
    playClick();
    resetFilters();
    setSliderPos(1);
    setOnlyStamped(false);
  }, [resetFilters, playClick]);

  // Compute thumb % position for tooltip placement
  const thumbPercent = sliderPos * 100;

  return (
    <main ref={pageRef} className="relative min-h-screen bg-[#F2EDE4] text-[#0E0E0E] pt-28 px-6 md:px-12 pb-24 font-space overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
        <Squares
          direction="diagonal"
          speed={0.2}
          squareSize={56}
          borderColor="rgba(14, 14, 14, 0.05)"
          hoverFillColor="rgba(255, 212, 0, 0.2)"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="px-3 py-1 bg-[#0E0E0E] text-[#FFD400] font-mono text-xs font-bold uppercase tracking-[0.15em] inline-block shadow-[3px_3px_0px_#0E0E0E] mb-3">
                <DecryptedText
                  text="[ REFERENCE CATALOG ARCHIVE // 24 SPECIMENS ]"
                  speed={35}
                  animateOn="view"
                  className="text-[#FFD400]"
                  encryptedClassName="text-white"
                />
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold font-space text-[#0E0E0E] tracking-tight uppercase">
                <SplitText text="Museum Collection" splitBy="words" stagger={0.05} />
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Magnet padding={20} magnetStrength={0.25}>
                <Link
                  href="/compare"
                  onClick={() => playClick()}
                  className="px-4 py-2.5 bg-[#0E0E0E] hover:bg-[#FFD400] text-[#F2EDE4] hover:text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_#0E0E0E] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Chrono Lab 3D ⚖️</span>
                </Link>
              </Magnet>

              <Magnet padding={20} magnetStrength={0.25}>
                <Link
                  href="/profile"
                  onClick={() => playClick()}
                  className="px-4 py-2.5 bg-[#FFD400] hover:bg-white text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_#0E0E0E] transition-all flex items-center gap-2 cursor-pointer"
                  title="View your official Curator Passport & Collection"
                >
                  <span>Curator Passport 🧭 [{stamps.length}/{entities.length}]</span>
                </Link>
              </Magnet>
            </div>
          </div>

          {/* ── Filter Bar ────────────────────────────────────────────── */}
          <div className="bg-[#1a1a1a] text-white p-6 border-3 border-black shadow-[8px_8px_0px_#ffcc00] space-y-6">

            {/* Row 1: Search + Sort */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search fossils, artifacts, eras…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900 border-2 border-neutral-700 rounded-none px-4 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#0055ff] transition-colors placeholder-neutral-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      playClick();
                      setSearchQuery('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white font-mono text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    playClick();
                    setSortBy(e.target.value as 'oldest' | 'newest' | 'name');
                  }}
                  className="bg-neutral-900 border-2 border-neutral-700 text-white rounded-none px-3 py-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#0055ff] cursor-pointer"
                >
                  <option value="oldest">Oldest First</option>
                  <option value="newest">Newest First</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Row 2: Logarithmic Era Slider */}
            <div className="relative border-t border-neutral-800 pt-5">
              {/* Header row */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
                  Era Timescale Filter:
                </span>
                <span
                  className="px-2.5 py-1 bg-yellow-400 text-black border-2 border-black text-[10px] font-mono font-bold shadow-[2px_2px_0px_#000] uppercase tracking-wide transition-all"
                >
                  {formatYearsAgo(maxYearsAgo)}
                </span>
              </div>

              {/* Slider track + floating tooltip */}
              <div ref={sliderTrackRef} className="relative">
                {/* Floating drag badge — tracks the thumb position */}
                <div
                  className="absolute -top-9 pointer-events-none transition-opacity duration-200 z-20"
                  style={{
                    left: `clamp(32px, calc(${thumbPercent}% - 40px), calc(100% - 80px))`,
                    opacity: isDragging ? 1 : 0,
                  }}
                >
                  <div className="bg-yellow-400 text-black border-2 border-black px-3 py-1 text-[10px] font-mono font-bold shadow-[2px_2px_0px_#000] whitespace-nowrap">
                    {formatSliderBadge(maxYearsAgo)}
                  </div>
                  {/* Arrow pointer */}
                  <div className="w-2 h-2 bg-yellow-400 border-r-2 border-b-2 border-black rotate-45 mx-auto -mt-[1px]" />
                </div>

                {/* Actual range input (logarithmic via 0–1000 integer range) */}
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="1"
                  value={Math.round(sliderPos * 1000)}
                  onChange={handleSliderChange}
                  className="w-full"
                  aria-label="Filter by era (logarithmic timescale)"
                />

                {/* Log-scale track marks */}
                <div className="relative mt-2 h-4">
                  {TRACK_MARKS.map(({ years, label }) => {
                    const pos = yearsToSlider(years) * 100;
                    return (
                      <button
                        key={years}
                        onClick={() => {
                          playClick();
                          setSliderPos(yearsToSlider(years));
                          setIsDragging(false);
                        }}
                        className="absolute -translate-x-1/2 top-0 flex flex-col items-center group cursor-pointer"
                        style={{ left: `${pos}%` }}
                        title={formatYearsAgo(years)}
                      >
                        <span className="w-0.5 h-2 bg-neutral-600 group-hover:bg-yellow-400 transition-colors" />
                        <span className="text-[8px] font-mono text-neutral-500 group-hover:text-yellow-400 transition-colors whitespace-nowrap mt-0.5 hidden sm:block">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Category Tabs & Collector Filter ────── */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pb-2">
            <div className="flex overflow-x-auto gap-3 hide-scrollbar">
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      playSelect();
                      setActiveTab(tab);
                    }}
                    className={`relative whitespace-nowrap px-5 py-2.5 border-3 border-black text-xs font-mono font-bold uppercase transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'text-black shadow-[6px_6px_0px_#000]'
                        : 'bg-[#f5f0e8] text-black shadow-[4px_4px_0px_#000] hover:bg-black hover:text-white hover:shadow-[6px_6px_0px_#ffcc00]'
                    }`}
                  >
                    {/* Yellow slide-in background for active tab */}
                    <span
                      className={`absolute inset-0 bg-yellow-400 border-0 transition-all duration-200 ease-out ${
                        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    />
                    <span className="relative z-10">{tab}</span>
                  </button>
                );
              })}
            </div>

            {/* Collector Stamped Filter Toggle */}
            <button
              onClick={() => {
                playClick();
                setOnlyStamped(!onlyStamped);
              }}
              className={`px-4 py-2.5 border-3 border-black text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                onlyStamped
                  ? 'bg-[#FFD400] text-black shadow-[5px_5px_0px_#000]'
                  : 'bg-white text-black shadow-[3px_3px_0px_#000] hover:bg-neutral-100'
              }`}
              title="Show only specimens stamped in your passport"
            >
              <span>{onlyStamped ? `✦ My Stamped (${stamps.length})` : `📜 Filter Stamped (${stamps.length})`}</span>
            </button>
          </div>

          {/* Active filter count badge */}
          {(searchQuery || sliderPos < 0.999 || activeTab !== 'All Items' || onlyStamped) && (
            <div className="mt-4 flex items-center gap-3">
              <span className="px-2 py-1 bg-[#0055ff] text-white border-2 border-black font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0px_#000]">
                {filtered.length} Result{filtered.length !== 1 ? 's' : ''} Found
              </span>
              {onlyStamped && (
                <span className="px-2 py-1 bg-[#FFD400] text-black border-2 border-black font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0px_#000]">
                  Filtered: Stamped Only
                </span>
              )}
              <button
                onClick={handleResetAll}
                className="px-3 py-1 bg-neutral-900 text-white border-2 border-neutral-700 hover:border-yellow-400 hover:text-yellow-400 font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer"
              >
                Reset All Filters ✕
              </button>
            </div>
          )}
        </header>

        {/* ── Cards / Loading / Empty ──────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-64 bg-[#1a1a1a]/10 border-3 border-black p-5 animate-pulse shadow-[6px_6px_0px_#000]">
                <div className="w-16 h-4 bg-neutral-300 mb-4" />
                <div className="w-3/4 h-6 bg-neutral-300 mb-3" />
                <div className="w-full h-12 bg-neutral-300" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center border-3 border-black bg-white p-12 shadow-[8px_8px_0px_#000]">
            <h2 className="text-4xl font-extrabold font-outfit text-black mb-4">
              NOTHING HERE — YET.
            </h2>
            <p className="text-sm font-space text-neutral-700 max-w-md mx-auto mb-8 font-medium">
              No specimen records matched your current query or timescale filter.
            </p>
            <button
              onClick={handleResetAll}
              className="px-6 py-3 bg-yellow-400 text-black border-3 border-black font-mono font-bold text-xs uppercase shadow-[4px_4px_0px_#000] hover:bg-black hover:text-white transition-colors active:translate-y-[2px] active:shadow-none cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((entity) => (
              <div key={entity.id} className="gallery-card-wrapper">
                <EntityCard entity={entity} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
