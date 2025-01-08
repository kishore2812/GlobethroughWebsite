import React from "react";
import useFlightStore from "../../Stores/FlightStore";
import "./TicketPrice.scss";

const PriceDetails: React.FC = () => {
  const selectedTrip = useFlightStore((state) => state.selectedTrip); // Fetch trip type (one-way/round-trip)
  const selectedFlight = useFlightStore((state) => state.selectedFlight); // One-way flight price
  const selectedDeparture = useFlightStore((state) => state.selectedDeparture); // Round-trip departure flight price
  const selectedReturn = useFlightStore((state) => state.selectedReturn); // Round-trip return flight price
  const adults = useFlightStore((state) => state.adults); // Fetch number of adults
  const children = useFlightStore((state) => state.children); // Fetch number of children
  const infants = useFlightStore((state) => state.infants); // Fetch number of infants

  // Calculate base fare (price for one-way or round-trip)
  const baseFare =
    selectedTrip === "one-way"
      ? selectedFlight?.price || 0
      : (selectedDeparture?.price || 0) + (selectedReturn?.price || 0);

  // Calculate the total price for all travelers (adults, children, and infants)
  const totalBasePrice =
    adults * baseFare + children * baseFare + infants * baseFare;

  // Calculate tax (20% of the total price)
  const tax = (totalBasePrice * 0.2).toFixed(2);

  return (
    <div className="price-details">
      {/* Row 1: Travelers */}
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

      {/* Row 2: Base Price */}
      <div className="price-details__base">
        <div className="price-details__label">Base fare</div>
        <div className="price-details__value">₹{baseFare.toFixed(2)}</div>
      </div>

      {/* Row 3: Price Breakdown for Travelers */}
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

      {/* Row 4: Tax */}
      <div className="price-details__tax">
        <div className="price-details__label">Taxes and Surcharges</div>
        <div className="price-details__value">₹{tax}</div>
      </div>

      {/* Row 5: Total */}
      <div className="price-details__total">
        <div className="price-details__label">Grand Total</div>
        <div className="price-details__value">
          ₹ {(totalBasePrice + parseFloat(tax)).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;
