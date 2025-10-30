import React from 'react';
import { Sparkles, Droplet, Hammer, Zap, TestTube, Plus } from 'lucide-react';

const ProjectList: React.FC = () => {
  const projects = [
    { name: 'Develop API Endpoints', date: 'Nov 26, 2024', icon: Sparkles, color: 'bg-blue-500' },
    { name: 'Onboarding Flow', date: 'Nov 27, 2024', icon: Droplet, color: 'bg-cyan-500' },
    { name: 'Build Dashboard', date: 'Nov 30, 2024', icon: Hammer, color: 'bg-green-500' },
    { name: 'Optimize Page Load', date: 'Dec 5, 2024', icon: Zap, color: 'bg-yellow-500' },
    { name: 'Cross-Browser Testing', date: 'Dec 5, 2024', icon: TestTube, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Project</h2>
        <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-1">
          <Plus size={14} />
          New
        </button>
      </div>
      
      <div className="space-y-3">
        {projects.map((project, index) => {
          const Icon = project.icon;
          return (
            <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
              <div className={`${project.color} p-2 rounded-lg`}>
                <Icon size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{project.name}</h4>
                <p className="text-xs text-gray-500">Due date: {project.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectList;
