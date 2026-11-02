'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';

/**
 * useSpatialAudio
 * Web Audio API procedural audio zones — no audio files required.
 * Generates industrial drones + noise bands matching 5 evolution stages.
 * Volume is mapped to ScrollTrigger progress externally via setZone().
 */

type Zone = 'ocean' | 'primordial' | 'dinosaur' | 'impact' | 'human' | 'silent';

export function useSpatialAudio() {
  const ctxRef  = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    noise: AudioBufferSourceNode;
    gainMaster: GainNode;
    gainOsc: GainNode;
    gainNoise: GainNode;
    filter: BiquadFilterNode;
  } | null>(null);
  const currentZone = useRef<Zone>('silent');

  const init = () => {
    if (ctxRef.current) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    // ── White noise buffer ──
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // ── Oscillators ──
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = 60;
    osc2.frequency.value = 63; // slight detuning for beating effect

    // ── Gain nodes ──
    const gainMaster = ctx.createGain();
    const gainOsc    = ctx.createGain();
    const gainNoise  = ctx.createGain();
    gainMaster.gain.value = 0;
    gainOsc.gain.value    = 0.3;
    gainNoise.gain.value  = 0.05;

    // ── Low-pass filter ──
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 1.5;

    // ── Routing ──
    osc1.connect(gainOsc);
    osc2.connect(gainOsc);
    noise.connect(gainNoise);
    gainOsc.connect(filter);
    gainNoise.connect(filter);
    filter.connect(gainMaster);
    gainMaster.connect(ctx.destination);

    osc1.start();
    osc2.start();
    noise.start();

    nodesRef.current = { osc1, osc2, noise, gainMaster, gainOsc, gainNoise, filter };
  };

  const setZone = (zone: Zone) => {
    if (!ctxRef.current || !nodesRef.current) return;
    if (zone === currentZone.current) return;
    currentZone.current = zone;

    const { osc1, osc2, gainMaster, gainOsc, gainNoise, filter } = nodesRef.current;
    const ctx = ctxRef.current;
    const t = ctx.currentTime;
    const isMuted = useAppStore.getState().audioMuted;

    // Zone-specific audio profiles:
    const profiles: Record<Zone, {
      freq1: number; freq2: number;
      masterVol: number; oscVol: number; noiseVol: number;
      filterFreq: number;
    }> = {
      silent:     { freq1: 60,  freq2: 63,  masterVol: 0,    oscVol: 0.3,  noiseVol: 0.05, filterFreq: 400  },
      ocean:      { freq1: 55,  freq2: 58,  masterVol: 0.35, oscVol: 0.25, noiseVol: 0.15, filterFreq: 200  },
      primordial: { freq1: 40,  freq2: 42,  masterVol: 0.3,  oscVol: 0.35, noiseVol: 0.1,  filterFreq: 150  },
      dinosaur:   { freq1: 80,  freq2: 84,  masterVol: 0.3,  oscVol: 0.4,  noiseVol: 0.05, filterFreq: 600  },
      impact:     { freq1: 28,  freq2: 31,  masterVol: 0.6,  oscVol: 0.2,  noiseVol: 0.5,  filterFreq: 80   }, // harsh sub-bass + noise
      human:      { freq1: 110, freq2: 115, masterVol: 0.2,  oscVol: 0.3,  noiseVol: 0.03, filterFreq: 1200 },
    };

    const p = profiles[zone];

    // Crossfade all params over 500ms
    osc1.frequency.linearRampToValueAtTime(p.freq1, t + 0.5);
    osc2.frequency.linearRampToValueAtTime(p.freq2, t + 0.5);
    gainMaster.gain.linearRampToValueAtTime(isMuted ? 0 : p.masterVol, t + 0.5);
    gainOsc.gain.linearRampToValueAtTime(p.oscVol, t + 0.5);
    gainNoise.gain.linearRampToValueAtTime(p.noiseVol, t + 0.5);
    filter.frequency.linearRampToValueAtTime(p.filterFreq, t + 0.5);
  };

  const start = () => {
    init();
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume();
    }
  };

  const stop = () => {
    if (!nodesRef.current || !ctxRef.current) return;
    nodesRef.current.gainMaster.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.5);
  };

  useEffect(() => {
    return () => {
      try {
        nodesRef.current?.gainMaster.disconnect();
      } catch {
        // ignore disconnect failure
      }
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        try {
          ctxRef.current.close().catch(() => {});
        } catch {
          // ignore closed state
        }
      }
    };
  }, []);

  return { start, stop, setZone };
}
