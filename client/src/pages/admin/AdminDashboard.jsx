import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  FolderPlus,
  ShoppingCart,
  IndianRupee,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Briefcase,
  Eye,
  UserCheck,
  Wrench,
  Plus,
  Settings,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Welcome Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>System Active • Live Verified</span>
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  EasyUVerse v2.0
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-2">
                <span>Welcome back, {user?.name || 'Ujjwal Kant'}!</span> 👋
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                Here is your live revenue summary, pending UTR payment approvals, client inquiry leads, and platform asset metrics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/admin/projects"
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Deploy New Asset</span>
              </Link>
              <Link
                to="/admin/orders?tab=pending"
                className="px-5 py-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 font-extrabold text-xs flex items-center space-x-2 transition-all"
              >
                <Clock className="w-4 h-4" />
                <span>Pending Approvals ({stats?.pendingUtrCount || 0})</span>
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* KPI Metrics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Revenue */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Total Revenue</span>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{stats?.totalRevenue || 0}
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-500 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Direct UPI Verified Sales</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Successful Orders */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Successful Sales</span>
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    {stats?.totalOrders || 0}
                  </div>
                  <div className="text-[11px] font-bold text-gray-400 mt-1">
                    Completed Code Deliveries
                  </div>
                </div>
              </div>

              {/* Card 3: Pending UTRs */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Pending UTR Approvals</span>
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-black text-amber-500">
                      {stats?.pendingUtrCount || 0}
                    </div>
                    <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                      Awaiting Verification
                    </div>
                  </div>
                  <Link
                    to="/admin/orders?tab=pending"
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-xs hover:bg-amber-500 hover:text-slate-950 transition-colors"
                  >
                    Verify ↗
                  </Link>
                </div>
              </div>

              {/* Card 4: Client Leads */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-wider">New Client Leads</span>
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
                      {stats?.pendingLeads || 0}
                    </div>
                    <div className="text-[11px] font-bold text-purple-500 mt-1">
                      Inquiries Received
                    </div>
                  </div>
                  <Link
                    to="/admin/leads"
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-500 font-bold text-xs hover:bg-purple-500 hover:text-white transition-colors"
                  >
                    View Leads ↗
                  </Link>
                </div>
              </div>

              {/* Card 5: Live Visitors */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Total Visitors</span>
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Eye className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
                    {stats?.visitorCount || 1420}
                  </div>
                  <div className="text-[11px] font-bold text-gray-400 mt-1">
                    Tracked Site Visits
                  </div>
                </div>
              </div>

              {/* Card 6: Active Projects */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Project Catalog</span>
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <FolderPlus className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    {stats?.totalProjects || 0}
                  </div>
                  <div className="text-[11px] font-bold text-indigo-500 mt-1">
                    Published Assets
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Command Shortcuts Grid */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span>Quick Management Shortcuts</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/admin/projects"
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all space-y-2 group shadow-sm"
                >
                  <div className="p-3 rounded-2xl bg-indigo-600 text-white w-fit shadow-md">
                    <FolderPlus className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Deploy Free/Paid Asset
                  </h4>
                  <p className="text-[11px] text-gray-400">Upload source code .zip and set tech details</p>
                </Link>

                <Link
                  to="/admin/services"
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all space-y-2 group shadow-sm"
                >
                  <div className="p-3 rounded-2xl bg-emerald-600 text-white w-fit shadow-md">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-sm text-gray-900 dark:text-white group-hover:text-emerald-500">
                    Services Catalog
                  </h4>
                  <p className="text-[11px] text-gray-400">Add freelance development offerings & prices</p>
                </Link>

                <Link
                  to="/admin/orders?tab=pending"
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all space-y-2 group shadow-sm"
                >
                  <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 w-fit shadow-md font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-sm text-gray-900 dark:text-white group-hover:text-amber-500">
                    Pending UTR Ledger
                  </h4>
                  <p className="text-[11px] text-gray-400">Verify 12-digit payment ref & grant download access</p>
                </Link>

                <Link
                  to="/admin/settings"
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all space-y-2 group shadow-sm"
                >
                  <div className="p-3 rounded-2xl bg-purple-600 text-white w-fit shadow-md">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-sm text-gray-900 dark:text-white group-hover:text-purple-400">
                    UPI & Site Settings
                  </h4>
                  <p className="text-[11px] text-gray-400">Manage 9241034816@mbkns, social links & visitors</p>
                </Link>
              </div>
            </div>

            {/* Recent Orders Ledger Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-gray-900 dark:text-white">
                    Recent UPI UTR Transactions
                  </h3>
                  <p className="text-xs text-gray-500">Latest customer payment orders and status</p>
                </div>

                <Link
                  to="/admin/orders"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                >
                  <span>View All Ledger</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {stats?.recentOrders?.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No transaction records found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-50 dark:bg-slate-800/50">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Project</th>
                        <th className="py-3 px-4">UTR Number</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs font-semibold">
                      {stats?.recentOrders?.map((ord) => (
                        <tr key={ord._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                          <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {ord.orderId || ord.cashfreeOrderId}
                          </td>
                          <td className="py-3.5 px-4 text-gray-900 dark:text-white font-extrabold">
                            {ord.user?.name || ord.customerDetails?.name || 'Customer'}
                          </td>
                          <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                            {ord.project?.title || 'Project Asset'}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                            {ord.utrNumber || <span className="text-gray-400 font-normal">Pending</span>}
                          </td>
                          <td className="py-3.5 px-4 font-black text-gray-900 dark:text-white">
                            ₹{ord.amount}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                ord.paymentStatus === 'SUCCESS'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
