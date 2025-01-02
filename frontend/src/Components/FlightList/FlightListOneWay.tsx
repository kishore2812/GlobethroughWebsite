import React from "react";
import { Flight } from "../../Pages/FlightListPage/flightdata";

interface FlightListOneWayProps {
  flights: Flight[];
}

const FlightListOneWay: React.FC<FlightListOneWayProps> = ({ flights }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {flights.map((flight) => (
        <div
          key={flight.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <img
            src={flight.logo}
            alt={flight.flightNumber}
            style={{ width: "50px", marginRight: "1rem" }}
          />
          <h3>Flight: {flight.flightNumber}</h3>
          <p>Price: ₹{flight.price}</p>
          <p>Duration: {flight.duration} hrs</p>
          <p>Start Time: {new Date(flight.startTime).toLocaleTimeString()}</p>
          <p>End Time: {new Date(flight.endTime).toLocaleTimeString()}</p>
          <p>Stops: {flight.stops}</p>
        </div>
      ))}
    </div>
  );
};

export default FlightListOneWay;
