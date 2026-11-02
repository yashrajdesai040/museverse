'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { soundEngine } from '@/hooks/useGlobalSound';

/**
 * ═══════════════════════════════════════════════════════════════════════
 * GLOBAL HAPTIC & SONORIC LANDSCAPE SYSTEM (MUSEO V4 FLAWLESS EDITION)
 * Award-winning luxury museum audio architecture with purposeful balance:
 * - Responsive tactile clicks on all interactive buttons, links & tabs.
 * - Whisper-soft velvet hover ticks on cards, buttons & nav pills.
 * - Silent reading on paragraph/article body text (no distractions).
 * - Real studio cinematic ambient drone with smooth epoch crossfades.
 * - Tab visibility ducking (silences when blurred, blooms when focused).
 * - Archival specimen vitrine drawer open/close acoustics on modals.
 * ═══════════════════════════════════════════════════════════════════════
 */
export function GlobalSoundProvider() {
  const lastKeyTime = useRef(0);
  const lastClickTime = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check sound preference (Defaults to active unless explicitly muted)
    const savedPref = localStorage.getItem('museo_sound_pref');
    if (savedPref === 'muted') {
      useAppStore.getState().setAudioMuted(true);
    } else {
      useAppStore.getState().setAudioMuted(false);
    }

    // 2. Audio Context Unlock and Ambient Bloom on first user gesture
    const unlockOnGesture = async () => {
      await soundEngine.unlockAudio();
      if (!useAppStore.getState().audioMuted) {
        soundEngine.startAmbient('01-hadean');
      }
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
    };
    window.addEventListener('pointerdown', unlockOnGesture, { passive: true, once: true });
    window.addEventListener('keydown', unlockOnGesture, { passive: true, once: true });

    // 3. Interactive Cursor Tracking (Stereo Panning & Filter Air)
    let lastX = 0;
    let lastY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (useAppStore.getState().audioMuted) return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const normX = (e.clientX / w) * 2 - 1; // -1 (left) to +1 (right)
      const normY = 1 - e.clientY / h;      // 0 (bottom) to 1 (top)

      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      lastX = e.clientX;
      lastY = e.clientY;

      soundEngine.modulateAmbientWithCursor(normX, normY, velocity);
    };

    // 4. Global Delegated Click Listener
    const handleGlobalClick = (e: MouseEvent) => {
      if (useAppStore.getState().audioMuted) return;

      const now = performance.now();
      if (now - lastClickTime.current < 50) return;
      lastClickTime.current = now;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ignore if clicking an entity card (handled cleanly by card action)
      if (target.closest('.entity-card')) {
        return;
      }

      // Check for interactive controls: buttons, links, tabs, switches
      const clickable = target.closest<HTMLElement>(
        'button, a, [role="button"], [role="tab"], [role="switch"], input[type="checkbox"], input[type="radio"], [data-sound], summary'
      );
      if (!clickable) return;

      const customSound = clickable.getAttribute('data-sound');
      if (customSound === 'none') return;

      if (customSound === 'stamp') {
        soundEngine.playStamp();
        return;
      }
      if (customSound === 'select') {
        soundEngine.playSelect();
        return;
      }
      if (customSound === 'confirm') {
        soundEngine.playConfirm();
        return;
      }
      if (customSound === 'laser') {
        soundEngine.playLaser();
        return;
      }
      if (customSound === 'chime') {
        soundEngine.playChime();
        return;
      }
      if (customSound === 'bell') {
        soundEngine.playBell();
        return;
      }
      if (customSound === 'singing_bowl') {
        soundEngine.playSingingBowl();
        return;
      }
      if (customSound === 'warp') {
        soundEngine.playWarp();
        return;
      }
      if (customSound === 'impact') {
        soundEngine.playImpact();
        return;
      }
      if (customSound === 'toggle') {
        soundEngine.playToggle();
        return;
      }
      if (customSound === 'inspect') {
        soundEngine.playInspect();
        return;
      }
      if (customSound === 'mint') {
        soundEngine.playMintCert();
        return;
      }

      // Checkboxes & switches
      if (clickable instanceof HTMLInputElement && (clickable.type === 'checkbox' || clickable.type === 'radio')) {
        soundEngine.playToggle(clickable.checked);
        return;
      }

      // Dialog & Drawer close buttons
      const ariaLabel = clickable.getAttribute('aria-label') || '';
      const title = clickable.getAttribute('title') || '';
      if (
        ariaLabel.toLowerCase().includes('close') ||
        title.toLowerCase().includes('close') ||
        clickable.classList.contains('close-btn')
      ) {
        soundEngine.playDrawerClose();
        return;
      }

      // Tactile click on buttons and navigation links
      soundEngine.playClick();
    };

    // 5. Purposeful Hover Listener (Interactive Elements, Cards & Navigation)
    let lastHoveredElement: HTMLElement | null = null;
    const handleGlobalMouseOver = (e: MouseEvent) => {
      if (useAppStore.getState().audioMuted) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Don't hover on plain reading text inside paragraphs or prose
      if (target.closest('p, article, .prose')) return;

      // Interactive controls: buttons, tabs, links, specimen cards, and custom hover elements
      const interactive = target.closest<HTMLElement>(
        'button, a, [role="button"], [role="tab"], .entity-card, .specimen-card, [data-sound-hover], [data-cursor], [data-magnetic]'
      );
      if (interactive && interactive !== lastHoveredElement) {
        lastHoveredElement = interactive;
        soundEngine.playHover();
      } else if (!interactive) {
        lastHoveredElement = null;
      }
    };

    // 6. Archival Typewriter Keystroke Listener (Dedicated input fields ONLY)
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (useAppStore.getState().audioMuted) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable;

      if (!isInput) return;

      // Only fire typewriter in text/search fields, not sliders or range
      if (target instanceof HTMLInputElement && ['range', 'checkbox', 'radio', 'file'].includes(target.type)) {
        return;
      }

      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
        return;
      }

      const now = performance.now();
      if (now - lastKeyTime.current < 35) return;
      lastKeyTime.current = now;

      soundEngine.playTypewriter();
    };

    // 7. Page Visibility Listener (Smooth ducking)
    const handleVisibility = () => {
      if (document.hidden) {
        soundEngine.duckAmbient(true);
      } else {
        if (!useAppStore.getState().audioMuted) {
          soundEngine.duckAmbient(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    document.addEventListener('mouseover', handleGlobalMouseOver, { passive: true });
    document.addEventListener('keydown', handleGlobalKeyDown, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    // 8. Store Subscription for Modal Open / Close Acoustics
    let prevSearchOpen = useAppStore.getState().searchModalOpen;
    let prevShortcutsOpen = useAppStore.getState().shortcutsModalOpen;
    let prevActiveEntity = useAppStore.getState().activeEntityId;

    const unsubscribe = useAppStore.subscribe((state) => {
      if (state.audioMuted) {
        soundEngine.stopAmbient();
        return;
      } else {
        soundEngine.startAmbient('01-hadean');
      }

      if (state.searchModalOpen !== prevSearchOpen) {
        if (state.searchModalOpen) soundEngine.playDrawerOpen();
        else soundEngine.playDrawerClose();
        prevSearchOpen = state.searchModalOpen;
      }

      if (state.shortcutsModalOpen !== prevShortcutsOpen) {
        if (state.shortcutsModalOpen) soundEngine.playDrawerOpen();
        else soundEngine.playDrawerClose();
        prevShortcutsOpen = state.shortcutsModalOpen;
      }

      if (state.activeEntityId !== prevActiveEntity) {
        if (state.activeEntityId) {
          soundEngine.playDrawerOpen();
          setTimeout(() => {
            if (!useAppStore.getState().audioMuted) soundEngine.playChime();
          }, 180);
        } else {
          soundEngine.playDrawerClose();
        }
        prevActiveEntity = state.activeEntityId;
      }
    });

    return () => {
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleGlobalClick, { capture: true });
      document.removeEventListener('mouseover', handleGlobalMouseOver);
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('visibilitychange', handleVisibility);
      unsubscribe();
    };
  }, []);

  return null;
}
