const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    secretRefCode: {
      type: String,
      required: true,
    },
    utrNumber: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING_VERIFICATION', 'SUCCESS', 'REJECTED'],
      default: 'PENDING_VERIFICATION',
    },
    paymentMethod: {
      type: String,
      default: 'DIRECT_UPI_QR',
    },
    customerDetails: {
      name: String,
      email: String,
      phone: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
