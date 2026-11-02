'use client';

import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Scene converted to compressed Draco binary GLB (1.3MB)
// Note: Lazy loading on demand - loaded with Draco decoder
interface AntikytheraModelProps {
  factor?: number;
  [key: string]: any;
}

export function AntikytheraModel({ factor = 0.5, ...props }: AntikytheraModelProps) {
  const { scene } = useGLTF('/models/scene.glb', '/draco/');
  // Clone to prevent shared-state side effects across multiple renders
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { viewport } = useThree();
  const innerGroupRef = useRef<THREE.Group>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);

  // Normalize bounding box size to fit cleanly
  React.useLayoutEffect(() => {
    if (!clonedScene) return;
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z);

    if (maxDimension > 0 && innerGroupRef.current) {
      const normalizedScale = 1 / maxDimension;
      innerGroupRef.current.scale.set(normalizedScale, normalizedScale, normalizedScale);
    }
  }, [clonedScene]);

  // Autorotate
  useFrame((_, delta) => {
    if (rotationGroupRef.current) {
      rotationGroupRef.current.rotation.y += delta * 0.15;
    }
  });

  const targetScale = Math.min(viewport.width, viewport.height) * factor;

  return (
    <group ref={rotationGroupRef} {...props}>
      <group scale={[targetScale, targetScale, targetScale]}>
        <group ref={innerGroupRef}>
          <primitive object={clonedScene} />
        </group>
      </group>
    </group>
  );
}
