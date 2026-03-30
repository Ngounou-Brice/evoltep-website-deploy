import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE, getImageUrl } from '../../utils/api';
import { Plus, Edit2, Trash2, Upload, Calendar } from 'lucide-react';

const Blog = ({ apiKey }) => {
  const [blogs, setBlogs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: null,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/data`);
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
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

  const addBlog = async () => {
    if (!newBlog.title || !newBlog.content) {
      return alert('Title and content are required');
    }

    try {
      let imageUrl = '';
      if (newBlog.image) {
        imageUrl = await uploadImage(newBlog.image);
      }

      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('content', newBlog.content);
      formData.append('excerpt', newBlog.excerpt);
      if (imageUrl) formData.append('image', imageUrl);

      const { data } = await axios.post(`${API_BASE}/blogs`, formData, {
        headers: { 'X-API-KEY': apiKey }
      });

      if (data.success) {
        setBlogs((prev) => [...prev, data.blog]);
        setNewBlog({
          title: '',
          content: '',
          excerpt: '',
          image: null,
        });
        setShowAddForm(false);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add blog post.');
    }
  };

  const updateBlog = async (blog) => {
    try {
      let imageUrl = blog.image;
      if (blog.image instanceof File) {
        imageUrl = await uploadImage(blog.image);
      }

      const formData = new FormData();
      formData.append('title', blog.title);
      formData.append('content', blog.content);
      formData.append('excerpt', blog.excerpt);
      formData.append('image', imageUrl);

      const { data } = await axios.put(`${API_BASE}/blogs/${blog.id}`, formData, {
        headers: { 'X-API-KEY': apiKey }
      });

      if (data.success) {
        setBlogs((prev) =>
          prev.map((b) => (b.id === blog.id ? { ...b, ...data.blog } : b))
        );
        setEditingBlog(null);
        alert('Blog post updated!');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update blog post.');
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await axios.delete(`${API_BASE}/blogs/${id}`, {
        headers: { 'X-API-KEY': apiKey }
      });
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete blog post.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-2">Create and manage your blog posts</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" />
          New Post
        </button>
      </div>

      {/* Add Blog Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Create New Blog Post</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                value={newBlog.title}
                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Blog Title"
              />
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setNewBlog({ ...newBlog, image: e.target.files[0] })}
                  className="hidden"
                  id="blog-image"
                />
                <label
                  htmlFor="blog-image"
                  className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
                >
                  <Upload size={20} className="mr-2 text-gray-500" />
                  <span className="text-gray-600">Choose Featured Image</span>
                </label>
              </div>
            </div>

            <textarea
              value={newBlog.excerpt}
              onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none"
              placeholder="Short excerpt or summary"
            />

            <textarea
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-40 resize-none"
              placeholder="Full blog content"
            />

            <div className="flex space-x-4">
              <button
                onClick={addBlog}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Publish Post
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            {blog.image && (
              <img
                src={blog.image instanceof File ? URL.createObjectURL(blog.image) : blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              {editingBlog?.id === blog.id ? (
                <div className="space-y-4">
                  <input
                    value={editingBlog.title}
                    onChange={(e) =>
                      setEditingBlog({ ...editingBlog, title: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    value={editingBlog.excerpt || ''}
                    onChange={(e) =>
                      setEditingBlog({ ...editingBlog, excerpt: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="2"
                    placeholder="Excerpt"
                  />
                  <textarea
                    value={editingBlog.content || ''}
                    onChange={(e) =>
                      setEditingBlog({ ...editingBlog, content: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="4"
                    placeholder="Content"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateBlog(editingBlog)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingBlog(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar size={14} className="mr-1" />
                    {blog.created_at ? formatDate(blog.created_at) : 'Draft'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
                  {blog.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Blog Post</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingBlog(blog)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteBlog(blog.id)}
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

      {blogs.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first blog post</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Create First Post
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;