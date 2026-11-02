'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { MuseumEntity, isFossil } from '@/types/museum';
import { useAppStore } from '@/stores/useAppStore';
import { useCollectorStore } from '@/stores/useCollectorStore';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { ClickSpark } from '@/components/reactbits/ClickSpark';

interface EntityCardProps {
  entity: MuseumEntity;
}

export function EntityCard({ entity }: EntityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDrawn, setIsDrawn] = useState(false);
  const { openEntityModal } = useAppStore();
  const { stamps } = useCollectorStore();
  const { playClick } = useGlobalSound();

  const isStamped = stamps.includes(entity.id);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsDrawn(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const formattedAge = entity.ageMa
    ? `${entity.ageMa.toLocaleString()} Ma`
    : entity.yearsAgo >= 1_000_000_000
    ? `${(entity.yearsAgo / 1_000_000_000).toFixed(2)}B YA`
    : entity.yearsAgo >= 1_000_000
    ? `${(entity.yearsAgo / 1_000_000).toFixed(0)} MYA`
    : `${entity.yearsAgo.toLocaleString()} YA`;

  return (
    <ClickSpark sparkColor="#FFD400" sparkCount={8} sparkRadius={28} className="w-full h-full">
      <SpotlightCard
        spotlightColor="rgba(255, 212, 0, 0.14)"
        className="h-full"
      >
        <div
          ref={cardRef}
          onClick={() => {
            openEntityModal(entity.id);
          }}
          className="entity-card group relative flex flex-col justify-between bg-[#F2EDE4] text-[#0E0E0E] border-3 border-[#0E0E0E] p-5 shadow-[6px_6px_0px_#0E0E0E] hover:shadow-[9px_9px_0px_#0E0E0E] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 overflow-hidden h-full select-none cursor-pointer"
          data-cursor
        >
          {/* SVG Draw-In Border Overlay */}
          <svg className={`card-svg-border ${isDrawn ? 'drawn' : ''}`} width="100%" height="100%">
            <rect x="0" y="0" width="100%" height="100%" />
          </svg>

          <div>
            {/* Category & Badge Header */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-1.5">
                <span
                  className={`px-2.5 py-0.5 border-2 border-[#0E0E0E] text-[10px] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#0E0E0E] ${
                    isFossil(entity) ? 'bg-[#FFD400] text-[#0E0E0E]' : 'bg-white text-[#0E0E0E]'
                  }`}
                >
                  <ShinyText
                    text={isFossil(entity) ? 'FOSSIL' : 'ARTIFACT'}
                    speed={3}
                    shimmerColor={isFossil(entity) ? 'rgba(14, 14, 14, 0.9)' : 'rgba(255, 212, 0, 0.9)'}
                  />
                </span>

                {isStamped && (
                  <span
                    className="px-2 py-0.5 bg-[#0E0E0E] text-[#FFD400] border-2 border-[#0E0E0E] text-[9px] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#FFD400] flex items-center gap-1"
                    title="Verified Stamped in Curator Passport"
                  >
                    <span>✓ STAMPED</span>
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono font-bold text-[#0E0E0E]/70 uppercase">
                {entity.periodLabel}
              </span>
            </div>

            {/* Archival Catalog ID with React Bits DecryptedText */}
            <div className="flex items-center justify-between text-[9px] font-mono text-[#0E0E0E]/60 font-bold border-b border-[#0E0E0E]/20 pb-1 mb-2 relative z-10">
              <div className="flex items-center gap-1">
                <span>CATALOG //</span>
                <DecryptedText
                  text={entity.id.toUpperCase().slice(0, 14)}
                  speed={40}
                  animateOn="hover"
                  className="text-[#0E0E0E] font-bold"
                  encryptedClassName="text-[#FFD400]"
                />
              </div>
              <span className="text-[#0E0E0E]/70 font-mono font-bold">
                {entity.source ? entity.source.split('&')[0].trim() : 'VERIFIED'}
              </span>
            </div>

            {/* Name */}
            <h3 className="text-xl font-bold font-space uppercase text-[#0E0E0E] group-hover:text-[#B3261E] transition-colors line-clamp-1 mb-1 relative z-10">
              {entity.name}
            </h3>

            {/* Hook or Teaser */}
            {entity.hook ? (
              <p className="text-xs text-[#0E0E0E] font-space font-medium italic line-clamp-2 leading-relaxed mb-3 relative z-10">
                &ldquo;{entity.hook}&rdquo;
              </p>
            ) : (
              <p className="text-xs text-[#0E0E0E]/80 font-space line-clamp-2 leading-relaxed mb-3 relative z-10">
                {entity.significance}
              </p>
            )}

            {/* Current Location Pin */}
            <div className="text-[10px] font-mono font-bold text-[#0E0E0E]/70 mb-4 truncate relative z-10 flex items-center gap-1">
              <span>📍</span>
              <span>{entity.currentLocation}</span>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-3 border-t-2 border-[#0E0E0E] flex items-center justify-between mt-auto text-[11px] font-mono font-bold relative z-10">
            <span className="text-[#0E0E0E] font-bold tracking-tight bg-[#FFD400]/30 px-2 py-0.5 border border-[#0E0E0E]">
              {formattedAge}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEntityModal(entity.id);
                }}
                className="px-2.5 py-1 bg-[#FFD400] text-[#0E0E0E] hover:bg-white font-bold text-[10px] font-mono uppercase transition-all border-2 border-[#0E0E0E] cursor-pointer shadow-[2px_2px_0px_#0E0E0E] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0E0E0E] active:translate-y-0 active:shadow-none"
                title="3D Deep-Time Holographic Inspection"
              >
                3D VIEW ↗
              </button>

              <Link
                href={`/museum/${entity.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                }}
                className="px-2.5 py-1 bg-white text-[#0E0E0E] hover:bg-[#FFD400] font-bold text-[10px] font-mono uppercase transition-all border-2 border-[#0E0E0E] cursor-pointer shadow-[2px_2px_0px_#0E0E0E] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0E0E0E] active:translate-y-0 active:shadow-none inline-block"
                title="Open Specimen Dossier"
              >
                DOSSIER
              </Link>
            </div>
          </div>

          {/* "INSPECT SPECIMEN 3D →" Hover Prompt (Pure CSS transition) */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              openEntityModal(entity.id);
            }}
            className="absolute inset-x-0 bottom-0 bg-[#FFD400] border-t-3 border-[#0E0E0E] p-2.5 text-center text-[#0E0E0E] font-mono font-bold text-xs uppercase cursor-pointer translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-150 z-20 hover:bg-[#0E0E0E] hover:text-[#FFD400] shadow-[0_-2px_0px_#0E0E0E]"
          >
            INSPECT SPECIMEN 3D →
          </div>
        </div>
      </SpotlightCard>
    </ClickSpark>
  );
}

export default EntityCard;
