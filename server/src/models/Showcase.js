const mongoose = require('mongoose');

const showcaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },
    githubUrl: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Full Stack MERN',
    },
    techStack: [{ type: String }],
    description: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Showcase', showcaseSchema);
