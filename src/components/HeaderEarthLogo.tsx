'use client';

import React from 'react';

export function HeaderEarthLogo() {
  return (
    <div
      className="w-8 h-8 relative rounded-full overflow-hidden border-2 border-[#0E0E0E] bg-[#0E0E0E] shadow-[0_0_8px_rgba(255,212,0,0.4)] flex items-center justify-center select-none shrink-0"
      title="MUSEO Deep-Time Chrono-Terra Engine"
    >
      {/* Animated Mini Continental Geo-Sphere */}
      <svg
        className="w-5 h-5 text-[#FFD400] animate-[spin_16s_linear_infinite]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" stroke="#FFD400" strokeWidth="1.5" />
        <path
          d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20"
          stroke="#FFD400"
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />
        <circle cx="12" cy="12" r="3" fill="#FFD400" fillOpacity="0.4" />
      </svg>
      {/* Subtle Specular Glint */}
      <div className="absolute top-0.5 left-1 w-2.5 h-1.5 bg-white/40 rounded-full rotate-[-45deg] pointer-events-none" />
    </div>
  );
}
