'use client';

import React, { useRef, useMemo, useState, Suspense } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Html, useGLTF, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { MuseumEntity } from '@/types/museum';
import { AntikytheraModel } from './AntikytheraModel';
import { CanvasModelLoader } from './ModelLoader';
import { retainGLTF } from '@/utils/disposeGLTF';

export type LightingPreset = 'museum' | 'dramatic' | 'uv' | 'xray';

export interface SpecimenHotspot {
  id: string;
  label: string;
  detail: string;
  position: [number, number, number];
  zoomPosition: [number, number, number];
}

export const SPECIMEN_HOTSPOTS: Record<string, SpecimenHotspot[]> = {
  'trex-sue': [
    {
      id: 'dentition',
      label: 'Serrated Maxillary Teeth',
      detail: 'Up to 30.5 cm long with deep anchoring roots. Microscopic denticle serrations delivering 57,000 N bite force.',
      position: [0.65, -0.3, 1.2],
      zoomPosition: [1.2, -0.1, 2.2],
    },
    {
      id: 'braincase',
      label: 'Expanded Olfactory Bulb',
      detail: 'CT scan reveals an olfactory bulb ratio comparable to modern vultures, capable of smelling prey miles away.',
      position: [0.0, 0.8, -0.3],
      zoomPosition: [0.0, 1.3, 0.9],
    },
    {
      id: 'fenestra',
      label: 'Antorbital Fenestra',
      detail: 'Large cranial opening reducing skull weight while anchoring massive jaw pterygoid musculature.',
      position: [0.7, 0.2, 0.4],
      zoomPosition: [1.4, 0.3, 1.4],
    },
  ],
  'antikythera-mechanism': [
    {
      id: 'differential',
      label: 'Differential Gearing',
      detail: 'Sun-and-planet differential gears calculated the synodic month and epicyclic lunar anomalies 1,500 years before modern clocks.',
      position: [0.0, 0.0, 0.25],
      zoomPosition: [0.0, 0.0, 1.3],
    },
    {
      id: 'saros',
      label: '223-Month Saros Spiral',
      detail: 'Rear spiral dial predicted solar and lunar eclipses with exact hours and celestial glyphs.',
      position: [0.7, -0.5, 0.15],
      zoomPosition: [1.1, -0.6, 1.2],
    },
  ],
  'voyager-golden-record': [
    {
      id: 'pulsar-map',
      label: '14-Pulsar Map',
      detail: 'Lines radiate from our Sun to 14 known pulsars with binary timing ticks recording exact pulsar periods at launch.',
      position: [0.0, 0.0, 0.15],
      zoomPosition: [0.0, 0.0, 1.4],
    },
    {
      id: 'hydrogen-clock',
      label: 'Hydrogen Hyperfine Transition',
      detail: 'The fundamental atomic clock: 1,420 MHz (21 cm), establishing universal units of time and length for extraterrestrial discoverers.',
      position: [0.85, 0.0, 0.15],
      zoomPosition: [1.1, 0.0, 1.3],
    },
  ],
  'stromatolite-pilbara': [
    {
      id: 'laminations',
      label: 'Microbial Laminations',
      detail: 'Alternating micro-layers of sediment bound by ancient photosynthetic cyanobacteria colonies in shallow Archean tidal flats.',
      position: [0.0, 0.4, 0.85],
      zoomPosition: [0.0, 0.6, 1.6],
    },
    {
      id: 'oxygen-pulse',
      label: 'Oxygenation Horizon',
      detail: 'First biological generation of O2, triggering the global precipitation of dissolved iron into Banded Iron Formations.',
      position: [0.65, -0.2, 0.85],
      zoomPosition: [1.0, -0.2, 1.5],
    },
  ],
  'kpg-boundary-clay': [
    {
      id: 'iridium-strata',
      label: '3mm Iridium Horizon',
      detail: 'Extraterrestrial iridium concentration 30× background crustal levels, marking the precise moment of Chicxulub bolide impact.',
      position: [0.0, 0.0, 0.85],
      zoomPosition: [0.0, 0.0, 1.4],
    },
    {
      id: 'shocked-quartz',
      label: 'Shocked Quartz Lamellae',
      detail: 'Microscopic quartz grains deformed by extreme kinetic impact shock pressures over 10 Gigapascals.',
      position: [0.0, -0.65, 0.85],
      zoomPosition: [0.0, -0.7, 1.5],
    },
  ],
  'rosetta-stone': [
    {
      id: 'hieroglyphs',
      label: 'Hieroglyphic Decree',
      detail: 'Top register in Egyptian hieroglyphs, the sacred script utilized by the priesthood.',
      position: [0.0, 0.75, 0.15],
      zoomPosition: [0.0, 0.8, 1.2],
    },
    {
      id: 'demotic',
      label: 'Demotic Script',
      detail: 'Middle register written in Demotic, the daily administrative script of Ptolemaic Egypt.',
      position: [0.0, 0.1, 0.15],
      zoomPosition: [0.0, 0.1, 1.2],
    },
    {
      id: 'greek',
      label: 'Ancient Greek Text',
      detail: 'Bottom register in Greek, providing the crucial translation key for Jean-François Champollion.',
      position: [0.0, -0.65, 0.15],
      zoomPosition: [0.0, -0.65, 1.2],
    },
  ],
  'tutankhamun-death-mask': [
    {
      id: 'nemes',
      label: 'Nemes Headcloth',
      detail: 'Solid gold inlaid with blue glass and lapis lazuli, bearing the royal vulture and cobra uraeus.',
      position: [0.0, 0.8, 0.3],
      zoomPosition: [0.0, 0.8, 1.4],
    },
    {
      id: 'beard',
      label: 'Osiride Divine Beard',
      detail: 'Braided lapis lazuli beard symbolizing the deceased pharaoh’s identification with Osiris.',
      position: [0.0, -0.6, 0.4],
      zoomPosition: [0.0, -0.6, 1.3],
    },
  ],
  'opabinia-regalis': [
    {
      id: 'proboscis',
      label: 'Frontal Flexible Proboscis',
      detail: 'Fused, flexible tubular nozzle ending in a dual-claw apparatus for seizing benthic soft-bodied prey.',
      position: [0.0, 0.2, 1.1],
      zoomPosition: [0.0, 0.3, 1.8],
    },
    {
      id: 'compound-eyes',
      label: '5 Stalked Compound Eyes',
      detail: 'Unprecedented 5-eye optical array providing 360-degree panoramic visual surveillance in Cambrian seas.',
      position: [0.0, 0.5, 0.3],
      zoomPosition: [0.0, 0.7, 1.1],
    },
    {
      id: 'swimming-lobes',
      label: 'Lateral Respiratory Flaps',
      detail: 'Overlapping lateral lobes bearing filamentous gills for metachronal undulatory propulsion.',
      position: [0.6, -0.1, -0.4],
      zoomPosition: [1.1, 0.0, 0.2],
    },
  ],
  'anomalocaris-canadensis': [
    {
      id: 'raptorial-limbs',
      label: 'Segmented Great Appendages',
      detail: 'Pair of jointed spiny appendages capable of flexing inward to crush trilobite exoskeletons.',
      position: [0.0, 0.1, 1.2],
      zoomPosition: [0.0, 0.2, 1.9],
    },
    {
      id: 'oral-cone',
      label: 'Radial Triradiate Oral Cone',
      detail: 'Circular mouth with 32 overlapping plates lined with pronged teeth delivering lethal suction.',
      position: [0.0, -0.4, 0.5],
      zoomPosition: [0.0, -0.3, 1.3],
    },
    {
      id: 'compound-optics',
      label: 'Compound Optical Stalks',
      detail: 'Over 30,000 hexagonal ommatidia lenses per eye, conferring superlative apex predator visual acuity.',
      position: [0.55, 0.4, 0.4],
      zoomPosition: [0.9, 0.6, 1.1],
    },
  ],
  'dunkleosteus-terrelli': [
    {
      id: 'gnathal-plates',
      label: 'Self-Sharpening Gnathal Shears',
      detail: 'Vascularized bone plates acting as scissor blades, focusing 7,400 N of force at the anterior cusp tip.',
      position: [0.0, -0.2, 1.0],
      zoomPosition: [0.0, -0.1, 1.7],
    },
    {
      id: 'nuchal-joint',
      label: 'Ball-and-Socket Nuchal Hinge',
      detail: 'Articulated biomechanical neck joint enabling the armored skull to snap upward in 50 milliseconds.',
      position: [0.0, 0.7, 0.0],
      zoomPosition: [0.0, 1.0, 0.8],
    },
  ],
  'tiktaalik-roseae': [
    {
      id: 'wrist-joint',
      label: 'Functional Proto-Wrist',
      detail: 'Internal radial and ulnar bones terminating in wrist-like joints capable of lifting body weight on land.',
      position: [0.7, -0.3, 0.3],
      zoomPosition: [1.1, -0.2, 1.0],
    },
    {
      id: 'mobile-neck',
      label: 'Independent Mobile Neck',
      detail: 'Loss of opercular gill plates created the first mobile neck in tetrapod evolutionary history.',
      position: [0.0, 0.4, 0.6],
      zoomPosition: [0.0, 0.6, 1.3],
    },
  ],
  'dimetrodon-grandis': [
    {
      id: 'neural-sail',
      label: 'Vascularized Thermal Sail',
      detail: 'Massively elongated vertebral spines supporting a blood-perfused sail for active solar thermoregulation.',
      position: [0.0, 0.8, -0.1],
      zoomPosition: [0.0, 1.2, 1.1],
    },
    {
      id: 'heterodont-dentition',
      label: 'Dual Canine Dentition',
      detail: 'First synapsid with differentiated teeth: incisors for puncturing and recurved canines for shearing.',
      position: [0.0, -0.2, 0.9],
      zoomPosition: [0.0, -0.1, 1.6],
    },
  ],
  'archaeopteryx-london': [
    {
      id: 'flight-feathers',
      label: 'Aerodynamic Asymmetric Remiges',
      detail: 'Curved flight feathers with distinct leading edges generating aerodynamic lift for powered flight.',
      position: [0.8, 0.2, 0.0],
      zoomPosition: [1.2, 0.3, 0.8],
    },
    {
      id: 'dinosaur-tail',
      label: 'Theropod Caudal Skeleton',
      detail: 'Long bony reptilian tail vertebrae bearing frond-like feather vanes, unlike modern pygostyle tails.',
      position: [0.0, -0.5, -1.0],
      zoomPosition: [0.0, -0.4, -0.2],
    },
  ],
  'otzi-iceman': [
    {
      id: 'copper-axe',
      label: 'Arsenical Copper Axe',
      detail: 'Cast flanged axe blade (99.7% pure copper) bound to yew wood with birch tar and leather lashing.',
      position: [0.4, 0.1, 0.6],
      zoomPosition: [0.8, 0.2, 1.2],
    },
    {
      id: 'tattoos',
      label: 'Therapeutic Soot Tattoos',
      detail: '61 charcoal rub tattoos located directly along modern acupuncture meridians treating joint degeneration.',
      position: [-0.2, -0.3, 0.4],
      zoomPosition: [-0.3, -0.2, 1.0],
    },
  ],
  'nefertiti-bust': [
    {
      id: 'amarna-crown',
      label: 'Royal Flat-Topped Modius',
      detail: 'Sculpted blue crown bound with gold diadem ribbon, bearing the Amarna royal golden uraeus cobra.',
      position: [0.0, 0.9, 0.1],
      zoomPosition: [0.0, 1.0, 1.2],
    },
    {
      id: 'limestone-core',
      label: 'Layered Stucco Masterpiece',
      detail: 'CT scan reveals an internal limestone portrait carving adjusted by master sculptor Thutmose with gypsum.',
      position: [0.0, 0.2, 0.4],
      zoomPosition: [0.0, 0.3, 1.1],
    },
  ],
  'terracotta-warrior': [
    {
      id: 'topknot',
      label: 'Qin Military Coiffure & Topknot',
      detail: 'Hand-sculpted braided topknot pinned with hairpin, signifying officer rank in Qin Shi Huang’s imperial army.',
      position: [0.0, 0.9, 0.0],
      zoomPosition: [0.0, 1.0, 1.1],
    },
    {
      id: 'scale-armor',
      label: 'Overlapping Riveted Lamellar Armor',
      detail: 'Individually molded ceramic scale plates laced with modeled cords, mimicking bronze and hardened leather plates.',
      position: [0.0, 0.1, 0.3],
      zoomPosition: [0.0, 0.2, 1.1],
    },
  ],
  'megalodon-tooth': [
    {
      id: 'serrated-blade',
      label: 'Serrated Enamel Cutting Edge',
      detail: 'Chevron-shaped root with razor-sharp micro-serrations designed to crush through cetacean ribs and vertebrae.',
      position: [0.4, 0.0, 0.15],
      zoomPosition: [0.6, 0.1, 0.9],
    },
    {
      id: 'bourrelet',
      label: 'Triangular Bourrelet Horizon',
      detail: 'Distinctive V-shaped zone of exposed dentin above the massive V-shaped root lobe.',
      position: [0.0, -0.5, 0.15],
      zoomPosition: [0.0, -0.4, 0.9],
    },
  ],
};

export interface Specimen3DViewerProps {
  entity: MuseumEntity;
  lightingPreset: LightingPreset;
  wireframe?: boolean;
  autoRotate?: boolean;
  rotationSpeed?: number;
  showAnnotations?: boolean;
  explodedView?: boolean;
  showLaserPlane?: boolean;
  laserSliceY?: number;
  showCaliper?: boolean;
  enablePostprocessing?: boolean;
  activeHotspotId?: string | null;
  onSelectHotspot?: (hotspot: SpecimenHotspot | null) => void;
}

// ─── Procedural Texture Generators (Cached) ───

// Generates inscribed stone normal / bump texture for Rosetta Stone
function getStoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, 512, 512);

    // Stone grain
    for (let i = 0; i < 40000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = Math.floor(20 + Math.random() * 60);
      ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    // Inscription grooves (3 distinct script tiers)
    ctx.fillStyle = '#111111';
    for (let y = 30; y < 160; y += 8) {
      for (let x = 30; x < 480; x += 14) {
        if (Math.random() > 0.2) ctx.fillRect(x, y, 9, 3);
      }
    }
    for (let y = 180; y < 320; y += 6) {
      for (let x = 30; x < 480; x += 10) {
        if (Math.random() > 0.25) ctx.fillRect(x, y, 7, 2);
      }
    }
    for (let y = 340; y < 480; y += 5) {
      for (let x = 30; x < 480; x += 8) {
        if (Math.random() > 0.15) ctx.fillRect(x, y, 5, 2);
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Generates Akkadian cuneiform inscriptions on polished black diorite for Code of Hammurabi Stele
function getDioriteCuneiformTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Polished black diorite ground
    ctx.fillStyle = '#141416';
    ctx.fillRect(0, 0, 512, 1024);

    // Fine mineral speckles in diorite
    for (let i = 0; i < 35000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 1024;
      const gray = Math.floor(18 + Math.random() * 32);
      ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
      ctx.fillRect(x, y, 1.2, 1.2);
    }

    // Horizontal Akkadian cuneiform law registers (282 legal rulings)
    for (let y = 60; y < 980; y += 14) {
      // Horizontal baseline divider
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(24, y + 10, 464, 1.2);

      // Cuneiform wedge groupings
      for (let x = 28; x < 480; x += 12) {
        if (Math.random() > 0.18) {
          ctx.fillStyle = '#222226';
          const w = 4 + Math.random() * 6;
          ctx.fillRect(x, y + 2, w, 2.5);
          ctx.fillRect(x, y + 1, 2, 6);
        }
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Generates Voyager Golden Record etched grooves & pulsar starburst
function getRecordTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Pure gold disc
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, 0, 1024, 1024);

    const cx = 512;
    const cy = 512;

    // Phonograph tracks / concentric micro-grooves
    ctx.strokeStyle = '#997a15';
    ctx.lineWidth = 1;
    for (let r = 80; r < 480; r += 2.5) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Central pulsar map
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 14; i++) {
      const angle = (i * Math.PI * 2) / 14 + i * 0.1;
      const len = 120 + ((i * 37) % 180);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      ctx.stroke();
    }

    // Binary code ticks
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const a = (i * Math.PI * 2) / 40;
      const x = cx + Math.cos(a) * 440;
      const y = cy + Math.sin(a) * 440;
      ctx.fillRect(x - 2, y - 2, 4, 4);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ─── Holographic Laser CT Scan Plane & Emitting Beacons ───
function LaserScanPlane({
  active,
  yLevel = 0,
  color = '#00ffff',
}: {
  active: boolean;
  yLevel: number;
  color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        yLevel,
        delta * 8
      );
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
    }
  });

  if (!active) return null;

  return (
    <>
      {/* Dynamic Slicing Hologram Plane */}
      <group ref={groupRef} position={[0, yLevel, 0]}>
        {/* Semi-transparent grid slice plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.4, 4.4]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.16}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Laser Grid lines */}
        <gridHelper args={[4.4, 18, color, '#004466']} position={[0, 0.005, 0]} />

        {/* Outer targeting laser ring */}
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.06, 64]} />
          <meshBasicMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Slicing Point Light */}
        <pointLight color={color} intensity={3.5} distance={4} />
      </group>

      {/* 4 Vertical Holographic Corner Beacons */}
      {[
        [-2.2, -2.2],
        [2.2, -2.2],
        [-2.2, 2.2],
        [2.2, 2.2],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 4.5, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.35} />
          </mesh>
          <mesh position={[0, yLevel, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </>
  );
}

// ─── Precision Museum Dimension Caliper Overlay ───
function DimensionCaliperOverlay({
  active,
  color = '#ffd700',
}: {
  active: boolean;
  color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.006;
      groupRef.current.scale.set(s, s, s);
    }
  });

  if (!active) return null;

  const bx = 1.9;
  const by = 1.5;
  const bz = 1.6;

  return (
    <group ref={groupRef}>
      {/* ── Width Caliper (Bottom Front X-Axis) ── */}
      <group position={[0, -by, bz]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[bx * 2, 0.015, 0.015]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[-bx, 0.08, 0]}>
          <boxGeometry args={[0.015, 0.18, 0.015]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[bx, 0.08, 0]}>
          <boxGeometry args={[0.015, 0.18, 0.015]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.04, 0.08, 4]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* ── Height Caliper (Left Front Y-Axis) ── */}
      <group position={[-bx, 0, bz]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.015, by * 2, 0.015]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[0.08, by, 0]}>
          <boxGeometry args={[0.18, 0.015, 0.015]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[0.08, -by, 0]}>
          <boxGeometry args={[0.18, 0.015, 0.015]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* ── Depth Caliper (Right Side Z-Axis) ── */}
      <group position={[bx, -by, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.015, 0.015, bz * 2]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.08, bz]}>
          <boxGeometry args={[0.015, 0.18, 0.015]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.08, -bz]}>
          <boxGeometry args={[0.015, 0.18, 0.015]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* 8 Bounding Corner Reticles */}
      {[
        [-bx, -by, -bz],
        [bx, -by, -bz],
        [-bx, by, -bz],
        [bx, by, -bz],
        [-bx, -by, bz],
        [bx, -by, bz],
        [-bx, by, bz],
        [bx, by, bz],
      ].map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Procedural Specimen Meshes with Exploded-View Support ───

// 1. T-REX SUE SKULL / THEROPOD
function TRexSkullMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const boneColor = isXray ? '#00f0ff' : '#d2c0a5';
  const teethColor = isXray ? '#ffffff' : '#f5eedd';

  const craniumRef = useRef<THREE.Group>(null);
  const maxillaRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const target = exploded ? 1 : 0;
    if (craniumRef.current) {
      craniumRef.current.position.y = THREE.MathUtils.lerp(
        craniumRef.current.position.y,
        0.4 + target * 0.45,
        delta * 6
      );
      craniumRef.current.position.z = THREE.MathUtils.lerp(
        craniumRef.current.position.z,
        -0.4 - target * 0.35,
        delta * 6
      );
    }
    if (maxillaRef.current) {
      maxillaRef.current.position.z = THREE.MathUtils.lerp(
        maxillaRef.current.position.z,
        1.1 + target * 0.5,
        delta * 6
      );
    }
    if (jawRef.current) {
      jawRef.current.position.y = THREE.MathUtils.lerp(
        jawRef.current.position.y,
        -0.65 - target * 0.55,
        delta * 6
      );
    }
  });

  return (
    <group position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Cranium / Braincase */}
      <group ref={craniumRef} position={[0, 0.4, -0.4]}>
        <mesh>
          <boxGeometry args={[1.5, 1.2, 1.8]} />
          <meshStandardMaterial
            color={boneColor}
            roughness={isXray ? 0.1 : 0.65}
            metalness={isXray ? 0.8 : 0.15}
            wireframe={isXray}
            emissive={isXray ? '#0088aa' : '#000000'}
            emissiveIntensity={isXray ? 0.6 : 0}
          />
        </mesh>
        {/* Eye Socket Fenestra */}
        <mesh position={[-0.76, 0, 0.5]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.2, 0.45, 12]} />
          <meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.76, 0, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
          <ringGeometry args={[0.2, 0.45, 12]} />
          <meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Snout / Maxilla */}
      <group ref={maxillaRef} position={[0, 0.1, 1.1]}>
        <mesh>
          <boxGeometry args={[1.1, 1.0, 1.8]} />
          <meshStandardMaterial
            color={boneColor}
            roughness={isXray ? 0.1 : 0.7}
            metalness={isXray ? 0.8 : 0.15}
            wireframe={isXray}
          />
        </mesh>
        {/* Nostril Cavity */}
        <mesh position={[0, 0.3, 0.6]}>
          <coneGeometry args={[0.3, 0.5, 4]} />
          <meshStandardMaterial color="#111111" wireframe={isXray} />
        </mesh>
        {/* Serrated Upper Teeth Row */}
        {[-0.45, 0.45].map((xSide, sideIdx) => (
          <group key={`teeth-upper-${sideIdx}`}>
            {[-0.5, -0.1, 0.3, 0.7].map((zPos, toothIdx) => (
              <mesh
                key={toothIdx}
                position={[xSide, -0.55, zPos]}
                rotation={[Math.PI, 0, 0]}
              >
                <coneGeometry args={[0.08, 0.4, 5]} />
                <meshStandardMaterial color={teethColor} roughness={0.3} wireframe={isXray} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Lower Jaw (Dentary) */}
      <group ref={jawRef} position={[0, -0.65, 0.5]}>
        <mesh>
          <boxGeometry args={[1.05, 0.45, 2.5]} />
          <meshStandardMaterial
            color={boneColor}
            roughness={isXray ? 0.1 : 0.7}
            wireframe={isXray}
          />
        </mesh>
        {/* Lower Teeth */}
        {[-0.4, 0.4].map((xSide, sideIdx) => (
          <group key={`teeth-lower-${sideIdx}`}>
            {[-0.6, -0.2, 0.2, 0.6].map((zPos, toothIdx) => (
              <mesh key={toothIdx} position={[xSide, 0.28, zPos]}>
                <coneGeometry args={[0.07, 0.32, 5]} />
                <meshStandardMaterial color={teethColor} roughness={0.3} wireframe={isXray} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Museum Armature Mount Base */}
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.5, 8]} />
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -2.05, 0]}>
        <cylinderGeometry args={[1.2, 1.3, 0.15, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
    </group>
  );
}

// 2. AMMONITE / PREHISTORIC FOSSIL SPIRAL
function AmmoniteMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const shellColor = isXray ? '#00e1ff' : '#d49b6a';
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetScale = exploded ? 1.45 : 1.3;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    }
  });

  return (
    <group ref={groupRef} scale={[1.3, 1.3, 1.3]} rotation={[0.3, 0.4, 0]}>
      {/* Concentric spiral chambers with radial expansion */}
      {[0.5, 0.9, 1.3, 1.7, 2.0].map((radius, idx) => (
        <mesh
          key={idx}
          rotation={[Math.PI / 2, 0, idx * 0.4]}
          position={[0, 0, (exploded ? (idx - 2) * 0.15 : 0)]}
        >
          <torusGeometry args={[radius * 0.7, 0.22 + idx * 0.08, 16, 48, Math.PI * 1.85]} />
          <meshStandardMaterial
            color={shellColor}
            roughness={isXray ? 0.1 : 0.4}
            metalness={isXray ? 0.8 : 0.3}
            wireframe={isXray}
            emissive={isXray ? '#0066aa' : '#331500'}
            emissiveIntensity={isXray ? 0.5 : 0.1}
          />
        </mesh>
      ))}

      {/* Calcite core center */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#fcefd5" roughness={0.2} metalness={0.4} wireframe={isXray} />
      </mesh>
    </group>
  );
}

// 3. ARCHAEOPTERYX / LIMESTONE FEATHER SLAB
function ArchaeopteryxMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const reliefRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reliefRef.current) {
      const targetZ = exploded ? 0.4 : 0.06;
      reliefRef.current.position.z = THREE.MathUtils.lerp(reliefRef.current.position.z, targetZ, delta * 6);
    }
  });

  return (
    <group rotation={[-0.2, 0.3, 0]}>
      {/* Solnhofen Limestone Slab */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[3.2, 2.5, 0.25]} />
        <meshStandardMaterial
          color={isXray ? '#112233' : '#e6d8ba'}
          roughness={0.9}
          wireframe={isXray}
        />
      </mesh>

      {/* Carbonized Plumage & Skeletal Relief floats in Exploded Mode */}
      <group ref={reliefRef} position={[0, 0, 0.06]}>
        <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, 0.4]}>
          <coneGeometry args={[0.6, 1.4, 6]} />
          <meshStandardMaterial
            color={isXray ? '#00ffff' : '#4a3c2c'}
            roughness={0.7}
            wireframe={isXray}
          />
        </mesh>
        <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, -0.4]}>
          <coneGeometry args={[0.6, 1.4, 6]} />
          <meshStandardMaterial
            color={isXray ? '#00ffff' : '#4a3c2c'}
            roughness={0.7}
            wireframe={isXray}
          />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.04, 0.08, 1.1, 8]} />
          <meshStandardMaterial color={isXray ? '#00ffff' : '#3d3023'} wireframe={isXray} />
        </mesh>
      </group>
    </group>
  );
}

// 4. ROSETTA STONE STELE
function RosettaStoneMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const stoneTex = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return getStoneTexture();
  }, []);

  const archRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (archRef.current) {
      const targetY = exploded ? 1.8 : 1.35;
      archRef.current.position.y = THREE.MathUtils.lerp(archRef.current.position.y, targetY, delta * 6);
    }
  });

  return (
    <group scale={[1.2, 1.2, 1.2]} rotation={[0.1, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.0, 2.8, 0.35]} />
        <meshStandardMaterial
          color={isXray ? '#00ffee' : '#2a2a2a'}
          bumpMap={stoneTex || undefined}
          bumpScale={0.06}
          roughness={isXray ? 0.2 : 0.85}
          metalness={isXray ? 0.7 : 0.15}
          wireframe={isXray}
        />
      </mesh>

      {/* Chipped Broken Top Arch lifts in exploded mode */}
      <mesh ref={archRef} position={[-0.4, 1.35, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[1.3, 0.4, 0.36]} />
        <meshStandardMaterial color={isXray ? '#00ffee' : '#222222'} wireframe={isXray} />
      </mesh>
    </group>
  );
}

// 4b. MONUMENTAL CODE OF HAMMURABI DIORITE STELE (Louvre Sb 8, 1750 BCE)
function HammurabiSteleMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const cuneiformTex = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return getDioriteCuneiformTexture();
  }, []);

  const reliefRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (reliefRef.current) {
      const targetY = exploded ? 0.95 : 0;
      const targetZ = exploded ? 0.35 : 0;
      reliefRef.current.position.y = THREE.MathUtils.lerp(reliefRef.current.position.y, targetY, delta * 6);
      reliefRef.current.position.z = THREE.MathUtils.lerp(reliefRef.current.position.z, targetZ, delta * 6);
    }
    if (coreRef.current) {
      const targetScale = exploded ? 1 : 0.001;
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, targetScale, delta * 6));
    }
  });

  const dioriteColor = isXray ? '#00f7ff' : '#141416';
  const goldAccent = isXray ? '#00ffee' : '#caa04d';

  return (
    <group scale={[1.2, 1.2, 1.2]} position={[0, -0.2, 0]}>
      {/* ── 1. Monolithic Stele Inscribed Shaft (Lower & Middle Register) ── */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.72, 0.85, 2.5, 32, 1, false, 0, Math.PI * 2]} />
        <meshStandardMaterial
          color={dioriteColor}
          bumpMap={cuneiformTex || undefined}
          bumpScale={0.06}
          roughness={isXray ? 0.2 : 0.38}
          metalness={isXray ? 0.8 : 0.25}
          wireframe={isXray}
        />
      </mesh>

      {/* Domed Stele Crest */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color={dioriteColor}
          roughness={isXray ? 0.2 : 0.32}
          metalness={isXray ? 0.8 : 0.25}
          wireframe={isXray}
        />
      </mesh>

      {/* Stele Basalt Plinth Foot */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.92, 0.98, 0.2, 32]} />
        <meshStandardMaterial
          color={isXray ? '#00f7ff' : '#0e0e10'}
          roughness={0.7}
          metalness={0.1}
          wireframe={isXray}
        />
      </mesh>

      {/* ── 2. Upper Bas-Relief Sculptural Register (Investiture of Hammurabi by Shamash) ── */}
      <group ref={reliefRef} position={[0, 0, 0]}>
        {/* Relief Backdrop Panel */}
        <mesh position={[0, 0.65, 0.65]}>
          <boxGeometry args={[1.18, 0.85, 0.12]} />
          <meshStandardMaterial
            color={isXray ? '#00f7ff' : '#18181b'}
            roughness={0.4}
            metalness={0.3}
            wireframe={isXray}
          />
        </mesh>

        {/* Shamash the Sun God (Right): Enthroned with Solar Ray Flares */}
        <group position={[0.26, 0.58, 0.72]}>
          {/* Seated God Torso & Tiered Robe */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.3, 0.52, 0.18]} />
            <meshStandardMaterial color={dioriteColor} roughness={0.3} metalness={0.3} wireframe={isXray} />
          </mesh>
          {/* Tiered Horned Headdress of Divinity */}
          <mesh position={[0, 0.34, 0]}>
            <cylinderGeometry args={[0.07, 0.12, 0.18, 12]} />
            <meshStandardMaterial color={goldAccent} roughness={0.25} metalness={0.7} wireframe={isXray} />
          </mesh>
          {/* Solar Light Rays Radiating from Shoulders */}
          {[-0.14, 0.14].map((ox, idx) => (
            <mesh key={idx} position={[ox, 0.22, -0.02]} rotation={[0, 0, idx === 0 ? 0.35 : -0.35]}>
              <boxGeometry args={[0.06, 0.22, 0.04]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.35} />
            </mesh>
          ))}
          {/* Sceptre and Ring of Divine Justice extended in hand */}
          <mesh position={[-0.2, 0.12, 0.05]} rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.055, 0.015, 8, 16]} />
            <meshStandardMaterial color={goldAccent} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* King Hammurabi (Left): Standing Reverently in Prayer */}
        <group position={[-0.26, 0.54, 0.72]}>
          {/* Standing Royal Mantle */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.17, 0.62, 12]} />
            <meshStandardMaterial color={dioriteColor} roughness={0.35} metalness={0.3} wireframe={isXray} />
          </mesh>
          {/* Royal Cap / Turban of Babylon */}
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.11, 12]} />
            <meshStandardMaterial color={goldAccent} roughness={0.3} metalness={0.6} wireframe={isXray} />
          </mesh>
          {/* Raised Arm in Gesture of Veneration */}
          <mesh position={[0.12, 0.16, 0.04]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.045, 0.18, 0.045]} />
            <meshStandardMaterial color={dioriteColor} roughness={0.35} metalness={0.3} wireframe={isXray} />
          </mesh>
        </group>
      </group>

      {/* Exploded Mode Internal Diorite Crystalline Matrix */}
      <mesh ref={coreRef} position={[0, 0.65, 0]} scale={[0.001, 0.001, 0.001]}>
        <octahedronGeometry args={[0.48]} />
        <meshStandardMaterial
          color="#caa04d"
          metalness={0.95}
          roughness={0.15}
          emissive="#caa04d"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

// 5. TUTANKHAMUN 24K GOLD FUNERARY MASK
function TutankhamunMaskMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const goldColor = isXray ? '#00f0ff' : '#ffd700';
  const lapisColor = isXray ? '#0044ff' : '#102a71';

  const faceRef = useRef<THREE.Group>(null);
  const headdressRef = useRef<THREE.Group>(null);
  const beardRef = useRef<THREE.Mesh>(null);
  const crestRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const target = exploded ? 1 : 0;
    if (faceRef.current) {
      faceRef.current.position.z = THREE.MathUtils.lerp(
        faceRef.current.position.z,
        0.2 + target * 0.85,
        delta * 6
      );
    }
    if (headdressRef.current) {
      headdressRef.current.position.z = THREE.MathUtils.lerp(
        headdressRef.current.position.z,
        -0.1 - target * 0.6,
        delta * 6
      );
    }
    if (beardRef.current) {
      beardRef.current.position.y = THREE.MathUtils.lerp(
        beardRef.current.position.y,
        -0.85 - target * 0.65,
        delta * 6
      );
    }
    if (crestRef.current) {
      crestRef.current.position.y = THREE.MathUtils.lerp(
        crestRef.current.position.y,
        1.15 + target * 0.6,
        delta * 6
      );
    }
  });

  return (
    <group scale={[1.3, 1.3, 1.3]} rotation={[0.1, 0, 0]}>
      {/* Imperial Face Mask */}
      <group ref={faceRef} position={[0, 0.1, 0.2]}>
        <mesh>
          <sphereGeometry args={[0.85, 24, 24]} />
          <meshStandardMaterial
            color={goldColor}
            metalness={0.9}
            roughness={0.15}
            wireframe={isXray}
          />
        </mesh>
      </group>

      {/* Nemes Headdress Wings with Inset Lapis Bands */}
      <group ref={headdressRef} position={[0, 0.2, -0.1]}>
        <mesh>
          <cylinderGeometry args={[1.2, 0.8, 1.8, 16]} />
          <meshStandardMaterial
            color={goldColor}
            metalness={0.85}
            roughness={0.2}
            wireframe={isXray}
          />
        </mesh>
        {[-0.6, -0.2, 0.2, 0.6].map((y, i) => (
          <mesh key={i} position={[0, y, 0.05]}>
            <cylinderGeometry args={[1.22, 0.82, 0.12, 16]} />
            <meshStandardMaterial
              color={lapisColor}
              roughness={0.3}
              metalness={0.4}
              wireframe={isXray}
            />
          </mesh>
        ))}
      </group>

      {/* Ceremonial Braided Osiris Beard */}
      <mesh ref={beardRef} position={[0, -0.85, 0.4]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.08, 0.9, 12]} />
        <meshStandardMaterial color={goldColor} metalness={0.95} roughness={0.1} wireframe={isXray} />
      </mesh>

      {/* Cobra (Wadjet) & Vulture Crest */}
      <mesh ref={crestRef} position={[0, 1.15, 0.35]}>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} wireframe={isXray} />
      </mesh>
    </group>
  );
}

// 6. VOYAGER GOLDEN RECORD
function VoyagerRecordMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const recordRef = useRef<THREE.Group>(null);
  const coverRef = useRef<THREE.Group>(null);
  const recordTex = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return getRecordTexture();
  }, []);

  useFrame((_, delta) => {
    if (recordRef.current) {
      recordRef.current.rotation.z += delta * 0.4;
    }
    if (coverRef.current) {
      const targetZ = exploded ? 0.9 : 0.08;
      coverRef.current.position.z = THREE.MathUtils.lerp(
        coverRef.current.position.z,
        targetZ,
        delta * 6
      );
    }
  });

  return (
    <group scale={[1.4, 1.4, 1.4]} rotation={[0.3, 0.4, 0]}>
      {/* 24K Gold Electroplated Phonograph Disc */}
      <group ref={recordRef}>
        <mesh>
          <cylinderGeometry args={[1.8, 1.8, 0.04, 64]} />
          <meshStandardMaterial
            color={isXray ? '#00e5ff' : '#d4af37'}
            map={recordTex || undefined}
            metalness={isXray ? 0.8 : 0.95}
            roughness={isXray ? 0.1 : 0.15}
            wireframe={isXray}
            emissive={isXray ? '#006688' : '#332200'}
            emissiveIntensity={isXray ? 0.5 : 0.1}
          />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* Protective Aluminum Shield cover floats in Exploded View */}
      <group ref={coverRef} position={[0, 0, 0.08]}>
        <mesh>
          <ringGeometry args={[0.4, 1.82, 48]} />
          <meshStandardMaterial
            color={isXray ? '#00ffff' : '#b0b8c0'}
            metalness={0.9}
            roughness={0.25}
            transparent
            opacity={exploded ? 0.7 : 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Floating magnetic zero-g mount pins */}
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.9} />
      </mesh>
      <mesh position={[0, -2.7, 0]}>
        <cylinderGeometry args={[1.3, 1.4, 0.15, 32]} />
        <meshStandardMaterial color="#111111" metalness={0.8} />
      </mesh>
    </group>
  );
}

// 7. APOLLO 11 LUNAR BASALT / METEORITE
function LunarBasaltMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y += delta * 0.3;
      const targetScale = exploded ? 1.6 : 1.0;
      ringsRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    }
  });

  return (
    <group scale={[1.3, 1.3, 1.3]}>
      {/* Porous volcanic lunar rock */}
      <mesh>
        <dodecahedronGeometry args={[1.6, 2]} />
        <meshStandardMaterial
          color={isXray ? '#00f7ff' : '#3a3a40'}
          roughness={isXray ? 0.1 : 0.95}
          metalness={isXray ? 0.9 : 0.3}
          wireframe={isXray}
          emissive={isXray ? '#005577' : '#000000'}
        />
      </mesh>

      {/* Micrometeorite impact glass pits */}
      {[-0.6, 0.7, -0.3].map((x, i) => (
        <mesh key={i} position={[x, (i - 1) * 0.5, 1.2]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.9} wireframe={isXray} />
        </mesh>
      ))}

      {/* Floating Zero-G Field Rings */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.4, 0.02, 16, 64]} />
          <meshBasicMaterial color="#00ffcc" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// 8. CHICXULUB / STRATIFIED DRILL CORE
function StratifiedCoreMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const baseRef = useRef<THREE.Mesh>(null);
  const capRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const target = exploded ? 1 : 0;
    if (baseRef.current) {
      baseRef.current.position.y = THREE.MathUtils.lerp(
        baseRef.current.position.y,
        -0.9 - target * 0.7,
        delta * 6
      );
    }
    if (capRef.current) {
      capRef.current.position.y = THREE.MathUtils.lerp(
        capRef.current.position.y,
        0.7 + target * 0.7,
        delta * 6
      );
    }
  });

  return (
    <group scale={[1.2, 1.2, 1.2]}>
      {/* Acrylic outer core tube */}
      <mesh>
        <cylinderGeometry args={[0.7, 0.7, 3.4, 32]} />
        <meshPhysicalMaterial
          transparent
          opacity={exploded ? 0.15 : 0.3}
          roughness={0.1}
          transmission={0.85}
          ior={1.5}
        />
      </mesh>

      {/* Cretaceous Chalk Base */}
      <mesh ref={baseRef} position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.66, 0.66, 1.2, 32]} />
        <meshStandardMaterial color={isXray ? '#0088ff' : '#e0dbce'} roughness={0.9} wireframe={isXray} />
      </mesh>

      {/* The 3mm Dark Iridium Impact Fallout Boundary! */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.67, 0.67, 0.12, 32]} />
        <meshStandardMaterial
          color={isXray ? '#ff0055' : '#8b0000'}
          emissive={isXray ? '#ff0033' : '#ff2200'}
          emissiveIntensity={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Paleogene Recovery Sediment */}
      <mesh ref={capRef} position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.66, 0.66, 1.6, 32]} />
        <meshStandardMaterial color={isXray ? '#00e1ff' : '#887d72'} roughness={0.85} wireframe={isXray} />
      </mesh>
    </group>
  );
}

// 9. SMILODON SABER-TOOTHED CAT SKULL
function SmilodonMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const boneColor = isXray ? '#00f0ff' : '#cfc3b0';
  const daggerColor = isXray ? '#ffffff' : '#faf3e6';

  const craniumRef = useRef<THREE.Mesh>(null);
  const snoutRef = useRef<THREE.Mesh>(null);
  const jawRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const target = exploded ? 1 : 0;
    if (craniumRef.current) {
      craniumRef.current.position.y = THREE.MathUtils.lerp(
        craniumRef.current.position.y,
        0.3 + target * 0.45,
        delta * 6
      );
      craniumRef.current.position.z = THREE.MathUtils.lerp(
        craniumRef.current.position.z,
        -0.2 - target * 0.35,
        delta * 6
      );
    }
    if (snoutRef.current) {
      snoutRef.current.position.z = THREE.MathUtils.lerp(
        snoutRef.current.position.z,
        0.7 + target * 0.5,
        delta * 6
      );
    }
    if (jawRef.current) {
      jawRef.current.position.y = THREE.MathUtils.lerp(
        jawRef.current.position.y,
        -0.5 - target * 0.55,
        delta * 6
      );
    }
  });

  return (
    <group scale={[1.2, 1.2, 1.2]}>
      {/* Cranium */}
      <mesh ref={craniumRef} position={[0, 0.3, -0.2]}>
        <boxGeometry args={[1.2, 1.0, 1.4]} />
        <meshStandardMaterial color={boneColor} roughness={0.7} wireframe={isXray} />
      </mesh>

      {/* Snout */}
      <mesh ref={snoutRef} position={[0, 0.1, 0.7]}>
        <boxGeometry args={[0.9, 0.7, 1.0]} />
        <meshStandardMaterial color={boneColor} roughness={0.7} wireframe={isXray} />
      </mesh>

      {/* Elongated 20cm curved saber canines! */}
      {[-0.35, 0.35].map((x, i) => (
        <mesh
          key={i}
          position={[x * (exploded ? 1.3 : 1), -0.45, 0.8 + (exploded ? 0.3 : 0)]}
          rotation={[0.2, 0, i === 0 ? 0.08 : -0.08]}
        >
          <coneGeometry args={[0.1, 1.1, 8]} />
          <meshStandardMaterial
            color={daggerColor}
            metalness={isXray ? 0.8 : 0.2}
            roughness={0.2}
            wireframe={isXray}
            emissive={isXray ? '#00ffee' : '#000000'}
          />
        </mesh>
      ))}

      {/* Mandible */}
      <mesh ref={jawRef} position={[0, -0.5, 0.4]}>
        <boxGeometry args={[0.8, 0.3, 1.5]} />
        <meshStandardMaterial color={boneColor} roughness={0.7} wireframe={isXray} />
      </mesh>
    </group>
  );
}

// 10. DIMETRODON GRANDIS SYNAPSID (With Radiating Neural Spine Sail)
function DimetrodonHallMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const boneColor = isXray ? '#00f0ff' : '#8c4b28';
  const sailColor = isXray ? '#006688' : '#e0701a';
  const spineColor = isXray ? '#ffffff' : '#d2c0a5';

  return (
    <group scale={[1.1, 1.1, 1.1]}>
      {/* Quadruped Synapsid Torso */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.7, 2.4]} />
        <meshStandardMaterial color={boneColor} roughness={0.65} wireframe={isXray} />
      </mesh>

      {/* Skull with predatory snout and caniniform teeth */}
      <group position={[0, 0.35, 1.4 + (exploded ? 0.35 : 0)]}>
        <mesh>
          <boxGeometry args={[0.9, 0.75, 1.2]} />
          <meshStandardMaterial color={boneColor} roughness={0.6} wireframe={isXray} />
        </mesh>
        {/* Recurved Caniniform Fangs */}
        {[-0.38, 0.38].map((x, i) => (
          <mesh key={i} position={[x, -0.4, 0.3]} rotation={[0.2, 0, 0]}>
            <coneGeometry args={[0.07, 0.45, 6]} />
            <meshStandardMaterial color="#f0e6d2" roughness={0.3} wireframe={isXray} />
          </mesh>
        ))}
      </group>

      {/* Monumental Radiating Neural Spine Sail */}
      <group position={[0, 0.55 + (exploded ? 0.35 : 0), 0]}>
        {/* Webbed Vascular Membrane */}
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[0.04, 1.7, 2.1]} />
          <meshStandardMaterial
            color={sailColor}
            roughness={0.4}
            metalness={0.1}
            wireframe={isXray}
            transparent
            opacity={0.92}
          />
        </mesh>
        {/* Neural Spine Struts */}
        {[-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9].map((z, idx) => {
          const height = 1.9 - Math.abs(z) * 0.7;
          return (
            <mesh key={idx} position={[0, height * 0.5, z]}>
              <cylinderGeometry args={[0.035, 0.05, height, 8]} />
              <meshStandardMaterial color={spineColor} roughness={0.3} wireframe={isXray} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// 11. ANTIKYTHERA MECHANISM (Concentric Astronomical Bronze Gear Train)
function AntikytheraHallMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const bronze = isXray ? '#00f0ff' : '#caa04d';
  const darkBronze = isXray ? '#005577' : '#7a5a22';

  return (
    <group scale={[1.2, 1.2, 1.2]} rotation={[0.4, 0, 0]}>
      {/* Outer Bronze Frame */}
      <mesh>
        <boxGeometry args={[2.0, 2.0, 0.14]} />
        <meshStandardMaterial color={darkBronze} roughness={0.35} metalness={0.88} wireframe={isXray} />
      </mesh>

      {/* Concentric Astronomical Rings & Dials */}
      <group position={[0, 0, 0.1 + (exploded ? 0.25 : 0)]}>
        <mesh>
          <ringGeometry args={[0.75, 0.92, 32]} />
          <meshStandardMaterial color={bronze} roughness={0.25} metalness={0.94} side={THREE.DoubleSide} wireframe={isXray} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshStandardMaterial color={darkBronze} roughness={0.28} metalness={0.92} side={THREE.DoubleSide} wireframe={isXray} />
        </mesh>
      </group>

      {/* Central Solar Differential Gear with Cogs */}
      <group position={[0, 0, 0.16 + (exploded ? 0.45 : 0)]}>
        <mesh>
          <cylinderGeometry args={[0.38, 0.38, 0.08, 24]} />
          <meshStandardMaterial color={bronze} roughness={0.2} metalness={0.96} wireframe={isXray} />
        </mesh>
        {/* Planetary Pointer Needles */}
        <mesh position={[0, 0.35, 0.06]}>
          <boxGeometry args={[0.04, 0.7, 0.02]} />
          <meshStandardMaterial color="#ffd700" roughness={0.15} metalness={0.98} wireframe={isXray} />
        </mesh>
        <mesh position={[0.25, 0, 0.06]} rotation={[0, 0, -Math.PI / 3]}>
          <boxGeometry args={[0.03, 0.55, 0.02]} />
          <meshStandardMaterial color="#c0c0c0" roughness={0.15} metalness={0.98} wireframe={isXray} />
        </mesh>
      </group>
    </group>
  );
}

// 12. TRICERATOPS CERATOPSIAN SKULL (Brow Horns, Nasal Horn & Occipital Frill)
function TriceratopsHallMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const boneColor = isXray ? '#00f0ff' : '#d2c0a5';
  const hornColor = isXray ? '#ffffff' : '#f5eedd';

  return (
    <group scale={[1.15, 1.15, 1.15]}>
      {/* Massive Cranial Parietosquamosal Frill */}
      <group position={[0, 0.65 + (exploded ? 0.4 : 0), -0.7 - (exploded ? 0.3 : 0)]} rotation={[-0.35, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[1.5, 0.9, 0.18, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={boneColor} roughness={0.7} metalness={0.15} wireframe={isXray} />
        </mesh>
      </group>

      {/* Central Cranium & Beaked Snout */}
      <mesh position={[0, 0.2, 0.3]}>
        <boxGeometry args={[1.1, 0.9, 1.6]} />
        <meshStandardMaterial color={boneColor} roughness={0.7} metalness={0.15} wireframe={isXray} />
      </mesh>

      {/* Dual Massive Supraorbital Brow Horns (1m curve forward) */}
      {[-0.45, 0.45].map((x, i) => (
        <mesh
          key={i}
          position={[x, 0.75 + (exploded ? 0.2 : 0), 0.5 + (exploded ? 0.2 : 0)]}
          rotation={[0.65, 0, i === 0 ? 0.12 : -0.12]}
        >
          <coneGeometry args={[0.13, 1.4, 8]} />
          <meshStandardMaterial color={hornColor} roughness={0.35} metalness={0.2} wireframe={isXray} />
        </mesh>
      ))}

      {/* Nasal Horn */}
      <mesh position={[0, 0.55, 1.1]} rotation={[0.25, 0, 0]}>
        <coneGeometry args={[0.1, 0.55, 6]} />
        <meshStandardMaterial color={hornColor} roughness={0.35} metalness={0.2} wireframe={isXray} />
      </mesh>
    </group>
  );
}

// 13. LUCY AUSTRALOPITHECUS CRANIUM (Pliocene Hominin Calvarium)
function LucyHallMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const boneColor = isXray ? '#00f0ff' : '#cbb796';

  return (
    <group scale={[1.1, 1.1, 1.1]}>
      {/* Gracile Braincase with Post-Orbital Constriction */}
      <mesh position={[0, 0.35, -0.15]}>
        <sphereGeometry args={[0.62, 16, 16]} />
        <meshStandardMaterial color={boneColor} roughness={0.65} metalness={0.15} wireframe={isXray} />
      </mesh>

      {/* Prominent Supraorbital Torus (Brow Ridge) */}
      <mesh position={[0, 0.32, 0.42]}>
        <boxGeometry args={[0.78, 0.18, 0.25]} />
        <meshStandardMaterial color={boneColor} roughness={0.6} metalness={0.15} wireframe={isXray} />
      </mesh>

      {/* Subnasal Prognathic Maxilla */}
      <mesh position={[0, 0.05, 0.5]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.62, 0.45, 0.5]} />
        <meshStandardMaterial color={boneColor} roughness={0.65} metalness={0.15} wireframe={isXray} />
      </mesh>
    </group>
  );
}

// 14. DUNKLEOSTEUS TERRELLI (Apex Placoderm Armored Skull & Gnathal Shears)
function DunkleosteusSkullMesh({ isXray, exploded }: { isXray: boolean; exploded: boolean }) {
  const armorColor = isXray ? '#00e5ff' : '#2e2722';
  const seamColor = isXray ? '#70ffff' : '#1a1613';
  const bladeColor = isXray ? '#ffffff' : '#f0e6d2';
  const eyeColor = isXray ? '#ff0055' : '#110b06';

  const jawGroupRef = useRef<THREE.Group>(null);
  const headShieldRef = useRef<THREE.Group>(null);

  // Subtle breathing / jaw snap articulation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (jawGroupRef.current && !exploded) {
      // Idle rhythmic respiratory opening and closing of gnathal shear blades
      const jawAngle = Math.sin(t * 1.5) * 0.08 + 0.08;
      jawGroupRef.current.rotation.x = jawAngle;
    }
    if (headShieldRef.current && !exploded) {
      // Coupled nuchal hinge elevation (head lifts slightly during mouth opening)
      const headAngle = Math.sin(t * 1.5) * -0.04 - 0.02;
      headShieldRef.current.rotation.x = headAngle;
    }
  });

  return (
    <group scale={[1.2, 1.2, 1.2]} position={[0, -0.1, 0]}>
      {/* ── Fixed Thoracic Shield (Posterior Dermal Armor Carapace) ── */}
      <group position={[0, 0.25 + (exploded ? 0.35 : 0), -0.7 - (exploded ? 0.6 : 0)]}>
        {/* Median Dorsal Armor Plate */}
        <mesh position={[0, 0.45, 0]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[1.5, 0.35, 1.1]} />
          <meshStandardMaterial color={armorColor} roughness={0.7} metalness={0.25} wireframe={isXray} />
        </mesh>
        {/* Lateral Anterolateral Carapace Flanges */}
        {[-0.8, 0.8].map((x, i) => (
          <mesh key={i} position={[x, 0.1, 0.1]} rotation={[0, 0, i === 0 ? 0.4 : -0.4]}>
            <boxGeometry args={[0.25, 0.8, 1.0]} />
            <meshStandardMaterial color={armorColor} roughness={0.7} metalness={0.25} wireframe={isXray} />
          </mesh>
        ))}
        {/* Nuchal Joint Condyle Sockets (Articulating Hinge) */}
        {[-0.45, 0.45].map((x, i) => (
          <mesh key={`hinge-${i}`} position={[x, 0.5, 0.55]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
            <meshStandardMaterial color={seamColor} roughness={0.5} metalness={0.5} wireframe={isXray} />
          </mesh>
        ))}
      </group>

      {/* ── Articulating Cranial Head Shield (Dorsal Skull Roof + Orbits) ── */}
      <group
        ref={headShieldRef}
        position={[0, 0.2 + (exploded ? 0.5 : 0), -0.15 + (exploded ? 0.2 : 0)]}
        rotation={exploded ? [-0.25, 0, 0] : [0, 0, 0]}
      >
        {/* Main Cranial Roof (Parietal & Postorbital Placoderm Armor Plates) */}
        <mesh position={[0, 0.4, 0.1]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[1.35, 0.3, 1.25]} />
          <meshStandardMaterial color={armorColor} roughness={0.65} metalness={0.3} wireframe={isXray} />
        </mesh>

        {/* Anterior Rostral Snout Armor */}
        <mesh position={[0, 0.25, 0.7]} rotation={[-0.45, 0, 0]}>
          <boxGeometry args={[1.05, 0.32, 0.55]} />
          <meshStandardMaterial color={armorColor} roughness={0.65} metalness={0.3} wireframe={isXray} />
        </mesh>

        {/* Sclerotic Ring Bony Eye Armor Plates (Left & Right Orbits) */}
        {[-0.62, 0.62].map((x, i) => (
          <group key={`eye-${i}`} position={[x, 0.25, 0.35]} rotation={[0, i === 0 ? -0.3 : 0.3, 0]}>
            {/* 4-Plate Bony Sclerotic Ring */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.18, 0.05, 12, 24]} />
              <meshStandardMaterial color={seamColor} roughness={0.4} metalness={0.4} wireframe={isXray} />
            </mesh>
            {/* Deep Predatory Globe */}
            <mesh>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={eyeColor} roughness={0.2} metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* ── Upper Supragnathal Shear Plates (Self-Sharpening Bony Scissor Blades) ── */}
        <group position={[0, 0.05, 0.75]}>
          {/* Anterior Upper Cusps */}
          {[-0.32, 0.32].map((x, i) => (
            <group key={`upper-fang-${i}`} position={[x, -0.05, 0.12]} rotation={[0.2, 0, i === 0 ? -0.1 : 0.1]}>
              <mesh>
                <coneGeometry args={[0.09, 0.38, 4]} />
                <meshStandardMaterial color={bladeColor} roughness={0.25} metalness={0.2} wireframe={isXray} />
              </mesh>
            </group>
          ))}
          {/* Posterior Upper Shear Blades (Beveled Scissor Edges) */}
          {[-0.4, 0.4].map((x, i) => (
            <mesh key={`upper-blade-${i}`} position={[x, -0.05, -0.18]} rotation={[0.1, 0, 0]}>
              <boxGeometry args={[0.07, 0.28, 0.52]} />
              <meshStandardMaterial color={bladeColor} roughness={0.25} metalness={0.2} wireframe={isXray} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ── Articulated Infragnathal Mandibular Jaw (Lower Shearing Blades) ── */}
      <group
        ref={jawGroupRef}
        position={[0, -0.1 - (exploded ? 0.45 : 0), 0.15 + (exploded ? 0.25 : 0)]}
        rotation={exploded ? [0.45, 0, 0] : [0.15, 0, 0]}
      >
        {/* Mandibular Symphysis (Bony Lower Chin Arch) */}
        <mesh position={[0, -0.15, 0.65]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.85, 0.2, 0.45]} />
          <meshStandardMaterial color={armorColor} roughness={0.7} metalness={0.25} wireframe={isXray} />
        </mesh>

        {/* Lower Infragnathal Razor Blades (Self-Sharpening Scissor Mandibles) */}
        {[-0.36, 0.36].map((x, i) => (
          <group key={`lower-blade-${i}`} position={[x, 0.05, 0.25]}>
            {/* Anterior Scythe Fang Tip */}
            <mesh position={[0, 0.12, 0.32]} rotation={[-0.3, 0, 0]}>
              <coneGeometry args={[0.08, 0.42, 4]} />
              <meshStandardMaterial color={bladeColor} roughness={0.2} metalness={0.2} wireframe={isXray} />
            </mesh>
            {/* Long Lateral Shearing Cutting Edge */}
            <mesh position={[0, 0.02, 0.0]} rotation={[-0.1, 0, 0]}>
              <boxGeometry args={[0.07, 0.32, 0.65]} />
              <meshStandardMaterial color={bladeColor} roughness={0.2} metalness={0.2} wireframe={isXray} />
            </mesh>
            {/* Massive Mandibular Ramus (Muscular Insertion Area) */}
            <mesh position={[0, -0.12, -0.4]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.18, 0.45, 0.6]} />
              <meshStandardMaterial color={armorColor} roughness={0.7} metalness={0.25} wireframe={isXray} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// ─── Verified Authentic 3D Models in public/models/ ───
export const VERIFIED_REAL_MODELS: Record<string, string> = {
  'stromatolite-pilbara': '/models/stromatolite.glb',
  'trilobite-paradoxides': '/models/trilobite.glb',
  'dimetrodon-grandis': '/models/dimetrodon.glb',
  'archaeopteryx-london': '/models/archaeopteryx.glb',
  'trex-sue': '/models/trex-skull.glb',
  'triceratops-hatcher': '/models/triceratops.glb',
  'velociraptor-fighting-dinosaurs': '/models/velociraptor.glb',
  'kpg-boundary-clay': '/models/kpg-boundary-core.glb',
  'megalodon-tooth': '/models/megalodon-tooth.glb',
  'lucy-australopithecus': '/models/lucy-skull.glb',
  'mammoth-lyuba': '/models/woolly-mammoth.glb',
  'smilodon-la-brea': '/models/saber-tooth-cat.glb',
  'irish-elk-megaloceros': '/models/irish-elk.glb',
  'venus-willendorf': '/models/venus-willendorf.glb',
  'otzi-iceman': '/models/otzi-iceman.glb',
  'nefertiti-bust': '/models/nefertiti-bust.glb',
  'terracotta-warrior': '/models/terracotta-warrior.glb',
  'rosetta-stone': '/models/rosetta-stone.glb',
  'antikythera-mechanism': '/models/scene.glb',
  'zircon-crystal': '/models/zircon-crystal.glb',
  'charnia-masoni': '/models/charnia-masoni.glb',
  'dickinsonia-costata': '/models/dickinsonia-costata.glb',
  'spriggina-floundersi': '/models/spriggina-floundersi.glb',
  'anomalocaris-canadensis': '/models/anomalocaris.glb',
  'opabinia-regalis': '/models/opabinia.glb',
  'tiktaalik-roseae': '/models/tiktaalik.glb',
  'meganeura-monyi': '/models/meganeura.glb',
  'placenticeras-meeki': '/models/ammonite.glb',
  'spinosaurus-skull': '/models/spinosaurus-skull.glb',
  'stegosaurus-sophie': '/models/stegosaurus.glb',
  'acheulean-handaxe': '/models/acheulean-handaxe.glb',
  'lascaux-relief': '/models/lascaux-relief.glb',
  'jomon-flame-vessel': '/models/jomon-vessel.glb',
  'uruk-cuneiform-tablet': '/models/cuneiform-tablet.glb',
};

// ─── Real 3D STL Specimen Model Renderer ───
export function RealSTLSpecimenModel({
  modelUrl,
  isXray,
  exploded,
  lightingPreset,
  isHallMode = false,
}: {
  modelUrl: string;
  isXray: boolean;
  exploded: boolean;
  lightingPreset: LightingPreset;
  isHallMode?: boolean;
}) {
  const geom = useLoader(STLLoader, modelUrl);

  const { geometry, center, scale, minY } = useMemo(() => {
    if (!geom.attributes.normal) {
      geom.computeVertexNormals();
    }
    geom.computeBoundingBox();
    const box = geom.boundingBox || new THREE.Box3();
    const c = new THREE.Vector3();
    const s = new THREE.Vector3();
    box.getCenter(c);
    box.getSize(s);
    const maxDim = Math.max(s.x, s.y, s.z);
    const targetScale = maxDim > 0 ? 2.8 / maxDim : 1;
    return { geometry: geom, center: c, scale: targetScale, minY: box.min.y };
  }, [geom]);

  const material = useMemo(() => {
    if (isXray) {
      return new THREE.MeshStandardMaterial({
        color: '#00f7ff',
        emissive: '#004466',
        emissiveIntensity: 0.6,
        wireframe: true,
        roughness: 0.3,
        metalness: 0.7,
      });
    }
    if (lightingPreset === 'uv') {
      return new THREE.MeshStandardMaterial({
        color: '#ba8c59',
        emissive: '#6a00ff',
        emissiveIntensity: 0.35,
        roughness: 0.6,
        metalness: 0.2,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: '#c89666',
      roughness: 0.65,
      metalness: 0.15,
    });
  }, [isXray, lightingPreset]);

  const finalScale = exploded ? scale * 1.25 : scale;
  const yOffset = isHallMode ? -minY : -center.y;

  return (
    <group scale={[finalScale, finalScale, finalScale]}>
      <group position={[-center.x, yOffset, -center.z]}>
        <mesh
          geometry={geometry}
          material={material}
          castShadow={false}
          receiveShadow={false}
          raycast={() => null}
        />
      </group>
    </group>
  );
}

// ─── High-Performance Real 3D GLTF/GLB Specimen Model Renderer ───
export function RealGLTFSpecimenModel({
  modelUrl,
  isXray,
  exploded,
  wireframe = false,
  lightingPreset,
  isHallMode = false,
}: {
  modelUrl: string;
  isXray: boolean;
  exploded: boolean;
  wireframe?: boolean;
  lightingPreset: LightingPreset;
  isHallMode?: boolean;
}) {
  const { scene } = useGLTF(modelUrl, '/draco/');

  // Clone geometry once and disable expensive per-pointermove raycasting on heavy meshes
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Disable raycasting over multi-million triangle meshes on pointer move
        child.raycast = () => null;
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = true;
        child.userData.originalMaterial = child.material;
      }
    });

    return clone;
  }, [scene]);

  // MUSEO SmartScene GPU Resource Management: Disposes buffers and clears cache when unmounted
  React.useEffect(() => {
    return retainGLTF(modelUrl, scene);
  }, [modelUrl, scene]);

  // Compute centroid offset, min-Y alignment, and auto-scale to fit viewer smoothly (computed ONCE)
  const { center, scale, minY } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const c = new THREE.Vector3();
    const s = new THREE.Vector3();
    box.getCenter(c);
    box.getSize(s);
    const maxDim = Math.max(s.x, s.y, s.z);
    // Target normalized max dimension is 2.8 units in R3F view
    const targetScale = maxDim > 0 ? 2.8 / maxDim : 1;
    return { center: c, scale: targetScale, minY: box.min.y };
  }, [clonedScene]);

  // Fast in-place material update without cloning geometries
  React.useEffect(() => {
    if (isXray) {
      const xrayMat = new THREE.MeshStandardMaterial({
        color: '#00f7ff',
        emissive: '#004466',
        emissiveIntensity: 0.6,
        wireframe: true,
        roughness: 0.3,
        metalness: 0.7,
      });
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = xrayMat;
        }
      });
    } else if (wireframe) {
      const wireMat = new THREE.MeshStandardMaterial({
        color: '#ffd700',
        wireframe: true,
        roughness: 0.4,
        metalness: 0.8,
      });
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = wireMat;
        }
      });
    } else {
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.userData.originalMaterial) {
            child.material = child.userData.originalMaterial;
          }
          if (lightingPreset === 'uv' && child.material && 'emissive' in child.material) {
            child.material.emissive = new THREE.Color('#6a00ff');
            child.material.emissiveIntensity = 0.35;
          }
        }
      });
    }
  }, [clonedScene, isXray, wireframe, lightingPreset]);

  const finalScale = exploded ? scale * 1.25 : scale;
  const yOffset = isHallMode ? -minY : -center.y;

  return (
    <group scale={[finalScale, finalScale, finalScale]}>
      <group position={[-center.x, yOffset, -center.z]}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

// 10. GENERAL BESPOKE SPECIMEN ROUTER
export function ActiveSpecimenModel({
  entity,
  lightingPreset,
  exploded,
  wireframe = false,
  isHallMode = false,
}: {
  entity: MuseumEntity;
  lightingPreset: LightingPreset;
  exploded: boolean;
  wireframe?: boolean;
  isHallMode?: boolean;
}) {
  const isXray = lightingPreset === 'xray';
  const id = entity.id;

  // In Hall Walkthrough Mode, only excessively massive models (>50MB) require fallback
  const HEAVY_HALL_MODELS = new Set([
    'otzi-iceman',
  ]);

  if (!isHallMode || !HEAVY_HALL_MODELS.has(id)) {
    // Real 3D Models (GLTF / GLB / STL) - strictly verified to exist on disk in public/models/
    const realUrl = VERIFIED_REAL_MODELS[id] || null;

    if (realUrl) {
      if (realUrl.endsWith('.stl')) {
        return (
          <RealSTLSpecimenModel
            modelUrl={realUrl}
            isXray={isXray}
            exploded={exploded}
            lightingPreset={lightingPreset}
            isHallMode={isHallMode}
          />
        );
      }
      return (
        <RealGLTFSpecimenModel
          modelUrl={realUrl}
          isXray={isXray}
          exploded={exploded}
          wireframe={wireframe}
          lightingPreset={lightingPreset}
          isHallMode={isHallMode}
        />
      );
    }
  }

  // Bespoke High-Performance Procedural 3D Models
  if (id.includes('dimetrodon')) {
    return <DimetrodonHallMesh isXray={isXray} exploded={exploded} />;
  }
  if (id === 'antikythera-mechanism' || id.includes('antikythera')) {
    return <AntikytheraHallMesh isXray={isXray} exploded={exploded} />;
  }
  if (id.includes('triceratops')) {
    return <TriceratopsHallMesh isXray={isXray} exploded={exploded} />;
  }
  if (id.includes('lucy')) {
    return <LucyHallMesh isXray={isXray} exploded={exploded} />;
  }
  if (id.includes('hammurabi')) {
    return <HammurabiSteleMesh isXray={isXray} exploded={exploded} />;
  }
  if (
    id.includes('trex') ||
    id.includes('velociraptor') ||
    id.includes('spinosaurus') ||
    id.includes('stegosaurus') ||
    id.includes('quetzalcoatlus')
  ) {
    return <TRexSkullMesh isXray={isXray} exploded={exploded} />;
  }
  if (
    id.includes('ammonite') ||
    id.includes('stromatolite') ||
    id.includes('burgess') ||
    id.includes('placenticeras') ||
    id.includes('grypania') ||
    id.includes('charnia') ||
    id.includes('dickinsonia') ||
    id.includes('spriggina') ||
    id.includes('trilobite')
  ) {
    return <AmmoniteMesh isXray={isXray} exploded={exploded} />;
  }
  if (id.includes('archaeopteryx') || id.includes('lascaux') || id.includes('blombos')) {
    return <ArchaeopteryxMesh isXray={isXray} exploded={exploded} />;
  }
  if (
    id.includes('rosetta') ||
    id.includes('dead-sea') ||
    id.includes('cuneiform') ||
    id.includes('uruk') ||
    id.includes('bayeux') ||
    id.includes('gutenberg')
  ) {
    return <RosettaStoneMesh isXray={isXray} exploded={exploded} />;
  }
  if (
    id.includes('tutankhamun') ||
    id.includes('nefertiti') ||
    id.includes('terracotta') ||
    id.includes('jomon') ||
    id.includes('venus')
  ) {
    return <TutankhamunMaskMesh isXray={isXray} exploded={exploded} />;
  }
  if (id.includes('voyager')) {
    return <VoyagerRecordMesh isXray={isXray} exploded={exploded} />;
  }
  if (
    id.includes('apollo') ||
    id.includes('meteorite') ||
    id.includes('megalodon') ||
    id.includes('zircon') ||
    id.includes('lomekwi') ||
    id.includes('acheulean') ||
    id.includes('handaxe')
  ) {
    return <LunarBasaltMesh isXray={isXray} exploded={exploded} />;
  }
  if (id.includes('kpg') || id.includes('core') || id.includes('isua') || id.includes('iron')) {
    return <StratifiedCoreMesh isXray={isXray} exploded={exploded} />;
  }
  if (id.includes('dunkleosteus')) {
    return <DunkleosteusSkullMesh isXray={isXray} exploded={exploded} />;
  }
  if (
    id.includes('smilodon') ||
    id.includes('mammoth') ||
    id.includes('anomalocaris') ||
    id.includes('opabinia') ||
    id.includes('tiktaalik') ||
    id.includes('meganeura')
  ) {
    return <SmilodonMesh isXray={isXray} exploded={exploded} />;
  }

  // High-Grade Procedural Crystalline Specimen Fallback
  return (
    <Float floatIntensity={exploded ? 0.1 : 0.6} speed={1.2}>
      <mesh scale={exploded ? [1.3, 1.3, 1.3] : [1, 1, 1]}>
        <dodecahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial
          color={isXray ? '#00f7ff' : lightingPreset === 'dramatic' ? '#ffd700' : '#e8dfce'}
          roughness={isXray ? 0.1 : 0.4}
          metalness={isXray ? 0.9 : 0.5}
          wireframe={isXray}
          emissive={isXray ? '#0099bb' : '#221100'}
          emissiveIntensity={isXray ? 0.5 : 0.1}
        />
      </mesh>
    </Float>
  );
}

// ─── Camera Director when Hotspot is Selected ───
function HotspotCameraDirector({
  activeHotspot,
}: {
  activeHotspot: SpecimenHotspot | null;
}) {
  const { camera, controls } = useThree();

  useFrame((_, delta) => {
    if (!activeHotspot) return;
    // Smooth exponential damping towards macro focal zoom position
    camera.position.x = THREE.MathUtils.damp(camera.position.x, activeHotspot.zoomPosition[0], 4.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, activeHotspot.zoomPosition[1], 4.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, activeHotspot.zoomPosition[2], 4.5, delta);

    // Steer OrbitControls focal target directly to the hotspot anatomical landmark
    if (controls && 'target' in controls) {
      const ctrl = controls as any;
      ctrl.target.x = THREE.MathUtils.damp(ctrl.target.x, activeHotspot.position[0], 4.5, delta);
      ctrl.target.y = THREE.MathUtils.damp(ctrl.target.y, activeHotspot.position[1], 4.5, delta);
      ctrl.target.z = THREE.MathUtils.damp(ctrl.target.z, activeHotspot.position[2], 4.5, delta);
      ctrl.update?.();
    }
  });

  return null;
}

// ─── Holographic Hotspot Marker Pin ───
function HotspotMarkerPin({
  hotspot,
  isSelected,
  onSelect,
}: {
  hotspot: SpecimenHotspot;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <group position={hotspot.position}>
      {/* Expanded invisible hit mesh for effortless clicking */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
        visible={false}
      >
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* 3D Core Sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={isSelected ? '#00ffff' : '#ffd700'} />
      </mesh>

      {/* Pulsing Target Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial
          color={isSelected ? '#00ffff' : '#ffd700'}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Billboarding HTML Badge */}
      <Html
        distanceFactor={6}
        center
        position={[0, 0.12, 0]}
        occlude
        zIndexRange={[15, 0]}
        style={{ pointerEvents: 'auto' }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] font-bold uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer whitespace-nowrap border ${
            isSelected
              ? 'bg-cyan-400 text-black border-white scale-110'
              : 'bg-black/90 text-[#ffd700] border-[#ffd700] hover:bg-[#ffd700] hover:text-black'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          <span>{hotspot.label}</span>
        </button>
      </Html>
    </group>
  );
}

// ─── Main Exported Viewer Component ───
export function Specimen3DViewer({
  entity,
  lightingPreset = 'museum',
  wireframe = false,
  autoRotate = false,
  rotationSpeed = 1.0,
  showAnnotations = false,
  explodedView = false,
  showLaserPlane = false,
  laserSliceY = 0,
  showCaliper = false,
  enablePostprocessing = true,
  activeHotspotId = null,
  onSelectHotspot,
}: Specimen3DViewerProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const hotspots = useMemo(() => SPECIMEN_HOTSPOTS[entity.id] || [], [entity.id]);
  const activeHotspot = useMemo(
    () => hotspots.find((h) => h.id === activeHotspotId) || null,
    [hotspots, activeHotspotId]
  );

  // Rotation control inside useFrame
  useFrame((_, delta) => {
    // Pause auto-spin if a hotspot is currently being inspected
    if (autoRotate && !activeHotspot && rootGroupRef.current) {
      rootGroupRef.current.rotation.y += delta * 0.3 * rotationSpeed;
    }
  });

  return (
    <>
      {/* ── Lighting Presets (Optimized Directional & Ambient, zero distance-attenuation overhead) ── */}
      {lightingPreset === 'museum' && (
        <>
          <ambientLight intensity={1.6} color="#ffffff" />
          <directionalLight position={[6, 8, 6]} intensity={3.5} color="#fff6e6" />
          <directionalLight position={[-6, -4, -4]} intensity={1.5} color="#dbe9ff" />
          <directionalLight position={[0, 4, 3]} intensity={1.8} color="#fffaed" />
        </>
      )}

      {lightingPreset === 'dramatic' && (
        <>
          <ambientLight intensity={0.6} color="#100a1c" />
          <directionalLight position={[7, 6, 4]} intensity={4.5} color="#ffb833" />
          <directionalLight position={[-7, -3, -5]} intensity={2.5} color="#0055ff" />
          <directionalLight position={[0, -2, 2]} intensity={2.0} color="#ff3300" />
        </>
      )}

      {lightingPreset === 'uv' && (
        <>
          <ambientLight intensity={0.5} color="#1b003a" />
          <directionalLight position={[0, 3, 3]} intensity={5.0} color="#aa00ff" />
          <directionalLight position={[-4, 5, 2]} intensity={3.5} color="#00ffff" />
          <directionalLight position={[4, -4, -2]} intensity={2.0} color="#ff00a0" />
        </>
      )}

      {lightingPreset === 'xray' && (
        <>
          <ambientLight intensity={0.7} color="#001524" />
          <directionalLight position={[5, 5, 5]} intensity={3.5} color="#00e5ff" />
          <directionalLight position={[-5, -5, -5]} intensity={2.5} color="#0055ff" />
          <directionalLight position={[0, 0, 4]} intensity={2.5} color="#ffffff" />
        </>
      )}

      {/* Adaptive Performance Optimizers */}
      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />

      {/* Orbit Controls with Smooth Damping */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minDistance={1.8}
        maxDistance={12}
        maxPolarAngle={Math.PI / 1.7}
      />

      {/* Camera Director for Hotspot Macro Inspections */}
      <HotspotCameraDirector activeHotspot={activeHotspot} />

      {/* Holographic Laser CT Slicing Plane - only rendered when enabled */}
      {(showLaserPlane || lightingPreset === 'xray') && (
        <LaserScanPlane
          active={true}
          yLevel={laserSliceY}
          color={lightingPreset === 'xray' ? '#00ffee' : '#00ff88'}
        />
      )}

      {/* Museum Metric Dimension Calipers - only rendered when active */}
      {showCaliper && <DimensionCaliperOverlay active={showCaliper} />}

      {/* Model Root Group */}
      <group ref={rootGroupRef}>
        <Suspense fallback={<CanvasModelLoader label={`TRANSMITTING ${entity.name.toUpperCase()}...`} theme="dark" />}>
          <ActiveSpecimenModel
            entity={entity}
            lightingPreset={lightingPreset}
            exploded={explodedView}
            wireframe={wireframe}
          />
        </Suspense>

        {/* 3D Holographic Hotspots anchored to model space */}
        {showAnnotations && !explodedView && (
          <group>
            {hotspots.map((hs) => (
              <HotspotMarkerPin
                key={hs.id}
                hotspot={hs}
                isSelected={activeHotspotId === hs.id}
                onSelect={() => {
                  if (onSelectHotspot) {
                    onSelectHotspot(activeHotspotId === hs.id ? null : hs);
                  }
                }}
              />
            ))}
          </group>
        )}
      </group>

      {/* Cinematic Post-Processing Pass (Only activated for dramatic/uv modes to maintain high FPS in museum mode) */}
      {enablePostprocessing && (lightingPreset === 'dramatic' || lightingPreset === 'uv') && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom luminanceThreshold={0.8} intensity={0.5} />
          <Vignette darkness={0.8} offset={0.3} />
        </EffectComposer>
      )}
    </>
  );
}
