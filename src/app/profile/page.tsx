'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { entities } from '@/data/entities';
import { TicketStubGenerator } from '@/components/certificate/TicketStubGenerator';
import { MuseumCollectorPassport } from '@/components/collector/MuseumCollectorPassport';
import { useCollectorStore, getCuratorRank } from '@/stores/useCollectorStore';

const AVATAR_OPTIONS = [
  { symbol: '🏛️', name: 'Museum' },
  { symbol: '🦖', name: 'T-Rex Sue' },
  { symbol: '🏺', name: 'Relic' },
  { symbol: '🌌', name: 'Cosmos' },
  { symbol: '💎', name: 'Gemstone' },
  { symbol: '📜', name: 'Parchment' },
  { symbol: '⚙️', name: 'Antikythera' },
  { symbol: '🗿', name: 'Monolith' },
];

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('🏛️');

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Passport Stamps from unified Collector Store
  const { stamps, init } = useCollectorStore();

  useEffect(() => {
    init();
  }, [init]);

  // Sync state with user profile
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '@curator');
      setEmail(user.email || '');
      setAvatar(user.avatar || '🏛️');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    const res = await updateProfile({ name, username, email, avatar });
    setIsSaving(false);

    if (res.success) {
      setIsEditing(false);
      setToastMsg('[ PROFILE UPDATED SUCCESSFULLY ]');
      setTimeout(() => setToastMsg(null), 3500);
    } else {
      setErrorMsg(res.error || 'Failed to update profile.');
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await logout();
    router.replace('/login');
  };

  const stampCount = stamps.length;
  const rank = getCuratorRank(stampCount).title;

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#1a1a1a] pt-28 pb-20 px-4 md:px-8 font-space flex flex-col items-center">
      <div className="max-w-4xl w-full">
        {/* Header Pill */}
        <div className="inline-block px-3 py-1 bg-yellow-400 text-black border-2 border-black font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_#000] mb-4">
          [ CURATOR PASSPORT // PERSONAL SPACE ARCHIVE ]
        </div>

        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight font-space mb-2 text-[#0E0E0E]">
          Curator Identity & Exit Pass
        </h1>
        <p className="text-sm font-mono text-[#0E0E0E]/70 mb-8">
          Official credentials, specimen discovery stamps, and personal ticket stub across the MUSEO archives.
        </p>

        {/* ── Act 04: Exit & Memory Shareable Ticket Stub ── */}
        <div className="mb-10">
          <TicketStubGenerator />
        </div>

        {/* Current User Specimen Card */}
        <div className="bg-white border-3 border-black p-6 mb-8 shadow-[6px_6px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 flex-1 w-full">
            <div className="w-20 h-20 bg-yellow-400 border-3 border-black flex items-center justify-center text-4xl shadow-[3px_3px_0px_#000] shrink-0">
              {avatar}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="text-xs font-mono font-bold uppercase text-yellow-700 mb-1 flex items-center gap-2">
                <span>SPECIMEN ID: {user?.id || 'USR_MUSEO_01'}</span>
                <span className="bg-black text-[#ffd700] px-2 py-0.5 text-[9px] uppercase font-bold">
                  {rank}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold uppercase font-outfit text-black">{name || 'Yashraj Desai'}</h2>
              <div className="text-xs font-mono text-neutral-600 font-bold">
                {username || '@curator'} • {email || 'yashrajdesai044@gmail.com'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-[#ffd700] text-black border-2 border-black font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#000] hover:bg-yellow-300 active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>{isEditing ? 'CANCEL EDIT' : 'EDIT PROFILE'}</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {toastMsg && (
          <div className="mb-6 p-3 bg-yellow-400 text-black border-2 border-black font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_#000] animate-bounce">
            ⚡ {toastMsg}
          </div>
        )}

        {/* Error Toast */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500 text-white border-2 border-black font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_#000]">
            ✖ [ ERROR // {errorMsg} ]
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="bg-white border-3 border-black p-6 md:p-8 shadow-[6px_6px_0px_#000] space-y-6 mb-12">
            <div className="text-sm font-mono font-bold uppercase tracking-widest text-[#0055ff] border-b-2 border-black pb-2">
              // EDIT PROFILE DETAILS
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-2 text-black">
                SELECT AVATAR EMBLEM
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.symbol}
                    type="button"
                    onClick={() => setAvatar(opt.symbol)}
                    className={`h-12 border-2 border-black flex flex-col items-center justify-center text-xl transition-transform cursor-pointer ${
                      avatar === opt.symbol
                        ? 'bg-yellow-400 scale-105 shadow-[2px_2px_0px_#000]'
                        : 'bg-[#f5f0e8] hover:bg-yellow-200'
                    }`}
                    title={opt.name}
                  >
                    <span>{opt.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-black">
                FULL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#f5f0e8] text-black border-2 border-black text-sm font-mono font-bold uppercase focus:outline-none focus:ring-3 focus:ring-yellow-400 shadow-[2px_2px_0px_#000]"
              />
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-black">
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#f5f0e8] text-black border-2 border-black text-sm font-mono font-bold focus:outline-none focus:ring-3 focus:ring-yellow-400 shadow-[2px_2px_0px_#000]"
              />
            </div>

            {/* Email Address Field */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-black">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#f5f0e8] text-black border-2 border-black text-sm font-mono font-bold focus:outline-none focus:ring-3 focus:ring-yellow-400 shadow-[2px_2px_0px_#000]"
              />
            </div>

            {/* Actions: Save / Cancel */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-4 bg-yellow-400 text-black border-2 border-black font-mono text-sm font-bold uppercase shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? 'SAVING CHANGES...' : 'SAVE PROFILE CHANGES ↗'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="py-4 px-6 bg-white text-black border-2 border-black font-mono text-sm font-bold uppercase shadow-[4px_4px_0px_#000] hover:bg-neutral-200 transition-all cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </form>
        )}

        {/* ─── MUSEUM EXPLORER PASSPORT & COLLECTOR VAULT ─── */}
        <div className="mb-12">
          <MuseumCollectorPassport />
        </div>

        {/* Sign Out Button */}
        <div className="pt-6 border-t-3 border-black text-center">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full py-4 bg-red-600 hover:bg-black text-white border-3 border-black font-mono text-sm font-extrabold uppercase shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isSigningOut ? 'TERMINATING SESSION...' : 'SIGN OUT & EXIT MUSEUM'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
