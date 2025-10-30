import React, { useState, useEffect } from 'react';
import { Pause, Square } from 'lucide-react';

const TimeTracker: React.FC = () => {
  const [time, setTime] = useState(5048); // Initial time in seconds (01:24:08)
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white rounded-full"></div>
      </div>

      <div className="relative z-10">
        <h2 className="text-xl font-semibold mb-6">Time Tracker</h2>
        
        <div className="text-center mb-6">
          <div className="text-5xl font-bold tracking-wider mb-2">
            {formatTime(time)}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-white text-emerald-700 p-4 rounded-full hover:bg-gray-100 transition shadow-lg"
          >
            <Pause size={24} fill="currentColor" />
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setTime(0);
            }}
            className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition shadow-lg"
          >
            <Square size={24} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
