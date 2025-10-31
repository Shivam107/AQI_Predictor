import React from 'react';
import { Users, Mail, MapPin, Award, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Team: React.FC = () => {
  const { user } = useAuth();

  const teamMembers = [
    {
      id: 1,
      name: user?.name || 'Current User',
      email: user?.email || 'user@example.com',
      role: 'Project Lead',
      avatar: user?.picture || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User'),
      status: 'online',
      location: 'Ahmedabad, India',
      joined: 'Jan 2024',
      projects: 12,
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      role: 'Data Analyst',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=ec4899&color=fff',
      status: 'online',
      location: 'Mumbai, India',
      joined: 'Feb 2024',
      projects: 8,
    },
    {
      id: 3,
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      role: 'IoT Engineer',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=3b82f6&color=fff',
      status: 'away',
      location: 'Delhi, India',
      joined: 'Mar 2024',
      projects: 10,
    },
    {
      id: 4,
      name: 'Anjali Patel',
      email: 'anjali.patel@example.com',
      role: 'Environmental Scientist',
      avatar: 'https://ui-avatars.com/api/?name=Anjali+Patel&background=8b5cf6&color=fff',
      status: 'online',
      location: 'Bangalore, India',
      joined: 'Dec 2023',
      projects: 15,
    },
    {
      id: 5,
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      role: 'Frontend Developer',
      avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=f59e0b&color=fff',
      status: 'offline',
      location: 'Pune, India',
      joined: 'Jan 2024',
      projects: 6,
    },
    {
      id: 6,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      role: 'Backend Developer',
      avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=10b981&color=fff',
      status: 'online',
      location: 'Hyderabad, India',
      joined: 'Feb 2024',
      projects: 9,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-500 mt-1">Collaborate with your air quality monitoring team</p>
        </div>
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-2">
          <Users size={20} />
          Invite Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Members</p>
              <p className="text-3xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Users size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Online Now</p>
              <p className="text-3xl font-bold text-gray-900">
                {teamMembers.filter((m) => m.status === 'online').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">
                {teamMembers.reduce((acc, m) => acc + m.projects, 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Award size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Response</p>
              <p className="text-3xl font-bold text-gray-900">2.5h</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
          >
            {/* Avatar and Status */}
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-16 h-16 rounded-full"
                />
                <div
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                    member.status
                  )}`}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {member.status}
              </span>
            </div>

            {/* Member Info */}
            <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
            <p className="text-sm text-emerald-600 font-medium mb-4">{member.role}</p>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{member.location}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{member.projects}</p>
                <p className="text-xs text-gray-500">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{member.joined}</p>
                <p className="text-xs text-gray-500">Joined</p>
              </div>
              <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition">
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;

