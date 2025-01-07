import React from "react";
import useFlightStore from "../../Stores/FlightStore";
import TicketDetailsOneWay from "../../Components/TicketDetails/OneWayTicketDetails";
import TicketDetailsRoundTrip from "../../Components/TicketDetails/RoundTripTicketDetails";
import PriceDetails from "../../Components/TicketDetails/TicketPriceDetails";
import "./TicketDetailPage.scss"; // SCSS for styling
import Header from "../../Components/Header/Header";

const TicketDetailPage: React.FC = () => {
  // Fetch flight details from Zustand store
  const selectedTrip = useFlightStore((state) => state.selectedTrip);
  const selectedFlight = useFlightStore((state) => state.selectedFlight); // One-way flight
  const selectedDeparture = useFlightStore((state) => state.selectedDeparture); // Departure for round-trip
  const selectedReturn = useFlightStore((state) => state.selectedReturn); // Return for round-trip

  // Validate data availability
  if (
    (selectedTrip === "one-way" && !selectedFlight) ||
    (selectedTrip === "round-trip" && (!selectedDeparture || !selectedReturn))
  ) {
    return <p>No flight details available!</p>;
  }

  return (
    <div className="ticket-detail-page">
      {/* Background */}
      <div className="ticket-detail-page__background"></div>
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="ticket-detail-page__content">
        {/* Ticket Details */}
        <div className="ticket-detail-page__ticket-details">
          {selectedTrip === "one-way" && selectedFlight && (
            <TicketDetailsOneWay />
          )}
          {selectedTrip === "round-trip" &&
            selectedDeparture &&
            selectedReturn && <TicketDetailsRoundTrip />}
        </div>

        {/* Price Details */}
        <div className="ticket-detail-page__price-details">
          <PriceDetails />
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
