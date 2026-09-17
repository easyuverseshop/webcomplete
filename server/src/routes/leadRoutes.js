const express = require('express');
const router = express.Router();
const ClientLead = require('../models/ClientLead');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public submit inquiry / hiring lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, serviceType, budget, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    const lead = await ClientLead.create({
      name,
      email,
      phone,
      serviceType,
      budget,
      message,
    });
    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Admin get all leads
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const leads = await ClientLead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin update lead status
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const lead = await ClientLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    lead.status = req.body.status || lead.status;
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin delete lead
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await ClientLead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
