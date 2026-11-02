'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGlobalSound } from '@/hooks/useGlobalSound';

interface ConsortiumPartner {
  id: string;
  name: string;
  city: string;
  country: string;
  division: string;
  foundingYear: number;
  specimenCount: number;
  primaryHoldings: string;
  imagingMethod: string;
  accessionProtocol: string;
  sealCode: string;
  badge: string;
}

const PARTNERS: ConsortiumPartner[] = [
  {
    id: 'nhm-london',
    name: 'Natural History Museum',
    city: 'London',
    country: 'United Kingdom',
    division: 'Department of Earth Sciences & Palæobiology',
    foundingYear: 1881,
    specimenCount: 8,
    primaryHoldings: 'Archaeopteryx lithographica (London Holotype), Mary Anning Ichthyosaurs',
    imagingMethod: 'Laser Micro-Interferometry & Sub-micron CT',
    accessionProtocol: 'ISO-21127 Archival Ontology',
    sealCode: 'GB-NHM-PAL-1881',
    badge: 'PALÆONTOLOGICAL HOLOTYPES',
  },
  {
    id: 'field-chicago',
    name: 'The Field Museum',
    city: 'Chicago',
    country: 'United States',
    division: 'Division of Fossil Vertebrates & Taphonomy',
    foundingYear: 1893,
    specimenCount: 5,
    primaryHoldings: 'FMNH PR 2081 "Sue" • Complete Cranial Microtomography',
    imagingMethod: 'High-Energy Industrial Computed Tomography',
    accessionProtocol: 'FMNH Biostratigraphic Standard',
    sealCode: 'US-FMNH-VER-1893',
    badge: 'APEX THEROPOD ARCHIVES',
  },
  {
    id: 'louvre-paris',
    name: 'Musée du Louvre',
    city: 'Paris',
    country: 'France',
    division: 'Département des Antiquités Orientales',
    foundingYear: 1793,
    specimenCount: 6,
    primaryHoldings: 'Code of Hammurabi, Mesopotamian Basalt & Diorite Inscriptions',
    imagingMethod: 'Multispectral Reflectance Transformation (RTI)',
    accessionProtocol: 'Direction des Musées de France 4.0',
    sealCode: 'FR-LOU-DAO-1793',
    badge: 'NEAR EASTERN EPIGRAPHY',
  },
  {
    id: 'nam-athens',
    name: 'National Archaeological Museum',
    city: 'Athens',
    country: 'Greece',
    division: 'Prehistoric Antiquities & Metallurgical Conservation',
    foundingYear: 1829,
    specimenCount: 4,
    primaryHoldings: 'Antikythera Mechanism Fragments A–G, Mycenaean Gold Death Masks',
    imagingMethod: 'BladeX 3D Surface Microtomography',
    accessionProtocol: 'Hellenic Heritage Registry Alpha',
    sealCode: 'GR-NAM-MET-1829',
    badge: 'HELLENIC COMPUTING & BRONZE',
  },
  {
    id: 'sam-adelaide',
    name: 'South Australian Museum',
    city: 'Adelaide',
    country: 'Australia',
    division: 'Ediacaran Palaeontology & Deep Precambrian Survey',
    foundingYear: 1856,
    specimenCount: 3,
    primaryHoldings: 'Nilpena Ediacara Biota, Dickinsonia costata Bedding Planes',
    imagingMethod: 'Polarized Photogrammetry & LIDAR Relief Scan',
    accessionProtocol: 'UNESCO World Heritage Nilpena Protocol',
    sealCode: 'AU-SAM-EDI-1856',
    badge: 'PRECAMBRIAN BIOGENESIS',
  },
];

export function CuratorialConsortium() {
  const [selectedPartner, setSelectedPartner] = useState<string>(PARTNERS[0].id);
  const { playClick, playHover } = useGlobalSound();

  const active = PARTNERS.find((p) => p.id === selectedPartner) || PARTNERS[0];

  return (
    <section className="w-full bg-[#F2EDE4] text-[#0E0E0E] py-28 px-6 md:px-12 lg:px-20 border-b-3 border-[#0E0E0E] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b-3 border-[#0E0E0E] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-[#FFD400] border border-[#0E0E0E] animate-ping" />
              <span className="px-3 py-1 bg-white text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#0E0E0E]">
                VERIFIED CURATORIAL CONSORTIA
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-space uppercase tracking-tight text-[#0E0E0E] mt-1">
              Global Museum Alliances
            </h2>
            <p className="text-[#0E0E0E]/80 font-space text-sm sm:text-base max-w-2xl mt-2 font-normal">
              Direct institutional agreements ensuring zero speculative reconstructions. Every digital specimen is tied to peer-reviewed museum accession numbers, laser interferometry scans, and physical holotypes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-white border-2 border-[#0E0E0E] font-mono text-xs shadow-[3px_3px_0px_#0E0E0E] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[#0E0E0E]/70 font-medium">Network Status:</span>
              <span className="text-[#0E0E0E] font-bold">5 Institutions Synchronized</span>
            </div>
          </div>
        </div>

        {/* Master Architectural Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Partner List (5 Columns) */}
          <div className="lg:col-span-5 space-y-3">
            {PARTNERS.map((partner) => {
              const isSelected = partner.id === selectedPartner;
              return (
                <button
                  key={partner.id}
                  onClick={() => {
                    playClick();
                    setSelectedPartner(partner.id);
                  }}
                  onMouseEnter={() => playHover()}
                  className={`consortium-partner-btn w-full text-left p-5 transition-all duration-200 border-3 border-[#0E0E0E] flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#0E0E0E] text-[#F2EDE4] shadow-[4px_4px_0px_#FFD400] translate-x-1.5'
                      : 'bg-white hover:bg-[#F2EDE4] text-[#0E0E0E] shadow-[4px_4px_0px_#0E0E0E]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                        isSelected
                          ? 'bg-[#FFD400] text-[#0E0E0E] border-[#FFD400]'
                          : 'bg-[#F2EDE4] text-[#0E0E0E] border-[#0E0E0E]'
                      }`}
                    >
                      {partner.badge}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        isSelected ? 'text-[#FFD400]' : 'text-[#0E0E0E]/60'
                      }`}
                    >
                      Est. {partner.foundingYear}
                    </span>
                  </div>

                  <h3
                    className={`text-lg font-bold font-space uppercase ${
                      isSelected ? 'text-white' : 'text-[#0E0E0E]'
                    }`}
                  >
                    {partner.name}
                  </h3>

                  <div
                    className={`flex items-center justify-between text-xs font-mono mt-3 pt-2 border-t ${
                      isSelected
                        ? 'border-white/20 text-[#F2EDE4]/70'
                        : 'border-[#0E0E0E]/15 text-[#0E0E0E]/60'
                    }`}
                  >
                    <span>
                      {partner.city}, {partner.country}
                    </span>
                    <span
                      className={`font-bold ${
                        isSelected ? 'text-[#FFD400]' : 'text-[#0E0E0E]'
                      }`}
                    >
                      {partner.specimenCount} Specimens Curated →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: High-Prestige Institutional Dossier Card (7 Columns) */}
          <div className="consortium-dossier lg:col-span-7 bg-white border-3 border-[#0E0E0E] p-8 sm:p-10 shadow-[8px_8px_0px_#0E0E0E] relative">
            {/* Top Bar with Security Watermark */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-[#0E0E0E] gap-4">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-[#B3261E] uppercase block mb-1">
                  OFFICIAL ACCESSION DOSSIER • {active.sealCode}
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold font-space uppercase text-[#0E0E0E]">
                  {active.name}
                </h4>
                <p className="text-sm font-space text-[#0E0E0E]/70 mt-0.5">
                  {active.division}
                </p>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 border-2 border-emerald-800 font-mono text-[11px] font-bold uppercase tracking-wider">
                  ✓ VERIFIED DATA FEED
                </span>
              </div>
            </div>

            {/* Dossier Specifications Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              <div className="p-4 bg-[#F2EDE4] border-2 border-[#0E0E0E]">
                <span className="block font-mono text-[10px] uppercase font-bold text-[#0E0E0E]/60 tracking-wider mb-1">
                  PRIMARY ACCESSION HOLDINGS
                </span>
                <p className="text-sm font-space font-bold text-[#0E0E0E] leading-snug">
                  {active.primaryHoldings}
                </p>
              </div>

              <div className="p-4 bg-[#F2EDE4] border-2 border-[#0E0E0E]">
                <span className="block font-mono text-[10px] uppercase font-bold text-[#0E0E0E]/60 tracking-wider mb-1">
                  SURFACE METROLOGY & SCANNING
                </span>
                <p className="text-sm font-space font-bold text-[#0E0E0E] leading-snug">
                  {active.imagingMethod}
                </p>
              </div>

              <div className="p-4 bg-[#F2EDE4] border-2 border-[#0E0E0E]">
                <span className="block font-mono text-[10px] uppercase font-bold text-[#0E0E0E]/60 tracking-wider mb-1">
                  CURATORIAL ONTOLOGY PROTOCOL
                </span>
                <p className="text-sm font-space font-mono text-[#0E0E0E] font-bold">
                  {active.accessionProtocol}
                </p>
              </div>

              <div className="p-4 bg-[#F2EDE4] border-2 border-[#0E0E0E]">
                <span className="block font-mono text-[10px] uppercase font-bold text-[#0E0E0E]/60 tracking-wider mb-1">
                  PERMANENT ACCESSION COUNT
                </span>
                <p className="text-sm font-space font-mono text-[#B3261E] font-bold">
                  {active.specimenCount} Masterpiece Artifacts Digitized
                </p>
              </div>
            </div>

            {/* Curatorial Seal & Direct Museum Vault CTA */}
            <div className="pt-6 border-t-2 border-[#0E0E0E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs font-mono text-[#0E0E0E]/70">
                <span className="text-[#0E0E0E]/50 block text-[10px] font-bold">CRYPTOGRAPHIC INTEGRITY:</span>
                <span className="font-bold text-[#0E0E0E]">SHA-256 ACCREDITATION PROOF VALIDATED</span>
              </div>

              <Link
                href="/museum"
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className="px-6 py-3.5 bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_#0E0E0E] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#0E0E0E] shrink-0 cursor-pointer"
              >
                Inspect Institution Vault ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CuratorialConsortium;
