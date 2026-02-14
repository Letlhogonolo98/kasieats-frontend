import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const VendorRegister = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    password: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5144/api/vendors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Redirect to login
        alert("Account created successfully! Please log in.");
        navigate('/vendor/login');
      } else {
        // Server-side validation error (e.g., email already exists)
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-800">Join KasiEats</h2>
          <p className="text-gray-500 mt-2">Start selling your delicious meals today</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Shop Name</label>
            <input
              type="text"
              name="shopName"
              placeholder="e.g. Mojo's Kota"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
              value={formData.shopName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="vendor@example.com"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Brief Description</label>
            <textarea
              name="description"
              placeholder="What do you specialize in?"
              rows="3"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-black text-white transition-all ${
              loading ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200'
            }`}
          >
            {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/vendor/login" className="text-orange-600 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VendorRegister;