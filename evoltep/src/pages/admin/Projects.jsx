import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE, getImageUrl } from '../../utils/api';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';

const Projects = ({ apiKey }) => {
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: '',
    year: new Date().getFullYear(),
    image: null,
    link: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/data`);
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await axios.post(`${API_BASE}/projects/upload`, formData, {
        headers: { 'X-API-KEY': apiKey }
      });
      if (data.success) {
        return data.imageUrl;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    }
  };

  const addProject = async () => {
    if (!newProject.title) return alert('Title is required');

    try {
      let imageUrl = '';
      if (newProject.image) {
        imageUrl = await uploadImage(newProject.image);
      }

      const formData = new FormData();
      formData.append('title', newProject.title);
      formData.append('description', newProject.description);
      formData.append('category', newProject.category);
      formData.append('year', newProject.year);
      formData.append('link', newProject.link);
      if (imageUrl) formData.append('image', imageUrl);

      const { data } = await axios.post(`${API_BASE}/projects`, formData, {
        headers: { 'X-API-KEY': apiKey }
      });

      if (data.success) {
        setProjects((prev) => [...prev, data.project]);
        setNewProject({
          title: '',
          description: '',
          category: '',
          year: new Date().getFullYear(),
          image: null,
          link: '',
        });
        setShowAddForm(false);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add project.');
    }
  };

  const updateProject = async (proj) => {
    try {
      let imageUrl = proj.image;
      if (proj.image instanceof File) {
        imageUrl = await uploadImage(proj.image);
      }

      const formData = new FormData();
      formData.append('title', proj.title);
      formData.append('description', proj.description);
      formData.append('category', proj.category);
      formData.append('year', proj.year);
      formData.append('link', proj.link);
      formData.append('image', imageUrl);

      const { data } = await axios.put(`${API_BASE}/projects/${proj.id}`, formData, {
        headers: { 'X-API-KEY': apiKey }
      });

      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === proj.id ? { ...p, ...data.project } : p))
        );
        setEditingProject(null);
        alert('Project updated!');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update project.');
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await axios.delete(`${API_BASE}/projects/${id}`, {
        headers: { 'X-API-KEY': apiKey }
      });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete project.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
          <p className="text-gray-600 mt-2">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Project
        </button>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Add New Project</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Project Title"
            />
            <input
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
            />
            <input
              value={newProject.category}
              onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category"
            />
            <input
              value={newProject.link}
              onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Project Link"
            />
            <input
              type="number"
              value={newProject.year}
              onChange={(e) => setNewProject({ ...newProject, year: Number(e.target.value) })}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Year"
            />
            <div className="relative">
              <input
                type="file"
                onChange={(e) => setNewProject({ ...newProject, image: e.target.files[0] })}
                className="hidden"
                id="project-image"
              />
              <label
                htmlFor="project-image"
                className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                <Upload size={20} className="mr-2 text-gray-500" />
                <span className="text-gray-600">Choose Image</span>
              </label>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={addProject}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Add Project
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            {proj.image && (
              <img
                src={proj.image instanceof File ? URL.createObjectURL(proj.image) : proj.image}
                alt={proj.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              {editingProject?.id === proj.id ? (
                <div className="space-y-4">
                  <input
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={editingProject.description || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateProject(editingProject)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{proj.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{proj.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{proj.category} • {proj.year}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingProject(proj)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;