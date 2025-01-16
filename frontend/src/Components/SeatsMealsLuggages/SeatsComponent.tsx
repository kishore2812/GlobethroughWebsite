import React, { useState } from "react";
import "./SeatsComponent.scss"; // Import the compiled SCSS file

interface SeatMapProps {
  totalSeats: number;
  columns: string[];
}

const Seats: React.FC<SeatMapProps> = ({ totalSeats, columns }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Calculate number of rows needed
  const rows = Math.ceil(totalSeats / columns.length);

  const handleSeatClick = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  return (
    <div className="SeatsComponents__seats-container">
      {/* Cone-shaped border at the top */}

      {/* Seats container */}
      <div className="SeatsComponents__seat-grid">
        <div className="SeatsComponents__seat-header">
          <div className="SeatsComponents__seat-section">
            {columns.slice(0, 3).map((column) => (
              <div key={column} className="SeatsComponents__seat-column">
                {column}
              </div>
            ))}
          </div>
          <div className="SeatsComponents__row-number-placeholder"></div>
          <div className="SeatsComponents__seat-section">
            {columns.slice(3).map((column) => (
              <div key={column} className="SeatsComponents__seat-column">
                {column}
              </div>
            ))}
          </div>
        </div>

        {/* Rendering the rows of seats */}
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="SeatsComponents__seat-row">
            <div className="SeatsComponents__seat-section">
              {columns.slice(0, 3).map((column, colIndex) => {
                const seatNumber = rowIndex * columns.length + colIndex + 1;
                if (seatNumber > totalSeats) return null;
                const seatId = `${column}${seatNumber}`;
                return (
                  <button
                    key={seatId}
                    className={`SeatsComponents__seat ${
                      selectedSeats.includes(seatId) ? "selected" : ""
                    }`}
                    onClick={() => handleSeatClick(seatId)}
                  />
                );
              })}
            </div>
            <div className="SeatsComponents__row-number">{rowIndex + 1}</div>
            <div className="SeatsComponents__seat-section">
              {columns.slice(3).map((column, colIndex) => {
                const seatNumber = rowIndex * columns.length + colIndex + 4;
                if (seatNumber > totalSeats) return null;
                const seatId = `${column}${seatNumber}`;
                return (
                  <button
                    key={seatId}
                    className={`SeatsComponents__seat ${
                      selectedSeats.includes(seatId) ? "selected" : ""
                    }`}
                    onClick={() => handleSeatClick(seatId)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Display selected seats */}
      <div className="SeatsComponents__selected-seats">
        <h4>Selected Seats:</h4>
        <p>
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "No seats selected"}
        </p>
      </div>
    </div>
  );
};

export default Seats;
