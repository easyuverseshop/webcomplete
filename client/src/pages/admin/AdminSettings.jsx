import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { Settings, Save, CheckCircle2, QrCode, Share2, Eye, Image } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'EasyUVerse',
    siteLogo: '',
    tagline: 'Premium MERN, PHP, Python, Java & HTML Source Codes Marketplace',
    contactEmail: 'support@easyuverse.com',
    contactPhone: '+91 9241034816',
    bannerNotice: '🚀 Welcome to EasyUVerse! Scan UPI QR & enter 12-digit UTR for instant zip source code access.',
    upiId: '9241034816@mbkns',
    upiName: 'Ujjwal Kant / EasyUVerse',
    upiQrImage: '',
    autoApproveUtr: true,
    supportEnabled: true,
    visitorCount: 1420,
    socialLinks: {
      github: 'https://github.com/ujjwalkant',
      linkedin: 'https://linkedin.com/in/ujjwalkant',
      instagram: 'https://instagram.com/ujjwalkant',
      youtube: 'https://youtube.com/@easyuverse',
      whatsapp: 'https://wa.me/919241034816',
      telegram: 'https://t.me/easyuverse',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data?.success && res.data?.data) {
        setSettings({
          ...res.data.data,
          siteLogo: res.data.data.siteLogo || '',
          socialLinks: {
            github: res.data.data.socialLinks?.github || 'https://github.com/ujjwalkant',
            linkedin: res.data.data.socialLinks?.linkedin || 'https://linkedin.com/in/ujjwalkant',
            instagram: res.data.data.socialLinks?.instagram || 'https://instagram.com/ujjwalkant',
            youtube: res.data.data.socialLinks?.youtube || 'https://youtube.com/@easyuverse',
            whatsapp: res.data.data.socialLinks?.whatsapp || 'https://wa.me/919241034816',
            telegram: res.data.data.socialLinks?.telegram || 'https://t.me/easyuverse',
          },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await api.put('/admin/settings', settings);
      if (res.data?.success) {
        setSuccessMsg('Settings updated successfully!');
      }
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Platform & Payment Settings</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage custom PNG/JPEG logo image, UPI QR payment parameters, social media links, visitor counter, and developer info.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading settings...</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm space-y-6 text-xs">
            {/* Brand Logo Upload Setup */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center space-x-2">
                <Image className="w-4 h-4 text-indigo-500" />
                <span>Custom Brand Logo Image (PNG / JPEG / SVG / WebP)</span>
              </h3>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Brand Logo Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={settings.siteLogo}
                  onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
                  placeholder="https://res.cloudinary.com/demo/image/upload/v1/easyuverse_logo.png"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Leave empty to use the default EasyUVerse logo icon vector. Paste any custom PNG, JPEG, SVG, or Cloudinary image link here.
                </p>
              </div>
            </div>

            {/* Direct UPI Setup */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center space-x-2">
                <QrCode className="w-4 h-4 text-indigo-500" />
                <span>Direct UPI Payment Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    UPI ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.upiId}
                    onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Payee Name / Developer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.upiName}
                    onChange={(e) => setSettings({ ...settings, upiName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links Manager */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-indigo-500" />
                <span>Social Media Links Manager</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.github}
                    onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, github: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.linkedin}
                    onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.instagram}
                    onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">YouTube Channel URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.youtube}
                    onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, youtube: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">WhatsApp Direct Chat</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.whatsapp}
                    onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, whatsapp: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Telegram Group / Channel</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.telegram}
                    onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, telegram: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Visitor Counter Config */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center space-x-2">
                <Eye className="w-4 h-4 text-indigo-500" />
                <span>Live Visitor Counter</span>
              </h3>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Current Total Visitors</label>
                <input
                  type="number"
                  value={settings.visitorCount}
                  onChange={(e) => setSettings({ ...settings, visitorCount: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-bold text-indigo-600"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
