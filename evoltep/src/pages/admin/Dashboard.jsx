import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../utils/api';
import { BarChart3, Users, FolderOpen, BookOpen, TrendingUp } from 'lucide-react';

const Dashboard = ({ apiKey }) => {
  const [stats, setStats] = useState({
    projects: 0,
    subscribers: 0,
    blogs: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dataRes, subscribersRes] = await Promise.all([
          axios.get(`${API_BASE}/data`),
          axios.get(`${API_BASE}/subscribers`, { headers: { 'X-API-KEY': apiKey } })
        ]);

        setStats({
          projects: dataRes.data.projects?.length || 0,
          subscribers: subscribersRes.data.subscribers?.length || 0,
          blogs: dataRes.data.blogs?.length || 0,
          totalViews: 0 // Could be implemented later with analytics
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (apiKey) fetchStats();
  }, [apiKey]);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.projects,
      icon: FolderOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Subscribers',
      value: stats.subscribers,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Blog Posts',
      value: stats.blogs,
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-blue-100">Welcome back! Here's what's happening with your site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${stat.color} p-4`}>
                <Icon size={24} className="text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">System initialized successfully</p>
              <p className="text-xs text-gray-400">Just now</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Dashboard loaded</p>
              <p className="text-xs text-gray-400">Just now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
            <FolderOpen size={20} className="text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Add Project</h3>
            <p className="text-sm text-gray-600">Create a new project</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
            <BookOpen size={20} className="text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Write Blog</h3>
            <p className="text-sm text-gray-600">Publish a new post</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
            <Users size={20} className="text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">View Subscribers</h3>
            <p className="text-sm text-gray-600">Check your audience</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;