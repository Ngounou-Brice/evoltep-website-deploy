import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Dashboard from './admin/Dashboard';
import Projects from './admin/Projects';
import Email from './admin/Email';
import Blog from './admin/Blog';

const AdminLayout = ({ onLogout }) => {
  const [apiKey, setApiKey] = useState('');

  const handleLogout = () => {
    setApiKey('');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 lg:ml-0">
        {/* API Key Input - Fixed at top */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <label htmlFor="api-key" className="text-sm font-medium text-gray-700">
                Admin API Key:
              </label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your admin API key"
              />
              <span className="text-sm text-gray-500">
                Required for all admin operations
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard apiKey={apiKey} />} />
            <Route path="projects" element={<Projects apiKey={apiKey} />} />
            <Route path="email" element={<Email apiKey={apiKey} />} />
            <Route path="blog" element={<Blog apiKey={apiKey} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;