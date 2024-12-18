import React, { useState } from "react";
import FlightFilter from "../../Components/FlightFilter/FlightFilter";
import FlightListOneWay from "../../Components/FlightList/FlightListOneWay";
import FlightListRoundTrip from "../../Components/FlightList/FlightListRoundTrip";
import useFlightStore from "../../Stores/FlightStore";

// Flight Data
const flightData = [
  {
    id: "1",
    flightNumber: "AB123",
    price: 30000,
    duration: 1,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "departure",
  },
  {
    id: "2",
    flightNumber: "AB456",
    price: 15000,
    duration: 2,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "departure",
  },
  {
    id: "3",
    flightNumber: "AB123",
    price: 25000,
    duration: 1,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "return",
  },
  {
    id: "4",
    flightNumber: "AB123",
    price: 10000,
    duration: 3,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "departure",
  },
  {
    id: "5",
    flightNumber: "AB123",
    price: 5000,
    duration: 5,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "return",
  },
  {
    id: "6",
    flightNumber: "AB123",
    price: 12000,
    duration: 3,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "return",
  },
  {
    id: "7",
    flightNumber: "AB124",
    price: 21000,
    duration: 2.5,
    startTime: "2024-12-15T18:00:00",
    endTime: "2024-12-15T20:30:00",
    type: "return",
  },
] as const;

const FlightListPage: React.FC = () => {
  const [filter, setFilter] = useState<"cheapest" | "fastest">("cheapest");
  const { selectedTrip } = useFlightStore();

  // Filter flights based on the filter
  const filteredFlights = [...flightData].sort((a, b) => {
    if (filter === "cheapest") return a.price - b.price;
    if (filter === "fastest") return a.duration - b.duration;
    return 0;
  });

  return (
    <div style={styles.container}>
      {/* Fixed Filter */}
      <div style={styles.filterContainer}>
        <h1>Available Flights</h1>
        <FlightFilter selectedFilter={filter} onFilterChange={setFilter} />
      </div>

      {/* Scrollable Flight List */}
      <div style={styles.flightListContainer}>
        {selectedTrip === "one-way" ? (
          <FlightListOneWay
            flights={filteredFlights.filter((f) => f.type === "departure")}
          />
        ) : (
          <FlightListRoundTrip flights={filteredFlights} />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100vh", // Full screen height
    overflow: "hidden", // Prevent the entire page from scrolling
  },
  filterContainer: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    padding: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Subtle shadow for a fixed filter
  },
  flightListContainer: {
    marginTop: "160px", // Push the list below the fixed filter
    height: "calc(100vh - 120px)", // Calculate remaining height for the list
    overflowY: "auto" as const, // Scrollable flight list
    padding: "1rem",
    backgroundColor: "#f9f9f9",
  },
};

export default FlightListPage;
