import React from 'react';
import { Search, Mail, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenMessages: () => void;
  onOpenNotifications: () => void;
  unreadMessages?: number;
  unreadNotifications?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenMessages, 
  onOpenNotifications,
  unreadMessages = 2,
  unreadNotifications = 2,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-500">
              ⌘ F
            </kbd>
          </div>
        </div>

        {/* Right Side - Icons and Profile */}
        <div className="flex items-center gap-4 ml-6">
          <button 
            onClick={onOpenMessages}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <Mail size={20} />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>
          <button 
            onClick={onOpenNotifications}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full"></div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Shivam</div>
              <div className="text-xs text-gray-500">shivam@gmail.com</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
