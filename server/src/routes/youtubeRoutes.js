const express = require('express');
const router = express.Router();
const YouTubeVideo = require('../models/YouTubeVideo');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const extractYouTubeId = (url) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : url;
};

router.get('/', async (req, res) => {
  try {
    const videos = await YouTubeVideo.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, videoUrl, category, description, duration } = req.body;
    const youtubeId = extractYouTubeId(videoUrl);
    const video = await YouTubeVideo.create({
      title,
      videoUrl,
      youtubeId,
      category,
      description,
      duration,
    });
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await YouTubeVideo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
