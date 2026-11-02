// MUSEO — Proximity-Based Asset & Memory Culling Engine
// Retains 3D models and heavy textures within a temporal radius of the active Ma,
// safely signaling when distant assets should be disposed to maintain 60 fps / strict memory budget.

import * as THREE from 'three';
import { EvolutionStageId } from './time';

export interface CullingCandidate {
  id: string;
  stageIds: EvolutionStageId[];
  ageMa?: number;
  modelUrl?: string;
}

/**
 * Computes whether an asset should be mounted or unmounted based on current era and temporal distance
 * @param candidate Entity or 3D asset metadata
 * @param currentStageId The currently active stage ID
 * @param currentMa Current geological time in Ma
 * @param temporalRadiusMa Maximum temporal distance in Ma before disposing (default 800 Ma)
 */
export function shouldRetainAsset(
  candidate: CullingCandidate,
  currentStageId: EvolutionStageId,
  currentMa: number,
  temporalRadiusMa = 800
): boolean {
  // If explicitly belongs to current stage, always retain
  if (candidate.stageIds.includes(currentStageId)) {
    return true;
  }

  // If ageMa is provided, check temporal distance
  if (candidate.ageMa !== undefined) {
    const distance = Math.abs(candidate.ageMa - currentMa);
    return distance <= temporalRadiusMa;
  }

  return false;
}

/**
 * Safe disposal helper for Three.js meshes, materials, and geometries
 */
export function safelyDisposeObject3D(object: THREE.Object3D) {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => safelyDisposeMaterial(mat));
        } else {
          safelyDisposeMaterial(mesh.material);
        }
      }
    }
  });
}

function safelyDisposeMaterial(mat: THREE.Material) {
  mat.dispose();
  // Dispose all attached texture maps
  for (const key of Object.keys(mat)) {
    const val = (mat as unknown as Record<string, unknown>)[key];
    if (val && typeof val === 'object' && (val as THREE.Texture).isTexture) {
      (val as THREE.Texture).dispose();
    }
  }
}
