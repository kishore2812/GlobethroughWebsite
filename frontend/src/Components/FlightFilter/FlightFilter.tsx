// FlightFilter.tsx

import React from "react";
import useFlightStore from "../../Stores/FlightStore"; // Import Zustand store
import "./FlightFilter.scss"; // Import styles

interface FlightFilterProps {
  selectedFilter: "cheapest" | "fastest";
  selectedStops: number | null;
  flightData: {
    type: "departure" | "return";
    price: number;
    duration: number;
  }[]; // Assuming flightData has type "departure" or "return"
  onFilterChange: (filter: "cheapest" | "fastest") => void;
  onStopsChange: (stops: number | null) => void;
  onResetFilters: () => void; // Add reset filters function
}

const FlightFilter: React.FC<FlightFilterProps> = ({
  selectedFilter,
  selectedStops,
  flightData,
  onFilterChange,
  onStopsChange,
  onResetFilters,
}) => {
  // Access selectedTrip from Zustand store
  const selectedTrip = useFlightStore((state) => state.selectedTrip);

  // Calculate total flight count based on trip type and flight data
  const calculateFlightCount = () => {
    let totalFlights = 0;

    if (selectedTrip === "one-way") {
      // For one-way trips, count only departure flights
      totalFlights = flightData.filter(
        (flight) => flight.type === "departure"
      ).length;
    } else if (selectedTrip === "round-trip") {
      // For round-trip, count both departure and return flights
      totalFlights =
        flightData.filter((flight) => flight.type === "departure").length +
        flightData.filter((flight) => flight.type === "return").length;
    }

    return totalFlights;
  };

  const totalFlights = calculateFlightCount();

  return (
    <div className="flightListFilter-filterCard">
      <h2 className="flightListFilter-filterHeading">Filters</h2>

      {/* Flight Count Section */}
      <div className="flightListFilter-flightCount">
        <p>Showing {totalFlights} flights</p>
      </div>

      {/* Cheapest and Fastest Buttons */}
      <div className="flightListFilter-filterButtons">
        <button
          className={selectedFilter === "cheapest" ? "selected" : ""}
          onClick={() => onFilterChange("cheapest")}
        >
          Cheapest
        </button>
        <button
          className={selectedFilter === "fastest" ? "selected" : ""}
          onClick={() => onFilterChange("fastest")}
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
            onChange={() => onStopsChange(selectedStops === 0 ? null : 0)}
          />
          Non-Stops
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedStops === 1}
            onChange={() => onStopsChange(selectedStops === 1 ? null : 1)}
          />
          1 Stop
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedStops === 2}
            onChange={() => onStopsChange(selectedStops === 2 ? null : 2)}
          />
          More than 1
        </label>
      </div>

      {/* Reset Filters Button */}
      <div className="flightListFilter-resetfilterbutton">
        <button
          className="flightListFilter-resetFilters"
          onClick={onResetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FlightFilter;
