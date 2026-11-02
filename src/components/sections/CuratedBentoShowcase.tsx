'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BentoGrid, BentoGridItem } from '@/components/aceternity/BentoGrid';
import { BorderBeam } from '@/components/magicui/BorderBeam';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { Magnet } from '@/components/reactbits/Magnet';
import { ClickSpark } from '@/components/reactbits/ClickSpark';
import { ThreeUIParticleNetwork } from '@/components/threeui/ThreeUIComponents';
import { useAppStore } from '@/stores/useAppStore';
import { useGlobalSound } from '@/hooks/useGlobalSound';

export function CuratedBentoShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const { openEntityModal } = useAppStore();
  const { playLaser, playClick, playHover } = useGlobalSound();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '250px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const BENTO_SPECIMENS = [
    {
      id: 'trex-sue',
      title: 'Tyrannosaurus Rex (FMNH PR 2081 "Sue")',
      age: '67.0 MA • LATE CRETACEOUS',
      type: 'FOSSIL',
      institution: 'The Field Museum, Chicago',
      badgeColor: 'bg-[#FFD400]',
      desc: 'The most complete (90%) and best-preserved T. rex skeleton ever unearthed, with 57,000 N bite force serrated dentition and healed bone pathologies.',
      span: 'md:col-span-2',
      tag: 'APEX THEROPOD HOLOTYPE',
      icon: '🦖',
      hasBeam: true,
    },
    {
      id: 'stromatolite-pilbara',
      title: 'Pilbara Apex Chert Stromatolite',
      age: '3,480 MA • ARCHEAN EON',
      type: 'FOSSIL',
      institution: 'WA Museum, Perth',
      badgeColor: 'bg-[#FFD400]',
      desc: 'Layered microbial mats of primordial cyanobacteria that initiated the Great Oxidation Event, forging the modern breathable atmosphere.',
      span: 'md:col-span-1',
      tag: 'EARLIEST LIFE ON EARTH',
      icon: '🪨',
      hasBeam: false,
    },
    {
      id: 'antikythera-mechanism',
      title: 'The Antikythera Mechanism',
      age: '2,150 YA • HELLENISTIC GREECE',
      type: 'ARTIFACT',
      institution: 'National Archaeological Museum, Athens',
      badgeColor: 'bg-white',
      desc: 'World’s oldest known analog computer, housing 30+ precision bronze differential gears calculating astronomical positions and eclipse cycles.',
      span: 'md:col-span-1',
      tag: 'ANALOG COMPUTING MATRIX',
      icon: '⚙️',
      hasBeam: false,
    },
    {
      id: 'archaeopteryx-london',
      title: 'Archaeopteryx lithographica',
      age: '150.8 MA • LATE JURASSIC',
      type: 'FOSSIL',
      institution: 'Natural History Museum, London',
      badgeColor: 'bg-[#FFD400]',
      desc: 'The definitive transitional fossil linking non-avian theropod dinosaurs to modern birds, displaying flight remiges alongside hyperextensible claws.',
      span: 'md:col-span-2',
      tag: 'TRANSITIONAL AVIAN HOLOTYPE',
      icon: '🦅',
      hasBeam: true,
    },
    {
      id: 'otzi-iceman',
      title: 'Ötzi The Similaun Iceman',
      age: '5,300 YA • COPPER AGE',
      type: 'RELIC',
      institution: 'South Tyrol Museum of Archaeology',
      badgeColor: 'bg-white',
      desc: 'Naturally mummified glacial alpine hunter preserved with complete clothing, 99.7% pure copper axe, birch-fungus medicines, and 61 skin tattoos.',
      span: 'md:col-span-2',
      tag: 'GLACIAL ALPINE MUMMY',
      icon: '🏹',
      hasBeam: true,
    },
    {
      id: 'rosetta-stone',
      title: 'The Rosetta Stone',
      age: '196 BCE • PTOLEMAIC EGYPT',
      type: 'ARTIFACT',
      institution: 'The British Museum, London',
      badgeColor: 'bg-white',
      desc: 'Granodiorite stele inscribed with the Memphis decree in Ancient Egyptian hieroglyphs, Demotic script, and Ancient Greek, unlocking ancient literacy.',
      span: 'md:col-span-1',
      tag: 'TRILINGUAL DECIPHERMENT DECREE',
      icon: '📜',
      hasBeam: false,
    },
  ];

  return (
    <section ref={sectionRef} className="py-28 px-6 md:px-12 bg-[#F2EDE4] border-b-3 border-[#0E0E0E] relative overflow-hidden select-none">
      {/* ── ThreeUI Kinetic Particle Network Ambient Atmosphere ── */}
      {isInView && (
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply overflow-hidden">
          <ThreeUIParticleNetwork mode="light" density={0.8} speed={0.4} />
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 border-b-3 border-[#0E0E0E] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 bg-[#FFD400] border-2 border-[#0E0E0E]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0E0E0E]/80">
                <DecryptedText
                  text="EXHIBITION HIGHLIGHTS // ACETERNITY BENTO ARCHITECTURE"
                  speed={35}
                  animateOn="view"
                  className="text-[#0E0E0E] font-bold"
                  encryptedClassName="text-[#B3261E]"
                />
              </span>
            </div>
            <h2 className="font-space text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#0E0E0E]">
              Six Iconic Specimens
            </h2>
            <p className="font-space text-sm sm:text-base text-[#0E0E0E]/75 mt-2 max-w-xl font-normal">
              Click any specimen card to trigger immediate hardware-accelerated 3D inspection, rotate 360°, inspect skeletal pathologies, and read verified curatorial monographs.
            </p>
          </div>

          <Magnet padding={20} magnetStrength={0.25}>
            <Link
              href="/museum"
              onClick={playClick}
              onMouseEnter={() => playHover()}
              className="px-5 py-3 border-3 border-[#0E0E0E] bg-white text-[#0E0E0E] hover:bg-[#FFD400] font-mono text-xs font-bold uppercase shadow-[4px_4px_0_#0E0E0E] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#0E0E0E] transition-all inline-block"
            >
              ALL 24 SPECIMENS VAULT →
            </Link>
          </Magnet>
        </div>

        {/* Bento Grid */}
        <BentoGrid className="max-w-7xl">
          {BENTO_SPECIMENS.map((item) => (
            <BentoGridItem
              key={item.id}
              className={`${item.span} relative group bg-white border-3 border-[#0E0E0E] shadow-[6px_6px_0px_#0E0E0E] hover:shadow-[10px_10px_0px_#FFD400] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]`}
              title={item.title}
              description={item.desc}
              onClick={() => {
                playLaser();
                openEntityModal(item.id);
              }}
              badge={
                <span className={`px-2.5 py-0.5 border-2 border-[#0E0E0E] text-[10px] font-mono font-bold uppercase ${item.badgeColor} shadow-[1px_1px_0px_#0E0E0E]`}>
                  <ShinyText text={item.type} speed={3} />
                </span>
              }
              icon={
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-[#0E0E0E]/70">
                  <span className="text-xl">{item.icon}</span>
                  <span className="bg-[#F2EDE4] px-1.5 py-0.5 border border-[#0E0E0E] text-[10px]">
                    {item.age}
                  </span>
                </div>
              }
              header={
                <div className="w-full flex-1 flex flex-col justify-between py-1 relative">
                  {item.hasBeam && <BorderBeam size={220} duration={8} colorFrom="#FFD400" colorTo="#0E0E0E" borderWidth={2} />}
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#0E0E0E]/60 border-b-2 border-[#0E0E0E]/15 pb-2">
                    <span className="tracking-wider uppercase">{item.tag}</span>
                    <span className="group-hover:text-[#B3261E] font-extrabold transition-colors flex items-center gap-1">
                      <span>INSPECT 3D</span>
                      <span>↗</span>
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#0E0E0E]/50 italic pt-1">
                    Holdings: {item.institution}
                  </div>
                </div>
              }
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

export default CuratedBentoShowcase;
