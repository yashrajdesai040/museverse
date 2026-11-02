'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/useAppStore';
import { useGlobalSound } from '@/hooks/useGlobalSound';

export function ShortcutsModal() {
  const router = useRouter();
  const {
    shortcutsModalOpen,
    closeShortcutsModal,
    toggleShortcutsModal,
    toggleSearchModal,
    toggleAudio,
    audioMuted,
  } = useAppStore();
  const { playClick, playHover } = useGlobalSound();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Check ? or /
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        playClick();
        toggleShortcutsModal();
        return;
      }

      if (e.key === 'Escape' && shortcutsModalOpen) {
        closeShortcutsModal();
        return;
      }

      // Quick Nav keys ONLY when Shortcuts Modal is actively open
      if (shortcutsModalOpen) {
        if (e.key === '1' || e.key.toLowerCase() === 'h') {
          playClick();
          closeShortcutsModal();
          router.push('/');
        } else if (e.key === '2' || e.key.toLowerCase() === 'e') {
          playClick();
          closeShortcutsModal();
          router.push('/evolution');
        } else if (e.key === '3' || e.key.toLowerCase() === 'm') {
          playClick();
          closeShortcutsModal();
          router.push('/museum');
        } else if (e.key === '4' || e.key.toLowerCase() === 'l') {
          playClick();
          closeShortcutsModal();
          router.push('/login');
        } else if (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'a') {
          playClick();
          toggleAudio();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    shortcutsModalOpen,
    toggleShortcutsModal,
    closeShortcutsModal,
    toggleAudio,
    toggleSearchModal,
    router,
    playClick,
  ]);

  if (!shortcutsModalOpen) return null;

  const shortcuts = [
    { key: '1 / H', desc: 'Home Exhibition Hall', action: () => router.push('/') },
    { key: '2 / E', desc: '3D Earth Evolution Engine (4.5 Ga)', action: () => router.push('/evolution') },
    { key: '3 / M', desc: 'Virtual Specimen Archive (24 Items)', action: () => router.push('/museum') },
    { key: '4 / L', desc: 'Living Admission Pass Portal', action: () => router.push('/login') },
    { key: '⌘ + K', desc: 'Universal Specimen Search', action: () => toggleSearchModal() },
    {
      key: 'S / A',
      desc: audioMuted ? 'Unmute Procedural Audio' : 'Mute Soundscapes',
      badge: audioMuted ? 'MUTED' : 'ACTIVE',
      action: () => toggleAudio(),
    },
    { key: 'ESC', desc: 'Dismiss Active Inspection Overlay', action: () => closeShortcutsModal() },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="w-full max-w-xl bg-[#f7f4ed] border-3 border-black shadow-[12px_12px_0px_#000000] p-6 md:p-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 bg-amber-500 border border-black shadow-[1.5px_1.5px_0px_#000]" />
            <h2 className="font-outfit font-extrabold text-xl uppercase tracking-wider text-black">
              System Command Cheatsheet
            </h2>
          </div>
          <button
            onClick={() => {
              playClick();
              closeShortcutsModal();
            }}
            className="w-8 h-8 flex items-center justify-center bg-black text-white hover:bg-amber-500 hover:text-black font-mono font-bold text-sm border-2 border-black transition-colors cursor-pointer"
            data-cursor
          >
            ✕
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="space-y-2.5 overflow-y-auto pr-1">
          {shortcuts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                playClick();
                item.action();
                closeShortcutsModal();
              }}
              onMouseEnter={playHover}
              className="w-full flex items-center justify-between p-3.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-amber-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000000] transition-all text-left cursor-pointer group"
              data-cursor
            >
              <span className="font-space text-xs md:text-sm font-bold text-neutral-900 group-hover:text-black">
                {item.desc}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-amber-400 border border-black">
                    {item.badge}
                  </span>
                )}
                <kbd className="px-2.5 py-1 bg-neutral-100 group-hover:bg-amber-400 border border-black font-mono text-xs font-black text-black shadow-[1px_1px_0px_#000] transition-colors">
                  {item.key}
                </kbd>
              </div>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-neutral-400 flex items-center justify-between font-mono text-[10px] text-neutral-600">
          <span>PRESS KEY ANYTIME TO TRIGGER</span>
          <span className="font-bold text-black">MUSEO ARCHIVE CORE 3.0</span>
        </div>
      </div>
    </div>
  );
}
