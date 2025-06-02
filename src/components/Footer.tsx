
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Фотограф Ирина</h3>
            <p className="text-gray-400">
              Профессиональная фотосъемка в Москве и Московской области. 
              Создаем незабываемые моменты вашей жизни.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Свадебная съемка</li>
              <li>Love Story</li>
              <li>Портретная съемка</li>
              <li>Семейная фотосессия</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <div className="space-y-2 text-gray-400">
              <p>📞 +7 (925) 506-24-27</p>
              <p>📧 Bagreshevafoto@gmail.com</p>
              <p>📍 Москва, Россия</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-center">
          <p className="text-gray-400">
            © 2024 Фотограф Ирина. Все права защищены.
          </p>
          
          <Link 
            to="/admin" 
            className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-sm"
          >
            <Settings className="h-4 w-4" />
            <span>Админ</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
