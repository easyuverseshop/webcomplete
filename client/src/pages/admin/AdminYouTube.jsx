import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { Youtube, Plus, Trash2, ExternalLink, X } from 'lucide-react';

const AdminYouTube = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    category: 'Project Walkthrough',
    description: '',
    duration: '10:00',
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/youtube');
      setVideos(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete video listing?')) return;
    try {
      await api.delete(`/youtube/${id}`);
      fetchVideos();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/youtube', formData);
      setModalOpen(false);
      fetchVideos();
    } catch (err) {
      alert('Failed to add video');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Youtube className="w-7 h-7 text-rose-600" />
              <span>YouTube Videos & Demos Manager</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Embed video walkthroughs and project feature demos for visitors.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center space-x-2 transition-all shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Add YouTube Video</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <div key={vid._id} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="aspect-video bg-black relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${vid.youtubeId}`}
                      title={vid.title}
                      className="w-full h-full border-0"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{vid.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{vid.description}</p>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                  <button onClick={() => handleDelete(vid._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl">
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

              <h2 className="text-xl font-black text-gray-900 dark:text-white">Add YouTube Video</h2>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold">Video Title *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold">YouTube Video URL *</label>
                  <input type="url" required placeholder="https://www.youtube.com/watch?v=..." value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl font-bold bg-rose-600 text-white shadow-lg">Save Video</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminYouTube;
