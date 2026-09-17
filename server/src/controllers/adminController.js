const User = require('../models/User');
const Project = require('../models/Project');
const Order = require('../models/Order');
const SupportTicket = require('../models/SupportTicket');
const SiteSetting = require('../models/SiteSetting');
const ClientLead = require('../models/ClientLead');
const Feedback = require('../models/Feedback');

// @desc    Get Admin Dashboard Summary Analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProjects = await Project.countDocuments();
    const totalOrders = await Order.countDocuments({ paymentStatus: 'SUCCESS' });
    const pendingUtrCount = await Order.countDocuments({ paymentStatus: 'PENDING_VERIFICATION' });
    const pendingTickets = await SupportTicket.countDocuments({ status: { $ne: 'Closed' } });
    const pendingLeads = await ClientLead.countDocuments({ status: 'New' });
    const totalFeedback = await Feedback.countDocuments();

    let settings = await SiteSetting.findOne();
    const visitorCount = settings ? settings.visitorCount : 1240;
    const maintenanceMode = settings ? settings.maintenanceMode : false;

    // Calculate total revenue from successful orders
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'SUCCESS' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent sales
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('project', 'title thumbnail price')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProjects,
        totalOrders,
        totalRevenue,
        pendingUtrCount,
        pendingTickets,
        pendingLeads,
        totalFeedback,
        visitorCount,
        maintenanceMode,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role || user.role;
    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders list (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('project', 'title price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete order (Admin)
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Order removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get site settings
// @route   GET /api/admin/settings
// @access  Public
const getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update site settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create(req.body);
    } else {
      settings = await SiteSetting.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.json({
      success: true,
      message: 'Site settings updated successfully',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle maintenance mode
// @route   POST /api/admin/maintenance
// @access  Private/Admin
const toggleMaintenanceMode = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }
    settings.maintenanceMode = !settings.maintenanceMode;
    await settings.save();

    res.json({
      success: true,
      maintenanceMode: settings.maintenanceMode,
      message: `Maintenance mode is now ${settings.maintenanceMode ? 'ACTIVE' : 'INACTIVE'}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Increment visitor counter
// @route   POST /api/admin/visit
// @access  Public
const recordVisitor = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({ visitorCount: 1 });
    } else {
      settings.visitorCount = (settings.visitorCount || 0) + 1;
      await settings.save();
    }

    res.json({ success: true, visitorCount: settings.visitorCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  updateUserRole,
  getAllOrders,
  deleteOrder,
  getSiteSettings,
  updateSiteSettings,
  toggleMaintenanceMode,
  recordVisitor,
};
