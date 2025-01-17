import React, { useState } from "react";
import "./LuggageComponent.scss";

// Import luggage icon
import { FaSuitcase } from "react-icons/fa";

const Luggage: React.FC = () => {
  // Sample luggage data
  const luggageOptions = [
    {
      id: 1,
      name: "Additional 20kg",
      price: "₹2000",
      added: false, // Track whether this luggage is added
    },
    {
      id: 2,
      name: "Additional 20kg",
      price: "₹2000",
      added: false,
    },
    {
      id: 3,
      name: "Additional 20kg",
      price: "₹2000",
      added: false,
    },
    {
      id: 4,
      name: "Additional 20kg",
      price: "₹2000",
      added: false,
    },
    {
      id: 5,
      name: "Additional 20kg",
      price: "₹2000",
      added: false,
    },
    {
      id: 6,
      name: "Additional 20kg",
      price: "₹2000",
      added: false,
    },
    {
      id: 7,
      name: "Additional 20kg",
      price: "₹2000",
      added: false,
    },
    {
      id: 8,
      name: "Additional 20kg",
      price: "₹2000",
      added: false,
    },
    {
      id: 9,
      name: "Additional 20kg",
      price: "₹2000",
      added: false,
    },
    {
      id: 10,
      name: "Additional 20kg",
      price: "₹2000",
      added: false,
    },
  ];

  // State for luggage options
  const [luggageCounts, setLuggageCounts] = useState(luggageOptions);

  const handleAddClick = (id: number) => {
    setLuggageCounts(
      luggageCounts.map((luggage) =>
        luggage.id === id
          ? { ...luggage, added: !luggage.added } // Toggle added state
          : luggage
      )
    );
  };

  return (
    <div className="luggage-container">
      {luggageCounts.map((luggage) => (
        <div key={luggage.id} className="luggage-card">
          <div className="luggage-icon">
            <FaSuitcase size={40} />
          </div>
          <div className="luggage-details">
            <div className="luggage-header">
              <h4>{luggage.name}</h4>
            </div>
            <span className="luggage-price">{luggage.price}</span>
          </div>

          {/* Add/Added Button */}
          <div
            className={`luggage-count ${luggage.added ? "added" : ""}`}
            onClick={() => handleAddClick(luggage.id)}
          >
            {luggage.added ? "Added" : "Add"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Luggage;
