import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { Briefcase, Plus, Edit, Trash2, X, CheckCircle, Code, Layers } from 'lucide-react';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    startingPrice: 1999,
    techStack: 'MERN, Node.js, React, MongoDB, Tailwind CSS',
    shortDescription: '',
    fullDescription: '',
    iconName: 'Code',
    isAvailable: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/services');
      setServices(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingId(service._id);
      setFormData({
        title: service.title || '',
        startingPrice: service.startingPrice || 999,
        techStack: Array.isArray(service.techStack) ? service.techStack.join(', ') : service.techStack || '',
        shortDescription: service.shortDescription || '',
        fullDescription: service.fullDescription || '',
        iconName: service.iconName || 'Code',
        isAvailable: service.isAvailable ?? true,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        startingPrice: 1999,
        techStack: 'MERN, Node.js, React, MongoDB, Tailwind CSS',
        shortDescription: '',
        fullDescription: '',
        iconName: 'Code',
        isAvailable: true,
      });
    }
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service listing?')) return;
    try {
      await api.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, formData);
      } else {
        await api.post('/services', formData);
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save service');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header matching Screenshot 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              <span>Service Catalog Manager</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Create and offer freelance development & project build services to your visitors.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Service Listing</span>
          </button>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-extrabold text-gray-700 dark:text-gray-300">No Services Configured</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add New Service Listing" to list your custom development offerings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s._id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Code className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Starts ₹{s.startingPrice}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-gray-900 dark:text-white leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {s.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {s.techStack?.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-500">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{s.isAvailable ? 'Available for Hire' : 'Busy'}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(s)}
                      className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal matching Screenshot 2 design */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              >
                <X className="w-6 h-6" />
              </button>

              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  {editingId ? 'Edit Service Listing' : 'Add New Service Listing'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Configure custom service offering details and pricing.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Service Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Web App Development"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Starting Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Technologies (Comma separated) *</label>
                  <input
                    type="text"
                    required
                    placeholder="MERN, React, Node.js, Express, MongoDB"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Short Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe what is included in this service..."
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-semibold"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-bold bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                  >
                    Publish Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
