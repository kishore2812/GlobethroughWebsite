import React from "react";
import useFlightStore from "../../Stores/FlightStore";
import "./OneWayTicketDetails.scss";

const TicketDetailsOneWay: React.FC = () => {
  const {
    departureDate,
    fromAirport,
    toAirport,
    selectedFlight,
    selectedClass,
  } = useFlightStore();

  const formatTime = (time?: string | number) => {
    if (!time) {
      return { hours24: "--:--", hours12: "--:--" }; // Fallback for undefined times
    }
    const date = new Date(time);
    const hours24 = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const hours12 = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { hours24, hours12 };
  };

  const startTime = formatTime(selectedFlight?.startTime);
  const endTime = formatTime(selectedFlight?.endTime);

  return (
    <div className="OneWayTicketDetails__flight-ticket-card">
      {/* Row 1 */}
      <div className="OneWayTicketDetails__row row-1">
        <div className="OneWayTicketDetails__flight-logo">
          <img
            src={selectedFlight?.logo}
            alt={selectedFlight?.flightNumber}
            style={{ width: "80px" }}
          />
          <p>{selectedFlight?.flightNumber}</p>
        </div>
        <div className="OneWayTicketDetails__selected-class">
          <p>{selectedClass}</p>
        </div>
      </div>

      {/* Row 2 */}
      <div className="OneWayTicketDetails__row row-2">
        {/* Column 1 */}
        <div className="OneWayTicketDetails__column">
          <p>
            Start: {startTime.hours24} / {startTime.hours12}
          </p>
          <p>
            {fromAirport?.IATA}, {fromAirport?.City}
          </p>
          <p>{fromAirport?.Name}</p>
          <p>Terminal:</p>
        </div>

        {/* Column 2 */}
        <div className="OneWayTicketDetails__column duration-info">
          <p>Duration: {selectedFlight?.duration} hrs</p>
          <div className="OneWayTicketDetails__arrow">
            <hr />
          </div>
          <p>Stops: {selectedFlight?.stops}</p>
        </div>

        {/* Column 3 */}
        <div className="OneWayTicketDetails__column">
          <p>
            End: {endTime.hours24} / {endTime.hours12}
          </p>
          <p>
            {toAirport?.IATA}, {toAirport?.City}
          </p>
          <p>{toAirport?.Name}</p>
          <p>Terminal:</p>
        </div>
      </div>

      {/* Row 3 */}
      <div className="OneWayTicketDetails__row row-3">
        <p>Departure Date: {departureDate}</p>
      </div>
    </div>
  );
};

export default TicketDetailsOneWay;
