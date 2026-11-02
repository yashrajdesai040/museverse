'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export function BentoGrid({ className = '', children }: BentoGridProps) {
  return (
    <div
      className={`grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </div>
  );
}

export interface BentoGridItemProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
}

export function BentoGridItem({
  className = '',
  title,
  description,
  header,
  icon,
  badge,
  onClick,
}: BentoGridItemProps) {
  return (
    <motion.div
      whileHover={{ y: -4, x: -2 }}
      whileTap={{ y: 2, x: 1 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`row-span-1 border-3 border-[#0E0E0E] bg-[#F2EDE4] text-[#0E0E0E] shadow-[6px_6px_0px_#0E0E0E] hover:shadow-[10px_10px_0px_#0E0E0E] p-5 flex flex-col justify-between space-y-4 cursor-pointer select-none transition-shadow ${className}`}
    >
      {header && <div className="w-full flex-1 overflow-hidden relative">{header}</div>}

      <div className="transition duration-200">
        <div className="flex items-center justify-between mb-2">
          {icon}
          {badge}
        </div>
        <div className="font-space font-bold text-xl uppercase tracking-tight text-[#0E0E0E] mb-1">
          {title}
        </div>
        <div className="font-space text-xs text-[#0E0E0E]/70 line-clamp-2 leading-relaxed font-normal">
          {description}
        </div>
      </div>
    </motion.div>
  );
}

export default BentoGrid;
