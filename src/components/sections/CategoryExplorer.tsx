'use client';

import React from 'react';
import Link from 'next/link';
import { entities } from '@/data/entities';
import { matchesCategoryTab, type GalleryTab } from '@/types/museum';
import { useGlobalSound } from '@/hooks/useGlobalSound';

const EXPLORE_TABS: {
  tab: GalleryTab;
  code: string;
  blurb: string;
  icon: string;
  highlights: string[];
}[] = [
  {
    tab: 'Fossils & Paleontology',
    code: 'CAT-01 // BIO-CHRONO',
    blurb: 'Prehistoric apex predators, early oceanic stromatolites, ice-age megafauna, and transitional skeletal holotypes.',
    icon: '🦖',
    highlights: ['T-Rex "Sue" (67.0 Ma)', 'Pilbara Stromatolite (3,480 Ma)', 'Archaeopteryx (150.8 Ma)', 'Giant Paradoxides (505 Ma)'],
  },
  {
    tab: 'Ancient Artifacts',
    code: 'CAT-02 // TECH-ARCH',
    blurb: 'Ingenious mechanisms and monumental epigraphic decrees that unlocked civilization — including the Antikythera computer.',
    icon: '⚙️',
    highlights: ['Antikythera Mechanism (2,150 YA)', 'Rosetta Stone (196 BCE)', 'Code of Hammurabi (1754 BCE)', 'Dead Sea Scrolls (150 BCE)'],
  },
  {
    tab: 'Relics & Antiquities',
    code: 'CAT-03 // ANTHRO-CORPUS',
    blurb: 'Mummified human remains, prehistoric cave textiles, and copper-age hunting gear spanning tens of thousands of years.',
    icon: '🏺',
    highlights: ['Ötzi The Iceman (5,300 YA)', 'Tollund Bog Mummy (2,400 YA)', 'Tutankhamun Mask (1323 BCE)', 'Altamira Cave Art (36,000 YA)'],
  },
];

export default function CategoryExplorer() {
  const { playClick, playHover } = useGlobalSound();

  return (
    <section className="bg-[#F2EDE4] px-6 py-28 text-[#0E0E0E] border-b-3 border-[#0E0E0E] md:px-12 lg:px-20 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b-3 border-[#0E0E0E] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-[#FFD400] border border-[#0E0E0E] animate-ping" />
              <span className="px-3 py-1 bg-white text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#0E0E0E]">
                TAXONOMIC CLASSIFICATION // THREE CURATORIAL WINGS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-space uppercase tracking-tight text-[#0E0E0E] mt-1">
              Curated Specimen Categories
            </h2>
            <p className="text-[#0E0E0E]/80 font-space text-sm sm:text-base max-w-2xl mt-2 font-normal">
              Explore the 24 verified records structured across evolutionary biology, ancient human machinery, and archaeology.
            </p>
          </div>

          <Link
            href="/museum"
            onClick={() => playClick()}
            onMouseEnter={() => playHover()}
            className="px-6 py-3.5 bg-white hover:bg-[#FFD400] text-[#0E0E0E] border-3 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-wider transition-all self-start md:self-end shadow-[4px_4px_0px_#0E0E0E] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#0E0E0E] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Open Complete Catalog ({entities.length}) ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {EXPLORE_TABS.map(({ tab, code, blurb, icon, highlights }) => {
            const count = entities.filter((entity) => matchesCategoryTab(entity, tab)).length;

            return (
              <Link
                key={tab}
                href={`/museum?category=${encodeURIComponent(tab)}`}
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className="category-card bg-white border-3 border-[#0E0E0E] p-7 transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group hover:-translate-y-2 shadow-[6px_6px_0px_#0E0E0E] hover:shadow-[10px_10px_0px_#FFD400] active:translate-y-0.5 active:shadow-[2px_2px_0px_#0E0E0E] flex flex-col justify-between relative overflow-hidden will-change-transform"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4 border-b-2 border-[#0E0E0E]/15 pb-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0E0E0E]/60">
                      {code}
                    </span>
                    <span className="font-space text-3xl font-extrabold text-[#0E0E0E] group-hover:text-[#B3261E] transition-colors">
                      {String(count).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl p-2 bg-[#F2EDE4] border-2 border-[#0E0E0E] shadow-[2px_2px_0px_#0E0E0E]">{icon}</span>
                    <h3 className="font-space text-xl font-bold uppercase tracking-tight text-[#0E0E0E] group-hover:text-[#B3261E] transition-colors leading-tight">
                      {tab}
                    </h3>
                  </div>

                  <p className="text-[#0E0E0E]/75 text-xs font-space leading-relaxed font-normal mb-6">
                    {blurb}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-1.5 mb-6 pt-3 border-t-2 border-[#0E0E0E]/10">
                    <span className="text-[10px] font-mono font-bold text-[#0E0E0E]/50 uppercase tracking-widest block mb-2">
                      KEY CURATED HOLOTYPES:
                    </span>
                    {highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-[#0E0E0E]/90">
                        <span className="text-[#FFD400] font-bold">▪</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-[#0E0E0E] flex items-center justify-between font-mono text-xs text-[#0E0E0E] font-bold uppercase tracking-wider group-hover:bg-[#FFD400] group-hover:px-2 transition-all">
                  <span>Browse Wing ({count} Specimens)</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
