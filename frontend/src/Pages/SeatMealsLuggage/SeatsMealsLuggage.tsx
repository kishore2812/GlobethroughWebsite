import React from "react";

const SeatsMealsLuggage: React.FC = () => {
  return (
    <div className="seats-meals-luggage">
      <h2>Select Seats, Meals, and Luggage</h2>

      <div className="seats-meals-luggage__section">
        <h3>Seats Selection</h3>
        <p>Here you can choose your preferred seats.</p>
        <button>Select Seats</button>
      </div>

      <div className="seats-meals-luggage__section">
        <h3>Meals Selection</h3>
        <p>Here you can choose your preferred meals.</p>
        <button>Select Meals</button>
      </div>

      <div className="seats-meals-luggage__section">
        <h3>Luggage Options</h3>
        <p>Here you can choose your luggage options.</p>
        <button>Select Luggage</button>
      </div>

      <div className="seats-meals-luggage__actions">
        <button className="seats-meals-luggage__proceed-button">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default SeatsMealsLuggage;
