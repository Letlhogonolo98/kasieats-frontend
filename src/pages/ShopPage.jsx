import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // This helps us read the Shop Name from the URL
import FoodCard from "../components/FoodCard";

function ShopPage() {
  const { shopName } = useParams(); // Get the name from the URL
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5144/api/food")
      .then((res) => res.json())
      .then((data) => {
        // Filter the meals to only show ones from THIS shop
        const shopMeals = data.filter(meal => meal.shopName === shopName);
        setMeals(shopMeals);
      });
  }, [shopName]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Header */}
      <div className="bg-white border-b p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">{shopName}</h1>
        <p className="text-orange-500 font-medium">Open for orders 🟢</p>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-6 italic text-gray-600">Our Menu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {meals.map((meal) => (
            <FoodCard key={meal.id} {...meal} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShopPage;