const Feedback = require('../models/Feedback');

// @desc    Get all approved client feedback/reviews
// @route   GET /api/feedback
// @access  Public
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit new client feedback/rating
// @route   POST /api/feedback
// @access  Public
const createFeedback = async (req, res) => {
  try {
    const { name, projectName, rating, review } = req.body;

    if (!name || !rating || !review) {
      return res.status(400).json({ success: false, message: 'Please fill in name, rating and review.' });
    }

    const newFeedback = await Feedback.create({
      name,
      projectName: projectName || 'General Review',
      rating: Number(rating),
      review,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for rating EasyUVerse! Your feedback has been submitted.',
      data: newFeedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFeedbacks,
  createFeedback,
};
