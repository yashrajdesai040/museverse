'use client';

import { useRef, useEffect } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import HeroSection from '@/components/HeroSection';

// Narrative Components & Hooks
import { CuratorialConsortium } from '@/components/sections/CuratorialConsortium';
import { PatronExhibitionPass } from '@/components/sections/PatronExhibitionPass';
import { useVariableFontWeight } from '@/hooks/useVariableFontWeight';
import { useSpatialAudio } from '@/hooks/useSpatialAudio';

// Landing Sections
import CategoryExplorer from '@/components/sections/CategoryExplorer';
import EpochPreview from '@/components/sections/EpochPreview';
import Spotlight from '@/components/sections/Spotlight';
import { VirtualMuseumPortals } from '@/components/sections/VirtualMuseumPortals';
import { Marquee } from '@/components/magicui/Marquee';
import { NumberTicker } from '@/components/magicui/NumberTicker';
import { CuratedBentoShowcase } from '@/components/sections/CuratedBentoShowcase';
import { DegradationSandbox } from '@/components/sections/DegradationSandbox';

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null);

  // Initialize variable font weight morphing on scroll velocity
  useVariableFontWeight();

  // Initialize Web Audio API spatial audio zones
  const { start: startAudio, setZone } = useSpatialAudio();

  useEffect(() => {
    const handleFirstClick = () => {
      startAudio();
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    return () => window.removeEventListener('click', handleFirstClick);
  }, [startAudio]);

  useGSAP(
    () => {
      const ctx = mainRef.current;
      if (!ctx) return;

      // Spatial Audio ScrollTrigger Zones
      ScrollTrigger.create({
        trigger: '.consortium-trigger',
        start: 'top center',
        onEnter: () => setZone('ocean'),
        onLeaveBack: () => setZone('silent'),
      });

      ScrollTrigger.create({
        trigger: '.patron-pass-trigger',
        start: 'top center',
        onEnter: () => setZone('human'),
        onLeaveBack: () => setZone('ocean'),
      });

      // 1. Stats Ribbon Entrance
      gsap.fromTo(
        '.stat-col',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.stat-col',
            start: 'top 92%',
          },
        }
      );

      // 2. Virtual Museum Portals Staggered Entrance
      ScrollTrigger.batch('.portal-card', {
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 32, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              stagger: 0.08,
              ease: 'power3.out',
              overwrite: true,
            }
          );
        },
        start: 'top 88%',
      });

      // 3. Category Explorer Cards Stagger
      ScrollTrigger.batch('.category-card', {
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out', overwrite: true }
          );
        },
        start: 'top 88%',
      });

      // 6. Spotlight Section Split Reveal
      ScrollTrigger.create({
        trigger: '.spotlight-canvas-col',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.spotlight-canvas-col',
            { opacity: 0, x: -28 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
          );
          gsap.fromTo(
            '.spotlight-text-col',
            { opacity: 0, x: 28 },
            { opacity: 1, x: 0, duration: 0.8, delay: 0.1, ease: 'power2.out' }
          );
        },
      });

      // 7. Epoch Preview Cards Stagger
      ScrollTrigger.batch('.epoch-card', {
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power2.out', overwrite: true }
          );
        },
        start: 'top 88%',
      });

      // 8. Curatorial Consortium Reveal
      ScrollTrigger.create({
        trigger: '.consortium-trigger',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.consortium-partner-btn',
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }
          );
          gsap.fromTo(
            '.consortium-dossier',
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power2.out' }
          );
        },
      });

      // 9. Patron Exhibition Pass Reveal
      ScrollTrigger.create({
        trigger: '.patron-pass-card',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.patron-pass-card',
            { opacity: 0, y: 35, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' }
          );
        },
      });
    },
    { scope: mainRef }
  );

  return (
    <main
      ref={mainRef}
      className="w-full min-h-screen bg-[#F2EDE4] text-[#0E0E0E] font-space overflow-x-hidden selection:bg-[#FFD400] selection:text-[#0E0E0E]"
    >
      {/* ─── SECTION 1: THE PURE BAUHAUS GALLERY HERO ─── */}
      <HeroSection />

      {/* ─── HARDWARE-ACCELERATED KINETIC TICKER RIBBON ─── */}
      <div className="w-full bg-[#FFD400] text-[#0E0E0E] py-2.5 border-b-3 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-widest overflow-hidden select-none">
        <Marquee speed={25} repeat={6} pauseOnHover={false}>
          <span className="mx-6">
            4,600 MA HADEAN • 2,500 MA PROTEROZOIC • 541 MA PALEOZOIC • 252 MA MESOZOIC • 66 MA CENOZOIC • 24 VERIFIED SPECIMENS • ISO-21127 CANONICAL STANDARDS •
          </span>
        </Marquee>
      </div>

      {/* ─── SECTION 2: EXECUTIVE STATS METRICS RIBBON (WITH MAGIC UI NUMBER TICKER) ─── */}
      <section className="w-full bg-[#F2EDE4] border-b-3 border-[#0E0E0E] py-14 px-6 md:px-12 relative overflow-hidden select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x-3 md:divide-[#0E0E0E] relative z-10">
          <div className="stat-col md:px-8 text-left bg-white md:bg-transparent p-5 md:p-0 border-2 md:border-none border-[#0E0E0E] shadow-[4px_4px_0px_#0E0E0E] md:shadow-none">
            <span className="block text-4xl sm:text-5xl font-extrabold font-space text-[#0E0E0E]">
              <NumberTicker value={4.6} decimalPlaces={1} suffix="B" />
            </span>
            <span className="block text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0E0E0E] mt-1.5">
              Years Reconstructed
            </span>
            <span className="block text-[11px] font-mono text-[#0E0E0E]/70 mt-0.5">
              Hadean Magma → Modern Era
            </span>
          </div>

          <div className="stat-col md:px-8 text-left bg-white md:bg-transparent p-5 md:p-0 border-2 md:border-none border-[#0E0E0E] shadow-[4px_4px_0px_#0E0E0E] md:shadow-none">
            <span className="block text-4xl sm:text-5xl font-extrabold font-space text-[#0E0E0E]">
              <NumberTicker value={6} decimalPlaces={0} />
            </span>
            <span className="block text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0E0E0E] mt-1.5">
              Geological Stages
            </span>
            <span className="block text-[11px] font-mono text-[#0E0E0E]/70 mt-0.5">
              Real-Time 3D Biospheres
            </span>
          </div>

          <div className="stat-col md:px-8 text-left bg-white md:bg-transparent p-5 md:p-0 border-2 md:border-none border-[#0E0E0E] shadow-[4px_4px_0px_#0E0E0E] md:shadow-none">
            <span className="block text-4xl sm:text-5xl font-extrabold font-space text-[#0E0E0E]">
              <NumberTicker value={24} decimalPlaces={0} />
            </span>
            <span className="block text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0E0E0E] mt-1.5">
              Verified Records
            </span>
            <span className="block text-[11px] font-mono text-[#0E0E0E]/70 mt-0.5">
              Peer-Reviewed Citations
            </span>
          </div>

          <div className="stat-col md:px-8 text-left bg-white md:bg-transparent p-5 md:p-0 border-2 md:border-none border-[#0E0E0E] shadow-[4px_4px_0px_#0E0E0E] md:shadow-none">
            <span className="block text-4xl sm:text-5xl font-extrabold font-space text-[#0E0E0E]">
              <NumberTicker value={100} decimalPlaces={0} suffix="%" />
            </span>
            <span className="block text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0E0E0E] mt-1.5">
              Single Data Layer
            </span>
            <span className="block text-[11px] font-mono text-[#0E0E0E]/70 mt-0.5">
              Zero Redundant Records
            </span>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: FOUR FLAGSHIP 3D VIRTUAL SIMULATION PORTALS ─── */}
      <VirtualMuseumPortals />

      {/* ─── SECTION 4: ACETERNITY BENTO SHOWCASE (WITH MODAL 3D INSPECTION) ─── */}
      <CuratedBentoShowcase />

      {/* ─── SECTION 5: TAXONOMIC CATEGORY EXPLORER ─── */}
      <CategoryExplorer />

      {/* ─── SECTION 6: SPOTLIGHT — 3D OBJECT OF FOCUS ─── */}
      <Spotlight />

      {/* ─── SECTION 7: MATERIAL DEGRADATION & VERDIGRIS SANDBOX ─── */}
      <DegradationSandbox />

      {/* ─── SECTION 8: SIX EPOCHS DEEP-TIME SEQUENCE ─── */}
      <EpochPreview />

      {/* ─── SECTION 9: GLOBAL CURATORIAL ALLIANCE & INSTITUTIONAL PROVENANCE ─── */}
      <div className="consortium-trigger">
        <CuratorialConsortium />
      </div>

      {/* ─── SECTION 11: PATRON ADMISSION PASS & EXHIBITION FINALE ─── */}
      <div className="patron-pass-trigger">
        <PatronExhibitionPass />
      </div>
    </main>
  );
}
