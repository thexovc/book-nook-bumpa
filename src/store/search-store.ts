import { create } from 'zustand';

interface SearchState {
  query: string;
  selectedCategory: string | null;
  setQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
  clearFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  selectedCategory: null,
  
  setQuery: (query: string) => set({ query, selectedCategory: null }),
  
  setCategory: (category: string | null) => set({ selectedCategory: category, query: '' }),
  
  clearFilters: () => set({ query: '', selectedCategory: null }),
}));

// Atomic selectors
export const selectQuery = (state: SearchState) => state.query;
export const selectSelectedCategory = (state: SearchState) => state.selectedCategory;
export const selectSetQuery = (state: SearchState) => state.setQuery;
export const selectSetCategory = (state: SearchState) => state.setCategory;
export const selectClearFilters = (state: SearchState) => state.clearFilters;
