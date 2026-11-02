'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { useEvolutionStore, GeologicalHotspot } from '@/stores/useEvolutionStore';
import { getEpochTexture, getCloudTexture, EpochTextureSet } from './planetaryTextures';
import { ChicxulubImpactVisualizer, ContinuousHadeanBombardment } from './RealisticAsteroidImpact';

const ATMOSPHERE_COLORS: Record<number, string> = {
  0: '#ff4500', // Hadean: Volcanic fiery sulfur haze
  1: '#00b4d8', // Archean: Steamy teal ocean haze
  2: '#caf0f8', // Proterozoic: Crystalline glacial ice halo
  3: '#4C9A5B', // Paleozoic: Emerald tropical marine halo
  4: '#d97706', // Mesozoic: Warm greenhouse amber halo
  5: '#0077b6', // Cenozoic: Sapphire blue ozone halo
};

const CAMERA_POSITIONS = {
  default: new THREE.Vector3(0, 0, 7.2),
  pole: new THREE.Vector3(0, 6.5, 2.8),
  equator: new THREE.Vector3(6.5, 0.5, 2.8),
  night: new THREE.Vector3(-5.8, 1.8, -4.2),
};

// ── Realistic Atmosphere Fresnel Shader ──
const AtmosphereFresnelShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 uColor;
    uniform vec3 uSunDir;
    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.8);
      float sunLight = max(dot(vNormal, uSunDir), 0.0) * 0.8 + 0.2;
      gl_FragColor = vec4(uColor, fresnel * sunLight * 0.95);
    }
  `,
};

// ── 100% Guaranteed Completely Stationary, Fixed Cosmic Starfield (Zero Drift / Zero Rotation) ──
function StaticCosmicStarfield() {
  const [geometry] = useState(() => {
    const geom = new THREE.BufferGeometry();
    const count = 4200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 130 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const tint = Math.random();
      if (tint > 0.8) {
        colors[i * 3] = 0.85; colors[i * 3 + 1] = 0.92; colors[i * 3 + 2] = 1.0;
      } else if (tint > 0.6) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.92; colors[i * 3 + 2] = 0.75;
      } else {
        colors[i * 3] = 0.95; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 0.95;
      }
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geom;
  });

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={1.4}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation={false}
      />
    </points>
  );
}

// ── 3D Aurora Borealis Curtains for Pleistocene Eon ──
function PolarAurora({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.12;
      const scale = 1.0 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      meshRef.current.scale.set(scale, 1, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.85, 1.25, 48]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.35}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── 3D Modern Space Station (ISS) & Orbital Satellites for Anthropocene ──
function AnthropoceneSatellites() {
  const orbitGroupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * 0.22;
      orbitGroupRef.current.rotation.z += delta * 0.08;
    }
  });

  return (
    <group ref={orbitGroupRef}>
      {/* Primary Orbital Constellation Ring */}
      <mesh rotation={[0.8, 0.4, 0]}>
        <ringGeometry args={[3.35, 3.365, 96]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Secondary Polar Constellation Ring */}
      <mesh rotation={[0.2, 1.4, 0]}>
        <ringGeometry args={[3.5, 3.515, 96]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* International Space Station Model representation */}
      <group position={[3.35, 0, 0]} rotation={[0, 0, 0.4]}>
        {/* Main Station Habitation Module */}
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Solar Array Truss */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.01, 0.24, 0.01]} />
          <meshStandardMaterial color="#888888" metalness={0.9} />
        </mesh>
        {/* Left Solar Panel Wings */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.06, 0.09, 0.003]} />
          <meshStandardMaterial color="#0055ff" emissive="#0033aa" emissiveIntensity={0.6} />
        </mesh>
        {/* Right Solar Panel Wings */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.06, 0.09, 0.003]} />
          <meshStandardMaterial color="#0055ff" emissive="#0033aa" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* GPS Satellite Node */}
      <mesh position={[-3.5, 0.5, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#00ffcc" />
      </mesh>
    </group>
  );
}

// ── In-World 3D Holographic Hotspot Scanner Beacon ──
function HotspotScanner({ coords, hotspot }: { coords: [number, number, number]; hotspot: GeologicalHotspot }) {
  const ringRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 1.5;
    }
  });

  // Calculate rotation to align the ring with the sphere surface normal
  const normal = useMemo(() => new THREE.Vector3(...coords).normalize(), [coords]);
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [normal]);

  return (
    <group position={coords} quaternion={quaternion}>
      {/* Outer Rotating Laser Target Reticle */}
      <group ref={ringRef}>
        <Ring args={[0.12, 0.14, 32]}>
          <meshBasicMaterial color="#ffd700" side={THREE.DoubleSide} transparent opacity={0.9} />
        </Ring>
        {/* Crosshair ticks */}
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, angle]} position={[0, 0.15, 0]}>
            <boxGeometry args={[0.015, 0.04, 0.005]} />
            <meshBasicMaterial color="#ffd700" />
          </mesh>
        ))}
      </group>

      {/* Inner Pulsing Pulse Ring */}
      <Ring args={[0.04, 0.06, 24]}>
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </Ring>

      {/* Projected Holographic Vertical Laser Beacon Beam */}
      <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.02, 0.7, 16]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export function ChronoTerraGlobe() {
  const meshARef = useRef<THREE.Mesh>(null!);
  const meshBRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const cloudsHighRef = useRef<THREE.Mesh>(null!);
  const globeGroupRef = useRef<THREE.Group>(null!);
  const controlsRef = useRef<any>(null!);
  const seismicIntensityRef = useRef(0);

  const epochProgress = useEvolutionStore((s) => s.epochProgress);
  const showAtmosphere = useEvolutionStore((s) => s.showAtmosphere);
  const showCityLights = useEvolutionStore((s) => s.showCityLights);
  const isPlaying = useEvolutionStore((s) => s.isPlaying);
  const playbackSpeed = useEvolutionStore((s) => s.playbackSpeed);
  const visualizationMode = useEvolutionStore((s) => s.visualizationMode);
  const cameraPreset = useEvolutionStore((s) => s.cameraPreset);
  const activeHotspot = useEvolutionStore((s) => s.activeHotspot);
  const hotspotTargetCoords = useEvolutionStore((s) => s.hotspotTargetCoords);
  const impactTriggerKey = useEvolutionStore((s) => s.impactTriggerKey);
  const setEpochProgress = useEvolutionStore((s) => s.setEpochProgress);

  const prevPresetRef = useRef(cameraPreset);
  const prevHotspotRef = useRef(activeHotspot?.id);
  const isAnimatingCamRef = useRef(false);

  useEffect(() => {
    if (prevPresetRef.current !== cameraPreset) {
      prevPresetRef.current = cameraPreset;
      isAnimatingCamRef.current = true;
    }
  }, [cameraPreset]);

  useEffect(() => {
    if (prevHotspotRef.current !== activeHotspot?.id) {
      prevHotspotRef.current = activeHotspot?.id;
      if (activeHotspot) {
        isAnimatingCamRef.current = true;
      }
    }
  }, [activeHotspot]);

  const sphereGeomA = useMemo(() => new THREE.SphereGeometry(2.5, 64, 64), []);
  const sphereGeomB = useMemo(() => new THREE.SphereGeometry(2.502, 64, 64), []);
  const cloudsGeom = useMemo(() => new THREE.SphereGeometry(2.535, 48, 48), []);
  const cloudsHighGeom = useMemo(() => new THREE.SphereGeometry(2.558, 48, 48), []);
  const tectonicGeom = useMemo(() => new THREE.SphereGeometry(2.508, 64, 64), []);
  const atmosphereGeom = useMemo(() => new THREE.SphereGeometry(2.68, 48, 48), []);
  const whiteColor = useMemo(() => new THREE.Color('#ffffff'), []);

  const lastStoreUpdateRef = useRef(0);
  const animProgressRef = useRef(epochProgress);

  useEffect(() => {
    animProgressRef.current = epochProgress;
  }, [epochProgress]);

  const idxA = Math.min(Math.floor(epochProgress), 5);
  const idxB = Math.min(idxA + 1, 5);
  const blendFraction = epochProgress - Math.floor(epochProgress);

  // Client-side generated 2K textures
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const textures: EpochTextureSet[] = useMemo(() => {
    if (typeof window === 'undefined') return [];
    return [0, 1, 2, 3, 4, 5].map((idx) => getEpochTexture(idx));
  }, []);

  const cloudTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return getCloudTexture();
  }, []);

  useEffect(() => {
    setTexturesLoaded(true);
  }, []);

  const atmosphereColor = ATMOSPHERE_COLORS[idxA] || '#0077b6';

  const atmosphereUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(ATMOSPHERE_COLORS[0]) },
      uSunDir: { value: new THREE.Vector3(8, 3.5, 7.5).normalize() },
    }),
    []
  );

  // Frame animation loop
  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    const time = state.clock.elapsedTime;

    // Automated time-lapse sequence with throttled React state updates (prevents 60fps re-render thrashing)
    if (isPlaying) {
      const rate = 0.18 * playbackSpeed;
      animProgressRef.current = (animProgressRef.current + safeDelta * rate) % 5.0;

      if (time - lastStoreUpdateRef.current > 0.065 || Math.floor(animProgressRef.current) !== Math.floor(epochProgress)) {
        lastStoreUpdateRef.current = time;
        setEpochProgress(animProgressRef.current);
      }
    }

    // Keep atmosphere uniform synced
    atmosphereUniforms.uColor.value.set(atmosphereColor);

    // Smooth axial planetary rotation (pauses slightly if inspecting a hotspot)
    if (globeGroupRef.current && !activeHotspot) {
      globeGroupRef.current.rotation.y += safeDelta * 0.05;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += safeDelta * 0.065;
    }
    if (cloudsHighRef.current) {
      cloudsHighRef.current.rotation.y += safeDelta * 0.092;
    }

    // Dynamic Hadean Magma Pulsation on meshA / meshB
    if (idxA === 0 && meshARef.current) {
      const mat = meshARef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 2.2 + Math.sin(time * 3.5) * 0.5;
      }
    }

    // Smooth Camera Transition ONLY on explicit user trigger, then releases control completely
    if (isAnimatingCamRef.current) {
      let targetVec: THREE.Vector3;
      if (hotspotTargetCoords && activeHotspot) {
        targetVec = new THREE.Vector3(...hotspotTargetCoords).normalize().multiplyScalar(5.2);
      } else {
        targetVec = CAMERA_POSITIONS[cameraPreset] || CAMERA_POSITIONS.default;
      }

      state.camera.position.lerp(targetVec, 1 - Math.exp(-3.5 * safeDelta));

      if (state.camera.position.distanceTo(targetVec) < 0.05) {
        state.camera.position.copy(targetVec);
        isAnimatingCamRef.current = false;
      }
    }

    // Realistic Planetary Seismic Camera Impulse
    if (seismicIntensityRef.current > 0.001) {
      const shake = new THREE.Vector3(
        Math.sin(time * 46) * 0.045,
        Math.cos(time * 38) * 0.045,
        Math.sin(time * 30) * 0.025
      ).multiplyScalar(seismicIntensityRef.current);
      state.camera.position.add(shake);
      seismicIntensityRef.current *= Math.exp(-safeDelta * 4.5);
    }

    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  const textureA = textures[idxA] || textures[0];
  const textureB = textures[idxB] || textures[0];

  // Helper to pick the active map for each mesh based on visualizationMode
  const getMapForMode = (tex: EpochTextureSet) => {
    if (!tex) return null;
    if (visualizationMode === 'thermal') return tex.thermalMap;
    if (visualizationMode === 'biosphere') return tex.biosphereMap;
    return tex.map;
  };

  const mapA = useMemo(() => getMapForMode(textureA), [textureA, visualizationMode]);
  const mapB = useMemo(() => getMapForMode(textureB), [textureB, visualizationMode]);

  return (
    <>
      {/* Deep Space Background Stars — 100% FIXED / ZERO DRIFT / ZERO MOVEMENT */}
      <StaticCosmicStarfield />

      {/* High-Contrast Directional Sunlight (Creates dramatic Day/Night Terminator) */}
      <directionalLight position={[9, 3.2, 7.5]} intensity={5.2} color="#fffdf5" />
      {/* Low Cosmic Space Ambient Light (Prevents flat washed-out appearance) */}
      <ambientLight intensity={0.06} color="#030816" />
      {/* Subtle Galactic Limb Edge Fill Light */}
      <pointLight position={[-9, -2.5, -7]} intensity={0.9} color="#0033bb" />

      {/* ── Epoch-Specific Celestial Dynamics ── */}
      {/* Cenozoic Polar Auroras & Modern Satellites */}
      {idxA === 5 && (
        <>
          <PolarAurora position={[0, 2.38, 0]} color="#00ff88" />
          <PolarAurora position={[0, -2.38, 0]} color="#aa00ff" />
          <AnthropoceneSatellites />
        </>
      )}

      {/* ── Primary Globe Group (23.5° Axial Tilt) ── */}
      <group rotation={[0.41, 0, 0]}>
        <group ref={globeGroupRef}>
          {/* Continuous Hadean Bolide Bombardment */}
          {idxA === 0 && <ContinuousHadeanBombardment />}

          {/* Epic Chicxulub Bolide Impact Visualizer (Active during Mesozoic or on demand) */}
          {(idxA === 4 || impactTriggerKey > 0 || activeHotspot?.id === 'mesozoic-chicxulub') && (
            <ChicxulubImpactVisualizer
              onSeismicImpulse={(val) => {
                seismicIntensityRef.current = val;
              }}
            />
          )}
          {/* Base Epoch Sphere Layer A */}
          {texturesLoaded && textureA && mapA && (
            <mesh ref={meshARef} geometry={sphereGeomA}>
              <meshStandardMaterial
                map={mapA}
                bumpMap={visualizationMode === 'natural' ? textureA.bumpMap : undefined}
                bumpScale={idxA === 0 ? 0.24 : idxA === 2 ? 0.08 : 0.18}
                roughnessMap={textureA.roughnessMap}
                emissiveMap={textureA.emissiveMap}
                emissive={whiteColor}
                emissiveIntensity={
                  idxA === 0
                    ? 2.6 // Searing molten magma glow
                    : idxA === 5 && showCityLights
                    ? 2.3 // Golden city lights glow
                    : idxA === 1
                    ? 1.5 // Hydrothermal vent glow
                    : 0.05
                }
                roughness={idxA === 2 ? 0.12 : 0.58}
                metalness={idxA === 2 ? 0.28 : 0.12}
              />
            </mesh>
          )}

          {/* Morphing Next Epoch Sphere Layer B (Seamless Dissolve) */}
          {texturesLoaded && textureB && mapB && (
            <mesh
              ref={meshBRef}
              geometry={sphereGeomB}
              visible={idxA !== idxB && blendFraction > 0.01}
            >
              <meshStandardMaterial
                map={mapB}
                bumpMap={visualizationMode === 'natural' ? textureB.bumpMap : undefined}
                bumpScale={idxB === 0 ? 0.24 : idxB === 2 ? 0.08 : 0.18}
                roughnessMap={textureB.roughnessMap}
                emissiveMap={textureB.emissiveMap}
                emissive={whiteColor}
                emissiveIntensity={
                  idxB === 0
                    ? 2.6
                    : idxB === 5 && showCityLights
                    ? 2.3
                    : idxB === 1
                    ? 1.5
                    : 0.05
                }
                roughness={idxB === 2 ? 0.12 : 0.58}
                metalness={idxB === 2 ? 0.28 : 0.12}
                transparent
                opacity={blendFraction}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Holographic Tectonic Fault Lines Overlay (Mode: tectonic) */}
          {texturesLoaded && textureA && visualizationMode === 'tectonic' && (
            <mesh geometry={tectonicGeom}>
              <meshBasicMaterial
                map={textureA.tectonicMap}
                transparent
                opacity={0.9}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Low-Altitude Troposphere Weather Clouds */}
          {showAtmosphere && idxA > 0 && cloudTexture && visualizationMode === 'natural' && (
            <mesh ref={cloudsRef} geometry={cloudsGeom}>
              <meshStandardMaterial
                map={cloudTexture}
                transparent
                opacity={idxA === 2 ? 0.16 : idxA === 5 ? 0.44 : 0.30}
                roughness={0.9}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* High-Altitude Stratosphere Cirrus Clouds (Parallax Depth Layer) */}
          {showAtmosphere && idxA > 0 && cloudTexture && visualizationMode === 'natural' && (
            <mesh ref={cloudsHighRef} geometry={cloudsHighGeom} rotation={[0.2, 0.4, 0]}>
              <meshStandardMaterial
                map={cloudTexture}
                transparent
                opacity={idxA === 5 ? 0.22 : 0.14}
                roughness={0.95}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* In-World 3D Holographic Hotspot Scanner */}
          {activeHotspot && hotspotTargetCoords && (
            <HotspotScanner coords={hotspotTargetCoords} hotspot={activeHotspot} />
          )}
        </group>

        {/* Outer Atmospheric Rayleigh/Mie Scattering Fresnel Halo */}
        {showAtmosphere && visualizationMode === 'natural' && (
          <mesh geometry={atmosphereGeom}>
            <shaderMaterial
              vertexShader={AtmosphereFresnelShader.vertexShader}
              fragmentShader={AtmosphereFresnelShader.fragmentShader}
              uniforms={atmosphereUniforms}
              transparent
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>

      {/* Free 360° OrbitControls */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        minDistance={3.4}
        maxDistance={11.0}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.06}
        rotateSpeed={0.7}
      />
    </>
  );
}
