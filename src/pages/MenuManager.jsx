import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

const MenuManager = () => {
  const { vendor } = useAuth();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });
  const [loading, setLoading] = useState(false);

  // 1. Professional way: Wrap fetch in useCallback to prevent unnecessary re-renders
  const fetchItems = useCallback(async () => {
    if (!vendor?.id) return;
    
    try {
      const res = await fetch(`http://localhost:5144/api/menu/vendor/${vendor.id}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch {
      console.error("Failed to fetch menu items");
    }
  }, [vendor?.id]);

  // 2. Trigger the fetch on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // 3. Handle adding a new item
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5144/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newItem, 
          price: parseFloat(newItem.price), // Ensure price is a number for C# decimal
          vendorId: vendor.id 
        })
      });

      if (res.ok) {
        setNewItem({ name: '', price: '', description: '' });
        fetchItems(); // Refresh list
      }
    } catch {
      alert("Error adding item");
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle deleting an item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;

    try {
      const res = await fetch(`http://localhost:5144/api/menu/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch {
      console.error("Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-800">Menu Manager</h1>
        <p className="text-gray-500">Add or remove items from your shop's menu.</p>
      </header>

      {/* Add Item Card */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10">
        <h2 className="text-lg font-bold mb-4 text-orange-600">Add New Kota</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input 
              placeholder="Item Name (e.g. Russian & Chips Kota)"
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              required
            />
          </div>
          <div>
            <input 
              type="number"
              placeholder="Price (R)"
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              required
            />
          </div>
          <div className="md:col-span-3">
            <textarea 
              placeholder="Description (Ingredients, special sauces...)"
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            />
          </div>
          <button 
            disabled={loading}
            className="md:col-start-3 bg-orange-600 text-white font-bold p-3 rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-100 disabled:bg-gray-300"
          >
            {loading ? 'Saving...' : 'Add to Menu'}
          </button>
        </form>
      </section>

      {/* Menu List */}
      <section className="grid grid-cols-1 gap-4">
        <h2 className="text-xl font-black text-gray-800 mb-2">Current Menu</h2>
        {items.length === 0 ? (
          <div className="text-center py-10 bg-gray-100 rounded-3xl border-2 border-dashed">
            <p className="text-gray-400 font-bold">Your menu is empty. Add your first item above!</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-orange-200 transition">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-1">{item.description}</p>
                <p className="text-orange-600 font-black mt-1">R {parseFloat(item.price).toFixed(2)}</p>
              </div>
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                title="Delete Item"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default MenuManager;