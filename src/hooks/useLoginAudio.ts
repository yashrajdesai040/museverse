'use client';

import { useCallback, useRef } from 'react';
import { useLoginStore } from '@/stores/useLoginStore';
import { useAppStore } from '@/stores/useAppStore';
import { soundEngine } from '@/hooks/useGlobalSound';

/* ═══════════════════════════════════════════════════════
   MUSEO LOGIN & ADMISSION AUDIO
   Powered by master studio sound assets + unified sound engine.
   ═══════════════════════════════════════════════════════ */

export function useLoginAudio() {
  const printTimersRef = useRef<NodeJS.Timeout[]>([]);
  const footstepTimersRef = useRef<NodeJS.Timeout[]>([]);

  const isMuted = useCallback(() => {
    return !useLoginStore.getState().soundEnabled || useAppStore.getState().audioMuted;
  }, []);

  // 1. Ambient drone (wind + low pad)
  const playAmbience = useCallback(() => {
    if (isMuted()) return;
    soundEngine
      .unlockAudio()
      .then(() => {
        if (!isMuted()) {
          soundEngine.startAmbient('01-hadean');
        }
      })
      .catch(() => {});
  }, [isMuted]);

  // 2. Printer (crisp rhythmic mechanical ticker - 4 short ticks)
  const playPrint = useCallback(() => {
    if (isMuted()) return;
    printTimersRef.current.forEach(clearTimeout);
    printTimersRef.current = [];

    for (let i = 0; i < 4; i++) {
      const timer = setTimeout(() => {
        if (!isMuted()) {
          soundEngine.playTick();
        }
      }, i * 160);
      printTimersRef.current.push(timer);
    }
  }, [isMuted]);

  // 3. Paper tear
  const playTear = useCallback(() => {
    if (isMuted()) return;
    soundEngine.playTear();
  }, [isMuted]);

  // 4. Wax-seal stamp thud
  const playStamp = useCallback(() => {
    if (isMuted()) return;
    soundEngine.playStamp();
  }, [isMuted]);

  // 5. Gate unlocking sweep & grand iron echo
  const playGateOpen = useCallback(() => {
    if (isMuted()) return;
    soundEngine.playGateEcho();
    soundEngine.playUnlock();
  }, [isMuted]);

  // 6. Access denied (dissonant sub impact)
  const playDenied = useCallback(() => {
    if (isMuted()) return;
    soundEngine.playShatter();
  }, [isMuted]);

  // 7. Mechanical keystroke strike
  const playKeystroke = useCallback(() => {
    if (isMuted()) return;
    soundEngine.playTypewriter();
  }, [isMuted]);

  // 8. Footsteps
  const playFootsteps = useCallback(() => {
    if (isMuted()) return;
    footstepTimersRef.current.forEach(clearTimeout);
    footstepTimersRef.current = [];

    for (let i = 0; i < 4; i++) {
      const timer = setTimeout(() => {
        if (!isMuted()) {
          soundEngine.playFootstep();
        }
      }, i * 420);
      footstepTimersRef.current.push(timer);
    }
  }, [isMuted]);

  // 9. Cleanup
  const dispose = useCallback(() => {
    printTimersRef.current.forEach(clearTimeout);
    printTimersRef.current = [];
    footstepTimersRef.current.forEach(clearTimeout);
    footstepTimersRef.current = [];
    soundEngine.stopAmbient();
  }, []);

  return {
    playAmbience,
    playPrint,
    playTear,
    playStamp,
    playGateOpen,
    playDenied,
    playKeystroke,
    playFootsteps,
    dispose,
  };
}
