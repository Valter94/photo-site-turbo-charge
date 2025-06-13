
import React from 'react';
import EnhancedAdminPanel from './admin/EnhancedAdminPanel';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  return <EnhancedAdminPanel onLogout={onLogout} />;
};

export default AdminPanel;
