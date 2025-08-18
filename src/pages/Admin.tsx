
import React, { useState } from 'react';
import AdminPanel from '../components/AdminPanel';
import AdminLogin from '../components/AdminLogin';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const Admin = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = () => {
    console.log('Admin login successful, hiding login form');
    setShowLogin(false);
  };

  const handleLogout = () => {
    console.log('Admin logout, showing login form');
    setShowLogin(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show login if not authenticated, not admin, or showLogin is true
  if (!isAuthenticated || !isAdmin || showLogin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
};

export default Admin;
