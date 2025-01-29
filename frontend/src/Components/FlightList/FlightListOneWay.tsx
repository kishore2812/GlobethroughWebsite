import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFlightStore from "../../Stores/FlightStore";
import { IoAirplaneSharp } from "react-icons/io5";
import axios from "axios";
import "./FlightListOneWay.scss";

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

const FlightListOneWay: React.FC = () => {
  const navigate = useNavigate();
  const {
    fromAirport,
    toAirport,
    departureDate,
    adults,
    children,
    selectedClass,
  } = useFlightStore();
  const { setSelectedFlight } = useFlightStore();

  const [flights, setFlights] = useState<any[]>([]);
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

  const fetchFlights = async (token: string) => {
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
        setError("No flights found for the selected criteria.");
      } else {
        setFlights(data.data);
        setDictionaries(data.dictionaries);
      }
    } catch {
      setError("Error fetching flight data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFlights = async () => {
      const token = await fetchToken();
      if (token) {
        fetchFlights(token);
      }
    };

    if (fromAirport && toAirport && departureDate) {
      loadFlights();
    } else {
      setError("Please check the search parameters and try again.");
    }
  }, [fromAirport, toAirport, departureDate, adults, children, selectedClass]);

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

  const handleBookNow = (flight: any) => {
    setSelectedFlight(flight);
    navigate("/ticket-detail", { state: { flight } });
  };

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

  // Convert prices based on the conversion rate
  const convertPrice = (priceInEuro: number) => {
    return conversionRate ? priceInEuro * conversionRate : priceInEuro;
  };

  // Find the cheapest and fastest flights
  const cheapestFlight = flights.reduce((prev, curr) => {
    // Access the total price of the flight
    const prevPrice = parseFloat(prev.price.total.replace(/[^\d.-]/g, "")); // Remove any non-numeric characters like currency symbols
    const currPrice = parseFloat(curr.price.total.replace(/[^\d.-]/g, "")); // Same for current flight

    // Compare the price
    return currPrice < prevPrice ? curr : prev;
  }, flights[0]);

  const fastestFlight = flights.reduce(
    (prev, curr) =>
      curr.itineraries[0].duration < prev.itineraries[0].duration ? curr : prev,
    flights[0]
  );

  return (
    <div className="flightListOneWay">
      {flights.length === 0 ? (
        <div>No flights available</div>
      ) : (
        flights.map((flight) => {
          const firstSegment = flight.itineraries?.[0]?.segments?.[0];
          const lastSegment = flight.itineraries?.[0]?.segments?.slice(-1)[0];

          return (
            <div
              className={`flightListOneWay__card ${
                flight.id === cheapestFlight.id
                  ? "flightListOneWay__cheapest" // Label for cheapest flight
                  : ""
              } ${
                flight.id === fastestFlight.id
                  ? "flightListOneWay__fastest" // Label for fastest flight
                  : ""
              }`}
              key={flight.id}
            >
              {/* Header: Airline & Flight Number */}
              <div className="flightListOneWay__header">
                <div className="flightListOneWay__carrier">
                  {dictionaries.carriers?.[firstSegment.carrierCode] ||
                    "Unknown Airline"}
                </div>
                <div className="flightListOneWay__flightNumber">
                  {firstSegment.carrierCode} {firstSegment.number}
                </div>
                {(flight.id === cheapestFlight.id ||
                  flight.id === fastestFlight.id) && (
                  <div className="flightListOneWay__tag">
                    {flight.id === cheapestFlight.id && "Cheapest"}{" "}
                    {/* Cheapest label */}
                    {flight.id === fastestFlight.id && "Fastest"}{" "}
                    {/* Fastest label */}
                  </div>
                )}
              </div>

              {/* Flight Details */}
              <div className="flightListOneWay__row">
                <div className="flightListOneWay__column">
                  <div className="flightListOneWay__time">
                    {formatTime(firstSegment.departure.at)}
                  </div>
                  <div className="flightListOneWay__location">
                    {fromAirport?.iataCode}
                  </div>
                </div>

                <div className="flightListOneWay__column">
                  <div className="flightListOneWay__duration">
                    {formatDuration(flight.itineraries?.[0]?.duration)}
                  </div>
                  <div className="flightListOneWay__lineWithIcon">
                    <IoAirplaneSharp className="flightListOneWay__airplaneIcon" />
                  </div>
                  <div className="flightListOneWay__stops">
                    {flight.itineraries?.[0]?.segments.length - 1} Stop(s)
                  </div>
                </div>

                <div className="flightListOneWay__column">
                  <div className="flightListOneWay__time">
                    {formatTime(lastSegment.arrival.at)}
                  </div>
                  <div className="flightListOneWay__location">
                    {toAirport?.iataCode}
                  </div>
                </div>

                <div className="flightListOneWay__column">
                  <div className="flightListOneWay__price">
                    {userCurrency}{" "}
                    {convertPrice(flight.price?.total || 0).toFixed(2)}
                  </div>
                  <button
                    className="flightListOneWay__bookNow"
                    onClick={() => handleBookNow(flight)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FlightListOneWay;
