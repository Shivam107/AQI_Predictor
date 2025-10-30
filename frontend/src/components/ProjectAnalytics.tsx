import React from 'react';

const ProjectAnalytics: React.FC = () => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const barHeights = [40, 80, 70, 90, 45, 50, 60]; // Heights in percentage

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Analytics</h2>
      
      <div className="flex items-end justify-between gap-4 h-48">
        {days.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-3">
            <div className="relative w-full flex flex-col justify-end" style={{ height: '160px' }}>
              {/* Bar with striped pattern for pending */}
              <div 
                className={`w-full rounded-lg transition-all duration-300 ${
                  index === 0 || index === 4 || index === 5 || index === 6
                    ? 'bg-gradient-to-br from-gray-300 to-gray-200'
                    : 'bg-gradient-to-br from-emerald-700 to-emerald-600'
                } ${
                  index === 0 || index === 4 || index === 5 || index === 6
                    ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,.3)_10px,rgba(255,255,255,.3)_20px)]'
                    : ''
                }`}
                style={{ height: `${barHeights[index]}%` }}
              >
                {index === 1 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded">
                    +3%
                  </div>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-600 font-medium">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectAnalytics;
