'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { TiltedCard } from '@/components/reactbits/TiltedCard';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { Magnet } from '@/components/reactbits/Magnet';
import { ClickSpark } from '@/components/reactbits/ClickSpark';

export function TicketStubGenerator() {
  const { user } = useAuthStore();
  const { playClick, playStamp, playLaser } = useGlobalSound();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [visitDate, setVisitDate] = useState('');

  useEffect(() => {
    const d = new Date();
    setVisitDate(
      d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) + ` • ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} UTC`
    );
  }, []);

  const handleDownloadPNG = () => {
    playStamp();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Bauhaus Neo-Brutalist Ticket on High-Res Canvas (800 x 420)
    canvas.width = 800;
    canvas.height = 420;

    // Background paper
    ctx.fillStyle = '#F2EDE4';
    ctx.fillRect(0, 0, 800, 420);

    // Thick ink border
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#0E0E0E';
    ctx.strokeRect(4, 4, 792, 412);

    // Perforation strip line on the right
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(620, 0);
    ctx.lineTo(620, 420);
    ctx.stroke();
    ctx.setLineDash([]);

    // Header strip
    ctx.fillStyle = '#FFD400';
    ctx.fillRect(8, 8, 608, 64);
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 608, 64);

    ctx.fillStyle = '#0E0E0E';
    ctx.font = 'bold 28px monospace';
    ctx.fillText('MUSEO // VISIT STUB', 28, 50);

    ctx.font = 'bold 14px monospace';
    ctx.fillText('4.6 BILLION YEARS', 420, 50);

    // Body content
    ctx.fillStyle = '#0E0E0E';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`PATRON: ${user?.name || 'VERIFIED EXPLORER'}`, 28, 115);
    ctx.fillText(`ISSUED: ${visitDate || '2026 DEEP TIME'}`, 28, 145);
    ctx.fillText('SECTORS VISITED:', 28, 185);

    ctx.font = '14px monospace';
    ctx.fillText('▪ [X] 01 HADEAN-ARCHEAN (4,600 - 2,500 MA)', 45, 215);
    ctx.fillText('▪ [X] 02 PROTEROZOIC (2,500 - 541 MA)', 45, 240);
    ctx.fillText('▪ [X] 03 PALEOZOIC (541 - 252 MA)', 45, 265);
    ctx.fillText('▪ [X] 04 MESOZOIC & CHICXULUB (252 - 66 MA)', 45, 290);
    ctx.fillText('▪ [X] 05 CENOZOIC & ANTHROPOCENE (66 - 0 MA)', 45, 315);

    // Red Stamp on left
    ctx.save();
    ctx.translate(460, 240);
    ctx.rotate(-0.15);
    ctx.strokeStyle = '#B3261E';
    ctx.lineWidth = 4;
    ctx.strokeRect(-110, -35, 220, 70);
    ctx.fillStyle = '#B3261E';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ADMITTED', 0, 0);
    ctx.font = 'bold 11px monospace';
    ctx.fillText('4.6 GA VALIDATED', 0, 22);
    ctx.restore();

    // Stub section on the right
    ctx.fillStyle = '#0E0E0E';
    ctx.font = 'bold 18px monospace';
    ctx.save();
    ctx.translate(650, 40);
    ctx.fillText('STUB #004600', 0, 0);
    ctx.font = '12px monospace';
    ctx.fillText('KEEP THIS PASS', 0, 28);

    // Barcode vertical simulation
    ctx.fillStyle = '#0E0E0E';
    const bars = [4, 2, 6, 2, 8, 3, 2, 5, 2, 7, 3, 6, 2, 4, 3, 5, 2, 8, 4, 2, 6];
    let bx = 0;
    bars.forEach((w) => {
      ctx.fillRect(bx, 60, w, 240);
      bx += w + 3;
    });

    ctx.restore();

    // Download Trigger
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MUSEO-Deep-Time-Ticket-Stub.png';
    a.click();
  };

  const handleCopyLink = () => {
    playClick();
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin + '/evolution');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#F2EDE4] text-[#0E0E0E] border-3 border-[#0E0E0E] shadow-[8px_8px_0px_#0E0E0E] p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Hidden high-res canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Ticket Preview Card with React Bits TiltedCard */}
      <TiltedCard maxAngle={5} scale={1.01} glare={true} className="w-full mb-6">
        <div className="border-3 border-[#0E0E0E] bg-white p-6 shadow-[4px_4px_0_#0E0E0E] relative overflow-hidden">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-3 border-[#0E0E0E] pb-4 mb-4 gap-2">
            <div>
              <span className="font-mono text-xs font-bold uppercase text-[#FFD400] bg-[#0E0E0E] px-2 py-0.5 inline-block mb-1">
                ACT 04 // EXIT & MEMORY
              </span>
              <h2 className="font-space text-2xl font-bold uppercase text-[#0E0E0E]">
                Patron Deep-Time Ticket Stub
              </h2>
            </div>
            <span className="font-mono text-xs font-bold border-2 border-[#0E0E0E] px-3 py-1 bg-[#FFD400] self-start sm:self-auto">
              NO. 004600
            </span>
          </div>

          {/* Content Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div>
              <p className="text-[#0E0E0E]/60 uppercase font-bold mb-1">PATRON NAME:</p>
              <div className="text-base font-bold mb-3 text-[#0E0E0E]">
                <DecryptedText
                  text={user?.name || 'Distinguished Patron'}
                  speed={35}
                  animateOn="view"
                  className="font-bold text-[#0E0E0E]"
                  encryptedClassName="text-[#FFD400]"
                />
              </div>

              <p className="text-[#0E0E0E]/60 uppercase font-bold mb-1">ISSUED AT:</p>
              <p className="font-bold mb-3">{visitDate || 'Present Session'}</p>

              <p className="text-[#0E0E0E]/60 uppercase font-bold mb-1">CHRONO RANGE COMPLETED:</p>
              <p className="font-bold text-[#B3261E]">4,600 MA → 0 MA (100% TRAVERSED)</p>
            </div>

            <div className="p-4 bg-[#F2EDE4] border-2 border-[#0E0E0E]">
              <p className="font-bold uppercase text-xs mb-2 border-b border-[#0E0E0E] pb-1">
                SECTORS PUNCHED:
              </p>
              <ul className="space-y-1.5 text-[11px]">
                <li className="flex items-center gap-2">
                  <span className="text-[#0E0E0E] font-bold">☑</span>
                  <span>01 Hadean–Archean (4,600 Ma)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0E0E0E] font-bold">☑</span>
                  <span>02 Proterozoic Ocean (2,500 Ma)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0E0E0E] font-bold">☑</span>
                  <span>03 Paleozoic Explosion (541 Ma)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0E0E0E] font-bold">☑</span>
                  <span>04 Mesozoic & Chicxulub (252 Ma)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0E0E0E] font-bold">☑</span>
                  <span>05 Cenozoic & Civilization (66 Ma)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Diagonal Admitted Stamp */}
          <div className="mt-6 flex items-center justify-between border-t-2 border-dashed border-[#0E0E0E] pt-4">
            <div className="font-mono text-[10px] text-[#0E0E0E]/60">
              MUSEO ARCHIVE • VERIFIED CAPSTONE ENTRY
            </div>
            <div className="px-4 py-1 border-2 border-[#B3261E] text-[#B3261E] font-mono text-sm font-bold uppercase -rotate-3">
              ADMITTED // 4.6 GA
            </div>
          </div>
        </div>
      </TiltedCard>

      {/* Action Buttons with React Bits Magnet & ClickSpark */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Magnet padding={25} magnetStrength={0.2} className="w-full sm:flex-1">
          <ClickSpark sparkColor="#0E0E0E" sparkCount={8} className="w-full">
            <button
              onClick={handleDownloadPNG}
              className="w-full py-3 bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] border-2 border-[#0E0E0E] shadow-[4px_4px_0_#0E0E0E] font-space font-bold text-xs uppercase tracking-wider transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#0E0E0E] cursor-pointer"
            >
              <ShinyText text="🎟️ DOWNLOAD TICKET STUB (PNG)" speed={3} shimmerColor="rgba(14, 14, 14, 0.85)" />
            </button>
          </ClickSpark>
        </Magnet>

        <Magnet padding={25} magnetStrength={0.2} className="w-full sm:w-auto">
          <ClickSpark sparkColor="#FFD400" sparkCount={6} className="w-full">
            <button
              onClick={handleCopyLink}
              className="w-full px-6 py-3 bg-white hover:bg-[#F2EDE4] text-[#0E0E0E] border-2 border-[#0E0E0E] shadow-[4px_4px_0_#0E0E0E] font-mono font-bold text-xs uppercase tracking-wider transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#0E0E0E] cursor-pointer"
            >
              {copied ? '✓ COPIED LINK' : '🔗 SHARE EXHIBITION'}
            </button>
          </ClickSpark>
        </Magnet>
      </div>
    </div>
  );
}
