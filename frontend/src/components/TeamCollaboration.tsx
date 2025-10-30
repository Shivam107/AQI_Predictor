import React from 'react';
import { Plus } from 'lucide-react';

const TeamCollaboration: React.FC = () => {
  const teamMembers = [
    {
      name: 'Alexandra Deff',
      task: 'Github Project Repository',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-700',
      avatar: 'bg-gradient-to-br from-pink-400 to-red-400',
    },
    {
      name: 'Edwin Adenika',
      task: 'Integrate User Authentication System',
      status: 'In Progress',
      statusColor: 'bg-yellow-100 text-yellow-700',
      avatar: 'bg-gradient-to-br from-green-400 to-teal-400',
    },
    {
      name: 'Issac Oluwatomilorun',
      task: 'Develop Search and Filter Functionality',
      status: 'Pending',
      statusColor: 'bg-purple-100 text-purple-700',
      avatar: 'bg-gradient-to-br from-blue-400 to-indigo-400',
    },
    {
      name: 'David Oshodi',
      task: 'Responsive Layout for Homepage',
      status: 'In Progress',
      statusColor: 'bg-yellow-100 text-yellow-700',
      avatar: 'bg-gradient-to-br from-orange-400 to-red-400',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Team Collaboration</h2>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-1">
          <Plus size={14} />
          Add Member
        </button>
      </div>
      
      <div className="space-y-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
            <div className={`w-12 h-12 ${member.avatar} rounded-full flex-shrink-0`}></div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900">{member.name}</h4>
              <p className="text-sm text-gray-600 truncate">Working on {member.task}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.statusColor}`}>
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCollaboration;
