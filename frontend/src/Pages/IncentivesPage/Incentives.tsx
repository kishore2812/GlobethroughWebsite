import React from "react";
import "./Incentives.scss";
import Header from "../../Components/Header/Header";

interface Incentive {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const incentives: Incentive[] = [
  {
    id: 1,
    title: "Discount on First Purchase",
    description:
      "Get 20% off on your first order when you sign up for our newsletter.",
    imageUrl: "/images/discount.png",
  },
  {
    id: 2,
    title: "Free Shipping",
    description: "Enjoy free shipping on orders over $50.",
    imageUrl: "/images/free-shipping.png",
  },
  {
    id: 3,
    title: "Loyalty Points",
    description:
      "Earn points for every purchase and redeem them for discounts.",
    imageUrl: "/images/loyalty-points.png",
  },
];

const IncentivesPage: React.FC = () => {
  return (
    <div className="incentives-page">
      <div className="incentives-page-background">
        <div className="incentives-page-background-before"></div>
        <div className="incentives-page-background-after"></div>
      </div>
      <Header />
      <div className="incentives-page__container">
        <div className="incentives-page__card">
          <h1>Our Incentives</h1>
          <div className="incentives-page__content">
            {incentives.map((incentive) => (
              <div key={incentive.id} className="incentives-page__item">
                <div className="incentives-page__number">{incentive.id}</div>
                <div className="incentives-page__description">
                  <h2>{incentive.title}</h2>
                  <p>{incentive.description}</p>
                  <button className="incentives-page__button">Claim Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncentivesPage;
