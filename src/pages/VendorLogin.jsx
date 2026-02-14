import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const VendorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5144/api/vendors/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // data should contain { id, name, email } from your C# controller
        login(data); 
        navigate('/vendor/dashboard');
      } else {
        // This handles the "Unauthorized" message from C#
        setError(data.message || 'Invalid email or password');
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
          <h2 className="text-3xl font-black text-gray-800">Vendor Portal</h2>
          <p className="text-gray-500 mt-2">Welcome back! Please sign in to manage your shop.</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="vendor@example.com"
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-black text-white transition-all ${
              loading ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200'
            }`}
          >
            {loading ? 'Authenticating...' : 'SIGN IN'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Don't have a shop account?{' '}
          <Link to="/vendor/register" className="text-orange-600 font-bold hover:underline">
            Register your Shop
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VendorLogin;