const express = require('express');
const router = express.Router();
const path = require('path');
const cloudinary = require('cloudinary').v2;
const upload = require('../middleware/uploadMiddleware');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Configure Cloudinary if ENV vars present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// @route   POST /api/upload/zip
// @desc    Upload ZIP Source Code file (Admin)
// @access  Private/Admin
router.post('/zip', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (isCloudinaryConfigured) {
      // Upload raw .zip to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'raw',
        folder: 'easyuverse_zips',
        use_filename: true,
      });

      return res.json({
        success: true,
        fileUrl: result.secure_url,
        fileName: req.file.originalname,
        fileSize: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    }

    // Fallback to Server local uploads URL
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/upload/image
// @desc    Upload Thumbnail Image file (Admin)
// @access  Private/Admin
router.post('/image', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (isCloudinaryConfigured) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'easyuverse_thumbnails',
      });
      return res.json({ success: true, fileUrl: result.secure_url });
    }

    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.json({ success: true, fileUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
