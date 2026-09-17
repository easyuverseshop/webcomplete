const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startingPrice: {
      type: Number,
      required: true,
      default: 999,
    },
    techStack: [
      {
        type: String,
      },
    ],
    shortDescription: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
    },
    iconName: {
      type: String,
      default: 'Code',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
