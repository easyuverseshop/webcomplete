const express = require('express');
const router = express.Router();
const Showcase = require('../models/Showcase');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const items = await Showcase.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, demoUrl, githubUrl, thumbnail, category, techStack, description, isFeatured } = req.body;
    const item = await Showcase.create({
      title,
      demoUrl,
      githubUrl,
      thumbnail,
      category,
      techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(s => s.trim()) : []),
      description,
      isFeatured,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await Showcase.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Showcase item not found' });
    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Showcase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Showcase item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
