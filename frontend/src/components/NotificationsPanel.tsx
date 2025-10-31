import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, Clock } from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'High AQI Alert',
      message: 'Air quality has reached unhealthy levels (AQI: 165)',
      time: '5 minutes ago',
      unread: true,
    },
    {
      id: 2,
      type: 'success',
      title: 'Device Connected',
      message: 'ESP8266-Living Room is now online and sending data',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      type: 'info',
      title: 'Weekly Report Available',
      message: 'Your air quality summary for this week is ready',
      time: '3 hours ago',
      unread: false,
    },
    {
      id: 4,
      type: 'warning',
      title: 'Sensor Maintenance',
      message: 'Device "Bedroom Sensor" requires calibration',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 5,
      type: 'success',
      title: 'Air Quality Improved',
      message: 'AQI dropped to healthy levels (AQI: 45)',
      time: '2 days ago',
      unread: false,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} className="text-orange-600" />;
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'info':
        return <Info size={20} className="text-blue-600" />;
      default:
        return <Info size={20} className="text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-50';
      case 'success':
        return 'bg-green-50';
      case 'info':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-end z-50 pt-20 pr-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-500">
              {notifications.filter((n) => n.unread).length} unread
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                    notification.unread ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 ${getBgColor(notification.type)} rounded-lg h-fit`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {notification.title}
                        </h4>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {notification.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200">
          <button className="w-full py-2 text-sm text-emerald-600 font-medium hover:bg-emerald-50 rounded-lg transition">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;

