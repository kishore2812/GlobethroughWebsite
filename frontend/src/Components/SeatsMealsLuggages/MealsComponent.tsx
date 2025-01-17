import React, { useState } from "react";
import "./MealsComponent.scss";

// Import images
import grilledChickenImage from "../../assets/images/Meals.png";
import vegetableSaladImage from "../../assets/images/Meals.png";

const Meals: React.FC = () => {
  // Sample meal data with imported images
  const meals = [
    {
      id: 1,
      name: "Grilled Chicken",
      type: "nonveg",
      price: "$12.99",
      imageUrl: grilledChickenImage,
      count: 0,
    },
    {
      id: 2,
      name: "Vegetable Salad",
      type: "veg",
      price: "$8.99",
      imageUrl: vegetableSaladImage,
      count: 0,
    },
  ];

  const [mealCounts, setMealCounts] = useState(meals);

  const incrementCount = (id: number) => {
    setMealCounts(
      mealCounts.map((meal) =>
        meal.id === id ? { ...meal, count: meal.count + 1 } : meal
      )
    );
  };

  const decrementCount = (id: number) => {
    setMealCounts(
      mealCounts.map((meal) =>
        meal.id === id && meal.count > 0
          ? { ...meal, count: meal.count - 1 }
          : meal
      )
    );
  };

  return (
    <div className="meals-container">
      {mealCounts.map((meal) => (
        <div key={meal.id} className="meal-card">
          <img src={meal.imageUrl} alt={meal.name} className="meal-image" />
          <div className="meal-details">
            <div className="meal-header">
              <h4>{meal.name}</h4>
              <span className={`meal-type ${meal.type}`}></span>
            </div>
            <span className="meal-price">{meal.price}</span>
          </div>
          <div className="meal-count">
            <button onClick={() => decrementCount(meal.id)}>-</button>
            <span>{meal.count}</span>
            <button onClick={() => incrementCount(meal.id)}>+</button>
          </div>
          {meal.count > 0 && (
            <span className="meal-added">Added {meal.count}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Meals;
