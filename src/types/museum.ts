// Museverse — Discriminated Union Entity Types (v2 Awwwards-Level)
// Matches design.md v2: shared base + cultural/fossil split + verified facts, hook, story, source, license

import { EvolutionStageId } from '@/lib/time';
export type { EvolutionStageId } from '@/lib/time';

// ─── Category & Condition Enums ───

export type EntityCategory =
  | 'Fossil'
  | 'Artifact'
  | 'Antiquity'
  | 'Relic'
  | 'Coin'
  | 'Statue';

export type GalleryTab = 'All Items' | 'Fossils & Paleontology' | 'Ancient Artifacts' | 'Relics & Antiquities';

export type Condition = 'Excellent' | 'Good' | 'Fair' | 'Fragmentary';
export type Authenticity = 'Authentic' | 'Replica';

// ─── Base Entity (shared by all museum items) ───

export interface BaseEntity {
  id: string;
  name: string;
  category: EntityCategory;
  periodLabel: string;
  yearsAgo: number; // years before present — shared timeline axis
  currentLocation: string;
  significance: string;
  images: string[];
  references: string[];
  modelUrl?: string; // path to .glb asset (optional for items with procedural 3D fallbacks)
  material?: string;
  dimensions?: string;
  condition?: Condition;
  authenticity?: Authenticity;
  provenance?: string;

  // New v2 Award-Level fields
  hook?: string;                  // one-line teaser
  story?: string;                 // 80–120 words verified narrative
  facts?: string[];               // 3–5 verified facts
  whyItMatters?: string;
  stageIds?: EvolutionStageId[];
  ageMa?: number;                 // Age in millions of years
  model?: string;                 // convenient alias for modelUrl
  image?: string;                 // convenient alias for images[0]
  source?: string;                // required verification source
  license?: string;               // asset license (e.g. CC0, Smithsonian Open Access)
}

// ─── Cultural Artifact (type: "cultural" | "artifact") ───

export interface CulturalArtifact extends BaseEntity {
  type: 'cultural' | 'artifact';
  creator?: string;
  origin?: string;
  commissionedBy?: string;
  originalOwner?: string;
  discoverer?: string;
  discoveryDate?: string;
  placeOfDiscovery?: string;
}

// ─── Fossil Specimen (type: "fossil") ───

export interface FossilSpecimen extends BaseEntity {
  type: 'fossil';
  ageMa?: number;                 // Age in millions of years
  species: string;
  geologicalPeriod: string;
  excavatedBy?: string;
  discoveryDate?: string;
  placeOfDiscovery?: string;
}

// ─── Discriminated Union ───

export type CatalogEntity = CulturalArtifact | FossilSpecimen;
export type MuseumEntity = CatalogEntity;

// ─── Type Guards ───

export function isFossil(entity: MuseumEntity): entity is FossilSpecimen {
  return entity.type === 'fossil';
}

export function isCulturalArtifact(entity: MuseumEntity): entity is CulturalArtifact {
  return entity.type === 'cultural' || entity.type === 'artifact';
}

export function isArtifact(entity: MuseumEntity): entity is CulturalArtifact {
  return entity.type === 'cultural' || entity.type === 'artifact';
}

// ─── Gallery Tab Mapping ───

const CATEGORY_TAB_MAP: Record<EntityCategory, GalleryTab> = {
  Fossil: 'Fossils & Paleontology',
  Artifact: 'Ancient Artifacts',
  Antiquity: 'Ancient Artifacts',
  Relic: 'Relics & Antiquities',
  Coin: 'Relics & Antiquities',
  Statue: 'Relics & Antiquities',
};

export function getGalleryTab(category: EntityCategory): GalleryTab {
  return CATEGORY_TAB_MAP[category];
}

export function matchesCategoryTab(entity: MuseumEntity, tab: GalleryTab): boolean {
  return tab === 'All Items' || getGalleryTab(entity.category) === tab;
}

// ─── Evolution Stage & Hotspot ───

export interface EvolutionHotspot {
  id: string;
  label: string;
  linkedEntityId?: string; // FK to MuseumEntity.id
  description?: string;
}

export interface EvolutionStage {
  id: string;
  stageNumber: number; // 1–5
  title: string;
  timeAnchorLabel: string;
  yearsAgoStart: number;
  yearsAgoEnd: number;
  visualDescription: string;
  keyContent: string;
  hotspots: EvolutionHotspot[];
}
