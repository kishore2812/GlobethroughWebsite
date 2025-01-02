import React, { useState } from "react";
import FlightFilter from "../../Components/FlightFilter/FlightFilter";
import FlightListOneWay from "../../Components/FlightList/FlightListOneWay";
import FlightListRoundTrip from "../../Components/FlightList/FlightListRoundTrip";
import useFlightStore from "../../Stores/FlightStore";
import AirIndia from "../../assets/images/AirIndia.png";

const flightData = [
  {
    id: "1",
    flightNumber: "AB123",
    price: 30000,
    duration: 1,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "departure",
    stops: 0,
    logo: AirIndia,
  },
  {
    id: "2",
    flightNumber: "AB456",
    price: 15000,
    duration: 2,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "departure",
    stops: 2,
    logo: AirIndia,
  },
  {
    id: "3",
    flightNumber: "AB123",
    price: 25000,
    duration: 1,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "return",
    stops: 0,
    logo: AirIndia,
  },
  {
    id: "4",
    flightNumber: "AB123",
    price: 10000,
    duration: 3,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "departure",
    stops: 1,
    logo: AirIndia,
  },
  {
    id: "5",
    flightNumber: "AB123",
    price: 5000,
    duration: 5,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "return",
    stops: 2,
    logo: AirIndia,
  },
  {
    id: "6",
    flightNumber: "AB123",
    price: 12000,
    duration: 3,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "return",
    stops: 1,
    logo: AirIndia,
  },
  {
    id: "7",
    flightNumber: "AB124",
    price: 21000,
    duration: 2.5,
    startTime: "2024-12-15T18:00:00",
    endTime: "2024-12-15T20:30:00",
    type: "return",
    stops: 0,
    logo: AirIndia,
  },
] as const;

const FlightListPage: React.FC = () => {
  const [filter, setFilter] = useState<"cheapest" | "fastest">("cheapest");
  const [selectedStops, setSelectedStops] = useState<number | null>(null); // Null means no stop filter
  const { selectedTrip } = useFlightStore();

  // Count flights for each stop type
  const flightCounts = {
    nonStops: flightData.filter((flight) => flight.stops === 0).length,
    oneStop: flightData.filter((flight) => flight.stops === 1).length,
    moreThanOneStop: flightData.filter((flight) => flight.stops > 1).length,
  };

  // Sorting logic
  const sortedFlights = [...flightData].sort((a, b) => {
    // Prioritize based on stops filter
    if (selectedStops !== null) {
      if (a.stops === selectedStops && b.stops !== selectedStops) return -1;
      if (b.stops === selectedStops && a.stops !== selectedStops) return 1;
    }

    // Then sort by chosen filter (cheapest or fastest)
    if (filter === "cheapest") return a.price - b.price;
    if (filter === "fastest") return a.duration - b.duration;

    // Finally, sort by stops in ascending order
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
