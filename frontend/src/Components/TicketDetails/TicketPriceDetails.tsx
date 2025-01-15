import React from "react";
import useFlightStore from "../../Stores/FlightStore";
import "./TicketPrice.scss";

const PriceDetails: React.FC = () => {
  const selectedTrip = useFlightStore((state) => state.selectedTrip);
  const selectedFlight = useFlightStore((state) => state.selectedFlight);
  const selectedDeparture = useFlightStore((state) => state.selectedDeparture);
  const selectedReturn = useFlightStore((state) => state.selectedReturn);
  const adults = useFlightStore((state) => state.adults);
  const children = useFlightStore((state) => state.children);
  const infants = useFlightStore((state) => state.infants);

  const baseFare =
    selectedTrip === "one-way"
      ? selectedFlight?.price || 0
      : (selectedDeparture?.price || 0) + (selectedReturn?.price || 0);

  const totalBasePrice =
    adults * baseFare + children * baseFare + infants * baseFare;

  const tax = (totalBasePrice * 0.2).toFixed(2);

  return (
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
  );
};

export default PriceDetails;
