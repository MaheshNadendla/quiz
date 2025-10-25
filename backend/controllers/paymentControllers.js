const User = require("../models/User");
const Payment = require("../models/Payment");

exports.processPayment = async (req, res) => {
  try {
    const { email, cardNumber, amount } = req.body;
    console.log("printing payment detail");
    console.log(email, cardNumber, amount);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create payment record
    const payment = new Payment({
      userId: user._id,
      email: email,
      cardLastFourDigits: cardNumber.slice(-4),
      amount: amount,
      paymentStatus: "completed",
    });

    await payment.save();
    // console.log(user);
    // Update user subscription status
    if (user.isSubscribed) {
      return res.status(200).json({
        message: "Already subscribed",
        failed: true,
      });
    }
    user.isSubscribed = true;
    await user.save();

    res.status(200).json({
      message: "Payment processed successfully",
      subscriptionStatus: user.isSubscribed,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res
      .status(500)
      .json({ message: "Payment processing failed", error: error.message });
  }
};
