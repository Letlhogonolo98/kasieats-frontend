import { useCart } from '../hooks/useCart';

function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Drawer Panel */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Basket</h2>
          <button onClick={onClose} className="text-2xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 italic">Your basket is empty, chief!</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4 border-b pb-2">
                <div>
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} × R{item.price}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm font-bold"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Total:</span>
            <span>R{totalPrice}</span>
          </div>
          <button className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;