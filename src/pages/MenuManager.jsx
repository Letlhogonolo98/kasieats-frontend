import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

const MenuManager = () => {
  const { vendor } = useAuth();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);

const handleAdd = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  let imageUrl = "";

  try {
    // Upload to Cloudinary if an image is selected
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "kasieats_preset"); 

      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/drhcoware/image/upload", {
        method: "POST",
        body: formData,
      });
      const cloudData = await cloudRes.json();
      imageUrl = cloudData.secure_url; // This is the public link to the image
    }

    // Save to the Backend
    const res = await fetch('http://localhost:5144/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...newItem, 
        price: parseFloat(newItem.price), 
        vendorId: vendor.id,
        imageUrl: imageUrl // Send the link to our DB
      })
    });

    if (res.ok) {
      setNewItem({ name: '', price: '', description: '' });
      setImageFile(null);
      fetchItems();
    }
  } catch {
    alert("Upload failed");
  } finally {
    setLoading(false);
  }
};

  //  Wrap fetch in useCallback to prevent unnecessary re-renders
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

  // Trigger the fetch on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handle adding a new item
 /* const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5144/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newItem, 
          price: parseFloat(newItem.price),
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
  };*/

  // Handle deleting an item
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

          <div>
  <label className="text-xs font-bold uppercase text-gray-400">Food Image</label>
  <input 
    type="file" 
    accept="image/*"
    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
    onChange={(e) => setImageFile(e.target.files[0])}
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

      {/* Menu List Section */}
<section className="mt-12">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-black text-gray-800">Live Menu Items</h2>
    <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold">
      {items.length} Items Total
    </span>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {items.length === 0 ? (
      <div className="col-span-full py-20 bg-gray-50 rounded-4xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
        <div className="text-5xl mb-4">🥣</div>
        <p className="text-gray-400 font-bold italic">Your menu is empty. Add your first item above!</p>
      </div>
    ) : (
      items.map((item) => (
        <div 
          key={item.id} 
          className="bg-white p-4 rounded-4xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md hover:border-orange-200 transition-all group"
        >
          {/* Image Thumbnail */}
          <div className="w-24 h-24 bg-gray-100 rounded-3xl overflow-hidden shrink-0 border border-gray-50 relative">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">🍔</div>
            )}
          </div>

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-gray-800 text-lg truncate mb-1">
              {item.name}
            </h3>
            <p className="text-gray-400 text-xs line-clamp-2 mb-2 leading-relaxed">
              {item.description || "No description provided for this item."}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-orange-600 font-black text-lg">
                R {parseFloat(item.price).toFixed(2)}
              </p>
              
              {/* Delete Button */}
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Remove Item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</section>
    </div>
  );
};

export default MenuManager;