'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ChronoTerraGlobe } from './ChronoTerraGlobe';

function PlanetaryLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05060a] text-white z-0 font-mono">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
        <span className="text-xs uppercase tracking-widest font-bold">
          INITIALIZING CHRONO-TERRA ENGINE...
        </span>
      </div>
      <span className="text-[10px] text-neutral-500 mt-2 font-mono">
        COMPUTING 4.54 BILLION YEARS OF PLANETARY DYNAMICS
      </span>
    </div>
  );
}

export function PlanetaryCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#030306]">
      <Suspense fallback={<PlanetaryLoader />}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 7.2], fov: 42, near: 0.1, far: 500 }}
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
            alpha: false,
            stencil: false,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
          onCreated={({ gl }) => {
            gl.debug.checkShaderErrors = false;
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ChronoTerraGlobe />
        </Canvas>
      </Suspense>
    </div>
  );
}
