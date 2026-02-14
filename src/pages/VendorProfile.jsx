import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const VendorProfile = () => {
  const { vendor, login } = useAuth();
const [formData, setFormData] = useState({
    shopName: vendor?.name || '',
    description: '',
    logoUrl: ''
  });
  const [message, setMessage] = useState('');

  // Fetch full profile details on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5144/api/vendors/${vendor.id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            shopName: data.shopName,
            description: data.description || '',
            logoUrl: data.logoUrl || ''
          });
        }
      } catch { console.error("Failed to load profile"); }
    };
    if (vendor?.id) fetchProfile();
  }, [vendor.id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5144/api/vendors/${vendor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updated = await response.json();
        // Update the AuthContext so the sidebar/header reflects the new name
        login({ ...vendor, name: updated.shopName });
        setMessage('Profile updated successfully!');
      }
    } catch {
      setMessage('Error updating profile.');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black mb-6">Store Settings</h1>
      
      {message && <div className="p-4 mb-4 bg-green-100 text-green-700 rounded-xl font-bold">{message}</div>}

      <form onSubmit={handleUpdate} className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Shop Name</label>
          <input 
            type="text"
            className="w-full p-3 border rounded-xl"
            value={formData.shopName}
            onChange={(e) => setFormData({...formData, shopName: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Shop Description</label>
          <textarea 
            rows="4"
            className="w-full p-3 border rounded-xl"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <button className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default VendorProfile;