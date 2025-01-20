import React, { useState } from "react";
import "./Incentives.scss";
import Header from "../../Components/Header/Header";

interface Incentive {
  id: number;
  title: string;
  description: string;
}

const incentives: Incentive[] = [
  {
    id: 1,
    title: "Book 100 Tickets",
    description: "Unlock an ₹1400 . Start your journey to free trips!",
  },
  {
    id: 2,
    title: "Book 100 Tickets",
    description: "Unlock an ₹1400 . Start your journey to free trips!",
  },
  {
    id: 3,
    title: "Book 100 Tickets",
    description: "Unlock an ₹1400 . Start your journey to free trips!",
  },
  {
    id: 4,
    title: "Book 100 Tickets",
    description: "Unlock an ₹1400 . Start your journey to free trips!",
  },
];

const IncentivesPage: React.FC = () => {
  const [claimed, setClaimed] = useState<{ [key: number]: boolean }>({});

  const handleClaim = (id: number) => {
    setClaimed((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  };

  return (
    <div className="incentives-page">
      <div className="incentives-page-background">
        <div className="incentives-page-background-before"></div>
        <div className="incentives-page-background-after"></div>
      </div>
      <Header />
      <div className="incentives-page__container">
        <div className="incentives-page__card">
          <h1>Incentives And Rewards</h1>
          <div className="incentives-page__content">
            {incentives.map((incentive) => (
              <div key={incentive.id} className="incentives-page__item">
                <div className="incentives-page__number">{incentive.id}</div>
                <div className="incentives-page__description">
                  <h2>{incentive.title}</h2>
                  <p>{incentive.description}</p>
                </div>
                <button
                  className={`incentives-page__button ${
                    claimed[incentive.id]
                      ? "incentives-page__button--claimed"
                      : "incentives-page__button--claim-now"
                  }`}
                  onClick={() => handleClaim(incentive.id)}
                  disabled={claimed[incentive.id]} // Disable the button after claiming
                >
                  {claimed[incentive.id] ? "Claimed" : "Claim Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncentivesPage;
