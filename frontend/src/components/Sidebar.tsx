import React from 'react';
import { LayoutGrid, Calendar, BarChart3, Users, Settings, HelpCircle, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeView, onNavigate, onLogout }) => {
  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', id: 'dashboard' },
    { icon: Calendar, label: 'Calendar', id: 'calendar' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics' },
    { icon: Users, label: 'Team', id: 'team' },
  ];

  const generalItems = [
    { icon: Settings, label: 'Settings', id: 'settings' },
    { icon: HelpCircle, label: 'Help', id: 'help' },
    { icon: LogOut, label: 'Logout', id: 'logout' },
  ];

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 border-3 border-white rounded-full"></div>
        </div>
        {isOpen && <span className="text-2xl font-semibold text-gray-900">Air Apex</span>}
      </div>

      <div className="px-4">
        <div className="text-xs font-semibold text-gray-400 mb-3 px-3">MENU</div>
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeView === item.id
                  ? 'bg-emerald-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              {isOpen && <span className="flex-1 text-left">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="text-xs font-semibold text-gray-400 mb-3 mt-6 px-3">GENERAL</div>
        <nav className="space-y-1">
          {generalItems.map((item, index) => (
            <button
              key={index}
              onClick={() => item.id === 'logout' ? onLogout() : onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeView === item.id
                  ? 'bg-emerald-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              } ${item.id === 'logout' ? 'text-red-600 hover:bg-red-50' : ''}`}
            >
              <item.icon size={20} />
              {isOpen && <span className="text-left">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
