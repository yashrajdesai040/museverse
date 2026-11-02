'use client';

import React, { useEffect, useState, useTransition, useCallback, useMemo, useRef } from 'react';
import {
  useEvolutionStore,
  PLANETARY_EPOCHS,
} from '@/stores/useEvolutionStore';
import { useAppStore } from '@/stores/useAppStore';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { PlanetaryCanvas } from '@/components/canvas/PlanetaryCanvas';
import {
  sliderToMa,
  getStageForMa,
  formatMa,
} from '@/lib/time';

// ─── 6 Major Geological Divisions ───
export interface GeologicalDivision {
  id: string;
  name: string;
  epochIndex: number;
  sliderPos: number;
  range: string;
  color: string;
  accent: string;
  summary: string;
}

export const GEOLOGICAL_DIVISIONS: GeologicalDivision[] = [
  {
    id: 'hadean',
    name: 'Hadean',
    epochIndex: 0,
    sliderPos: 0.0,
    range: '4.54 – 4.00 Ga',
    color: '#B34728',
    accent: '#E06D48',
    summary: 'Planetary accretion, incandescent magma ocean & lunar genesis via Theia collision.',
  },
  {
    id: 'archean',
    name: 'Archean',
    epochIndex: 1,
    sliderPos: 0.2,
    range: '4.00 – 2.50 Ga',
    color: '#286B7B',
    accent: '#4795A5',
    summary: 'Cooling crust, acidic iron seas & hydrothermal vent origins of earliest cellular life.',
  },
  {
    id: 'proterozoic',
    name: 'Proterozoic',
    epochIndex: 2,
    sliderPos: 0.4,
    range: '2.50 Ga – 541 Ma',
    color: '#5C7A87',
    accent: '#82A3B0',
    summary: 'The Great Oxidation Event transforms atmosphere; Snowball Earth glaciations yield multicellular life.',
  },
  {
    id: 'paleozoic',
    name: 'Paleozoic',
    epochIndex: 3,
    sliderPos: 0.6,
    range: '541 – 252 Ma',
    color: '#4C9A5B',
    accent: '#6EBA7D',
    summary: 'Cambrian Explosion fills the seas; arthropods, fish and early amphibians colonize land.',
  },
  {
    id: 'mesozoic',
    name: 'Mesozoic',
    epochIndex: 4,
    sliderPos: 0.8,
    range: '252 – 66 Ma',
    color: '#C27D30',
    accent: '#DFA35C',
    summary: 'Supercontinent Pangaea, warm greenhouse climate, giant conifers and apex dinosaur radiation.',
  },
  {
    id: 'cenozoic',
    name: 'Cenozoic',
    epochIndex: 5,
    sliderPos: 1.0,
    range: '66 Ma – Present',
    color: '#35628A',
    accent: '#5E8FB8',
    summary: 'Rapid mammalian radiation, cyclic ice age glaciations and the dawn of human civilization.',
  },
];

export default function EvolutionPage() {
  const epochProgress = useEvolutionStore((s) => s.epochProgress);
  const telemetry = useEvolutionStore((s) => s.telemetry);
  const isPlaying = useEvolutionStore((s) => s.isPlaying);
  const ambientAudioEnabled = useEvolutionStore((s) => s.ambientAudioEnabled);

  const setEpochProgress = useEvolutionStore((s) => s.setEpochProgress);
  const jumpToEpoch = useEvolutionStore((s) => s.jumpToEpoch);
  const togglePlay = useEvolutionStore((s) => s.togglePlay);
  const toggleAmbientAudio = useEvolutionStore((s) => s.toggleAmbientAudio);

  const { openEntityModal } = useAppStore();
  const {
    playClick,
    playLaser,
    playWarp,
    playEpochShift,
    playSwipe,
    playToggle,
    playDrawerOpen,
    playDrawerClose,
    startAmbient,
    setAmbientEpoch,
    stopAmbient,
  } = useGlobalSound();

  const [showDrawer, setShowDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [, startTransition] = useTransition();
  const lastScrubSoundTime = useRef(0);
  const prevEpochIndexRef = useRef<number | null>(null);

  // Normalized continuous slider position [0.0, 1.0]
  const currentSliderPos = Math.max(0, Math.min(1, epochProgress / 5));
  const currentMa = sliderToMa(currentSliderPos);
  const activeStage = getStageForMa(currentMa);

  // Active Geological Division (0 to 5) strictly synchronized with epoch index
  const activeDivisionIndex = Math.min(5, Math.floor(epochProgress + 0.02));
  const activeDivision = GEOLOGICAL_DIVISIONS[activeDivisionIndex] || GEOLOGICAL_DIVISIONS[0];

  // Fullscreen option handler
  const toggleFullscreen = useCallback(() => {
    playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, [playClick]);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Play cinematic space-time warp transition when crossing geological epochs
  useEffect(() => {
    if (prevEpochIndexRef.current === null) {
      prevEpochIndexRef.current = activeDivisionIndex;
      return;
    }
    if (activeDivisionIndex !== prevEpochIndexRef.current) {
      prevEpochIndexRef.current = activeDivisionIndex;
      playEpochShift();
    }
  }, [activeDivisionIndex, playEpochShift]);

  // Sync ambient soundscapes to active era
  useEffect(() => {
    if (ambientAudioEnabled) {
      startAmbient(activeStage.ambientSound);
      setAmbientEpoch(activeStage.ambientSound);
    } else {
      stopAmbient();
    }
  }, [activeStage.ambientSound, ambientAudioEnabled, startAmbient, setAmbientEpoch, stopAmbient]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        playClick();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        playClick();
        const next = Math.min(5, epochProgress + 0.2);
        setEpochProgress(next);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        playClick();
        const prev = Math.max(0, epochProgress - 0.2);
        setEpochProgress(prev);
      } else if (e.key === 'm' || e.key === 'M') {
        playClick();
        toggleAmbientAudio();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        setShowDrawer(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [epochProgress, playClick, togglePlay, setEpochProgress, toggleAmbientAudio, toggleFullscreen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050508] text-[#F9F6F0] flex flex-col select-none">
      {/* ── 1. Full-Screen Cinematic 3D Earth Canvas (Edge-to-Edge & Free) ── */}
      <div className="absolute inset-0 z-0">
        <PlanetaryCanvas />
      </div>

      {/* ── 2. Top Curatorial Header & Integrated Era Badge (Top-Left, Zero Collision) ── */}
      <header className="relative z-10 px-6 sm:px-10 pt-24 sm:pt-26 pb-2 flex flex-col sm:flex-row sm:items-start justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto max-w-sm sm:max-w-md">
          {/* Main Exhibition Title */}
          <div className="flex items-center gap-2.5 mb-1">
            <span
              className="w-2 h-2 rounded-full transition-colors duration-500"
              style={{ backgroundColor: activeDivision.accent }}
            />
            <h1 className="font-serif text-lg sm:text-2xl font-light text-white tracking-tight">
              4.54 Billion Years of Earth
            </h1>
          </div>

          {/* Minimalist Floating Era Card (Integrated cleanly in top-left, no overlap anywhere) */}
          <div className="mt-2 p-3 sm:p-3.5 rounded-2xl bg-[#0a0a0c]/60 border border-white/10 backdrop-blur-md transition-all duration-300 shadow-lg">
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <span className="font-serif text-lg sm:text-xl font-normal text-white">
                {activeDivision.name}
              </span>
              <span className="font-mono text-xs text-amber-300/90 font-medium tabular-nums">
                {activeDivision.range}
              </span>
            </div>
            <p className="text-xs text-stone-300/80 font-sans leading-relaxed line-clamp-2">
              {activeDivision.summary}
            </p>
            <div className="flex items-center gap-2.5 mt-2 pt-1.5 border-t border-white/5 font-mono text-[11px] text-stone-400">
              <span>Temp: <strong className="text-stone-200 font-normal">{telemetry.surfaceTemp}</strong></span>
              <span>·</span>
              <span>O₂: <strong className="text-sky-300 font-normal">{telemetry.o2Percent}</strong></span>
              <span>·</span>
              <span className="text-amber-300/80 font-medium">{formatMa(currentMa)}</span>
            </div>
          </div>
        </div>

        {/* Top-Right Exhibition Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Fullscreen Option */}
          <button
            onClick={toggleFullscreen}
            className="h-9 px-3.5 rounded-full flex items-center gap-1.5 bg-black/40 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors text-xs font-mono cursor-pointer backdrop-blur-md"
            title="Toggle Fullscreen (F)"
          >
            <span>{isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}</span>
          </button>

          {/* Audio Ambient Toggle */}
          <button
            onClick={() => {
              playToggle(!ambientAudioEnabled);
              toggleAmbientAudio();
            }}
            data-sound="none"
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono transition-all cursor-pointer border ${
              ambientAudioEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-black/40 text-stone-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
            title={ambientAudioEnabled ? 'Mute audio (M)' : 'Enable audio (M)'}
          >
            {ambientAudioEnabled ? '🔊' : '🔇'}
          </button>

          {/* Specimens Drawer Trigger */}
          <button
            onClick={() => {
              if (!showDrawer) playDrawerOpen();
              else playDrawerClose();
              setShowDrawer(!showDrawer);
            }}
            data-sound="none"
            className="h-9 px-3.5 rounded-full flex items-center gap-2 bg-black/40 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors text-xs font-mono cursor-pointer backdrop-blur-md"
            title="Inspect verified specimens"
          >
            <span>Specimens</span>
            <span className="text-[10px] text-amber-300/80 font-sans">↗</span>
          </button>
        </div>
      </header>

      {/* ── 3. Expansive Open Center (100% Free, Zero Overlap, Unobstructed Earth) ── */}
      <div className="flex-1 pointer-events-none" />

      {/* ── 4. Thin Horizontal Geological Timeline with ONE RUN BUTTON ONLY ── */}
      <footer className="relative z-10 px-4 sm:px-10 pb-6 pt-1 pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-4xl rounded-2xl bg-[#0c0c0e]/80 border border-white/10 backdrop-blur-lg px-4 py-2.5 shadow-2xl flex items-center gap-3">
          {/* ONE RUN BUTTON ONLY */}
          <button
            onClick={() => {
              playToggle(!isPlaying);
              togglePlay();
            }}
            data-sound="none"
            className={`h-8 px-4 rounded-xl flex items-center gap-2 text-xs font-mono transition-all cursor-pointer border shrink-0 ${
              isPlaying
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300 shadow-sm font-semibold'
            }`}
            title={isPlaying ? 'Pause simulation (Space)' : 'Run Deep Time simulation (Space)'}
          >
            <span>{isPlaying ? '⏸' : '▶'}</span>
            <span className="uppercase tracking-wider text-[11px]">
              {isPlaying ? 'Pause' : 'Run'}
            </span>
          </button>

          {/* Thin Horizontal Geological Timeline Bar with Division Markers */}
          <div className="relative flex-1 h-8 flex items-center group cursor-pointer">
            {/* Background 6-Segment Division Bar */}
            <div className="relative w-full h-2 rounded-full overflow-hidden flex bg-white/5 border border-white/10">
              {GEOLOGICAL_DIVISIONS.map((div, i) => {
                const isActive = activeDivisionIndex === i;
                return (
                  <div
                    key={div.id}
                    onClick={() => {
                      jumpToEpoch(i);
                    }}
                    style={{
                      backgroundColor: div.color,
                      opacity: isActive ? 0.95 : 0.45,
                    }}
                    className="flex-1 h-full transition-opacity cursor-pointer hover:opacity-100 border-r border-black/40 last:border-r-0"
                    title={`${div.name} (${div.range})`}
                  />
                );
              })}
            </div>

            {/* Continuous Interactive Time Scrubber Input */}
            <input
              type="range"
              min="0"
              max="5"
              step="0.01"
              value={epochProgress}
              aria-label="Geological Time Slider"
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                const now = performance.now();
                if (now - lastScrubSoundTime.current > 75) {
                  lastScrubSoundTime.current = now;
                  playSwipe();
                }
                startTransition(() => {
                  setEpochProgress(val);
                });
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />

            {/* Glowing Scrubber Playhead Position Marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75 z-10"
              style={{
                left: `${currentSliderPos * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
            </div>
          </div>
        </div>

        {/* 6 Era Division Labels under the bar */}
        <div className="mx-auto max-w-4xl grid grid-cols-6 pt-1.5 px-8 text-center pointer-events-none">
          {GEOLOGICAL_DIVISIONS.map((div, i) => {
            const isActive = activeDivisionIndex === i;
            return (
              <button
                key={div.id}
                onClick={() => {
                  playWarp();
                  jumpToEpoch(i);
                }}
                className={`font-serif text-[10px] sm:text-[11px] truncate transition-colors pointer-events-auto cursor-pointer ${
                  isActive ? 'text-white font-medium' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                {div.name}
              </button>
            );
          })}
        </div>
      </footer>

      {/* ── 5. Verified Specimens & Curatorial Relics Drawer (On Demand) ── */}
      {showDrawer && (
        <aside className="fixed top-16 sm:top-[72px] bottom-0 right-0 z-50 w-full sm:w-[400px] bg-[#0E0E11]/95 border-l border-white/10 p-6 shadow-2xl backdrop-blur-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          <div>
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: activeDivision.accent }}
                />
                <span className="font-mono text-xs text-stone-300 uppercase tracking-wider">
                  {activeDivision.name} Archive
                </span>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer text-sm transition-colors"
                title="Close drawer (Esc)"
              >
                ×
              </button>
            </div>

            <h3 className="font-serif text-2xl text-white font-light mb-1">
              {telemetry.epochTitle.split('—')[0]?.trim() || telemetry.epochTitle}
            </h3>
            <p className="font-mono text-xs text-amber-300/80 mb-4">
              {telemetry.tagline}
            </p>
            <p className="text-xs text-stone-300 leading-relaxed mb-6 font-sans">
              {telemetry.description}
            </p>

            {/* Scientific Parameters */}
            <div className="mb-6 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="block font-mono text-[10px] text-stone-400 uppercase tracking-widest mb-2">
                Paleo-Atmospheric Telemetry
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-stone-500 block text-[10px]">Surface Temp</span>
                  <span className="text-white">{telemetry.surfaceTemp}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Oxygen (O₂)</span>
                  <span className="text-sky-300">{telemetry.o2Percent}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">CO₂ Level</span>
                  <span className="text-amber-200">{telemetry.co2Ppm}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Continents</span>
                  <span className="text-stone-300 truncate block">{telemetry.continents}</span>
                </div>
              </div>
            </div>

            {/* Verified Museum Specimens */}
            {telemetry.linkedSpecimens && telemetry.linkedSpecimens.length > 0 && (
              <div className="mb-6">
                <span className="block text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-2.5">
                  Verified Museum Specimens:
                </span>
                <div className="flex flex-col gap-2">
                  {telemetry.linkedSpecimens.map((spec) => (
                    <button
                      key={spec.id}
                      onClick={() => {
                        playLaser();
                        openEntityModal(spec.id);
                      }}
                      className="p-3 rounded-xl bg-white/5 hover:bg-amber-400/20 hover:border-amber-400/40 border border-white/10 text-left transition-all cursor-pointer flex items-center justify-between text-xs font-mono group"
                    >
                      <span className="text-stone-200 group-hover:text-amber-300">✦ {spec.name}</span>
                      <span className="text-[10px] text-stone-400 group-hover:text-white">Inspect 3D ↗</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowDrawer(false)}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer mt-4"
          >
            Return to Earth View
          </button>
        </aside>
      )}
    </div>
  );
}
