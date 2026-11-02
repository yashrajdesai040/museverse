'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { useAppStore } from '@/stores/useAppStore';

interface HotspotMarkerProps {
  position: [number, number, number];
  label: string;
  linkedEntityId?: string;
  description?: string;
}

export function HotspotMarker({ position, label, linkedEntityId, description }: HotspotMarkerProps) {
  const openEntityModal = useAppStore((s) => s.openEntityModal);

  return (
    <Html position={position} center distanceFactor={15}>
      <div className="group relative flex items-center gap-2 pointer-events-auto">
        {/* Pulsing Yellow Square Marker */}
        <button
          onClick={() => linkedEntityId && openEntityModal(linkedEntityId)}
          className="relative w-5 h-5 bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_#000] hover:scale-125 transition-transform flex items-center justify-center cursor-pointer"
          title={label}
        >
          <span className="w-2 h-2 bg-black" />
          {/* Pulsing Outer Border */}
          <span className="absolute -inset-1 border-2 border-yellow-400 animate-ping opacity-75 pointer-events-none" />
        </button>

        {/* Floating Brutalist Label */}
        <div className="hidden group-hover:flex flex-col bg-black text-white p-2 border-2 border-yellow-400 shadow-[4px_4px_0px_#000] font-mono text-[10px] whitespace-nowrap z-30">
          <span className="text-yellow-400 font-bold uppercase">{label}</span>
          {description && <span className="text-neutral-400 text-[9px]">{description}</span>}
          {linkedEntityId && <span className="text-cyan-400 font-bold text-[9px] mt-1">Click to Inspect Record ↗</span>}
        </div>
      </div>
    </Html>
  );
}
