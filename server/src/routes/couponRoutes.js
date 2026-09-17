const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public get active coupons for homepage display
router.get('/public', async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate coupon (Public at checkout)
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    res.json({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      maxDiscount: coupon.maxDiscount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin get all coupons
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin create coupon
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { code, discountPercentage, maxDiscount, isActive } = req.body;
    const coupon = await Coupon.create({
      code,
      discountPercentage,
      maxDiscount,
      isActive,
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin delete coupon
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
