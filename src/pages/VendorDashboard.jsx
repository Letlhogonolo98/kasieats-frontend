import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function VendorDashboard() {
  const { vendor, logout } = useAuth();
  const navigate = useNavigate();

  // 1. State for the menu list
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Sample Item", price: 50, description: "Example description", shopId: vendor?.id }
  ]);

  // 2. State for the form
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate('/vendor/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    // Here is the "Glue": We attach the vendor's ID to the product
    const newItem = {
      id: Date.now(),
      shopId: vendor?.id, // This links the product to THIS shop
      shopName: vendor?.name,
      ...formData,
      price: parseFloat(formData.price)
    };

    setMenuItems([...menuItems, newItem]);
    
    // Reset form
    setFormData({ name: '', price: '', description: '', image: '' });
    console.log("Saved to database for shop:", vendor?.name);
  };

  const deleteItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Dashboard Header */}
      <div className="bg-white border-b mb-8">
        <div className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              Welcome, <span className="text-orange-600">{vendor?.name || 'Vendor'}</span>
            </h1>
            <p className="text-gray-500">Manage your menu and track your sales</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm font-bold text-gray-400 hover:text-red-500 transition"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- FORM SECTION --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Menu Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Food Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                  placeholder="e.g. Special Burger"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Price (R)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Image URL</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
                <textarea 
                  rows="3"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="What makes this dish special?"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-all shadow-md shadow-orange-200">
                Add to Menu
              </button>
            </form>
          </div>
        </div>

        {/* --- PREVIEW SECTION --- */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Your Current Menu</h2>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
              {menuItems.length} Products
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  <p className="text-orange-600 font-bold mt-2 text-lg">R{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {menuItems.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No items on your menu yet. Add your first dish!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default VendorDashboard;