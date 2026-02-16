import React, { useState } from 'react';
import VendorSidebar from './VendorSidebar';
import { useAuth } from '../hooks/useAuth';

const VendorLayout = ({ children }) => {
  const { vendor } = useAuth();
  const [isOpen, setIsOpen] = useState(vendor?.isOpen || false);

  const toggleStatus = async () => {
    try {
      const res = await fetch(`http://localhost:5144/api/vendors/${vendor.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(!isOpen) // Toggle the current state
      });

      if (res.ok) {
        setIsOpen(!isOpen);
      }
    } catch {
      console.error("Failed to update status");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden md:block w-72 h-screen sticky top-0 shrink-0">
        <VendorSidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Status Badge */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Store Management</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* The Status Badge */}
            <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all ${
              isOpen ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
            }`}>
              <span className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className={`text-xs font-black uppercase ${isOpen ? 'text-green-700' : 'text-red-700'}`}>
                {isOpen ? 'Accepting Orders' : 'Shop Closed'}
              </span>
              <button 
                onClick={toggleStatus}
                className="ml-2 text-[10px] font-bold bg-white border px-3 py-1 rounded-lg hover:shadow-sm active:scale-95 transition"
              >
                {isOpen ? 'GO OFFLINE' : 'GO LIVE'}
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;