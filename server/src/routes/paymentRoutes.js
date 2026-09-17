const express = require('express');
const router = express.Router();
const {
  initiateUpiOrder,
  submitUtrVerification,
  adminApproveOrder,
  adminRejectOrder,
  getMyPurchases,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/initiate-upi', protect, initiateUpiOrder);
router.post('/submit-utr', protect, submitUtrVerification);
router.put('/admin/approve/:id', protect, adminOnly, adminApproveOrder);
router.put('/admin/reject/:id', protect, adminOnly, adminRejectOrder);
router.get('/my-purchases', protect, getMyPurchases);

module.exports = router;
