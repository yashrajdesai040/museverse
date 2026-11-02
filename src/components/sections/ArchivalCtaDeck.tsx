'use client';

import React from 'react';
import Link from 'next/link';
import { Marquee } from '@/components/magicui/Marquee';
import { BorderBeam } from '@/components/magicui/BorderBeam';
import { NumberTicker } from '@/components/magicui/NumberTicker';
import { Magnet } from '@/components/reactbits/Magnet';
import { ClickSpark } from '@/components/reactbits/ClickSpark';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { SplitText } from '@/components/reactbits/SplitText';
import { useGlobalSound } from '@/hooks/useGlobalSound';

export function ArchivalCtaDeck() {
  const { playClick, playLaser } = useGlobalSound();

  const TICKER_ITEMS = [
    '✦ 4.6 BILLION YEARS OF TERRESTRIAL REALITY',
    '✦ 24 CURATED SPECIMEN MASTERPIECES',
    '✦ SMITHSONIAN & NHM LONDON OPEN DATA',
    '✦ FIRST-PERSON 3D WEBGL ENGINE',
    '✦ ZERO BACKEND • THE TICKET IS YOUR LOGIN',
    '✦ CHICXULUB IMPACT 66.0 MA CHOREOGRAPHY',
  ];

  return (
    <section className="relative w-full bg-[#0E0E0E] text-[#F2EDE4] py-20 border-t-4 border-[#0E0E0E] overflow-hidden select-none">
      {/* ── Top Infinite Velocity Marquee ── */}
      <div className="border-b-3 border-[#FFD400] bg-[#161616] py-3 text-xs font-mono font-bold uppercase tracking-widest text-[#FFD400]">
        <Marquee speed={25} pauseOnHover={false}>
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="inline-block px-4">
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      {/* ── Main Monumental CTA Card ── */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="relative border-4 border-[#F2EDE4] bg-[#1C1C1C] p-8 md:p-16 shadow-[12px_12px_0px_#FFD400] overflow-hidden">
          <BorderBeam size={300} duration={10} colorFrom="#FFD400" colorTo="#F2EDE4" borderWidth={3} />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 bg-[#FFD400] border border-[#0E0E0E]" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD400]">
                  <DecryptedText
                    text="READY FOR DEEP-TIME EXPLORATION?"
                    speed={30}
                    animateOn="view"
                    className="text-[#FFD400]"
                    encryptedClassName="text-white"
                  />
                </span>
              </div>

              <h2 className="font-space text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-[#F2EDE4] leading-none mb-6">
                <SplitText
                  text="Your Ticket To 4.6 Billion Years."
                  splitBy="words"
                  stagger={0.04}
                />
              </h2>

              <p className="font-space text-sm sm:text-base text-[#F2EDE4]/80 leading-relaxed font-normal mb-8 max-w-xl">
                Traverse molten primordial oceans, observe continental drift in real time, and inspect high-resolution
                scans of Earth&apos;s most defining fossils and human artifacts.
              </p>

              {/* Live Metric Stats Counters via Magic UI NumberTicker */}
              <div className="grid grid-cols-3 gap-4 border-t-2 border-dashed border-[#F2EDE4]/30 pt-6 font-mono">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#FFD400]">
                    <NumberTicker value={4600} decimalPlaces={0} suffix=" Ma" />
                  </div>
                  <div className="text-[10px] text-[#F2EDE4]/60 uppercase">Chrono Depth</div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#FFD400]">
                    <NumberTicker value={24} decimalPlaces={0} suffix=" Items" />
                  </div>
                  <div className="text-[10px] text-[#F2EDE4]/60 uppercase">Verified Specimens</div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#FFD400]">
                    <NumberTicker value={100} decimalPlaces={0} suffix="%" />
                  </div>
                  <div className="text-[10px] text-[#F2EDE4]/60 uppercase">Scientific Rigor</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons Deck */}
            <div className="flex flex-col gap-4 w-full lg:w-auto shrink-0">
              <Magnet padding={35} magnetStrength={0.3}>
                <ClickSpark sparkColor="#0E0E0E" sparkCount={8} className="w-full">
                  <Link
                    href="/login"
                    onClick={playLaser}
                    className="w-full lg:w-auto px-8 py-5 bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] font-space font-extrabold text-sm sm:text-base uppercase tracking-wider border-3 border-[#0E0E0E] shadow-[6px_6px_0px_#F2EDE4] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_#F2EDE4] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <ShinyText text="STAMP PHYSICAL TICKET →" speed={2.5} shimmerColor="rgba(14, 14, 14, 0.9)" />
                  </Link>
                </ClickSpark>
              </Magnet>

              <Magnet padding={25} magnetStrength={0.2}>
                <ClickSpark sparkColor="#FFD400" sparkCount={6} className="w-full">
                  <Link
                    href="/evolution"
                    onClick={playClick}
                    className="w-full lg:w-auto px-8 py-4 bg-[#0E0E0E] hover:bg-[#1C1C1C] text-[#F2EDE4] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#F2EDE4] shadow-[4px_4px_0px_#FFD400] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#FFD400] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>TRAVERSE DEEP TIME (4,600 MA) ✦</span>
                  </Link>
                </ClickSpark>
              </Magnet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArchivalCtaDeck;
