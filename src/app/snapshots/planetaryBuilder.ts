import * as THREE from 'three';

export interface PlanetaryVisualConfig {
  oceanColor: number;
  landColor: number;
  cloudColor: number;
  atmosphereColor: number;
  hasIceCaps: boolean;
  roughness: number;
  metalness: number;
  magmaGlow?: boolean;
  ringsOrDebris?: boolean;
}

export const PLANETARY_STAGE_CONFIGS: Record<string, PlanetaryVisualConfig> = {
  'stage-01-hadean': {
    oceanColor: 0x110200,
    landColor: 0x240602,
    cloudColor: 0x6e1b00,
    atmosphereColor: 0xff3b00,
    hasIceCaps: false,
    roughness: 0.9,
    metalness: 0.1,
    magmaGlow: true,
    ringsOrDebris: true,
  },
  'stage-02-archean': {
    oceanColor: 0x0a3d34, // Iron-rich acidic green ocean
    landColor: 0x1c1e19, // Basaltic volcanic cratons
    cloudColor: 0x5a7062,
    atmosphereColor: 0x208065,
    hasIceCaps: false,
    roughness: 0.8,
    metalness: 0.05,
  },
  'stage-03-proterozoic': {
    oceanColor: 0x0d2847,
    landColor: 0xe6eef8, // Glacial Snowball Earth
    cloudColor: 0xffffff,
    atmosphereColor: 0x6eb4e6,
    hasIceCaps: true,
    roughness: 0.4,
    metalness: 0.15,
  },
  'stage-04-cambrian': {
    oceanColor: 0x064e66,
    landColor: 0x8a6a4b, // Barren land, thriving shallow epicontinental seas
    cloudColor: 0xddeef8,
    atmosphereColor: 0x38bdf8,
    hasIceCaps: false,
    roughness: 0.6,
    metalness: 0.05,
  },
  'stage-05-carboniferous': {
    oceanColor: 0x083344,
    landColor: 0x064e3b, // Lush hyper-oxygenated swamp superforests
    cloudColor: 0xf0fdf4,
    atmosphereColor: 0x34d399,
    hasIceCaps: true,
    roughness: 0.7,
    metalness: 0.05,
  },
  'stage-06-mesozoic': {
    oceanColor: 0x0369a1, // Pangean Tethys Ocean
    landColor: 0xb45309, // Arid interior + lush coastal gymnosperms
    cloudColor: 0xf8fafc,
    atmosphereColor: 0x0284c7,
    hasIceCaps: false,
    roughness: 0.65,
    metalness: 0.05,
  },
  'stage-07-cenozoic': {
    oceanColor: 0x0284c7,
    landColor: 0x4d7c0f,
    cloudColor: 0xffffff,
    atmosphereColor: 0x38bdf8,
    hasIceCaps: true,
    roughness: 0.55,
    metalness: 0.05,
  },
  'stage-08-anthropocene': {
    oceanColor: 0x0077b6,
    landColor: 0x2d6a4f,
    cloudColor: 0xffffff,
    atmosphereColor: 0x00b4d8,
    hasIceCaps: true,
    roughness: 0.5,
    metalness: 0.08,
  },
};

export function buildPlanetaryStageGroup(stageId: string): THREE.Group {
  const root = new THREE.Group();
  const config = PLANETARY_STAGE_CONFIGS[stageId] || PLANETARY_STAGE_CONFIGS['stage-08-anthropocene'];

  // Base Planet Sphere
  const planetGeo = new THREE.SphereGeometry(1.6, 48, 48);
  const planetMat = new THREE.MeshStandardMaterial({
    color: config.oceanColor,
    roughness: config.roughness,
    metalness: config.metalness,
  });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  root.add(planet);

  // Continental Landmasses (procedural patches)
  const landMat = new THREE.MeshStandardMaterial({
    color: config.landColor,
    roughness: 0.9,
    metalness: 0.02,
  });

  const numPatches = stageId === 'stage-01-hadean' ? 4 : 8;
  for (let i = 0; i < numPatches; i++) {
    const phi = (i / numPatches) * Math.PI;
    const theta = (i * 1.618 * 2) * Math.PI;
    const x = 1.6 * Math.sin(phi) * Math.cos(theta);
    const y = 1.6 * Math.cos(phi);
    const z = 1.6 * Math.sin(phi) * Math.sin(theta);

    const patchGeo = new THREE.DodecahedronGeometry(0.55 + (i % 3) * 0.15, 1);
    const patch = new THREE.Mesh(patchGeo, landMat);
    patch.position.set(x, y, z);
    patch.lookAt(x * 2, y * 2, z * 2);
    patch.scale.z = 0.12;
    root.add(patch);
  }

  // Magma fissures for Hadean
  if (config.magmaGlow) {
    const fissureMat = new THREE.MeshBasicMaterial({ color: 0xff4500 });
    for (let j = 0; j < 6; j++) {
      const fissure = new THREE.Mesh(new THREE.TorusGeometry(1.61, 0.03, 8, 32), fissureMat);
      fissure.rotation.x = j * 0.5;
      fissure.rotation.y = j * 0.8;
      root.add(fissure);
    }
  }

  // Atmospheric Cloud Layer
  const cloudGeo = new THREE.SphereGeometry(1.64, 32, 32);
  const cloudMat = new THREE.MeshStandardMaterial({
    color: config.cloudColor,
    transparent: true,
    opacity: 0.35,
    roughness: 1.0,
  });
  const clouds = new THREE.Mesh(cloudGeo, cloudMat);
  root.add(clouds);

  // Outer Atmospheric Glow Halo
  const haloGeo = new THREE.SphereGeometry(1.78, 32, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: config.atmosphereColor,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  root.add(halo);

  return root;
}
