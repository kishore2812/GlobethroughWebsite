import React from "react";
import { useLocation } from "react-router-dom";
import { Flight } from "../../Pages/FlightListPage/flightdata";
import useFlightStore from "../../Stores/FlightStore"; // Import Zustand store

interface TicketDetailState {
  flight?: Flight; // For one-way
  departureFlight?: Flight; // For roundtrip
  returnFlight?: Flight; // For roundtrip
}

const TicketDetailPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as TicketDetailState;

  const tripType = useFlightStore((state) => state.selectedTrip);

  if (
    !state ||
    (!state.flight && (!state.departureFlight || !state.returnFlight))
  ) {
    return <p>No flight details available!</p>;
  }

  const { flight, departureFlight, returnFlight } = state;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Ticket Details</h1>
      <h2>Trip Type: {tripType === "one-way" ? "One Way" : "Round Trip"}</h2>

      {tripType === "one-way" && flight && (
        <div>
          <h2>Flight Details</h2>
          <img
            src={flight.logo}
            alt={flight.flightNumber}
            style={{ width: "100px" }}
          />
          <p>Flight: {flight.flightNumber}</p>
          <p>Price: ₹{flight.price}</p>
          <p>Duration: {flight.duration} hrs</p>
          <p>Start Time: {new Date(flight.startTime).toLocaleTimeString()}</p>
          <p>End Time: {new Date(flight.endTime).toLocaleTimeString()}</p>
          <p>Stops: {flight.stops}</p>
        </div>
      )}

      {tripType === "round-trip" && departureFlight && returnFlight && (
        <>
          <div>
            <h2>Departure Flight Details</h2>
            <img
              src={departureFlight.logo}
              alt={departureFlight.flightNumber}
              style={{ width: "100px" }}
            />
            <p>Flight: {departureFlight.flightNumber}</p>
            <p>Price: ₹{departureFlight.price}</p>
            <p>Duration: {departureFlight.duration} hrs</p>
            <p>
              Start Time:{" "}
              {new Date(departureFlight.startTime).toLocaleTimeString()}
            </p>
            <p>
              End Time: {new Date(departureFlight.endTime).toLocaleTimeString()}
            </p>
            <p>Stops: {departureFlight.stops}</p>
          </div>
          <div>
            <h2>Return Flight Details</h2>
            <img
              src={returnFlight.logo}
              alt={returnFlight.flightNumber}
              style={{ width: "100px" }}
            />
            <p>Flight: {returnFlight.flightNumber}</p>
            <p>Price: ₹{returnFlight.price}</p>
            <p>Duration: {returnFlight.duration} hrs</p>
            <p>
              Start Time:{" "}
              {new Date(returnFlight.startTime).toLocaleTimeString()}
            </p>
            <p>
              End Time: {new Date(returnFlight.endTime).toLocaleTimeString()}
            </p>
            <p>Stops: {returnFlight.stops}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketDetailPage;
