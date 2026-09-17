import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { Users, Shield, User, Check } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Change role of this user to ${newRole.toUpperCase()}?`)) {
      try {
        await api.put(`/admin/users/${userId}`, { role: newRole });
        fetchUsers();
      } catch (err) {
        alert('Failed to update user role');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            User Accounts & Roles Ledger
          </h1>
          <p className="text-xs text-gray-500">Manage registered user credentials and administrative access</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading user database...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-slate-800/50">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Purchases</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                        {u.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {u.email}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-purple-500/10 text-purple-600'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          <span className="uppercase">{u.role}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                        {u.purchasedProjects?.length || 0} projects
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Toggle Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
