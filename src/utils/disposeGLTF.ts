import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * MUSEO SmartScene GPU Resource Manager
 * Tracks active users per asset URL and performs deep GPU memory disposal
 * when an asset is no longer referenced by any mounted exhibit.
 */
const assetUsers = new Map<string, number>();
const cleanupTimers = new Map<string, NodeJS.Timeout>();

export function disposeScene(scene: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const skeletons = new Set<THREE.Skeleton>();

  scene.traverse((object: any) => {
    if (object.geometry && object.geometry.dispose) {
      geometries.add(object.geometry);
    }
    if (object.skeleton && object.skeleton.dispose) {
      skeletons.add(object.skeleton);
    }
    if (object.material) {
      const mats = Array.isArray(object.material) ? object.material : [object.material];
      mats.forEach((mat: any) => {
        if (!mat) return;
        materials.add(mat);
        // Traverse texture properties on material
        Object.keys(mat).forEach((key) => {
          const val = (mat as any)[key];
          if (val && val.isTexture) {
            textures.add(val);
          }
        });
      });
    }
  });

  // 1. Dispose all textures and close ImageBitmaps
  textures.forEach((texture) => {
    const image = (texture.source as any)?.data ?? texture.image;
    try {
      texture.dispose();
      if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) {
        image.close();
      }
    } catch {
      // Safe fallback
    }
  });

  // 2. Dispose materials
  materials.forEach((mat) => {
    try {
      mat.dispose();
    } catch {}
  });

  // 3. Dispose buffer geometries
  geometries.forEach((geom) => {
    try {
      geom.dispose();
    } catch {}
  });

  // 4. Dispose skeletons
  skeletons.forEach((skeleton) => {
    try {
      skeleton.dispose();
    } catch {}
  });
}

/**
 * Retains a GLTF asset in the scene with reference counting.
 * When the last consumer unmounts, a 300ms debounce timer starts.
 * If no new consumer mounts the asset within 300ms, it is fully purged
 * from both the Drei cache and GPU memory.
 */
export function retainGLTF(url: string, scene: THREE.Object3D): () => void {
  const timer = cleanupTimers.get(url);
  if (timer) {
    clearTimeout(timer);
    cleanupTimers.delete(url);
  }

  const currentCount = assetUsers.get(url) || 0;
  assetUsers.set(url, currentCount + 1);

  return () => {
    const remaining = Math.max(0, (assetUsers.get(url) || 1) - 1);
    assetUsers.set(url, remaining);

    if (remaining === 0) {
      const cleanup = setTimeout(() => {
        if ((assetUsers.get(url) || 0) === 0) {
          try {
            useGLTF.clear(url);
          } catch {}
          try {
            disposeScene(scene);
          } catch {}
          assetUsers.delete(url);
        }
        cleanupTimers.delete(url);
      }, 300);

      cleanupTimers.set(url, cleanup);
    }
  };
}
