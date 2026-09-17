const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'EasyUVerse',
    },
    siteLogo: {
      type: String,
      default: '',
    },
    tagline: {
      type: String,
      default: 'Premium MERN, PHP, Python, Java & HTML Source Codes Marketplace',
    },
    contactEmail: {
      type: String,
      default: 'support@easyuverse.com',
    },
    contactPhone: {
      type: String,
      default: '+91 9241034816',
    },
    bannerNotice: {
      type: String,
      default: '🚀 Welcome to EasyUVerse! Scan UPI QR & enter 12-digit UTR for instant zip source code access.',
    },
    upiId: {
      type: String,
      default: '9241034816@mbkns',
    },
    upiName: {
      type: String,
      default: 'Ujjwal Kant / EasyUVerse',
    },
    upiQrImage: {
      type: String,
      default: '',
    },
    autoApproveUtr: {
      type: Boolean,
      default: true,
    },
    supportEnabled: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    visitorCount: {
      type: Number,
      default: 1,
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com/ujjwalkant' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      whatsapp: { type: String, default: 'https://wa.me/919241034816' },
      telegram: { type: String, default: 'https://t.me' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
