import React, { useState } from "react";
import Header from "../../Components/Header/Header";
import PriceDetails from "../../Components/TicketDetails/TicketPriceDetails";
import Seats from "../../Components/SeatsMealsLuggages/SeatsComponent";
import Meals from "../../Components/SeatsMealsLuggages/MealsComponent";
import Luggage from "../../Components/SeatsMealsLuggages/LuggageComponent";
import "./SeatMealsLuggage.scss";

const SeatsMealsLuggage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<
    "seats" | "meals" | "luggage"
  >("seats");

  const handleSkip = () => {
    if (currentSection === "seats") {
      setCurrentSection("meals");
    } else if (currentSection === "meals") {
      setCurrentSection("luggage");
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "seats":
        return <Seats />;
      case "meals":
        return <Meals />;
      case "luggage":
        return <Luggage />;
      default:
        return null;
    }
  };

  return (
    <div className="seats-meals-luggage-page">
      <div className="seats-meals-luggage-page__background"></div>
      <Header />

      <div className="seats-meals-luggage-page__content">
        {/* Left Section */}
        <div className="seats-meals-luggage-page__left-section">
          <div className="seats-meals-luggage-page__card">
            <div className="seats-meals-luggage-page__icons">
              <button
                className={`icon-button ${
                  currentSection === "seats" ? "active" : ""
                }`}
                onClick={() => setCurrentSection("seats")}
              >
                <span role="img" aria-label="Seat">
                  💺
                </span>{" "}
                Seats
              </button>
              <button
                className={`icon-button ${
                  currentSection === "meals" ? "active" : ""
                }`}
                onClick={() => setCurrentSection("meals")}
              >
                <span role="img" aria-label="Meal">
                  🍽️
                </span>{" "}
                Meals
              </button>
              <button
                className={`icon-button ${
                  currentSection === "luggage" ? "active" : ""
                }`}
                onClick={() => setCurrentSection("luggage")}
              >
                <span role="img" aria-label="Luggage">
                  🧳
                </span>{" "}
                Luggage
              </button>

              <button className="skip-button" onClick={handleSkip}>
                Skip
              </button>
            </div>

            {/* Render the current section's content */}
            {renderCurrentSection()}
          </div>
        </div>

        {/* Right Section */}
        <div className="seats-meals-luggage-page__right-section">
          <PriceDetails />
        </div>
      </div>
    </div>
  );
};

export default SeatsMealsLuggage;
