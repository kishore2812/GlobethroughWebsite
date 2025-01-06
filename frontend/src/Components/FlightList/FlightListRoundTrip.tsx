import React from "react";
import { useNavigate } from "react-router-dom";
import { Flight } from "../../Pages/FlightListPage/flightdata";
import useFlightStore from "../../Stores/FlightStore";
import "./FlightListRoundTrip.scss";
import { IoAirplaneSharp } from "react-icons/io5";

interface FlightListRoundTripProps {
  flights: Flight[];
}

const FlightListRoundTrip: React.FC<FlightListRoundTripProps> = ({
  flights,
}) => {
  const navigate = useNavigate();
  const { fromAirport, toAirport, setSelectedDeparture, setSelectedReturn } =
    useFlightStore();
  const { selectedDeparture, selectedReturn } = useFlightStore();

  // Filter flights by type
  const departureFlights = flights.filter(
    (flight) => flight.type === "departure"
  );
  const returnFlights = flights.filter((flight) => flight.type === "return");

  // Find the cheapest and fastest flight IDs for departure
  const cheapestDepartureFlightId = departureFlights.reduce((prev, curr) =>
    curr.price < prev.price ? curr : prev
  ).id;

  const fastestDepartureFlightId = departureFlights.reduce((prev, curr) =>
    curr.duration < prev.duration ? curr : prev
  ).id;

  // Find the cheapest and fastest flight IDs for return
  const cheapestReturnFlightId = returnFlights.reduce((prev, curr) =>
    curr.price < prev.price ? curr : prev
  ).id;

  const fastestReturnFlightId = returnFlights.reduce((prev, curr) =>
    curr.duration < prev.duration ? curr : prev
  ).id;

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

  const renderFlightCard = (
    flight: Flight,
    isSelected: boolean,
    type: string
  ) => (
    <div
      className={`Flight_list_round_trip__flight-card ${
        isSelected ? "selected" : ""
      }`}
      onClick={() => {
        if (type === "departure") {
          setSelectedDeparture(flight); // Store in Zustand
        } else {
          setSelectedReturn(flight); // Store in Zustand
        }
      }}
    >
      {/* Labels */}
      {type === "departure" && flight.id === fastestDepartureFlightId && (
        <span className="Flight_list_round_trip__label fastest">Fastest</span>
      )}
      {type === "departure" && flight.id === cheapestDepartureFlightId && (
        <span className="Flight_list_round_trip__label cheapest">Cheapest</span>
      )}
      {type === "return" && flight.id === fastestReturnFlightId && (
        <span className="Flight_list_round_trip__label fastest">Fastest</span>
      )}
      {type === "return" && flight.id === cheapestReturnFlightId && (
        <span className="Flight_list_round_trip__label cheapest">Cheapest</span>
      )}

      {/* Row 1 */}
      <div className="Flight_list_round_trip__flight-row">
        <div className="Flight_list_round_trip__flight-logo">
          <img src={flight.logo} alt={flight.flightNumber} />
          <span className="Flight_list_round_trip__flightNumber">
            <p>{flight.flightNumber}</p>
          </span>
        </div>
        <div className="Flight_list_round_trip__flight-price">
          ₹{flight.price}
        </div>
      </div>

      {/* Row 2 */}
      <div className="Flight_list_round_trip__flight-row details">
        <div className="Flight_list_round_trip__time-location">
          <p>
            <span className="Flight_list_round_trip__time-uk">
              {new Date(flight.startTime).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>{" "}
            <span className="Flight_list_round_trip__time-us">
              (
              {new Date(flight.startTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              )
            </span>
          </p>

          <p>
            <span className="Flight_list_round_trip__Airportdetails">
              {fromAirport?.City}, {fromAirport?.IATA}
            </span>
          </p>
        </div>
        <div className="Flight_list_round_trip__duration-stops">
          <span className="Flight_list_round_trip__duration">
            <p>{flight.duration} hrs</p>
          </span>

          <div className="Flight_list_round_trip__lineWithIcon">
            <div className="Flight_list_round_trip__line"></div>
            <IoAirplaneSharp className="Flight_list_round_trip__airplaneIcon" />
            <div className="Flight_list_round_trip__line"></div>
          </div>
          <p>
            <span className="Flight_list_round_trip__duration">
              {flight.stops} {flight.stops === 1 ? "Stop" : "Stops"}
            </span>
          </p>
        </div>
        <div className="Flight_list_round_trip__time-location">
          <p>
            <span className="Flight_list_round_trip__time-uk">
              {new Date(flight.endTime).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>{" "}
            <span className="Flight_list_round_trip__time-us">
              (
              {new Date(flight.endTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              )
            </span>
          </p>
          <p>
            <span className="Flight_list_round_trip__Airportdetails">
              {toAirport?.City}, {toAirport?.IATA}
            </span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="Flight_list_round_trip">
        <div className="Flight_list_round_trip__flight-section">
          {departureFlights.map((flight) => (
            <React.Fragment key={flight.id}>
              {renderFlightCard(
                flight,
                selectedDeparture?.id === flight.id,
                "departure"
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="Flight_list_round_trip__flight-section">
          {returnFlights.map((flight) => (
            <React.Fragment key={flight.id}>
              {renderFlightCard(
                flight,
                selectedReturn?.id === flight.id,
                "return"
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom Modal */}
      <div className="Flight_list_round_trip__flight-bottom-modal-container">
        <div className="Flight_list_round_trip__flight-bottom-modal">
          <div>
            <span>
              Selected Departure:{" "}
              {selectedDeparture ? selectedDeparture.flightNumber : "None"}
            </span>
            <span>
              Selected Return:{" "}
              {selectedReturn ? selectedReturn.flightNumber : "None"}
            </span>
          </div>
          <button onClick={handleBookNow}>Book Now</button>
        </div>
        <div className="flightListOneWay__Extra"></div>
      </div>
    </div>
  );
};

export default FlightListRoundTrip;
