import React from "react";
import { useNavigate } from "react-router-dom";
import { Flight } from "../../Pages/FlightListPage/flightdata";
import useFlightStore from "../../Stores/FlightStore"; // Import your Zustand store
import { IoAirplaneSharp } from "react-icons/io5";
import "./FlightListOneWay.scss";

interface FlightListOneWayProps {
  flights: Flight[];
}

const FlightListOneWay: React.FC<FlightListOneWayProps> = ({ flights }) => {
  const navigate = useNavigate();
  const { fromAirport, toAirport } = useFlightStore();

  // Select flight from Zustand store
  const { setSelectedFlight } = useFlightStore();

  // Find the cheapest and fastest flight
  const cheapestFlight = flights.reduce((prev, curr) =>
    curr.price < prev.price ? curr : prev
  );

  const fastestFlight = flights.reduce((prev, curr) =>
    curr.duration < prev.duration ? curr : prev
  );

  const handleBookNow = (flight: Flight) => {
    // Save the selected flight to Zustand
    setSelectedFlight(flight);
    navigate("/ticket-detail", { state: { flight } });
  };

  const formatTime = (time: string | number) => {
    const date = new Date(time);
    const options24Hour: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const options12Hour: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedTime24 = date.toLocaleTimeString([], options24Hour);
    const formattedTime12 = date.toLocaleTimeString([], options12Hour);

    return {
      time24: formattedTime24,
      time12: formattedTime12,
    };
  };

  return (
    <div className="flightListOneWay">
      {flights.map((flight) => (
        <div
          className={`flightListOneWay__card ${
            flight.id === cheapestFlight.id ? "flightListOneWay__cheapest" : ""
          } ${
            flight.id === fastestFlight.id ? "flightListOneWay__fastest" : ""
          }`}
          key={flight.id}
        >
          {/* Row 1 */}
          <div className="flightListOneWay__header">
            <img
              src={flight.logo}
              alt={flight.flightNumber}
              className="flightListOneWay__logo"
            />
            <div className="flightListOneWay__flightNumberContainer">
              <div className="flightListOneWay__flightNumber">
                {flight.flightNumber}
              </div>
            </div>
            {(flight.id === cheapestFlight.id ||
              flight.id === fastestFlight.id) && (
              <div className="flightListOneWay__tag">
                {flight.id === cheapestFlight.id && "Cheapest"}
                {flight.id === fastestFlight.id && "Fastest"}
              </div>
            )}
          </div>

          {/* Row 2 */}
          <div className="flightListOneWay__row">
            <div className="flightListOneWay__column">
              <div className="flightListOneWay__time">
                <span className="time24Hour">
                  {formatTime(flight.startTime).time24}
                </span>
                <span className="time12Hour">
                  ({formatTime(flight.startTime).time12})
                </span>
              </div>

              <div className="flightListOneWay__location">
                {fromAirport?.City}, {fromAirport?.IATA}
              </div>
            </div>
            <div className="flightListOneWay__column">
              <div className="flightListOneWay__duration">
                {flight.duration} hrs
              </div>
              <div className="flightListOneWay__lineWithIcon">
                <div className="flightListOneWay__line"></div>
                <IoAirplaneSharp className="flightListOneWay__airplaneIcon" />
                <div className="flightListOneWay__line"></div>
              </div>
              <div className="flightListOneWay__stops">
                {flight.stops} Stops
              </div>
            </div>
            <div className="flightListOneWay__column">
              <div className="flightListOneWay__time">
                <span className="time24Hour">
                  {formatTime(flight.endTime).time24}
                </span>
                <span className="time12Hour">
                  ({formatTime(flight.endTime).time12})
                </span>
              </div>

              <div className="flightListOneWay__location">
                {toAirport?.City}, {toAirport?.IATA}
              </div>
            </div>
            <div className="flightListOneWay__column">
              <div className="flightListOneWay__price">₹{flight.price}</div>
              <button
                className="flightListOneWay__bookNow"
                onClick={() => handleBookNow(flight)}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="flightListOneWay__Extra"></div>
    </div>
  );
};

export default FlightListOneWay;
