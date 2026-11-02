'use client';

import React, { Suspense, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useMuseumGLTF } from './MuseumAssetLoader';
import { retainGLTF } from '@/utils/disposeGLTF';
import { MuseumExhibitData } from '@/data/museumExhibits';

/**
 * LoadedModel: Uses useMuseumGLTF with Draco + KTX2 + Meshopt.
 * Automatically hooks into retainGLTF for reference-counted GPU resource disposal.
 */
export function LoadedModel({
  url,
  scale = [1, 1, 1],
}: {
  url: string;
  scale?: [number, number, number] | number;
}) {
  const { scene } = useMuseumGLTF(url);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        // Disable expensive pointermove raycasting on heavy meshes
        child.raycast = () => null;
        child.frustumCulled = true;
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    return retainGLTF(url, scene);
  }, [url, scene]);

  return <primitive object={clonedScene} scale={scale} dispose={null} />;
}

/**
 * Lightweight procedural fallback proxy displayed when exhibit is beyond streaming distance.
 */
export function ExhibitProxy({
  onClick,
  accentColor = '#e0701a',
}: {
  onClick?: (e: any) => void;
  accentColor?: string;
}) {
  return (
    <group position={[0, 0.4, 0]} onClick={onClick}>
      <mesh raycast={() => null}>
        <octahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color={accentColor}
          roughness={0.7}
          metalness={0.3}
          wireframe
        />
      </mesh>
      <mesh raycast={() => null}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#ffffff" emissive={accentColor} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

/**
 * StreamingExhibitModel:
 * The 3-tier SmartScene LOD engine:
 * 1. If selected & highUrl -> streams High-Detail original GLB
 * 2. If previewActive & previewUrl -> streams Lightweight Preview GLB
 * 3. Else -> Fallback ExhibitProxy (Zero GPU memory overhead)
 */
export function StreamingExhibitModel({
  item,
  previewActive,
  selected,
  onSelect,
  customProxy,
}: {
  item: MuseumExhibitData;
  previewActive: boolean;
  selected: boolean;
  onSelect?: (id: string) => void;
  customProxy?: React.ReactNode;
}) {
  const handleClick = (e: any) => {
    if (e.delta !== undefined && e.delta > 6) return;
    e.stopPropagation();
    onSelect?.(item.id);
  };

  const fallback = customProxy || (
    <ExhibitProxy onClick={handleClick} accentColor={item.accentColor} />
  );

  if (selected && item.highUrl) {
    return (
      <Suspense fallback={fallback}>
        <LoadedModel url={item.highUrl} scale={item.scale} />
      </Suspense>
    );
  }

  if (previewActive && item.previewUrl) {
    return (
      <Suspense fallback={fallback}>
        <LoadedModel url={item.previewUrl} scale={item.scale} />
      </Suspense>
    );
  }

  return <>{fallback}</>;
}

/**
 * MuseumExhibit:
 * Full exhibition stand component including pedestal plinth, model mount, and interaction handlers.
 */
export default function MuseumExhibit({
  item,
  previewActive,
  selected,
  onSelect,
}: {
  item: MuseumExhibitData;
  previewActive: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const handleSelect = (event: any) => {
    if (event.delta !== undefined && event.delta > 6) return;
    event.stopPropagation();
    onSelect(item.id);
  };

  return (
    <group position={item.pos}>
      {/* Plinth / Showcase base */}
      <mesh position={[0, 0.35, 0]} onClick={handleSelect}>
        <cylinderGeometry args={[0.9, 1.05, 0.7, 32]} />
        <meshStandardMaterial color="#1a1c23" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Decorative brass accent ring */}
      <mesh position={[0, 0.71, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.04, 32]} />
        <meshStandardMaterial color={selected ? '#ffd700' : '#8c734b'} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Model mounting point */}
      <group position={[0, item.yOffset, 0]}>
        <StreamingExhibitModel
          item={item}
          previewActive={previewActive}
          selected={selected}
          onSelect={onSelect}
        />
      </group>
    </group>
  );
}
