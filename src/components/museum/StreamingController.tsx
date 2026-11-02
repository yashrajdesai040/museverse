'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export interface StreamingExhibitTarget {
  id: string;
  pos: [number, number, number];
}

interface StreamingControllerProps {
  exhibits: StreamingExhibitTarget[];
  setPreviewIds: (ids: string[]) => void;
  isMobile?: boolean;
  selectedId?: string | null;
}

const _tempCamPos = new THREE.Vector3();

export default function StreamingController({
  exhibits,
  setPreviewIds,
  isMobile = false,
  selectedId = null,
}: StreamingControllerProps) {
  const camera = useThree((state) => state.camera);

  const points = useMemo(() => {
    return exhibits.map((item) => ({
      id: item.id,
      position: new THREE.Vector3(...item.pos),
    }));
  }, [exhibits]);

  const previousIds = useRef<string[]>([]);
  const lastSignature = useRef<string>('');

  // Dynamically allocate budget: fewer previews when viewing a high-detail exhibit
  const maxModels = selectedId ? (isMobile ? 2 : 6) : (isMobile ? 4 : 10);
  const enterDistance = isMobile ? 18 : 28;
  const exitDistance = isMobile ? 24 : 36;

  useFrame(() => {
    camera.getWorldPosition(_tempCamPos);
    const previous = new Set(previousIds.current);

    const visible = points
      .map((item) => ({
        id: item.id,
        distance: _tempCamPos.distanceTo(item.position),
      }))
      .filter((item) => {
        const limit = previous.has(item.id) ? exitDistance : enterDistance;
        return item.distance < limit;
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxModels)
      .map((item) => item.id);

    const signature = visible.join(',');
    if (signature !== lastSignature.current) {
      lastSignature.current = signature;
      previousIds.current = visible;
      setPreviewIds(visible);
    }
  });

  return null;
}
