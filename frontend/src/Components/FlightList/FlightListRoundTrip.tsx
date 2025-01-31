import React, { useState, useEffect } from "react";
import useFlightStore from "../../Stores/FlightStore";
import { IoAirplaneSharp } from "react-icons/io5";
import axios from "axios";
import "./FlightListRoundTrip.scss";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
  const [loadingDeparture, setLoadingDeparture] = useState<boolean>(false);
  const [loadingReturn, setLoadingReturn] = useState<boolean>(false);
  const [flightsLoaded, setFlightsLoaded] = useState<boolean>(false); // To track if both are loaded

  const [error, setError] = useState<string | null>(null);
  const [userCurrency, setUserCurrency] = useState<string>("USD");
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  const navigate = useNavigate();

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
    setLoadingDeparture(true); // Start loading departure
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
      setLoadingDeparture(false); // Stop loading departure
      checkFlightsLoaded();
    }
  };

  const fetchReturnFlights = async (token: string) => {
    setLoadingReturn(true); // Start loading return
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
      setLoadingReturn(false); // Stop loading return
      checkFlightsLoaded();
    }
  };

  const checkFlightsLoaded = () => {
    if (!loadingDeparture && !loadingReturn) {
      setFlightsLoaded(true); // Both flights are loaded
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

  const formatTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // 12-hour format
    };
    return date.toLocaleString("en-US", options); // Format as 12-hour time
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    return match ? `${match[1]}h ${match[2]}m` : "NA";
  };

  const getCheapestFlight = (flights: any[]) => {
    if (flights.length === 0) return null; // Return null if no flights
    return flights.reduce((cheapest, current) => {
      return parseFloat(current.price.total) < parseFloat(cheapest.price.total)
        ? current
        : cheapest;
    });
  };

  const getFastestFlight = (flights: any[]) => {
    if (flights.length === 0) return null; // Return null if no flights
    return flights.reduce((fastest, current) => {
      const currentDuration = current.itineraries[0]?.duration;
      const currentMatch = currentDuration
        ? currentDuration.match(/(\d+)H(\d+)M/)
        : null;

      const currentMinutes = currentMatch
        ? parseInt(currentMatch[1]) * 60 + parseInt(currentMatch[2])
        : Infinity; // If duration is missing or invalid, use a large number

      const fastestDuration = fastest.itineraries[0]?.duration;
      const fastestMatch = fastestDuration
        ? fastestDuration.match(/(\d+)H(\d+)M/)
        : null;

      const fastestMinutes = fastestMatch
        ? parseInt(fastestMatch[1]) * 60 + parseInt(fastestMatch[2])
        : Infinity; // Same fallback if fastest duration is invalid

      return currentMinutes < fastestMinutes ? current : fastest;
    });
  };

  const cheapestDeparture = getCheapestFlight(departureFlights);
  const fastestDeparture = getFastestFlight(departureFlights);
  const cheapestReturn = getCheapestFlight(returnFlights);
  const fastestReturn = getFastestFlight(returnFlights);

  if (loadingDeparture || loadingReturn) {
    return <div>Loading...</div>; // Show loading indicator until both are loaded
  }
  if (error) return <div className="error">{error}</div>;

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

  return (
    <div className="flightListRoundTrip">
      {departureFlights.length === 0 &&
      returnFlights.length === 0 &&
      flightsLoaded ? (
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
                  {flight.id === cheapestDeparture.id && (
                    <div className="flightListRoundTrip__label cheapest">
                      Cheapest
                    </div>
                  )}
                  {flight.id === fastestDeparture.id && (
                    <div className="flightListRoundTrip__label fastest">
                      Fastest
                    </div>
                  )}
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
                  {/* Label for Cheapest and Fastest */}
                  {flight.id === cheapestReturn.id && (
                    <div className="flightListRoundTrip__label cheapest">
                      Cheapest
                    </div>
                  )}
                  {flight.id === fastestReturn.id && (
                    <div className="flightListRoundTrip__label fastest">
                      Fastest
                    </div>
                  )}

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
      {selectedDeparture && selectedReturn && (
        <div className="Flight_list_round_trip__flight-bottom-modal-container">
          <div className="Flight_list_round_trip__flight-bottom-modal">
            <div className="Flight_list_round_trip__column">
              {/* Departure Flight */}
              <div className="Flight_list_round_trip__flight-info">
                <span className="Flight_list_round_trip__flight-number">
                  {selectedDeparture?.itineraries[0]?.segments[0]?.carrierCode}{" "}
                  {selectedDeparture?.itineraries[0]?.segments[0]?.number}
                </span>
              </div>
              <div className="Flight_list_round_trip__start-time">
                <span className="Flight_list_round_trip__time">
                  {formatTime(
                    selectedDeparture?.itineraries[0]?.segments[0]?.departure
                      ?.at
                  )}
                </span>
                <span className="Flight_list_round_trip__location">
                  {fromAirport?.address.cityName}, {fromAirport?.iataCode}
                </span>
              </div>
              <FaArrowRight />
              <div className="Flight_list_round_trip__end-time">
                <span className="Flight_list_round_trip__time">
                  {formatTime(
                    selectedDeparture?.itineraries[0]?.segments[0]?.arrival?.at
                  )}
                </span>
                <span className="Flight_list_round_trip__location">
                  {toAirport?.address.cityName}, {toAirport?.iataCode}
                </span>
              </div>
            </div>

            <div className="Flight_list_round_trip__column">
              {/* Return Flight */}
              <div className="Flight_list_round_trip__flight-info">
                <span className="Flight_list_round_trip__flight-number">
                  {selectedReturn?.itineraries[0]?.segments[0]?.carrierCode}{" "}
                  {selectedReturn?.itineraries[0]?.segments[0]?.number}
                </span>
              </div>
              <div className="Flight_list_round_trip__start-time">
                <span className="Flight_list_round_trip__time">
                  {formatTime(
                    selectedReturn?.itineraries[0]?.segments[0]?.departure?.at
                  )}
                </span>
                <span className="Flight_list_round_trip__location">
                  {toAirport?.address.cityName}, {toAirport?.iataCode}
                </span>
              </div>
              <FaArrowRight />
              <div className="Flight_list_round_trip__end-time">
                <span className="Flight_list_round_trip__time">
                  {formatTime(
                    selectedReturn?.itineraries[0]?.segments[0]?.arrival?.at
                  )}
                </span>
                <span className="Flight_list_round_trip__location">
                  {fromAirport?.address.cityName}, {fromAirport?.iataCode}
                </span>
              </div>
            </div>

            <div className="Flight_list_round_trip__column">
              {/* Price and Book Now */}
              <div className="Flight_list_round_trip__total-price">
                <span>
                  {userCurrency}{" "}
                  {convertPrice(
                    parseFloat(selectedDeparture?.price?.total || "0") +
                      parseFloat(selectedReturn?.price?.total || "0")
                  ).toFixed(2)}
                </span>
              </div>
              <button onClick={handleBookNow}>Book Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightListRoundTrip;
