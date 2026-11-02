'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface CardHoverEffectItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  badge?: string;
  icon?: string;
  age?: string;
}

export function CardHoverEffect({
  items,
  className = '',
  onSelect,
}: {
  items: CardHoverEffectItem[];
  className?: string;
  onSelect?: (item: CardHoverEffectItem) => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-6 gap-6 ${className}`}
    >
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative group block p-2 h-full w-full cursor-pointer"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onSelect?.(item)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-[#FFD400] block border-3 border-[#0E0E0E] shadow-[6px_6px_0px_#0E0E0E]"
                layoutId="hoverBackground"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.15, ease: 'easeOut' },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  transition: { duration: 0.15, ease: 'easeIn' },
                }}
              />
            )}
          </AnimatePresence>

          <div className="relative z-10 bg-[#F2EDE4] text-[#0E0E0E] border-3 border-[#0E0E0E] p-6 shadow-[4px_4px_0_#0E0E0E] h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b-2 border-[#0E0E0E] pb-2 font-mono text-xs">
                <span className="font-bold text-[#0E0E0E] uppercase">{item.badge || 'SPECIMEN'}</span>
                <span className="text-[#0E0E0E]/60 font-bold">{item.age || 'DEEP TIME'}</span>
              </div>
              <h4 className="font-space text-xl font-bold uppercase tracking-tight text-[#0E0E0E] mb-2">
                {item.title}
              </h4>
              <p className="font-space text-xs text-[#0E0E0E]/80 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-[#0E0E0E]/20 flex items-center justify-between font-mono text-[11px] font-bold">
              <span>EXPLORE SPECIMEN</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardHoverEffect;
