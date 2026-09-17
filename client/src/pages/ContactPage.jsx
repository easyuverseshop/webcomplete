import React, { useState } from 'react';
import { Mail, PhoneCall, Send, MapPin, CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccessMsg('');

    try {
      // 1. Submit lead to database
      await api.post('/leads', {
        name: formData.name,
        email: formData.email,
        serviceType: 'Hire Developer / Contact Inquiry',
        budget: 'Custom Requirement',
        message: formData.message,
      });

      // 2. Dual email notification via formsubmit.co
      try {
        fetch('https://formsubmit.co/ajax/ujjwalcse07@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            _subject: 'New Contact / Hire Inquiry on EasyUVerse',
            _cc: 'ujjwal@easyuverse.shop',
            _captcha: 'false',
          }),
        }).catch((err) => console.error('Formsubmit error:', err));
      } catch (fErr) {
        console.error('Formsubmit trigger error:', fErr);
      }

      setSuccessMsg('Your message has been sent successfully! Ujjwal will get back to you shortly.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      alert('Error submitting message: ' + (err.response?.data?.message || err.message));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Info */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-3xl p-8 text-white space-y-6 shadow-xl border border-cyan-500/20">
          <div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-extrabold">
              DIRECT DEVELOPER SUPPORT
            </span>
            <h1 className="text-3xl font-extrabold mt-3">Contact Ujjwal Kant</h1>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              Have a custom project requirement (School Management System, Portal, Library Software) or need server hosting assistance? Send a message directly!
            </p>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <div className="flex items-center space-x-3 p-3.5 bg-white/5 rounded-2xl border border-white/10">
              <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Primary Emails</span>
                <a href="mailto:ujjwalcse07@gmail.com" className="font-bold hover:underline block text-white">
                  ujjwalcse07@gmail.com
                </a>
                <a href="mailto:ujjwal@easyuverse.shop" className="font-bold hover:underline block text-cyan-300">
                  ujjwal@easyuverse.shop
                </a>
              </div>
            </div>

            <a
              href="https://wa.me/919241034816"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3.5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Direct WhatsApp</span>
                <span className="font-bold text-emerald-400">+91 9241034816</span>
              </div>
            </a>

            <div className="flex items-center space-x-3 p-3.5 bg-white/5 rounded-2xl border border-white/10">
              <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Location</span>
                <span className="font-bold text-white">India • Remote Web Development</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-8 shadow-sm space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Hire / Send Inquiry</h2>
            <p className="text-xs text-gray-500">Fill out the form below. Leads are sent directly to Ujjwal's email and admin dashboard.</p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. ramesh@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Project Requirement Details
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe what software, website, or hosting help you need..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Sending Inquiry...' : 'Submit Inquiry & Send Email'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
