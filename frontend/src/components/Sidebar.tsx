import React from 'react';
import { LayoutGrid, CheckSquare, Calendar, BarChart3, Users, Settings, HelpCircle, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', badge: null, active: true },
    { icon: CheckSquare, label: 'Tasks', badge: '13', active: false },
    { icon: Calendar, label: 'Calendar', badge: null, active: false },
    { icon: BarChart3, label: 'Analytics', badge: null, active: false },
    { icon: Users, label: 'Team', badge: null, active: false },
  ];

  const generalItems = [
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help' },
    { icon: LogOut, label: 'Logout' },
  ];

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 border-3 border-white rounded-full"></div>
        </div>
        {isOpen && <span className="text-2xl font-semibold text-gray-900">Donezo</span>}
      </div>

      <div className="px-4">
        <div className="text-xs font-semibold text-gray-400 mb-3 px-3">MENU</div>
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? 'bg-emerald-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              {isOpen && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-emerald-800 text-white text-xs px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </a>
          ))}
        </nav>

        <div className="text-xs font-semibold text-gray-400 mb-3 mt-6 px-3">GENERAL</div>
        <nav className="space-y-1">
          {generalItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <item.icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
