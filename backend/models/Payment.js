const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    cardLastFourDigits: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["completed"],
      default: "completed",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
