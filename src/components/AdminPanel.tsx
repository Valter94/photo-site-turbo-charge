
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import AllSectionsManager from './admin/AllSectionsManager';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
              <p className="text-gray-600">Управление сайтом фотографа</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Выйти</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AllSectionsManager />
      </main>
    </div>
  );
};

export default AdminPanel;
