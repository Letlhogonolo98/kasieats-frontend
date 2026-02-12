import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

function FoodCard({ id, name, price, shopName, image }) {
  const { addToCart } = useCart();
    return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Food Image */}
      <div className="h-48 bg-gray-200 relative">
        <img 
          src={image || "https://placehold.co/400x300?text=Food+Image"} 
          alt={name}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg text-sm font-bold shadow-sm">
          R{price}
        </span>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
       <Link to={`/shop/${shopName}`} className="text-sm text-orange-500 hover:underline mb-4 block">
       {shopName}
       </Link>
        <button 
            onClick={() => addToCart({ id, name, price, shopName })}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 active:scale-95 transition-all text-sm"
          >
            Add +
          </button>
      </div>
    </div>
  );
}

export default FoodCard;