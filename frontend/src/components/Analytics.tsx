import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity, Wind, Droplets, ThermometerSun, Calendar } from 'lucide-react';

interface AnalyticsProps {
  history: { t: string; aqi: number }[];
  currentAqi: number | null;
}

const Analytics: React.FC<AnalyticsProps> = ({ history, currentAqi }) => {
  const stats = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        avgAqi: 0,
        maxAqi: 0,
        minAqi: 0,
        trend: 0,
        goodDays: 0,
        badDays: 0,
      };
    }

    const aqiValues = history.map(h => h.aqi);
    const avgAqi = aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length;
    const maxAqi = Math.max(...aqiValues);
    const minAqi = Math.min(...aqiValues);
    
    // Calculate trend (comparing first half vs second half)
    const mid = Math.floor(aqiValues.length / 2);
    const firstHalf = aqiValues.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
    const secondHalf = aqiValues.slice(mid).reduce((a, b) => a + b, 0) / (aqiValues.length - mid);
    const trend = ((secondHalf - firstHalf) / firstHalf) * 100;

    const goodDays = aqiValues.filter(v => v <= 100).length;
    const badDays = aqiValues.filter(v => v > 100).length;

    return { avgAqi: Math.round(avgAqi), maxAqi, minAqi, trend, goodDays, badDays };
  }, [history]);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
    trend?: number;
  }> = ({ icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Comprehensive air quality insights and trends</p>
        </div>
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-2">
          <Calendar size={20} />
          Last 30 Days
        </button>
      </div>

      {/* Current AQI Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Current Air Quality Index</p>
            <h2 className="text-5xl font-bold mb-2">{currentAqi ?? '--'}</h2>
            <p className="text-emerald-100">
              {currentAqi ? (currentAqi <= 50 ? 'Good' : currentAqi <= 100 ? 'Moderate' : 'Unhealthy') : 'Loading...'}
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Wind size={48} />
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Activity size={24} className="text-blue-600" />}
          title="Average AQI"
          value={stats.avgAqi}
          subtitle="Past 30 days average"
          color="bg-blue-50"
        />
        <StatCard
          icon={<TrendingUp size={24} className="text-red-600" />}
          title="Peak AQI"
          value={stats.maxAqi}
          subtitle="Highest recorded"
          color="bg-red-50"
        />
        <StatCard
          icon={<TrendingDown size={24} className="text-green-600" />}
          title="Lowest AQI"
          value={stats.minAqi}
          subtitle="Best air quality"
          color="bg-green-50"
        />
        <StatCard
          icon={<Wind size={24} className="text-purple-600" />}
          title="Trend"
          value={stats.trend > 0 ? 'Worsening' : 'Improving'}
          subtitle={`${Math.abs(stats.trend).toFixed(1)}% change`}
          color="bg-purple-50"
          trend={stats.trend}
        />
      </div>

      {/* Air Quality Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Air Quality Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Good Days (0-100)</span>
                <span className="font-semibold text-green-600">{stats.goodDays}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${(stats.goodDays / (stats.goodDays + stats.badDays)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Unhealthy Days (100+)</span>
                <span className="font-semibold text-red-600">{stats.badDays}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all"
                  style={{ width: `${(stats.badDays / (stats.goodDays + stats.badDays)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <ThermometerSun size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Temperature Impact</p>
                <p className="text-xs text-gray-500">Higher temps correlate with elevated AQI</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Droplets size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Humidity Levels</p>
                <p className="text-xs text-gray-500">Optimal range: 40-60% for air quality</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Wind size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Pollution Trend</p>
                <p className="text-xs text-gray-500">
                  {stats.trend > 0 ? 'Consider taking preventive measures' : 'Air quality is improving'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recommendations Based on Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">✓ Good Practices</h4>
            <p className="text-sm text-green-700">Monitor during peak hours (6-9 AM)</p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠ Watch Out</h4>
            <p className="text-sm text-yellow-700">High pollution days increasing</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Tip</h4>
            <p className="text-sm text-blue-700">Use air purifiers when AQI {'>'}  150</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

