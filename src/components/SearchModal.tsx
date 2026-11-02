'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { entities } from '@/data/entities';
import Link from 'next/link';
import { isFossil } from '@/types/museum';

export function SearchModal() {
  const { searchModalOpen, closeSearchModal, openEntityModal } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard navigation & Ctrl+K shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useAppStore.getState().toggleSearchModal();
      }
      if (e.key === 'Escape' && searchModalOpen) {
        closeSearchModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchModalOpen, closeSearchModal]);

  if (!searchModalOpen) return null;

  const filtered = query.trim() === '' ? entities : entities.filter((e) => {
    const q = query.toLowerCase();
    const speciesMatch = isFossil(e) ? e.species.toLowerCase().includes(q) : false;
    return (
      e.name.toLowerCase().includes(q) ||
      e.significance.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.periodLabel.toLowerCase().includes(q) ||
      speciesMatch
    );
  });

  return (
    <div className="fixed inset-0 z-[99999] bg-[#1a1a1a]/95 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Centered Cream Panel (Strict Brutalist, No Blur) */}
      <div className="w-full max-w-3xl bg-[#f5f0e8] border-3 border-black shadow-[12px_12px_0px_#000000] flex flex-col max-h-[85vh]">
        {/* Header / Input */}
        <div className="p-6 border-b-3 border-black bg-white flex items-center gap-4">
          <svg className="w-6 h-6 text-black stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            type="text"
            autoFocus
            placeholder="TYPE TO SEARCH SPECIMENS (e.g. 'T-Rex', 'Rosetta Stone')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-black placeholder-neutral-500 font-mono font-bold text-base md:text-lg focus:outline-none uppercase"
          />

          <kbd className="hidden sm:inline-block px-2 py-1 bg-yellow-400 border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000]">
            ESC
          </kbd>

          <button
            onClick={closeSearchModal}
            className="px-3 py-1 bg-black text-white hover:bg-yellow-400 hover:text-black font-mono font-bold text-sm border-2 border-black transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Live Filtered Results */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-neutral-600 font-mono font-bold border-2 border-dashed border-black">
              NO MATCHING SPECIMENS FOUND FOR "{query.toUpperCase()}".
            </div>
          ) : (
            filtered.map((entity, idx) => (
              <div
                key={entity.id}
                className={`group p-5 bg-white border-3 border-black shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  idx === selectedIndex ? 'ring-3 ring-[#0055ff]' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 bg-yellow-400 border-2 border-black text-[10px] font-mono font-bold uppercase shadow-[1.5px_1.5px_0px_#000]">
                      {entity.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase">
                      {entity.periodLabel} • {entity.yearsAgo > 1000000 ? `${(entity.yearsAgo / 1000000).toFixed(0)} MYA` : `${entity.yearsAgo.toLocaleString()} Y.A.`}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold font-outfit text-black group-hover:text-yellow-600 transition-colors">
                    {entity.name}
                  </h4>

                  <p className="text-xs text-neutral-700 font-space line-clamp-2 mt-1 font-medium">
                    {entity.significance}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => {
                      closeSearchModal();
                      openEntityModal(entity.id);
                    }}
                    className="px-3 py-1.5 bg-black text-white hover:bg-yellow-400 hover:text-black font-mono font-bold text-xs uppercase border-2 border-black transition-colors shadow-[2px_2px_0px_#000]"
                  >
                    Quick 3D ↗
                  </button>

                  <Link
                    href={`/museum/${entity.id}`}
                    onClick={closeSearchModal}
                    className="px-3 py-1.5 bg-yellow-400 text-black hover:bg-black hover:text-white font-mono font-bold text-xs uppercase border-2 border-black transition-colors shadow-[2px_2px_0px_#000]"
                  >
                    Record
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
