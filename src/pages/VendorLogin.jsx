import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function VendorLogin() {
  const [shopName, setShopName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // In the future, this is where you call your C# API
    const mockVendor = { 
      id: Math.floor(Math.random() * 1000), 
      name: shopName 
    };
    
    login(mockVendor);
    navigate('/vendor/dashboard'); // Send them to the portal
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-xl rounded-2xl w-96">
        <h2 className="text-2xl font-black mb-6 text-gray-800 text-center">Vendor Login</h2>
        <input 
          type="text" 
          placeholder="Enter Shop Name"
          className="w-full p-3 border rounded-xl mb-4"
          onChange={(e) => setShopName(e.target.value)}
          required
        />
        <button className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700">
          Enter Portal
        </button>
      </form>
    </div>
  );
}

export default VendorLogin;