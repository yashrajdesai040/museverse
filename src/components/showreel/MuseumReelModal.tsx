'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { entities } from '@/data/entities';
import { Specimen3DViewer } from '@/components/canvas/Specimen3DViewer';

interface MuseumReelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHRONO_CHAPTERS = [
  {
    id: 'stromatolite-pilbara',
    epochTitle: 'ARCHEAN BIOGENESIS',
    timeLabel: '3.48 BILLION BCE',
    provenance: 'Pilbara Craton, Western Australia',
    narrative: 'Layered microbial reefs built by primordial cyanobacteria mats that precipitated Earth’s first oxygen atmosphere.',
  },
  {
    id: 'trex-sue',
    epochTitle: 'MESOZOIC APEX THEROPOD',
    timeLabel: '67 MILLION BCE',
    provenance: 'Hell Creek Formation, South Dakota',
    narrative: 'FMNH PR 2081: The most complete Tyrannosaurus rex skeleton ever discovered, possessing a crushing 57,000 N bite force.',
  },
  {
    id: 'kpg-boundary-clay',
    epochTitle: 'CHICXULUB IMPACT HORIZON',
    timeLabel: '66 MILLION BCE',
    provenance: 'Worldwide Stratigraphic Reference Layer',
    narrative: 'A razor-thin 3mm clay stratum enriched with extraterrestrial iridium, marking the mass extinction of 76% of all terrestrial species.',
  },
  {
    id: 'tutankhamun-death-mask',
    epochTitle: 'EGYPTIAN NEW KINGDOM',
    timeLabel: '1323 BCE',
    provenance: 'Valley of the Kings, Tomb KV62',
    narrative: 'Masterwork of antique metallurgy: 10.23 kg of solid gold inlaid with lapis lazuli, turquoise, and obsidian.',
  },
  {
    id: 'antikythera-mechanism',
    epochTitle: 'HELLENISTIC ANALOG COMPUTING',
    timeLabel: '205 BCE',
    provenance: 'Antikythera Shipwreck, Aegean Sea',
    narrative: '37 interlocking bronze gears calculating celestial motions, lunar anomalies, and solar eclipse cycles with Swiss watch precision.',
  },
  {
    id: 'voyager-golden-record',
    epochTitle: 'INTERSTELLAR AMBASSADOR',
    timeLabel: '1977 CE - ETERNITY',
    provenance: 'Voyager 1 & 2 • Interstellar Space',
    narrative: 'Electroplated gold phonograph disc carrying Earth’s cultural symphony, pulsar navigation coordinates, and greetings in 55 languages.',
  },
];

// Autonomous 3D Cinematic Camera Choreographer
function ChronoCameraDirector({ chapterIdx }: { chapterIdx: number }) {
  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime() * 0.35;
    // Elegant slow orbital crane move
    camera.position.x = Math.sin(t) * 5.8;
    camera.position.z = Math.cos(t) * 5.8;
    camera.position.y = 1.4 + Math.sin(t * 0.8) * 0.9;
    camera.lookAt(0, 0.2, 0);
  });
  return null;
}

export function MuseumReelModal({ isOpen, onClose }: MuseumReelModalProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { playClick, playLaser, playChime, playCalibrate } = useGlobalSound();

  const chapter = CHRONO_CHAPTERS[currentChapter];
  const entity = entities.find((e) => e.id === chapter.id) || entities[0];

  useEffect(() => {
    if (!isOpen) return;
    setElapsedSeconds(0);
  }, [isOpen, currentChapter]);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  useEffect(() => {
    // Auto-advance chapters every 12 seconds in director mode
    if (!isOpen || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentChapter((prev) => (prev + 1) % CHRONO_CHAPTERS.length);
      playLaser();
    }, 12000);
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, playLaser]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Archival Museum Widescreen Frame */}
      <div className="relative w-full max-w-6xl aspect-[16/10] sm:aspect-[16/9] bg-[#070707] text-white border-3 border-neutral-700 shadow-[18px_18px_0px_#000] flex flex-col justify-between overflow-hidden">
        {/* Subtle Archival Grain / CRT Scanlines */}
        <div className="absolute inset-0 crt-overlay pointer-events-none z-30" />

        {/* ── Top Archival Header ── */}
        <header className="relative z-30 flex items-center justify-between px-6 py-4 bg-black/85 border-b-2 border-neutral-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#ffd700] rounded-full animate-ping" />
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                MUSEO ARCHIVAL CINEMA // DEEP-TIME TOUR
              </div>
              <h2 className="text-lg sm:text-2xl font-black font-outfit uppercase tracking-tight text-white">
                {chapter.epochTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block px-3 py-1 bg-neutral-900 border border-neutral-700 font-mono text-xs text-[#ffd700] font-bold">
              {chapter.timeLabel}
            </span>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => {
                playCalibrate();
                setIsPlaying(!isPlaying);
              }}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-600 font-mono text-[11px] font-bold cursor-pointer"
            >
              {isPlaying ? '❚❚ PAUSE' : '▶ RESUME'}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="w-8 h-8 flex items-center justify-center bg-white text-black font-bold font-mono hover:bg-[#ffd700] transition-colors border border-black shadow-[2px_2px_0px_#fff] cursor-pointer"
              title="Exit Cinema Tour"
            >
              ✕
            </button>
          </div>
        </header>

        {/* ── Main 3D Canvas Viewport ── */}
        <div className="flex-1 relative cursor-grab active:cursor-grabbing">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 2, 5.5], fov: 45 }}
            gl={{ powerPreference: 'high-performance', antialias: true }}
          >
            <ambientLight intensity={0.8} color="#ffffff" />
            <directionalLight position={[6, 8, 6]} intensity={3.5} color="#fff2db" />
            <directionalLight position={[-6, -4, -4]} intensity={2.2} color="#00ffff" />
            <pointLight position={[0, -2, 2]} intensity={2.5} color="#ffd700" />

            {/* Cinematic Floating Specimen */}
            <Float floatIntensity={0.6} rotationIntensity={0.4} speed={1.2}>
              <Specimen3DViewer
                entity={entity}
                lightingPreset="dramatic"
                autoRotate={false}
                explodedView={false}
              />
            </Float>

            {/* Autonomous Director Crane Camera */}
            <ChronoCameraDirector chapterIdx={currentChapter} />
          </Canvas>

          {/* Teleprompter Curatorial Narrative Overlay */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-xl z-20 pointer-events-none">
            <div className="bg-black/85 p-4 border border-neutral-700 shadow-[6px_6px_0px_#000] backdrop-blur-md">
              <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                <span>STAGE {currentChapter + 1} OF {CHRONO_CHAPTERS.length}</span>
                <span>•</span>
                <span className="text-neutral-400">{chapter.provenance}</span>
              </div>
              <p className="text-sm font-space text-neutral-200 leading-relaxed font-medium">
                {chapter.narrative}
              </p>
            </div>
          </div>

          {/* Right Telemetry Badge */}
          <div className="absolute top-6 right-6 z-20 pointer-events-none font-mono text-right max-w-xs hidden sm:block">
            <div className="bg-black/75 p-3 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">
                SPECIMEN ACCESSION
              </span>
              <span className="text-sm font-bold text-[#ffd700] uppercase block">
                {entity.name}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">
                {entity.currentLocation}
              </span>
            </div>
          </div>
        </div>

        {/* ── Footer Bar: Chapter Navigation & Specimen Access ── */}
        <footer className="relative z-30 px-6 py-3.5 bg-black/95 border-t-2 border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          {/* Chapter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {CHRONO_CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  playCalibrate();
                  setCurrentChapter(idx);
                }}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-all cursor-pointer border ${
                  currentChapter === idx
                    ? 'bg-[#ffd700] text-black border-[#ffd700] shadow-[1px_1px_0px_#fff]'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white'
                }`}
              >
                0{idx + 1} {ch.epochTitle.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Direct Curatorial Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/museum/${entity.id}`}
              onClick={() => {
                playChime();
                onClose();
              }}
              className="px-3 py-1.5 bg-[#ffd700] hover:bg-white text-black font-bold uppercase text-[10px] border border-black shadow-[2px_2px_0px_#fff] transition-colors"
            >
              Examine Specimen ↗
            </Link>
            <Link
              href="/hall"
              onClick={() => {
                playClick();
                onClose();
              }}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-white hover:text-black text-neutral-200 font-bold uppercase text-[10px] border border-neutral-600 transition-colors"
            >
              Enter 3D Hall ↗
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
