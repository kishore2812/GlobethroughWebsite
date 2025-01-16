import React, { useState } from "react";
import { MdOutlineAirlineSeatReclineNormal, MdLuggage } from "react-icons/md";
import { GiKnifeFork } from "react-icons/gi";
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
        return (
          <Seats totalSeats={210} columns={["A", "B", "C", "D", "E", "F"]} />
        );
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
              <div className="seats-meals-luggage-page__iconsContainer">
                <div
                  className={`icon-container ${
                    currentSection === "seats" ? "active" : ""
                  }`}
                  onClick={() => setCurrentSection("seats")}
                >
                  <MdOutlineAirlineSeatReclineNormal size={20} />
                </div>
                <p>Seats</p>
              </div>
              <div className="icon-divider"></div>
              <div className="seats-meals-luggage-page__iconsContainer">
                <div
                  className={`icon-container ${
                    currentSection === "meals" ? "active" : ""
                  }`}
                  onClick={() => setCurrentSection("meals")}
                >
                  <GiKnifeFork size={20} />
                </div>
                <p>Meals</p>
              </div>
              <div className="icon-divider"></div>
              <div className="seats-meals-luggage-page__iconsContainer">
                <div
                  className={`icon-container ${
                    currentSection === "luggage" ? "active" : ""
                  }`}
                  onClick={() => setCurrentSection("luggage")}
                >
                  <MdLuggage size={20} />
                </div>
                <p>Baggage</p>
              </div>
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
          <button className="seats-meals-luggage-page__proceed-button">
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatsMealsLuggage;
