import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { Globe, Plus, Trash2, ExternalLink, X } from 'lucide-react';

const AdminShowcase = () => {
  const [showcases, setShowcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    demoUrl: '',
    githubUrl: '',
    thumbnail: '',
    category: 'Full Stack MERN',
    techStack: 'React, Node.js, MongoDB',
    description: '',
  });

  useEffect(() => {
    fetchShowcase();
  }, []);

  const fetchShowcase = async () => {
    try {
      setLoading(true);
      const res = await api.get('/showcase');
      setShowcases(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete showcase item?')) return;
    try {
      await api.delete(`/showcase/${id}`);
      fetchShowcase();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/showcase', formData);
      setModalOpen(false);
      fetchShowcase();
    } catch (err) {
      alert('Failed to add showcase item');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              <span>Live Showcase Portfolio</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Display live built client websites, web apps, and portfolio projects.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Add Showcase Item</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcases.map((item) => (
              <div key={item._id} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-40 bg-slate-800 relative">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                    <a href={item.demoUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                      <span>Visit Demo</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                  <button onClick={() => handleDelete(item._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-gray-400">
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-black text-gray-900 dark:text-white">Add Showcase Item</h2>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold">Project Title *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold">Live Demo URL *</label>
                  <input type="url" required value={formData.demoUrl} onChange={(e) => setFormData({...formData, demoUrl: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold">Thumbnail Image URL *</label>
                  <input type="url" required value={formData.thumbnail} onChange={(e) => setFormData({...formData, thumbnail: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl font-bold bg-indigo-600 text-white shadow-lg">Save Showcase</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminShowcase;
