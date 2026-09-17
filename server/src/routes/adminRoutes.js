const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  updateUserRole,
  getAllOrders,
  deleteOrder,
  getSiteSettings,
  updateSiteSettings,
  toggleMaintenanceMode,
  recordVisitor,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/users', protect, adminOnly, getUsers);
router.put('/users/:id', protect, adminOnly, updateUserRole);
router.get('/orders', protect, adminOnly, getAllOrders);
router.delete('/orders/:id', protect, adminOnly, deleteOrder);
router.get('/settings', getSiteSettings);
router.put('/settings', protect, adminOnly, updateSiteSettings);
router.post('/maintenance', protect, adminOnly, toggleMaintenanceMode);
router.post('/visit', recordVisitor);

module.exports = router;
