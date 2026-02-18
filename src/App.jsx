import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartProvider';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import VendorDashboard from './pages/VendorDashboard';
import ShopPage from './pages/ShopPage';
import VendorLogin from './pages/VendorLogin';
import VendorRegister from './pages/VendorRegister';
import VendorProfile from './pages/VendorProfile';
import VendorLayout from './components/VendorLayout';
import MenuManager from './pages/MenuManager';
import OrderFeed from './pages/OrderFeed';

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
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/shop/:shopName" element={<ShopPage />} />
              <Route path="/vendor/login" element={<VendorLogin />} />
              <Route path="/vendor/orders" element={<VendorLayout><OrderFeed /></VendorLayout>} />
              <Route path="/vendor/menu" element={<VendorLayout><MenuManager /></VendorLayout>} />
              <Route path="/vendor/register" element={<VendorRegister />} />
             <Route 
  path="/vendor/dashboard" 
  element={<VendorLayout><VendorDashboard /></VendorLayout>} 
/>
<Route 
  path="/vendor/profile" 
  element={<VendorLayout><VendorProfile /></VendorLayout>} 
/>
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