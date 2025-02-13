/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./SeatsComponent.scss";
import axios from "axios";
import useFlightStore from "../../Stores/FlightStore";

interface Seat {
  number: string;
  characteristicsCodes: string[];
  travelerPricing?: {
    travelerId: string;
    seatAvailabilityStatus: string;
    price?: { total: string; currency: string };
  }[];
  coordinates: { x: number; y: number };
}

interface Deck {
  deckType: string;
  deckConfiguration: { width: number; length: number };
  seats: Seat[];
}

interface FlightSeatMap {
  id: string;
  departure: { iataCode: string; at: string };
  arrival: { iataCode: string; at: string };
  decks?: Deck[];
}

const SeatsComponent: React.FC = () => {
  const [seatMaps, setSeatMaps] = useState<FlightSeatMap[]>([]);
  const [seatCharacteristics, setSeatCharacteristics] = useState<
    Record<string, string>
  >({});
  const [selectedSeats, setSelectedSeats] = useState<Record<string, string[]>>(
    {}
  );
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  // Fetch trip details and passenger count from Zustand stores
  const { selectedTrip, selectedFlight, selectedDeparture, selectedReturn } =
    useFlightStore();
  const { adults, children, infants } = useFlightStore();

  const passengerCount = adults + children + infants; // Total passengers

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get("http://localhost:5000/amadeus/token");
        return response.data.access_token;
      } catch {
        return null;
      }
    };

    const fetchSeatMaps = async (token: string, flightOffers: any[]) => {
      try {
        const response = await axios.post(
          `https://test.api.amadeus.com/v1/shopping/seatmaps`,
          { data: flightOffers },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.data.data) {
          console.error("Unexpected seat map response format:", response.data);
          return;
        }

        setSeatMaps(response.data.data);
        setSeatCharacteristics(response.data.dictionaries.seatCharacteristics);
      } catch (error) {
        console.error("Error fetching seat maps:", error);
      }
    };

    const loadSeatMaps = async () => {
      const token = await fetchToken();
      if (!token) return;

      const flightOffers: any[] = [];

      if (selectedTrip === "one-way" && selectedFlight) {
        flightOffers.push(selectedFlight);
      } else if (
        selectedTrip === "round-trip" &&
        selectedDeparture &&
        selectedReturn
      ) {
        flightOffers.push(selectedDeparture, selectedReturn);
      }

      if (flightOffers.length > 0) {
        fetchSeatMaps(token, flightOffers);
      }
    };

    loadSeatMaps();
  }, [selectedTrip, selectedFlight, selectedDeparture, selectedReturn]);

  const handleSeatClick = (flightId: string, seatNumber: string) => {
    setSelectedSeats((prev) => {
      const prevSeats = prev[flightId] || [];

      if (prevSeats.includes(seatNumber)) {
        // Deselect if already selected
        return {
          ...prev,
          [flightId]: prevSeats.filter((s) => s !== seatNumber),
        };
      } else if (prevSeats.length < passengerCount) {
        // Add seat if within limit
        return { ...prev, [flightId]: [...prevSeats, seatNumber] };
      } else {
        // Replace first seat if exceeding limit
        return { ...prev, [flightId]: [...prevSeats.slice(1), seatNumber] };
      }
    });
  };

  const handleNextSegment = () => {
    if (currentSegmentIndex < seatMaps.length - 1) {
      setCurrentSegmentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevSegment = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex((prevIndex) => prevIndex - 1);
    }
  };

  if (seatMaps.length === 0) return <p>Loading seat maps...</p>;

  const currentFlight = seatMaps[currentSegmentIndex];

  return (
    <div className="SeatsComponent__container">
      {/* Flight Info & Navigation */}
      <div className="SeatsComponent__header">
        <button
          onClick={handlePrevSegment}
          disabled={currentSegmentIndex === 0}
        >
          &#9664; Prev
        </button>
        <h3>
          {currentFlight.departure.iataCode} → {currentFlight.arrival.iataCode}
        </h3>
        <button
          onClick={handleNextSegment}
          disabled={currentSegmentIndex === seatMaps.length - 1}
        >
          Next &#9654;
        </button>
      </div>

      {/* Seat Map */}
      {currentFlight.decks && currentFlight.decks.length > 0 ? (
        <div className="SeatsComponent__grid">
          {currentFlight.decks.map((deck) => (
            <div key={deck.deckType} className="SeatsComponent__deck">
              {deck.seats.map((seat) => {
                const isAvailable = seat.travelerPricing?.some(
                  (pricing) => pricing.seatAvailabilityStatus === "AVAILABLE"
                );

                const seatTypeCodes = seat.characteristicsCodes.filter((code) =>
                  ["A", "W", "9"].includes(code)
                );
                const seatTypeText = seatTypeCodes
                  .map((code) => seatCharacteristics[code])
                  .join(", ");
                const extraChargeCurrencyCode =
                  seat.characteristicsCodes.includes("CH")
                    ? seat.travelerPricing?.[0]?.price?.currency
                    : null;

                const extraCharge = seat.characteristicsCodes.includes("CH")
                  ? seat.travelerPricing?.[0]?.price?.total
                  : null;

                return (
                  <div
                    key={seat.number}
                    className="SeatsComponent__seat-container"
                    style={{
                      gridColumn: seat.coordinates.y + 1,
                      gridRow: seat.coordinates.x + 1,
                    }}
                  >
                    <button
                      className={`SeatsComponent__seat ${
                        selectedSeats[currentFlight.id]?.includes(seat.number)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        isAvailable &&
                        handleSeatClick(currentFlight.id, seat.number)
                      }
                      disabled={!isAvailable}
                    ></button>
                    <span className="SeatsComponent__tooltip">
                      <div>{seat.number}</div>

                      <div>{seatTypeText}</div>

                      <div>
                        {extraChargeCurrencyCode}
                        {extraCharge}
                      </div>
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <p className="SeatsComponent__no-seatmap">
          Seat map not provided for this flight.
        </p>
      )}

      {/* Selected Seats */}
      <div className="SeatsComponent__selected">
        <h4>Selected Seats:</h4>
        <p>
          {selectedSeats[currentFlight.id]?.join(", ") || "No seats selected"}
        </p>
      </div>
    </div>
  );
};

export default SeatsComponent;
