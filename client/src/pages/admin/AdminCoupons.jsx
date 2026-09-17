import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { Ticket, Plus, Trash2, X } from 'lucide-react';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: 20,
    maxDiscount: 500,
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coupons');
      setCoupons(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete coupon code?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', formData);
      setModalOpen(false);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Ticket className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              <span>Coupons & Discount Manager</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Create promo codes for users to enter at checkout for instant discounts.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Create Coupon Code</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((c) => (
              <div key={c._id} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 space-y-3 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-black text-sm tracking-wider uppercase">
                      {c.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-500">
                      {c.discountPercentage}% OFF
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Max Discount: ₹{c.maxDiscount}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                  <button onClick={() => handleDelete(c._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl">
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

              <h2 className="text-xl font-black text-gray-900 dark:text-white">Create Coupon Code</h2>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold">Coupon Code *</label>
                  <input type="text" required placeholder="e.g. EASY20" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border rounded-xl font-bold tracking-wider" />
                </div>
                <div>
                  <label className="font-bold">Discount Percentage (%) *</label>
                  <input type="number" required min="1" max="100" value={formData.discountPercentage} onChange={(e) => setFormData({...formData, discountPercentage: Number(e.target.value)})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold">Max Discount Amount (₹)</label>
                  <input type="number" value={formData.maxDiscount} onChange={(e) => setFormData({...formData, maxDiscount: Number(e.target.value)})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl font-bold bg-indigo-600 text-white shadow-lg">Save Coupon</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;
