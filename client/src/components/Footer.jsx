import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import api from '../services/api';
import { Eye, Github, Linkedin, Instagram, Youtube, MessageCircle, Send, Heart } from 'lucide-react';

const Footer = ({ onOpenSupport }) => {
  const [visitorCount, setVisitorCount] = useState(1);

  useEffect(() => {
    const recordVisit = async () => {
      try {
        const res = await api.post('/admin/visit');
        if (res.data?.success && res.data?.visitorCount !== undefined) {
          setVisitorCount(res.data.visitorCount);
        } else {
          const settingsRes = await api.get('/admin/settings');
          if (settingsRes.data?.success && settingsRes.data?.data) {
            setVisitorCount(settingsRes.data.data.visitorCount || 1);
          }
        }
      } catch (err) {
        console.error('Visitor counter error:', err);
      }
    };
    recordVisit();
  }, []);

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-gray-400 text-xs transition-colors pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* 1. Brand Logo & 1-2 Lines Description */}
          <div className="space-y-4 md:col-span-5">
            <Link to="/" className="inline-block">
              <Logo logoUrl="/logo.jpg" showText={true} />
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-md text-xs sm:text-sm">
              EasyUVerse is a personal developer platform by <strong>Ujjwal Kant</strong>. Explore free source codes for beginners to learn, download premium web projects, or hire me for custom websites (School Systems, Portals, Library Software) and server hosting assistance.
            </p>
          </div>

          {/* 2. Quick Links (Total 5 links) */}
          <div className="md:col-span-3">
            <h4 className="font-extrabold text-xs text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/projects?category=Premium" className="hover:text-cyan-400 transition-colors">
                  1. Premium Codes
                </Link>
              </li>
              <li>
                <Link to="/projects?category=Free" className="hover:text-cyan-400 transition-colors">
                  2. Free Codes
                </Link>
              </li>
              <li>
                <Link to="/#services-section" className="hover:text-cyan-400 transition-colors">
                  3. Services
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
                  4. Track UTR
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
                  5. Downloads Center
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Legal & Support Links (Total 5 links) */}
          <div className="md:col-span-4">
            <h4 className="font-extrabold text-xs text-white mb-4 uppercase tracking-wider">
              Legal & Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">
                  1. Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-cyan-400 transition-colors">
                  2. Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-cyan-400 transition-colors">
                  3. Support Desk & Tickets
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-cyan-400 transition-colors">
                  4. Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">
                  5. Contact Us / Hire Developer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Niche Sabse Last Me: Bottom Footer Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          {/* Left Side: Live Visitor Counter */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold text-[11px]">
              <Eye className="w-3.5 h-3.5 animate-pulse" />
              <span>{visitorCount} Live Visitors</span>
            </span>
          </div>

          {/* Centre: Social Media Links */}
          <div className="flex items-center space-x-4 shrink-0 text-gray-300">
            <a href="https://github.com/ujjwalkant" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-cyan-400 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-cyan-400 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-cyan-400 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-cyan-400 transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="https://wa.me/919241034816" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-emerald-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="https://t.me" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-cyan-400 transition-colors">
              <Send className="w-4 h-4" />
            </a>
          </div>

          {/* Right Side: Made with love & copyright */}
          <div className="flex items-center space-x-1 shrink-0 text-gray-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>by <strong>Ujjwal Kant</strong> • © {new Date().getFullYear()} EasyUVerse</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
