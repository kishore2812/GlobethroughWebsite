import React from "react";
import useFlightStore from "../../Stores/FlightStore"; // Import Zustand store

const TicketDetailPage: React.FC = () => {
  // Retrieve flight details directly from Zustand store
  const selectedFlight = useFlightStore((state) => state.selectedFlight); // For one-way
  const selectedDeparture = useFlightStore((state) => state.selectedDeparture); // For round-trip
  const selectedReturn = useFlightStore((state) => state.selectedReturn); // For round-trip
  const selectedTrip =
    selectedDeparture && selectedReturn ? "round-trip" : "one-way"; // Determine trip type

  // If no flight data is available, show a message
  if (
    (selectedTrip === "one-way" && !selectedFlight) ||
    (selectedTrip === "round-trip" && (!selectedDeparture || !selectedReturn))
  ) {
    return <p>No flight details available!</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Ticket Details</h1>
      <h2>
        Trip Type: {selectedTrip === "one-way" ? "One Way" : "Round Trip"}
      </h2>

      {selectedTrip === "one-way" && selectedFlight && (
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
            Start Time:{" "}
            {new Date(selectedFlight.startTime).toLocaleTimeString()}
          </p>
          <p>
            End Time: {new Date(selectedFlight.endTime).toLocaleTimeString()}
          </p>
          <p>Stops: {selectedFlight.stops}</p>
        </div>
      )}

      {selectedTrip === "round-trip" && selectedDeparture && selectedReturn && (
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
              End Time:{" "}
              {new Date(selectedDeparture.endTime).toLocaleTimeString()}
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
              Start Time:{" "}
              {new Date(selectedReturn.startTime).toLocaleTimeString()}
            </p>
            <p>
              End Time: {new Date(selectedReturn.endTime).toLocaleTimeString()}
            </p>
            <p>Stops: {selectedReturn.stops}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketDetailPage;
