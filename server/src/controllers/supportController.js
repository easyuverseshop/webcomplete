const SupportTicket = require('../models/SupportTicket');

// Helper to generate unique ticket ID
const generateTicketId = () => {
  return `TICK_${Date.now().toString().slice(-6)}_${Math.floor(100 + Math.random() * 900)}`;
};

// @desc    Create new support ticket / contact query
// @route   POST /api/support
// @access  Public / Private
const createTicket = async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const ticketId = generateTicketId();

    const newTicket = await SupportTicket.create({
      ticketId,
      user: req.user ? req.user._id : null,
      name,
      email,
      subject,
      category: category || 'General Query',
      messages: [
        {
          sender: 'user',
          senderName: name,
          message,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully! We will get back to you shortly.',
      data: newTicket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's tickets
// @route   GET /api/support/my-tickets
// @access  Private
const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      $or: [{ user: req.user._id }, { email: req.user.email }],
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all tickets (Admin)
// @route   GET /api/support/admin/all
// @access  Private/Admin
const getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ updatedAt: -1 });
    res.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add reply message to ticket
// @route   POST /api/support/:ticketId/reply
// @access  Public / Private
const replyTicket = async (req, res) => {
  try {
    const { message } = req.body;
    const ticketId = req.params.ticketId;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const ticket = await SupportTicket.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const isUserAdmin = req.user && req.user.role === 'admin';
    const senderRole = isUserAdmin ? 'admin' : 'user';
    const senderName = isUserAdmin ? 'EasyUVerse Support' : (req.user ? req.user.name : ticket.name);

    ticket.messages.push({
      sender: senderRole,
      senderName,
      message,
    });

    if (isUserAdmin && ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }

    await ticket.save();

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update ticket status (Admin)
// @route   PUT /api/support/admin/:ticketId/status
// @access  Private/Admin
const updateTicketStatus = async (req, res) => {
  try {
    const { status, priority } = req.body;
    const ticket = await SupportTicket.findOne({ ticketId: req.params.ticketId });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;

    await ticket.save();

    res.json({
      success: true,
      message: 'Ticket status updated',
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getAllTickets,
  replyTicket,
  updateTicketStatus,
};
