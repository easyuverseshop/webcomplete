import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Download, ExternalLink, Calendar, CheckCircle2, Code2, Clock, FileText, AlertTriangle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import InvoiceModal from '../components/InvoiceModal';

const UserDashboard = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await api.get('/payments/my-purchases');
        if (res.data.success) {
          setPurchases(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching purchases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const renderProgressTracker = (status) => {
    const isPending = status === 'PENDING_VERIFICATION';
    const isSuccess = status === 'SUCCESS';
    const isRejected = status === 'REJECTED';

    return (
      <div className="bg-gray-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold">
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              ✓
            </div>
            <span>1. Placed</span>
          </div>

          <div className="h-0.5 flex-1 bg-emerald-500 mx-1.5" />

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              ✓
            </div>
            <span>2. UTR Sent</span>
          </div>

          <div className={`h-0.5 flex-1 mx-1.5 ${isSuccess ? 'bg-emerald-500' : isRejected ? 'bg-rose-500' : 'bg-amber-500'}`} />

          {/* Step 3 */}
          <div className={`flex flex-col items-center gap-1 ${
            isSuccess ? 'text-emerald-600 dark:text-emerald-400' : isRejected ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
          }`}>
            <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm ${
              isSuccess ? 'bg-emerald-500' : isRejected ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'
            }`}>
              {isSuccess ? '✓' : isRejected ? '✕' : '3'}
            </div>
            <span>{isRejected ? '3. Rejected' : '3. Review'}</span>
          </div>

          <div className={`h-0.5 flex-1 mx-1.5 ${isSuccess ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`} />

          {/* Step 4 */}
          <div className={`flex flex-col items-center gap-1 ${isSuccess ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-gray-400'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
              isSuccess ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400'
            }`}>
              {isSuccess ? '🎉' : '4'}
            </div>
            <span>4. Unlocked</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Info */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {user?.name}'s Dashboard
            </h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>Active User Account</span>
        </div>
      </div>

      {/* Purchased & Pending Projects */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            My Orders & Project Requests ({purchases.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 space-y-4">
            <Code2 className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">No Orders or Purchases Yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Explore our store catalog and purchase MERN templates to unlock instant downloads here.
            </p>
            <Link
              to="/projects"
              className="inline-block px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md"
            >
              Browse Projects Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {purchases.map((order) => {
              const project = order.project;
              if (!project) return null;

              const isSuccess = order.paymentStatus === 'SUCCESS';
              const isPending = order.paymentStatus === 'PENDING_VERIFICATION';
              const isRejected = order.paymentStatus === 'REJECTED';

              return (
                <div
                  key={order._id}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header Row with Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-2.5 py-1 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        {order.orderId || `uverse-${order._id.slice(-6)}`}
                      </span>

                      {isSuccess && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Code Unlocked</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Admin Review</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Order Rejected</span>
                        </span>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="flex space-x-4">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-20 h-20 rounded-2xl object-cover bg-gray-900 shrink-0 border border-gray-100 dark:border-slate-700"
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          {project.category}
                        </span>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white truncate">
                          {project.title}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                        </p>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          Paid: ₹{order.amount} {order.utrNumber ? `• UTR: ${order.utrNumber}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Multi-step Visual Progress Bar */}
                    {renderProgressTracker(order.paymentStatus)}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-gray-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-1.5 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      <span>View Invoice</span>
                    </button>

                    {isSuccess && (
                      <a
                        href={project.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Source Code</span>
                      </a>
                    )}

                    {isPending && (
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
                        ⚡ Admin Verifying UTR (approx 5-15 mins)
                      </span>
                    )}

                    {isRejected && (
                      <a
                        href="https://wa.me/919241034816?text=Hi%20Ujjwal,%20my%20order%20was%20rejected.%20Please%20help."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Contact Admin</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invoice Modal Popup */}
      <InvoiceModal
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
        order={selectedInvoiceOrder}
      />
    </div>
  );
};

export default UserDashboard;
