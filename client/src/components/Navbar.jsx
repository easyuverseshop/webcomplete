import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import api from '../services/api';
import {
  ChevronDown,
  Gift,
  Gem,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Youtube,
  HelpCircle,
  Star,
  Globe,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from 'lucide-react';

const Navbar = ({ onOpenSupport, onOpenSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownCodesOpen, setDropdownCodesOpen] = useState(false);
  const [dropdownResourcesOpen, setDropdownResourcesOpen] = useState(false);
  const [dropdownAccountOpen, setDropdownAccountOpen] = useState(false);

  const codesRef = useRef(null);
  const resourcesRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (codesRef.current && !codesRef.current.contains(event.target)) {
        setDropdownCodesOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setDropdownResourcesOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setDropdownAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownAccountOpen(false);
    navigate('/');
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800/80 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* 1. Sabse Aage: AI Generated Logo Image */}
          <Link to="/" className="flex items-center space-x-3 shrink-0 mr-4">
            <Logo logoUrl="/logo.jpg" showText={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-bold text-gray-700 dark:text-gray-200">
            {/* 2. Home */}
            <Link
              to="/"
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                location.pathname === '/' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : ''
              }`}
            >
              Home
            </Link>

            {/* 3. Services */}
            <button
              onClick={() => scrollToSection('services-section')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Services
            </button>

            {/* 4. Dropdown 1: Premium Codes, Free Codes, Live Showcase */}
            <div className="relative" ref={codesRef}>
              <button
                onClick={() => {
                  setDropdownCodesOpen(!dropdownCodesOpen);
                  setDropdownResourcesOpen(false);
                  setDropdownAccountOpen(false);
                }}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center space-x-1 py-1"
              >
                <span>Projects</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownCodesOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownCodesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setDropdownCodesOpen(false);
                      scrollToSection('premium-section');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                  >
                    <Gem className="w-4 h-4 text-amber-500" />
                    <span>Premium Codes</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownCodesOpen(false);
                      scrollToSection('free-section');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                  >
                    <Gift className="w-4 h-4 text-emerald-500" />
                    <span>Free Codes</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownCodesOpen(false);
                      scrollToSection('showcase');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                  >
                    <Globe className="w-4 h-4 text-indigo-500" />
                    <span>Live Showcase</span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. Dropdown 2: YT Videos, FAQs, Reviews */}
            <div className="relative" ref={resourcesRef}>
              <button
                onClick={() => {
                  setDropdownResourcesOpen(!dropdownResourcesOpen);
                  setDropdownCodesOpen(false);
                  setDropdownAccountOpen(false);
                }}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center space-x-1 py-1"
              >
                <span>Community & Media</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownResourcesOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownResourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setDropdownResourcesOpen(false);
                      scrollToSection('youtube-section');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                  >
                    <Youtube className="w-4 h-4 text-rose-500" />
                    <span>YT Videos</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownResourcesOpen(false);
                      scrollToSection('reviews');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                  >
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>Client Reviews</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownResourcesOpen(false);
                      scrollToSection('contact');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                  >
                    <HelpCircle className="w-4 h-4 text-indigo-500" />
                    <span>FAQs & Contact</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* 6. Search */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 text-xs font-bold hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
              title="Search Projects (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-indigo-500" />
              <span>Search</span>
            </button>

            {/* 7. Theme Switch */}
            <ThemeToggle />

            {/* 8. Login / Register Dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => {
                  setDropdownAccountOpen(!dropdownAccountOpen);
                  setDropdownCodesOpen(false);
                  setDropdownResourcesOpen(false);
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-gray-200 font-bold text-xs hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="w-4 h-4 text-indigo-500" />
                <span>{user ? user.name.split(' ')[0] : 'Account'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownAccountOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownAccountOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {user ? (
                    <>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownAccountOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownAccountOpen(false)}
                        className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                        <span>My Dashboard & Downloads</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setDropdownAccountOpen(false)}
                        className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                      >
                        <LogIn className="w-4 h-4 text-indigo-500" />
                        <span>Log In</span>
                      </Link>

                      <Link
                        to="/register"
                        onClick={() => setDropdownAccountOpen(false)}
                        className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800"
                      >
                        <UserPlus className="w-4 h-4 text-indigo-500" />
                        <span>Register Account</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 9. Hire Me Button at the end */}
            <button
              onClick={() => scrollToSection('contact')}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Hire Me</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-3">
            <button onClick={onOpenSearch} className="p-2 text-gray-600 dark:text-gray-300">
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-200 rounded-xl bg-gray-100 dark:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 p-5 shadow-2xl space-y-4">
          <div className="space-y-2 text-sm font-bold text-gray-800 dark:text-gray-200">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 border-b border-gray-100 dark:border-slate-900">
              Home
            </Link>
            <button onClick={() => { setMobileMenuOpen(false); scrollToSection('services-section'); }} className="w-full text-left py-2 border-b border-gray-100 dark:border-slate-900">
              Services
            </button>
            <button onClick={() => { setMobileMenuOpen(false); scrollToSection('premium-section'); }} className="w-full text-left py-2 border-b border-gray-100 dark:border-slate-900 text-amber-500">
              Premium Codes
            </button>
            <button onClick={() => { setMobileMenuOpen(false); scrollToSection('free-section'); }} className="w-full text-left py-2 border-b border-gray-100 dark:border-slate-900 text-emerald-500">
              Free Codes
            </button>
            <button onClick={() => { setMobileMenuOpen(false); scrollToSection('showcase'); }} className="w-full text-left py-2 border-b border-gray-100 dark:border-slate-900">
              Live Showcase
            </button>
            <button onClick={() => { setMobileMenuOpen(false); scrollToSection('youtube-section'); }} className="w-full text-left py-2 border-b border-gray-100 dark:border-slate-900 text-rose-500">
              YT Videos
            </button>
          </div>

          <div className="pt-2 space-y-3">
            <button onClick={() => { setMobileMenuOpen(false); scrollToSection('contact'); }} className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs text-center shadow-lg">
              Hire Me
            </button>

            {user ? (
              <div className="space-y-2">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2.5 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl text-xs font-bold">
                  Dashboard ({user.name})
                </Link>
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="w-full text-center py-2.5 bg-rose-500/10 text-rose-600 rounded-xl text-xs font-bold">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 border rounded-xl text-xs font-bold">
                  Log In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
