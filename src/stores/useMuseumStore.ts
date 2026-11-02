import { create } from 'zustand';
import type { GalleryTab } from '@/types/museum';

interface MuseumState {
  searchQuery: string;
  activeTab: GalleryTab;
  sortBy: 'oldest' | 'newest' | 'name';
  setSearchQuery: (q: string) => void;
  setActiveTab: (tab: GalleryTab) => void;
  setSortBy: (sort: 'oldest' | 'newest' | 'name') => void;
  resetFilters: () => void;
}

export const useMuseumStore = create<MuseumState>((set) => ({
  searchQuery: '',
  activeTab: 'All Items',
  sortBy: 'oldest',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set({ searchQuery: '', activeTab: 'All Items', sortBy: 'oldest' }),
}));
