'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { ModelLoader } from './ModelLoader';

interface CanvasShellProps {
  children?: React.ReactNode;
}

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black z-0">
      <ModelLoader
        label="INITIALIZING PLANETARY 3D ENGINE..."
        theme="dark"
        className="w-full h-full"
      />
    </div>
  );
}

export function CanvasShell({ children }: CanvasShellProps) {
  const [dpr, setDpr] = React.useState<[number, number]>([1, 1.5]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black z-0 pointer-events-auto">
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 2, 14], fov: 45, near: 0.1, far: 500 }}
          dpr={dpr}
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
            alpha: false,
            stencil: false,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          className="w-full h-full"
        >
          <PerformanceMonitor
            onDecline={() => setDpr([1, 1])}
            onIncline={() => setDpr([1, 1.5])}
          >
            <AdaptiveDpr pixelated={false} />
            {children}
          </PerformanceMonitor>
        </Canvas>
      </Suspense>
    </div>
  );
}
