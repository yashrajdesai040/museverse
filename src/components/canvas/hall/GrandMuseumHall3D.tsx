'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import { entities, getEntityById } from '@/data/entities';
import { MuseumEntity } from '@/types/museum';
import { ActiveSpecimenModel } from '@/components/canvas/Specimen3DViewer';
import { MuseumAssetLoader } from '@/components/museum/MuseumAssetLoader';
import StreamingController from '@/components/museum/StreamingController';
import MuseumPerformance from '@/components/museum/MuseumPerformance';
import { useAppStore } from '@/stores/useAppStore';
import { useCollectorStore } from '@/stores/useCollectorStore';
import { useGlobalSound } from '@/hooks/useGlobalSound';
import { ArchivalCertificateModal } from '@/components/certificate/ArchivalCertificateModal';
import {
  getMuseumMarbleFloorTextures,
  getMuseumWallTextures,
  getNaveAisleMosaicTexture,
  getCofferedCeilingTexture,
  getReaderPlaqueTexture,
  getBillboardLabelTexture,
} from './museumTextures';

// ─── Museum Hall Curatorial Specification ───
export interface HallSpecimenConfig {
  id: string;
  catalogNum: string;
  entityId: string;
  shortTitle: string;
  fullTitle: string;
  pos: [number, number, number];
  wing: string;
  era: string;
  dating: string;
  location: string;
  accentColor: string;
  hasBarrier?: boolean;
  scale: [number, number, number];
  yOffset: number;
  displayType: 'open' | 'cylinder' | 'cube' | 'slab' | 'tall';
}

// ─── Monumental Grand Museum Hall Layout (76m x 168m Master Gallery) ───
export const HALL_SPECIMENS: HallSpecimenConfig[] = [
  // ── Wing I: Northern Apse & Paleontology Rotunda (Mesozoic Apex) ──
  {
    id: 'trex',
    catalogNum: 'FMNH PR 2081',
    entityId: 'trex-sue',
    shortTitle: 'SUE T-REX SKULL',
    fullTitle: 'APEX THEROPOD PREDATOR CRANIUM',
    pos: [0, 0, -66],
    wing: 'Paleontology Rotunda',
    era: 'LATE CRETACEOUS',
    dating: '67.0 MILLION YEARS AGO',
    location: 'HELL CREEK FORMATION, SOUTH DAKOTA',
    accentColor: '#e0701a',
    hasBarrier: true,
    scale: [1.35, 1.35, 1.35],
    yOffset: 1.7,
    displayType: 'open',
  },
  {
    id: 'triceratops',
    catalogNum: 'USNM 4720',
    entityId: 'triceratops-hatcher',
    shortTitle: 'TRICERATOPS HATCHER',
    fullTitle: 'THREE-HORNED CERATOPSIAN DINOSAUR',
    pos: [-12, 0, -56],
    wing: 'Paleontology Rotunda',
    era: 'LATE CRETACEOUS',
    dating: '66.0 MILLION YEARS AGO',
    location: 'LANCE FORMATION, WYOMING',
    accentColor: '#e0701a',
    hasBarrier: true,
    scale: [1.15, 1.15, 1.15],
    yOffset: 1.6,
    displayType: 'open',
  },
  {
    id: 'velociraptor',
    catalogNum: 'GIN 100/25',
    entityId: 'velociraptor-fighting-dinosaurs',
    shortTitle: 'FIGHTING VELOCIRAPTOR',
    fullTitle: 'DESERT DROMAEOSAURID PACK HUNTER',
    pos: [12, 0, -56],
    wing: 'Paleontology Rotunda',
    era: 'LATE CRETACEOUS',
    dating: '75.0 MILLION YEARS AGO',
    location: 'GOBI DESERT, MONGOLIA',
    accentColor: '#e0701a',
    hasBarrier: true,
    scale: [1.1, 1.1, 1.1],
    yOffset: 1.6,
    displayType: 'open',
  },
  {
    id: 'archaeopteryx',
    catalogNum: 'NHMUK PV OR 37001',
    entityId: 'archaeopteryx-london',
    shortTitle: 'ARCHAEOPTERYX LIMESTONE',
    fullTitle: 'EARLIEST TRANSITIONAL AVIAN FOSSIL',
    pos: [-8, 0, -44],
    wing: 'Paleontology Rotunda',
    era: 'LATE JURASSIC',
    dating: '150.8 MILLION YEARS AGO',
    location: 'SOLNHOFEN, BAVARIA, GERMANY',
    accentColor: '#e0701a',
    hasBarrier: false,
    scale: [0.65, 0.65, 0.65],
    yOffset: 1.6,
    displayType: 'slab',
  },
  {
    id: 'dimetrodon',
    catalogNum: 'MCZ 1347',
    entityId: 'dimetrodon-grandis',
    shortTitle: 'DIMETRODON GRANDIS',
    fullTitle: 'SAIL-BACKED APEX SYNAPSID',
    pos: [8, 0, -44],
    wing: 'Paleontology Rotunda',
    era: 'EARLY PERMIAN',
    dating: '280 MILLION YEARS AGO',
    location: 'RED BEDS, TEXAS',
    accentColor: '#e0701a',
    hasBarrier: true,
    scale: [1.1, 1.1, 1.1],
    yOffset: 1.6,
    displayType: 'open',
  },

  // ── Wing II: West Colonnade — Antiquities & Global Civilizations ──
  {
    id: 'rosetta',
    catalogNum: 'EA 24',
    entityId: 'rosetta-stone',
    shortTitle: 'ROSETTA STONE STELE',
    fullTitle: 'TRILINGUAL DECREE OF MEMPHIS',
    pos: [-25.0, 0, -32],
    wing: 'Antiquities Colonnade',
    era: 'PTOLEMAIC DYNASTY',
    dating: '196 BCE (2,222 YEARS AGO)',
    location: 'RASHID, LOWER EGYPT',
    accentColor: '#d4af37',
    hasBarrier: false,
    scale: [0.65, 0.65, 0.65],
    yOffset: 1.6,
    displayType: 'slab',
  },
  {
    id: 'lascaux',
    catalogNum: 'MNP-P 1940',
    entityId: 'lascaux-relief',
    shortTitle: 'LASCAUX CAVE RELIEF',
    fullTitle: 'MAGDALENIAN POLYCHROME BAS-RELIEF',
    pos: [-25.0, 0, -18],
    wing: 'Antiquities Colonnade',
    era: 'UPPER PALEOLITHIC',
    dating: '17,000 BCE (19,000 YEARS AGO)',
    location: 'VÉZÈRE VALLEY, DORDOGNE, FRANCE',
    accentColor: '#d4af37',
    hasBarrier: false,
    scale: [0.75, 0.75, 0.75],
    yOffset: 1.6,
    displayType: 'slab',
  },
  {
    id: 'irish-elk',
    catalogNum: 'NMI-GEO 2021',
    entityId: 'irish-elk-megaloceros',
    shortTitle: 'IRISH ELK CRANIUM',
    fullTitle: 'GIANT ANTLERED PLEISTOCENE CERVID',
    pos: [-25.0, 0, -4],
    wing: 'Antiquities Colonnade',
    era: 'LATE PLEISTOCENE',
    dating: '11,000 YEARS AGO',
    location: 'BALLYBETAGH BOG, DUBLIN, IRELAND',
    accentColor: '#ffd700',
    hasBarrier: true,
    scale: [0.85, 0.85, 0.85],
    yOffset: 1.6,
    displayType: 'open',
  },
  {
    id: 'nefertiti',
    catalogNum: 'AM 21300',
    entityId: 'nefertiti-bust',
    shortTitle: 'NEFERTITI ROYAL BUST',
    fullTitle: 'POLYCHROME LIMESTONE SCULPTURE',
    pos: [-25.0, 0, 10],
    wing: 'Antiquities Colonnade',
    era: 'AMARNA PERIOD EGYPT',
    dating: '1345 BCE (3,371 YEARS AGO)',
    location: 'AMARNA WORKSHOP OF THUTMOSE',
    accentColor: '#ffd700',
    hasBarrier: false,
    scale: [0.58, 0.58, 0.58],
    yOffset: 1.6,
    displayType: 'cube',
  },
  {
    id: 'antikythera',
    catalogNum: 'NAMA 15087',
    entityId: 'antikythera-mechanism',
    shortTitle: 'ANTIKYTHERA MECHANISM',
    fullTitle: 'ANCIENT ASTRONOMICAL GEAR COMPUTER',
    pos: [-25.0, 0, 24],
    wing: 'Antiquities Colonnade',
    era: 'HELLENISTIC GREECE',
    dating: '150–100 BCE',
    location: 'ANTIKYTHERA SHIPWRECK, AEGEAN',
    accentColor: '#d4af37',
    hasBarrier: false,
    scale: [0.58, 0.58, 0.58],
    yOffset: 1.6,
    displayType: 'cube',
  },
  {
    id: 'terracotta',
    catalogNum: 'T-ARMY 001',
    entityId: 'terracotta-warrior',
    shortTitle: 'TERRACOTTA WARRIOR',
    fullTitle: 'QIN IMPERIAL INFANTRY VANGUARD',
    pos: [-25.0, 0, 38],
    wing: 'Antiquities Colonnade',
    era: 'QIN DYNASTY CHINA',
    dating: '210–209 BCE',
    location: 'LINTONG, SHAANXI, CHINA',
    accentColor: '#d4af37',
    hasBarrier: true,
    scale: [1.05, 1.05, 1.05],
    yOffset: 1.7,
    displayType: 'open',
  },

  // ── Wing III: East Colonnade — Deep Time, Paleoceanography & Stratigraphy ──
  {
    id: 'stromatolite',
    catalogNum: 'GSWA 183204',
    entityId: 'stromatolite-pilbara',
    shortTitle: 'PILBARA STROMATOLITE',
    fullTitle: 'FIRST BIOLOGICAL OXYGENATORS OF EARTH',
    pos: [25.0, 0, -32],
    wing: 'Deep Time Colonnade',
    era: 'ARCHEAN EON',
    dating: '3.48 BILLION YEARS AGO',
    location: 'PILBARA CRATON, WESTERN AUSTRALIA',
    accentColor: '#1f6f8b',
    hasBarrier: false,
    scale: [0.65, 0.65, 0.65],
    yOffset: 1.6,
    displayType: 'cylinder',
  },
  {
    id: 'trilobite',
    catalogNum: 'NHMUK Invert 5510',
    entityId: 'trilobite-paradoxides',
    shortTitle: 'PARADOXIDES TRILOBITE',
    fullTitle: 'GIANT CAMBRIAN ARMORED ARTHROPOD',
    pos: [25.0, 0, -18],
    wing: 'Deep Time Colonnade',
    era: 'MIDDLE CAMBRIAN',
    dating: '505 MILLION YEARS AGO',
    location: 'ST. DAVIDS, PEMBROKESHIRE, WALES',
    accentColor: '#1f6f8b',
    hasBarrier: false,
    scale: [0.65, 0.65, 0.65],
    yOffset: 1.6,
    displayType: 'slab',
  },
  {
    id: 'tiktaalik',
    catalogNum: 'NUFV 108',
    entityId: 'tiktaalik-roseae',
    shortTitle: 'TIKTAALIK ROSEAE',
    fullTitle: 'DEVONIAN TRANSITIONAL FISHAPOD',
    pos: [25.0, 0, -4],
    wing: 'Deep Time Colonnade',
    era: 'LATE DEVONIAN',
    dating: '375.0 MILLION YEARS AGO',
    location: 'ELLESMERE ISLAND, NUNAVUT, CANADA',
    accentColor: '#1f6f8b',
    hasBarrier: false,
    scale: [0.95, 0.95, 0.95],
    yOffset: 1.5,
    displayType: 'slab',
  },
  {
    id: 'megalodon',
    catalogNum: 'UF 124800',
    entityId: 'megalodon-tooth',
    shortTitle: 'MEGALODON APEX TOOTH',
    fullTitle: 'SERRATED 18CM MEATOOTH SHARK DENTITION',
    pos: [25.0, 0, 10],
    wing: 'Deep Time Colonnade',
    era: 'MIOCENE–PLIOCENE',
    dating: '23–3.6 MILLION YEARS AGO',
    location: 'BONE VALLEY, FLORIDA',
    accentColor: '#4f86f7',
    hasBarrier: false,
    scale: [0.58, 0.58, 0.58],
    yOffset: 1.6,
    displayType: 'cube',
  },
  {
    id: 'kpg',
    catalogNum: 'IR-ANOMALY-01',
    entityId: 'kpg-boundary-clay',
    shortTitle: 'K-PG IRIDIUM CORE',
    fullTitle: 'CHICXULUB BOLIDE EXTINCTION HORIZON',
    pos: [25.0, 0, 24],
    wing: 'Deep Time Colonnade',
    era: 'BOLIDE IMPACT HORIZON',
    dating: '66.0 MILLION YEARS AGO',
    location: 'STEVNS KLINT, ZEALAND, DENMARK',
    accentColor: '#b3261e',
    hasBarrier: false,
    scale: [0.68, 0.68, 0.68],
    yOffset: 1.7,
    displayType: 'tall',
  },
  {
    id: 'stegosaurus',
    catalogNum: 'NHMUK PV R36730',
    entityId: 'stegosaurus-sophie',
    shortTitle: 'STEGOSAURUS SOPHIE',
    fullTitle: 'VASCULARIZED PLATED DINOSAUR CRANIUM',
    pos: [25.0, 0, 38],
    wing: 'Deep Time Colonnade',
    era: 'LATE JURASSIC',
    dating: '150.0 MILLION YEARS AGO',
    location: 'RED CANYON RANCH, WYOMING',
    accentColor: '#00d4aa',
    hasBarrier: true,
    scale: [0.95, 0.95, 0.95],
    yOffset: 1.6,
    displayType: 'open',
  },

  // ── Wing IV: South Nave — Pleistocene Megafauna & Human Origins ──
  {
    id: 'smilodon',
    catalogNum: 'LACMHC 2001',
    entityId: 'smilodon-la-brea',
    shortTitle: 'SMILODON SABER-TOOTH',
    fullTitle: 'PLEISTOCENE APEX SABER-TOOTH CAT',
    pos: [-9.5, 0, 12],
    wing: 'Origins & Megafauna',
    era: 'PLEISTOCENE',
    dating: '12,000 YEARS AGO',
    location: 'LA BREA TAR PITS, CALIFORNIA',
    accentColor: '#4c9a5b',
    hasBarrier: true,
    scale: [1.15, 1.15, 1.15],
    yOffset: 1.6,
    displayType: 'open',
  },
  {
    id: 'mammoth',
    catalogNum: 'SAL-07-01',
    entityId: 'mammoth-lyuba',
    shortTitle: 'MAMMOTH LYUBA',
    fullTitle: 'FROZEN PERMAFROST WOOLLY MAMMOTH',
    pos: [9.5, 0, 12],
    wing: 'Origins & Megafauna',
    era: 'LATE PLEISTOCENE',
    dating: '41,800 YEARS AGO',
    location: 'YURIBEY RIVER, YAMAL PENINSULA',
    accentColor: '#4c9a5b',
    hasBarrier: true,
    scale: [1.15, 1.15, 1.15],
    yOffset: 1.6,
    displayType: 'open',
  },
  {
    id: 'lucy',
    catalogNum: 'AL 288-1',
    entityId: 'lucy-australopithecus',
    shortTitle: 'LUCY AUSTRALOPITHECUS',
    fullTitle: 'EARLY BIPEDAL HOMININ SKELETON',
    pos: [-9.5, 0, 32],
    wing: 'Origins & Megafauna',
    era: 'PLIOCENE EPOCH',
    dating: '3.2 MILLION YEARS AGO',
    location: 'HADAR, AFAR TRIANGLE, ETHIOPIA',
    accentColor: '#d4af37',
    hasBarrier: false,
    scale: [0.68, 0.68, 0.68],
    yOffset: 1.7,
    displayType: 'tall',
  },
  {
    id: 'venus',
    catalogNum: 'NHMW-PA 44026',
    entityId: 'venus-willendorf',
    shortTitle: 'VENUS OF WILLENDORF',
    fullTitle: 'OOLITIC LIMESTONE PALEOLITHIC IDOL',
    pos: [9.5, 0, 32],
    wing: 'Origins & Megafauna',
    era: 'UPPER PALEOLITHIC',
    dating: '29,500 BCE (31,500 YEARS AGO)',
    location: 'WILLENDORF IN DER WACHAU, AUSTRIA',
    accentColor: '#ffd700',
    hasBarrier: false,
    scale: [0.58, 0.58, 0.58],
    yOffset: 1.6,
    displayType: 'cube',
  },
];

// ─── Colonnade Column Grid (13 Pairs = 26 Monumental Columns) ───
const COLUMN_Z_COORDS = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];
const COLUMN_OBSTACLES: Array<{ x: number; z: number; radius: number }> = [];
COLUMN_Z_COORDS.forEach((z) => {
  COLUMN_OBSTACLES.push({ x: -17.0, z, radius: 1.5 });
  COLUMN_OBSTACLES.push({ x: 17.0, z, radius: 1.5 });
});

// Pedestal Obstacles
const PEDESTAL_OBSTACLES = HALL_SPECIMENS.map((s) => ({
  x: s.pos[0],
  z: s.pos[2],
  radius: s.hasBarrier ? 2.9 : 2.2,
}));

// Central Sunken Pool (11m x 22m)
const POOL_COLLISION = {
  minX: -5.5,
  maxX: 5.5,
  minZ: -4.0,
  maxZ: 18.0,
};

// Perimeter Walls Walking Boundaries (76m x 168m Hall)
const BOUNDARY_LIMITS = {
  minX: -35.5,
  maxX: 35.5,
  minZ: -78.0,
  maxZ: 72.0,
};

const _resolvedPos: [number, number] = [0, 0];

function resolveVisitorCollisions(x: number, z: number, vel?: THREE.Vector3): [number, number] {
  let cx = x;
  let cz = z;

  // 1. Pedestal Obstacles
  for (let i = 0; i < PEDESTAL_OBSTACLES.length; i++) {
    const obs = PEDESTAL_OBSTACLES[i];
    const dx = cx - obs.x;
    const dz = cz - obs.z;
    const distSq = dx * dx + dz * dz;
    const radSq = obs.radius * obs.radius;
    if (distSq < radSq) {
      const dist = Math.sqrt(distSq) || 0.001;
      const nx = dx / dist;
      const nz = dz / dist;
      const overlap = obs.radius - dist;
      cx += nx * overlap;
      cz += nz * overlap;

      // Kinematic wall-sliding: cancel velocity pointing into obstacle
      if (vel) {
        const dot = vel.x * nx + vel.z * nz;
        if (dot < 0) {
          vel.x -= nx * dot;
          vel.z -= nz * dot;
        }
      }
    }
  }

  // 2. Colonnade Columns
  for (let i = 0; i < COLUMN_OBSTACLES.length; i++) {
    const col = COLUMN_OBSTACLES[i];
    const dx = cx - col.x;
    const dz = cz - col.z;
    const distSq = dx * dx + dz * dz;
    const radSq = col.radius * col.radius;
    if (distSq < radSq) {
      const dist = Math.sqrt(distSq) || 0.001;
      const nx = dx / dist;
      const nz = dz / dist;
      const overlap = col.radius - dist;
      cx += nx * overlap;
      cz += nz * overlap;

      // Kinematic wall-sliding: cancel velocity pointing into obstacle
      if (vel) {
        const dot = vel.x * nx + vel.z * nz;
        if (dot < 0) {
          vel.x -= nx * dot;
          vel.z -= nz * dot;
        }
      }
    }
  }

  // 3. Central Sunken Pool
  if (
    cx > POOL_COLLISION.minX &&
    cx < POOL_COLLISION.maxX &&
    cz > POOL_COLLISION.minZ &&
    cz < POOL_COLLISION.maxZ
  ) {
    const dLeft = Math.abs(cx - POOL_COLLISION.minX);
    const dRight = Math.abs(POOL_COLLISION.maxX - cx);
    const dTop = Math.abs(cz - POOL_COLLISION.minZ);
    const dBottom = Math.abs(POOL_COLLISION.maxZ - cz);
    const minD = Math.min(dLeft, dRight, dTop, dBottom);
    if (minD === dLeft) {
      cx = POOL_COLLISION.minX;
      if (vel && vel.x > 0) vel.x = 0;
    } else if (minD === dRight) {
      cx = POOL_COLLISION.maxX;
      if (vel && vel.x < 0) vel.x = 0;
    } else if (minD === dTop) {
      cz = POOL_COLLISION.minZ;
      if (vel && vel.z > 0) vel.z = 0;
    } else {
      cz = POOL_COLLISION.maxZ;
      if (vel && vel.z < 0) vel.z = 0;
    }
  }

  // 4. Perimeter Walls Clamping with smooth velocity cancellation
  if (cx < BOUNDARY_LIMITS.minX) {
    cx = BOUNDARY_LIMITS.minX;
    if (vel && vel.x < 0) vel.x = 0;
  } else if (cx > BOUNDARY_LIMITS.maxX) {
    cx = BOUNDARY_LIMITS.maxX;
    if (vel && vel.x > 0) vel.x = 0;
  }

  if (cz < BOUNDARY_LIMITS.minZ) {
    cz = BOUNDARY_LIMITS.minZ;
    if (vel && vel.z < 0) vel.z = 0;
  } else if (cz > BOUNDARY_LIMITS.maxZ) {
    cz = BOUNDARY_LIMITS.maxZ;
    if (vel && vel.z > 0) vel.z = 0;
  }

  _resolvedPos[0] = cx;
  _resolvedPos[1] = cz;
  return _resolvedPos;
}

// ─── Shared Geometries & High-Performance Materials ───
const openDaisBaseGeo = new THREE.CylinderGeometry(2.5, 2.75, 0.48, 28);
const openDaisTopGeo = new THREE.CylinderGeometry(2.35, 2.35, 0.15, 28);

const rectBaseGeo = new THREE.BoxGeometry(2.8, 0.58, 1.8);
const rectTopGeo = new THREE.BoxGeometry(2.65, 0.15, 1.65);
const rectGlassGeo = new THREE.BoxGeometry(2.55, 2.2, 1.55);

const squareBaseGeo = new THREE.BoxGeometry(2.0, 0.6, 2.0);
const squareTopGeo = new THREE.BoxGeometry(1.85, 0.15, 1.85);
const cubeGlassGeo = new THREE.BoxGeometry(1.75, 1.95, 1.75);

const plinthBaseGeo = new THREE.CylinderGeometry(1.75, 1.98, 0.6, 24);
const plinthTopGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.15, 24);
const glassCaseGeo = new THREE.CylinderGeometry(1.48, 1.48, 2.3, 24, 1, true);

const tallGlassGeo = new THREE.CylinderGeometry(1.35, 1.35, 2.85, 24, 1, true);

// Sleek Museum Specimen Mount Plate (Turntable Presentation Disc / Plaque Plate)
const displaySquarePlateGeo = new THREE.BoxGeometry(1.65, 0.035, 1.65);
const displayDiscPlateGeo = new THREE.CylinderGeometry(1.35, 1.4, 0.035, 32);
const displayRectPlateGeo = new THREE.BoxGeometry(2.45, 0.035, 1.45);

// Shared Architectural Geometries
const columnShaftGeo = new THREE.CylinderGeometry(1.25, 1.35, 20.0, 20);
const columnBaseGeo = new THREE.CylinderGeometry(1.75, 1.95, 1.2, 20);
const columnCapGeo = new THREE.CylinderGeometry(2.0, 1.45, 1.1, 20);
const columnPlinthGeo = new THREE.BoxGeometry(3.8, 0.55, 3.8);

const crossArchGeo = new THREE.BoxGeometry(34.2, 1.4, 1.4);
const wingCrossBeamGeo = new THREE.BoxGeometry(19.0, 1.2, 1.2);
const wallSconceGeo = new THREE.BoxGeometry(0.35, 1.2, 0.45);

const benchSeatGeo = new THREE.BoxGeometry(4.0, 0.15, 1.1);
const benchLegGeo = new THREE.BoxGeometry(0.12, 0.5, 1.0);

const barrierPostGeo = new THREE.CylinderGeometry(0.04, 0.055, 0.95, 10);
const barrierCapGeo = new THREE.SphereGeometry(0.085, 10, 10);
const barrierRopeGeo = new THREE.CylinderGeometry(0.026, 0.026, 5.0, 8);

const standFootGeo = new THREE.BoxGeometry(0.65, 0.04, 0.35);
const standPostGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.92, 8);
const standPlateGeo = new THREE.BoxGeometry(1.2, 0.72, 0.04);

// Materials (NO Heavy Transmission, 60+ FPS Safe)
const darkBronzeMat = new THREE.MeshStandardMaterial({
  color: '#1a1816',
  metalness: 0.9,
  roughness: 0.25,
});
const plaqueBronzeMat = new THREE.MeshStandardMaterial({
  color: '#caa04d',
  metalness: 0.92,
  roughness: 0.18,
});
const statuaryMarbleMat = new THREE.MeshStandardMaterial({
  color: '#f9f7f2',
  roughness: 0.18,
  metalness: 0.04,
});
const museumSlateMat = new THREE.MeshStandardMaterial({
  color: '#141416',
  roughness: 0.75,
  metalness: 0.15,
});
const glassCaseMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  transparent: true,
  opacity: 0.025, // Crystal-clear museum anti-reflective vitrine glass
  roughness: 0.02,
  metalness: 0.05,
  depthWrite: false,
});
const barrierRopeMat = new THREE.MeshStandardMaterial({
  color: '#8b1515',
  roughness: 0.65,
});
const benchWoodMat = new THREE.MeshStandardMaterial({
  color: '#28170e',
  roughness: 0.35,
});
const steelMat = new THREE.MeshStandardMaterial({
  color: '#1c1e22',
  metalness: 0.92,
  roughness: 0.25,
});
const sconceLightMat = new THREE.MeshBasicMaterial({
  color: '#ffdf9e',
});

// ─── Module-Level Reusable Culling Primitives (Zero Garbage Collection) ───
const _sharedFrustum = new THREE.Frustum();
const _sharedProjMatrix = new THREE.Matrix4();
const _sharedSphere = new THREE.Sphere();

// ─── Instanced Monumental Colonnade & Cross-Arches ───
const InstancedColonnade = React.memo(function InstancedColonnade() {
  const shaftsRef = useRef<THREE.InstancedMesh>(null);
  const basesRef = useRef<THREE.InstancedMesh>(null);
  const capsRef = useRef<THREE.InstancedMesh>(null);
  const plinthsRef = useRef<THREE.InstancedMesh>(null);
  const crossArchesRef = useRef<THREE.InstancedMesh>(null);
  const wingBeamsRef = useRef<THREE.InstancedMesh>(null);

  const columnPositions = useMemo(() => {
    const list: Array<[number, number, number]> = [];
    COLUMN_Z_COORDS.forEach((z) => {
      list.push([-17.0, 0, z]);
      list.push([17.0, 0, z]);
    });
    return list;
  }, []);

  useEffect(() => {
    const tempObj = new THREE.Object3D();

    columnPositions.forEach(([x, y, z], i) => {
      tempObj.position.set(x, y + 0.28, z);
      tempObj.rotation.set(0, 0, 0);
      tempObj.scale.set(1, 1, 1);
      tempObj.updateMatrix();
      plinthsRef.current?.setMatrixAt(i, tempObj.matrix);

      tempObj.position.set(x, y + 1.1, z);
      tempObj.updateMatrix();
      basesRef.current?.setMatrixAt(i, tempObj.matrix);

      tempObj.position.set(x, y + 11.2, z);
      tempObj.updateMatrix();
      shaftsRef.current?.setMatrixAt(i, tempObj.matrix);

      tempObj.position.set(x, y + 21.8, z);
      tempObj.updateMatrix();
      capsRef.current?.setMatrixAt(i, tempObj.matrix);
    });

    // Transverse cross-arches spanning across the nave aisle between each column pair
    COLUMN_Z_COORDS.forEach((z, i) => {
      tempObj.position.set(0, 22.8, z);
      tempObj.rotation.set(0, 0, 0);
      tempObj.scale.set(1, 1, 1);
      tempObj.updateMatrix();
      crossArchesRef.current?.setMatrixAt(i, tempObj.matrix);
    });

    // Wing cross-beams connecting columns to side walls
    let beamIdx = 0;
    COLUMN_Z_COORDS.forEach((z) => {
      // West wing beam (-17m to -36m, center at -26.5m)
      tempObj.position.set(-26.5, 22.8, z);
      tempObj.updateMatrix();
      wingBeamsRef.current?.setMatrixAt(beamIdx++, tempObj.matrix);

      // East wing beam (17m to 36m, center at 26.5m)
      tempObj.position.set(26.5, 22.8, z);
      tempObj.updateMatrix();
      wingBeamsRef.current?.setMatrixAt(beamIdx++, tempObj.matrix);
    });

    if (plinthsRef.current) plinthsRef.current.instanceMatrix.needsUpdate = true;
    if (basesRef.current) basesRef.current.instanceMatrix.needsUpdate = true;
    if (shaftsRef.current) shaftsRef.current.instanceMatrix.needsUpdate = true;
    if (capsRef.current) capsRef.current.instanceMatrix.needsUpdate = true;
    if (crossArchesRef.current) crossArchesRef.current.instanceMatrix.needsUpdate = true;
    if (wingBeamsRef.current) wingBeamsRef.current.instanceMatrix.needsUpdate = true;
  }, [columnPositions]);

  const count = columnPositions.length;
  const archCount = COLUMN_Z_COORDS.length;

  return (
    <group raycast={() => null}>
      <instancedMesh ref={plinthsRef} args={[columnPlinthGeo, statuaryMarbleMat, count]} frustumCulled={false} />
      <instancedMesh ref={basesRef} args={[columnBaseGeo, darkBronzeMat, count]} frustumCulled={false} />
      <instancedMesh ref={shaftsRef} args={[columnShaftGeo, statuaryMarbleMat, count]} frustumCulled={false} />
      <instancedMesh ref={capsRef} args={[columnCapGeo, darkBronzeMat, count]} frustumCulled={false} />
      <instancedMesh ref={crossArchesRef} args={[crossArchGeo, statuaryMarbleMat, archCount]} frustumCulled={false} />
      <instancedMesh ref={wingBeamsRef} args={[wingCrossBeamGeo, statuaryMarbleMat, archCount * 2]} frustumCulled={false} />
    </group>
  );
});

// ─── Instanced Gallery Benches ───
const InstancedBenches = React.memo(function InstancedBenches() {
  const seatsRef = useRef<THREE.InstancedMesh>(null);
  const legsRef = useRef<THREE.InstancedMesh>(null);

  const benchConfigs = useMemo(() => {
    const list: Array<{ pos: [number, number, number]; rotY: number }> = [];
    [-50, -30, -10, 10, 30, 50].forEach((z) => {
      list.push({ pos: [-17.0, 0, z], rotY: Math.PI / 2 });
      list.push({ pos: [17.0, 0, z], rotY: -Math.PI / 2 });
    });
    return list;
  }, []);

  useEffect(() => {
    const tempObj = new THREE.Object3D();
    let legIdx = 0;

    benchConfigs.forEach((cfg, i) => {
      tempObj.position.set(cfg.pos[0], cfg.pos[1] + 0.55, cfg.pos[2]);
      tempObj.rotation.set(0, cfg.rotY, 0);
      tempObj.scale.set(1, 1, 1);
      tempObj.updateMatrix();
      seatsRef.current?.setMatrixAt(i, tempObj.matrix);

      tempObj.position.set(cfg.pos[0] + Math.cos(cfg.rotY) * 1.7, cfg.pos[1] + 0.27, cfg.pos[2] + Math.sin(cfg.rotY) * 1.7);
      tempObj.updateMatrix();
      legsRef.current?.setMatrixAt(legIdx++, tempObj.matrix);

      tempObj.position.set(cfg.pos[0] - Math.cos(cfg.rotY) * 1.7, cfg.pos[1] + 0.27, cfg.pos[2] - Math.sin(cfg.rotY) * 1.7);
      tempObj.updateMatrix();
      legsRef.current?.setMatrixAt(legIdx++, tempObj.matrix);
    });

    if (seatsRef.current) seatsRef.current.instanceMatrix.needsUpdate = true;
    if (legsRef.current) legsRef.current.instanceMatrix.needsUpdate = true;
  }, [benchConfigs]);

  return (
    <group raycast={() => null}>
      <instancedMesh ref={seatsRef} args={[benchSeatGeo, benchWoodMat, benchConfigs.length]} frustumCulled={false} />
      <instancedMesh ref={legsRef} args={[benchLegGeo, steelMat, benchConfigs.length * 2]} frustumCulled={false} />
    </group>
  );
});

// ─── Instanced Velvet Stanchions ───
const InstancedBarriers = React.memo(function InstancedBarriers() {
  const postsRef = useRef<THREE.InstancedMesh>(null);
  const capsRef = useRef<THREE.InstancedMesh>(null);
  const ropesRef = useRef<THREE.InstancedMesh>(null);

  const barrierExhibits = useMemo(() => {
    return HALL_SPECIMENS.filter((s) => s.hasBarrier);
  }, []);

  useEffect(() => {
    const tempObj = new THREE.Object3D();
    let postIdx = 0;
    let ropeIdx = 0;

    barrierExhibits.forEach((spec) => {
      const offsets = [
        [-2.5, 0, 2.5],
        [2.5, 0, 2.5],
        [2.5, 0, -2.5],
        [-2.5, 0, -2.5],
      ];

      offsets.forEach(([ox, oy, oz]) => {
        tempObj.position.set(spec.pos[0] + ox, oy + 0.48, spec.pos[2] + oz);
        tempObj.rotation.set(0, 0, 0);
        tempObj.scale.set(1, 1, 1);
        tempObj.updateMatrix();
        postsRef.current?.setMatrixAt(postIdx, tempObj.matrix);

        tempObj.position.set(spec.pos[0] + ox, oy + 0.98, spec.pos[2] + oz);
        tempObj.updateMatrix();
        capsRef.current?.setMatrixAt(postIdx, tempObj.matrix);
        postIdx++;
      });

      tempObj.position.set(spec.pos[0], 0.9, spec.pos[2] + 2.5);
      tempObj.rotation.set(0, 0, Math.PI / 2);
      tempObj.updateMatrix();
      ropesRef.current?.setMatrixAt(ropeIdx++, tempObj.matrix);
    });

    if (postsRef.current) postsRef.current.instanceMatrix.needsUpdate = true;
    if (capsRef.current) capsRef.current.instanceMatrix.needsUpdate = true;
    if (ropesRef.current) ropesRef.current.instanceMatrix.needsUpdate = true;
  }, [barrierExhibits]);

  const postCount = barrierExhibits.length * 4;
  const ropeCount = barrierExhibits.length;

  return (
    <group raycast={() => null}>
      <instancedMesh ref={postsRef} args={[barrierPostGeo, darkBronzeMat, postCount]} frustumCulled={false} />
      <instancedMesh ref={capsRef} args={[barrierCapGeo, plaqueBronzeMat, postCount]} frustumCulled={false} />
      <instancedMesh ref={ropesRef} args={[barrierRopeGeo, barrierRopeMat, ropeCount]} frustumCulled={false} />
    </group>
  );
});

// ─── Instanced Architectural Wall Sconces ───
const InstancedWallSconces = React.memo(function InstancedWallSconces() {
  const sconcesRef = useRef<THREE.InstancedMesh>(null);

  const sconcePositions = useMemo(() => {
    const list: Array<{ pos: [number, number, number]; rotY: number }> = [];
    [-65, -45, -25, -5, 15, 35, 55].forEach((z) => {
      list.push({ pos: [-36.8, 6.5, z], rotY: Math.PI / 2 });
      list.push({ pos: [36.8, 6.5, z], rotY: -Math.PI / 2 });
    });
    return list;
  }, []);

  useEffect(() => {
    const tempObj = new THREE.Object3D();
    sconcePositions.forEach((cfg, i) => {
      tempObj.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      tempObj.rotation.set(0, cfg.rotY, 0);
      tempObj.scale.set(1, 1, 1);
      tempObj.updateMatrix();
      sconcesRef.current?.setMatrixAt(i, tempObj.matrix);
    });
    if (sconcesRef.current) sconcesRef.current.instanceMatrix.needsUpdate = true;
  }, [sconcePositions]);

  return (
    <group raycast={() => null}>
      <instancedMesh ref={sconcesRef} args={[wallSconceGeo, sconceLightMat, sconcePositions.length]} frustumCulled={false} />
    </group>
  );
});

// ─── Museum Hall Curatorial Camera & Viewing Calibration ───
// Precision distance & look-at vectors ensuring 100% unobstructed, majestic framing for all 21 exhibits
export function getSpecimenViewParameters(config: HallSpecimenConfig) {
  const isWest = config.pos[0] < -6;
  const isEast = config.pos[0] > 6;
  const isRaisedPodium = Math.abs(config.pos[0]) > 17;
  const floorY = isRaisedPodium ? 0.16 : 0;

  const maxScale = Math.max(config.scale[0], config.scale[1], config.scale[2]);

  // Calibrated spacious viewing distance: allows full pedestal, reader plate, and exhibit to be seen majestically
  const viewDistance =
    maxScale >= 1.2 ? 7.2 :
    maxScale >= 1.0 ? 6.2 :
    maxScale >= 0.65 ? 5.5 : 5.0;

  const plateHeight =
    config.displayType === 'open' ? 0.73 :
    config.displayType === 'slab' ? 0.79 :
    config.displayType === 'tall' ? 0.89 : 0.83;

  const modelHeight = 2.8 * config.scale[1];
  const specimenCenterY = plateHeight + modelHeight * 0.48;

  const viewPos: [number, number, number] = isWest
    ? [config.pos[0] + viewDistance, 2.05 + floorY, config.pos[2]]
    : isEast
    ? [config.pos[0] - viewDistance, 2.05 + floorY, config.pos[2]]
    : [config.pos[0], 2.05, config.pos[2] + viewDistance];

  // Elevated look-at target so the 3D model sits gracefully in the upper-middle frame,
  // completely clear of any bottom HUD cards!
  const lookAt: [number, number, number] = [
    config.pos[0],
    plateHeight + floorY + modelHeight * 0.46 + 0.35,
    config.pos[2],
  ];

  return {
    viewPos,
    lookAt,
    floorY,
    plateHeight,
    modelHeight,
    specimenCenterY,
    viewDistance,
    isWest,
    isEast,
  };
}

// ─── Reader Stand Component (With Sharp Procedural Plaque Texture) ───
// Precision-oriented so the tilted informational plate always faces the visitor's eyes squarely
const ReaderStand = React.memo(function ReaderStand({
  config,
  onInspect,
}: {
  config: HallSpecimenConfig;
  onInspect: () => void;
}) {
  const { isWest, isEast, viewPos } = useMemo(() => getSpecimenViewParameters(config), [config]);

  // Position stand in the foreground corner towards the visitor, clear of the central model
  const standOffset = useMemo<[number, number, number]>(() => {
    if (isWest) {
      return [1.8, 0, 1.6];
    }
    if (isEast) {
      return [-1.8, 0, 1.6];
    }
    // North Paleontology Rotunda
    return [1.8, 0, 2.0];
  }, [isWest, isEast]);

  // Orient the reader stand so the 45-degree tilted plaque faces directly towards visitor viewPos
  const standRotY = useMemo(() => {
    const standWorldX = config.pos[0] + standOffset[0];
    const standWorldZ = config.pos[2] + standOffset[2];
    const toVisX = viewPos[0] - standWorldX;
    const toVisZ = viewPos[2] - standWorldZ;
    return Math.atan2(toVisX, toVisZ);
  }, [config.pos, standOffset, viewPos]);

  const plaqueTex = useMemo(() => getReaderPlaqueTexture(config), [config]);

  return (
    <group
      position={standOffset}
      rotation={[0, standRotY, 0]}
      onClick={(e: any) => {
        if (e.delta !== undefined && e.delta > 6) return;
        e.stopPropagation();
        onInspect();
      }}
    >
      <mesh position={[0, 0.02, 0]} geometry={standFootGeo} material={steelMat} />
      <mesh position={[0, 0.46, 0]} geometry={standPostGeo} material={steelMat} />
      <group position={[0, 0.95, 0]} rotation={[-Math.PI / 4, 0, 0]}>
        <mesh geometry={standPlateGeo} material={museumSlateMat} />
        {plaqueTex && (
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[1.16, 0.68]} />
            <meshBasicMaterial map={plaqueTex} />
          </mesh>
        )}
      </group>
    </group>
  );
});

// ─── Museum-Grade Holographic Exhibit Stream Fallback ───
// Renders an elegant, translucent museum plinth hologram while GLB models stream into memory
const ExhibitFarProxy = React.memo(function ExhibitFarProxy({ config }: { config: HallSpecimenConfig }) {
  const accent = config.accentColor || '#caa04d';

  return (
    <group position={[0, 0.75, 0]}>
      <mesh>
        <cylinderGeometry args={[0.42, 0.52, 1.4, 16]} />
        <meshStandardMaterial
          color={accent}
          transparent
          opacity={0.32}
          roughness={0.2}
          metalness={0.7}
          emissive={accent}
          emissiveIntensity={0.28}
          wireframe
        />
      </mesh>
    </group>
  );
});

// ─── High-Performance Exhibit Pedestal (Authentic Real 3D Models with Frustum Culling) ───
const FastExhibitPedestal = React.memo(function FastExhibitPedestal({
  config,
  entity,
  isNearest,
  previewActive = false,
  onNavigate,
  onInspect,
}: {
  config: HallSpecimenConfig;
  entity: MuseumEntity;
  isNearest: boolean;
  previewActive?: boolean;
  onNavigate: (viewPos: [number, number, number], target: [number, number, number]) => void;
  onInspect: (entityId: string) => void;
}) {
  const { camera } = useThree();
  const modelGroupRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);

  const {
    viewPos,
    lookAt,
    floorY,
    plateHeight,
    modelHeight,
    specimenCenterY,
  } = useMemo(() => getSpecimenViewParameters(config), [config]);

  const pedestalPos = useMemo<[number, number, number]>(
    () => [config.pos[0], config.pos[1] + floorY, config.pos[2]],
    [config.pos, floorY]
  );

  // Combined Frustum Culling + Extended Distance Culling (125m) in useFrame (Zero React Re-Renders)
  useFrame((_, delta) => {
    if (!modelGroupRef.current) return;

    const dx = camera.position.x - config.pos[0];
    const dz = camera.position.z - config.pos[2];
    const distSq = dx * dx + dz * dz;

    // 1. Distance Culling (>125m skips rendering entirely, covering the full 168m hall)
    if (distSq > 125 * 125) {
      if (modelGroupRef.current.visible) modelGroupRef.current.visible = false;
      return;
    }

    // 2. Frustum Culling (Render only objects inside camera visible FOV)
    _sharedSphere.center.set(config.pos[0], specimenCenterY, config.pos[2]);
    _sharedSphere.radius = Math.max(5.5, config.scale[0] * 3.5);

    const inFrustum = _sharedFrustum.intersectsSphere(_sharedSphere);

    if (modelGroupRef.current.visible !== inFrustum) {
      modelGroupRef.current.visible = inFrustum;
    }

    // Smooth rotational showcase spin only when in front of camera
    if (inFrustum && spinRef.current) {
      spinRef.current.rotation.y += delta * (isNearest ? 0.45 : 0.18);
    }
  });

  return (
    <group position={pedestalPos}>
      {/* Showcase / Dais Base */}
      {config.displayType === 'open' ? (
        <>
          <mesh position={[0, 0.3, 0]} geometry={openDaisBaseGeo} material={darkBronzeMat} raycast={() => null} />
          <mesh position={[0, 0.62, 0]} geometry={openDaisTopGeo} material={statuaryMarbleMat} raycast={() => null} />
          <mesh position={[0, 0.71, 0]} geometry={displayDiscPlateGeo} material={darkBronzeMat} raycast={() => null} />
        </>
      ) : config.displayType === 'slab' ? (
        <>
          <mesh position={[0, 0.32, 0]} geometry={rectBaseGeo} material={darkBronzeMat} raycast={() => null} />
          <mesh position={[0, 0.68, 0]} geometry={rectTopGeo} material={statuaryMarbleMat} raycast={() => null} />
          <mesh position={[0, 0.77, 0]} geometry={displayRectPlateGeo} material={darkBronzeMat} raycast={() => null} />
          <mesh position={[0, 1.85, 0]} geometry={rectGlassGeo} material={glassCaseMat} raycast={() => null} />
        </>
      ) : config.displayType === 'cube' ? (
        <>
          <mesh position={[0, 0.35, 0]} geometry={squareBaseGeo} material={darkBronzeMat} raycast={() => null} />
          <mesh position={[0, 0.72, 0]} geometry={squareTopGeo} material={statuaryMarbleMat} raycast={() => null} />
          <mesh position={[0, 0.81, 0]} geometry={displaySquarePlateGeo} material={darkBronzeMat} raycast={() => null} />
          <mesh position={[0, 1.75, 0]} geometry={cubeGlassGeo} material={glassCaseMat} raycast={() => null} />
        </>
      ) : config.displayType === 'tall' ? (
        <>
          <mesh position={[0, 0.38, 0]} geometry={plinthBaseGeo} material={darkBronzeMat} raycast={() => null} />
          <mesh position={[0, 0.78, 0]} geometry={plinthTopGeo} material={statuaryMarbleMat} raycast={() => null} />
          <mesh position={[0, 0.87, 0]} geometry={displayDiscPlateGeo} material={darkBronzeMat} raycast={() => null} />
          <mesh position={[0, 2.15, 0]} geometry={tallGlassGeo} material={glassCaseMat} raycast={() => null} />
        </>
      ) : (
        <>
          <mesh position={[0, 0.35, 0]} geometry={plinthBaseGeo} material={darkBronzeMat} raycast={() => null} />
          <mesh position={[0, 0.72, 0]} geometry={plinthTopGeo} material={statuaryMarbleMat} raycast={() => null} />
          <mesh position={[0, 0.81, 0]} geometry={displayDiscPlateGeo} material={darkBronzeMat} raycast={() => null} />
          <mesh position={[0, 1.9, 0]} geometry={glassCaseGeo} material={glassCaseMat} raycast={() => null} />
        </>
      )}

      {/* Baked Emissive Brass Floor Ring */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        onClick={(e: any) => {
          if (e.delta !== undefined && e.delta > 6) return;
          e.stopPropagation();
          onNavigate(viewPos, lookAt);
        }}
      >
        <ringGeometry args={[2.2, 2.4, 28]} />
        <meshBasicMaterial
          color={isNearest ? '#ffd700' : '#caa04d'}
          transparent
          opacity={isNearest ? 0.95 : 0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Specimen Model Root with Three.js Visibility Culling & Direct Click-to-Inspect */}
      <group
        ref={modelGroupRef}
        position={[0, plateHeight, 0]}
        onClick={(e: any) => {
          if (e.delta !== undefined && e.delta > 6) return;
          e.stopPropagation();
          onInspect(entity.id);
        }}
      >
        <group ref={spinRef} scale={config.scale}>
          <React.Suspense fallback={<ExhibitFarProxy config={config} />}>
            <ActiveSpecimenModel
              entity={entity}
              lightingPreset={isNearest ? 'dramatic' : 'museum'}
              exploded={false}
              isHallMode={true}
            />
          </React.Suspense>
        </group>
      </group>

      {/* In-World Reader Stand */}
      <ReaderStand config={config} onInspect={() => onInspect(entity.id)} />
    </group>
  );
});

// ─── Monumental Vaulted Glass & Iron Skylight ───
const MonumentalSkylight = React.memo(function MonumentalSkylight({
  isNight,
}: {
  isNight: boolean;
}) {
  return (
    <group position={[0, 29.0, 0]} raycast={() => null}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 164]} />
        <meshStandardMaterial
          color={isNight ? '#142036' : '#edf6fc'}
          transparent
          opacity={0.38}
          roughness={0.08}
        />
      </mesh>

      {/* Longitudinal Iron Backbone Trusses */}
      {[-17, -8.5, 0, 8.5, 17].map((x, idx) => (
        <mesh key={idx} position={[x, 0.25, 0]}>
          <boxGeometry args={[0.4, 0.5, 164.5]} />
          <meshStandardMaterial color="#141416" metalness={0.92} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
});

// ─── Northern Apse Monumental Archway Framing Sue T-Rex ───
const NorthernApseArch = React.memo(function NorthernApseArch() {
  return (
    <group position={[0, 0, -74]} raycast={() => null}>
      {/* Grand Classical Portal Frieze */}
      <mesh position={[0, 22.0, 0]}>
        <boxGeometry args={[36.0, 2.8, 1.8]} />
        <meshStandardMaterial color={statuaryMarbleMat.color} roughness={0.2} />
      </mesh>
      {/* Left Wall Flank */}
      <mesh position={[-16.0, 11.0, 0]}>
        <boxGeometry args={[6.0, 22.0, 1.5]} />
        <meshStandardMaterial color={statuaryMarbleMat.color} roughness={0.25} />
      </mesh>
      {/* Right Wall Flank */}
      <mesh position={[16.0, 11.0, 0]}>
        <boxGeometry args={[6.0, 22.0, 1.5]} />
        <meshStandardMaterial color={statuaryMarbleMat.color} roughness={0.25} />
      </mesh>
      {/* Apse Recessed Niche Backdrop */}
      <mesh position={[0, 12.0, -2.5]}>
        <boxGeometry args={[26.0, 24.0, 1.2]} />
        <meshStandardMaterial color="#161514" roughness={0.8} />
      </mesh>
      {/* Golden Frieze Ribbon */}
      <mesh position={[0, 20.2, 0.95]}>
        <planeGeometry args={[32.0, 0.4]} />
        <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
      </mesh>
    </group>
  );
});

// ─── Grand Museum Architecture Environment (76m x 168m Monumental Hall) ───
const GrandMuseumArchitecture = React.memo(function GrandMuseumArchitecture({
  isNight,
  onFloorClick,
}: {
  isNight: boolean;
  onFloorClick: (point: THREE.Vector3) => void;
}) {
  const floorTextures = useMemo(() => getMuseumMarbleFloorTextures(isNight, 38, 84), [isNight]);
  const wallTextures = useMemo(() => getMuseumWallTextures(isNight, 38, 8), [isNight]);
  const aisleTexture = useMemo(() => getNaveAisleMosaicTexture(isNight), [isNight]);
  const cofferTexture = useMemo(() => getCofferedCeilingTexture(isNight), [isNight]);

  // Track click vs drag threshold on floor mesh to eliminate accidental glides
  const pointerDownPos = useRef<{ x: number; y: number; time: number } | null>(null);

  const handlePointerDown = useCallback((e: any) => {
    pointerDownPos.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
  }, []);

  const handlePointerUp = useCallback(
    (e: any) => {
      if (!pointerDownPos.current) return;
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const dt = performance.now() - pointerDownPos.current.time;
      pointerDownPos.current = null;

      // Only treat as floor navigation click if movement < 6px and duration < 350ms
      if (e.point && Math.hypot(dx, dy) < 6 && dt < 350) {
        e.stopPropagation();
        onFloorClick(e.point);
      }
    },
    [onFloorClick]
  );

  return (
    <group>
      {/* ── 1. Polished Honed Italian Marble Floor (76m x 168m) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -4]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[76, 168]} />
        <meshStandardMaterial
          color={isNight ? '#0b0c10' : '#1e1c19'}
          roughness={0.16}
          metalness={0.22}
          map={floorTextures.map || undefined}
          bumpMap={floorTextures.bumpMap || undefined}
          bumpScale={0.03}
          roughnessMap={floorTextures.roughnessMap || undefined}
        />
      </mesh>

      {/* Grand Central Nave Aisle Carpet (Geometric Diamond Marble Mosaic Inlay) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -4]} raycast={() => null}>
        <planeGeometry args={[8.5, 164]} />
        <meshStandardMaterial
          color={isNight ? '#0a0b0e' : '#1c1b18'}
          roughness={0.16}
          metalness={0.25}
          map={aisleTexture || undefined}
        />
      </mesh>

      {/* Inlaid Polished Brass Colonnade & Nave Divider Ribbons */}
      {[-17.0, -4.25, 4.25, 17.0].map((x, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.018, -4]} raycast={() => null}>
          <planeGeometry args={[0.14, 166]} />
          <meshStandardMaterial color="#caa04d" metalness={0.94} roughness={0.18} />
        </mesh>
      ))}

      {/* Raised Gallery Podia for West & East Colonnades */}
      <mesh position={[-27.0, 0.08, -4]} raycast={() => null}>
        <boxGeometry args={[20, 0.16, 166]} />
        <meshStandardMaterial color={isNight ? '#0e1014' : '#221f1c'} roughness={0.2} metalness={0.18} />
      </mesh>
      <mesh position={[27.0, 0.08, -4]} raycast={() => null}>
        <boxGeometry args={[20, 0.16, 166]} />
        <meshStandardMaterial color={isNight ? '#0e1014' : '#221f1c'} roughness={0.2} metalness={0.18} />
      </mesh>

      {/* ── 2. Central Sunken Reflection Pool (11m x 22m) ── */}
      <group position={[0, 0.02, 7]} raycast={() => null}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[11.6, 22.6]} />
          <meshStandardMaterial color={isNight ? '#040507' : '#100f0e'} roughness={0.12} metalness={0.4} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
          <planeGeometry args={[10.8, 21.8]} />
          <meshStandardMaterial color="#caa04d" roughness={0.25} metalness={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, 0]}>
          <planeGeometry args={[10.4, 21.4]} />
          <meshStandardMaterial
            color={isNight ? '#041728' : '#0d4052'}
            roughness={0.04}
            metalness={0.95}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>

      {/* ── 3. Instanced Colonnade, Benches, Barriers & Wall Sconces ── */}
      <InstancedColonnade />
      <InstancedBenches />
      <InstancedBarriers />
      <InstancedWallSconces />

      {/* Continuous Classical Entablature Architrave Beams Above Columns */}
      <mesh position={[-17.0, 22.8, -4]} raycast={() => null} frustumCulled={false}>
        <boxGeometry args={[1.5, 1.5, 168.0]} />
        <meshStandardMaterial color={statuaryMarbleMat.color} roughness={0.2} />
      </mesh>
      <mesh position={[17.0, 22.8, -4]} raycast={() => null} frustumCulled={false}>
        <boxGeometry args={[1.5, 1.5, 168.0]} />
        <meshStandardMaterial color={statuaryMarbleMat.color} roughness={0.2} />
      </mesh>

      {/* ── 4. Ashlar Travertine Limestone Perimeter Walls (76m x 168m) ── */}
      <mesh position={[0, 15.0, -82.0]} raycast={() => null} frustumCulled={false}>
        <boxGeometry args={[76, 32, 2.0]} />
        <meshStandardMaterial
          color={isNight ? '#12141a' : '#ded8cb'}
          roughness={0.76}
          map={wallTextures.map || undefined}
          bumpMap={wallTextures.bumpMap || undefined}
          bumpScale={0.04}
        />
      </mesh>
      <mesh position={[0, 15.0, 74.0]} raycast={() => null} frustumCulled={false}>
        <boxGeometry args={[76, 32, 2.0]} />
        <meshStandardMaterial
          color={isNight ? '#12141a' : '#ded8cb'}
          roughness={0.76}
          map={wallTextures.map || undefined}
          bumpMap={wallTextures.bumpMap || undefined}
          bumpScale={0.04}
        />
      </mesh>
      <mesh position={[-38.0, 15.0, -4.0]} raycast={() => null} frustumCulled={false}>
        <boxGeometry args={[2.0, 32, 170]} />
        <meshStandardMaterial
          color={isNight ? '#12141a' : '#ded8cb'}
          roughness={0.76}
          map={wallTextures.map || undefined}
          bumpMap={wallTextures.bumpMap || undefined}
          bumpScale={0.04}
        />
      </mesh>
      <mesh position={[38.0, 15.0, -4.0]} raycast={() => null} frustumCulled={false}>
        <boxGeometry args={[2.0, 32, 170]} />
        <meshStandardMaterial
          color={isNight ? '#12141a' : '#ded8cb'}
          roughness={0.76}
          map={wallTextures.map || undefined}
          bumpMap={wallTextures.bumpMap || undefined}
          bumpScale={0.04}
        />
      </mesh>

      {/* ── 5. Northern Apse Classical Portal Archway ── */}
      <NorthernApseArch />

      {/* ── 6. Second-Story Mezzanine Arcades & Coffered Ceiling Soffits ── */}
      <mesh position={[-27.0, 23.2, -4.0]} raycast={() => null} frustumCulled={false}>
        <boxGeometry args={[20, 0.7, 168]} />
        <meshStandardMaterial
          color={isNight ? '#0d0f14' : '#cec7b9'}
          roughness={0.75}
          map={cofferTexture || undefined}
        />
      </mesh>
      <mesh position={[27.0, 23.2, -4.0]} raycast={() => null} frustumCulled={false}>
        <boxGeometry args={[20, 0.7, 168]} />
        <meshStandardMaterial
          color={isNight ? '#0d0f14' : '#cec7b9'}
          roughness={0.75}
          map={cofferTexture || undefined}
        />
      </mesh>

      {/* Classical Mezzanine Balustrades */}
      <mesh position={[-17.0, 24.2, -4.0]} raycast={() => null} frustumCulled={false}>
        <boxGeometry args={[0.25, 1.0, 168]} />
        <meshStandardMaterial color="#d4af37" metalness={0.88} roughness={0.25} />
      </mesh>
      <mesh position={[17.0, 24.2, -4.0]} raycast={() => null} frustumCulled={false}>
        <boxGeometry args={[0.25, 1.0, 168]} />
        <meshStandardMaterial color="#d4af37" metalness={0.88} roughness={0.25} />
      </mesh>

      {/* ── 7. Skylight Vault ── */}
      <MonumentalSkylight isNight={isNight} />

      {/* ── 8. Hanging Bronze Chandeliers (Baked Emissive Light) ── */}
      {[-50, -25, 0, 25, 50].map((z, idx) => (
        <group key={idx} position={[0, 22.0, z]} raycast={() => null}>
          <mesh position={[0, 4.0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 8.0, 6]} />
            <meshStandardMaterial color="#111" metalness={0.92} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.4, 3.8, 24]} />
            <meshStandardMaterial color="#caa04d" metalness={0.92} roughness={0.25} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
            <ringGeometry args={[3.35, 3.75, 24]} />
            <meshBasicMaterial color={isNight ? '#ffdf9e' : '#fff4dd'} />
          </mesh>
        </group>
      ))}

      {/* ── 9. Master Balanced Gallery Lighting (Only 3 Dynamic Lights in Scene!) ── */}
      {isNight ? (
        <>
          <ambientLight intensity={1.2} color="#1b2336" />
          <hemisphereLight args={['#24324c', '#0c1018', 1.3]} />
          <directionalLight position={[16, 38, 18]} intensity={2.2} color="#9ec5ff" />
        </>
      ) : (
        <>
          <ambientLight intensity={1.6} color="#faf7f0" />
          <hemisphereLight args={['#ffffff', '#363028', 1.8]} />
          <directionalLight position={[18, 45, 14]} intensity={3.2} color="#fffcf2" />
        </>
      )}

      {/* Floating Gallery Dust Particles */}
      <Sparkles
        count={isNight ? 60 : 40}
        scale={[68, 24, 150]}
        size={isNight ? 2.5 : 1.8}
        speed={0.3}
        color={isNight ? '#ffd700' : '#ffffff'}
        opacity={isNight ? 0.7 : 0.4}
      />
    </group>
  );
});

// ─── Click-to-Move Target Reticle Indicator ───
function WaypointReticle({ point }: { point: [number, number, number] | null }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (point && ringRef.current) ringRef.current.rotation.z += delta * 3;
  });

  return (
    <group
      position={point ? [point[0], 0.05, point[2]] : [0, -100, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={Boolean(point)}
      raycast={() => null}
    >
      <mesh ref={ringRef}>
        <ringGeometry args={[0.35, 0.52, 20]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.14, 14]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

// ─── Module-level static vectors to prevent per-frame garbage collection allocations ───
const _tempMoveDir = new THREE.Vector3();
const _yAxis = new THREE.Vector3(0, 1, 0);
const _tempLookTarget = new THREE.Vector3();

// ─── Precision Smooth Walker & Camera Controller ───
function WalkerController({
  onProximityChange,
  targetPos,
  targetLookAt,
  onInteract,
  flashlightOn,
  toggleFlashlight,
  onClearTarget,
  isIntro,
  onIntroComplete,
  visitorPosRef,
  visitorYawRef,
  virtualMove,
  isPointerLocked,
  isControlsModalOpen = false,
}: {
  onProximityChange: (nearestId: string | null) => void;
  targetPos: [number, number, number] | null;
  targetLookAt: [number, number, number] | null;
  onInteract?: () => void;
  flashlightOn: boolean;
  toggleFlashlight: () => void;
  onClearTarget: () => void;
  isIntro: boolean;
  onIntroComplete: () => void;
  visitorPosRef: React.MutableRefObject<[number, number]>;
  visitorYawRef: React.MutableRefObject<number>;
  virtualMove: { forward: boolean; backward: boolean; left: boolean; right: boolean; sprint: boolean };
  isPointerLocked: boolean;
  isControlsModalOpen?: boolean;
}) {
  const { camera, scene, gl } = useThree();
  const keys = useRef<{ [key: string]: boolean }>({});
  const { playFootstep, playClick } = useGlobalSound();
  const lastStepTime = useRef(0);
  const lastCheckTime = useRef(0);
  const currentNearestId = useRef<string | null>(null);

  const introProgress = useRef(0);
  const onIntroCompleteRef = useRef(onIntroComplete);
  onIntroCompleteRef.current = onIntroComplete;

  const onInteractRef = useRef(onInteract);
  onInteractRef.current = onInteract;
  const toggleFlashlightRef = useRef(toggleFlashlight);
  toggleFlashlightRef.current = toggleFlashlight;
  const onClearTargetRef = useRef(onClearTarget);
  onClearTargetRef.current = onClearTarget;

  const torchLightRef = useRef<THREE.SpotLight>(null);
  const torchTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());

  useEffect(() => {
    scene.add(torchTargetRef.current);
    return () => {
      scene.remove(torchTargetRef.current);
    };
  }, [scene]);

  // Position, velocity, and orientation refs
  const pos = useRef(new THREE.Vector3(0, 14, 62));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const targetVelocity = useRef(new THREE.Vector3(0, 0, 0));

  const currentYaw = useRef(0);
  const targetYaw = useRef(0);
  const currentPitch = useRef(-0.05);
  const targetPitch = useRef(-0.05);

  // Natural walking gait cycle ref (organic head-bobbing & lateral sway)
  const gaitCycle = useRef(0);

  // High-precision smoothstep glide trajectory state
  const glideState = useRef<{
    active: boolean;
    startX: number;
    startZ: number;
    targetX: number;
    targetZ: number;
    startYaw: number;
    targetYaw: number | null;
    startPitch: number;
    targetPitch: number | null;
    elapsed: number;
    duration: number;
  } | null>(null);

  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });

  // Initialize or re-target cinematic glide
  useEffect(() => {
    if (targetPos) {
      const dist = Math.hypot(targetPos[0] - pos.current.x, targetPos[2] - pos.current.z);
      if (dist > 0.15) {
        let desiredYaw: number | null = null;
        let desiredPitch: number | null = null;
        if (targetLookAt) {
          const dx = targetLookAt[0] - targetPos[0];
          const dz = targetLookAt[2] - targetPos[2];
          const dy = targetLookAt[1] - targetPos[1];
          desiredYaw = Math.atan2(dx, -dz);
          const horizDist = Math.hypot(dx, dz);
          desiredPitch = Math.max(-0.4, Math.min(0.4, Math.atan2(dy, Math.max(0.1, horizDist))));
        }

        const duration = Math.max(0.7, Math.min(2.2, dist / 18));
        glideState.current = {
          active: true,
          startX: pos.current.x,
          startZ: pos.current.z,
          targetX: targetPos[0],
          targetZ: targetPos[2],
          startYaw: currentYaw.current,
          targetYaw: desiredYaw,
          startPitch: currentPitch.current,
          targetPitch: desiredPitch,
          elapsed: 0,
          duration,
        };
      } else {
        glideState.current = null;
        onClearTargetRef.current?.();
      }
    } else {
      glideState.current = null;
    }
  }, [targetPos, targetLookAt]);

  useEffect(() => {
    camera.position.set(pos.current.x, pos.current.y, pos.current.z);
    camera.lookAt(0, 3, -66);

    const onKeyDown = (e: KeyboardEvent) => {
      if (isControlsModalOpen) return;
      keys.current[e.code] = true;
      if (e.code === 'Space' && isIntro) {
        onIntroCompleteRef.current();
        return;
      }
      if (e.code === 'KeyF') {
        playClick();
        toggleFlashlightRef.current?.();
      }
      if (e.code === 'KeyE') {
        onInteractRef.current?.();
      }
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.code)) {
        glideState.current = null;
        onClearTargetRef.current?.();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    // Pointer events for desktop and mobile drag
    const dom = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'CANVAS') {
        isDragging.current = true;
        prevMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isIntro) return;

      if (isPointerLocked) {
        // FPS mouse look
        const dx = e.movementX;
        const dy = e.movementY;
        targetYaw.current -= dx * 0.0022;
        targetPitch.current = Math.max(-0.65, Math.min(0.65, targetPitch.current - dy * 0.0022));
        return;
      }

      if (!isDragging.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      prevMouse.current = { x: e.clientX, y: e.clientY };

      targetYaw.current -= dx * 0.003;
      targetPitch.current = Math.max(-0.65, Math.min(0.65, targetPitch.current - dy * 0.003));
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [camera, playClick, isIntro, gl.domElement, isPointerLocked, isControlsModalOpen]);

  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.1);

    // ── 1. Single-pass master camera frustum update (powers GPU culling for all 20 exhibits) ──
    _sharedProjMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    _sharedFrustum.setFromProjectionMatrix(_sharedProjMatrix);

    // ── Phase 1: Cinematic Entrance Fly-Through ──
    if (isIntro) {
      introProgress.current += safeDelta * 0.32;
      const t = Math.min(1, introProgress.current);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      pos.current.x = THREE.MathUtils.lerp(0, 0, ease);
      pos.current.y = THREE.MathUtils.lerp(14, 2.05, ease);
      pos.current.z = THREE.MathUtils.lerp(62, 40, ease);

      camera.position.copy(pos.current);

      const lookTargetZ = THREE.MathUtils.lerp(-66, -24, ease);
      const lookTargetY = THREE.MathUtils.lerp(4.0, 2.1, ease);
      camera.lookAt(0, lookTargetY, lookTargetZ);

      visitorPosRef.current = [pos.current.x, pos.current.z];
      visitorYawRef.current = currentYaw.current;

      if (t >= 1) {
        onIntroCompleteRef.current();
      }
      return;
    }

    // ── Phase 2: Glide to Target OR Grounded Physics Walking ──
    let isMoving = false;
    let isSprinting = false;

    if (glideState.current && glideState.current.active) {
      const g = glideState.current;
      g.elapsed += safeDelta;
      const t = Math.min(1, g.elapsed / g.duration);

      // Smoothstep S-curve easing (Cubic Hermite: 3t^2 - 2t^3)
      const ease = t * t * (3 - 2 * t);

      pos.current.x = THREE.MathUtils.lerp(g.startX, g.targetX, ease);
      pos.current.z = THREE.MathUtils.lerp(g.startZ, g.targetZ, ease);

      // Shortest-arc camera yaw & pitch alignment
      if (g.targetYaw !== null) {
        let diff = g.targetYaw - g.startYaw;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        targetYaw.current = g.startYaw + diff * ease;
      }
      if (g.targetPitch !== null) {
        targetPitch.current = THREE.MathUtils.lerp(g.startPitch, g.targetPitch, ease);
      }

      if (t >= 1) {
        glideState.current = null;
        onClearTargetRef.current?.();
      }
    } else {
      isSprinting =
        Boolean(keys.current['ShiftLeft'] || keys.current['ShiftRight'] || virtualMove.sprint);
      const maxSpeed = isSprinting ? 9.5 : 5.2;

      const inputX =
        (keys.current['KeyD'] || keys.current['ArrowRight'] || virtualMove.right ? 1 : 0) -
        (keys.current['KeyA'] || keys.current['ArrowLeft'] || virtualMove.left ? 1 : 0);
      const inputZ =
        (keys.current['KeyS'] || keys.current['ArrowDown'] || virtualMove.backward ? 1 : 0) -
        (keys.current['KeyW'] || keys.current['ArrowUp'] || virtualMove.forward ? 1 : 0);

      _tempMoveDir.set(inputX, 0, inputZ);
      if (_tempMoveDir.lengthSq() > 0) {
        _tempMoveDir.normalize();
        _tempMoveDir.applyAxisAngle(_yAxis, currentYaw.current);
        targetVelocity.current.copy(_tempMoveDir.multiplyScalar(maxSpeed));

        const now = performance.now();
        if (now - lastStepTime.current > (isSprinting ? 270 : 370)) {
          lastStepTime.current = now;
          playFootstep();
        }
      } else {
        targetVelocity.current.set(0, 0, 0);
      }

      velocity.current.lerp(targetVelocity.current, 1 - Math.exp(-14 * safeDelta));

      pos.current.x += velocity.current.x * safeDelta;
      pos.current.z += velocity.current.z * safeDelta;

      // Solid collision resolution with frictionless wall-sliding
      const [resolvedX, resolvedZ] = resolveVisitorCollisions(pos.current.x, pos.current.z, velocity.current);
      pos.current.x = resolvedX;
      pos.current.z = resolvedZ;

      isMoving = velocity.current.lengthSq() > 0.08;
    }

    // Natural avatar gait bobbing & subtle lateral sway
    if (isMoving) {
      const moveSpeed = velocity.current.length();
      gaitCycle.current += safeDelta * moveSpeed * (isSprinting ? 2.6 : 2.2);
    } else {
      gaitCycle.current = THREE.MathUtils.damp(
        gaitCycle.current,
        Math.round(gaitCycle.current / Math.PI) * Math.PI,
        8,
        safeDelta
      );
    }

    const bobY = isMoving ? Math.sin(gaitCycle.current) * 0.024 : 0;
    const swayX = isMoving ? Math.cos(gaitCycle.current * 0.5) * 0.012 : 0;

    visitorPosRef.current = [pos.current.x, pos.current.z];
    visitorYawRef.current = currentYaw.current;

    currentYaw.current = THREE.MathUtils.damp(currentYaw.current, targetYaw.current, 18, safeDelta);
    currentPitch.current = THREE.MathUtils.damp(currentPitch.current, targetPitch.current, 18, safeDelta);

    camera.position.set(pos.current.x + swayX, 2.05 + bobY, pos.current.z);

    _tempLookTarget.set(
      camera.position.x + Math.sin(currentYaw.current) * Math.cos(currentPitch.current),
      camera.position.y + Math.sin(currentPitch.current),
      camera.position.z - Math.cos(currentYaw.current) * Math.cos(currentPitch.current)
    );
    camera.lookAt(_tempLookTarget);

    if (torchLightRef.current && torchTargetRef.current) {
      torchLightRef.current.position.copy(camera.position);
      torchTargetRef.current.position.copy(_tempLookTarget);
      torchLightRef.current.target = torchTargetRef.current;
    }

    // Throttled proximity check (~5Hz)
    const now = performance.now();
    if (now - lastCheckTime.current > 200) {
      lastCheckTime.current = now;

      let nearestId: string | null = null;
      let minDistSq = 64; // 8.0m squared threshold (comfortably covers calibrated viewing distances up to 7.2m)

      for (let i = 0; i < HALL_SPECIMENS.length; i++) {
        const item = HALL_SPECIMENS[i];
        const dx = item.pos[0] - pos.current.x;
        const dz = item.pos[2] - pos.current.z;
        const distSq = dx * dx + dz * dz;
        if (distSq < minDistSq) {
          minDistSq = distSq;
          nearestId = item.entityId;
        }
      }

      if (nearestId !== currentNearestId.current) {
        currentNearestId.current = nearestId;
        onProximityChange(nearestId);
      }
    }
  });

  return (
    <spotLight
      ref={torchLightRef}
      visible={flashlightOn}
      intensity={flashlightOn ? 10.0 : 0}
      color="#fff6e8"
      angle={0.46}
      penumbra={0.7}
      distance={38}
    />
  );
}

// ─── High-Performance Isolated Museum Radar HUD ───
// Self-contained state decoupled from GrandMuseumHall3D to eliminate 3Hz root re-renders
const MuseumRadar = React.memo(function MuseumRadar({
  visitorPosRef,
  visitorYawRef,
  discoveredIds,
  onGlideTo,
}: {
  visitorPosRef: React.MutableRefObject<[number, number]>;
  visitorYawRef: React.MutableRefObject<number>;
  discoveredIds: string[];
  onGlideTo: (pos: [number, number, number], lookAt: [number, number, number] | null) => void;
}) {
  const [radarCoords, setRadarCoords] = useState<[number, number]>(() => visitorPosRef.current);
  const [radarHeading, setRadarHeading] = useState<number>(() => visitorYawRef.current);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRadarCoords([visitorPosRef.current[0], visitorPosRef.current[1]]);
      setRadarHeading(visitorYawRef.current);
    }, 250);
    return () => clearInterval(timer);
  }, [visitorPosRef, visitorYawRef]);

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="px-3 py-2 bg-black/90 hover:bg-neutral-800 text-[#ffd700] border border-neutral-800 rounded-xl shadow-xl font-mono text-xs font-bold flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition-colors"
        title="Open Radar Map"
      >
        <span>🗺️</span>
        <span>Radar</span>
      </button>
    );
  }

  return (
    <div className="w-44 sm:w-48 h-52 sm:h-56 bg-black/90 border border-neutral-800 rounded-2xl shadow-xl p-2.5 flex flex-col justify-between backdrop-blur-md">
      <div className="flex justify-between items-center text-[9px] font-mono text-[#ffd700] font-bold uppercase">
        <span className="flex items-center gap-1">
          <span>Radar</span>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-neutral-400 hover:text-white px-1 cursor-pointer font-bold"
            title="Minimize Radar"
          >
            —
          </button>
        </span>
        <span>X:{radarCoords[0].toFixed(0)} Z:{radarCoords[1].toFixed(0)}</span>
      </div>

      <div className="relative w-full flex-1 bg-neutral-950/80 rounded border border-neutral-800/80 my-1 overflow-hidden">
        {/* Exhibits blips (Click to glide to calibrated exhibit perspective) */}
        {HALL_SPECIMENS.map((hs) => {
          const xPercent = ((hs.pos[0] + 38) / 76) * 100;
          const zPercent = ((hs.pos[2] + 84) / 168) * 100;
          const isFound = discoveredIds.includes(hs.entityId);
          const vp = getSpecimenViewParameters(hs);
          return (
            <button
              key={hs.entityId}
              onClick={() => onGlideTo(vp.viewPos, vp.lookAt)}
              className={`absolute w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-150 cursor-pointer ${
                isFound ? 'bg-emerald-400' : 'bg-[#ffd700]'
              }`}
              style={{ left: `${xPercent}%`, top: `${zPercent}%` }}
              title={`${hs.shortTitle} (Click to glide)`}
            />
          );
        })}

        {/* Central pool indicator */}
        <div
          className="absolute border border-cyan-500/30 rounded-sm -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: `${(11.6 / 76) * 100}%`,
            height: `${(22.6 / 168) * 100}%`,
            left: '50%',
            top: `${((7 + 84) / 168) * 100}%`,
          }}
        />

        {/* Colonnade column indicator markers */}
        {[-17, 17].map((cx, cidx) => (
          <div
            key={cidx}
            className="absolute w-[1px] h-full bg-neutral-700/30 pointer-events-none"
            style={{ left: `${((cx + 38) / 76) * 100}%` }}
          />
        ))}

        {/* Visitor beacon with directional vision cone */}
        <div
          className="absolute w-3 h-3 bg-cyan-400/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-ping"
          style={{
            left: `${((radarCoords[0] + 38) / 76) * 100}%`,
            top: `${((radarCoords[1] + 84) / 168) * 100}%`,
          }}
        />
        <div
          className="absolute w-2 h-2 bg-cyan-400 border border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${((radarCoords[0] + 38) / 76) * 100}%`,
            top: `${((radarCoords[1] + 84) / 168) * 100}%`,
          }}
        >
          {/* Directional Heading Vision Cone Indicator */}
          <div
            className="absolute w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[9px] border-b-cyan-300 -top-3 -left-1 pointer-events-none origin-bottom"
            style={{
              transform: `rotate(${-radarHeading * (180 / Math.PI) + 180}deg)`,
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-400 uppercase">
        <span>● {discoveredIds.length}/{HALL_SPECIMENS.length} Found</span>
        <span>▲ Facing: {((-radarHeading * (180 / Math.PI)) % 360).toFixed(0)}°</span>
      </div>
    </div>
  );
});

// ─── Master Real Museum Experience ───
export function GrandMuseumHall3D() {
  const [activeNearestId, setActiveNearestId] = useState<string | null>(null);
  const [navTarget, setNavTarget] = useState<[number, number, number] | null>(null);
  const [navLookAt, setNavLookAt] = useState<[number, number, number] | null>(null);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  // Virtual On-Screen D-Pad / Touch controls
  const [virtualMove, setVirtualMove] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  // Visitor coordinates and yaw held in refs to prevent React canvas re-renders during walking
  const visitorPosRef = useRef<[number, number]>([0, 40]);
  const visitorYawRef = useRef<number>(0);

  // Cinematic Entrance Animation State
  const [isIntro, setIsIntro] = useState(true);
  const [doorsOpen, setDoorsOpen] = useState(false);

  // Discovery Log
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [recentDiscovery, setRecentDiscovery] = useState<string | null>(null);

  // MUSEO SmartScene Streaming Controller State
  const [previewIds, setPreviewIds] = useState<string[]>([]);
  const previewSet = useMemo(() => new Set(previewIds), [previewIds]);
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
  }, []);

  // HUD layout states to prevent viewport element overlapping
  const [guideCollapsed, setGuideCollapsed] = useState(true);
  const [dismissedCardId, setDismissedCardId] = useState<string | null>(null);
  const [showDpad, setShowDpad] = useState(false);
  const [showDossierDrawer, setShowDossierDrawer] = useState(false);
  const [isCardMinimized, setIsCardMinimized] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const { stamps, toggleStamp, init: initCollector } = useCollectorStore();

  useEffect(() => {
    initCollector();
  }, [initCollector]);

  useEffect(() => {
    // Reset dismissed card when visitor walks to another exhibit or steps away
    setDismissedCardId(null);
  }, [activeNearestId]);

  const { openEntityModal } = useAppStore();
  const { playClick, playLaser, playChime, playStamp, playWarp } = useGlobalSound();
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    return () => {
      if (glRef.current) {
        try {
          glRef.current.dispose();
          glRef.current.forceContextLoss();
        } catch {}
      }
    };
  }, []);

  // Trigger Door Opening Animation on Mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setDoorsOpen(true);
      playWarp();
    }, 400);

    return () => clearTimeout(timer);
  }, [playWarp]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('museo_hall_catalog');
      if (saved) {
        setDiscoveredIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const activeEntity = useMemo(() => {
    if (!activeNearestId) return null;
    return getEntityById(activeNearestId) || entities.find((e) => e.id === activeNearestId) || null;
  }, [activeNearestId]);

  const activeConfig = useMemo(() => {
    if (!activeNearestId) return null;
    return HALL_SPECIMENS.find((h) => h.entityId === activeNearestId) || null;
  }, [activeNearestId]);

  useEffect(() => {
    if (!activeNearestId) return;
    setDiscoveredIds((prev) => {
      if (!prev.includes(activeNearestId)) {
        const next = [...prev, activeNearestId];
        try {
          localStorage.setItem('museo_hall_catalog', JSON.stringify(next));
        } catch {
          // ignore
        }
        playStamp();
        const ent = entities.find((e) => e.id === activeNearestId);
        setRecentDiscovery(ent ? ent.name : activeNearestId);
        setTimeout(() => setRecentDiscovery(null), 3500);
        return next;
      }
      return prev;
    });
  }, [activeNearestId, playStamp]);

  const handleGlideTo = useCallback(
    (pos: [number, number, number], lookAt: [number, number, number] | null = null) => {
      playLaser();
      setNavTarget(pos);
      setNavLookAt(lookAt);
    },
    [playLaser]
  );

  const handleFloorClick = useCallback(
    (pt: THREE.Vector3) => {
      const dx = pt.x - visitorPosRef.current[0];
      const dz = pt.z - visitorPosRef.current[1];
      if (Math.hypot(dx, dz) > 0.8) {
        handleGlideTo([pt.x, 2.05, pt.z], null);
      }
    },
    [handleGlideTo]
  );

  const handleCuratorSpeak = useCallback(() => {
    if (!activeEntity) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    const text = `${activeEntity.name}. ${activeConfig?.dating ? `Dated to ${activeConfig.dating}.` : ''} Discovered in ${activeConfig?.location || activeEntity.placeOfDiscovery || 'an accredited site'}. ${activeEntity.hook ? `${activeEntity.hook} ` : ''}${activeEntity.story || activeEntity.significance}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') || v.name.includes('Curator') || v.name.includes('Daniel') || v.name.includes('Google'))
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (voice) utterance.voice = voice;

    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);

    setIsNarrating(true);
    window.speechSynthesis.speak(utterance);
  }, [activeEntity, activeConfig]);

  const handleInspectEntity = useCallback(
    (entityId: string) => {
      playChime();
      openEntityModal(entityId);
    },
    [playChime, openEntityModal]
  );

  const handleInteract = useCallback(() => {
    if (activeEntity) {
      playChime();
      openEntityModal(activeEntity.id);
    }
  }, [activeEntity, openEntityModal, playChime]);

  const handleReplayIntro = useCallback(() => {
    setIsIntro(true);
    setDoorsOpen(false);
    setTimeout(() => {
      setDoorsOpen(true);
      playWarp();
    }, 400);
  }, [playWarp]);

  // Pointer Lock toggle for FPS mode
  const togglePointerLock = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    if (document.pointerLockElement) {
      document.exitPointerLock();
    } else {
      canvas.requestPointerLock();
    }
  }, []);

  useEffect(() => {
    const onLockChange = () => {
      setIsPointerLocked(Boolean(document.pointerLockElement));
    };
    document.addEventListener('pointerlockchange', onLockChange);
    return () => document.removeEventListener('pointerlockchange', onLockChange);
  }, []);

  // Hotkey listener for help modal (H, Esc) and FPS mode (P)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyH') {
        setIsControlsModalOpen((prev) => !prev);
      }
      if (e.code === 'KeyI' && activeEntity) {
        setShowDossierDrawer((prev) => !prev);
      }
      if (e.code === 'Escape') {
        setIsControlsModalOpen(false);
        setShowDossierDrawer(false);
      }
      if (e.code === 'KeyP') {
        togglePointerLock();
      }
      if (e.code === 'Digit1') {
        handleGlideTo([0, 2.05, -50], [0, 2.7, -66]);
      }
      if (e.code === 'Digit2') {
        handleGlideTo([-20, 2.05, 0], [-25.0, 2.3, -4]);
      }
      if (e.code === 'Digit3') {
        handleGlideTo([20, 2.05, 0], [25.0, 2.1, -32]);
      }
      if (e.code === 'Digit4') {
        handleGlideTo([0, 2.05, 22], [-9.5, 2.25, 12]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePointerLock, handleGlideTo]);

  return (
    <div className="relative w-full h-full bg-[#07080a] overflow-hidden select-none font-outfit">
      {/* 3D WebGL Canvas (Optimized: DPR=1 for buttery 60 FPS on any GPU) */}
      <Canvas
        shadows={false}
        dpr={isMobile ? 1 : [1, 1.25]}
        camera={{ position: [0, 14, 62], fov: 52 }}
        raycaster={{ firstHitOnly: true }}
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          stencil: false,
          depth: true,
          alpha: false,
        }}
        onCreated={({ gl }) => {
          glRef.current = gl;
          const handleContextLost = (e: Event) => {
            e.preventDefault();
            console.warn('WebGL context lost, recovering...');
          };
          gl.domElement.addEventListener('webglcontextlost', handleContextLost, false);
        }}
        style={{ touchAction: 'none' }}
      >
        <MuseumAssetLoader>
          <MuseumPerformance isMobile={isMobile} />
          <StreamingController
            exhibits={HALL_SPECIMENS}
            setPreviewIds={setPreviewIds}
            isMobile={isMobile}
            selectedId={activeNearestId}
          />

          <GrandMuseumArchitecture isNight={isNight} onFloorClick={handleFloorClick} />

          {/* ── Single Dynamic Key Spotlight tracking the active specimen ── */}
          {activeConfig && (
            <spotLight
              position={[activeConfig.pos[0], 16, activeConfig.pos[2] + 4]}
              target-position={[activeConfig.pos[0], activeConfig.pos[1] + 2.0, activeConfig.pos[2]]}
              intensity={20}
              color="#fff4dd"
              angle={0.48}
              penumbra={0.7}
              distance={34}
            />
          )}

          {/* 20 Exhibition Masterworks with GPU Frustum & Distance Culling */}
          {HALL_SPECIMENS.map((spec) => {
            const ent = entities.find((e) => e.id === spec.entityId);
            if (!ent) return null;
            const isNear = activeNearestId === spec.entityId;
            const isPreviewActive = previewSet.has(spec.id);

            return (
              <FastExhibitPedestal
                key={spec.entityId}
                config={spec}
                entity={ent}
                isNearest={isNear}
                previewActive={isPreviewActive}
                onNavigate={handleGlideTo}
                onInspect={handleInspectEntity}
              />
            );
          })}

          <WaypointReticle point={navTarget} />

          <WalkerController
            onProximityChange={setActiveNearestId}
            targetPos={navTarget}
            targetLookAt={navLookAt}
            onInteract={handleInteract}
            flashlightOn={flashlightOn}
            toggleFlashlight={() => setFlashlightOn((prev) => !prev)}
            onClearTarget={() => {
              setNavTarget(null);
              setNavLookAt(null);
            }}
            isIntro={isIntro}
            onIntroComplete={() => setIsIntro(false)}
            visitorPosRef={visitorPosRef}
            visitorYawRef={visitorYawRef}
            virtualMove={virtualMove}
            isPointerLocked={isPointerLocked}
            isControlsModalOpen={isControlsModalOpen}
          />
        </MuseumAssetLoader>
      </Canvas>

      {/* ═══════════════════════════════════════════════════════════
          CINEMATIC MONOLITHIC ENTRANCE GATES
          ═══════════════════════════════════════════════════════════ */}
      <div
        className={`absolute inset-0 z-40 pointer-events-none transition-opacity duration-1000 ${
          isIntro ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Left Shutter */}
        <div
          className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#09090b] border-r-4 border-[#ffd700] transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] flex flex-col justify-between p-12 select-none"
          style={{ transform: doorsOpen ? 'translateX(-100%)' : 'translateX(0%)' }}
        >
          <div className="font-mono text-xs text-[#ffd700] font-bold tracking-[0.25em] uppercase">
            MUSEO // SEC-01 · MONUMENTAL ROTUNDA
          </div>
          <div className="text-right">
            <span className="text-[120px] font-black text-neutral-900 font-outfit leading-none select-none">
              MU
            </span>
          </div>
          <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            AUTHENTIC SPECIMEN ARCHIVE
          </div>
        </div>

        {/* Right Shutter */}
        <div
          className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#09090b] border-l-4 border-[#ffd700] transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] flex flex-col justify-between p-12 select-none"
          style={{ transform: doorsOpen ? 'translateX(100%)' : 'translateX(0%)' }}
        >
          <div className="text-right font-mono text-xs text-[#ffd700] font-bold tracking-[0.25em] uppercase">
            GRAND EXHIBITION HALL
          </div>
          <div>
            <span className="text-[120px] font-black text-neutral-900 font-outfit leading-none select-none">
              SEO
            </span>
          </div>
          <div className="text-right font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            76M × 168M CLASSICAL GALLERIES
          </div>
        </div>

        {/* Center Intro Seal */}
        {isIntro && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto">
            <div
              className={`flex flex-col items-center gap-4 transition-all duration-700 ${
                doorsOpen ? 'opacity-0 scale-125' : 'opacity-100 scale-100'
              }`}
            >
              <div className="w-16 h-16 bg-[#ffd700] border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_#000] rotate-45">
                <span className="text-2xl font-black text-black -rotate-45 font-mono">✦</span>
              </div>
              <div className="text-center font-mono">
                <h1 className="text-3xl sm:text-4xl font-black text-white font-outfit uppercase tracking-tighter shadow-black">
                  THE GRAND MUSEUM HALL
                </h1>
                <p className="text-xs text-[#ffd700] tracking-[0.25em] uppercase font-bold mt-1">
                  ENTER THE VAST 4.5 BILLION YEAR REPOSITORY
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsIntro(false)}
              className="absolute bottom-10 px-5 py-2.5 bg-black/90 hover:bg-[#ffd700] hover:text-black text-white border-2 border-neutral-700 font-mono text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0px_#000] transition-colors cursor-pointer"
            >
              Skip Intro [Space] ➔
            </button>
          </div>
        )}
      </div>

      {/* ─── HUD: MINIMAL MUSEUM GALLERY GUIDE TOP BAR ─── */}
      <div className="absolute top-20 sm:top-22 left-4 sm:left-6 right-4 sm:right-6 z-20 flex items-start justify-between pointer-events-none gap-4">
        {/* Left: Gallery Guide */}
        <div className="bg-black/90 text-white border border-neutral-800 rounded-2xl p-3 sm:p-4 shadow-xl font-mono text-xs max-w-sm pointer-events-auto backdrop-blur-md transition-all">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
              <span className="font-bold text-[#ffd700] uppercase tracking-wider text-xs font-outfit">
                MUSEO // GRAND HALL
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setGuideCollapsed((prev) => !prev)}
                className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-[#ffd700] hover:text-black border border-neutral-700 font-bold text-[10px] cursor-pointer transition-colors"
                title={guideCollapsed ? 'Expand Gallery Guide' : 'Collapse Gallery Guide'}
              >
                {guideCollapsed ? '▼ Guide' : '▲'}
              </button>
              <button
                onClick={() => setIsControlsModalOpen(true)}
                className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-[#ffd700] hover:text-black border border-neutral-700 font-bold text-[10px] cursor-pointer transition-colors"
                title="Help & Controls Guide [H]"
              >
                Help [?]
              </button>
              <button
                onClick={togglePointerLock}
                className={`px-2 py-0.5 rounded border font-bold text-[10px] cursor-pointer transition-colors ${
                  isPointerLocked
                    ? 'bg-emerald-400 text-black border-emerald-300'
                    : 'bg-neutral-800 hover:bg-[#ffd700] hover:text-black text-neutral-300 border-neutral-700'
                }`}
                title="FPS Mouse Look Mode [P]"
              >
                {isPointerLocked ? '🎯' : 'FPS'}
              </button>
              <button
                onClick={handleReplayIntro}
                className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-[#ffd700] hover:text-black border border-neutral-700 font-bold text-[10px] cursor-pointer transition-colors hidden sm:inline-block"
                title="Replay Entrance Fly-Through"
              >
                Intro ↺
              </button>
              <button
                onClick={() => {
                  playClick();
                  setIsNight(!isNight);
                }}
                className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-[#ffd700] hover:text-black border border-neutral-700 font-bold text-[10px] cursor-pointer transition-colors"
                title="Toggle Atmosphere"
              >
                {isNight ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => {
                  playClick();
                  setFlashlightOn(!flashlightOn);
                }}
                className={`px-2 py-0.5 rounded border font-bold text-[10px] cursor-pointer transition-colors ${
                  flashlightOn
                    ? 'bg-amber-400 text-black border-amber-300'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
                title="Toggle Torch [F]"
              >
                🔦
              </button>
            </div>
          </div>

          {!guideCollapsed && (
            <>
              <p className="text-neutral-400 text-[11px] leading-relaxed mb-2.5 font-sans">
                Drag to look around. Click marble floor to glide. Move with <kbd className="text-white bg-neutral-800 px-1 rounded border border-neutral-700">WASD</kbd>, sprint with <kbd className="text-white bg-neutral-800 px-1 rounded border border-neutral-700">Shift</kbd>. Inspect with <kbd className="text-[#ffd700] bg-neutral-800 px-1 rounded border border-neutral-700">E</kbd>.
              </p>

              {/* Direct Wing Navigation */}
              <div className="pt-2 border-t border-neutral-800">
                <span className="block text-[9px] text-neutral-500 font-bold uppercase mb-1.5 font-mono">
                  Direct Wing Navigation [1-4]:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  {[
                    { label: '🏛️ Paleontology', pos: [0, 2.05, -50] as [number, number, number], lookAt: [0, 2.7, -66] as [number, number, number] },
                    { label: '📜 Antiquities', pos: [-20, 2.05, 0] as [number, number, number], lookAt: [-25.0, 2.3, -4] as [number, number, number] },
                    { label: '🌊 Deep Time', pos: [20, 2.05, 0] as [number, number, number], lookAt: [25.0, 2.1, -32] as [number, number, number] },
                    { label: '🦣 Megafauna', pos: [0, 2.05, 22] as [number, number, number], lookAt: [-9.5, 2.25, 12] as [number, number, number] },
                  ].map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleGlideTo(w.pos, w.lookAt)}
                      className="p-1.5 rounded bg-neutral-900/90 hover:bg-[#ffd700] hover:text-black border border-neutral-800 font-bold truncate text-left transition-colors cursor-pointer"
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Archival Stamp Progress */}
        <div className="bg-black/90 text-white border border-neutral-800 rounded-2xl p-3 shadow-xl font-mono text-xs pointer-events-auto backdrop-blur-md hidden sm:flex flex-col gap-1.5 min-w-[210px]">
          <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase">
            <span>Archival Log</span>
            <span className="text-[#ffd700]">
              {discoveredIds.length} / {HALL_SPECIMENS.length}
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 overflow-hidden rounded-full">
            <div
              className="h-full bg-[#ffd700] transition-all duration-300"
              style={{ width: `${(discoveredIds.length / HALL_SPECIMENS.length) * 100}%` }}
            />
          </div>
          <div className="text-[9px] text-neutral-500 uppercase tracking-widest text-center mt-0.5">
            {discoveredIds.length === HALL_SPECIMENS.length
              ? '✦ Full Exhibition Logged'
              : 'Walk near exhibits to log stamps'}
          </div>
        </div>
      </div>

      {/* ─── HUD: DISCOVERY NOTIFICATION POPUP ─── */}
      {recentDiscovery && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="bg-[#ffd700] text-black border border-black px-4 py-2 rounded-full shadow-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <span>✨ Exhibition Stamp Unlocked:</span>
            <span className="font-bold underline">{recentDiscovery}</span>
          </div>
        </div>
      )}

      {/* ─── HUD: ON-SCREEN MOBILE & TOUCH CONTROLS (BOTTOM-LEFT) ─── */}
      <div className="absolute bottom-4 sm:bottom-5 left-3 sm:left-5 z-20 flex flex-col gap-2 pointer-events-auto sm:opacity-90 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sprint Toggle */}
          <button
            onPointerDown={() => setVirtualMove((prev) => ({ ...prev, sprint: !prev.sprint }))}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-xs border backdrop-blur-md transition-all shadow-lg cursor-pointer ${
              virtualMove.sprint
                ? 'bg-amber-400 text-black border-amber-300 scale-105'
                : 'bg-black/80 text-white border-neutral-700 hover:bg-neutral-800'
            }`}
            title="Toggle Sprint Run"
          >
            🏃⚡
          </button>
          {/* Torch Toggle */}
          <button
            onClick={() => setFlashlightOn(!flashlightOn)}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-xs border backdrop-blur-md transition-all shadow-lg cursor-pointer ${
              flashlightOn
                ? 'bg-amber-400 text-black border-amber-300'
                : 'bg-black/80 text-white border-neutral-700 hover:bg-neutral-800'
            }`}
            title="Toggle Flashlight [F]"
          >
            🔦
          </button>
          {/* D-Pad Toggle */}
          <button
            onClick={() => setShowDpad((prev) => !prev)}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-xs border backdrop-blur-md transition-all shadow-lg cursor-pointer ${
              showDpad
                ? 'bg-neutral-800 text-amber-300 border-neutral-700'
                : 'bg-black/80 text-white border-neutral-700 hover:bg-neutral-800'
            }`}
            title={showDpad ? 'Hide Virtual D-Pad' : 'Show Virtual D-Pad'}
          >
            🎮
          </button>
        </div>

        {/* Virtual D-Pad (collapsible to avoid screen overlap) */}
        {showDpad && (
          <div className="grid grid-cols-3 gap-1.5 w-36 bg-black/75 p-2 rounded-2xl border border-neutral-800 backdrop-blur-md shadow-2xl animate-in fade-in duration-200">
            <div />
            <button
              onPointerDown={() => setVirtualMove((prev) => ({ ...prev, forward: true }))}
              onPointerUp={() => setVirtualMove((prev) => ({ ...prev, forward: false }))}
              onPointerLeave={() => setVirtualMove((prev) => ({ ...prev, forward: false }))}
              className="w-10 h-10 rounded-lg bg-neutral-800 active:bg-[#ffd700] active:text-black text-white font-bold flex items-center justify-center border border-neutral-700 select-none text-base cursor-pointer"
            >
              ▲
            </button>
            <div />
            <button
              onPointerDown={() => setVirtualMove((prev) => ({ ...prev, left: true }))}
              onPointerUp={() => setVirtualMove((prev) => ({ ...prev, left: false }))}
              onPointerLeave={() => setVirtualMove((prev) => ({ ...prev, left: false }))}
              className="w-10 h-10 rounded-lg bg-neutral-800 active:bg-[#ffd700] active:text-black text-white font-bold flex items-center justify-center border border-neutral-700 select-none text-base cursor-pointer"
            >
              ◄
            </button>
            <button
              onPointerDown={() => setVirtualMove((prev) => ({ ...prev, backward: true }))}
              onPointerUp={() => setVirtualMove((prev) => ({ ...prev, backward: false }))}
              onPointerLeave={() => setVirtualMove((prev) => ({ ...prev, backward: false }))}
              className="w-10 h-10 rounded-lg bg-neutral-800 active:bg-[#ffd700] active:text-black text-white font-bold flex items-center justify-center border border-neutral-700 select-none text-base cursor-pointer"
            >
              ▼
            </button>
            <button
              onPointerDown={() => setVirtualMove((prev) => ({ ...prev, right: true }))}
              onPointerUp={() => setVirtualMove((prev) => ({ ...prev, right: false }))}
              onPointerLeave={() => setVirtualMove((prev) => ({ ...prev, right: false }))}
              className="w-10 h-10 rounded-lg bg-neutral-800 active:bg-[#ffd700] active:text-black text-white font-bold flex items-center justify-center border border-neutral-700 select-none text-base cursor-pointer"
            >
              ►
            </button>
          </div>
        )}
      </div>

      {/* ─── HUD: SLEEK PROXIMITY CARD & MINIMIZED PILL (NON-OVERLAPPING DOCKED POSITIONING) ─── */}
      {activeEntity && activeConfig && dismissedCardId !== activeEntity.id && (
        isCardMinimized ? (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-in fade-in duration-200">
            <button
              onClick={() => {
                playClick();
                setIsCardMinimized(false);
              }}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/92 hover:bg-black text-white border border-[#ffd700]/70 shadow-[0_4px_24px_rgba(0,0,0,0.85)] backdrop-blur-xl font-mono text-xs transition-all cursor-pointer group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="font-bold text-[#ffd700] uppercase tracking-wider">{activeEntity.name}</span>
              <span className="text-neutral-400 text-[11px] hidden sm:inline">· Press E to Inspect</span>
              <span className="px-2 py-0.5 rounded bg-[#ffd700]/20 text-[#ffd700] text-[10px] font-bold group-hover:bg-[#ffd700] group-hover:text-black transition-colors">
                Details ▲
              </span>
            </button>
          </div>
        ) : (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-1.5rem)] max-w-2xl px-2 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="bg-[#0b0c10]/95 text-white border border-[#caa04d]/40 rounded-2xl p-2.5 sm:p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.85)] flex flex-col gap-1.5 font-mono backdrop-blur-2xl ring-1 ring-white/10">
              {/* Row 1: Badges + Title + Window Controls */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded bg-[#ffd700] text-black text-[9px] font-black uppercase tracking-wider shrink-0">
                    {activeConfig.catalogNum}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[9px] font-bold uppercase shrink-0 hidden xs:inline">
                    {activeConfig.era}
                  </span>
                  <h3 className="text-sm sm:text-base font-black font-outfit uppercase text-white truncate tracking-tight">
                    {activeEntity.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase hidden sm:flex items-center gap-1 mr-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    In Range [E]
                  </span>
                  <button
                    onClick={() => {
                      playClick();
                      setIsCardMinimized(true);
                    }}
                    className="w-6 h-6 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                    title="Minimize HUD Bar"
                  >
                    _
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      setDismissedCardId(activeEntity.id);
                    }}
                    className="w-6 h-6 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                    title="Dismiss Card (Press E to inspect anytime)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Row 2: Subtitle / Provenance + Interactive Actions */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800/80">
                <p className="text-[10px] sm:text-[11px] text-[#caa04d] font-mono truncate flex-1 min-w-0 mr-2">
                  {activeConfig.dating} · {activeConfig.location}
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      playClick();
                      setShowDossierDrawer(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-[#ffd700] hover:text-black text-neutral-300 font-bold text-xs uppercase border border-neutral-700 transition-all cursor-pointer flex items-center gap-1"
                    title="Open Complete Specimen Details & Archival Story"
                  >
                    <span>📋</span>
                    <span>Dossier</span>
                  </button>
                  <button
                    onClick={handleCuratorSpeak}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase border border-neutral-700 transition-colors cursor-pointer flex items-center gap-1 ${
                      isNarrating
                        ? 'bg-amber-400 text-black animate-pulse'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                    }`}
                    title="Curator Audio Guide"
                  >
                    <span>{isNarrating ? '⏹' : '🔊'}</span>
                    <span className="hidden xs:inline">{isNarrating ? 'Stop' : 'Audio'}</span>
                  </button>
                  <button
                    onClick={() => {
                      playChime();
                      openEntityModal(activeEntity.id);
                    }}
                    className="px-3.5 py-1 rounded-lg bg-[#ffd700] hover:bg-white text-black font-black text-xs uppercase border border-[#ffd700] transition-colors cursor-pointer font-outfit flex items-center gap-1 shadow-md"
                  >
                    <span>Inspect 3D</span>
                    <kbd className="hidden sm:inline bg-black/15 px-1 rounded text-[9px]">[E]</kbd>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* ─── FULL CURATORIAL DOSSIER SLIDE-OVER DRAWER (COMPLETE INFO & DETAILS) ─── */}
      {showDossierDrawer && activeEntity && activeConfig && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowDossierDrawer(false)}
            className="fixed inset-0 z-[99980] bg-black/50 backdrop-blur-sm transition-opacity duration-200"
          />

          {/* Slide-out Drawer */}
          <div className="fixed top-0 right-0 bottom-0 z-[99990] w-full max-w-xl bg-[#0c0e12]/98 border-l border-neutral-700/80 shadow-2xl backdrop-blur-2xl flex flex-col font-mono text-white animate-in slide-in-from-right duration-250">
            {/* Top Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-black/60 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#ffd700] text-black text-[10px] font-bold uppercase tracking-wider">
                  {activeConfig.catalogNum}
                </span>
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-bold uppercase">
                  {activeConfig.era}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Verified Scientific Record
                </span>
              </div>
              <button
                onClick={() => {
                  playClick();
                  setShowDossierDrawer(false);
                }}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
                title="Close Dossier (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Dossier Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-neutral-200">
              {/* Specimen Title & Origin */}
              <div>
                <span className="text-[11px] text-yellow-400 uppercase tracking-widest font-bold">
                  {activeEntity.periodLabel} · {activeEntity.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit uppercase text-white tracking-tight mt-1 mb-2">
                  {activeEntity.name}
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
                  <span>⏳ {activeConfig.dating}</span>
                  <span>•</span>
                  <span>📍 {activeConfig.location}</span>
                  <span>•</span>
                  <span>🏛️ {activeEntity.currentLocation}</span>
                </div>
              </div>

              {/* Hook */}
              {activeEntity.hook && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border-l-4 border-[#ffd700] text-sm text-yellow-100 italic font-sans leading-relaxed">
                  &ldquo;{activeEntity.hook}&rdquo;
                </div>
              )}

              {/* Complete Archival Story & Discovery */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-[#ffd700] font-bold mb-2 pb-1 border-b border-neutral-800 flex items-center gap-1.5">
                  <span>📜</span>
                  <span>Archival Story & Discovery</span>
                </h3>
                <p className="text-sm font-sans text-neutral-300 leading-relaxed font-normal">
                  {activeEntity.story || activeEntity.significance}
                </p>
              </div>

              {/* Verified Scientific Key Facts */}
              {activeEntity.facts && activeEntity.facts.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-[#ffd700] font-bold mb-2 pb-1 border-b border-neutral-800 flex items-center gap-1.5">
                    <span>✦</span>
                    <span>Verified Scientific Facts</span>
                  </h3>
                  <ul className="space-y-2">
                    {activeEntity.facts.map((fact: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300 font-sans">
                        <span className="text-[#ffd700] font-bold shrink-0 mt-0.5">✦</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Curatorial Physical Metrics & Specifications */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-[#ffd700] font-bold mb-2 pb-1 border-b border-neutral-800 flex items-center gap-1.5">
                  <span>📐</span>
                  <span>Curatorial Physical Specifications</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold">Dimensions</span>
                    <span className="text-white font-bold">{activeEntity.dimensions || 'Archival 1:1 Metric Standard'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold">Material Matrix</span>
                    <span className="text-white font-bold">{activeEntity.material || 'Permineralized Natural Matrix'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold">Taxon / Classification</span>
                    <span className="text-white font-bold">{('species' in activeEntity && (activeEntity as any).species) || activeEntity.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold">Condition & Authenticity</span>
                    <span className="text-emerald-400 font-bold">{activeEntity.condition || 'Excellent'} · {activeEntity.authenticity || 'Authentic'}</span>
                  </div>
                </div>
              </div>

              {/* Significance */}
              {activeEntity.whyItMatters && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-[#ffd700] font-bold mb-2 pb-1 border-b border-neutral-800 flex items-center gap-1.5">
                    <span>🔬</span>
                    <span>Why It Matters</span>
                  </h3>
                  <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                    {activeEntity.whyItMatters}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="p-4 border-t border-neutral-800 bg-black/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <button
                onClick={handleCuratorSpeak}
                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isNarrating
                    ? 'bg-amber-400 text-black animate-pulse'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                }`}
              >
                <span>{isNarrating ? '⏹' : '🔊'}</span>
                <span>{isNarrating ? 'Stop Audio' : 'Audio Guide'}</span>
              </button>
              <button
                onClick={() => {
                  playChime();
                  openEntityModal(activeEntity.id);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#ffd700] hover:bg-white text-black font-bold text-xs uppercase border border-[#ffd700] transition-colors cursor-pointer flex items-center gap-1 shadow-md"
              >
                <span>Inspect 3D</span>
                <kbd className="bg-black/15 px-1 rounded text-[9px]">[E]</kbd>
              </button>
              <button
                onClick={() => {
                  playStamp();
                  toggleStamp(activeEntity.id);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer border flex items-center gap-1 ${
                  stamps.includes(activeEntity.id)
                    ? 'bg-[#ffd700] text-black border-[#ffd700]'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700 hover:text-white'
                }`}
              >
                <span>{stamps.includes(activeEntity.id) ? '✓ In Passport' : '✦ Stamp Passport'}</span>
              </button>
              <button
                onClick={() => {
                  playClick();
                  setIsCertModalOpen(true);
                }}
                className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs uppercase border border-neutral-700 transition-colors cursor-pointer"
                title="Mint Official Specimen Certificate"
              >
                📜 Mint Cert
              </button>
              <Link
                href={`/museum/${activeEntity.id}`}
                onClick={() => playClick()}
                className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-[#ffd700] font-bold text-xs uppercase border border-neutral-700 transition-colors"
              >
                Dossier ↗
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ─── OFFICIAL ARCHIVAL CERTIFICATE MODAL ─── */}
      {isCertModalOpen && activeEntity && (
        <ArchivalCertificateModal
          entity={activeEntity}
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
        />
      )}

      {/* ─── HUD: MINIMALIST RADAR MAP WITH DIRECTIONAL HEADING (BOTTOM RIGHT) ─── */}
      <div className="absolute bottom-4 sm:bottom-5 right-3 sm:right-5 z-20 pointer-events-auto">
        <MuseumRadar
          visitorPosRef={visitorPosRef}
          visitorYawRef={visitorYawRef}
          discoveredIds={discoveredIds}
          onGlideTo={handleGlideTo}
        />
      </div>

      {/* ─── CONTROLS GUIDE MODAL (H / [?]) ─── */}
      {isControlsModalOpen && (
        <div className="fixed inset-0 z-[99992] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0e1015] border border-neutral-700 rounded-3xl max-w-lg w-full p-6 text-white font-mono shadow-2xl relative">
            <button
              onClick={() => setIsControlsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#ffd700] hover:text-black flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffd700]" />
              <h2 className="text-xl font-bold font-outfit uppercase tracking-tight text-[#ffd700]">
                Grand Museum Hall Controls
              </h2>
            </div>

            <div className="space-y-3 text-xs text-neutral-300 font-sans">
              <div className="flex justify-between py-1.5 border-b border-neutral-800 font-mono">
                <span className="text-neutral-400">Walk / Navigate</span>
                <span className="text-white font-bold">W, A, S, D or Arrow Keys</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800 font-mono">
                <span className="text-neutral-400">Sprint (Fast Walk)</span>
                <span className="text-white font-bold">Shift (Hold) or 🏃 On-screen</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800 font-mono">
                <span className="text-neutral-400">Camera Rotation</span>
                <span className="text-white font-bold">Click & Drag (Mouse/Touch)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800 font-mono">
                <span className="text-neutral-400">FPS Mouse Look Mode</span>
                <span className="text-white font-bold">Press P or click 🎯 FPS</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800 font-mono">
                <span className="text-neutral-400">Click-to-Glide</span>
                <span className="text-white font-bold">Click marble floor / radar blip</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800 font-mono">
                <span className="text-neutral-400">Inspect Specimen</span>
                <span className="text-[#ffd700] font-bold">Press E or click exhibit</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800 font-mono">
                <span className="text-neutral-400">Curator Flashlight</span>
                <span className="text-white font-bold">Press F or click 🔦</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800 font-mono">
                <span className="text-neutral-400">Direct Wing Teleport</span>
                <span className="text-white font-bold">Keys 1, 2, 3, 4</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsControlsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#ffd700] hover:bg-white text-black font-bold text-xs uppercase transition-colors cursor-pointer font-outfit"
              >
                Close [Esc]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
