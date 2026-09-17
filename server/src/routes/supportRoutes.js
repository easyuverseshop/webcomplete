const express = require('express');
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  replyTicket,
  updateTicketStatus,
} = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Optional protect middleware for creating ticket (allows guest queries as well)
const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/', optionalProtect, createTicket);
router.get('/my-tickets', protect, getMyTickets);
router.get('/admin/all', protect, adminOnly, getAllTickets);
router.post('/:ticketId/reply', optionalProtect, replyTicket);
router.put('/admin/:ticketId/status', protect, adminOnly, updateTicketStatus);

module.exports = router;
