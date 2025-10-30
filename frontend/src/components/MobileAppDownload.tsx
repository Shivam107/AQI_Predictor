import React from 'react';
import { Download } from 'lucide-react';

const MobileAppDownload: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-5 right-5 w-20 h-20 border-2 border-white rounded-lg"></div>
        <div className="absolute bottom-5 left-5 w-16 h-16 border-2 border-white rounded-lg"></div>
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full"></div>
        </div>

        <h3 className="text-xl font-bold mb-2">Download our Mobile App</h3>
        <p className="text-gray-300 text-sm mb-6">Get easy in another way</p>

        <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
          <Download size={18} />
          Download
        </button>
      </div>
    </div>
  );
};

export default MobileAppDownload;
