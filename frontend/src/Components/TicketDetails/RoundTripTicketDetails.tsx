import React from "react";
import useFlightStore from "../../Stores/FlightStore";

const TicketDetailsRoundTrip: React.FC = () => {
  const selectedDeparture = useFlightStore((state) => state.selectedDeparture);
  const selectedReturn = useFlightStore((state) => state.selectedReturn);

  if (!selectedDeparture || !selectedReturn) {
    return <p>No flight details available for the round-trip.</p>;
  }

  return (
    <>
      <div>
        <h2>Departure Flight Details</h2>
        <img
          src={selectedDeparture.logo}
          alt={selectedDeparture.flightNumber}
          style={{ width: "100px" }}
        />
        <p>Flight: {selectedDeparture.flightNumber}</p>
        <p>Price: ₹{selectedDeparture.price}</p>
        <p>Duration: {selectedDeparture.duration} hrs</p>
        <p>
          Start Time:{" "}
          {new Date(selectedDeparture.startTime).toLocaleTimeString()}
        </p>
        <p>
          End Time: {new Date(selectedDeparture.endTime).toLocaleTimeString()}
        </p>
        <p>Stops: {selectedDeparture.stops}</p>
      </div>
      <div>
        <h2>Return Flight Details</h2>
        <img
          src={selectedReturn.logo}
          alt={selectedReturn.flightNumber}
          style={{ width: "100px" }}
        />
        <p>Flight: {selectedReturn.flightNumber}</p>
        <p>Price: ₹{selectedReturn.price}</p>
        <p>Duration: {selectedReturn.duration} hrs</p>
        <p>
          Start Time: {new Date(selectedReturn.startTime).toLocaleTimeString()}
        </p>
        <p>End Time: {new Date(selectedReturn.endTime).toLocaleTimeString()}</p>
        <p>Stops: {selectedReturn.stops}</p>
      </div>
    </>
  );
};

export default TicketDetailsRoundTrip;
