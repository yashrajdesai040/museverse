'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { entities } from '@/data/entities';
import { ArchivalCertificateModal } from '@/components/certificate/ArchivalCertificateModal';
import { MuseumReelModal } from '@/components/showreel/MuseumReelModal';

export function PatronExhibitionPass() {
  const [visitorSerial, setVisitorSerial] = useState('MUSEO-PATRON-8821');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isReelOpen, setIsReelOpen] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const { playClick, playStamp, playLaser, playHover } = useGlobalSound();

  // Flagship specimen for certificate minting
  const flagshipEntity =
    entities.find((e) => e.id === 'antikythera-mechanism') || entities[0];

  useEffect(() => {
    // Generate dynamic visitor session token & date
    const hex = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .toUpperCase()
      .padStart(6, '0');
    setVisitorSerial(`MUSEO-VIP-${hex}`);

    const now = new Date();
    setCurrentDateStr(
      now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
  }, []);

  // 3D Parallax tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = (y / (rect.height / 2)) * -5;
    const rotY = (x / (rect.width / 2)) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <>
      <section className="w-full bg-[#F2EDE4] text-[#0E0E0E] py-28 px-6 md:px-12 lg:px-20 border-b-3 border-[#0E0E0E] relative overflow-hidden select-none">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-[#FFD400] border border-[#0E0E0E] animate-ping" />
              <span className="px-3 py-1 bg-white text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#0E0E0E]">
                PREMIER VISITOR ACCESS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-space uppercase tracking-tight text-[#0E0E0E] mt-1">
              Your Patron Admission Pass
            </h2>
            <p className="text-[#0E0E0E]/80 font-space text-sm sm:text-base mt-2 font-normal">
              An all-access digital pass to our deep-time architecture. Walk the 3D Grand Rotunda, simulate planetary epochs, or mint an official verifiable museum certificate.
            </p>
          </div>

          {/* Master 3D Luxury Ticket Pass Container */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="patron-pass-card w-full max-w-4xl mx-auto bg-white border-3 border-[#0E0E0E] shadow-[8px_8px_0px_#0E0E0E] hover:shadow-[12px_12px_0px_#FFD400] transition-all duration-200 ease-out relative overflow-hidden flex flex-col md:flex-row group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Left Cadmium Yellow Accent Edge Strip */}
            <div className="w-full md:w-3.5 bg-[#FFD400] border-r-2 border-[#0E0E0E] shrink-0" />

            {/* Main Pass Body (Left 68%) */}
            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between border-b-3 md:border-b-0 md:border-r-3 border-dashed border-[#0E0E0E] relative bg-[#fafafa]">
              {/* Notches for authentic ticket perforation */}
              <div className="hidden md:block absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-[#F2EDE4] border-2 border-[#0E0E0E] z-20" />
              <div className="hidden md:block absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-[#F2EDE4] border-2 border-[#0E0E0E] z-20" />

              <div>
                {/* Pass Header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#B3261E] block mb-0.5">
                      INTERNATIONAL DIGITAL CURATORIAL ARCHIVE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-space uppercase text-[#0E0E0E] tracking-tight">
                      MUSEO • ALL-ACCESS PASS
                    </h3>
                  </div>

                  <span className="px-3 py-1 bg-[#0E0E0E] text-[#FFD400] font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 shadow-[2px_2px_0px_#0E0E0E]">
                    VIP ROTUNDA
                  </span>
                </div>

                {/* Ticket Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y-2 border-[#0E0E0E]/15 my-6 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[#0E0E0E]/60 uppercase block font-bold">
                      PASS SERIAL
                    </span>
                    <span className="font-bold text-[#0E0E0E]">{visitorSerial}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#0E0E0E]/60 uppercase block font-bold">
                      ISSUED DATE
                    </span>
                    <span className="font-bold text-[#0E0E0E]">{currentDateStr || 'ACTIVE'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#0E0E0E]/60 uppercase block font-bold">
                      CURATED SCOPE
                    </span>
                    <span className="font-bold text-[#0E0E0E]">4.54B Years</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#0E0E0E]/60 uppercase block font-bold">
                      CLEARANCE
                    </span>
                    <span className="font-bold text-emerald-700">UNRESTRICTED</span>
                  </div>
                </div>

                {/* Curatorial Guarantee Note */}
                <p className="text-xs text-[#0E0E0E]/75 font-space leading-relaxed">
                  Grants instantaneous admission to all 6 planetary epochs, real-time WebGL 3D specimen micro-viewports, and synchronized spatial audio chambers.
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t-2 border-[#0E0E0E]/15">
                <Link
                  href="/hall"
                  onClick={() => playClick()}
                  onMouseEnter={() => playHover()}
                  className="px-6 py-3 bg-[#0E0E0E] hover:bg-[#222] text-[#F2EDE4] hover:text-[#FFD400] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_#0E0E0E] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
                >
                  Enter 3D Grand Hall →
                </Link>

                <button
                  onClick={() => {
                    playLaser();
                    setIsReelOpen(true);
                  }}
                  onMouseEnter={() => playHover()}
                  className="px-5 py-3 bg-white hover:bg-[#F2EDE4] text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-[3px_3px_0px_#0E0E0E] hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  🎬 3D Cinematic Reel
                </button>

                <button
                  onClick={() => {
                    playStamp();
                    setIsCertModalOpen(true);
                  }}
                  onMouseEnter={() => playHover()}
                  className="px-5 py-3 bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-[3px_3px_0px_#0E0E0E] hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  📜 Mint Archival Certificate
                </button>
              </div>
            </div>

            {/* Right Stub (Right 32%) */}
            <div className="w-full md:w-72 p-8 flex flex-col justify-between bg-white text-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#0E0E0E]/60 font-bold block mb-1">
                  PATRON STUB
                </span>
                <div className="font-mono font-bold text-sm text-[#0E0E0E] mb-4 uppercase">
                  EXHIBITION PASS
                </div>

                {/* Simulated High-Res Barcode */}
                <div className="w-full h-14 bg-[#0E0E0E] flex items-center justify-around px-2 py-1 mb-2 border border-[#0E0E0E]">
                  {[4, 1, 3, 1, 2, 5, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 5, 1, 2, 3].map(
                    (w, idx) => (
                      <div
                        key={idx}
                        className="h-full bg-white"
                        style={{ width: `${w * 1.5}px` }}
                      />
                    )
                  )}
                </div>
                <span className="font-mono text-[9px] text-[#0E0E0E]/60 tracking-widest block font-bold">
                  {visitorSerial}
                </span>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-[#0E0E0E]/15">
                <span className="block text-[10px] font-mono text-[#0E0E0E]/60 uppercase font-bold">
                  VERIFIED ADMISSION
                </span>
                <span className="block text-xs font-mono font-bold text-[#0E0E0E] mt-0.5">
                  100% OPEN KNOWLEDGE
                </span>
                <span className="block text-[10px] font-mono text-emerald-700 font-bold mt-1">
                  ● ACTIVE SESSION
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Autonomous Cinematic Showreel Modal */}
      <MuseumReelModal isOpen={isReelOpen} onClose={() => setIsReelOpen(false)} />

      {/* Verifiable Archival Certificate Minting Modal */}
      <ArchivalCertificateModal
        entity={flagshipEntity}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </>
  );
}

export default PatronExhibitionPass;
