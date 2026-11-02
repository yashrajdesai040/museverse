import { create } from 'zustand';

export type VisualizationMode = 'natural' | 'thermal' | 'tectonic' | 'biosphere';
export type CameraPreset = 'default' | 'pole' | 'equator' | 'night';

export interface GeologicalHotspot {
  id: string;
  name: string;
  lat: number;
  lon: number;
  tagline: string;
  details: string;
  significance: string;
  specimenId?: string;
  specimenName?: string;
}

export interface PlanetaryTelemetry {
  yearLabel: string;
  epochIndex: number; // 0 to 5
  epochTitle: string;
  tagline: string;
  description: string;
  surfaceTemp: string;
  o2Percent: string;
  co2Ppm: string;
  continents: string;
  lifeMilestone: string;
  dominantColor: string;
  atmosphereHue: string;
  linkedSpecimens: { id: string; name: string; type: string }[];
  hotspots: GeologicalHotspot[];
}

export const PLANETARY_EPOCHS: PlanetaryTelemetry[] = [
  {
    yearLabel: '4.54 Billion BCE',
    epochIndex: 0,
    epochTitle: 'Hadean Eon — The Molten Proto-Planet',
    tagline: 'Accretion of Earth, Magma Oceans & Lunar Formation',
    description:
      'Formed from the solar nebula, proto-Earth was a searing sphere of incandescent silicate magma. Constant bolide impacts and radioactive decay melted the surface into molten rivers. A Mars-sized protoplanet (Theia) collided with Earth, ejecting mantle debris that coalesced into the Moon.',
    surfaceTemp: '1,200°C',
    o2Percent: '0.00%',
    co2Ppm: '85,000 ppm',
    continents: 'None (Liquid Magma Ocean)',
    lifeMilestone: 'Prebiotic Synthesis & Water Vapor Condensation',
    dominantColor: '#ff4500',
    atmosphereHue: '#ff6600',
    linkedSpecimens: [
      { id: 'zircon-crystal', name: 'Jack Hills Zircon Crystal', type: 'fossil' },
      { id: 'isua-banded-iron', name: 'Isua Banded Iron Formation', type: 'fossil' },
    ],
    hotspots: [
      {
        id: 'hadean-theia',
        name: 'Theia Giant Impact Basin',
        lat: 18.5,
        lon: -32.0,
        tagline: 'Cataclysmic Protoplanetary Lunar Genesis',
        details: 'Location of the Mars-sized planetesimal collision that stripped early crust and formed the Moon.',
        significance: 'Catastrophic origin of Earth-Moon gravitational lock and axial stabilization.',
        specimenId: 'zircon-crystal',
        specimenName: 'Jack Hills Zircon Crystal',
      },
      {
        id: 'hadean-jack-hills',
        name: 'Jack Hills Zircon Outcrop',
        lat: -26.1,
        lon: 117.2,
        tagline: 'Oldest Terrestrial Relic (4.40 Ga)',
        details: 'Microscopic detrital zircons showing isotopic evidence of early liquid water oceans.',
        significance: 'Proof of cool early Earth crustal solidification and primordial oceans.',
        specimenId: 'zircon-crystal',
        specimenName: 'Jack Hills Zircon Crystal',
      },
      {
        id: 'hadean-magma-sea',
        name: 'Equatorial Magma Ocean',
        lat: 0.0,
        lon: 55.0,
        tagline: 'Vigorous Mantle Convective Overturn',
        details: 'Silicate vapor atmosphere raining liquid rock into convection plumes 1,000 km deep.',
        significance: 'Planetary core-mantle chemical differentiation and iron catastrophe.',
      },
    ],
  },
  {
    yearLabel: '3.80 Billion BCE',
    epochIndex: 1,
    epochTitle: 'Archean Eon — The Primordial Iron Sea',
    tagline: 'Cooling Crust, Deep-Sea Hydrothermal Vents & First Cellular Life',
    description:
      'As the crust solidified, torrential rains formed vast, acidic iron-rich oceans with a greenish tint. Around submarine hydrothermal "black smoker" vents, the first RNA molecules and prokaryotic cells arose. In shallow tidal flats, cyanobacteria built massive layered stromatolite bio-colonies.',
    surfaceTemp: '55°C',
    o2Percent: '< 0.05%',
    co2Ppm: '42,000 ppm',
    continents: 'First Micro-Cratons (Pilbara, Kaapvaal)',
    lifeMilestone: 'Oldest Direct Fossils (Stromatolites) & Methanogenesis',
    dominantColor: '#00b4d8',
    atmosphereHue: '#0077b6',
    linkedSpecimens: [
      { id: 'stromatolite-pilbara', name: 'Pilbara Stromatolite', type: 'fossil' },
      { id: 'banded-iron-formation', name: 'Banded Iron Formation', type: 'rock' },
    ],
    hotspots: [
      {
        id: 'archean-pilbara',
        name: 'Pilbara Craton (North Pole Dome)',
        lat: -21.1,
        lon: 119.7,
        tagline: '3.48 Ga Microbial Stromatolite Reef',
        details: 'Oldest undisputed macroscopic evidence of cellular life on Earth preserved in chert.',
        significance: 'Origin of biogenic oxygenation and photosynthetic reef construction.',
        specimenId: 'stromatolite-pilbara',
        specimenName: 'Pilbara Stromatolite',
      },
      {
        id: 'archean-barberton',
        name: 'Barberton Greenstone Belt',
        lat: -25.8,
        lon: 31.0,
        tagline: 'Ancient Volcanic Micro-Continent Nucleus',
        details: 'Ultramafic komatiite volcanic sequences erupted at over 1,600°C under deep oceans.',
        significance: 'Preserves the earliest stable granite-gneiss continental crust.',
        specimenId: 'isua-banded-iron',
        specimenName: 'Isua Banded Iron Formation',
      },
      {
        id: 'archean-hydrothermal',
        name: 'Primordial Hydrothermal Field',
        lat: 14.2,
        lon: -44.5,
        tagline: 'Alkaline Vent Prebiotic Engine',
        details: 'Deep sea mineral chimneys driving proton gradients for early metabolic synthesis.',
        significance: 'Plausible hydrothermal cradle for the Last Universal Common Ancestor (LUCA).',
      },
    ],
  },
  {
    yearLabel: '2.40 Billion BCE',
    epochIndex: 2,
    epochTitle: 'Proterozoic Eon — Snowball Earth & Oxygen Catastrophe',
    tagline: 'The Great Oxidation Event & Global Huronian Glaciation',
    description:
      'Cyanobacterial photosynthesis released massive volumes of free oxygen, oxidizing methane and precipitating dissolved ocean iron into Banded Iron Formations. The loss of greenhouse gases plunged the entire planet into "Snowball Earth", coating the globe in ice sheets up to 1 km thick from pole to equator.',
    surfaceTemp: '-45°C',
    o2Percent: '12.0%',
    co2Ppm: '140 ppm',
    continents: 'Columbia Supercontinent & Ice Sheets',
    lifeMilestone: 'Eukaryotic Cells & Endosymbiosis',
    dominantColor: '#caf0f8',
    atmosphereHue: '#90e0ef',
    linkedSpecimens: [
      { id: 'isua-banded-iron', name: 'Isua Banded Iron Formation', type: 'fossil' },
      { id: 'dickinsonia-costata', name: 'Dickinsonia costata', type: 'fossil' },
    ],
    hotspots: [
      {
        id: 'proterozoic-huronian',
        name: 'Huronian Glacial Tillite Basin',
        lat: 46.5,
        lon: -82.4,
        tagline: 'First Global Snowball Earth Outcrop',
        details: 'Massive moraine boulder diamictites deposited at equatorial sea level under runaway ice.',
        significance: 'Direct physical rock proof of planet-wide cryogenic freeze.',
        specimenId: 'isua-banded-iron',
        specimenName: 'Isua Banded Iron Formation',
      },
      {
        id: 'proterozoic-mistaken',
        name: 'Mistaken Point (Ediacaran Fauna)',
        lat: 46.6,
        lon: -53.2,
        tagline: '565 Ma Multicellular Ecosystem',
        details: 'Volcanic ash beds preserving bedding planes of soft-bodied Dickinsonia and Rangeomorphs.',
        significance: 'Dawn of macroscopic multicellular animals in the fossil record.',
        specimenId: 'dickinsonia-costata',
        specimenName: 'Dickinsonia costata',
      },
      {
        id: 'proterozoic-hamersley',
        name: 'Hamersley Iron Basin',
        lat: -22.3,
        lon: 117.8,
        tagline: 'Global Rusting of the Oceans',
        details: 'Thick banded alternating layers of jasper and hematite precipitated by photosynthetic oxygen.',
        significance: 'Permanent atmospheric transformation from reducing to oxidizing.',
      },
    ],
  },
  {
    yearLabel: '541 – 252 Million BCE',
    epochIndex: 3,
    epochTitle: 'Paleozoic Era — Cambrian Explosion & Land Colonization',
    tagline: 'Armored Marine Arthropods, Coal Forests & Early Synapsids',
    description:
      'Marine life erupted in unprecedented diversity during the Cambrian Explosion, yielding armored trilobites, anomalocarid predators, and early vertebrates. Vascular plants and giant club mosses formed Earth\'s first vast swamp forests, sequestering carbon as tetrapods ventured onto land, before ending in the catastrophic Permian Great Dying.',
    surfaceTemp: '20°C',
    o2Percent: '21.0%',
    co2Ppm: '3,500 ppm',
    continents: 'Gondwana & Euramerica Fusing into Pangaea',
    lifeMilestone: 'Cambrian Explosion, Land Colonization & Synapsids',
    dominantColor: '#4C9A5B',
    atmosphereHue: '#3a7d44',
    linkedSpecimens: [
      { id: 'trilobite-paradoxides', name: 'Paradoxides Trilobite', type: 'fossil' },
      { id: 'dimetrodon-grandis', name: 'Dimetrodon Synapsid', type: 'fossil' },
    ],
    hotspots: [
      {
        id: 'paleozoic-burgess',
        name: 'Burgess Shale Oceanic Trench',
        lat: 51.4,
        lon: -116.5,
        tagline: 'Cambrian Explosion Fossil Lagerstätte',
        details: 'Deep submarine silt preservation capturing soft-bodied anatomical designs of the early animal phyla.',
        significance: 'Benchmark radiation snapshot demonstrating the origin of modern animal body plans.',
        specimenId: 'trilobite-paradoxides',
        specimenName: 'Paradoxides Trilobite',
      },
      {
        id: 'paleozoic-karoo',
        name: 'Karoo Supergroup Basin',
        lat: -31.8,
        lon: 24.5,
        tagline: 'Permian Terrestrial Synapsid Ecosystem',
        details: 'Extensive mudstone floodplains documenting early proto-mammal synapsids and the Permian mass extinction.',
        significance: 'Crucial evolutionary window into the reptilian ancestors of modern mammals.',
        specimenId: 'dimetrodon-grandis',
        specimenName: 'Dimetrodon grandis',
      },
    ],
  },
  {
    yearLabel: '252 – 66 Million BCE',
    epochIndex: 4,
    epochTitle: 'Mesozoic Era — Supercontinent Pangaea & Dinosaurs',
    tagline: 'Single Landmass, Giant Conifer Rainforests & Apex Reptiles',
    description:
      'All of Earth\'s landmasses fused into the immense supercontinent Pangaea, bordered by the global Panthalassa ocean and the warm tropical Tethys seaway. Giant seed ferns and conifers covered the coasts, supporting massive sauropods, theropods, and flying pterosaurs under a warm, greenhouse atmosphere, ended by the Chicxulub bolide impact.',
    surfaceTemp: '24°C',
    o2Percent: '28.0%',
    co2Ppm: '1,950 ppm',
    continents: 'Pangaea Supercontinent Rifting',
    lifeMilestone: 'Adaptive Radiation of Dinosaurs & Early Birds',
    dominantColor: '#C27D30',
    atmosphereHue: '#52b788',
    linkedSpecimens: [
      { id: 'trex-sue', name: '"Sue" the T. rex', type: 'fossil' },
      { id: 'archaeopteryx-london', name: 'Archaeopteryx (London)', type: 'fossil' },
      { id: 'kpg-boundary-clay', name: 'K–Pg Iridium Boundary Clay', type: 'rock' },
    ],
    hotspots: [
      {
        id: 'mesozoic-chicxulub',
        name: 'Chicxulub Asteroid Ground Zero',
        lat: 21.3,
        lon: -89.5,
        tagline: '10km Bolide Extinction Impact Crater',
        details: 'Peak ring impact crater that ended the age of dinosaurs 66 million years ago.',
        significance: 'Fifth major mass extinction opening ecological space for mammalian radiation.',
        specimenId: 'kpg-boundary-clay',
        specimenName: 'K-Pg Boundary Clay',
      },
      {
        id: 'mesozoic-hell-creek',
        name: 'Hell Creek Cretaceous Biosphere',
        lat: 47.3,
        lon: -106.8,
        tagline: 'Late Cretaceous Apex Ecosystem',
        details: 'River floodplain strata rich in Tyrannosaurus rex, Triceratops, and angiosperm leaves.',
        significance: 'The ultimate pinnacle of dinosaurian anatomy prior to the bolide impact.',
        specimenId: 'trex-sue',
        specimenName: '"Sue" the T. rex',
      },
      {
        id: 'mesozoic-solnhofen',
        name: 'Solnhofen Plattenkalk Lagoon',
        lat: 48.9,
        lon: 11.0,
        tagline: 'Jurassic Transitional Feathered Fossil',
        details: 'Ultra-fine limestone preserving pristine wing feathers and skeletal anatomy of Archaeopteryx.',
        significance: 'Critical evolutionary bridge linking non-avian theropod dinosaurs to modern birds.',
        specimenId: 'archaeopteryx-london',
        specimenName: 'Archaeopteryx',
      },
    ],
  },
  {
    yearLabel: '66 Million BCE – Present',
    epochIndex: 5,
    epochTitle: 'Cenozoic Era — Age of Mammals & Living Technosphere',
    tagline: 'Continental Rifting, Cyclic Glaciation & Global Civilization',
    description:
      'Continents reached modern configurations, initiating rhythmic Pleistocene ice ages with mammoths and saber-toothed cats across the tundra. Genus Homo crafted stone tools, harnessed fire, and painted caves, culminating in a global digital civilization with illuminated cities and satellite constellations.',
    surfaceTemp: '15.2°C',
    o2Percent: '20.95%',
    co2Ppm: '424 ppm',
    continents: '7 Modern Continents & Polar Ice Caps',
    lifeMilestone: 'Homo sapiens, Megafauna & Technosphere',
    dominantColor: '#35628A',
    atmosphereHue: '#0077b6',
    linkedSpecimens: [
      { id: 'mammoth-lyuba', name: 'Woolly Mammoth Calf ("Lyuba")', type: 'fossil' },
      { id: 'smilodon-la-brea', name: 'Saber-Toothed Cat (Smilodon)', type: 'fossil' },
      { id: 'voyager-golden-record', name: 'Voyager Golden Record', type: 'artifact' },
    ],
    hotspots: [
      {
        id: 'cenozoic-beringia',
        name: 'Beringia Mammoth Steppe',
        lat: 64.5,
        lon: -168.0,
        tagline: 'Ice Age Intercontinental Land Bridge',
        details: 'Hyperborean biome connecting Siberia and Alaska due to 120m lower sea levels.',
        significance: 'Primary migration corridor for Pleistocene megafauna and first human settlers.',
        specimenId: 'mammoth-lyuba',
        specimenName: 'Woolly Mammoth ("Lyuba")',
      },
      {
        id: 'cenozoic-la-brea',
        name: 'La Brea Asphalt Seeps',
        lat: 34.0,
        lon: -118.3,
        tagline: 'Natural Tar Pit Megafauna Trap',
        details: 'Petroleum seeps preserving thousands of complete Smilodon, Dire Wolf, and Mastodon bones.',
        significance: 'Finest terrestrial snapshot of North American Ice Age carnivore ecology.',
        specimenId: 'smilodon-la-brea',
        specimenName: 'Smilodon Skull',
      },
      {
        id: 'cenozoic-cern',
        name: 'CERN Particle Physics Laboratory',
        lat: 46.2,
        lon: 6.0,
        tagline: '27km Large Hadron Collider',
        details: 'Subterranean superconductor synchrotron recreating conditions picoseconds after Big Bang.',
        significance: 'Technosphere pinnacle probing fundamental Higgs mechanism and cosmic origins.',
        specimenId: 'voyager-golden-record',
        specimenName: 'Voyager Golden Record',
      },
    ],
  },
];

export interface EvolutionState {
  epochProgress: number; // 0.0 to 5.0 continuous
  currentStage: number; // 1 to 6
  scrollProgress: number; // 0.0 to 1.0
  isPlaying: boolean;
  playbackSpeed: number; // 0.5, 1, 2, 5
  showAtmosphere: boolean;
  showCityLights: boolean;
  isTheaterMode: boolean;
  comparisonEpochIndex: number | null;
  visualizationMode: VisualizationMode;
  cameraPreset: CameraPreset;
  activeHotspot: GeologicalHotspot | null;
  hotspotTargetCoords: [number, number, number] | null;
  ambientAudioEnabled: boolean;
  impactTriggerKey: number;
  telemetry: PlanetaryTelemetry;
  setEpochProgress: (progress: number) => void;
  setScrollProgress: (progress: number) => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  jumpToEpoch: (epochIndex: number) => void;
  setActiveHotspot: (hotspot: GeologicalHotspot | string | null) => void;
  triggerImpact: () => void;
  toggleAtmosphere: () => void;
  toggleCityLights: () => void;
  toggleTheaterMode: () => void;
  setComparisonEpoch: (index: number | null) => void;
  toggleAmbientAudio: () => void;
  setVisualizationMode: (mode: VisualizationMode) => void;
  setCameraPreset: (preset: CameraPreset) => void;
}

function getInterpolatedTelemetry(progress: number): PlanetaryTelemetry {
  const clamped = Math.max(0, Math.min(5, progress));
  const idx = Math.min(Math.floor(clamped), 5);
  return PLANETARY_EPOCHS[idx];
}

// Convert Lat/Lon to 3D Cartesian coordinates on sphere radius R
export function latLonToVector3(lat: number, lon: number, radius = 2.5): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

export const useEvolutionStore = create<EvolutionState>((set) => ({
  epochProgress: 0,
  currentStage: 1,
  scrollProgress: 0,
  isPlaying: false,
  playbackSpeed: 1,
  showAtmosphere: true,
  showCityLights: true,
  isTheaterMode: false,
  comparisonEpochIndex: null,
  visualizationMode: 'natural',
  cameraPreset: 'default',
  activeHotspot: null,
  hotspotTargetCoords: null,
  ambientAudioEnabled: false,
  impactTriggerKey: 0,
  telemetry: PLANETARY_EPOCHS[0],

  setEpochProgress: (progress) => {
    const clamped = Math.max(0, Math.min(5, progress));
    const stage = Math.min(Math.floor(clamped) + 1, 6);
    const telemetry = getInterpolatedTelemetry(clamped);

    set({
      epochProgress: clamped,
      currentStage: stage,
      scrollProgress: clamped / 5,
      telemetry,
    });
  },

  setScrollProgress: (progress) => {
    const clampedP = Math.max(0, Math.min(1, progress));
    const epochP = clampedP * 5;
    const stage = Math.min(Math.floor(epochP) + 1, 6);
    const telemetry = getInterpolatedTelemetry(epochP);

    set({
      epochProgress: epochP,
      currentStage: stage,
      scrollProgress: clampedP,
      telemetry,
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  jumpToEpoch: (epochIndex) => {
    const clampedIdx = Math.max(0, Math.min(5, epochIndex));
    const telemetry = PLANETARY_EPOCHS[clampedIdx];
    set({
      epochProgress: clampedIdx,
      currentStage: clampedIdx + 1,
      scrollProgress: clampedIdx / 5,
      telemetry,
      activeHotspot: null,
      hotspotTargetCoords: null,
    });
  },

  setActiveHotspot: (hotspot) => {
    if (!hotspot) {
      set({ activeHotspot: null, hotspotTargetCoords: null });
      return;
    }
    if (typeof hotspot === 'string') {
      for (const ep of PLANETARY_EPOCHS) {
        const found = ep.hotspots.find((h) => h.id === hotspot || h.specimenId === hotspot);
        if (found) {
          const coords = latLonToVector3(found.lat, found.lon, 2.52);
          set({ activeHotspot: found, hotspotTargetCoords: coords });
          return;
        }
      }
      set({ activeHotspot: null, hotspotTargetCoords: null });
      return;
    }
    const coords = latLonToVector3(hotspot.lat, hotspot.lon, 2.52);
    set({ activeHotspot: hotspot, hotspotTargetCoords: coords });
  },

  triggerImpact: () => set((state) => ({ impactTriggerKey: state.impactTriggerKey + 1 })),

  toggleAtmosphere: () => set((state) => ({ showAtmosphere: !state.showAtmosphere })),
  toggleCityLights: () => set((state) => ({ showCityLights: !state.showCityLights })),
  toggleTheaterMode: () => set((state) => ({ isTheaterMode: !state.isTheaterMode })),
  setComparisonEpoch: (index) => set({ comparisonEpochIndex: index }),
  toggleAmbientAudio: () => set((state) => ({ ambientAudioEnabled: !state.ambientAudioEnabled })),
  setVisualizationMode: (mode) => set({ visualizationMode: mode }),
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
}));

