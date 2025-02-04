import React from "react";
import { flightData } from "./flightdata"; // Import the data and interface
import FlightFilter from "../../Components/FlightFilter/FlightFilter";
import FlightListOneWay from "../../Components/FlightList/FlightListOneWay";
import FlightListRoundTrip from "../../Components/FlightList/FlightListRoundTrip";
import useFlightStore from "../../Stores/FlightStore";
import Header from "../../Components/Header/Header"; // Import the Header component
import { FaArrowRight } from "react-icons/fa"; // Import FaArrowRight
import { CiEdit } from "react-icons/ci"; // Import CiEdit for edit button
import { useNavigate } from "react-router-dom";
import { useFilterStore } from "../../Stores/FilterStore"; // Import useFilterStore
import "./FlightListPage.scss"; // Import the SCSS file for styles

const FlightListPage: React.FC = () => {
  // Use Zustand to get the selected filter and stops
  const {
    selectedFilter,
    selectedStops,
    setSelectedFilter,
    setSelectedStops,
    resetFilters,
  } = useFilterStore();
  const {
    selectedTrip,
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

  // Sort flights based on selected filter
  const sortedFlights = [...flightData].sort((a, b) => {
    if (selectedStops !== null) {
      if (a.stops === selectedStops && b.stops !== selectedStops) return -1;
      if (b.stops === selectedStops && a.stops !== selectedStops) return 1;
    }
    if (selectedFilter === "cheapest") return a.price - b.price;
    if (selectedFilter === "fastest") return a.duration - b.duration;
    return a.stops - b.stops;
  });

  const handleClick = () => {
    navigate("/homepage");
  };

  return (
    <div className="flightListPage-container">
      <Header /> {/* Render Header at the top */}
      <div className="flightListPage-infoContainer">
        <div className="flightListPage-airportInfo">
          <div className="flightListPage-fromAirport">
            <span className="flightListPage-iataCode">
              {fromAirport?.iataCode},{" "}
            </span>
            <span className="flightListPage-cityName">
              {fromAirport?.address.cityName}
            </span>
          </div>
          <div className="flightListPage-arrow">
            <FaArrowRight />
          </div>
          <div className="flightListPage-toAirport">
            <span className="flightListPage-iataCode">
              {toAirport?.iataCode},{" "}
            </span>
            <span className="flightListPage-cityName">
              {toAirport?.address.cityName}
            </span>
          </div>
        </div>

        <div className="flightListPage-detailsRow">
          <span>
            {departureDate
              ? new Date(departureDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
            .
          </span>
          <span>{totalTravelers} Travelers .</span>
          <span>{selectedClass}</span>
          <div onClick={handleClick} style={{ cursor: "pointer" }}>
            <CiEdit size={18} />
          </div>
        </div>
      </div>
      <div className="flightListPage-mainContent">
        <div className="flightListPage-filterContainer">
          <FlightFilter
            selectedFilter={selectedFilter} // Pass selectedFilter from Zustand
            selectedStops={selectedStops} // Pass selectedStops from Zustand
            onFilterChange={setSelectedFilter} // Update filter in Zustand
            onStopsChange={setSelectedStops} // Update stops in Zustand
            onResetFilters={resetFilters} // Reset filters via Zustand
          />
        </div>

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
