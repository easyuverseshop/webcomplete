const mongoose = require('mongoose');

const clientLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    serviceType: {
      type: String,
      default: 'Custom Web Development',
    },
    budget: {
      type: String,
      default: '₹2,000 - ₹5,000',
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Completed', 'Archived'],
      default: 'New',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClientLead', clientLeadSchema);
