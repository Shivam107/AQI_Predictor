import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const MetricCards: React.FC = () => {
  const metrics = [
    {
      title: 'Total Projects',
      value: '24',
      change: 'Increased from last month',
      bgColor: 'bg-emerald-700',
      textColor: 'text-white',
      changeColor: 'text-emerald-200',
    },
    {
      title: 'Ended Projects',
      value: '10',
      change: 'Increased from last month',
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
      changeColor: 'text-gray-500',
    },
    {
      title: 'Running Projects',
      value: '12',
      change: 'Increased from last month',
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
      changeColor: 'text-gray-500',
    },
    {
      title: 'Pending Project',
      value: '2',
      change: 'On Discuss',
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
      changeColor: 'text-gray-500',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${metric.bgColor} rounded-2xl p-6 shadow-sm border border-gray-200`}
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className={`text-sm font-medium ${metric.textColor} opacity-90`}>
              {metric.title}
            </h3>
            <div className={`p-2 ${metric.bgColor === 'bg-white' ? 'bg-gray-100' : 'bg-emerald-600'} rounded-lg`}>
              <ArrowUpRight size={16} className={metric.textColor} />
            </div>
          </div>
          <div className={`text-5xl font-bold ${metric.textColor} mb-3`}>
            {metric.value}
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className={metric.changeColor} />
            <span className={`text-xs ${metric.changeColor}`}>
              {metric.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
