
import React from 'react';
import AdminPanel from '../components/AdminPanel';
import AdminLogin from '../components/AdminLogin';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const Admin = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <AdminLogin onLogin={() => {}} />;
  }

  return <AdminPanel onLogout={() => {}} />;
};

export default Admin;
