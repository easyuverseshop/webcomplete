const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all services (Public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new service (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, startingPrice, techStack, shortDescription, fullDescription, iconName, isAvailable } = req.body;
    const service = await Service.create({
      title,
      startingPrice,
      techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(s => s.trim()) : []),
      shortDescription,
      fullDescription,
      iconName,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update service (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    Object.assign(service, req.body);
    if (req.body.techStack && typeof req.body.techStack === 'string') {
      service.techStack = req.body.techStack.split(',').map(s => s.trim());
    }
    const updated = await service.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete service (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
