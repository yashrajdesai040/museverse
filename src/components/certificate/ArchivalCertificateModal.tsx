'use client';

import React, { useRef, useState, useEffect } from 'react';
import { MuseumEntity } from '@/types/museum';
import { useGlobalSound } from '@/hooks/useGlobalSound';

interface ArchivalCertificateModalProps {
  entity: MuseumEntity;
  isOpen: boolean;
  onClose: () => void;
  snapshotDataUrl?: string | null;
}

export function ArchivalCertificateModal({
  entity,
  isOpen,
  onClose,
  snapshotDataUrl,
}: ArchivalCertificateModalProps) {
  const { playClick, playStamp, playChime } = useGlobalSound();
  const [isMinting, setIsMinting] = useState(false);
  const [certSerial, setCertSerial] = useState('');
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      playStamp();
      const randHex = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .toUpperCase()
        .padStart(6, '0');
      setCertSerial(`MUSEO-${entity.id.toUpperCase().slice(0, 8)}-${randHex}`);
    }
  }, [isOpen, entity.id, playStamp]);

  if (!isOpen) return null;

  const ageLabel =
    entity.yearsAgo >= 1_000_000_000
      ? `${(entity.yearsAgo / 1_000_000_000).toFixed(2)} Billion Years Ago`
      : entity.yearsAgo >= 1_000_000
      ? `${(entity.yearsAgo / 1_000_000).toFixed(1)} Million Years Ago`
      : `${entity.yearsAgo.toLocaleString()} Years Ago`;

  const handleDownloadPNG = async () => {
    setIsMinting(true);
    playClick();

    try {
      const width = 1600;
      const height = 1100;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // 1. Parchment Background
      ctx.fillStyle = '#f8f5ee';
      ctx.fillRect(0, 0, width, height);

      // Subtle parchment aging vignette
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.2,
        width / 2,
        height / 2,
        width * 0.75
      );
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(1, 'rgba(210,195,170,0.4)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ornate Double Guilloché Border
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 14;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      ctx.lineWidth = 3;
      ctx.strokeRect(52, 52, width - 104, height - 104);

      // Gold Accent Inner Inset
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      ctx.strokeRect(62, 62, width - 124, height - 124);

      // Corner Corner-Marks
      const corners = [
        [75, 75],
        [width - 75, 75],
        [75, height - 75],
        [width - 75, height - 75],
      ];
      ctx.fillStyle = '#d4af37';
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Header Typography
      ctx.fillStyle = '#111111';
      ctx.textAlign = 'center';

      ctx.font = 'bold 22px monospace';
      ctx.letterSpacing = '6px';
      ctx.fillText('MUSEUM OF PLANETARY HISTORY • CENTRAL SPECIMEN REPOSITORY', width / 2, 125);

      ctx.font = 'bold 44px Georgia, serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('CERTIFICATE OF ARCHIVAL AUTHENTICITY', width / 2, 185);

      ctx.font = 'italic 18px Georgia, serif';
      ctx.fillStyle = '#555555';
      ctx.fillText(
        'Curatorial Verification of Chronometric Stratigraphy & Primary Provenance',
        width / 2,
        220
      );

      // Horizontal Divider
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(140, 245);
      ctx.lineTo(width - 140, 245);
      ctx.stroke();

      // 4. Specimen Image Box (Left)
      const imgX = 110;
      const imgY = 280;
      const imgW = 540;
      const imgH = 540;

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(imgX, imgY, imgW, imgH);
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 4;
      ctx.strokeRect(imgX, imgY, imgW, imgH);

      if (snapshotDataUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = () => {
            // Draw image fitted
            ctx.drawImage(img, imgX + 10, imgY + 10, imgW - 20, imgH - 20);
            resolve(true);
          };
          img.onerror = () => resolve(false);
          img.src = snapshotDataUrl;
        });
      } else {
        // Fallback Specimen Blueprint
        ctx.strokeStyle = '#00f7ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(imgX + imgW / 2, imgY + imgH / 2, 140, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('3D SPECIMEN SCAN CAPTURE', imgX + imgW / 2, imgY + imgH / 2 + 8);
      }

      // 5. Specimen Attributes (Right Column)
      const textX = 700;
      let curY = 320;

      ctx.textAlign = 'left';
      ctx.fillStyle = '#888888';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('SPECIMEN RECORD IDENTIFIER', textX, curY);

      curY += 38;
      ctx.fillStyle = '#111111';
      ctx.font = 'bold 36px Georgia, serif';
      ctx.fillText(entity.name, textX, curY);

      curY += 28;
      ctx.fillStyle = '#b8860b';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`EPOCH: ${entity.periodLabel.toUpperCase()} • ${entity.category.toUpperCase()}`, textX, curY);

      curY += 45;
      ctx.strokeStyle = '#e0d8c8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(textX, curY - 15);
      ctx.lineTo(width - 120, curY - 15);
      ctx.stroke();

      const drawDataRow = (label: string, value: string) => {
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#666666';
        ctx.fillText(label.toUpperCase(), textX, curY);

        ctx.font = 'bold 18px Georgia, serif';
        ctx.fillStyle = '#111111';
        ctx.fillText(value, textX + 250, curY);

        curY += 38;
      };

      drawDataRow('Absolute Chronology', ageLabel);
      drawDataRow('Discovery Site', entity.placeOfDiscovery || entity.currentLocation || 'Unknown Coordinates');
      drawDataRow('Physical Material', entity.material || 'Fossilized Mineral Matrix');
      drawDataRow('Curatorial Location', entity.currentLocation);
      drawDataRow('Provenance Authority', 'Museum of Planetary History Archive');
      drawDataRow('Stratigraphic Status', 'Class-A Primary Verified Specimen');

      // 6. Security Seal & Signatures
      const footerY = 880;

      // Golden Wax Museum Stamp Seal
      const sealX = 380;
      const sealY = footerY + 60;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 68, 0, Math.PI * 2);
      ctx.fillStyle = '#d4af37';
      ctx.fill();
      ctx.strokeStyle = '#997a15';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#111111';
      ctx.textAlign = 'center';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('MUSEO ARCHIVE', sealX, sealY - 18);
      ctx.font = 'bold 18px Georgia, serif';
      ctx.fillText('★ VERIFIED ★', sealX, sealY + 2);
      ctx.font = 'bold 10px monospace';
      ctx.fillText('MMXXVI • GENUINE', sealX, sealY + 22);

      // Left Signature
      const sig1X = 750;
      ctx.textAlign = 'left';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sig1X, footerY + 70);
      ctx.lineTo(sig1X + 280, footerY + 70);
      ctx.stroke();

      ctx.font = 'italic 24px Georgia, serif';
      ctx.fillStyle = '#1a1a55';
      ctx.fillText('Dr. Aris Hayes', sig1X + 30, footerY + 55);

      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#444444';
      ctx.fillText('DR. ARIS HAYES, CHIEF PALEONTOLOGIST', sig1X, footerY + 95);

      // Right Signature
      const sig2X = 1120;
      ctx.beginPath();
      ctx.moveTo(sig2X, footerY + 70);
      ctx.lineTo(sig2X + 280, footerY + 70);
      ctx.stroke();

      ctx.font = 'italic 24px Georgia, serif';
      ctx.fillStyle = '#1a1a55';
      ctx.fillText('Elena Rostova', sig2X + 30, footerY + 55);

      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#444444';
      ctx.fillText('ELENA ROSTOVA, HEAD OF CONSERVATION', sig2X, footerY + 95);

      // Certificate Serial Barcode text
      ctx.textAlign = 'center';
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#777777';
      ctx.fillText(`SECURITY VERIFICATION SERIAL: ${certSerial} • EMITTED ON PLANETARY DATA BUS`, width / 2, height - 58);

      // Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `MUSEO_ARCHIVAL_CERTIFICATE_${entity.id.toUpperCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      playChime();
      setDownloadReady(true);
    } catch (err) {
      console.error('Failed to generate archival certificate:', err);
    } finally {
      setIsMinting(false);
    }
  };

  const handlePrint = () => {
    playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#f8f5ee] text-[#1a1a1a] border-4 border-black shadow-[16px_16px_0px_#000] my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Certificate Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-black text-[#ffd700] border-b-3 border-black">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#ffd700] rounded-full inline-block animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest">
              OFFICIAL ARCHIVAL SPECIMEN CERTIFICATE
            </span>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center bg-[#ffd700] text-black font-bold font-mono hover:bg-white transition-colors cursor-pointer border border-black shadow-[2px_2px_0px_#fff]"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Certificate Document Body */}
        <div className="p-6 sm:p-10 font-serif">
          {/* Inner Ornate Border */}
          <div className="border-2 border-[#d4af37] p-6 sm:p-8 bg-[#fdfbf7] relative shadow-inner">
            {/* Top Emblem */}
            <div className="text-center mb-6">
              <div className="inline-block px-4 py-1 bg-black text-[#ffd700] font-mono text-[11px] font-bold uppercase tracking-widest border border-black shadow-[2px_2px_0px_#000] mb-3">
                REGISTRY ID: {certSerial}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black font-outfit uppercase tracking-tight">
                Certificate of Curatorial Provenance
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-serif italic mt-1">
                Issued by the Curatorial Directorate of the Museum of Planetary History
              </p>
              <div className="w-32 h-0.5 bg-[#d4af37] mx-auto mt-3" />
            </div>

            {/* Specimen Snapshot & Attributes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
              {/* Snapshot Frame */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="w-full aspect-square bg-[#0a0a0a] border-3 border-black shadow-[6px_6px_0px_#000] relative overflow-hidden flex items-center justify-center group">
                  {snapshotDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={snapshotDataUrl}
                      alt={entity.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#00f7ff] mx-auto flex items-center justify-center text-[#00f7ff] text-2xl font-mono mb-2">
                        ✦
                      </div>
                      <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                        3D Specimen Hologram
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/80 border border-neutral-700 font-mono text-[9px] text-[#ffd700] flex justify-between">
                    <span>POLYGON RATIO: 1:1</span>
                    <span>VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Specimen Provenance Details */}
              <div className="md:col-span-7 font-mono text-xs">
                <div className="mb-4">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                    REGISTERED SPECIMEN
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold font-outfit text-black uppercase">
                    {entity.name}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-[#ffd700] text-black font-bold text-[10px] border border-black">
                      {entity.periodLabel}
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-200 text-neutral-800 font-bold text-[10px] border border-neutral-400">
                      {entity.category}
                    </span>
                  </div>
                </div>

                <dl className="space-y-2.5 border-t border-neutral-300 pt-3">
                  <div className="flex justify-between border-b border-neutral-200 pb-1">
                    <dt className="text-neutral-500 font-bold uppercase">Chronology:</dt>
                    <dd className="font-bold text-black">{ageLabel}</dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200 pb-1">
                    <dt className="text-neutral-500 font-bold uppercase">Discovery Site:</dt>
                    <dd className="font-bold text-black text-right truncate max-w-[200px]">
                      {entity.placeOfDiscovery || entity.currentLocation || 'Planetary Crust'}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200 pb-1">
                    <dt className="text-neutral-500 font-bold uppercase">Material Matrix:</dt>
                    <dd className="font-bold text-black text-right truncate max-w-[200px]">
                      {entity.material || 'Fossilized Mineral Matrix'}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200 pb-1">
                    <dt className="text-neutral-500 font-bold uppercase">Repository Hall:</dt>
                    <dd className="font-bold text-black">{entity.currentLocation}</dd>
                  </div>
                  <div className="flex justify-between pb-1">
                    <dt className="text-neutral-500 font-bold uppercase">Archival Seal:</dt>
                    <dd className="font-bold text-emerald-700">CLASS-A VERIFIED SPECIMEN</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Curatorial Attestation Signatures & Seal */}
            <div className="mt-8 pt-6 border-t-2 border-[#d4af37] flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Wax Seal */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#b8860b] via-[#ffd700] to-[#d4af37] border-3 border-black shadow-[3px_3px_0px_#000] flex flex-col items-center justify-center text-center p-1 font-mono text-[8px] font-extrabold text-black">
                  <span>★ MUSEO ★</span>
                  <span className="text-[10px] font-black">SEAL</span>
                  <span>2026</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] font-bold uppercase text-black">
                    Radiocarbon Calibration
                  </span>
                  <span className="block font-serif text-xs text-neutral-600 italic">
                    Certified 100% Provenance
                  </span>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex gap-8 text-center font-serif text-xs">
                <div>
                  <div className="font-serif italic text-lg text-blue-900 border-b border-black pb-1 px-4">
                    Dr. Aris Hayes
                  </div>
                  <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mt-1 block">
                    Chief Paleontologist
                  </span>
                </div>
                <div>
                  <div className="font-serif italic text-lg text-blue-900 border-b border-black pb-1 px-4">
                    Elena Rostova
                  </div>
                  <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mt-1 block">
                    Director of Diagnostics
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Actions Bar */}
        <div className="px-6 py-4 bg-neutral-100 border-t-3 border-black flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-xs text-neutral-600">
            {downloadReady ? '✓ Archival Certificate downloaded to your system.' : 'Official Archival Specimen Document'}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold uppercase border-2 border-black shadow-[3px_3px_0px_#000] transition-transform active:translate-y-0.5 cursor-pointer"
            >
              🖨️ Print
            </button>
            <button
              onClick={handleDownloadPNG}
              disabled={isMinting}
              className="px-6 py-2.5 bg-black hover:bg-[#ffd700] text-[#ffd700] hover:text-black font-mono text-xs font-bold uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] transition-all active:translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <span>{isMinting ? '⏳ Rendering 1600px Certificate...' : '📥 Mint & Download Certificate (.PNG)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
