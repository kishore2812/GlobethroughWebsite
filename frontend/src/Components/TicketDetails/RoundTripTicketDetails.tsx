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
    return (
      <div className="RoundTripTicketDetails__flight-ticket-card">
        <div className="RoundTripTicketDetails__row">
          <div className="RoundTripTicketDetails__flight-info">
            {selectedDeparture.itineraries?.[0]?.segments?.[0].carrierCode}{" "}
            {selectedDeparture.itineraries?.[0]?.segments?.[0].number}
          </div>
          <div className="RoundTripTicketDetails__selected-class">
            <p>{selectedClass}</p>
          </div>
        </div>

        <div className="RoundTripTicketDetails__row">
          <div className="RoundTripTicketDetails__column-left">
            <div className="RoundTripTicketDetails__time">
              <p className="RoundTripTicketDetails__time-24hr">
                <span>
                  {formatTime(
                    selectedDeparture.itineraries?.[0]?.segments?.[0].departure
                      .at
                  )}
                </span>
              </p>
            </div>
            <p className="RoundTripTicketDetails__airport">
              {fromAirport?.address.cityName},{fromAirport?.iataCode}
            </p>
            <p className="RoundTripTicketDetails__airport">
              {fromAirport?.name}
            </p>
          </div>

          <div className="RoundTripTicketDetails__column-center">
            <p className="RoundTripTicketDetails__duration">
              {formatDuration(
                selectedDeparture.itineraries?.[0]?.duration || "N/A"
              )}{" "}
            </p>

            {/* Arrow with line */}
            <div className="RoundTripTicketDetails__arrow">
              <span className="RoundTripTicketDetails__long-arrow"></span>
              <FaChevronRight className="RoundTripTicketDetails__chevron-right" />
            </div>

            <p className="RoundTripTicketDetails__stops">
              {selectedDeparture.itineraries?.[0]?.segments.length - 1 || "N/A"}{" "}
              stops
            </p>
          </div>

          <div className="RoundTripTicketDetails__column-right">
            <div className="RoundTripTicketDetails__end-time">
              <p className="RoundTripTicketDetails__time-24hr">
                {formatTime(
                  selectedDeparture.itineraries?.[0]?.segments?.slice(-1)[0]
                    ?.arrival.at
                )}
              </p>
            </div>
            <p
              className="RoundTripTicketDetails__airport"
              style={{ textAlign: "right" }}
            >
              {toAirport?.address.cityName},{toAirport?.iataCode}
            </p>
            <p
              className="RoundTripTicketDetails__airport"
              style={{ textAlign: "right" }}
            >
              {toAirport?.name}
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
    return (
      <div className="RoundTripTicketDetails__flight-ticket-card">
        <div className="RoundTripTicketDetails__row">
          <div className="RoundTripTicketDetails__flight-info">
            {selectedReturn.itineraries?.[0]?.segments?.[0].carrierCode}{" "}
            {selectedReturn.itineraries?.[0]?.segments?.[0].number}
          </div>
          <div className="RoundTripTicketDetails__selected-class">
            <p> {selectedClass}</p>
          </div>
        </div>

        <div className="RoundTripTicketDetails__row">
          <div className="RoundTripTicketDetails__column-left">
            <div className="RoundTripTicketDetails__time">
              <p className="RoundTripTicketDetails__time-24hr">
                {formatTime(
                  selectedReturn.itineraries?.[0]?.segments?.slice(-1)[0]
                    .arrival.at
                )}
              </p>
            </div>
            <p className="RoundTripTicketDetails__airport">
              {fromAirport?.address.cityName},{fromAirport?.iataCode}
            </p>
            <p className="RoundTripTicketDetails__airport">
              {fromAirport?.name}
            </p>
          </div>

          <div className="RoundTripTicketDetails__column-center">
            <p className="RoundTripTicketDetails__duration">
              {formatDuration(
                selectedReturn.itineraries?.[0]?.duration || "N/A"
              )}{" "}
            </p>

            {/* Arrow with line */}
            <div className="RoundTripTicketDetails__arrow">
              <FaChevronLeft className="RoundTripTicketDetails__chevron-left" />
              <span className="RoundTripTicketDetails__long-arrow-left"></span>
            </div>

            <p className="RoundTripTicketDetails__stops">
              {selectedReturn.itineraries?.[0]?.segments.length - 1 || "N/A"}{" "}
              stops
            </p>
          </div>

          <div className="RoundTripTicketDetails__column-right">
            <div className="RoundTripTicketDetails__end-time">
              <p className="RoundTripTicketDetails__time-24hr">
                {formatTime(
                  selectedReturn.itineraries?.[0]?.segments?.[0]?.departure.at
                )}
              </p>
            </div>
            <p
              className="RoundTripTicketDetails__airport"
              style={{ textAlign: "right" }}
            >
              {toAirport?.address.cityName},{toAirport?.iataCode}
            </p>
            <p
              className="RoundTripTicketDetails__airport"
              style={{ textAlign: "right" }}
            >
              {toAirport?.name}
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
