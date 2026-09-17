const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    shortDescription: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Full Stack MERN',
        'PHP & MySQL',
        'HTML CSS JS',
        'Python & Automation',
        'Java & Spring Boot',
        'C / C++ Programs',
        'Mobile App',
        'UI Template',
      ],
      default: 'Full Stack MERN',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    demoUrl: {
      type: String,
      default: '',
    },
    downloadUrl: {
      type: String,
      required: [true, 'Download Cloudinary ZIP link is required'],
    },
    fileFormat: {
      type: String,
      default: '.ZIP Source Code',
    },
    fileSize: {
      type: String,
      default: '15.4 MB',
    },
    setupCommand: {
      type: String,
      default: 'npm install && npm start',
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    },
    screenshots: [
      {
        type: String,
      },
    ],
    techStack: [
      {
        type: String,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
