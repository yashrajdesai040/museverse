'use client';

import React, { forwardRef, useMemo, useLayoutEffect, useRef, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   OPTIMIZED EARTH MODEL LOADER
   Meets Guardrail Rule 2:
   - Configures Draco decoder offloading for compressed GLB assets.
   - Provides an immediate low-poly procedural fallback during network fetch.
   - Automatically normalizes bounding box scales to 1 unit.
   ═══════════════════════════════════════════════════════ */

const MODEL_PATH = '/models/little_planet_earth.glb';
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

// Preload with Draco decoder
useGLTF.preload(MODEL_PATH, DRACO_DECODER_PATH);

interface EarthModelProps {
  factor?: number;
  [key: string]: any;
}

// Low-poly lightweight sphere fallback during asset download
function LowPolyEarthFallback({ size }: { size: number }) {
  return (
    <mesh scale={[size, size, size]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#0055ff" roughness={0.6} wireframe />
    </mesh>
  );
}

function EarthMeshContent({
  innerGroupRef,
}: {
  innerGroupRef: React.RefObject<THREE.Group | null>;
}) {
  const { scene } = useGLTF(MODEL_PATH, DRACO_DECODER_PATH);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useLayoutEffect(() => {
    if (!clonedScene) return;

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDimension = Math.max(size.x, size.y, size.z);

    if (maxDimension > 0 && innerGroupRef.current) {
      const normalizedScale = 1 / maxDimension;
      innerGroupRef.current.scale.set(normalizedScale, normalizedScale, normalizedScale);
    }
  }, [clonedScene, innerGroupRef]);

  return (
    <group ref={innerGroupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

export const EarthModel = forwardRef<THREE.Group, EarthModelProps>(function EarthModel(
  { factor = 0.45, ...props },
  ref
) {
  const { viewport } = useThree();
  const innerGroupRef = useRef<THREE.Group>(null);
  const targetSize = Math.min(viewport.width, viewport.height) * factor;

  return (
    <group ref={ref} {...props}>
      <group scale={[targetSize, targetSize, targetSize]}>
        <Suspense fallback={<LowPolyEarthFallback size={1} />}>
          <EarthMeshContent innerGroupRef={innerGroupRef} />
        </Suspense>
      </group>
    </group>
  );
});
