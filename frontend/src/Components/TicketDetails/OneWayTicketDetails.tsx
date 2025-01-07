import React from "react";
import useFlightStore from "../../Stores/FlightStore";

const TicketDetailsOneWay: React.FC = () => {
  const selectedFlight = useFlightStore((state) => state.selectedFlight);

  if (!selectedFlight) {
    return <p>No flight details available for the one-way trip.</p>;
  }

  return (
    <div>
      <h2>Flight Details</h2>
      <img
        src={selectedFlight.logo}
        alt={selectedFlight.flightNumber}
        style={{ width: "100px" }}
      />
      <p>Flight: {selectedFlight.flightNumber}</p>
      <p>Price: ₹{selectedFlight.price}</p>
      <p>Duration: {selectedFlight.duration} hrs</p>
      <p>
        Start Time: {new Date(selectedFlight.startTime).toLocaleTimeString()}
      </p>
      <p>End Time: {new Date(selectedFlight.endTime).toLocaleTimeString()}</p>
      <p>Stops: {selectedFlight.stops}</p>
    </div>
  );
};

export default TicketDetailsOneWay;
