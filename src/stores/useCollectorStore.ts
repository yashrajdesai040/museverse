import { create } from 'zustand';
import { entities } from '@/data/entities';
import { MuseumEntity, isFossil } from '@/types/museum';

export const PASSPORT_STORAGE_KEY = 'museo_passport_stamps';

export interface CollectorAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredCount?: number;
  check: (stamps: string[]) => boolean;
}

export const COLLECTOR_ACHIEVEMENTS: CollectorAchievement[] = [
  {
    id: 'first-footprint',
    title: 'First Footprint',
    description: 'Log your very first specimen into the Curator Passport.',
    icon: '👣',
    check: (stamps) => stamps.length >= 1,
  },
  {
    id: 'fossil-pioneer',
    title: 'Fossil Pioneer',
    description: 'Unearth and catalog at least 5 prehistoric fossils.',
    icon: '🦴',
    check: (stamps) => {
      const fossilCount = entities.filter((e) => isFossil(e) && stamps.includes(e.id)).length;
      return fossilCount >= 5;
    },
  },
  {
    id: 'relic-conservator',
    title: 'Relic Conservator',
    description: 'Document and archive at least 5 human cultural artifacts.',
    icon: '🏺',
    check: (stamps) => {
      const artifactCount = entities.filter((e) => !isFossil(e) && stamps.includes(e.id)).length;
      return artifactCount >= 5;
    },
  },
  {
    id: 'apex-predators',
    title: 'Apex Dynasty',
    description: 'Collect T-Rex Sue, Spinosaurus, Velociraptor, Dimetrodon, and Smilodon.',
    icon: '🦖',
    check: (stamps) => {
      const target = ['trex-sue', 'spinosaurus-skull', 'velociraptor-fighting-dinosaurs', 'dimetrodon-grandis', 'smilodon-la-brea'];
      return target.every((id) => stamps.includes(id));
    },
  },
  {
    id: 'dawn-of-man',
    title: "Humanity's Genesis",
    description: 'Collect Lucy, Acheulean Handaxe, Lascaux Relief, and Ötzi the Iceman.',
    icon: '🔥',
    check: (stamps) => {
      const target = ['lucy-australopithecus', 'acheulean-handaxe', 'lascaux-relief', 'otzi-iceman'];
      return target.every((id) => stamps.includes(id));
    },
  },
  {
    id: 'cosmic-horizon',
    title: 'Cosmic Voyager',
    description: 'Collect Apollo 11 Lunar Basalt, Voyager Golden Record, and Zircon Crystal.',
    icon: '🚀',
    check: (stamps) => {
      const target = ['apollo-11-basalt', 'voyager-golden-record', 'zircon-crystal'];
      return target.every((id) => stamps.includes(id));
    },
  },
  {
    id: 'ediacaran-bloom',
    title: 'Ediacaran Genesis',
    description: 'Collect Charnia, Dickinsonia, and Spriggina early bilaterian.',
    icon: '🌿',
    check: (stamps) => {
      const target = ['charnia-masoni', 'dickinsonia-costata', 'spriggina-floundersi'];
      return target.every((id) => stamps.includes(id));
    },
  },
  {
    id: 'grand-curator-laureate',
    title: 'Grand Curator Laureate',
    description: 'Achieve 100% complete discovery of all 44 museum specimens.',
    icon: '👑',
    check: (stamps) => stamps.length === entities.length,
  },
];

export function getCuratorRank(count: number): {
  title: string;
  tier: number;
  color: string;
  nextThreshold: number | null;
} {
  if (count >= 44) {
    return { title: 'Grand Curator of Deep Time', tier: 5, color: '#ffd700', nextThreshold: null };
  }
  if (count >= 30) {
    return { title: 'Principal Deep-Time Archivist', tier: 4, color: '#00f7ff', nextThreshold: 44 };
  }
  if (count >= 18) {
    return { title: 'Master Paleontologist', tier: 3, color: '#a855f7', nextThreshold: 30 };
  }
  if (count >= 8) {
    return { title: 'Senior Antiquities Fellow', tier: 2, color: '#38bdf8', nextThreshold: 18 };
  }
  return { title: 'Apprentice Specimen Explorer', tier: 1, color: '#f59e0b', nextThreshold: 8 };
}

interface CollectorState {
  stamps: string[];
  recentlyStampedId: string | null;
  notificationMsg: string | null;

  // Actions
  init: () => void;
  addStamp: (id: string) => boolean;
  removeStamp: (id: string) => void;
  toggleStamp: (id: string) => boolean;
  isStamped: (id: string) => boolean;
  stampAll: () => void;
  resetStamps: () => void;
  clearRecentlyStamped: () => void;
}

const getInitialStamps = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(PASSPORT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  // Default starter specimens
  const defaultStarter = ['trex-sue', 'antikythera-mechanism', 'voyager-golden-record'];
  if (typeof window !== 'undefined') {
    localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(defaultStarter));
  }
  return defaultStarter;
};

export const useCollectorStore = create<CollectorState>((set, get) => ({
  stamps: getInitialStamps(),
  recentlyStampedId: null,
  notificationMsg: null,

  init: () => {
    if (typeof window === 'undefined') return;
    const current = getInitialStamps();
    set({ stamps: current });

    // Sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PASSPORT_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            set({ stamps: parsed });
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
  },

  addStamp: (id: string) => {
    const { stamps } = get();
    if (stamps.includes(id)) return false;

    const next = [...stamps, id];
    if (typeof window !== 'undefined') {
      localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(next));
    }

    const item = entities.find((e) => e.id === id);
    const itemName = item ? item.name : id;

    set({
      stamps: next,
      recentlyStampedId: id,
      notificationMsg: `[ CURATOR SEAL APPLIED: ${itemName.toUpperCase()} ]`,
    });

    return true;
  },

  removeStamp: (id: string) => {
    const { stamps } = get();
    const next = stamps.filter((s) => s !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(next));
    }
    set({ stamps: next });
  },

  toggleStamp: (id: string) => {
    const { stamps, addStamp, removeStamp } = get();
    if (stamps.includes(id)) {
      removeStamp(id);
      return false;
    } else {
      return addStamp(id);
    }
  },

  isStamped: (id: string) => {
    return get().stamps.includes(id);
  },

  stampAll: () => {
    const allIds = entities.map((e) => e.id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(allIds));
    }
    set({
      stamps: allIds,
      notificationMsg: '⚡ [ FULL MUSEUM VAULT 100% UNLOCKED & STAMPED ]',
    });
  },

  resetStamps: () => {
    const starter = ['trex-sue', 'antikythera-mechanism', 'voyager-golden-record'];
    if (typeof window !== 'undefined') {
      localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(starter));
    }
    set({
      stamps: starter,
      recentlyStampedId: null,
      notificationMsg: '↺ [ PASSPORT RESET TO STARTER SPECIMENS ]',
    });
  },

  clearRecentlyStamped: () => {
    set({ recentlyStampedId: null, notificationMsg: null });
  },
}));
