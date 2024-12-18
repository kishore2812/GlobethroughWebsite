import React from "react";

interface FlightFilterProps {
  selectedFilter: "cheapest" | "fastest";
  onFilterChange: (filter: "cheapest" | "fastest") => void;
}

const FlightFilter: React.FC<FlightFilterProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div>
      <h2>Filter Options</h2>
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
    </div>
  );
};

export default FlightFilter;
