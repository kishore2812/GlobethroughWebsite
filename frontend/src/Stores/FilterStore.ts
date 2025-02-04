// filterStore.ts
import { create } from "zustand";

interface FilterStore {
  selectedFilter: "cheapest" | "fastest";
  selectedStops: number | null;
  setSelectedFilter: (filter: "cheapest" | "fastest") => void;
  setSelectedStops: (stops: number | null) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedFilter: "cheapest", // Default filter
  selectedStops: null, // No filter on stops initially
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  setSelectedStops: (stops) => set({ selectedStops: stops }),
  resetFilters: () => set({ selectedFilter: "cheapest", selectedStops: null }), // Reset filters to defaults
}));
