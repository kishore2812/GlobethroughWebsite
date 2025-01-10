import React from "react";
import useFlightStore from "../../Stores/FlightStore";
import { useNavigate } from "react-router-dom";
import "./TicketPrice.scss";

interface PriceDetailsProps {
  passengerDetailsRef: React.RefObject<HTMLDivElement>;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({ passengerDetailsRef }) => {
  const selectedTrip = useFlightStore((state) => state.selectedTrip);
  const selectedFlight = useFlightStore((state) => state.selectedFlight);
  const selectedDeparture = useFlightStore((state) => state.selectedDeparture);
  const selectedReturn = useFlightStore((state) => state.selectedReturn);
  const adults = useFlightStore((state) => state.adults);
  const children = useFlightStore((state) => state.children);
  const infants = useFlightStore((state) => state.infants);
  const passengerDetails = useFlightStore((state) => state.passengers);

  const navigate = useNavigate();

  const baseFare =
    selectedTrip === "one-way"
      ? selectedFlight?.price || 0
      : (selectedDeparture?.price || 0) + (selectedReturn?.price || 0);

  const totalBasePrice =
    adults * baseFare + children * baseFare + infants * baseFare;

  const tax = (totalBasePrice * 0.2).toFixed(2);

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
      // Scroll to the PassengerDetails section and position it around 50% of the viewport height
      if (passengerDetailsRef.current) {
        const element = passengerDetailsRef.current;
        const elementRect = element.getBoundingClientRect();
        const elementTop = elementRect.top + window.pageYOffset;
        const offset = window.innerHeight / 1 - elementRect.height / 1;

        // Scroll the page to the desired position
        window.scrollTo({
          top: elementTop - offset,
          behavior: "smooth",
        });
      }
    }
  };
  return (
    <div>
      <div className="price-details">
        <div className="price-details__travelers">
          <h4>Price Breakdown</h4>
          {adults > 0 && (
            <p>
              {adults} Adult{adults > 1 ? "s" : ""}
            </p>
          )}
          {children > 0 && (
            <p>
              {children} Child{children > 1 ? "ren" : ""}
            </p>
          )}
          {infants > 0 && (
            <p>
              {infants} Infant{infants > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="price-details__base">
          <div className="price-details__label">Base fare</div>
          <div className="price-details__value">₹{baseFare.toFixed(2)}</div>
        </div>

        <div className="price-details__breakdownContainer">
          {adults > 0 && (
            <div className="price-details__breakdown">
              <div className="price-details__label">₹{adults * baseFare}</div>
              <div className="price-details__value">
                Adult{adults > 1 ? "s" : ""} ({adults} x {baseFare})
              </div>
            </div>
          )}
          {children > 0 && (
            <div className="price-details__breakdown">
              <div className="price-details__label">₹{children * baseFare}</div>
              <div className="price-details__value">
                Child{children > 1 ? "ren" : ""} ({children} x {baseFare})
              </div>
            </div>
          )}
          {infants > 0 && (
            <div className="price-details__breakdown">
              <div className="price-details__label">₹{infants * baseFare}</div>
              <div className="price-details__value">
                Infant{infants > 1 ? "s" : ""} ({infants} x {baseFare})
              </div>
            </div>
          )}
        </div>

        <div className="price-details__tax">
          <div className="price-details__label">Taxes and Surcharges</div>
          <div className="price-details__value">₹{tax}</div>
        </div>

        <div className="price-details__total">
          <div className="price-details__label">Grand Total</div>
          <div className="price-details__value">
            ₹{(totalBasePrice + parseFloat(tax)).toFixed(2)}
          </div>
        </div>
      </div>

      <button className="price-details__proceed-button" onClick={handleProceed}>
        Proceed
      </button>
    </div>
  );
};

export default PriceDetails;
