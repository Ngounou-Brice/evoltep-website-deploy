import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Dashboard from './admin/Dashboard';
import Projects from './admin/Projects';
import Email from './admin/Email';
import Blog from './admin/Blog';

const AdminLayout = ({ onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  // Use empty API key - no authentication required in admin panel
  const apiKey = '';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 lg:ml-0">
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