import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

const OrderFeed = () => {
  const { vendor } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // UseCallback ensures the function isn't re-created unless vendor.id changes
  const fetchOrders = useCallback(async () => {
    if (!vendor?.id) return;

    try {
      const res = await fetch(`http://localhost:5144/api/orders/vendor/${vendor.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [vendor?.id]); 

  useEffect(() => {
    if (vendor?.id) {
      fetchOrders();

      const interval = setInterval(() => {
        fetchOrders();
      }, 15000); // Poll every 15 seconds

      return () => clearInterval(interval); 
    }
  }, [vendor?.id, fetchOrders]); 

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

  // 🏁 Handle the initial loading state
  if (!vendor) return <div className="p-8 font-bold">Authenticating...</div>;
  if (loading && orders.length === 0) return <div className="p-8">Loading orders...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Live Orders 🛎️</h1>
        <button 
          onClick={fetchOrders} 
          className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl font-bold transition"
        >
          Refresh Now
        </button>
      </div>
      
      <div className="grid gap-6">
        {orders.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-4xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">Waiting for new orders...</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                   <span className="text-xs font-black bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase tracking-tighter">
                     ORDER #{order.id}
                   </span>
                   <span className="text-gray-400 text-sm">
                     {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{order.customerName}</h3>
                <p className="text-gray-500 font-medium mt-1">{order.orderDetails}</p>
                <p className="text-orange-600 font-black mt-2 text-lg">R {parseFloat(order.totalPrice).toFixed(2)}</p>
              </div>

              <div className="flex flex-col gap-3 items-end w-full md:w-auto">
                <span className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border ${
                  order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                  order.status === 'Cooking' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                  'bg-green-50 text-green-700 border-green-100'
                }`}>
                  ● {order.status}
                </span>
                
                <div className="flex gap-2 w-full md:w-auto">
                  {order.status === 'Pending' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Cooking')} 
                      className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-100"
                    >
                      START COOKING
                    </button>
                  )}
                  {order.status === 'Cooking' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Ready')} 
                      className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-green-100"
                    >
                      MARK READY
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderFeed;