'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEvolutionStore } from '@/stores/useEvolutionStore';

// ── 10 Keyframe Control Points for the Continuous -140u Deep-Time Stratigraphic Spline ──
const POSITION_POINTS = [
  new THREE.Vector3(0, 2, 14),       // t = 0.00: Primordial Ocean Abyss Panorama
  new THREE.Vector3(3.2, -0.8, 10.5),// t = 0.10: Hydrothermal Smoker Vent & Stromatolite Close-Up
  new THREE.Vector3(4.8, -18, 16.5), // t = 0.20: Plunging through Archean basalt strata
  new THREE.Vector3(3.8, -33, 12.5), // t = 0.30: Mesozoic Cretaceous Canopy & T-Rex Skull
  new THREE.Vector3(0.5, -52, 17.5), // t = 0.40: Approaching K-Pg Impact Atmospheric Horizon
  new THREE.Vector3(-3.2, -68, 13.5),// t = 0.50: Chicxulub Bolide & Supersonic Shockwave
  new THREE.Vector3(-1.8, -88, 16.5),// t = 0.60: Cooling through Cenozoic volcanic fallout
  new THREE.Vector3(3.5, -103, 12.5),// t = 0.70: Pleistocene Glacial Ice Canyon & Mammoth Tusks
  new THREE.Vector3(0, -124, 16.5),  // t = 0.85: Rising into Antiquity Light Sanctuary
  new THREE.Vector3(0, -139, 13.2),  // t = 1.00: Living Earth & Antiquity Relics Sanctuary
];

const LOOKAT_POINTS = [
  new THREE.Vector3(0, 0, 0),        // t = 0.00: Center of Primordial Ocean
  new THREE.Vector3(0.5, -1.2, 0),   // t = 0.10: Vent and Microbial Mat
  new THREE.Vector3(0, -25, 0),      // t = 0.20: Downward Strata Drill
  new THREE.Vector3(0, -35, 0),      // t = 0.30: T-Rex Skull Rostrum
  new THREE.Vector3(0, -60, 0),      // t = 0.40: Chicxulub Inbound Vector
  new THREE.Vector3(0, -70, 0),      // t = 0.50: Impact Core & Shockwave Center
  new THREE.Vector3(0, -95, 0),      // t = 0.60: Glacial Permafrost Basin
  new THREE.Vector3(0, -105, 0),     // t = 0.70: Woolly Mammoth Cranium
  new THREE.Vector3(0, -135, 0),     // t = 0.85: Golden Museum Portal
  new THREE.Vector3(0, -140, 0),     // t = 1.00: Living Earth Center
];

export function CameraRig() {
  const isReducedMotion = useRef(false);
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));
  const tempPos = useRef(new THREE.Vector3());
  const tempLook = useRef(new THREE.Vector3());

  const positionSpline = useMemo(() => {
    return new THREE.CatmullRomCurve3(POSITION_POINTS, false, 'catmullrom', 0.5);
  }, []);

  const lookAtSpline = useMemo(() => {
    return new THREE.CatmullRomCurve3(LOOKAT_POINTS, false, 'catmullrom', 0.5);
  }, []);

  useEffect(() => {
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useFrame((state, delta) => {
    const scrollProgress = useEvolutionStore.getState().scrollProgress;
    const clampedT = Math.max(0, Math.min(1, scrollProgress));

    // Sample the continuous Catmull-Rom spline curves
    positionSpline.getPoint(clampedT, tempPos.current);
    lookAtSpline.getPoint(clampedT, tempLook.current);

    // Subtle pointer parallax for physical depth
    if (!isReducedMotion.current) {
      const mouseX = state.pointer.x * 1.2;
      const mouseY = state.pointer.y * 0.7;
      tempPos.current.x += mouseX;
      tempPos.current.y += mouseY;
    }

    // Chicxulub Kinetic Shockwave Rumble (peaks around t = 0.48 - 0.54)
    if (!isReducedMotion.current) {
      const distFromImpact = Math.abs(clampedT - 0.5);
      if (distFromImpact < 0.1) {
        const intensity = (1 - distFromImpact / 0.1);
        const time = state.clock.elapsedTime * 45;
        const rumbleX = Math.sin(time) * 0.16 * intensity;
        const rumbleY = Math.cos(time * 1.3) * 0.12 * intensity;
        tempPos.current.x += rumbleX;
        tempPos.current.y += rumbleY;
      }
    }

    // 120fps Exponential Damping
    const damping = 1 - Math.exp(-4.5 * delta);
    state.camera.position.lerp(tempPos.current, damping);

    currentLook.current.lerp(tempLook.current, damping);
    state.camera.lookAt(currentLook.current);
  });

  return null;
}
