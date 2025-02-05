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

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

    if (!match) return "NA";

    const hours = match[1] ? `${match[1]}h` : "";
    const minutes = match[2] ? `${match[2]}m` : "";

    return `${hours} ${minutes}`.trim();
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

  const formattedDepartureDate = formatDate(departureDate);

  return (
    <div className="OneWayTicketDetails__flight-ticket-card">
      {/* Row 1 */}
      <div className="OneWayTicketDetails__row OneWayTicketDetails__row-1">
        <div className="OneWayTicketDetails__flight-logo">
          <p>
            {selectedFlight.itineraries?.[0]?.segments?.[0].carrierCode}{" "}
            {selectedFlight.itineraries?.[0]?.segments?.[0].number}
          </p>
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
              {formatTime(
                selectedFlight.itineraries?.[0]?.segments?.[0].departure.at
              )}
            </span>
          </p>

          <p className="OneWayTicketDetails__airportDetails">
            <span className="OneWayTicketDetails__iata">
              {fromAirport?.iataCode || "N/A"}
            </span>
            ,
            <span className="OneWayTicketDetails__city">
              {fromAirport?.address.cityName || "N/A"}
            </span>
          </p>

          <span className="OneWayTicketDetails__airport-name">
            {fromAirport?.name || "N/A"}
          </span>
          <p>
            <span className="OneWayTicketDetails__airport-name">Terminal</span>
          </p>
        </div>

        {/* Column 2 - Center aligned */}
        <div className="OneWayTicketDetails__column OneWayTicketDetails__column-center OneWayTicketDetails__duration-info">
          <div className="OneWayTicketDetails__info-item">
            <p>
              {formatDuration(
                selectedFlight.itineraries?.[0]?.duration || "N/A"
              )}{" "}
              hrs
            </p>
          </div>
          <div className="OneWayTicketDetails__arrow">
            <span className="OneWayTicketDetails__long-arrow"></span>
            <FaChevronRight className="OneWayTicketDetails__chevron-right" />
          </div>
          <div className="OneWayTicketDetails__info-item">
            <p>
              {selectedFlight.itineraries?.[0]?.segments.length - 1 || "N/A"}{" "}
              stops
            </p>
          </div>
        </div>

        {/* Column 3 - Right aligned */}
        <div className="OneWayTicketDetails__column OneWayTicketDetails__column-right">
          <p className="OneWayTicketDetails__time">
            <span className="OneWayTicketDetails__start-time-24hr">
              {formatTime(
                selectedFlight.itineraries?.[0]?.segments?.[0]?.arrival.at
              )}
            </span>
          </p>
          <p className="OneWayTicketDetails__airportDetails">
            <span className="OneWayTicketDetails__iata">
              {toAirport?.iataCode || "N/A"}
            </span>
            ,
            <span className="OneWayTicketDetails__city">
              {toAirport?.address.cityName || "N/A"}
            </span>
          </p>

          <p>
            <span className="OneWayTicketDetails__airport-name">
              {toAirport?.name || "N/A"}
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
