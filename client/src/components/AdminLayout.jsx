import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import {
  LayoutDashboard,
  Clock,
  Send,
  Receipt,
  Trash2,
  FolderPlus,
  Briefcase,
  Globe,
  Youtube,
  UserCheck,
  MessageSquare,
  Ticket,
  CreditCard,
  Wrench,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [pendingUtrBadge, setPendingUtrBadge] = useState(0);
  const [pendingLeadsBadge, setPendingLeadsBadge] = useState(0);

  useEffect(() => {
    fetchAdminSummary();
  }, []);

  const fetchAdminSummary = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data?.success) {
        setMaintenanceMode(res.data.data.maintenanceMode);
        setPendingUtrBadge(res.data.data.pendingUtrCount || 0);
        setPendingLeadsBadge(res.data.data.pendingLeads || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const res = await api.post('/admin/maintenance');
      if (res.data?.success) {
        setMaintenanceMode(res.data.maintenanceMode);
      }
    } catch (err) {
      alert('Failed to toggle maintenance mode');
    }
  };

  const navigationGroups = [
    {
      groupTitle: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      groupTitle: 'ORDERS',
      items: [
        { label: 'Pending Approvals', path: '/admin/orders?tab=pending', icon: Clock, badge: pendingUtrBadge },
        { label: 'Delivery Center', path: '/admin/orders?tab=delivery', icon: Send },
        { label: 'Transactions', path: '/admin/orders?tab=transactions', icon: Receipt },
        { label: 'Delete History', path: '/admin/orders?tab=delete-history', icon: Trash2 },
      ],
    },
    {
      groupTitle: 'CONTENT',
      items: [
        { label: 'Add Projects', path: '/admin/projects', icon: FolderPlus },
        { label: 'Services', path: '/admin/services', icon: Briefcase },
        { label: 'Live Showcase', path: '/admin/showcase', icon: Globe },
        { label: 'YouTube Videos', path: '/admin/youtube', icon: Youtube },
      ],
    },
    {
      groupTitle: 'CUSTOMERS',
      items: [
        { label: 'Client Leads', path: '/admin/leads', icon: UserCheck, badge: pendingLeadsBadge },
        { label: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
      ],
    },
    {
      groupTitle: 'TOOLS',
      items: [
        { label: 'Coupons', path: '/admin/coupons', icon: Ticket },
        { label: 'Payment Settings', path: '/admin/settings', icon: CreditCard },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex transition-colors text-gray-900 dark:text-gray-100">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="overflow-y-auto flex-1">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>System Active</span>
              </span>
              <ThemeToggle />
            </div>

            <Logo showText={true} />

            <Link
              to="/"
              className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-4">
            {navigationGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="px-3 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {group.groupTitle}
                </h3>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const currentFull = location.pathname + location.search;
                  const isActive = location.pathname === item.path || currentFull === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-xs transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer with Maintenance Mode Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 space-y-3 bg-gray-50/50 dark:bg-slate-900/50">
          <button
            onClick={handleToggleMaintenance}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
              maintenanceMode
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 animate-pulse'
                : 'bg-slate-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>{maintenanceMode ? '🔧 Maintenance ON' : '🔧 Maintenance Mode'}</span>
          </button>

          <div className="flex items-center justify-between pt-1">
            <div className="truncate pr-2">
              <p className="text-xs font-extrabold text-gray-900 dark:text-white truncate">
                {user?.name || 'Ujjwal Kant'}
              </p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email || 'admin@easyuverse.com'}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden flex">
          <div className="w-72 bg-white dark:bg-slate-900 h-full p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-800">
                <Logo showText={true} />
                <button onClick={() => setMobileSidebarOpen(false)} className="text-gray-400 p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-4">
                {navigationGroups.map((group, idx) => (
                  <div key={idx} className="space-y-1">
                    <h3 className="px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">
                      {group.groupTitle}
                    </h3>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl font-semibold text-xs ${
                            isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-3">
              <button
                onClick={handleToggleMaintenance}
                className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center space-x-2"
              >
                <Wrench className="w-4 h-4" />
                <span>{maintenanceMode ? 'Maintenance ON' : 'Toggle Maintenance'}</span>
              </button>

              <div className="flex justify-between items-center">
                <Link to="/" onClick={() => setMobileSidebarOpen(false)} className="text-xs font-bold text-indigo-600">
                  Storefront ↗
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>EasyUVerse Command Center</span>
            </h1>
          </div>

          <div className="flex items-center space-x-3 text-xs font-bold">
            <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <span>UPI Verified: 9241034816@mbkns</span>
            </span>
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-bold flex items-center gap-1"
            >
              <span>View Site</span> ↗
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
