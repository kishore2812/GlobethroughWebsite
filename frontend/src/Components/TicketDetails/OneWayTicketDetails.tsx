import React from "react";
import useFlightStore from "../../Stores/FlightStore";
import "./OneWayTicketDetails.scss";
import { FaChevronRight } from "react-icons/fa";

const TicketDetailsOneWay: React.FC = () => {
  const {
    departureDate,
    fromAirport,
    toAirport,
    selectedFlight,
    selectedClass,
  } = useFlightStore();

  const formatTime = (time: string | number | null | undefined) => {
    if (!time) {
      return { hours24: "N/A", hours12: "N/A" };
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

  const formatDate = (date: string | number | null | undefined) => {
    if (!date) return "N/A";
    const formattedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short", // e.g., Mon
      day: "2-digit", // e.g., 28
      month: "short", // e.g., Jan
    };
    return formattedDate.toLocaleDateString("en-US", options);
  };

  const startTime = formatTime(selectedFlight?.startTime ?? "");
  const endTime = formatTime(selectedFlight?.endTime ?? "");
  const formattedDepartureDate = formatDate(departureDate);

  return (
    <div className="OneWayTicketDetails__flight-ticket-card">
      {/* Row 1 */}
      <div className="OneWayTicketDetails__row OneWayTicketDetails__row-1">
        <div className="OneWayTicketDetails__flight-logo">
          <img
            src={selectedFlight?.logo || ""}
            alt={selectedFlight?.flightNumber || "Flight"}
            style={{ width: "80px" }}
          />
          <p>{selectedFlight?.flightNumber || "N/A"}</p>
        </div>
        <div className="OneWayTicketDetails__selected-class">
          <p>{selectedClass || "N/A"}</p>
        </div>
      </div>

      {/* Row 2 */}
      <div className="OneWayTicketDetails__row OneWayTicketDetails__row-2">
        {/* Column 1 - Left aligned */}
        <div className="OneWayTicketDetails__column OneWayTicketDetails__column-left">
          <p className="OneWayTicketDetails__time">
            <span className="OneWayTicketDetails__start-time-24hr">
              {startTime.hours24}
            </span>
            <span className="OneWayTicketDetails__start-time-12hr">
              {" "}
              ({startTime.hours12})
            </span>
          </p>

          <p className="OneWayTicketDetails__airportDetails">
            <span className="OneWayTicketDetails__iata">
              {fromAirport?.IATA || "N/A"}
            </span>
            ,
            <span className="OneWayTicketDetails__city">
              {fromAirport?.City || "N/A"}
            </span>
          </p>

          <span className="OneWayTicketDetails__airport-name">
            {fromAirport?.Name || "N/A"}
          </span>
          <p>
            <span className="OneWayTicketDetails__airport-name">Terminal</span>
          </p>
        </div>

        {/* Column 2 - Center aligned */}
        <div className="OneWayTicketDetails__column OneWayTicketDetails__column-center OneWayTicketDetails__duration-info">
          <div className="OneWayTicketDetails__info-item">
            <p>{selectedFlight?.duration || "N/A"} hrs</p>
          </div>
          <div className="OneWayTicketDetails__arrow">
            <span className="OneWayTicketDetails__long-arrow"></span>
            <FaChevronRight className="OneWayTicketDetails__chevron-right" />
          </div>
          <div className="OneWayTicketDetails__info-item">
            <p>{selectedFlight?.stops || "N/A"} stops</p>
          </div>
        </div>

        {/* Column 3 - Right aligned */}
        <div className="OneWayTicketDetails__column OneWayTicketDetails__column-right">
          <p className="OneWayTicketDetails__time">
            <span className="OneWayTicketDetails__start-time-24hr">
              {endTime.hours24}
            </span>
            <span className="OneWayTicketDetails__start-time-12hr">
              {" "}
              ({endTime.hours12})
            </span>
          </p>
          <p className="OneWayTicketDetails__airportDetails">
            <span className="OneWayTicketDetails__iata">
              {toAirport?.IATA || "N/A"}
            </span>
            ,
            <span className="OneWayTicketDetails__city">
              {toAirport?.City || "N/A"}
            </span>
          </p>

          <p>
            <span className="OneWayTicketDetails__airport-name">
              {toAirport?.Name || "N/A"}
            </span>
          </p>

          <p>
            <span className="OneWayTicketDetails__airport-name">Terminal</span>
          </p>
        </div>
      </div>

      {/* Row 3 */}
      <div className="OneWayTicketDetails__row OneWayTicketDetails__row-3">
        <p>{formattedDepartureDate} (Departure)</p>
      </div>
    </div>
  );
};

export default TicketDetailsOneWay;
