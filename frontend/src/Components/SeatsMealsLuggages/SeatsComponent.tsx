import React, { useEffect, useState } from "react";
import "./SeatsComponent.scss"; // Import the compiled SCSS file
import axios from "axios";
import useFlightStore from "../../Stores/FlightStore";

interface Seat {
  number: string;
  characteristicsCodes: string[];
  available: boolean;
  price?: { total: string; currency: string };
  coordinates: { x: number; y: number };
}

interface Deck {
  deckType: string;
  deckConfiguration: {
    width: number;
    length: number;
  };
  seats: Seat[];
}

interface FlightSeatMap {
  id: string;
  departure: { iataCode: string; at: string };
  arrival: { iataCode: string; at: string };
  decks: Deck[];
}

const SeatsComponent: React.FC = () => {
  const [seatMaps, setSeatMaps] = useState<FlightSeatMap[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Record<string, string[]>>(
    {}
  );
  const [currentFlightIndex, setCurrentFlightIndex] = useState(0);

  const { selectedFlight } = useFlightStore();

  const fetchToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/amadeus/token");
      return response.data.access_token;
    } catch {
      return null;
    }
  };

  const fetchSeatMaps = async (token: string, flightOffer: any) => {
    try {
      const response = await axios.post(
        `https://test.api.amadeus.com/v1/shopping/seatmaps`,
        { data: [flightOffer] },
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
      console.error("Error fetching seat map:", error);
    }
  };

  useEffect(() => {
    const fetchSeats = async () => {
      const token = await fetchToken();
      if (token && selectedFlight) {
        fetchSeatMaps(token, selectedFlight);
      }
    };

    fetchSeats();
  }, [selectedFlight]);

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

  const handleNextFlight = () => {
    setCurrentFlightIndex((prevIndex) =>
      prevIndex < seatMaps.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevFlight = () => {
    setCurrentFlightIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : seatMaps.length - 1
    );
  };

  if (seatMaps.length === 0) return <p>Loading seat maps...</p>;

  const currentFlight = seatMaps[currentFlightIndex];

  return (
    <div className="SeatsComponents__container">
      {/* Flight Info & Navigation */}
      <div className="SeatsComponents__flight-header">
        <button onClick={handlePrevFlight}>&#9664; Prev</button>
        <h3>
          {currentFlight.departure.iataCode} → {currentFlight.arrival.iataCode}
        </h3>
        <button onClick={handleNextFlight}>Next &#9654;</button>
      </div>

      {/* Seats Layout */}
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
