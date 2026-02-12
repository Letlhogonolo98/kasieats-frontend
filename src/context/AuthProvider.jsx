import React, { useState } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [vendor, setVendor] = useState(() => {
    const saved = localStorage.getItem('kasiEats_vendor');
    if (saved && saved !== "undefined") {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Auth storage error", e);
        return null;
      }
    }
    return null;
  });

  const login = (vendorData) => {
    setVendor(vendorData);
    localStorage.setItem('kasiEats_vendor', JSON.stringify(vendorData));
  };

  const logout = () => {
    setVendor(null);
    localStorage.removeItem('kasiEats_vendor');
  };

  return (
    <AuthContext.Provider value={{ vendor, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};