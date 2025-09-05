
import React, { useState } from 'react';
import AdminPanel from '../components/AdminPanel';
import AdminLogin from '../components/AdminLogin';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const Admin = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  const handleLogin = () => {
    // Force re-check of auth state after login
    window.location.reload();
  };

  const handleLogout = () => {
    // Page will reload after logout to show login form
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show login if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
};

export default Admin;
