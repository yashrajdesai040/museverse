// MUSEO — Deep Time Non-Linear Chrono Engine
// Maps continuous scrub position [0.0, 1.0] to geological age in Millions of Years Ago (Ma)
// Non-linear pacing gives weight to vast Precambrian stretches, while keeping dense recent eras interactive.

export type EvolutionStageId =
  | '01-hadean-archean'
  | '01-hadean'
  | '02-archean'
  | '02-proterozoic'
  | '03-proterozoic'
  | '03-paleozoic'
  | '04-paleozoic'
  | '04-mesozoic'
  | '05-mesozoic'
  | '05-cenozoic'
  | '06-cenozoic';

export interface StageDefinition {
  id: EvolutionStageId;
  stageNumber: string;
  name: string;
  rangeMa: [number, number]; // [startMa, endMa]
  sliderRange: [number, number]; // [startSlider, endSlider]
  tint: string; // 3D scene lighting tint
  mood: string;
  ambientSound: string;
  summary: string;
  signatureEvent: string;
}

export interface ExtinctionEvent {
  id: string;
  name: string;
  ma: number;
  sliderPos: number;
  description: string;
  isAsteroidImpact?: boolean;
}

// ─── 6 Major Geological Stages ──────────────────────────────────────────────
export const STAGES: StageDefinition[] = [
  {
    id: '01-hadean',
    stageNumber: '01',
    name: 'Hadean',
    rangeMa: [4600, 4000],
    sliderRange: [0.0, 0.166],
    tint: '#B3261E', // molten red
    mood: 'Violent, incandescent',
    ambientSound: 'hadean',
    summary: 'Planetary accretion, magma oceans, and lunar genesis via the cataclysmic Theia protoplanet collision.',
    signatureEvent: 'Theia Protoplanet Impact & Lunar Genesis (4,510 Ma)',
  },
  {
    id: '02-archean',
    stageNumber: '02',
    name: 'Archean',
    rangeMa: [4000, 2500],
    sliderRange: [0.166, 0.333],
    tint: '#1F6F8B', // iron sea teal
    mood: 'Primordial, hydrothermal',
    ambientSound: 'archean',
    summary: 'Cooling crust, acidic iron-rich oceans, hydrothermal vents, and the emergence of earliest cellular life.',
    signatureEvent: 'Origin of Cellular Life & Stromatolites (3,800 Ma)',
  },
  {
    id: '03-proterozoic',
    stageNumber: '03',
    name: 'Proterozoic',
    rangeMa: [2500, 541],
    sliderRange: [0.333, 0.500],
    tint: '#4C7A87', // glacial azure
    mood: 'Cryogenic, oxidizing',
    ambientSound: 'archean',
    summary: 'The Great Oxidation Event transforms the atmosphere; Snowball Earth glaciations yield complex multicellular organisms.',
    signatureEvent: 'The Great Oxidation Event & Snowball Earth (2,400 Ma)',
  },
  {
    id: '04-paleozoic',
    stageNumber: '04',
    name: 'Paleozoic',
    rangeMa: [541, 252],
    sliderRange: [0.500, 0.667],
    tint: '#4C9A5B', // moss green
    mood: 'Teeming shallow seas, first land colonization',
    ambientSound: 'classical',
    summary: 'Cambrian Explosion fills the seas with armored arthropods; plants and amphibians colonize land; ends in the Permian Great Dying.',
    signatureEvent: 'The Cambrian Explosion & Great Permian Extinction (252 Ma)',
  },
  {
    id: '05-mesozoic',
    stageNumber: '05',
    name: 'Mesozoic',
    rangeMa: [252, 66],
    sliderRange: [0.667, 0.833],
    tint: '#E0701A', // amber ochre
    mood: 'Warm greenhouse, dinosaurs, doom ahead',
    ambientSound: 'mesozoic',
    summary: 'Age of Dinosaurs; Pangaea rifting; ended catastrophically by the 10-km Chicxulub bolide impact.',
    signatureEvent: 'Chicxulub Asteroid Impact & K-Pg Extinction (66 Ma)',
  },
  {
    id: '06-cenozoic',
    stageNumber: '06',
    name: 'Cenozoic',
    rangeMa: [66, 0],
    sliderRange: [0.833, 1.0],
    tint: '#4F86F7', // sapphire sky
    mood: 'Mammalian radiation, ice ages, modern humanity',
    ambientSound: 'interstellar',
    summary: 'Radiation of mammals and birds, Pleistocene ice age glaciations, and the rise of human global civilization.',
    signatureEvent: 'Pleistocene Glaciations & Anthropocene (0.01 Ma)',
  },
];

// ─── Key Planetary Extinction & Milestone Glyphs ──────────────────────────────
export const EXTINCTION_EVENTS: ExtinctionEvent[] = [
  {
    id: 'goe',
    name: 'Great Oxidation Event',
    ma: 2400,
    sliderPos: 0.263,
    description: 'Cyanobacteria produce massive O2, causing iron precipitation and global glaciations.',
  },
  {
    id: 'end-permian',
    name: 'End-Permian Extinction ("The Great Dying")',
    ma: 252,
    sliderPos: 0.72,
    description: 'Siberian Traps volcanic eruption triggers release of CO2, killing >90% of marine species.',
  },
  {
    id: 'chicxulub-impact',
    name: 'Chicxulub Asteroid Impact',
    ma: 66,
    sliderPos: 0.88,
    description: 'A 10-kilometer asteroid slams into Yucatán, ending non-avian dinosaurs and reshaping life.',
    isAsteroidImpact: true,
  },
];

// ─── Non-Linear Bidirectional Mapping Functions ──────────────────────────────

/**
 * Maps a continuous slider position [0.0, 1.0] to millions of years ago (Ma) [4600, 0]
 */
export function sliderToMa(sliderVal: number): number {
  const clamped = Math.max(0, Math.min(1, sliderVal));

  for (const stage of STAGES) {
    const [sStart, sEnd] = stage.sliderRange;
    if (clamped >= sStart && clamped <= sEnd) {
      const localT = (clamped - sStart) / (sEnd - sStart);
      const [maStart, maEnd] = stage.rangeMa;
      return Math.round(maStart - localT * (maStart - maEnd));
    }
  }

  return clamped <= 0 ? 4600 : 0;
}

/**
 * Maps millions of years ago (Ma) [4600, 0] back to slider position [0.0, 1.0]
 */
export function maToSlider(maVal: number): number {
  const clampedMa = Math.max(0, Math.min(4600, maVal));

  for (const stage of STAGES) {
    const [maStart, maEnd] = stage.rangeMa;
    if (clampedMa <= maStart && clampedMa >= maEnd) {
      const localT = (maStart - clampedMa) / (maStart - maEnd);
      const [sStart, sEnd] = stage.sliderRange;
      return sStart + localT * (sEnd - sStart);
    }
  }

  return clampedMa >= 4600 ? 0.0 : 1.0;
}

/**
 * Returns the active geological stage definition for a given Ma
 */
export function getStageForMa(ma: number): StageDefinition {
  const clamped = Math.max(0, Math.min(4600, ma));
  for (const stage of STAGES) {
    if (clamped <= stage.rangeMa[0] && clamped >= stage.rangeMa[1]) {
      return stage;
    }
  }
  return STAGES[STAGES.length - 1];
}

/**
 * Human-readable geological time formatting
 */
export function formatMa(ma: number): string {
  if (ma >= 1000) {
    const ga = (ma / 1000).toFixed(2).replace(/\.00$/, '');
    return `${ga} Ga (${ma.toLocaleString()} Ma)`;
  }
  if (ma === 0) {
    return '0 Ma (Present Day)';
  }
  if (ma < 1) {
    const ka = Math.round(ma * 1000);
    return `${ka.toLocaleString()} Ka (${ma} Ma)`;
  }
  return `${ma.toLocaleString()} Ma`;
}

/**
 * Magnetic snap helper: checks if slider is near an extinction event threshold
 */
export function getNearbyExtinctionEvent(sliderVal: number, threshold = 0.015): ExtinctionEvent | null {
  for (const event of EXTINCTION_EVENTS) {
    if (Math.abs(sliderVal - event.sliderPos) <= threshold) {
      return event;
    }
  }
  return null;
}
