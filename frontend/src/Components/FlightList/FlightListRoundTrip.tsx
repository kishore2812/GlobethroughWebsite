import React from "react";

interface Flight {
  logo: string;
  id: string;
  flightNumber: string;
  price: number;
  duration: number;
  startTime: string;
  endTime: string;
  type: "departure" | "return";
  stops: number;
}

interface FlightListRoundTripProps {
  flights: Flight[];
}

const FlightListRoundTrip: React.FC<FlightListRoundTripProps> = ({
  flights,
}) => {
  const departureFlights = flights.filter(
    (flight) => flight.type === "departure"
  );
  const returnFlights = flights.filter((flight) => flight.type === "return");

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* Departure Flights */}
      <div style={{ flex: 1 }}>
        <h2>Departure Flights</h2>
        {departureFlights.map((flight) => (
          <div
            key={flight.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
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

      {/* Return Flights */}
      <div style={{ flex: 1 }}>
        <h2>Return Flights</h2>
        {returnFlights.map((flight) => (
          <div
            key={flight.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
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
    </div>
  );
};

export default FlightListRoundTrip;
