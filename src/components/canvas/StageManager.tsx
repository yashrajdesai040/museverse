'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useEvolutionStore } from '@/stores/useEvolutionStore';
import { useAppStore } from '@/stores/useAppStore';
import { EarthModel } from './EarthModel';
import { AntikytheraModel } from './AntikytheraModel';

// ── Interactive 3D World Pin Reticle ────────────────────────────
function StageReticle({
  position,
  label,
  sublabel,
  entityId,
}: {
  position: [number, number, number];
  label: string;
  sublabel: string;
  entityId?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const { openEntityModal } = useAppStore();
  const setActiveHotspot = useEvolutionStore((s) => s.setActiveHotspot);

  return (
    <group position={position}>
      <Html
        distanceFactor={18}
        center
        className="pointer-events-auto select-none"
      >
        <button
          onClick={() => {
            if (entityId) {
              setActiveHotspot(entityId);
              openEntityModal(entityId);
            }
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none font-mono text-[10px] uppercase font-bold tracking-wider transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_#000] border-2 ${
            hovered
              ? 'bg-[#ffd700] text-black border-white scale-110'
              : 'bg-black/85 text-yellow-400 border-yellow-400/80 hover:bg-black'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping inline-block shrink-0" />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] font-black">{label}</span>
            <span className="text-[8px] text-neutral-300 font-normal lowercase">{sublabel}</span>
          </div>
          {entityId && (
            <span className="ml-1 text-[9px] bg-black text-yellow-400 px-1 py-0.2 font-bold border border-yellow-400/50">
              3D ↗
            </span>
          )}
        </button>
      </Html>
    </group>
  );
}

// ── Biome 1: Archean Primordial Ocean (~3.8 Ga, Y = 0) ──────────
function ArcheanOceanBiome() {
  const ventFissureRef = useRef<THREE.Mesh>(null!);
  const plumeLightRef = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ventFissureRef.current) {
      const mat = ventFissureRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 2.0 + Math.sin(t * 4) * 0.8;
      }
    }
    if (plumeLightRef.current) {
      plumeLightRef.current.intensity = 3.5 + Math.sin(t * 5) * 1.0;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Oceanic Basalt Bedrock */}
      <mesh position={[0, -4.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[45, 45, 16, 16]} />
        <meshStandardMaterial
          color="#06121a"
          roughness={0.9}
          metalness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Craggy Seabed Outcrops */}
      <mesh position={[-4, -3.8, -2]}>
        <dodecahedronGeometry args={[2.5, 1]} />
        <meshStandardMaterial color="#081a24" roughness={0.95} />
      </mesh>
      <mesh position={[4.5, -3.9, 1]}>
        <dodecahedronGeometry args={[2.0, 1]} />
        <meshStandardMaterial color="#09202c" roughness={0.95} />
      </mesh>

      {/* Hydrothermal "Black Smoker" Chimney Vent */}
      <group position={[0, -2, 0]}>
        {/* Main chimney column */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.7, 1.6, 4.4, 16]} />
          <meshStandardMaterial color="#11181c" roughness={0.9} />
        </mesh>
        {/* Vent Craggy Outer Mineral Crust */}
        <mesh position={[0.2, 0.4, 0.1]} rotation={[0.2, 0.4, 0]}>
          <cylinderGeometry args={[0.8, 1.4, 3.2, 10]} />
          <meshStandardMaterial color="#1a242b" roughness={0.85} />
        </mesh>
        {/* Glowing Thermal Fissure in Chimney */}
        <mesh ref={ventFissureRef} position={[0, 1.2, 0.4]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.15, 2.2, 0.2]} />
          <meshStandardMaterial
            color="#ff4400"
            emissive="#ff5500"
            emissiveIntensity={2.5}
            roughness={0.2}
          />
        </mesh>
        {/* Orifice Flare Ring */}
        <mesh position={[0, 2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.65, 0.2, 12, 24]} />
          <meshStandardMaterial color="#00e5ff" emissive="#0088aa" emissiveIntensity={1.2} />
        </mesh>
        {/* Vent Upward Thermal Point Light */}
        <pointLight
          ref={plumeLightRef}
          position={[0, 2.5, 0]}
          color="#00f0ff"
          intensity={4}
          distance={16}
        />
      </group>

      {/* Ascending Convective Mineral Particle Plume */}
      <Sparkles
        count={240}
        scale={[3.5, 8.0, 3.5]}
        position={[0, 1.5, 0]}
        size={4}
        speed={1.4}
        color="#00f5ff"
      />

      {/* Archean Stromatolite Bio-Colony (Laminated Cyanobacteria Mounds) */}
      <group position={[2.8, -3.2, 1.5]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1b4332" roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Concentric growth layers */}
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.95, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#52b788" roughness={0.6} emissive="#1b4332" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Smaller Stromatolite Satellite Mound */}
      <group position={[-2.6, -3.5, 1.8]}>
        <mesh>
          <sphereGeometry args={[0.9, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.7} />
        </mesh>
      </group>

      {/* Prebiotic Floating Organic Globules */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh position={[-1.8, 0.5, 2]}>
          <sphereGeometry args={[0.45, 24, 24]} />
          <meshStandardMaterial
            color="#52b788"
            roughness={0.1}
            metalness={0.1}
            emissive="#00ffcc"
            emissiveIntensity={0.6}
            transparent
            opacity={0.75}
          />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh position={[2.2, 1.2, -1]}>
          <sphereGeometry args={[0.3, 20, 20]} />
          <meshStandardMaterial
            color="#00b4d8"
            roughness={0.1}
            emissive="#0077b6"
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>

      {/* Downward Oceanic Volumetric Caustic Spotlights */}
      <spotLight
        position={[0, 14, 0]}
        angle={0.55}
        penumbra={0.9}
        intensity={6}
        color="#00e5ff"
        castShadow
      />
      <spotLight
        position={[6, 12, 4]}
        angle={0.4}
        penumbra={0.8}
        intensity={4}
        color="#48cae4"
      />

      {/* Interactive 3D World Markers */}
      <StageReticle
        position={[0, 1.2, 0.5]}
        label="Hydrothermal Black Smoker"
        sublabel="3.8 Ga hydrothermal cradle"
        entityId="stromatolite-pilbara"
      />
      <StageReticle
        position={[2.8, -2.1, 1.8]}
        label="Pilbara Stromatolite"
        sublabel="Earth's oldest direct fossil record"
        entityId="stromatolite-pilbara"
      />
    </group>
  );
}

// ── Biome 2: Mesozoic Cretaceous Canopy & Apex Theropod (~67 Ma, Y = -35) ──
function MesozoicCretaceousBiome() {
  const jawRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    // Subtle breathing respiration of the fossil mount
    if (jawRef.current) {
      jawRef.current.rotation.x = 0.12 + Math.sin(state.clock.elapsedTime * 1.2) * 0.03;
    }
  });

  return (
    <group position={[0, -35, 0]}>
      {/* Primeval Jurassic Rock Strata Bed */}
      <mesh position={[0, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[45, 45, 16, 16]} />
        <meshStandardMaterial color="#1a1208" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Cretaceous Sandstone Plinth */}
      <mesh position={[0, -3.2, 0]}>
        <boxGeometry args={[7.5, 1.6, 5.0]} />
        <meshStandardMaterial color="#2e1f14" roughness={0.9} />
      </mesh>

      {/* ── High-Detail Anatomical Theropod Skull (T-Rex "Sue") ── */}
      <Float speed={1.0} rotationIntensity={0.25} floatIntensity={0.3}>
        <group position={[0, -0.6, 0]} rotation={[0.08, -0.3, 0]}>
          {/* Cranial Braincase & Posterior Skull */}
          <mesh position={[0, 0.8, -1.2]}>
            <boxGeometry args={[1.9, 1.4, 1.8]} />
            <meshStandardMaterial color="#c8b99c" roughness={0.42} />
          </mesh>

          {/* Elongated Maxillary Rostrum (Snout) */}
          <mesh position={[0, 0.45, 0.6]} rotation={[-0.05, 0, 0]}>
            <boxGeometry args={[1.5, 1.2, 2.6]} />
            <meshStandardMaterial color="#baa98b" roughness={0.4} />
          </mesh>

          {/* Antorbital Fenestra (Weight Reduction Cavity) */}
          <mesh position={[0.65, 0.55, 0.2]}>
            <boxGeometry args={[0.3, 0.7, 1.1]} />
            <meshStandardMaterial color="#1a120c" roughness={0.95} />
          </mesh>
          <mesh position={[-0.65, 0.55, 0.2]}>
            <boxGeometry args={[0.3, 0.7, 1.1]} />
            <meshStandardMaterial color="#1a120c" roughness={0.95} />
          </mesh>

          {/* Left & Right Orbit Sockets */}
          <mesh position={[0.82, 0.9, -0.6]}>
            <sphereGeometry args={[0.45, 12, 12]} />
            <meshStandardMaterial color="#110d08" roughness={0.95} />
          </mesh>
          <mesh position={[-0.82, 0.9, -0.6]}>
            <sphereGeometry args={[0.45, 12, 12]} />
            <meshStandardMaterial color="#110d08" roughness={0.95} />
          </mesh>

          {/* Maxillary Upper Serrated Teeth (Left & Right Rows) */}
          {[-0.8, -0.4, 0.0, 0.4, 0.8, 1.2, 1.6].map((z, i) => (
            <React.Fragment key={i}>
              <mesh position={[0.72, -0.25, z]} rotation={[0, 0, -0.15]}>
                <coneGeometry args={[0.08, 0.42 + (i % 3) * 0.08, 8]} />
                <meshStandardMaterial color="#f4efe6" roughness={0.3} metalness={0.1} />
              </mesh>
              <mesh position={[-0.72, -0.25, z]} rotation={[0, 0, 0.15]}>
                <coneGeometry args={[0.08, 0.42 + (i % 3) * 0.08, 8]} />
                <meshStandardMaterial color="#f4efe6" roughness={0.3} metalness={0.1} />
              </mesh>
            </React.Fragment>
          ))}

          {/* Articulated Lower Mandible (Dentary) */}
          <group ref={jawRef} position={[0, -0.5, -1.2]}>
            <mesh position={[0, -0.2, 1.6]}>
              <boxGeometry args={[1.4, 0.55, 2.9]} />
              <meshStandardMaterial color="#b2a183" roughness={0.45} />
            </mesh>
            {/* Lower Teeth */}
            {[-0.6, -0.2, 0.2, 0.6, 1.0, 1.4].map((z, i) => (
              <React.Fragment key={i}>
                <mesh position={[0.66, 0.15, z + 1.2]} rotation={[Math.PI, 0, 0.1]}>
                  <coneGeometry args={[0.07, 0.35, 8]} />
                  <meshStandardMaterial color="#f4efe6" roughness={0.3} />
                </mesh>
                <mesh position={[-0.66, 0.15, z + 1.2]} rotation={[Math.PI, 0, -0.1]}>
                  <coneGeometry args={[0.07, 0.35, 8]} />
                  <meshStandardMaterial color="#f4efe6" roughness={0.3} />
                </mesh>
              </React.Fragment>
            ))}
          </group>

          {/* Glowing Cretaceous Amber Inclusions */}
          <mesh position={[0.9, 0.1, 0.8]}>
            <dodecahedronGeometry args={[0.22, 1]} />
            <meshStandardMaterial
              color="#ffaa00"
              roughness={0.15}
              metalness={0.1}
              emissive="#ff7700"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      </Float>

      {/* Swaying Prehistoric Cycad / Fern Frond Geometries */}
      <group position={[-3.8, -3.2, 1]}>
        <mesh rotation={[0.4, 0.3, -0.2]}>
          <cylinderGeometry args={[0.15, 0.25, 4.2, 8]} />
          <meshStandardMaterial color="#2d1f14" roughness={0.9} />
        </mesh>
        {/* Palm frond arches */}
        <mesh position={[0.8, 2.2, 0.5]} rotation={[0.3, 0.8, -0.5]}>
          <boxGeometry args={[0.2, 0.05, 3.2]} />
          <meshStandardMaterial color="#2d4a22" roughness={0.65} />
        </mesh>
        <mesh position={[-0.5, 2.0, 0.8]} rotation={[-0.2, -0.5, 0.4]}>
          <boxGeometry args={[0.2, 0.05, 2.8]} />
          <meshStandardMaterial color="#385e2b" roughness={0.65} />
        </mesh>
      </group>

      {/* Floating Amber Spore Dust Field */}
      <Sparkles
        count={200}
        scale={[18, 10, 18]}
        size={3.5}
        speed={0.7}
        color="#ffc83b"
      />

      {/* Warm Golden Cretaceous Sunbeams */}
      <directionalLight
        position={[8, 15, 6]}
        intensity={3.2}
        color="#ffd275"
        castShadow
      />
      <pointLight position={[-3, 2, 2]} color="#ff9900" intensity={2.5} distance={12} />

      {/* Interactive 3D World Markers */}
      <StageReticle
        position={[0.8, 0.5, 1.2]}
        label='"Sue" the T. rex'
        sublabel="57,000 N bite force serrated dentition"
        entityId="trex-sue"
      />
      <StageReticle
        position={[-1.2, 1.2, -0.5]}
        label="Archaeopteryx"
        sublabel="Feathered transitional theropod link"
        entityId="archaeopteryx-london"
      />
    </group>
  );
}

// ── Biome 3: Chicxulub Kinetic Bolide Cataclysm (~66 Ma, Y = -70) ──────────
function ChicxulubImpactBiome() {
  const asteroidRef = useRef<THREE.Group>(null!);
  const shockwaveRef = useRef<THREE.Mesh>(null!);
  const shockwave2Ref = useRef<THREE.Mesh>(null!);
  const flashLightRef = useRef<THREE.PointLight>(null!);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // Rapid chaotic bolide tumble
    if (asteroidRef.current) {
      asteroidRef.current.rotation.x += delta * 0.9;
      asteroidRef.current.rotation.y += delta * 1.3;
      asteroidRef.current.rotation.z += delta * 0.6;
    }
    // Expanding supersonic shockwave rings
    if (shockwaveRef.current) {
      const scale = 1.0 + (t * 2.2) % 3.5;
      shockwaveRef.current.scale.set(scale, scale, 1);
      const mat = shockwaveRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 1 - scale / 4.5);
      }
    }
    if (shockwave2Ref.current) {
      const scale2 = 1.0 + ((t + 0.8) * 2.2) % 3.5;
      shockwave2Ref.current.scale.set(scale2, scale2, 1);
      const mat = shockwave2Ref.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 1 - scale2 / 4.5);
      }
    }
    // Pulsing impact lightning flashes
    if (flashLightRef.current) {
      flashLightRef.current.intensity = 5.0 + Math.sin(t * 12) * 2.5 + (Math.random() > 0.8 ? 6 : 0);
    }
  });

  return (
    <group position={[0, -70, 0]}>
      {/* ── 12-km Chicxulub Impactor Bolide ── */}
      <group ref={asteroidRef} position={[0, 0.5, 0]}>
        {/* Chondrite Core Rock with Deep Fractures */}
        <mesh>
          <icosahedronGeometry args={[3.2, 3]} />
          <meshStandardMaterial
            color="#220a05"
            roughness={0.88}
            metalness={0.4}
            emissive="#550000"
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* Incandescent Magma Veins */}
        <mesh scale={[1.02, 1.02, 1.02]}>
          <icosahedronGeometry args={[3.2, 2]} />
          <meshStandardMaterial
            color="#ff4400"
            wireframe
            emissive="#ff3300"
            emissiveIntensity={3.2}
          />
        </mesh>
        {/* Molten Surface Hotspots */}
        <mesh position={[1.8, 1.2, 1.2]}>
          <dodecahedronGeometry args={[0.9, 1]} />
          <meshStandardMaterial color="#ffaa00" emissive="#ff6600" emissiveIntensity={3.5} />
        </mesh>
        <mesh position={[-1.5, -1.4, 1.5]}>
          <dodecahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial color="#ff3300" emissive="#ff1100" emissiveIntensity={3.0} />
        </mesh>
      </group>

      {/* Supersonic Plasma Shockwave Rings */}
      <mesh ref={shockwaveRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.8, 0.35, 16, 48]} />
        <meshStandardMaterial
          color="#ff7700"
          emissive="#ff5500"
          emissiveIntensity={2.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh ref={shockwave2Ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.2, 0.25, 16, 48]} />
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ffaa00"
          emissiveIntensity={2.0}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Conical Atmospheric Re-Entry Flame Tail */}
      <mesh position={[0, 4.8, -1.5]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[2.8, 7.5, 24, 1, true]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff5500"
          emissiveIntensity={2.8}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Worldwide 3mm Iridium Horizon Layer Plinth below */}
      <mesh position={[0, -5.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[45, 45, 16, 16]} />
        <meshStandardMaterial color="#1a0404" roughness={0.95} />
      </mesh>

      {/* Fiery Ejecta & Incandescent Embers Field */}
      <Sparkles
        count={500}
        scale={[24, 16, 24]}
        size={5.5}
        speed={2.2}
        color="#ff4500"
      />

      {/* Apocalyptic Flashes & Lighting */}
      <pointLight
        ref={flashLightRef}
        position={[0, 1.0, 0]}
        color="#ff5500"
        intensity={6}
        distance={25}
      />
      <directionalLight position={[0, 20, 5]} intensity={4.5} color="#ff2200" />

      {/* Interactive 3D World Markers */}
      <StageReticle
        position={[0, 2.8, 2.5]}
        label="12-km Chicxulub Impactor"
        sublabel="100 teratons kinetic energy delivery"
        entityId="kpg-boundary-clay"
      />
      <StageReticle
        position={[-3.5, -2.5, 1.5]}
        label="3mm Iridium Horizon"
        sublabel="Global extraterrestrial fallout layer"
        entityId="kpg-boundary-clay"
      />
    </group>
  );
}

// ── Biome 4: Pleistocene Glacial Megafauna & Ice Age (~66–2 Ma, Y = -105) ──
function PleistoceneGlacialBiome() {
  const auroraRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (auroraRef.current) {
      auroraRef.current.rotation.z = Math.sin(t * 0.4) * 0.08;
      const mat = auroraRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 1.2 + Math.sin(t * 1.5) * 0.4;
      }
    }
  });

  return (
    <group position={[0, -105, 0]}>
      {/* Arctic Permafrost Bedrock */}
      <mesh position={[0, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[45, 45, 16, 16]} />
        <meshStandardMaterial color="#071526" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Frozen Glacial Shelf Plinth */}
      <mesh position={[0, -3.2, 0]}>
        <boxGeometry args={[7.2, 1.8, 5.2]} />
        <meshStandardMaterial
          color="#0d2644"
          roughness={0.2}
          metalness={0.3}
          emissive="#004466"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* ── Translucent Glacial Ice Spires & Stalagmites ── */}
      <mesh position={[-4.5, -1.2, -2]} rotation={[0.1, 0.4, -0.1]}>
        <coneGeometry args={[1.2, 6.5, 6]} />
        <meshStandardMaterial
          color="#d8f3dc"
          roughness={0.12}
          metalness={0.1}
          emissive="#00f5d4"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[4.2, -1.5, -1.5]} rotation={[-0.15, -0.3, 0.15]}>
        <coneGeometry args={[1.0, 5.8, 6]} />
        <meshStandardMaterial
          color="#a2d2ff"
          roughness={0.1}
          emissive="#00b4d8"
          emissiveIntensity={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[-3.2, -2.2, 2.2]} rotation={[0.2, 0.2, 0]}>
        <coneGeometry args={[0.7, 4.0, 5]} />
        <meshStandardMaterial
          color="#bde0fe"
          roughness={0.15}
          emissive="#0077b6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* ── Woolly Mammoth Specimen (Skull & Massive Curved Tusks) ── */}
      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[0, -0.5, 0]}>
          {/* Domed Mammoth Cranium */}
          <mesh position={[0, 0.8, -0.8]}>
            <sphereGeometry args={[1.4, 16, 16]} />
            <meshStandardMaterial color="#c2b095" roughness={0.5} />
          </mesh>
          {/* Massive Nasal Aperture & Trunk Base */}
          <mesh position={[0, 0.2, 0.4]}>
            <cylinderGeometry args={[0.65, 0.9, 1.4, 12]} />
            <meshStandardMaterial color="#ad9b80" roughness={0.55} />
          </mesh>

          {/* Left Massive Spiraling Ivory Tusk (3.5m Curvature) */}
          <group position={[0.75, 0.1, 0.3]} rotation={[0.3, 0.4, 0.6]}>
            <mesh position={[0.6, 0.4, 1.0]} rotation={[-0.3, 0.6, -0.4]}>
              <torusGeometry args={[1.8, 0.22, 16, 32, Math.PI * 0.7]} />
              <meshStandardMaterial
                color="#f8f4ec"
                roughness={0.25}
                metalness={0.15}
                emissive="#e9d8a6"
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Tusk Tip */}
            <mesh position={[1.4, 1.8, 1.6]} rotation={[-0.5, 0.8, 0]}>
              <coneGeometry args={[0.12, 0.8, 10]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
          </group>

          {/* Right Massive Spiraling Ivory Tusk */}
          <group position={[-0.75, 0.1, 0.3]} rotation={[0.3, -0.4, -0.6]}>
            <mesh position={[-0.6, 0.4, 1.0]} rotation={[-0.3, -0.6, 0.4]}>
              <torusGeometry args={[1.8, 0.22, 16, 32, Math.PI * 0.7]} />
              <meshStandardMaterial
                color="#f8f4ec"
                roughness={0.25}
                metalness={0.15}
                emissive="#e9d8a6"
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Tusk Tip */}
            <mesh position={[-1.4, 1.8, 1.6]} rotation={[-0.5, -0.8, 0]}>
              <coneGeometry args={[0.12, 0.8, 10]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
          </group>
        </group>
      </Float>

      {/* Atmospheric Aurora Borealis Ribbon Overhead */}
      <mesh ref={auroraRef} position={[0, 5.5, -6]} rotation={[0.3, 0, 0]}>
        <planeGeometry args={[28, 4.5, 16, 8]} />
        <meshStandardMaterial
          color="#00f5d4"
          emissive="#7209b7"
          emissiveIntensity={1.2}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Swirling Glacial Blizzard Flurry Vortex */}
      <Sparkles
        count={350}
        scale={[22, 14, 22]}
        size={4.2}
        speed={1.8}
        color="#e0fbfc"
      />

      {/* Polar Lighting */}
      <directionalLight position={[-10, 15, 8]} intensity={3.5} color="#e0fbfc" />
      <pointLight position={[0, -1, 3]} color="#00b4d8" intensity={2.8} distance={15} />

      {/* Interactive 3D World Markers */}
      <StageReticle
        position={[1.8, 1.2, 1.8]}
        label="Woolly Mammoth Ivory Tusks"
        sublabel="3.5m spiral curvature growth rings"
        entityId="mammoth-lyuba"
      />
      <StageReticle
        position={[-3.0, -0.5, 0.5]}
        label="Saber-Toothed Cat (Smilodon)"
        sublabel="Pleistocene apex hypercarnivore"
        entityId="smilodon-la-brea"
      />
    </group>
  );
}

// ── Biome 5: Anthropocene Antiquity Sanctum & Living Earth (~300k BCE–Present, Y = -140) ──
function AnthropoceneSanctuaryBiome() {
  const earthGroupRef = useRef<THREE.Group>(null!);
  const antikytheraRef = useRef<THREE.Group>(null!);
  const rosettaRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    // Earth axial rotation
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += delta * 0.25;
    }
    // Antikythera bronze gear rotation
    if (antikytheraRef.current) {
      antikytheraRef.current.rotation.y += delta * 0.35;
      antikytheraRef.current.rotation.z += delta * 0.15;
    }
    // Rosetta stone subtle levitation
    if (rosettaRef.current) {
      rosettaRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group position={[0, -140, 0]}>
      {/* Polished Obsidian Museum Floor with Mirror Highlights */}
      <mesh position={[0, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[45, 45, 16, 16]} />
        <meshStandardMaterial
          color="#050508"
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* Golden Sanctuary Plinth Rings */}
      <mesh position={[0, -4.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.4, 48]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, -4.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.2, 5.35, 48]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.4} />
      </mesh>

      {/* ── Living Blue Planet (Earth Model / High-Res Fallback) ── */}
      <group position={[0, 0, 0]}>
        <group ref={earthGroupRef} rotation={[0.41, 0, 0]}>
          <EarthModel factor={0.42} />
        </group>
        {/* Rayleigh Scattering Atmospheric Ozone Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.8, 3.0, 48]} />
          <meshStandardMaterial
            color="#3a86ff"
            emissive="#3a86ff"
            emissiveIntensity={1.5}
            transparent
            opacity={0.65}
          />
        </mesh>
      </group>

      {/* ── Flanking Masterpiece: Antikythera Mechanism ── */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <group ref={antikytheraRef} position={[-4.2, 0.2, 1.2]} scale={[0.85, 0.85, 0.85]}>
          <AntikytheraModel factor={0.6} />
        </group>
      </Float>

      {/* ── Flanking Masterpiece: Rosetta Stone Stela ── */}
      <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={rosettaRef} position={[4.2, 0.2, 1.2]} rotation={[0.1, -0.4, 0]}>
          {/* Black Granodiorite Stela Slab */}
          <mesh>
            <boxGeometry args={[1.6, 2.4, 0.35]} />
            <meshStandardMaterial color="#1a1a1e" roughness={0.6} metalness={0.2} />
          </mesh>
          {/* Broken Asymmetrical Crown Arch */}
          <mesh position={[-0.2, 1.3, 0]}>
            <cylinderGeometry args={[0.6, 0.9, 0.3, 16]} />
            <meshStandardMaterial color="#1a1a1e" roughness={0.6} />
          </mesh>
          {/* Inscription Horizontal Bands (Hieroglyphs / Demotic / Greek) */}
          <mesh position={[0, 0.6, 0.19]}>
            <planeGeometry args={[1.3, 0.6]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.6} wireframe />
          </mesh>
          <mesh position={[0, -0.1, 0.19]}>
            <planeGeometry args={[1.3, 0.6]} />
            <meshStandardMaterial color="#ffeedd" emissive="#ffeedd" emissiveIntensity={0.4} wireframe />
          </mesh>
          <mesh position={[0, -0.7, 0.19]}>
            <planeGeometry args={[1.3, 0.4]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} wireframe />
          </mesh>
        </group>
      </Float>

      {/* Floating 24k Golden Sparkles */}
      <Sparkles
        count={260}
        scale={[22, 12, 22]}
        size={4.0}
        speed={0.6}
        color="#ffd700"
      />

      {/* Museum Architectural Lighting */}
      <spotLight
        position={[0, 16, 6]}
        angle={0.45}
        penumbra={0.7}
        intensity={5.5}
        color="#fff5db"
        castShadow
      />
      <pointLight position={[-4, 3, 2]} color="#ffd700" intensity={3.0} distance={12} />
      <pointLight position={[4, 3, 2]} color="#ffd700" intensity={3.0} distance={12} />

      {/* Interactive 3D World Markers */}
      <StageReticle
        position={[0, 2.5, 0.5]}
        label="Anthropocene (Planet Earth)"
        sublabel="8 billion minds shaping the biosphere"
        entityId="voyager-golden-record"
      />
      <StageReticle
        position={[-4.2, 1.8, 1.5]}
        label="Antikythera Mechanism"
        sublabel="World's first analog computer (150 BCE)"
        entityId="antikythera-mechanism"
      />
      <StageReticle
        position={[4.2, 1.8, 1.5]}
        label="Rosetta Stone"
        sublabel="Trilingual key unlocking 3,000 years of history"
        entityId="rosetta-stone"
      />
    </group>
  );
}

// ── Master StageManager: Adaptive Continuous Atmosphere ────────
export function StageManager() {
  const fogRef = useRef<THREE.Fog>(null!);
  const ambientRef = useRef<THREE.AmbientLight>(null!);

  const cFog = useRef(new THREE.Color('#010e1a'));
  const cAmb = useRef(new THREE.Color('#006680'));

  useFrame((state, delta) => {
    const camY = state.camera.position.y;
    const damping = 1 - Math.exp(-3.5 * delta);

    // Calculate target fog and ambient color based on continuous camera depth Y
    let targetFog = '#010e1a';
    let targetAmb = '#005577';
    let ambIntensity = 1.6;

    if (camY > -18) {
      // Stage 1: Primordial Ocean
      targetFog = '#010e1a';
      targetAmb = '#005577';
      ambIntensity = 1.6;
    } else if (camY > -52) {
      // Stage 2: Cretaceous Prehistoric Canopy
      targetFog = '#1a1005';
      targetAmb = '#4a3310';
      ambIntensity = 1.4;
    } else if (camY > -86) {
      // Stage 3: Chicxulub Kinetic Bolide Cataclysm
      targetFog = '#200303';
      targetAmb = '#550800';
      ambIntensity = 2.4;
    } else if (camY > -122) {
      // Stage 4: Pleistocene Glacial Megafauna
      targetFog = '#030e1d';
      targetAmb = '#0a2a4a';
      ambIntensity = 1.3;
    } else {
      // Stage 5: Anthropocene Antiquity Sanctum
      targetFog = '#040407';
      targetAmb = '#2a200a';
      ambIntensity = 1.5;
    }

    if (fogRef.current) {
      cFog.current.lerp(new THREE.Color(targetFog), damping);
      fogRef.current.color = cFog.current;
      state.scene.background = cFog.current;
    }
    if (ambientRef.current) {
      cAmb.current.lerp(new THREE.Color(targetAmb), damping);
      ambientRef.current.color = cAmb.current;
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        ambIntensity,
        damping
      );
    }
  });

  return (
    <>
      <fog attach="fog" ref={fogRef} args={['#010e1a', 6, 42]} />
      <ambientLight ref={ambientRef} intensity={1.6} />

      {/* ── 5 Photorealistic Continuous Stratigraphic Biomes ── */}
      <ArcheanOceanBiome />
      <MesozoicCretaceousBiome />
      <ChicxulubImpactBiome />
      <PleistoceneGlacialBiome />
      <AnthropoceneSanctuaryBiome />

      {/* ── Post-Processing Pipeline: Glow, Bloom & Lens Falloff ── */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.5}
          luminanceSmoothing={0.8}
          intensity={1.1}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.12} darkness={0.65} />
      </EffectComposer>
    </>
  );
}
