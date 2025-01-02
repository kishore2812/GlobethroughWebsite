import React from "react";

interface FlightFilterProps {
  selectedFilter: "cheapest" | "fastest";
  selectedStops: number | null;
  flightCounts: { nonStops: number; oneStop: number; moreThanOneStop: number };
  onFilterChange: (filter: "cheapest" | "fastest") => void;
  onStopsChange: (stops: number | null) => void;
}

const FlightFilter: React.FC<FlightFilterProps> = ({
  selectedFilter,
  selectedStops,

  onFilterChange,
  onStopsChange,
}) => {
  return (
    <div>
      <h2>Filter Options</h2>

      {/* Cheapest and Fastest */}
      <button
        style={{
          backgroundColor: selectedFilter === "cheapest" ? "blue" : "white",
        }}
        onClick={() => onFilterChange("cheapest")}
      >
        Cheapest
      </button>
      <button
        style={{
          backgroundColor: selectedFilter === "fastest" ? "blue" : "white",
        }}
        onClick={() => onFilterChange("fastest")}
      >
        Fastest
      </button>

      {/* Stops Filter */}
      <h3>Stops</h3>
      <div>
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
          More than 1 Stop
        </label>
      </div>
    </div>
  );
};

export default FlightFilter;
