import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

const OrderFeed = () => {
  const { vendor } = useAuth();
  
  // State Management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Refs & Audio
  const prevOrderCount = useRef(0);
  // Using a reliable notification sound URL
  const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');

  // 1. Fetch Orders Logic
  const fetchOrders = useCallback(async () => {
    if (!vendor?.id) return;

    try {
      const res = await fetch(`http://localhost:5144/api/orders/vendor/${vendor.id}`);
      if (res.ok) {
        const data = await res.json();
        
        // Filter out completed/archived orders for the live feed
        const activeOrders = data.filter(o => o.status !== 'Completed');
        
        // --- 🛎️ THE DING LOGIC ---
        // If current active count > previous count, we have a new order!
        if (activeOrders.length > prevOrderCount.current) {
          // Fixed: Use '_' for unused error parameter
          notificationSound.play().catch(() => 
            console.log("Audio blocked: Interaction required to enable sounds.")
          );
        }
        
        prevOrderCount.current = activeOrders.length;
        setOrders(activeOrders);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      // Fixed: Loading is now used to show the spinner
      setLoading(false);
    }
  }, [notificationSound, vendor.id]);

  // 2. Polling Effect (Checks for new orders every 10 seconds)
  useEffect(() => {
    if (vendor?.id) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000); 
      return () => clearInterval(interval); 
    }
  }, [vendor?.id, fetchOrders]);

  // 3. Update Status Logic
  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch(`http://localhost:5144/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(status)
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // --- UI RENDERING ---

  if (!vendor) return <div className="p-8 font-bold text-center">Checking vendor credentials...</div>;

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Syncing with kitchen...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 italic">Order Feed</h1>
          <p className="text-gray-500 font-medium">Real-time incoming requests</p>
        </div>
        <div className="flex items-center gap-3 bg-white border px-6 py-3 rounded-2xl shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="font-black text-gray-700">{orders.length} Live Orders</span>
        </div>
      </header>
      
      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="p-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
            <div className="text-5xl mb-4">🧊</div>
            <p className="text-gray-400 font-bold text-lg italic">Kitchen is clear. Relax while you wait!</p>
          </div>
        ) : (
          orders.map(order => (
            <div 
              key={order.id} 
              className={`bg-white p-6 rounded-4xl shadow-sm border-l-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:shadow-md ${
                order.status === 'Pending' ? 'border-yellow-400' : 
                order.status === 'Cooking' ? 'border-blue-500' : 'border-green-500'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-widest">
                    #{order.id}
                  </span>
                  <span className="text-gray-400 text-sm font-bold">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                  {order.customerName}
                </h3>
                
                <div className="mt-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-gray-700 font-bold text-lg">{order.orderDetails}</p>
                </div>
                
                <p className="text-orange-600 font-black mt-3 text-xl">R {parseFloat(order.totalPrice).toFixed(2)}</p>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                {/* 🏁 THE ACTION BUTTONS */}
                {order.status === 'Pending' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'Cooking')} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-xs font-black shadow-lg shadow-blue-100 transition-all uppercase tracking-widest"
                  >
                    🔥 Start Cooking
                  </button>
                )}

                {order.status === 'Cooking' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'Ready')} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl text-xs font-black shadow-lg shadow-green-100 transition-all uppercase tracking-widest"
                  >
                    ✅ Mark as Ready
                  </button>
                )}

                {order.status === 'Ready' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'Completed')} 
                    className="w-full bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest"
                  >
                    📦 Order Collected
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderFeed;