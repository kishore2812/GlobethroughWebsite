import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import the icon
import useFlightStore from "../../Stores/FlightStore";
import "./RoundTripTicketDetails.scss"; // Import the updated SCSS file

const TicketDetailsRoundTrip: React.FC = () => {
  const {
    departureDate,
    returnDate,
    fromAirport,
    toAirport,
    selectedDeparture,
    selectedReturn,
    selectedClass,
  } = useFlightStore();

  if (!selectedDeparture || !selectedReturn) {
    return <p>No flight details available for the round-trip.</p>;
  }

  // Format time function
  const formatTime = (time: string | number | null | undefined) => {
    if (!time) {
      return { hours24: "N/A", hours12: "N/A" };
    }

    const date = new Date(time);
    if (isNaN(date.getTime())) {
      return { hours24: "N/A", hours12: "N/A" };
    }

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

  const formatDate = (date: string | number | Date | null | undefined) => {
    if (!date) return "N/A";

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short", // Mon, Tue
      day: "2-digit", // 24, 05
      month: "short", // Jan, Feb
    };

    return new Date(date).toLocaleDateString("en-GB", options);
  };

  // Render Departure Flight Card
  const renderDepartureFlight = () => {
    const startTime = formatTime(selectedDeparture.startTime);
    const endTime = formatTime(selectedDeparture.endTime);

    return (
      <div className="RoundTripTicketDetails__flight-ticket-card">
        <div className="RoundTripTicketDetails__row">
          <div className="RoundTripTicketDetails__flight-info">
            <img
              src={selectedDeparture.logo}
              alt={selectedDeparture.flightNumber}
              className="RoundTripTicketDetails__flight-logo"
            />
            <p className="RoundTripTicketDetails__flight-number">
              {selectedDeparture.flightNumber}
            </p>
          </div>
          <div className="RoundTripTicketDetails__selected-class">
            <p>{selectedClass}</p>
          </div>
        </div>

        <div className="RoundTripTicketDetails__row">
          <div className="RoundTripTicketDetails__column-left">
            <div className="RoundTripTicketDetails__time">
              <p className="RoundTripTicketDetails__time-24hr">
                {startTime.hours24}
              </p>
              <p className="RoundTripTicketDetails__time-12hr">
                ({startTime.hours12})
              </p>
            </div>
            <p className="RoundTripTicketDetails__airport">
              {fromAirport?.City},{fromAirport?.IATA}
            </p>
            <p className="RoundTripTicketDetails__airport">
              {fromAirport?.Name}
            </p>
          </div>

          <div className="RoundTripTicketDetails__column-center">
            <p className="RoundTripTicketDetails__duration">
              {selectedDeparture.duration} hrs
            </p>

            {/* Arrow with line */}
            <div className="RoundTripTicketDetails__arrow">
              <span className="RoundTripTicketDetails__long-arrow"></span>
              <FaChevronRight className="RoundTripTicketDetails__chevron-right" />
            </div>

            <p className="RoundTripTicketDetails__stops">
              {selectedDeparture.stops} Stops
            </p>
          </div>

          <div className="RoundTripTicketDetails__column-right">
            <div className="RoundTripTicketDetails__end-time">
              <p className="RoundTripTicketDetails__time-24hr">
                {endTime.hours24}
              </p>
              <p className="RoundTripTicketDetails__time-12hr">
                ({endTime.hours12})
              </p>
            </div>
            <p
              className="RoundTripTicketDetails__airport"
              style={{ textAlign: "right" }}
            >
              {toAirport?.City},{toAirport?.IATA}
            </p>
            <p
              className="RoundTripTicketDetails__airport"
              style={{ textAlign: "right" }}
            >
              {toAirport?.Name}
            </p>
          </div>
        </div>

        <p className="RoundTripTicketDetails__date">
          Departure Date: {formatDate(departureDate)}
        </p>
      </div>
    );
  };

  // Render Return Flight Card
  const renderReturnFlight = () => {
    const startTime = formatTime(selectedReturn.startTime);
    const endTime = formatTime(selectedReturn.endTime);

    return (
      <div className="RoundTripTicketDetails__flight-ticket-card">
        <div className="RoundTripTicketDetails__row">
          <div className="RoundTripTicketDetails__flight-info">
            <img
              src={selectedReturn.logo}
              alt={selectedReturn.flightNumber}
              className="RoundTripTicketDetails__flight-logo"
            />
            <p className="RoundTripTicketDetails__flight-number">
              {selectedReturn.flightNumber}
            </p>
          </div>
          <div className="RoundTripTicketDetails__selected-class">
            <p> {selectedClass}</p>
          </div>
        </div>

        <div className="RoundTripTicketDetails__row">
          <div className="RoundTripTicketDetails__column-left">
            <div className="RoundTripTicketDetails__time">
              <p className="RoundTripTicketDetails__time-24hr">
                {startTime.hours24}
              </p>
              <p className="RoundTripTicketDetails__time-12hr">
                ({startTime.hours12})
              </p>
            </div>
            <p className="RoundTripTicketDetails__airport">
              {fromAirport?.City},{fromAirport?.IATA}
            </p>
            <p className="RoundTripTicketDetails__airport">
              {fromAirport?.Name}
            </p>
          </div>

          <div className="RoundTripTicketDetails__column-center">
            <p className="RoundTripTicketDetails__duration">
              {selectedReturn.duration} hrs
            </p>

            {/* Arrow with line */}
            <div className="RoundTripTicketDetails__arrow">
              <FaChevronLeft className="RoundTripTicketDetails__chevron-left" />
              <span className="RoundTripTicketDetails__long-arrow-left"></span>
            </div>

            <p className="RoundTripTicketDetails__stops">
              {selectedReturn.stops} Stops
            </p>
          </div>

          <div className="RoundTripTicketDetails__column-right">
            <div className="RoundTripTicketDetails__end-time">
              <p className="RoundTripTicketDetails__time-24hr">
                {endTime.hours24}
              </p>
              <p className="RoundTripTicketDetails__time-12hr">
                ({endTime.hours12})
              </p>
            </div>
            <p
              className="RoundTripTicketDetails__airport"
              style={{ textAlign: "right" }}
            >
              {toAirport?.City},{toAirport?.IATA}
            </p>
            <p
              className="RoundTripTicketDetails__airport"
              style={{ textAlign: "right" }}
            >
              {toAirport?.Name}
            </p>
          </div>
        </div>

        <p className="RoundTripTicketDetails__date">
          Return Date: {formatDate(returnDate)}
        </p>
      </div>
    );
  };

  return (
    <div className="RoundTripTicketDetails__container">
      {renderDepartureFlight()}
      {renderReturnFlight()}
    </div>
  );
};

export default TicketDetailsRoundTrip;
