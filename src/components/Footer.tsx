'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Magnet } from '@/components/reactbits/Magnet';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { ClickSpark } from '@/components/reactbits/ClickSpark';

const LINKS = [
  { href: '/', label: '00 / Home' },
  { href: '/evolution', label: '01 / Earth Evolution' },
  { href: '/hall', label: '02 / Grand Hall 3D' },
  { href: '/compare', label: '03 / Chrono Lab' },
  { href: '/museum', label: '04 / Collection' },
  { href: '/profile', label: '05 / Ticket Stub' },
];

export default function Footer() {
  const pathname = usePathname();
  if (
    pathname === '/login' ||
    pathname?.startsWith('/hall') ||
    pathname?.startsWith('/compare')
  ) {
    return null;
  }

  return (
    <footer className="border-t-3 border-[#0E0E0E] bg-[#F2EDE4] text-[#0E0E0E] px-6 pt-16 pb-24 md:pb-28 md:px-12 lg:px-20 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:flex-row md:items-center md:justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-3 h-3 bg-[#FFD400] border-2 border-[#0E0E0E]" />
            <p className="font-space text-2xl font-bold uppercase tracking-tight text-[#0E0E0E]">
              <ShinyText text="MUSEO 3.0" speed={3} shimmerColor="rgba(255, 212, 0, 0.9)" />
            </p>
          </div>
          <p className="text-xs sm:text-sm text-[#0E0E0E]/70 font-space max-w-md leading-relaxed font-normal">
            A single physical data architecture bridging 4.6 billion years of planetary evolution and verified human antiquity.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-wider font-bold">
          {LINKS.map((link) => (
            <Magnet key={link.href} padding={15} magnetStrength={0.25}>
              <ClickSpark sparkColor="#FFD400" sparkCount={6}>
                <Link
                  href={link.href}
                  className="px-2 py-1 bg-white border border-[#0E0E0E] shadow-[2px_2px_0_#0E0E0E] text-[#0E0E0E] hover:bg-[#FFD400] transition-colors inline-block"
                >
                  {link.label}
                </Link>
              </ClickSpark>
            </Magnet>
          ))}
        </nav>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t-2 border-[#0E0E0E]/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#0E0E0E]/70 font-bold">
        <p>
          <DecryptedText
            text="© 2026 MUSEO // MUSEUM OF DEEP TIME • ALL RIGHTS RESERVED"
            speed={40}
            animateOn="view"
            className="text-[#0E0E0E]"
            encryptedClassName="text-[#B3261E]"
          />
        </p>
        <p className="flex items-center gap-2 text-[#0E0E0E]">
          <span className="w-2 h-2 bg-[#FFD400] border border-[#0E0E0E]" />
          <span>WEBGL 2.0 • THREE.JS • NEXT.JS 16 TURBOPACK</span>
        </p>
      </div>
    </footer>
  );
}
