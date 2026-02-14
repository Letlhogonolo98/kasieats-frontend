import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const VendorSidebar = () => {
  const { logout, vendor } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/vendor/dashboard', icon: '📊' },
    { name: 'Menu Manager', path: '/vendor/menu', icon: '🍔' },
    { name: 'Orders', path: '/vendor/orders', icon: '📝' },
    { name: 'Store Profile', path: '/vendor/profile', icon: '🏪' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-black text-orange-600">KasiEats</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Vendor Partner</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-xl font-bold transition-all ${
                isActive 
                  ? 'bg-orange-50 text-orange-600' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="bg-gray-50 p-4 rounded-2xl mb-4">
          <p className="text-xs text-gray-500">Logged in as</p>
          <p className="text-sm font-black truncate">{vendor?.name || 'Store Owner'}</p>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 p-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default VendorSidebar;