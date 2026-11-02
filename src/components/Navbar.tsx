'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { MuseumReelModal } from '@/components/showreel/MuseumReelModal';
import { Magnet } from '@/components/reactbits/Magnet';
import { ShinyText } from '@/components/reactbits/ShinyText';

interface NavLinkItem {
  num: string;
  label: string;
  href: string;
  key: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { num: '00', label: 'Overview', href: '/', key: '1' },
  { num: '01', label: 'Evolution', href: '/evolution', key: '2' },
  { num: '02', label: 'Specimens', href: '/museum', key: '3' },
  { num: '03', label: 'Grand Hall', href: '/hall', key: '4' },
  { num: '04', label: 'Chrono Lab', href: '/compare', key: '5' },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

  const user = useAuthStore((s) => s.user);
  const { playClick, playHover, playToggle } = useGlobalSound();
  const { audioMuted, toggleAudio, openSearchModal } = useAppStore();

  // Stable refs to prevent useEffect dependency array size/reference churn
  const routerRef = useRef(router);
  routerRef.current = router;
  const playClickRef = useRef(playClick);
  playClickRef.current = playClick;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform || ''));
    }
  }, []);

  // Stable hotkey listener (Keys 1 to 5)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const matched = NAV_LINKS.find((item) => item.key === e.key);
      if (matched) {
        playClickRef.current();
        routerRef.current.push(matched.href);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change or ESC
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  if (pathname === '/login') return null;

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Fixed Bauhaus Ceiling Navigation Bar ── */}
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-[9995] w-full h-16 sm:h-[72px] bg-[#F2EDE4] border-b-2 sm:border-b-3 border-[#0E0E0E] shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all select-none"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3">
          
          {/* ── Brand Monogram ── */}
          <Magnet padding={14} magnetStrength={0.2}>
            <Link
              href="/"
              onClick={playClick}
              onMouseEnter={playHover}
              className="flex items-center gap-2.5 sm:gap-3 group select-none cursor-pointer"
              aria-label="MUSEO Home"
            >
              <div className="relative w-8 h-8 rounded-lg bg-[#0E0E0E] flex items-center justify-center text-[#FFD400] shadow-[2px_2px_0px_#0E0E0E] group-hover:bg-[#FFD400] group-hover:text-[#0E0E0E] transition-all duration-200">
                <span className="w-2.5 h-2.5 rounded-sm bg-current group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight uppercase font-space text-[#0E0E0E]">
                    <ShinyText text="MUSEO" speed={3} shimmerColor="rgba(255, 212, 0, 0.9)" />
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400] border border-[#0E0E0E]/40 animate-pulse" />
                </div>
                <span className="hidden sm:inline font-mono text-[9px] font-bold text-[#0E0E0E]/50 tracking-wider -mt-0.5">
                  EST. 4.6 GA
                </span>
              </div>
            </Link>
          </Magnet>

          {/* ── Center Navigation Track (Desktop) ── */}
          <nav
            role="navigation"
            aria-label="Museum Wings"
            className="hidden md:flex items-center gap-1 p-1 rounded-full bg-black/[0.04] border border-black/[0.08]"
          >
            {NAV_LINKS.map((item) => {
              const active = isLinkActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={playClick}
                  onMouseEnter={playHover}
                  className={`relative px-3.5 py-1.5 rounded-full font-space text-xs font-bold tracking-tight select-none transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#0E0E0E] text-[#F2EDE4] shadow-[0_2px_8px_rgba(0,0,0,0.18)]'
                      : 'text-[#0E0E0E]/70 hover:text-[#0E0E0E] hover:bg-black/[0.05]'
                  }`}
                >
                  <span className={`font-mono text-[9px] ${active ? 'text-[#FFD400]' : 'opacity-40'}`}>
                    {item.num}
                  </span>
                  <span>{item.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Curated Action Utilities ── */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Pill */}
            <Magnet padding={10} magnetStrength={0.15}>
              <button
                onClick={() => {
                  playClick();
                  openSearchModal();
                }}
                onMouseEnter={playHover}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 h-8 sm:h-9 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#0E0E0E] border border-black/[0.06] transition-all text-xs font-mono font-bold cursor-pointer"
                title={`Search Archive (${mounted && !isMac ? 'Ctrl+K' : '⌘K'})`}
                aria-label="Search museum specimens"
              >
                <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span
                  suppressHydrationWarning
                  className="hidden lg:inline text-[11px] text-[#0E0E0E]/60 font-semibold"
                >
                  {mounted && !isMac ? 'Ctrl+K' : '⌘K'}
                </span>
              </button>
            </Magnet>

            {/* Soundscape Equalizer Toggle */}
            <Magnet padding={10} magnetStrength={0.15}>
              <button
                onClick={() => {
                  const nextMuted = !audioMuted;
                  toggleAudio();
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('museo_sound_pref', nextMuted ? 'muted' : 'enabled');
                  }
                  playToggle(!nextMuted);
                }}
                onMouseEnter={playHover}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 h-8 sm:h-9 rounded-full font-mono text-xs font-bold transition-all cursor-pointer border ${
                  !audioMuted
                    ? 'bg-[#FFD400] text-[#0E0E0E] border-[#0E0E0E]/20 shadow-[0_2px_8px_rgba(255,212,0,0.35)]'
                    : 'bg-black/[0.04] hover:bg-black/[0.08] text-[#0E0E0E]/60 hover:text-[#0E0E0E] border-black/[0.06]'
                }`}
                title={audioMuted ? 'Unmute procedural soundscape' : 'Mute procedural soundscape'}
                aria-label={audioMuted ? 'Unmute soundscape' : 'Mute soundscape'}
              >
                <span className={`eq ${!audioMuted ? 'playing' : ''}`} aria-hidden="true">
                  <i /><i /><i /><i />
                </span>
                <span className="hidden xl:inline text-[11px]">
                  {audioMuted ? 'Off' : 'On'}
                </span>
              </button>
            </Magnet>

            {/* Cinema Tour */}
            <Magnet padding={10} magnetStrength={0.15}>
              <button
                onClick={() => {
                  playClick();
                  setReelOpen(true);
                }}
                onMouseEnter={playHover}
                className="hidden sm:flex items-center gap-1.5 px-3 h-8 sm:h-9 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#0E0E0E] border border-black/[0.06] font-space text-xs font-bold transition-all cursor-pointer"
                title="Curatorial 3D Tour"
              >
                <span className="text-[9px] text-[#0E0E0E]/70">▶</span>
                <span>Tour</span>
              </button>
            </Magnet>

            {/* Patron Pass Pill CTA */}
            <Magnet padding={12} magnetStrength={0.18}>
              <Link
                href="/profile"
                onClick={playClick}
                onMouseEnter={playHover}
                className={`flex items-center gap-1.5 px-3 sm:px-4 h-8 sm:h-9 rounded-full font-space text-xs font-bold tracking-tight uppercase transition-all duration-200 cursor-pointer shadow-[2px_2px_0px_#0E0E0E] active:scale-95 border border-[#0E0E0E] ${
                  pathname === '/profile'
                    ? 'bg-[#0E0E0E] text-[#F2EDE4]'
                    : 'bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E]'
                }`}
                title="Your Admission Ticket Pass"
              >
                <span>🎟️</span>
                <span>{user ? 'Pass #4600' : 'Ticket'}</span>
              </Link>
            </Magnet>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="md:hidden w-9 h-9 rounded-full bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.08] flex items-center justify-center transition-colors cursor-pointer"
            >
              <div className="w-4 h-3.5 flex flex-col justify-between items-center">
                <span
                  className={`h-0.5 w-full bg-[#0E0E0E] rounded-full transition-all duration-200 transform ${
                    mobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-[#0E0E0E] rounded-full transition-opacity duration-200 ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-[#0E0E0E] rounded-full transition-all duration-200 transform ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Architectural Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-[9993] bg-black/50 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />
        )}
        {mobileMenuOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed top-16 sm:top-[72px] inset-x-0 z-[9994] bg-[#F2EDE4] border-b-3 border-[#0E0E0E] shadow-[0_16px_30px_rgba(0,0,0,0.15)] p-5 flex flex-col gap-4 font-space md:hidden select-none"
          >
            <div className="flex flex-col gap-1.5 max-w-md mx-auto w-full">
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      playClick();
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-3 rounded-xl flex items-center justify-between text-sm font-bold tracking-tight transition-all border ${
                      active
                        ? 'bg-[#0E0E0E] text-[#F2EDE4] border-[#0E0E0E] shadow-[2px_2px_0px_#FFD400]'
                        : 'bg-black/[0.03] text-[#0E0E0E] border-black/[0.06] hover:bg-black/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs ${active ? 'text-[#FFD400]' : 'opacity-40'}`}>
                        {link.num}
                      </span>
                      <span>{link.label}</span>
                    </div>
                    <span className="font-mono text-xs opacity-60">→</span>
                  </Link>
                );
              })}

              <Link
                href="/profile"
                onClick={() => {
                  playClick();
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-xl flex items-center justify-between text-sm font-bold tracking-tight transition-all border ${
                  pathname === '/profile'
                    ? 'bg-[#0E0E0E] text-[#F2EDE4] border-[#0E0E0E]'
                    : 'bg-[#FFD400] text-[#0E0E0E] border-[#0E0E0E] shadow-[2px_2px_0px_#0E0E0E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span>🎟️</span>
                  <span>Admission Pass</span>
                </div>
                <span className="font-mono text-xs font-bold">
                  {user ? 'PASS #4600' : 'GET PASS'}
                </span>
              </Link>
            </div>

            {/* Mobile Quick Bar */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/[0.08] max-w-md mx-auto w-full">
              <button
                onClick={() => {
                  toggleAudio();
                  playToggle(audioMuted);
                }}
                className={`py-2.5 px-3 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  !audioMuted
                    ? 'bg-[#FFD400] text-[#0E0E0E] border-[#0E0E0E]'
                    : 'bg-black/[0.04] text-[#0E0E0E]/70 border-black/[0.06]'
                }`}
              >
                <span className={`eq ${!audioMuted ? 'playing' : ''}`} aria-hidden="true">
                  <i /><i /><i /><i />
                </span>
                <span>{audioMuted ? 'Sound Off' : 'Sound On'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  playClick();
                  setReelOpen(true);
                }}
                className="py-2.5 px-3 rounded-lg bg-[#0E0E0E] text-[#F2EDE4] border border-[#0E0E0E] font-space text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_#FFD400]"
              >
                <span className="text-[#FFD400] text-[9px]">▶</span>
                <span>Cinema Tour</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Curatorial Cinema Tour Modal ── */}
      {reelOpen && <MuseumReelModal isOpen={reelOpen} onClose={() => setReelOpen(false)} />}
    </>
  );
}
