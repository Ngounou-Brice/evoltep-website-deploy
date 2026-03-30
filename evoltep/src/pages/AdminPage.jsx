import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE, getImageUrl } from "../utils/api";

export default function AdminPage() {
  const [heroTitle, setHeroTitle] = useState("");
  const [projects, setProjects] = useState([]);
  const [apiKey, setApiKey] = useState(""); // Add API key state

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: "",
    year: new Date().getFullYear(),
    image: null,
    link: "", // New field for project link
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/data`);
        setHeroTitle(data.heroTitle);
        setProjects(data.projects);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Update Hero
  const saveHero = async () => {
    if (!apiKey) return alert("API Key is required");
    try {
      await axios.post(`${API_BASE}/hero`, { heroTitle }, { headers: { 'X-API-KEY': apiKey } });
      alert("Hero updated!");
    } catch (err) {
      console.error("Error updating hero:", err);
      alert("Failed to update hero. Check API Key and try again.");
    }
  };

  // Add Project
  const addProject = async () => {
    if (!apiKey) return alert("API Key is required");
    if (!newProject.title) return alert("Title is required");

    let imageUrl = "";
    if (newProject.image) {
      // Upload image first
      const uploadFormData = new FormData();
      uploadFormData.append("image", newProject.image);
      try {
        const uploadRes = await axios.post(`${API_BASE}/projects/upload`, uploadFormData, { headers: { 'X-API-KEY': apiKey } });
        if (uploadRes.data.success) {
          imageUrl = uploadRes.data.imageUrl;
        } else {
          return alert("Failed to upload image: " + uploadRes.data.error);
        }
      } catch (err) {
        console.error("Upload error:", err);
        return alert("Failed to upload image.");
      }
    }

    const formData = new FormData();
    formData.append("title", newProject.title);
    formData.append("description", newProject.description);
    formData.append("category", newProject.category);
    formData.append("year", newProject.year);
    formData.append("link", newProject.link);
    if (imageUrl) formData.append("image", imageUrl);

    try {
      const { data } = await axios.post(`${API_BASE}/projects`, formData, { headers: { 'X-API-KEY': apiKey } });
      if (data.success) {
        setProjects((prev) => [...prev, data.project]);
        setNewProject({ title: "", description: "", category: "", year: new Date().getFullYear(), image: null, link: "" });
      } else alert(data.error);
    } catch (err) {
      console.error(err);
      alert("Failed to add project.");
    }
  };

  // Delete Project
  const deleteProject = async (id) => {
    if (!apiKey) return alert("API Key is required");
    try {
      await axios.delete(`${API_BASE}/projects/${id}`, { headers: { 'X-API-KEY': apiKey } });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project.");
    }
  };

  // Update Project
  const updateProject = async (proj) => {
    if (!apiKey) return alert("API Key is required");
    let imageUrl = proj.image;
    if (proj.image instanceof File) {
      // Upload new image
      const uploadFormData = new FormData();
      uploadFormData.append("image", proj.image);
      try {
        const uploadRes = await axios.post(`${API_BASE}/projects/upload`, uploadFormData, { headers: { 'X-API-KEY': apiKey } });
        if (uploadRes.data.success) {
          imageUrl = uploadRes.data.imageUrl;
        } else {
          return alert("Failed to upload image: " + uploadRes.data.error);
        }
      } catch (err) {
        console.error("Upload error:", err);
        return alert("Failed to upload image.");
      }
    }

    const formData = new FormData();
    formData.append("title", proj.title);
    formData.append("description", proj.description);
    formData.append("category", proj.category);
    formData.append("year", proj.year);
    formData.append("link", proj.link);
    formData.append("image", imageUrl);

    try {
      const { data } = await axios.put(`${API_BASE}/projects/${proj.id}`, formData, { headers: { 'X-API-KEY': apiKey } });
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === proj.id ? { ...p, ...data.project } : p))
        );
        alert("Project updated!");
      } else alert(data.error);
    } catch (err) {
      console.error(err);
      alert("Failed to update project.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-12 text-center text-brand-blue">Admin Dashboard</h1>

      {/* API Key Input */}
      <section className="bg-gray-800 p-6 rounded-lg mb-10 shadow-lg hover:shadow-xl transition-shadow">
        <h2 className="text-2xl mb-4 font-semibold text-red-400">Admin API Key</h2>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="p-3 w-full text-black rounded-lg mb-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Enter Admin API Key"
        />
        <p className="text-sm text-gray-400">Required for all admin actions (add, update, delete projects, update hero, view subscribers).</p>
      </section>

      {/* Hero Section */}
      <section className="bg-gray-800 p-6 rounded-lg mb-10 shadow-lg hover:shadow-xl transition-shadow">
        <h2 className="text-2xl mb-4 font-semibold text-brand-blue">Hero Section</h2>
        <input
          value={heroTitle}
          onChange={(e) => setHeroTitle(e.target.value)}
          className="p-3 w-full text-black rounded-lg mb-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-blue"
          placeholder="Hero Title"
        />
        <button
          onClick={saveHero}
          className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-lg font-semibold shadow-md"
        >
          Save Hero
        </button>
      </section>

      {/* Add New Project */}
      <section className="bg-gray-800 p-6 rounded-lg mb-10 shadow-lg hover:shadow-xl transition-shadow">
        <h2 className="text-2xl mb-4 font-semibold text-green-400">Add New Project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            className="p-3 text-black rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Title"
          />
          <input
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="p-3 text-black rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Description"
          />
          <input
            value={newProject.category}
            onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
            className="p-3 text-black rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Category"
          />
          <input
            value={newProject.link}
            onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
            className="p-3 text-black rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Project Link (https://...)"
          />
          <input
            type="number"
            value={newProject.year}
            onChange={(e) => setNewProject({ ...newProject, year: Number(e.target.value) })}
            className="p-3 text-black rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Year"
          />
          <input
            type="file"
            onChange={(e) => setNewProject({ ...newProject, image: e.target.files[0] })}
            className="p-3 text-black rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400 col-span-1 md:col-span-2"
          />
        </div>
        <button
          onClick={addProject}
          className="bg-green-600 hover:bg-green-700 transition-colors px-6 py-2 rounded-lg font-semibold shadow-md"
        >
          Add Project
        </button>
      </section>

      {/* Existing Projects */}
      <section>
        <h2 className="text-2xl mb-6 font-semibold text-purple-400">Existing Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-gray-800 p-5 rounded-lg shadow-lg hover:shadow-2xl transition-shadow flex flex-col"
            >
              {proj.image && (
                <img
                  src={proj.image instanceof File ? URL.createObjectURL(proj.image) : proj.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <input
                value={proj.title}
                onChange={(e) =>
                  setProjects((prev) =>
                    prev.map((p) => (p.id === proj.id ? { ...p, title: e.target.value } : p))
                  )
                }
                className="p-2 text-black rounded-lg mb-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <textarea
                value={proj.description || ""}
                onChange={(e) =>
                  setProjects((prev) =>
                    prev.map((p) => (p.id === proj.id ? { ...p, description: e.target.value } : p))
                  )
                }
                className="p-2 text-black rounded-lg mb-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Description"
              />
              <input
                value={proj.category || ""}
                onChange={(e) =>
                  setProjects((prev) =>
                    prev.map((p) => (p.id === proj.id ? { ...p, category: e.target.value } : p))
                  )
                }
                className="p-2 text-black rounded-lg mb-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Category"
              />
              <input
                type="number"
                value={proj.year || new Date().getFullYear()}
                onChange={(e) =>
                  setProjects((prev) =>
                    prev.map((p) => (p.id === proj.id ? { ...p, year: Number(e.target.value) } : p))
                  )
                }
                className="p-2 text-black rounded-lg mb-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Year"
              />
              <input
                value={proj.link || ""}
                onChange={(e) =>
                  setProjects((prev) =>
                    prev.map((p) => (p.id === proj.id ? { ...p, link: e.target.value } : p))
                  )
                }
                className="p-2 text-black rounded-lg mb-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Project Link (https://...)"
              />
              <input
                type="file"
                onChange={(e) =>
                  setProjects((prev) =>
                    prev.map((p) => (p.id === proj.id ? { ...p, image: e.target.files[0] } : p))
                  )
                }
                className="p-2 text-black rounded-lg mb-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <div className="flex gap-2 mt-auto">
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-lg font-semibold shadow-md text-center"
                >
                  Visit Website
                </a>
                <button
                  onClick={() => updateProject(proj)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-semibold shadow-md"
                >
                  Save
                </button>
                <button
                  onClick={() => deleteProject(proj.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-lg font-semibold shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}