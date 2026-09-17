import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import {
  Clock,
  Send,
  Receipt,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

const AdminOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parse active tab from query param e.g. ?tab=pending
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'pending';

  const tabs = [
    { key: 'pending', label: 'Pending Approvals', icon: Clock },
    { key: 'delivery', label: 'Delivery Center', icon: Send },
    { key: 'transactions', label: 'Transactions', icon: Receipt },
    { key: 'delete-history', label: 'Delete History', icon: Trash2 },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/orders');
      if (res.data?.success) {
        setOrders(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApproveOrder = async (orderId) => {
    if (window.confirm('Approve UTR payment and send zip download access to user?')) {
      try {
        await api.put(`/payments/admin/approve/${orderId}`);
        fetchOrders();
      } catch (err) {
        alert('Approve failed');
      }
    }
  };

  const handleRejectOrder = async (orderId) => {
    if (window.confirm('Reject payment submission?')) {
      try {
        await api.put(`/payments/admin/reject/${orderId}`);
        fetchOrders();
      } catch (err) {
        alert('Reject failed');
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Permanently remove this order from history?')) {
      try {
        await api.delete(`/admin/orders/${orderId}`);
        fetchOrders();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (activeTab === 'pending') {
      return ord.paymentStatus === 'PENDING_VERIFICATION' || ord.paymentStatus === 'PENDING';
    }
    if (activeTab === 'delivery') {
      return ord.paymentStatus === 'SUCCESS';
    }
    if (activeTab === 'transactions') {
      return true; // All orders
    }
    if (activeTab === 'delete-history') {
      return true; // Audit view
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              <span>Orders & UPI Delivery Ledger</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Verify 12-digit UTR numbers, deliver zip downloads, and manage transaction history.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 text-xs font-bold hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Ledger</span>
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => navigate(`/admin/orders?tab=${tab.key}`)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Table View */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-gray-400">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-xs font-bold text-gray-400">
              No orders found in tab "{tabs.find((t) => t.key === activeTab)?.label}".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 text-[11px] font-black uppercase text-gray-400 bg-gray-50 dark:bg-slate-800/50">
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">UTR Number</th>
                    <th className="py-3.5 px-4">Project</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs font-semibold">
                  {filteredOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                      <td className="py-4 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {ord.orderId}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-gray-900 dark:text-white">
                          {ord.user?.name || ord.customerDetails?.name || 'Customer'}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {ord.user?.email || ord.customerDetails?.email}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-black text-purple-600 dark:text-purple-400">
                        {ord.utrNumber || <span className="text-gray-400 font-normal">Not Submitted</span>}
                      </td>
                      <td className="py-4 px-4 font-extrabold text-gray-800 dark:text-gray-200">
                        {ord.project?.title || 'Project Asset'}
                      </td>
                      <td className="py-4 px-4 font-black text-gray-900 dark:text-white">
                        ₹{ord.amount}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                            ord.paymentStatus === 'SUCCESS'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : ord.paymentStatus === 'PENDING_VERIFICATION'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {ord.paymentStatus === 'SUCCESS' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{ord.paymentStatus}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {activeTab === 'delivery' && ord.downloadUrl && (
                          <a
                            href={ord.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" /> Zip Link
                          </a>
                        )}

                        {ord.paymentStatus !== 'SUCCESS' && (
                          <button
                            onClick={() => handleApproveOrder(ord._id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm"
                          >
                            Approve
                          </button>
                        )}

                        {(() => {
                          const customerPhone = ord.customerDetails?.phone || ord.user?.phone || '9241034816';
                          const cleanPhone = customerPhone.replace(/\D/g, '');
                          const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                          const projectTitle = ord.project?.title || 'EasyUVerse Source Code Asset';
                          const orderDate = new Date(ord.createdAt).toLocaleDateString();
                          const utrNo = ord.utrNumber || 'N/A';
                          const amount = ord.amount || 0;
                          const downloadUrl = ord.project?.downloadUrl || ord.downloadUrl || 'https://easyuverse.shop/dashboard';
                          const customerName = ord.user?.name || ord.customerDetails?.name || 'Customer';

                          const whatsappMessage = `Hello ${customerName},

Thank you for your order on EasyUVerse! Here are your access details for your requested file:

*Project:* ${projectTitle}
*Order ID:* ${ord.orderId}
*Date:* ${orderDate}
*UTR Number:* ${utrNo}
*Amount Paid:* ₹${amount}

You can access and download your source code zip file directly from this link:
${downloadUrl}

Need support? Contact Ujjwal Kant on EasyUVerse. Have a great day!`;

                          const whatsappLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMessage)}`;

                          return (
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-extrabold text-xs hover:bg-emerald-600 hover:text-white transition-all inline-flex items-center gap-1 shadow-sm"
                              title="Send WhatsApp Delivery Access Message"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                              <span>WhatsApp</span>
                            </a>
                          );
                        })()}

                        {ord.paymentStatus !== 'REJECTED' && (
                          <button
                            onClick={() => handleRejectOrder(ord._id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/30 font-bold text-xs hover:bg-rose-600 hover:text-white"
                          >
                            Reject
                          </button>
                        )}

                        {activeTab === 'delete-history' && (
                          <button
                            onClick={() => handleDeleteOrder(ord._id)}
                            className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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

export default AdminOrders;
