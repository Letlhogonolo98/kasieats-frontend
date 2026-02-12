const categories = [
  { id: 1, name: "All", icon: "🍽️" },
  { id: 2, name: "Kotas", icon: "🍞" },
  { id: 3, name: "Platters", icon: "🍗" },
  { id: 4, name: "Burgers", icon: "🍔" },
  { id: 5, name: "Drinks", icon: "🥤" },
  { id: 6, name: "Chips", icon: "🍟" },
];

function CategoryBar({ activeCategory, setActiveCategory }) {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar px-6 py-4 bg-white">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.name)}
          className={`flex items-center space-x-2 px-5 py-2 rounded-full border transition-all whitespace-nowrap ${
            activeCategory === cat.name
              ? "bg-orange-500 text-white border-orange-500 shadow-md"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300"
          }`}
        >
          <span>{cat.icon}</span>
          <span className="font-medium">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}

export default CategoryBar;