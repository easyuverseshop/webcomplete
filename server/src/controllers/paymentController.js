const Order = require('../models/Order');
const Project = require('../models/Project');
const User = require('../models/User');
const SiteSetting = require('../models/SiteSetting');

// @desc    Initiate Direct UPI QR Order with Secret Pay Ref Code
// @route   POST /api/payments/initiate-upi
// @access  Private
const initiateUpiOrder = async (req, res) => {
  try {
    const { projectId, customerPhone, couponCode } = req.body;

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }

    let amount = (project.discountPrice && project.discountPrice > 0 && project.discountPrice < project.price) ? project.discountPrice : project.price;

    // Apply Coupon Code if provided
    if (couponCode) {
      const Coupon = require('../models/Coupon');
      const validCoupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), isActive: true });
      if (validCoupon) {
        const discountVal = (amount * validCoupon.discountPercentage) / 100;
        const finalDiscount = Math.min(discountVal, validCoupon.maxDiscount || discountVal);
        amount = Math.max(1, Math.round(amount - finalDiscount));
      }
    }

    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const currentMonth = monthNames[new Date().getMonth()];
    const random3Digits = String(Math.floor(1 + Math.random() * 999)).padStart(3, '0');
    const orderId = `uverse-${currentMonth}-${random3Digits}`;
    const secretRefCode = `REF-${Math.floor(100000 + Math.random() * 900000)}`;

    const cleanUpiId = (settings.upiId || '9241034816@mbkns').trim();
    const cleanUpiName = (settings.upiName || 'EasyUVerse').replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'EasyUVerse';

    // Standard NPCI compliant UPI URI format (pa, pn, am, cu)
    const upiUri = `upi://pay?pa=${cleanUpiId}&pn=${encodeURIComponent(cleanUpiName)}&am=${amount}&cu=INR`;
    const qrCodeUrl = settings.upiQrImage || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`;

    // Create pending order
    const newOrder = await Order.create({
      user: req.user._id,
      project: project._id,
      amount,
      currency: 'INR',
      orderId,
      secretRefCode,
      paymentStatus: 'PENDING_VERIFICATION',
      paymentMethod: 'DIRECT_UPI_QR',
      customerDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: customerPhone || req.user.phone || '',
      },
    });

    res.json({
      success: true,
      data: {
        orderId: newOrder.orderId,
        secretRefCode,
        amount,
        upiId: cleanUpiId,
        upiName: cleanUpiName,
        qrCodeUrl: settings.upiQrImage || qrCodeUrl,
        upiUri,
      },
    });
  } catch (error) {
    console.error('Initiate UPI Exception:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit UTR Number for Strict Server-Side Validation & Auto-Approval
// @route   POST /api/payments/submit-utr
// @access  Private
const submitUtrVerification = async (req, res) => {
  try {
    const { orderId, utrNumber } = req.body;

    if (!orderId || !utrNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and 12-Digit UTR Number are required',
      });
    }

    const cleanUtr = utrNumber.toString().replace(/\D/g, '').trim();

    // 1. Strict Server-Side Validation: Must be exactly 12 numeric digits
    if (cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid UTR format. UTR number must be exactly 12 digits (numbers only, e.g. 426189012345). Do not include letters or special characters.',
      });
    }

    // 2. Prevent Duplicate UTR Reuse
    const existingUsedUtr = await Order.findOne({
      utrNumber: cleanUtr,
      paymentStatus: 'SUCCESS',
    });

    if (existingUsedUtr) {
      return res.status(400).json({
        success: false,
        message: 'This UTR / Transaction Reference Number has already been used on another order.',
      });
    }

    const order = await Order.findOne({ orderId }).populate('project');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found' });
    }

    let settings = await SiteSetting.findOne();
    order.utrNumber = cleanUtr;
    order.paymentStatus = 'PENDING_VERIFICATION';
    await order.save();

    return res.json({
      success: true,
      message: '12-Digit UTR Number submitted successfully! Order is pending verification by admin.',
      data: {
        order,
        status: 'PENDING_VERIFICATION',
      },
    });
  } catch (error) {
    console.error('Submit UTR Exception:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Approve Order UTR (Admin)
// @route   PUT /api/payments/admin/approve/:id
// @access  Private/Admin
const adminApproveOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('project');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.paymentStatus !== 'SUCCESS') {
      order.paymentStatus = 'SUCCESS';

      const user = await User.findById(order.user);
      if (user && order.project && !user.purchasedProjects.includes(order.project._id)) {
        user.purchasedProjects.push(order.project._id);
        await user.save();
      }

      if (order.project) {
        await Project.findByIdAndUpdate(order.project._id, { $inc: { salesCount: 1 } });
      }

      await order.save();
    }

    res.json({
      success: true,
      message: 'Order approved successfully!',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Reject Order UTR (Admin)
// @route   PUT /api/payments/admin/reject/:id
// @access  Private/Admin
const adminRejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = 'REJECTED';
    await order.save();

    res.json({
      success: true,
      message: 'Order rejected',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders & purchases
// @route   GET /api/payments/my-purchases
// @access  Private
const getMyPurchases = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('project')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  initiateUpiOrder,
  submitUtrVerification,
  adminApproveOrder,
  adminRejectOrder,
  getMyPurchases,
};
