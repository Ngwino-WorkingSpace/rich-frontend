// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import SupportPage from "./components/support/SupportPage";
import Home from "./Pages/Home";
import WalletPage from "./Pages/Wallet";
import SettingsPage from "./Pages/Settings";
import PoolPage from "./Pages/PoolPage";
import ConnectWallet from "./Pages/ConnectWallet";
import LoginSignUp from "./Pages/loginAndSignUp";
import PoolDetails from "./Pages/pool-details";
import Market from "./Pages/Market";
import NotFound from "./Pages/NotFound";
import Loader from "./components/Loader";
import CreatePool from "./Pages/CreatePool";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/connect" element={<ConnectWallet />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pool" 
          element={
            <ProtectedRoute>
              <PoolPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/support" 
          element={
            <ProtectedRoute>
              <SupportPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wallet" 
          element={
            <ProtectedRoute>
              <WalletPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pool-details/:address" 
          element={
            <ProtectedRoute>
              <PoolDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pools/:inviteId" 
          element={
            <ProtectedRoute>
              <PoolDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/markets" 
          element={
            <ProtectedRoute>
              <Market />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-pool" 
          element={
            <ProtectedRoute>
              <CreatePool />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
