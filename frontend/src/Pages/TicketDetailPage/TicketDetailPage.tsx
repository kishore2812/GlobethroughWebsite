import React, { useRef } from "react";
import useFlightStore from "../../Stores/FlightStore";
import TicketDetailsOneWay from "../../Components/TicketDetails/OneWayTicketDetails";
import TicketDetailsRoundTrip from "../../Components/TicketDetails/RoundTripTicketDetails";
import PriceDetails from "../../Components/TicketDetails/TicketPriceDetails";
import "./TicketDetailPage.scss";
import Header from "../../Components/Header/Header";
import PassengerDetails from "../../Components/PassengerDetails/PassengerDetails";
import CancellationDateChangePolicy from "../../Components/CancellationAndDateChange.tsx/CancellationAndDateChange";
import { useNavigate } from "react-router-dom";

const TicketDetailPage: React.FC = () => {
  const passengerDetailsRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const passengerDetails = useFlightStore((state) => state.passengers);

  const arePassengerDetailsFilled = () => {
    return passengerDetails.every(
      (passenger) =>
        passenger.type.trim() !== "" &&
        passenger.firstName.trim() !== "" &&
        passenger.lastName.trim() !== "" &&
        passenger.countryCode.trim() !== "" &&
        passenger.gender.trim() !== "" &&
        passenger.phoneNumber.trim() !== "" &&
        passenger.dob.trim() !== "" &&
        passenger.email.trim() !== ""
    );
  };

  const handleProceed = () => {
    if (arePassengerDetailsFilled()) {
      navigate("/seats-meals-luggage");
    } else {
      if (passengerDetailsRef.current) {
        const element = passengerDetailsRef.current;
        const elementRect = element.getBoundingClientRect();
        const elementTop = elementRect.top + window.pageYOffset;
        const offset = window.innerHeight / 1 - elementRect.height / 1;

        window.scrollTo({
          top: elementTop - offset,
          behavior: "smooth",
        });
      }
    }
  };

  const selectedTrip = useFlightStore((state) => state.selectedTrip);
  const selectedFlight = useFlightStore((state) => state.selectedFlight);
  const selectedDeparture = useFlightStore((state) => state.selectedDeparture);
  const selectedReturn = useFlightStore((state) => state.selectedReturn);

  if (
    (selectedTrip === "one-way" && !selectedFlight) ||
    (selectedTrip === "round-trip" && (!selectedDeparture || !selectedReturn))
  ) {
    return <p>No flight details available!</p>;
  }

  return (
    <div className="ticket-detail-page">
      <div className="ticket-detail-page__background"></div>
      <Header />
      <div className="ticket-detail-page__content">
        <div className="ticket-detail-page__left-section">
          <div className="ticket-detail-page__ticket-details">
            {selectedTrip === "one-way" && selectedFlight && (
              <TicketDetailsOneWay />
            )}
            {selectedTrip === "round-trip" &&
              selectedDeparture &&
              selectedReturn && <TicketDetailsRoundTrip />}
          </div>
          <div
            ref={passengerDetailsRef}
            className="ticket-detail-page__passenger-details"
          >
            <CancellationDateChangePolicy />
            <PassengerDetails />
          </div>
        </div>
        <div className="ticket-detail-page__price-details">
          <PriceDetails />
          <button
            className="price-details__proceed-button"
            onClick={handleProceed}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
