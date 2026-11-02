'use client';

import React from 'react';
import { SnapshotItem } from './snapshotRegistry';

// ReactBits Components
import { AnimatedContent } from '@/components/reactbits/AnimatedContent';
import { ClickSpark } from '@/components/reactbits/ClickSpark';
import { CountUp } from '@/components/reactbits/CountUp';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { Magnet } from '@/components/reactbits/Magnet';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { SplitText } from '@/components/reactbits/SplitText';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { Squares } from '@/components/reactbits/Squares';
import { TiltedCard } from '@/components/reactbits/TiltedCard';
import { VelocityScroll } from '@/components/magicui/VelocityScroll';
import { BorderBeam } from '@/components/magicui/BorderBeam';
import { Marquee } from '@/components/magicui/Marquee';
import { NumberTicker } from '@/components/magicui/NumberTicker';

// Museum UI & Sections
import { CuratorialConsortium } from '@/components/sections/CuratorialConsortium';
import { PatronExhibitionPass } from '@/components/sections/PatronExhibitionPass';
import CategoryExplorer from '@/components/sections/CategoryExplorer';
import EpochPreview from '@/components/sections/EpochPreview';
import Spotlight from '@/components/sections/Spotlight';
import { VirtualMuseumPortals } from '@/components/sections/VirtualMuseumPortals';
import { CuratedBentoShowcase } from '@/components/sections/CuratedBentoShowcase';
import { ArchivalCtaDeck } from '@/components/sections/ArchivalCtaDeck';
import { TicketStubGenerator } from '@/components/certificate/TicketStubGenerator';
import { ChronoComparator } from '@/components/compare/ChronoComparator';

export function ComponentStageRenderer({ item }: { item: SnapshotItem }) {
  switch (item.id) {
    // ================= 02-home-sections =================
    case 'section-01-hero':
      return (
        <div className="w-full bg-[#0E0E0E] text-[#F2EDE4] p-12 flex flex-col justify-center min-h-[500px] border border-white/10 relative overflow-hidden">
          <div className="text-[#FFD400] font-mono text-xs uppercase tracking-widest mb-4">
            MUSEUM OF DEEP TIME // ACC-001-ALPHA
          </div>
          <h1 className="text-5xl font-black uppercase font-mono tracking-tighter leading-tight max-w-3xl mb-6">
            Four Point Six Billion Years of Planetary Evolution
          </h1>
          <p className="text-neutral-400 font-mono text-sm max-w-xl mb-8">
            Traverse primordial molten crusts, Snowball Earth glaciations, and the Chicxulub bolide impact through precision WebGL stratigraphy.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-[#FFD400] text-black font-mono font-bold text-xs uppercase tracking-wider">
              Enter Planetary Core
            </button>
            <button className="px-6 py-3 border border-white/30 text-white font-mono text-xs uppercase tracking-wider">
              Explore 3D Catalog
            </button>
          </div>
        </div>
      );

    case 'section-02-deep-time-scale':
      return (
        <div className="w-full bg-[#121215] text-[#F5F3EF] p-10 border border-white/10 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className="font-mono text-xs uppercase text-[#FFD400]">CHRONO-SCALE 4,600 MA &rarr; 0 MA</span>
            <span className="font-mono text-xs text-neutral-400">RESOLUTION: 1.0 MA / TICK</span>
          </div>
          <div className="h-16 w-full bg-black/60 border border-white/20 relative flex items-center px-4">
            <div className="absolute inset-y-0 left-0 w-1/4 bg-red-950/40 border-r border-red-500/50 flex items-center justify-center font-mono text-[10px] text-red-400">
              HADEAN (4.6-4.0 Ga)
            </div>
            <div className="absolute inset-y-0 left-1/4 w-1/4 bg-teal-950/40 border-r border-teal-500/50 flex items-center justify-center font-mono text-[10px] text-teal-400">
              ARCHEAN (4.0-2.5 Ga)
            </div>
            <div className="absolute inset-y-0 left-2/4 w-1/4 bg-sky-950/40 border-r border-sky-500/50 flex items-center justify-center font-mono text-[10px] text-sky-400">
              PROTEROZOIC (2.5-0.54 Ga)
            </div>
            <div className="absolute inset-y-0 left-3/4 w-1/4 bg-amber-950/40 flex items-center justify-center font-mono text-[10px] text-amber-400">
              PHANEROZOIC (541 Ma-0)
            </div>
          </div>
        </div>
      );

    case 'section-03-evolution-stages':
      return <EpochPreview />;

    case 'section-04-extinction-turning-points':
      return (
        <div className="w-full bg-[#0E0E0E] text-white p-10 border border-white/10">
          <h2 className="text-2xl font-mono uppercase tracking-tight text-[#FFD400] mb-6">
            The Big Five Planetary Mass Extinctions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="border border-white/20 p-4 bg-white/5">
              <div className="text-red-400 font-bold mb-2">END-PERMIAN // 252 MA</div>
              <p className="text-neutral-400">96% of marine species vanished. The Great Dying driven by Siberian Traps flood basalts.</p>
            </div>
            <div className="border border-white/20 p-4 bg-white/5">
              <div className="text-amber-400 font-bold mb-2">CHICXULUB IMPACT // 66 MA</div>
              <p className="text-neutral-400">10km asteroid impact at Yucatan crater ending the 180-million-year dinosaur dominance.</p>
            </div>
            <div className="border border-white/20 p-4 bg-white/5">
              <div className="text-emerald-400 font-bold mb-2">ANTHROPOCENE // 0 MA</div>
              <p className="text-neutral-400">Accelerated biosphere transformation through industrial carbon emission & urbanization.</p>
            </div>
          </div>
        </div>
      );

    case 'section-05-stratigraphic-comparator':
      return <ChronoComparator />;

    case 'section-06-featured-specimens':
      return <CuratedBentoShowcase />;

    case 'section-07-provenance-verification':
      return <CuratorialConsortium />;

    case 'section-08-admission-portal':
      return <PatronExhibitionPass />;

    // ================= 04-ui-components =================
    case 'ui-badge':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex flex-wrap gap-4 items-center">
          <span className="px-3 py-1 bg-[#FFD400] text-black font-mono font-bold text-xs uppercase tracking-wider">
            VERIFIED HOLOTYPE
          </span>
          <span className="px-3 py-1 border border-neutral-400 text-neutral-200 font-mono text-xs uppercase tracking-wider">
            ARCHEAN CRATON // 3,480 MA
          </span>
          <span className="px-3 py-1 bg-red-950/80 border border-red-500 text-red-300 font-mono text-xs uppercase tracking-wider">
            EXTINCTION HORIZON
          </span>
          <span className="px-3 py-1 bg-sky-950/80 border border-sky-400 text-sky-200 font-mono text-xs uppercase tracking-wider">
            CT SCAN RESOLUTION: 12&mu;m
          </span>
        </div>
      );

    case 'ui-button':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex flex-wrap gap-4 items-center">
          <button className="px-6 py-3 bg-[#FFD400] hover:bg-[#ffe14d] text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[4px_4px_0px_#ffffff]">
            Primary Action
          </button>
          <button className="px-6 py-3 border border-white/40 hover:border-white text-white font-mono text-xs uppercase tracking-wider">
            Secondary Outline
          </button>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-neutral-300 font-mono text-[11px] uppercase tracking-wider">
            Ghost Miniature
          </button>
        </div>
      );

    case 'ui-card':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex justify-center">
          <div className="w-80 bg-[#0E0E0E] border border-white/20 p-5 flex flex-col font-mono text-xs">
            <div className="flex justify-between text-neutral-400 text-[10px] mb-3">
              <span>ACC-8921-TK</span>
              <span className="text-[#FFD400]">DEVONIAN</span>
            </div>
            <div className="h-40 bg-white/5 border border-white/10 mb-4 flex items-center justify-center text-neutral-500">
              [3D Specimen Viewport]
            </div>
            <h3 className="text-white font-bold text-sm mb-1 uppercase">Tiktaalik Roseae</h3>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Transitional lobe-finned sarcopterygian with articulated wrist bones and mobile neck.
            </p>
          </div>
        </div>
      );

    case 'ui-deeptime-slider':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex flex-col gap-3 font-mono">
          <div className="flex justify-between text-xs text-neutral-300">
            <span>EPOCH SCRUBBER</span>
            <span className="text-[#FFD400]">CURRENT: 252.3 MA (END-PERMIAN)</span>
          </div>
          <input
            type="range"
            min="0"
            max="4600"
            defaultValue="252"
            className="w-full accent-[#FFD400] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-500">
            <span>4,600 MA</span>
            <span>2,500 MA</span>
            <span>541 MA</span>
            <span>66 MA</span>
            <span>0 MA</span>
          </div>
        </div>
      );

    case 'ui-event-marker':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex gap-6 items-center justify-center font-mono text-xs">
          <div className="flex items-center gap-2 border border-red-500/60 bg-red-950/30 px-3 py-1.5 text-red-300">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            <span>K-Pg BOUNDARY PIN (66.043 MA)</span>
          </div>
          <div className="flex items-center gap-2 border border-emerald-500/60 bg-emerald-950/30 px-3 py-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            <span>CAMBRIAN RADIATION PIN (541 MA)</span>
          </div>
        </div>
      );

    case 'ui-loader':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-2 border-white/20 border-t-[#FFD400] rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            CALIBRATING RADIOMETRIC RATIOS...
          </span>
        </div>
      );

    case 'ui-section-header':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex flex-col font-mono">
          <div className="text-[#FFD400] text-xs uppercase tracking-widest mb-1">SECTION 03 // TAXONOMY</div>
          <h2 className="text-3xl text-white font-bold tracking-tight uppercase">Paleontological Stratigraphy</h2>
          <div className="w-full h-px bg-white/20 mt-4" />
        </div>
      );

    case 'ui-shareable-ticket-stub':
      return (
        <div className="p-4 bg-[#141418] border border-white/10 flex justify-center">
          <TicketStubGenerator />
        </div>
      );

    case 'ui-sound-toggle-block':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#FFD400] rounded-full animate-pulse" />
            <span className="text-white">SPATIAL AMBIENCE // TRIASSIC REEF FREQUENCY</span>
          </div>
          <button className="px-4 py-2 bg-white/10 border border-white/20 text-neutral-200 uppercase tracking-wider">
            SOUND: ON (432 HZ)
          </button>
        </div>
      );

    case 'ui-custom-cursor':
      return (
        <div className="p-12 bg-[#141418] border border-white/10 flex items-center justify-center">
          <div className="relative w-24 h-24 border border-dashed border-[#FFD400]/60 flex items-center justify-center font-mono text-[9px] text-[#FFD400]">
            <div className="w-3 h-3 bg-[#FFD400] rounded-full" />
            <span className="absolute -bottom-5">X: 742 Y: 391</span>
          </div>
        </div>
      );

    case 'ui-deeptime-preloader':
      return (
        <div className="p-8 bg-black border border-white/10 flex flex-col items-center justify-center font-mono">
          <div className="text-4xl font-black text-[#FFD400] tracking-tighter mb-2">MUSEO</div>
          <div className="text-xs text-neutral-400 uppercase tracking-widest mb-4">MUSEUM OF DEEP TIME</div>
          <div className="w-64 h-1 bg-white/20 overflow-hidden relative">
            <div className="w-2/3 h-full bg-[#FFD400]" />
          </div>
          <span className="text-[10px] text-neutral-500 mt-2">INITIALIZING WEBGL CHRONOMETER &bull; 68%</span>
        </div>
      );

    // ================= 05-reactbits =================
    case 'rb-animated-content':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex justify-center">
          <AnimatedContent distance={50} direction="vertical">
            <div className="p-6 bg-white/5 border border-white/20 font-mono text-center">
              <span className="text-[#FFD400] text-sm font-bold block mb-1">ANIMATED CONTENT BIT</span>
              <p className="text-neutral-300 text-xs">Physics-based spring reveal animation</p>
            </div>
          </AnimatedContent>
        </div>
      );

    case 'rb-architectural-grid-bg':
      return (
        <div className="h-64 w-full bg-[#0E0E0E] border border-white/10 relative overflow-hidden flex items-center justify-center">
          <Squares speed={0.4} squareSize={32} direction="diagonal" borderColor="#333339" hoverFillColor="#444455" />
          <div className="relative z-10 font-mono text-xs text-white bg-black/80 px-4 py-2 border border-white/20">
            ARCHITECTURAL GRID BACKGROUND
          </div>
        </div>
      );

    case 'rb-border-beam':
      return (
        <div className="p-10 bg-[#141418] border border-white/10 flex justify-center">
          <div className="relative w-80 p-6 bg-black/80 border border-white/20 font-mono text-center overflow-hidden">
            <BorderBeam size={140} duration={8} anchor={90} colorFrom="#FFD400" colorTo="#ff5500" />
            <span className="text-[#FFD400] font-bold text-xs block mb-1 uppercase">High-Energy Perimeter</span>
            <p className="text-neutral-400 text-xs">Active BorderBeam SVG Canvas Shader</p>
          </div>
        </div>
      );

    case 'rb-click-spark':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex justify-center">
          <ClickSpark sparkColor="#FFD400" sparkCount={12} sparkRadius={25}>
            <div className="px-6 py-4 bg-white/10 border border-white/20 font-mono text-xs text-white cursor-pointer select-none">
              CLICK HERE FOR SPARK PARTICLE BURST
            </div>
          </ClickSpark>
        </div>
      );

    case 'rb-count-up':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex flex-col items-center justify-center font-mono">
          <span className="text-neutral-400 text-xs uppercase mb-1">Radiometric Chronometer</span>
          <div className="text-5xl font-black text-[#FFD400] tabular-nums flex items-baseline gap-1">
            <CountUp to={4600} from={0} duration={2} />
            <span className="text-xl text-white font-normal">Ma</span>
          </div>
        </div>
      );

    case 'rb-decrypted-text':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex justify-center font-mono text-lg text-[#FFD400]">
          <DecryptedText
            text="CHICXULUB IMPACTUS STRATIGRAPHIA"
            speed={60}
            maxIterations={15}
            animateOn="view"
            className="font-mono tracking-widest uppercase font-bold"
          />
        </div>
      );

    case 'rb-magnet':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex justify-center">
          <Magnet padding={80} disabled={false}>
            <button className="px-6 py-3 bg-[#FFD400] text-black font-mono font-bold text-xs uppercase tracking-wider">
              Magnetic Cursor Target
            </button>
          </Magnet>
        </div>
      );

    case 'rb-scroll-velocity':
      return (
        <div className="w-full py-6 bg-[#0E0E0E] border border-white/10 overflow-hidden font-mono text-sm uppercase">
          <VelocityScroll text="PALEOLITH • DEEP TIME • ARCHEAN • PROTEROZOIC • MESOZOIC • CENOZOIC • " defaultVelocity={2} className="text-[#FFD400]" />
        </div>
      );

    case 'rb-split-text':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex justify-center">
          <SplitText
            text="CHRONOMETRIC ARCHIVE"
            className="text-3xl font-mono font-black uppercase text-white tracking-widest"
            delay={50}
          />
        </div>
      );

    case 'rb-spotlight-card':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex justify-center">
          <SpotlightCard className="w-80 p-6 bg-black/60 border border-white/20 font-mono text-xs">
            <div className="text-[#FFD400] text-xs font-bold mb-2 uppercase">Dynamic Torch Spotlight</div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Move cursor over card to reveal interactive radial luminosity illuminating specimen details.
            </p>
          </SpotlightCard>
        </div>
      );

    case 'rb-tilted-card':
      return (
        <div className="p-8 bg-[#141418] border border-white/10 flex justify-center">
          <TiltedCard maxAngle={12} scale={1.03} glare={true} className="w-80">
            <div className="p-6 bg-black/80 border border-white/20 font-mono text-center">
              <span className="text-[#FFD400] text-xs font-bold block mb-1 uppercase">FMNH PR 2081 T-REX</span>
              <p className="text-neutral-400 text-xs">ReactBits 3D Perspective Spring Hover Tilt</p>
            </div>
          </TiltedCard>
        </div>
      );

    // ================= 06-modals =================
    case 'modal-command-palette':
      return (
        <div className="w-full max-w-2xl mx-auto bg-[#141418] border-2 border-[#FFD400] shadow-[8px_8px_0px_rgba(255,212,0,0.3)] font-mono p-6">
          <div className="flex items-center gap-3 border-b border-white/20 pb-4 mb-4">
            <span className="text-[#FFD400] font-bold text-sm">&gt;</span>
            <input
              type="text"
              readOnly
              value="Tyrannosaurus Sue [FMNH PR 2081]"
              className="bg-transparent text-white font-mono text-sm w-full outline-none"
            />
            <span className="text-[10px] bg-white/10 text-neutral-300 px-2 py-0.5 border border-white/20">
              ESC TO CLOSE
            </span>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <div className="p-3 bg-[#FFD400]/10 border border-[#FFD400]/40 flex justify-between items-center text-white">
              <span>Tyrannosaurus Rex Skull &mdash; Hell Creek Formation (67 Ma)</span>
              <span className="text-[10px] text-[#FFD400]">SPECIMEN &bull; ENTER</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 flex justify-between items-center text-neutral-300">
              <span>Trilobite (Paradoxides davidis) &mdash; Cambrian Explosion</span>
              <span className="text-[10px] text-neutral-500">SPECIMEN</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 flex justify-between items-center text-neutral-300">
              <span>Earth Evolution Globe &mdash; Mesozoic Stage</span>
              <span className="text-[10px] text-neutral-500">CANVAS ROUTE</span>
            </div>
          </div>
        </div>
      );

    case 'modal-field-notebook':
      return (
        <div className="w-full max-w-3xl mx-auto bg-[#1A1A1E] border border-white/20 font-mono p-6 text-xs text-neutral-300">
          <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4">
            <div className="flex gap-4">
              <span className="text-[#FFD400] font-bold border-b-2 border-[#FFD400] pb-1 uppercase cursor-pointer">
                [TAB 1] Field Notes (8)
              </span>
              <span className="text-neutral-400 pb-1 uppercase cursor-pointer">
                [TAB 2] Curatorial Stratigraphy Quiz
              </span>
            </div>
            <span className="text-[10px] text-neutral-500">ACCESSION NOTEBOOK v2.4</span>
          </div>
          <div className="space-y-3">
            <div className="border border-white/10 p-3 bg-black/40">
              <div className="flex justify-between text-[#FFD400] text-[10px] mb-1">
                <span>STATION 04 // MAESTRICHTIAN HORIZON</span>
                <span>OCTOBER 22, 2026</span>
              </div>
              <p className="text-neutral-200 leading-relaxed">
                Observed distinct 3mm gray clay boundary layer containing anomalous iridium abundance and shocked quartz spherules. Confirms bolide detonation impact at K-Pg boundary.
              </p>
            </div>
            <div className="border border-white/10 p-3 bg-black/40">
              <div className="flex justify-between text-[#FFD400] text-[10px] mb-1">
                <span>STATION 01 // PILBARA CRATON, AUSTRALIA</span>
                <span>SEPTEMBER 14, 2026</span>
              </div>
              <p className="text-neutral-200 leading-relaxed">
                Conical stromatolite domal structures recovered from Dresser Formation. Micro-laminations demonstrate Archean biogenic sediment trapping by early photosynthetic consortia.
              </p>
            </div>
          </div>
        </div>
      );

    // Full Pages Fallbacks / Renderings
    case 'page-01-home':
      return (
        <div className="w-full bg-[#0A0A0C] text-[#F5F3EF] p-8 border border-white/10 font-mono">
          <div className="border-b border-white/20 pb-4 mb-8 flex justify-between items-center">
            <div className="text-2xl font-black text-[#FFD400]">MUSEO // MUSEUM OF DEEP TIME</div>
            <div className="text-xs text-neutral-400">ROUTE: / [HOME]</div>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-[#121215] border border-white/10 p-6 flex flex-col justify-between h-72">
              <div>
                <span className="text-xs text-[#FFD400] uppercase">Monumental Spatial Narrative</span>
                <h2 className="text-3xl font-bold mt-2">Planetary Chronology & 3D Specimen Vault</h2>
              </div>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-[#FFD400] text-black text-xs font-bold uppercase">Begin Exploration</span>
                <span className="px-3 py-1 border border-white/30 text-white text-xs uppercase">Curator Mode</span>
              </div>
            </div>
            <div className="bg-[#121215] border border-white/10 p-6 flex flex-col justify-between">
              <span className="text-xs text-neutral-400">TELEMETRY</span>
              <div className="text-3xl font-bold text-[#FFD400]">4.600 Ga</div>
              <p className="text-[11px] text-neutral-400">Full stratigraphy from Hadean magma to Anthropocene megacities.</p>
            </div>
          </div>
        </div>
      );

    case 'page-02-login':
      return (
        <div className="w-full bg-[#0A0A0C] text-white p-8 border border-white/10 font-mono flex flex-col items-center justify-center min-h-[450px]">
          <div className="w-full max-w-md bg-[#141418] border border-white/20 p-6">
            <div className="text-[#FFD400] text-xs uppercase mb-2">ADMISSION KIOSK // COUNTER 01</div>
            <h2 className="text-xl font-bold mb-4 uppercase">Physical Ticket Validation</h2>
            <p className="text-xs text-neutral-400 mb-6">
              Present admission pass on countertop scanner. No accounts or passwords required.
            </p>
            <div className="h-28 bg-black/60 border border-white/10 flex items-center justify-center text-xs text-neutral-500 mb-6">
              [3D Physics Counter & Interactive Stamped Pass]
            </div>
            <button className="w-full py-3 bg-[#FFD400] text-black font-bold uppercase text-xs tracking-wider">
              Stamp Pass & Enter Museum
            </button>
          </div>
        </div>
      );

    case 'page-03-earth-evolution':
      return (
        <div className="w-full bg-[#0A0A0C] text-white p-8 border border-white/10 font-mono">
          <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
            <span className="text-[#FFD400] text-sm font-bold uppercase">ROUTE: /evolution &mdash; 3D Planetary Simulator</span>
            <span className="text-xs text-neutral-400">ACTIVE: MESOZOIC ERA (252 MA)</span>
          </div>
          <div className="h-80 bg-[#0E0E12] border border-white/10 relative flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border border-sky-400/40 bg-radial from-sky-900/60 to-black/80 flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.2)]">
              <span className="text-xs text-sky-300">[3D ChronoTerra WebGL Globe]</span>
            </div>
            <div className="absolute bottom-4 left-4 text-xs text-neutral-400">
              Atmosphere: O2 21% &bull; Surface Temp: 18&deg;C &bull; Continents: Pangea
            </div>
          </div>
        </div>
      );

    case 'page-04-gallery':
      return (
        <div className="w-full bg-[#0A0A0C] text-white p-8 border border-white/10 font-mono">
          <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
            <span className="text-[#FFD400] text-sm font-bold uppercase">ROUTE: /gallery &mdash; Paleontological Catalog</span>
            <span className="text-xs text-neutral-400">SHOWING 12 OF 12 SPECIMENS</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            {['Trilobite', 'Ammonite Shell', 'T-Rex Sue', 'Lucy Australopithecus', 'Stromatolite', 'Archaeopteryx'].map((name, i) => (
              <div key={i} className="bg-[#141418] border border-white/10 p-4">
                <div className="text-[10px] text-[#FFD400] mb-1">ACC-00{i + 1}</div>
                <div className="font-bold text-white mb-1 uppercase">{name}</div>
                <div className="h-20 bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-neutral-500">
                  [3D Thumbnail]
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'page-05-entity-detail':
      return (
        <div className="w-full bg-[#0A0A0C] text-white p-8 border border-white/10 font-mono">
          <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
            <span className="text-[#FFD400] text-sm font-bold uppercase">ROUTE: /gallery/tiktaalik-roseae</span>
            <span className="text-xs text-neutral-400">SPECIMEN INSPECTOR</span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 h-72 bg-[#121215] border border-white/10 flex items-center justify-center text-xs text-neutral-400">
              [Multi-Axis 3D Specimen Inspector with Wireframe/X-Ray Mode]
            </div>
            <div className="bg-[#141418] border border-white/10 p-5 text-xs space-y-4">
              <div>
                <span className="text-[#FFD400] text-[10px] uppercase">Taxonomy</span>
                <div className="font-bold text-white text-sm">Tiktaalik Roseae</div>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] uppercase">Horizon</span>
                <div className="text-neutral-200">Late Devonian (375 Ma)</div>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] uppercase">Location</span>
                <div className="text-neutral-200">Fram Formation, Ellesmere Island, Nunavut</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'page-06-not-found':
      return (
        <div className="w-full bg-[#0A0A0C] text-white p-12 border border-white/10 font-mono flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-500 text-6xl font-black mb-2">404</div>
          <div className="text-[#FFD400] text-sm uppercase tracking-widest mb-4">TEMPORAL ANOMALY DETECTED</div>
          <p className="text-neutral-400 text-xs max-w-md text-center mb-6">
            The requested geological strata or accession record does not exist in the verified Deep Time ledger.
          </p>
          <button className="px-6 py-2 bg-white/10 border border-white/30 text-white text-xs uppercase tracking-wider">
            Return to Present Era (0 Ma)
          </button>
        </div>
      );

    default:
      return (
        <div className="p-8 bg-[#141418] border border-white/10 font-mono text-xs text-neutral-400">
          Capture Target: {item.name}
        </div>
      );
  }
}
