/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./SeatsComponent.scss";
import axios from "axios";
import useFlightStore from "../../Stores/FlightStore";

interface Seat {
  number: string;
  characteristicsCodes: string[];
  available: boolean;
  price?: { total: string; currency: string };
  coordinates: { x: number; y: number };
  flightIds: string[];
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
  decks?: Deck[]; // Made optional to handle missing seat maps
}

const SeatsComponent: React.FC = () => {
  const [seatMaps, setSeatMaps] = useState<FlightSeatMap[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Record<string, string[]>>(
    {}
  );
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  const { selectedTrip, selectedFlight, selectedDeparture, selectedReturn } =
    useFlightStore();

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
      return {
        ...prev,
        [flightId]: prevSeats.includes(seatNumber)
          ? prevSeats.filter((s) => s !== seatNumber)
          : [...prevSeats, seatNumber],
      };
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
    <div className="SeatsComponents__container">
      {/* Flight Info & Navigation */}
      <div className="SeatsComponents__flight-header">
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

      {/* Seat Map or Message */}
      {currentFlight.decks && currentFlight.decks.length > 0 ? (
        <div className="SeatsComponents__seat-grid">
          {currentFlight.decks.map((deck) => (
            <div key={deck.deckType} className="SeatsComponents__deck">
              {deck.seats.map((seat) => (
                <button
                  key={seat.number}
                  className={`SeatsComponents__seat ${
                    selectedSeats[currentFlight.id]?.includes(seat.number)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleSeatClick(currentFlight.id, seat.number)}
                  disabled={!seat.available}
                >
                  {seat.number}{" "}
                  {seat.price
                    ? `(${seat.price.total} ${seat.price.currency})`
                    : ""}
                </button>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="SeatsComponents__no-seatmap">
          Seat map not provided for this flight.
        </p>
      )}

      {/* Selected Seats */}
      <div className="SeatsComponents__selected-seats">
        <h4>
          Selected Seats for {currentFlight.departure.iataCode} →{" "}
          {currentFlight.arrival.iataCode}:
        </h4>
        <p>
          {selectedSeats[currentFlight.id]?.join(", ") || "No seats selected"}
        </p>
      </div>
    </div>
  );
};

export default SeatsComponent;
