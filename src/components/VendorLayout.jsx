import React from 'react';
import VendorSidebar from './VendorSidebar';

const VendorLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. The Sidebar - Fixed width */}
      <aside className="hidden md:block w-72 h-screen sticky top-0 shrink-0">
        <VendorSidebar />
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Optional Header / Top Bar */}
       {/* <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Live Store System
            </span>
          </div>/*}
          
        
        </header>

        {/* 3. The Page Content */}
        <main className="p-4 md:p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;