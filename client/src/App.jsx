import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SupportModal from './components/SupportModal';
import SearchModal from './components/SearchModal';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public & User Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import Support from './pages/Support';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import Terms from './pages/Terms';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminOrders from './pages/admin/AdminOrders';
import AdminServices from './pages/admin/AdminServices';
import AdminShowcase from './pages/admin/AdminShowcase';
import AdminYouTube from './pages/admin/AdminYouTube';
import AdminLeads from './pages/admin/AdminLeads';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSupport from './pages/admin/AdminSupport';
import AdminSettings from './pages/admin/AdminSettings';

function AppContent() {
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Global Ctrl+K Search shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-gray-100 transition-colors overflow-x-hidden">
      {!isAdminRoute && (
        <Navbar
          onOpenSupport={() => setSupportModalOpen(true)}
          onOpenSearch={() => setSearchModalOpen(true)}
        />
      )}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home onOpenSupport={() => setSupportModalOpen(true)} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:idOrSlug" element={<ProjectDetail />} />
          <Route path="/checkout/status" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* User Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={<Support onOpenSupport={() => setSupportModalOpen(true)} />}
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <AdminRoute>
                <AdminProjects />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <AdminRoute>
                <AdminServices />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/showcase"
            element={
              <AdminRoute>
                <AdminShowcase />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/youtube"
            element={
              <AdminRoute>
                <AdminYouTube />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <AdminRoute>
                <AdminLeads />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <AdminRoute>
                <AdminSupport />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <AdminRoute>
                <AdminCoupons />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/support"
            element={
              <AdminRoute>
                <AdminSupport />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer onOpenSupport={() => setSupportModalOpen(true)} />}

      {/* Global Modals */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
