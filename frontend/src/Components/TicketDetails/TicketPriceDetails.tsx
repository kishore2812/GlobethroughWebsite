import React from "react";
import useFlightStore from "../../Stores/FlightStore";

const PriceDetails: React.FC = () => {
  const selectedTrip = useFlightStore((state) => state.selectedTrip); // Fetch trip type
  const selectedFlight = useFlightStore((state) => state.selectedFlight); // One-way flight
  const selectedDeparture = useFlightStore((state) => state.selectedDeparture); // Round-trip departure
  const selectedReturn = useFlightStore((state) => state.selectedReturn); // Round-trip return

  // Calculate total price based on the trip type
  const totalPrice =
    selectedTrip === "one-way"
      ? selectedFlight?.price || 0
      : (selectedDeparture?.price || 0) + (selectedReturn?.price || 0);

  return (
    <div>
      <h2>Price Details</h2>
      <p>Total Price: ₹{totalPrice}</p>
    </div>
  );
};

export default PriceDetails;
