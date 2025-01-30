import React, { useState, useEffect } from "react";
import useFlightStore from "../../Stores/FlightStore";
import { IoAirplaneSharp } from "react-icons/io5";
import axios from "axios";
import "./FlightListRoundTrip.scss";

const FlightListRoundTrip: React.FC = () => {
  const {
    fromAirport,
    toAirport,
    departureDate,
    returnDate,
    adults,
    children,
    selectedClass,
  } = useFlightStore();

  const [departureFlights, setDepartureFlights] = useState<any[]>([]);
  const [returnFlights, setReturnFlights] = useState<any[]>([]);
  const [dictionaries, setDictionaries] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/amadeus/token");
      return response.data.access_token;
    } catch {
      setError("Error fetching token");
      return null;
    }
  };

  const fetchDepartureFlights = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://test.api.amadeus.com/v2/shopping/flight-offers`,
        {
          params: {
            originLocationCode: fromAirport?.iataCode,
            destinationLocationCode: toAirport?.iataCode,
            departureDate: departureDate,
            adults: adults,
            children: children,
            travelClass: selectedClass,
            nonStop: false,
            max: 250,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (data.data.length === 0) {
        setError("No departure flights found for the selected criteria.");
      } else {
        setDepartureFlights(data.data);
        setDictionaries(data.dictionaries);
      }
    } catch {
      setError("Error fetching departure flight data");
    } finally {
      setLoading(false);
    }
  };

  const fetchReturnFlights = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://test.api.amadeus.com/v2/shopping/flight-offers`,
        {
          params: {
            originLocationCode: toAirport?.iataCode,
            destinationLocationCode: fromAirport?.iataCode,
            departureDate: returnDate,
            adults: adults,
            children: children,
            travelClass: selectedClass,
            nonStop: false,
            max: 250,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (data.data.length === 0) {
        setError("No return flights found for the selected criteria.");
      } else {
        setReturnFlights(data.data);
        setDictionaries(data.dictionaries);
      }
    } catch {
      setError("Error fetching return flight data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFlights = async () => {
      const token = await fetchToken();
      if (token) {
        fetchDepartureFlights(token);
        fetchReturnFlights(token);
      }
    };

    if (fromAirport && toAirport && departureDate && returnDate) {
      loadFlights();
    } else {
      setError("Please check the search parameters and try again.");
    }
  }, [
    fromAirport,
    toAirport,
    departureDate,
    returnDate,
    adults,
    children,
    selectedClass,
  ]);

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    return match ? `${match[1]}h ${match[2]}m` : "NA";
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="flightListRoundTrip">
      {departureFlights.length === 0 && returnFlights.length === 0 ? (
        <div>No flights available</div>
      ) : (
        <div className="flightListRoundTrip__container">
          <div className="flightListRoundTrip__column">
            {/* Departure Flight Cards */}
            {departureFlights.map((flight) => {
              const firstSegmentDeparture =
                flight.itineraries?.[0]?.segments?.[0];
              const lastSegmentDeparture =
                flight.itineraries?.[0]?.segments?.slice(-1)[0];

              if (!firstSegmentDeparture || !lastSegmentDeparture) {
                return null; // Skip flights with missing segments
              }

              return (
                <div className="flightListRoundTrip__card" key={flight.id}>
                  <div className="flightListRoundTrip__header">
                    <div className="flightListRoundTrip__carrier">
                      {dictionaries.carriers?.[
                        firstSegmentDeparture.carrierCode
                      ] || "Unknown Airline"}
                    </div>
                    <div className="flightListRoundTrip__flightNumber">
                      {firstSegmentDeparture.carrierCode}{" "}
                      {firstSegmentDeparture.number}
                    </div>
                  </div>

                  <div className="flightListRoundTrip__row">
                    <div className="flightListRoundTrip__column">
                      <div className="flightListRoundTrip__time">
                        {formatTime(firstSegmentDeparture.departure.at)}
                      </div>
                      <div className="flightListRoundTrip__location">
                        {fromAirport?.iataCode}
                      </div>
                    </div>

                    <div className="flightListRoundTrip__column">
                      <div className="flightListRoundTrip__duration">
                        {formatDuration(flight.itineraries?.[0]?.duration)}
                      </div>
                      <div className="flightListRoundTrip__lineWithIcon">
                        <IoAirplaneSharp className="flightListRoundTrip__airplaneIcon" />
                      </div>
                      <div className="flightListRoundTrip__stops">
                        {flight.itineraries?.[0]?.segments.length - 1} Stop(s)
                      </div>
                    </div>

                    <div className="flightListRoundTrip__column">
                      <div className="flightListRoundTrip__time">
                        {formatTime(lastSegmentDeparture.arrival.at)}
                      </div>
                      <div className="flightListRoundTrip__location">
                        {toAirport?.iataCode}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flightListRoundTrip__column">
            {/* Return Flight Cards */}
            {returnFlights.map((flight) => {
              const firstSegmentReturn = flight.itineraries?.[0]?.segments?.[0];
              const lastSegmentReturn =
                flight.itineraries?.[0]?.segments?.slice(-1)[0];

              if (!firstSegmentReturn || !lastSegmentReturn) {
                return null; // Skip flights with missing segments
              }

              return (
                <div className="flightListRoundTrip__card" key={flight.id}>
                  <div className="flightListRoundTrip__header">
                    <div className="flightListRoundTrip__carrier">
                      {dictionaries.carriers?.[
                        firstSegmentReturn.carrierCode
                      ] || "Unknown Airline"}
                    </div>
                    <div className="flightListRoundTrip__flightNumber">
                      {firstSegmentReturn.carrierCode}{" "}
                      {firstSegmentReturn.number}
                    </div>
                  </div>

                  <div className="flightListRoundTrip__row">
                    <div className="flightListRoundTrip__column">
                      <div className="flightListRoundTrip__time">
                        {formatTime(firstSegmentReturn.departure.at)}
                      </div>
                      <div className="flightListRoundTrip__location">
                        {toAirport?.iataCode}
                      </div>
                    </div>

                    <div className="flightListRoundTrip__column">
                      <div className="flightListRoundTrip__duration">
                        {formatDuration(flight.itineraries?.[0]?.duration)}
                      </div>
                      <div className="flightListRoundTrip__lineWithIcon">
                        <IoAirplaneSharp className="flightListRoundTrip__airplaneIcon" />
                      </div>
                      <div className="flightListRoundTrip__stops">
                        {flight.itineraries?.[0]?.segments.length - 1} Stop(s)
                      </div>
                    </div>

                    <div className="flightListRoundTrip__column">
                      <div className="flightListRoundTrip__time">
                        {formatTime(lastSegmentReturn.arrival.at)}
                      </div>
                      <div className="flightListRoundTrip__location">
                        {fromAirport?.iataCode}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightListRoundTrip;
