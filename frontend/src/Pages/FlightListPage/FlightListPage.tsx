import React, { useState } from "react";
import { flightData } from "./flightdata"; // Import the data and interface
import FlightFilter from "../../Components/FlightFilter/FlightFilter";
import FlightListOneWay from "../../Components/FlightList/FlightListOneWay";
import FlightListRoundTrip from "../../Components/FlightList/FlightListRoundTrip";
import useFlightStore from "../../Stores/FlightStore";
import Header from "../../Components/Header/Header"; // Import the Header component
import { FaArrowRight } from "react-icons/fa"; // Import FaArrowRight
import "./FlightListPage.scss"; // Import the SCSS file for styles
import { CiEdit } from "react-icons/ci";

const FlightListPage: React.FC = () => {
  const [filter, setFilter] = useState<"cheapest" | "fastest">("cheapest");
  const [selectedStops, setSelectedStops] = useState<number | null>(null);
  const { selectedTrip } = useFlightStore();

  // Get data from Zustand store
  const {
    fromAirport,
    toAirport,
    departureDate,
    infants,
    children,
    adults,
    selectedClass,
  } = useFlightStore();

  // Calculate total travelers by summing adults, children, and infants
  const totalTravelers = adults + children + infants;

  // Flight counts for the filter component
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
    <div className="container">
      <Header /> {/* Render Header at the top */}
      {/* Section Below the Header for Airport Info */}
      <div className="infoContainer">
        <div className="airportInfo">
          <div className="fromAirport">
            <span className="iataCode">
              {fromAirport?.IATA}, {}
            </span>
            <span className="cityName">{fromAirport?.City}</span>
          </div>
          <div className="arrow">
            <FaArrowRight /> {/* Using FaArrowRight icon */}
          </div>
          <div className="toAirport">
            <span className="iataCode">
              {toAirport?.IATA}, {}
            </span>
            <span className="cityName">{toAirport?.City}</span>
          </div>
        </div>

        {/* Departure Date, Travelers, and Selected Class in a Single Row */}
        <div className="detailsRow">
          <span>
            {departureDate
              ? new Date(departureDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}{" "}
            .{/* Default text if departureDate is null */}
          </span>
          <span>{totalTravelers} Travelers .</span>
          <span>{selectedClass}</span>
          <CiEdit size={18} />
        </div>
      </div>
      {/* Main Content Section */}
      <div className="mainContent">
        {/* Filter Component on the Left */}
        <div className="filterContainer">
          <FlightFilter
            selectedFilter={filter}
            selectedStops={selectedStops}
            flightCounts={flightCounts}
            onFilterChange={setFilter}
            onStopsChange={setSelectedStops}
          />
        </div>

        {/* Flight List Component on the Right */}
        <div className="flightListContainer">
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

export default FlightListPage;
