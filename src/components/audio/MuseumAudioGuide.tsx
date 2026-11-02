'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MuseumEntity } from '@/types/museum';

interface MuseumAudioGuideProps {
  entity: MuseumEntity;
}

// Curatorial audio scripts for museum items
function getCuratorScript(entity: MuseumEntity): string {
  const name = entity.name;
  const period = entity.periodLabel;
  const age = entity.yearsAgo > 1_000_000
    ? `${(entity.yearsAgo / 1_000_000).toFixed(1)} million years ago`
    : `${entity.yearsAgo.toLocaleString()} years ago`;
  const location = entity.currentLocation;

  return `Welcome to the MUSEO Specimen Archive. You are inspecting ${name}, dating back to the ${period}, approximately ${age}. Currently curated at ${location}. ${entity.significance} Discoveries such as this provide an unbroken geological link connecting modern observation to deep planetary time. Notice the structural nuances and surface patina rendered in your viewport.`;
}

export function MuseumAudioGuide({ entity }: MuseumAudioGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [voiceGender, setVoiceGender] = useState<'curator' | 'archaeologist'>('curator');
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const script = useMemoScript(entity);

  function useMemoScript(ent: MuseumEntity) {
    return useMemo(() => getCuratorScript(ent), [ent]);
  }

  // Check speech synthesis support on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  // Web Audio Procedural Background Resonance
  const startAtmosphericDrone = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Base drone oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Atmospheric frequency based on era
      const freq = entity.yearsAgo > 50_000_000 ? 55 : entity.yearsAgo > 10_000 ? 110 : 220;
      osc.type = entity.type === 'fossil' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch {
      // Audio context might be restricted before user gesture
    }
  }, [entity]);

  const stopAtmosphericDrone = useCallback(() => {
    if (gainRef.current && audioCtxRef.current) {
      try {
        gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.4);
        setTimeout(() => {
          oscRef.current?.stop();
          oscRef.current?.disconnect();
          oscRef.current = null;
        }, 400);
      } catch {
        // ignore
      }
    }
  }, []);

  // Waveform Canvas Visualizer
  const renderWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barCount = 28;
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        // Animated frequency amplitude
        const amp = isPlaying
          ? Math.sin(phase + i * 0.35) * 0.4 + Math.cos(phase * 1.5 + i * 0.2) * 0.3 + 0.35
          : 0.08;
        const barHeight = Math.max(3, amp * (height - 6));
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = isPlaying ? '#ffd700' : '#555555';
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      phase += 0.08;
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      renderWaveform();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderWaveform();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, renderWaveform]);

  // Voice narration player
  const handleTogglePlay = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      stopAtmosphericDrone();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    startAtmosphericDrone();

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = playbackSpeed;
    utterance.pitch = voiceGender === 'curator' ? 0.95 : 1.15;

    // Pick best English voice if available
    const voices = window.speechSynthesis.getVoices();
    const enVoices = voices.filter((v) => v.lang.startsWith('en'));
    if (enVoices.length > 0) {
      if (voiceGender === 'curator') {
        utterance.voice = enVoices.find((v) => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george')) || enVoices[0];
      } else {
        utterance.voice = enVoices.find((v) => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('susan')) || enVoices[1] || enVoices[0];
      }
    }

    utterance.onend = () => {
      setIsPlaying(false);
      stopAtmosphericDrone();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      stopAtmosphericDrone();
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [isPlaying, playbackSpeed, voiceGender, script, startAtmosphericDrone, stopAtmosphericDrone]);

  // Cleanup on unmount or entity change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      stopAtmosphericDrone();
    };
  }, [entity, stopAtmosphericDrone]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="w-full bg-[#111111] border-3 border-black text-white p-5 shadow-[6px_6px_0px_#000] font-mono">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-neutral-800 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#ffd700] rounded-none animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#ffd700]">
            AI Specimen Audio Curator
          </span>
        </div>
        <span className="text-[10px] uppercase text-neutral-400 bg-neutral-900 px-2 py-0.5 border border-neutral-700 font-bold">
          Spatial Guide 2.0
        </span>
      </div>

      {/* Center Waveform & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Play / Stop Button */}
        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-2 px-5 py-2.5 border-2 border-black font-bold text-xs uppercase transition-all shadow-[3px_3px_0px_#000] active:translate-y-0.5 active:shadow-none cursor-pointer ${
            isPlaying
              ? 'bg-[#ff3b3b] text-white hover:bg-black'
              : 'bg-[#ffd700] text-black hover:bg-white'
          }`}
          data-cursor
        >
          <span>{isPlaying ? '⏹ Pause Narration' : '▶ Play Audio Guide'}</span>
        </button>

        {/* Real-time Waveform Canvas */}
        <div className="flex-1 w-full sm:w-auto h-10 bg-neutral-950 border border-neutral-800 flex items-center justify-center px-2">
          <canvas
            ref={canvasRef}
            width={240}
            height={32}
            className="w-full h-full"
          />
        </div>

        {/* Voice & Speed Selectors */}
        <div className="flex items-center gap-2">
          {/* Voice Gender Switcher */}
          <button
            onClick={() => setVoiceGender(voiceGender === 'curator' ? 'archaeologist' : 'curator')}
            className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 text-[10px] text-neutral-300 hover:text-white uppercase font-bold"
            title="Toggle Curator Voice"
          >
            {voiceGender === 'curator' ? '👨‍🏫 Dr. Hayes' : '👩‍🔬 Dr. Elena'}
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => {
              const speeds = [1.0, 1.25, 1.5];
              const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
              setPlaybackSpeed(speeds[nextIdx]);
            }}
            className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 text-[10px] text-[#ffd700] font-bold"
            title="Playback Speed"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Transcript Collapsible Toggle */}
      <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="hover:text-yellow-400 underline uppercase"
        >
          {showTranscript ? 'Hide Curator Transcript ▲' : 'View Full Curator Transcript ▼'}
        </button>
        <span className="text-neutral-500">Binaural Acoustic Synthesis</span>
      </div>

      {/* Full Transcript Text */}
      {showTranscript && (
        <div className="mt-3 p-3 bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 leading-relaxed font-space select-text">
          {script}
        </div>
      )}
    </div>
  );
}
