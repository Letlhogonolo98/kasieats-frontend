import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartProvider';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import VendorDashboard from './pages/VendorDashboard';
import ShopPage from './pages/ShopPage';
import VendorLogin from './pages/VendorLogin';

function App() {
  return (
    /* 1. The Provider must be the outer-most wrapper for Cart to work */
    <CartProvider> 
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* 2. Navbar is inside the Provider so it can see the item count */}
          <Navbar />
          
          <main className="grow">
            <Routes>
              {/* 3. Your Roadmap of Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/vendor" element={<VendorDashboard />} />
              <Route path="/shop/:shopName" element={<ShopPage />} />
              <Route path="/login" element={<VendorLogin />} />
              {/* We will add the Checkout route here next! */}
            </Routes>
          </main>

          {/* Optional: Footer could go here */}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;