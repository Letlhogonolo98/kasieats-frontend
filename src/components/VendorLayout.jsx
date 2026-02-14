import React from 'react';
import VendorSidebar from './VendorSidebar';

const VendorLayout = ({ children }) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <VendorSidebar />
      {/* ml-64 adds margin-left so the content doesn't 
          get hidden behind the fixed sidebar 
      */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default VendorLayout;