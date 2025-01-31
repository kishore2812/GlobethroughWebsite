import React, { useState, useEffect } from "react";
import useFlightStore from "../../Stores/FlightStore";
import { IoAirplaneSharp } from "react-icons/io5";
import axios from "axios";
import "./FlightListRoundTrip.scss";

// Helper functions to fetch the user's country and currency, and convert currency
const fetchUserCountry = async () => {
  try {
    const response = await axios.get(
      "https://api.ipgeolocation.io/ipgeo?apiKey=dc4ee33cead243e396eaca0c9c4bf19c"
    );
    console.log("User country data:", response.data); // Add logging here
    return response.data;
  } catch (error) {
    console.error("Error fetching user country:", error);
    throw new Error("Error fetching user country");
  }
};

const fetchCurrencyConversionRate = async (currency: string) => {
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/eb7a0c52098e9debbb7e5f63/latest/EUR`
    );

    console.log("Currency conversion rate data:", response.data);

    // Check if the currency exists in the conversion rates
    if (
      response.data &&
      response.data.conversion_rates &&
      response.data.conversion_rates[currency]
    ) {
      return response.data.conversion_rates[currency];
    } else {
      console.warn(
        `Conversion rate for ${currency} not found. Falling back to default rate.`
      );
      return 1; // Default conversion rate (1:1) if currency not found
    }
  } catch (error) {
    console.error("Error fetching conversion rate:", error);
    return 1; // Default conversion rate (1:1) if API call fails
  }
};

const FlightListRoundTrip: React.FC = () => {
  const {
    fromAirport,
    toAirport,
    departureDate,
    returnDate,
    adults,
    children,
    selectedClass,
    selectedDeparture,
    setSelectedDeparture,
    selectedReturn,
    setSelectedReturn,
  } = useFlightStore();

  const [departureFlights, setDepartureFlights] = useState<any[]>([]);
  const [returnFlights, setReturnFlights] = useState<any[]>([]);
  const [dictionaries, setDictionaries] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userCurrency, setUserCurrency] = useState<string>("USD");
  const [conversionRate, setConversionRate] = useState<number | null>(null);

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

  // Fetch user's country and currency
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const countryData = await fetchUserCountry();

        const userCurrency = countryData.currency.code; // Get user's currency from API
        setUserCurrency(userCurrency);
        const rate = await fetchCurrencyConversionRate(userCurrency);
        setConversionRate(rate);
      } catch {
        setError("Error fetching country and currency data");
      }
    };

    fetchCountryData();
  }, []);

  const convertPrice = (priceInEuro: number) => {
    return conversionRate ? priceInEuro * conversionRate : priceInEuro;
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
            {departureFlights.map((flight) => {
              const firstSegment = flight.itineraries?.[0]?.segments?.[0];
              const lastSegment =
                flight.itineraries?.[0]?.segments?.slice(-1)[0];

              if (!firstSegment || !lastSegment) return null; // Skip flights with missing segments

              return (
                <div
                  className={`flightListRoundTrip__card ${
                    selectedDeparture?.id === flight.id
                      ? "flightListRoundTrip__selected"
                      : ""
                  }`}
                  key={flight.id}
                  onClick={() => setSelectedDeparture(flight)}
                >
                  <div className="flightListRoundTrip__header">
                    <div className="flightListRoundTrip__carrier">
                      {dictionaries.carriers?.[firstSegment.carrierCode] ||
                        "Unknown Airline"}
                      <div className="flightListRoundTrip__flightNumber">
                        {firstSegment.carrierCode} {firstSegment.number}
                      </div>
                    </div>
                    <div className="flightListRoundTrip__price">
                      {userCurrency}{" "}
                      {convertPrice(flight.price?.total || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="flightListRoundTrip__row">
                    {/* Departure Info */}
                    <div className="flightListRoundTrip__column">
                      <div className="flightListRoundTrip__time">
                        {formatTime(firstSegment.departure.at)}
                      </div>
                      <div className="flightListRoundTrip__location">
                        {fromAirport?.iataCode}
                      </div>
                    </div>

                    {/* Duration & Stops */}
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

                    {/* Arrival Info */}
                    <div className="flightListRoundTrip__column">
                      <div className="flightListRoundTrip__time">
                        {formatTime(lastSegment.arrival.at)}
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
            {returnFlights.map((flight) => {
              const firstSegment = flight.itineraries?.[0]?.segments?.[0];
              const lastSegment =
                flight.itineraries?.[0]?.segments?.slice(-1)[0];

              if (!firstSegment || !lastSegment) return null; // Skip flights with missing segments

              return (
                <div
                  className={`flightListRoundTrip__card ${
                    selectedReturn?.id === flight.id
                      ? "flightListRoundTrip__selected"
                      : ""
                  }`}
                  key={flight.id}
                  onClick={() => setSelectedReturn(flight)}
                >
                  <div className="flightListRoundTrip__header">
                    <div className="flightListRoundTrip__carrier">
                      {dictionaries.carriers?.[firstSegment.carrierCode] ||
                        "Unknown Airline"}
                      <div className="flightListRoundTrip__flightNumber">
                        {firstSegment.carrierCode} {firstSegment.number}
                      </div>
                    </div>
                    <div className="flightListRoundTrip__price">
                      {userCurrency}{" "}
                      {convertPrice(flight.price?.total || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="flightListRoundTrip__row">
                    {/* Departure Info */}
                    <div className="flightListRoundTrip__column">
                      <div className="flightListRoundTrip__time">
                        {formatTime(firstSegment.departure.at)}
                      </div>
                      <div className="flightListRoundTrip__location">
                        {toAirport?.iataCode}
                      </div>
                    </div>

                    {/* Duration & Stops */}
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

                    {/* Arrival Info */}
                    <div className="flightListRoundTrip__column">
                      <div className="flightListRoundTrip__time">
                        {formatTime(lastSegment.arrival.at)}
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
