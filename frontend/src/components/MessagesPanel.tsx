import React from 'react';
import { X, Send, Paperclip, Smile } from 'lucide-react';

interface MessagesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessagesPanel: React.FC<MessagesPanelProps> = ({ isOpen, onClose }) => {
  const messages = [
    {
      id: 1,
      sender: 'Priya Sharma',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=ec4899&color=fff',
      message: 'The AQI levels in sector 5 are concerning. Should we increase monitoring?',
      time: '2 min ago',
      unread: true,
    },
    {
      id: 2,
      sender: 'Rahul Verma',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=3b82f6&color=fff',
      message: 'New sensor calibration is complete. All systems operational.',
      time: '15 min ago',
      unread: true,
    },
    {
      id: 3,
      sender: 'Anjali Patel',
      avatar: 'https://ui-avatars.com/api/?name=Anjali+Patel&background=8b5cf6&color=fff',
      message: 'Can you review the latest air quality report?',
      time: '1 hour ago',
      unread: false,
    },
    {
      id: 4,
      sender: 'Vikram Singh',
      avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=f59e0b&color=fff',
      message: 'Dashboard UI update looks great! 👍',
      time: '3 hours ago',
      unread: false,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-end z-50 pt-20 pr-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col animate-slide-in" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Messages</h3>
            <p className="text-sm text-gray-500">
              {messages.filter((m) => m.unread).length} unread messages
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No messages</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                    message.unread ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <img
                        src={message.avatar}
                        alt={message.sender}
                        className="w-12 h-12 rounded-full"
                      />
                      {message.unread && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                          {message.sender}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {message.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Reply */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
              <Paperclip size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
              <Smile size={20} />
            </button>
            <button className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPanel;

