import React from 'react';
import { Video } from 'lucide-react';

const Reminders: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Reminders</h2>
      
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-1">Meeting with Arc Company</h3>
        <p className="text-sm text-gray-500 mb-4">Time : 02.00 pm - 04.00 pm</p>
        
        <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
          <Video size={18} />
          Start Meeting
        </button>
      </div>
    </div>
  );
};

export default Reminders;
