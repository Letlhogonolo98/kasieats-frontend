import { useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";
import CategoryBar from "../components/CategoryBar";

function HomePage() {
  const [meals, setMeals] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 New state for search

  useEffect(() => {
    fetch("http://localhost:5144/api/food")
      .then((res) => res.json())
      .then((data) => setMeals(data));
  }, []);

  // Checks Category AND Search Term
  const filteredMeals = meals.filter(meal => {
    const matchesCategory = activeCategory === "All" || meal.category === activeCategory;
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          meal.shopName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero & Search Section */}
      <div className="bg-orange-500 py-10 px-6 text-center">
        <h1 className="text-3xl font-black text-white mb-6">What are we eating today?</h1>
        
        <div className="max-w-md mx-auto relative">
          <input 
            type="text"
            placeholder="Search for a Kota, Burger or Shop..."
            className="w-full p-4 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search on every keystroke
          />
          <span className="absolute right-4 top-4 text-gray-400 text-xl">🔍</span>
        </div>
      </div>

      <CategoryBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{activeCategory} Items</h2>
          <p className="text-gray-500">{filteredMeals.length} results found</p>
        </div>
        
        {/* Empty State: If nothing matches */}
        {filteredMeals.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl italic">"Eish, we couldn't find that one. Try searching for something else!"</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMeals.map((meal) => (
            <FoodCard key={meal.id} {...meal} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;