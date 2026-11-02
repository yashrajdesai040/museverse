'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import ThreeUI WebGL/Three.js components with ssr: false from isolated subpaths
export const ThreeUIGallery = dynamic(
  () => import('@designcodeio/threeui/components/Gallery').then((mod) => mod.Gallery),
  { ssr: false, loading: () => <div className="w-full h-80 bg-[#161616] animate-pulse" /> }
);

export const ThreeUIConstellationField = dynamic(
  () => import('@designcodeio/threeui/components/ConstellationField').then((mod) => mod.ConstellationField),
  { ssr: false }
);

export const ThreeUIParticleDrift = dynamic(
  () => import('@designcodeio/threeui/components/ParticleDrift').then((mod) => mod.ParticleDrift),
  { ssr: false }
);

export const ThreeUIParticleNetwork = dynamic(
  () => import('@designcodeio/threeui/components/ParticleNetwork').then((mod) => mod.ParticleNetwork),
  { ssr: false }
);

export const ThreeUITopoField = dynamic(
  () => import('@designcodeio/threeui/components/TopoField').then((mod) => mod.TopoField),
  { ssr: false }
);

export const ThreeUIDimensionalField = dynamic(
  () => import('@designcodeio/threeui/components/DimensionalField').then((mod) => mod.DimensionalField),
  { ssr: false }
);

export const ThreeUIFlowField = dynamic(
  () => import('@designcodeio/threeui/components/FlowField').then((mod) => mod.FlowField),
  { ssr: false }
);

export const ThreeUISkeuomorphicToggle = dynamic(
  () => import('@designcodeio/threeui/components/SkeuomorphicToggle').then((mod) => mod.SkeuomorphicToggle),
  { ssr: false }
);

export const ThreeUICrtBackground = dynamic(
  () => import('@designcodeio/threeui/components/CrtBackground').then((mod) => mod.CrtBackground),
  { ssr: false }
);

export const ThreeUISparkBadge = dynamic(
  () => import('@designcodeio/threeui/components/SparkBadge').then((mod) => mod.SparkBadge),
  { ssr: false }
);

export const ThreeUILiquidMetalButton = dynamic(
  () => import('@designcodeio/threeui/components/LiquidMetalButton').then((mod) => mod.LiquidMetalButton),
  { ssr: false }
);
