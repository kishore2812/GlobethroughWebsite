import React from "react";

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
      <h1>Our Incentives</h1>
      <div className="incentives-list">
        {incentives.map((incentive) => (
          <div key={incentive.id} className="incentive-card">
            <img
              src={incentive.imageUrl}
              alt={incentive.title}
              className="incentive-image"
            />
            <h2>{incentive.title}</h2>
            <p>{incentive.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncentivesPage;
