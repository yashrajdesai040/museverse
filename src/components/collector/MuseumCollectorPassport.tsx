'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { entities } from '@/data/entities';
import { MuseumEntity, isFossil } from '@/types/museum';
import {
  useCollectorStore,
  getCuratorRank,
  COLLECTOR_ACHIEVEMENTS,
} from '@/stores/useCollectorStore';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { useAppStore } from '@/stores/useAppStore';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { Magnet } from '@/components/reactbits/Magnet';
import { ClickSpark } from '@/components/reactbits/ClickSpark';

export type CollectorFilter = 'all' | 'stamped' | 'locked' | 'fossils' | 'artifacts';

export function MuseumCollectorPassport() {
  const {
    stamps,
    init,
    addStamp,
    removeStamp,
    toggleStamp,
    stampAll,
    resetStamps,
    notificationMsg,
    clearRecentlyStamped,
  } = useCollectorStore();

  const { playClick, playStamp, playChime, playBookmark, playConfirm } = useGlobalSound();
  const { openEntityModal } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<CollectorFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<MuseumEntity | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  // Stamp counts and stats
  const totalCount = entities.length;
  const stampCount = stamps.length;
  const percentage = Math.round((stampCount / totalCount) * 100);
  const rank = getCuratorRank(stampCount);

  // Deep time span computation
  const deepTimeSpan = useMemo(() => {
    const stampedEntities = entities.filter((e) => stamps.includes(e.id));
    if (stampedEntities.length === 0) return '0 Years';
    const oldest = Math.max(...stampedEntities.map((e) => e.yearsAgo));
    if (oldest >= 1_000_000_000) {
      return `${(oldest / 1_000_000_000).toFixed(2)} Billion Years`;
    }
    if (oldest >= 1_000_000) {
      return `${(oldest / 1_000_000).toFixed(1)} Million Years`;
    }
    return `${oldest.toLocaleString()} Years`;
  }, [stamps]);

  // Achievements unlocked
  const unlockedAchievements = useMemo(() => {
    return COLLECTOR_ACHIEVEMENTS.filter((ach) => ach.check(stamps));
  }, [stamps]);

  // Filtered and searched list
  const filteredEntities = useMemo(() => {
    return entities.filter((item) => {
      const isCollected = stamps.includes(item.id);

      // Category / Stamp filter
      if (activeFilter === 'stamped' && !isCollected) return false;
      if (activeFilter === 'locked' && isCollected) return false;
      if (activeFilter === 'fossils' && !isFossil(item)) return false;
      if (activeFilter === 'artifacts' && isFossil(item)) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesEra = item.periodLabel.toLowerCase().includes(q);
        const matchesLoc = item.currentLocation.toLowerCase().includes(q);
        const matchesId = item.id.toLowerCase().includes(q);
        return matchesName || matchesEra || matchesLoc || matchesId;
      }

      return true;
    });
  }, [stamps, activeFilter, searchQuery]);

  const handleInspect = (entity: MuseumEntity) => {
    playClick();
    setSelectedEntity(entity);
  };

  const handleToggleCollect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowCollected = toggleStamp(id);
    if (isNowCollected) {
      playStamp();
    } else {
      playBookmark();
    }
  };

  const handleStampAll = () => {
    playConfirm();
    stampAll();
  };

  const handleReset = () => {
    playBookmark();
    resetStamps();
    setConfirmReset(false);
  };

  return (
    <div className="w-full space-y-8 font-space text-[#1a1a1a]">
      {/* ── Notification Banner ── */}
      {notificationMsg && (
        <div className="p-3 bg-[#ffd700] text-black border-3 border-black font-mono text-xs font-bold uppercase shadow-[4px_4px_0px_#000] flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
            <span>{notificationMsg}</span>
          </div>
          <button
            onClick={clearRecentlyStamped}
            className="px-2 py-0.5 bg-black text-white hover:bg-neutral-800 text-[10px] font-mono uppercase cursor-pointer border border-black"
          >
            DISMISS ✕
          </button>
        </div>
      )}

      {/* ── Top Bento Dashboard ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Vault Progress */}
        <div className="bg-white border-3 border-black p-5 shadow-[5px_5px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1 flex items-center justify-between">
              <span>VAULT COMPLETION</span>
              <span className="text-black font-extrabold">{percentage}%</span>
            </div>
            <div className="text-3xl font-extrabold font-outfit text-black mb-2">
              {stampCount} <span className="text-sm font-mono text-neutral-500 font-bold">/ {totalCount}</span>
            </div>
          </div>
          <div>
            {/* Progress track */}
            <div className="w-full h-3 bg-neutral-200 border-2 border-black overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ffd700] via-[#00f7ff] to-[#ffd700] transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] font-mono text-neutral-600 font-bold flex justify-between">
              <span>{totalCount - stampCount} Undiscovered</span>
              <span>{stampCount} Stamped</span>
            </div>
          </div>
        </div>

        {/* Card 2: Curator Rank */}
        <div className="bg-[#1a1a1a] text-white border-3 border-black p-5 shadow-[5px_5px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ffd700] mb-1 flex items-center justify-between">
              <span>ACCREDITED STATUS</span>
              <span className="text-xs">TIER {rank.tier}</span>
            </div>
            <div className="text-xl font-extrabold font-outfit text-white mb-1 line-clamp-1">
              {rank.title}
            </div>
          </div>
          <div className="text-[10px] font-mono text-neutral-400 font-bold">
            {rank.nextThreshold ? (
              <span>
                Need <strong className="text-cyan-400">{rank.nextThreshold - stampCount} more</strong> to unlock Tier {rank.tier + 1}
              </span>
            ) : (
              <span className="text-[#ffd700] font-extrabold">★ MAXIMUM CURATOR HONOR ACHIEVED</span>
            )}
          </div>
        </div>

        {/* Card 3: Deep Time Span */}
        <div className="bg-white border-3 border-black p-5 shadow-[5px_5px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">
              TEMPORAL CHRONO-SPAN
            </div>
            <div className="text-2xl font-extrabold font-outfit text-black mb-1">
              {deepTimeSpan}
            </div>
          </div>
          <div className="text-[10px] font-mono text-neutral-600 font-bold">
            Spanning Archean Genesis to Contemporary Anthropocene
          </div>
        </div>

        {/* Card 4: Milestones Button */}
        <div className="bg-[#ffd700] text-black border-3 border-black p-5 shadow-[5px_5px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-900 mb-1 flex items-center justify-between">
              <span>FIELD ACCOLADES</span>
              <span className="font-extrabold">{unlockedAchievements.length} / {COLLECTOR_ACHIEVEMENTS.length}</span>
            </div>
            <div className="text-xl font-extrabold font-outfit uppercase">
              Curator Badges
            </div>
          </div>
          <button
            onClick={() => {
              playClick();
              setShowAchievements(!showAchievements);
            }}
            className="mt-3 px-3 py-1.5 bg-black text-[#ffd700] hover:bg-neutral-800 border-2 border-black font-mono text-xs font-bold uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer flex items-center justify-between"
          >
            <span>{showAchievements ? 'HIDE BADGES ✕' : 'INSPECT BADGES ↗'}</span>
            <span>🎖️</span>
          </button>
        </div>
      </div>

      {/* ── Accolades / Achievements Drawer ── */}
      {showAchievements && (
        <div className="bg-white border-3 border-black p-6 shadow-[6px_6px_0px_#000] space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#0055ff] tracking-widest block">
                // ARCHIVAL FIELD MEDALLIONS
              </span>
              <h3 className="text-lg font-extrabold font-outfit uppercase text-black">
                Curatorial Discovery Achievements
              </h3>
            </div>
            <span className="text-xs font-mono font-bold bg-[#ffd700] px-2.5 py-1 border border-black shadow-[2px_2px_0px_#000]">
              {unlockedAchievements.length} of {COLLECTOR_ACHIEVEMENTS.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {COLLECTOR_ACHIEVEMENTS.map((ach) => {
              const isUnlocked = ach.check(stamps);
              return (
                <div
                  key={ach.id}
                  className={`p-3 border-2 transition-all flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-amber-50 border-[#ffd700] text-black shadow-[3px_3px_0px_#000]'
                      : 'bg-neutral-100 border-dashed border-neutral-400 text-neutral-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{ach.icon}</span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                        isUnlocked
                          ? 'bg-emerald-400 text-black border-black font-extrabold'
                          : 'bg-neutral-200 text-neutral-500 border-neutral-400'
                      }`}
                    >
                      {isUnlocked ? 'CLAIMED ✓' : 'LOCKED 🔒'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-outfit uppercase text-black mb-1">
                      {ach.title}
                    </h4>
                    <p className="text-[10px] font-mono text-neutral-600 leading-snug">
                      {ach.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Curator Tools & Filter Controls Bar ── */}
      <div className="bg-[#1a1a1a] text-white p-5 border-3 border-black shadow-[6px_6px_0px_#ffd700] space-y-4">
        {/* Row 1: Search & Demo Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search catalog, era, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border-2 border-neutral-700 px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#ffd700] placeholder-neutral-500 shadow-[2px_2px_0px_#000]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-neutral-400 hover:text-white text-xs font-mono font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Magnet padding={15} magnetStrength={0.2}>
              <button
                onClick={handleStampAll}
                className="px-3 py-2 bg-[#ffd700] text-black hover:bg-yellow-300 border-2 border-black font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#000] cursor-pointer transition-all flex items-center gap-1.5"
                title="Stamp all 44 specimens for complete showcase preview"
              >
                <span>✦ Stamp All (Demo)</span>
              </button>
            </Magnet>

            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-3 py-2 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 border-2 border-neutral-600 font-mono text-xs font-bold uppercase transition-all cursor-pointer"
                title="Reset stamps to starter set"
              >
                ↺ Reset
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1.5 bg-red-600 text-white font-mono text-xs font-bold uppercase border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
                >
                  Confirm Reset?
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1.5 bg-neutral-700 text-white font-mono text-xs font-bold border border-black cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800">
          {[
            { id: 'all', label: `All Specimens (${totalCount})` },
            { id: 'stamped', label: `✦ Verified Stamped (${stampCount})` },
            { id: 'locked', label: `🔒 Undiscovered (${totalCount - stampCount})` },
            { id: 'fossils', label: '🦴 Prehistoric Fossils' },
            { id: 'artifacts', label: '🏺 Cultural Artifacts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playClick();
                setActiveFilter(tab.id as CollectorFilter);
              }}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase border-2 transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#ffd700] text-black border-white shadow-[2px_2px_0px_#fff]'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white hover:border-neutral-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Philatelic Stamp Album Grid ── */}
      <div className="bg-[#f0ebe1] p-6 border-3 border-black shadow-[8px_8px_0px_#000]">
        <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-black">
              ARCHIVAL SPECIMEN STAMPS BOOK // {filteredEntities.length} SHOWING
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-600 font-bold">
            CLICK STAMP TO INSPECT ↗
          </span>
        </div>

        {filteredEntities.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 font-mono text-sm">
            <div className="text-3xl mb-2">🔍</div>
            <p className="font-bold uppercase">No specimens match current filter criteria</p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 px-3 py-1 bg-black text-white text-xs uppercase font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {filteredEntities.map((item) => {
              const isCollected = stamps.includes(item.id);

              return (
                <ClickSpark key={item.id} sparkColor="#ffd700" sparkCount={6} sparkRadius={20}>
                  <div
                    onClick={() => handleInspect(item)}
                    className={`relative p-3 border-3 flex flex-col justify-between h-44 cursor-pointer select-none transition-all duration-150 group overflow-hidden ${
                      isCollected
                        ? 'bg-white border-black text-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#ffd700] hover:-translate-x-0.5 hover:-translate-y-0.5'
                        : 'bg-neutral-200/70 border-dashed border-neutral-400 text-neutral-400 hover:border-black hover:bg-white hover:text-black shadow-sm'
                    }`}
                  >
                    {/* Top Meta Header */}
                    <div className="flex items-start justify-between z-10">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                        #{item.id.slice(0, 5)}
                      </span>

                      {/* Stamped Seal Badge */}
                      {isCollected ? (
                        <span className="w-5 h-5 rounded-full bg-[#ffd700] border border-black flex items-center justify-center text-[10px] font-bold text-black shadow-[1px_1px_0px_#000]">
                          ✓
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400">🔒</span>
                      )}
                    </div>

                    {/* Center Artwork / Thumbnail */}
                    <div className="my-auto text-center flex flex-col items-center justify-center py-1 z-10">
                      {item.images && item.images[0] ? (
                        <div
                          className={`w-14 h-14 border border-black relative overflow-hidden mb-1.5 transition-transform group-hover:scale-105 ${
                            isCollected ? 'bg-amber-100' : 'bg-neutral-300 opacity-40 grayscale'
                          }`}
                        >
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-neutral-200 border border-black flex items-center justify-center text-xl mb-1">
                          {isFossil(item) ? '🦴' : '🏺'}
                        </div>
                      )}
                      <span className="text-[8px] font-mono font-bold uppercase text-neutral-500 truncate max-w-[120px]">
                        {item.periodLabel}
                      </span>
                    </div>

                    {/* Bottom Title & Action */}
                    <div className="border-t border-black/20 pt-1 z-10">
                      <h4 className="text-[11px] font-bold font-space uppercase line-clamp-1 group-hover:text-[#B3261E] transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between text-[8px] font-mono font-bold mt-0.5">
                        <span className="text-neutral-500 uppercase">{isFossil(item) ? 'Fossil' : 'Relic'}</span>
                        <span className="text-black font-extrabold">
                          {isCollected ? 'IN PASSPORT' : 'CLICK TO LOG'}
                        </span>
                      </div>
                    </div>

                    {/* Serrated Archival Stamp Border Dots */}
                    <div className="absolute inset-0 pointer-events-none border border-neutral-300/40 m-0.5" />
                  </div>
                </ClickSpark>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Stamp Dossier Inspection Popover Modal ── */}
      {selectedEntity && (
        <div
          className="fixed inset-0 z-[99990] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedEntity(null)}
        >
          <div
            className="bg-white border-4 border-black max-w-lg w-full p-6 md:p-8 shadow-[10px_10px_0px_#ffd700] space-y-6 animate-in zoom-in-95 duration-150 relative text-[#1a1a1a]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedEntity(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-black text-white hover:bg-[#ffd700] hover:text-black font-bold text-sm border-2 border-black flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              ✕
            </button>

            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-[#ffd700] text-black border border-black font-mono text-[10px] font-bold uppercase shadow-[1px_1px_0px_#000]">
                  CATALOG #{selectedEntity.id.toUpperCase()}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">
                  {selectedEntity.periodLabel}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold font-outfit uppercase tracking-tight text-black">
                {selectedEntity.name}
              </h3>
            </div>

            {/* Specimen Media Thumbnail */}
            {selectedEntity.images && selectedEntity.images[0] && (
              <div className="w-full h-44 border-3 border-black relative overflow-hidden bg-neutral-100 shadow-[4px_4px_0px_#000]">
                <Image
                  src={selectedEntity.images[0]}
                  alt={selectedEntity.name}
                  fill
                  sizes="(max-width: 512px) 100vw, 512px"
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/90 text-white font-mono text-[10px] px-2 py-0.5 border border-white font-bold">
                  📍 {selectedEntity.currentLocation}
                </div>
              </div>
            )}

            {/* Significance excerpt */}
            <p className="text-xs font-space leading-relaxed text-neutral-700 font-medium">
              {selectedEntity.significance}
            </p>

            {/* Curatorial stamp status bar */}
            <div className="p-3 bg-neutral-100 border-2 border-black flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {stamps.includes(selectedEntity.id) ? '📜' : '🔒'}
                </span>
                <div>
                  <span className="font-bold uppercase block text-[10px] text-neutral-500">
                    PASSPORT ENTRY
                  </span>
                  <span className="font-extrabold text-black">
                    {stamps.includes(selectedEntity.id) ? 'VERIFIED IN PASSPORT' : 'NOT YET STAMPED'}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => handleToggleCollect(selectedEntity.id, e)}
                className={`px-3 py-1.5 font-bold uppercase border-2 border-black text-xs cursor-pointer shadow-[2px_2px_0px_#000] transition-all ${
                  stamps.includes(selectedEntity.id)
                    ? 'bg-neutral-200 hover:bg-red-400 text-black'
                    : 'bg-[#ffd700] hover:bg-yellow-300 text-black'
                }`}
              >
                {stamps.includes(selectedEntity.id) ? 'Remove Stamp' : '✦ Stamp Now'}
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedEntity(null);
                  openEntityModal(selectedEntity.id);
                }}
                className="w-full sm:flex-1 py-3 bg-[#ffd700] hover:bg-white text-black border-2 border-black font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_#000] cursor-pointer transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>3D INSPECTION MODAL ↗</span>
              </button>

              <Link
                href={`/museum/${selectedEntity.id}`}
                onClick={() => setSelectedEntity(null)}
                className="w-full sm:flex-1 py-3 bg-black hover:bg-neutral-800 text-white border-2 border-black font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_#000] cursor-pointer transition-all text-center block"
              >
                FULL DOSSIER →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
