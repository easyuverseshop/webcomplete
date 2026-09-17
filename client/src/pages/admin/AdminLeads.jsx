import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { UserCheck, Mail, Phone, Trash2, CheckCircle2 } from 'lucide-react';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leads');
      setLeads(Array.isArray(res.data) ? res.data : (res.data?.data || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/leads/${id}`, { status });
      fetchLeads();
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete lead record?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Client Leads & Hiring Inquiries</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage incoming project requests, freelance inquiries, and contact form submissions.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800">
            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-extrabold text-gray-700 dark:text-gray-300">No Client Leads Yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-extrabold text-base text-gray-900 dark:text-white">{lead.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      lead.status === 'New' ? 'bg-rose-500 text-white' : 'bg-emerald-500/10 text-emerald-600'
                    }`}>
                      {lead.status}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      Service: {lead.serviceType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {lead.email}</span>
                    {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {lead.phone}</span>}
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Budget: {lead.budget}</span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                    "{lead.message}"
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <select
                    value={lead.status}
                    onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button onClick={() => handleDelete(lead._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLeads;
