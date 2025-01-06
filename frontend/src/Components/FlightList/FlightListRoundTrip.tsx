import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flight } from "../../Pages/FlightListPage/flightdata";

interface FlightListRoundTripProps {
  flights: Flight[];
}

const FlightListRoundTrip: React.FC<FlightListRoundTripProps> = ({
  flights,
}) => {
  const navigate = useNavigate();
  const [selectedDeparture, setSelectedDeparture] = useState<Flight | null>(
    null
  );
  const [selectedReturn, setSelectedReturn] = useState<Flight | null>(null);

  const departureFlights = flights.filter(
    (flight) => flight.type === "departure"
  );
  const returnFlights = flights.filter((flight) => flight.type === "return");

  const handleBookNow = () => {
    if (selectedDeparture && selectedReturn) {
      navigate("/ticket-detail", {
        state: {
          departureFlight: selectedDeparture,
          returnFlight: selectedReturn,
        },
      });
    } else {
      alert("Please select both departure and return flights.");
    }
  };

  return (
    <div style={{ position: "relative", paddingBottom: "5rem" }}>
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Departure Flights */}
        <div style={{ flex: 1 }}>
          <h2>Departure Flights</h2>
          {departureFlights.map((flight) => (
            <div
              key={flight.id}
              onClick={() => setSelectedDeparture(flight)}
              style={{
                border: `1px solid ${
                  selectedDeparture?.id === flight.id ? "#4CAF50" : "#ccc"
                }`,
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                cursor: "pointer",
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
              <p>
                Start Time: {new Date(flight.startTime).toLocaleTimeString()}
              </p>
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
              onClick={() => setSelectedReturn(flight)}
              style={{
                border: `1px solid ${
                  selectedReturn?.id === flight.id ? "#4CAF50" : "#ccc"
                }`,
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                cursor: "pointer",
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
              <p>
                Start Time: {new Date(flight.startTime).toLocaleTimeString()}
              </p>
              <p>End Time: {new Date(flight.endTime).toLocaleTimeString()}</p>
              <p>Stops: {flight.stops}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          bottom: "0px",
          left: "100px",
          right: "100px",
          backgroundColor: "#fff",
          padding: "0px 20px",
          borderTop: "1px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
          borderRadius: "10px",
        }}
      >
        <div>
          <p>
            Selected Departure:{" "}
            {selectedDeparture ? selectedDeparture.flightNumber : "None"}
          </p>
          <p>
            Selected Return:{" "}
            {selectedReturn ? selectedReturn.flightNumber : "None"}
          </p>
        </div>
        <button
          onClick={handleBookNow}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default FlightListRoundTrip;
