// FlightFilter.tsx
import React from "react";
import { useFilterStore } from "../../Stores/FilterStore"; // Import filter store
import "./FlightFilter.scss"; // Import styles

const FlightFilter: React.FC = () => {
  // Access selectedFilter, selectedStops, and actions directly from the store
  const {
    selectedFilter,
    selectedStops,
    setSelectedFilter,
    setSelectedStops,
    resetFilters,
  } = useFilterStore();

  // Handle filter updates when a user selects a filter option
  return (
    <div className="flightListFilter-filterCard">
      <h2 className="flightListFilter-filterHeading">Filters</h2>

      {/* Cheapest and Fastest Buttons */}
      <div className="flightListFilter-filterButtons">
        <button
          className={selectedFilter === "cheapest" ? "selected" : ""}
          onClick={() => setSelectedFilter("cheapest")} // Update selectedFilter in Zustand
        >
          Cheapest
        </button>
        <button
          className={selectedFilter === "fastest" ? "selected" : ""}
          onClick={() => setSelectedFilter("fastest")} // Update selectedFilter in Zustand
        >
          Fastest
        </button>
      </div>

      {/* Stops Filter Section */}
      <div className="flightListFilter-stopsFilter">
        <h3>Stops</h3>
        <label>
          <input
            type="checkbox"
            checked={selectedStops === 0}
            onChange={() => setSelectedStops(selectedStops === 0 ? null : 0)} // Update selectedStops in Zustand
          />
          Non-Stops
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedStops === 1}
            onChange={() => setSelectedStops(selectedStops === 1 ? null : 1)} // Update selectedStops in Zustand
          />
          1 Stop
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedStops === 2}
            onChange={() => setSelectedStops(selectedStops === 2 ? null : 2)} // Update selectedStops in Zustand
          />
          More than 1
        </label>
      </div>

      {/* Reset Filters Button */}
      <div className="flightListFilter-resetfilterbutton">
        <button
          className="flightListFilter-resetFilters"
          onClick={resetFilters} // Reset filters in Zustand
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FlightFilter;
