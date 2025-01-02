import React, { useState } from "react";
import { flightData } from "./flightdata"; // Import the data and interface
import FlightFilter from "../../Components/FlightFilter/FlightFilter";
import FlightListOneWay from "../../Components/FlightList/FlightListOneWay";
import FlightListRoundTrip from "../../Components/FlightList/FlightListRoundTrip";
import useFlightStore from "../../Stores/FlightStore";

const FlightListPage: React.FC = () => {
  const [filter, setFilter] = useState<"cheapest" | "fastest">("cheapest");
  const [selectedStops, setSelectedStops] = useState<number | null>(null);
  const { selectedTrip } = useFlightStore();

  const flightCounts = {
    nonStops: flightData.filter((flight) => flight.stops === 0).length,
    oneStop: flightData.filter((flight) => flight.stops === 1).length,
    moreThanOneStop: flightData.filter((flight) => flight.stops > 1).length,
  };

  const sortedFlights = [...flightData].sort((a, b) => {
    if (selectedStops !== null) {
      if (a.stops === selectedStops && b.stops !== selectedStops) return -1;
      if (b.stops === selectedStops && a.stops !== selectedStops) return 1;
    }
    if (filter === "cheapest") return a.price - b.price;
    if (filter === "fastest") return a.duration - b.duration;
    return a.stops - b.stops;
  });

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.filterContainer}>
          <h1>Available Flights</h1>
          <FlightFilter
            selectedFilter={filter}
            selectedStops={selectedStops}
            flightCounts={flightCounts}
            onFilterChange={setFilter}
            onStopsChange={setSelectedStops}
          />
        </div>
        <div style={styles.flightListContainer}>
          {selectedTrip === "one-way" ? (
            <FlightListOneWay
              flights={sortedFlights.filter((f) => f.type === "departure")}
            />
          ) : (
            <FlightListRoundTrip flights={sortedFlights} />
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100vh",
    overflow: "hidden",
  },
  filterContainer: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    padding: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  flightListContainer: {
    marginTop: "160px",
    height: "calc(100vh - 120px)",
    overflowY: "auto" as const,
    padding: "1rem",
    backgroundColor: "#f9f9f9",
  },
};

export default FlightListPage;
