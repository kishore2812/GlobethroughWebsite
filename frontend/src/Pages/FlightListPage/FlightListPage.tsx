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
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  // Calculate total travelers by summing adults, children, and infants
  const totalTravelers = adults + children + infants;

  const sortedFlights = [...flightData].sort((a, b) => {
    if (selectedStops !== null) {
      if (a.stops === selectedStops && b.stops !== selectedStops) return -1;
      if (b.stops === selectedStops && a.stops !== selectedStops) return 1;
    }
    if (filter === "cheapest") return a.price - b.price;
    if (filter === "fastest") return a.duration - b.duration;
    return a.stops - b.stops;
  });

  // Function to reset filters
  const resetFilters = () => {
    setFilter("cheapest"); // Reset to default filter (cheapest)
    setSelectedStops(null); // Clear selected stops
  };
  const handleClick = () => {
    navigate("/homepage");
  };

  return (
    <div className="flightListPage-container">
      <Header /> {/* Render Header at the top */}
      {/* Section Below the Header for Airport Info */}
      <div className="flightListPage-infoContainer">
        <div className="flightListPage-airportInfo">
          <div className="flightListPage-fromAirport">
            <span className="flightListPage-iataCode">
              {fromAirport?.iataCode},
            </span>
            <span className="flightListPage-cityName">{fromAirport?.name}</span>
          </div>
          <div className="flightListPage-arrow">
            <FaArrowRight /> {/* Using FaArrowRight icon */}
          </div>
          <div className="flightListPage-toAirport">
            <span className="flightListPage-iataCode">
              {toAirport?.iataCode},
            </span>
            <span className="flightListPage-cityName">{toAirport?.name}</span>
          </div>
        </div>

        {/* Departure Date, Travelers, and Selected Class in a Single Row */}
        <div className="flightListPage-detailsRow">
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
          <div onClick={handleClick} style={{ cursor: "pointer" }}>
            <CiEdit size={18} />
          </div>
        </div>
      </div>
      {/* Main Content Section */}
      <div className="flightListPage-mainContent">
        {/* Filter Component on the Left */}
        <div className="flightListPage-filterContainer">
          <FlightFilter
            selectedFilter={filter}
            selectedStops={selectedStops}
            flightData={flightData}
            onFilterChange={setFilter}
            onStopsChange={setSelectedStops}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Flight List Component on the Right */}
        <div className="flightListPage-flightListContainer">
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
