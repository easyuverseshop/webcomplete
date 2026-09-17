const mongoose = require('mongoose');

const youtubeVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    youtubeId: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Project Walkthrough',
    },
    description: {
      type: String,
    },
    duration: {
      type: String,
      default: '10:00',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('YouTubeVideo', youtubeVideoSchema);
