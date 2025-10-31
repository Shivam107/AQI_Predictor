import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Wind } from 'lucide-react';

interface CalendarViewProps {
  aqiData: { date: Date; aqi: number }[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ aqiData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getAqiColor = (aqi: number | null) => {
    if (aqi === null) return 'bg-gray-50 text-gray-400';
    if (aqi <= 50) return 'bg-green-100 text-green-800 border-green-300';
    if (aqi <= 100) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (aqi <= 150) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (aqi <= 200) return 'bg-red-100 text-red-800 border-red-300';
    if (aqi <= 300) return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const getAqiLabel = (aqi: number | null) => {
    if (aqi === null) return 'No Data';
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentDate]);

  const firstDayOfMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, 1).getDay();
  }, [currentDate]);

  const aqiDataMap = useMemo(() => {
    const map = new Map<string, number>();
    aqiData.forEach(({ date, aqi }) => {
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      map.set(key, aqi);
    });
    return map;
  }, [aqiData]);

  const getAqiForDate = (day: number): number | null => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const key = `${year}-${month}-${day}`;
    return aqiDataMap.get(key) ?? null;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2 bg-gray-50 border border-gray-100"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const aqi = getAqiForDate(day);
      const colorClass = getAqiColor(aqi);
      const today = isToday(day);

      days.push(
        <div
          key={day}
          className={`p-3 border transition-all hover:shadow-md ${colorClass} ${
            today ? 'ring-2 ring-emerald-500' : ''
          }`}
        >
          <div className="flex flex-col h-full">
            <div className={`text-sm font-semibold mb-1 ${today ? 'text-emerald-600' : ''}`}>
              {day}
            </div>
            {aqi !== null ? (
              <>
                <div className="flex items-center gap-1 mb-1">
                  <Wind size={14} />
                  <span className="text-xs font-medium">AQI</span>
                </div>
                <div className="text-2xl font-bold mb-1">{aqi}</div>
                <div className="text-xs font-medium opacity-80">{getAqiLabel(aqi)}</div>
              </>
            ) : (
              <div className="text-xs text-gray-400 mt-2">No data</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <p className="text-sm text-gray-500 mt-1">AQI Calendar View</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
          >
            Today
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600">Good (0-50)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-gray-600">Moderate (51-100)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
            <span className="text-gray-600">Unhealthy for Sensitive (101-150)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-gray-600">Unhealthy (151-200)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
            <span className="text-gray-600">Very Unhealthy (201-300)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-rose-100 border border-rose-300 rounded"></div>
            <span className="text-gray-600">Hazardous (300+)</span>
          </div>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default CalendarView;

