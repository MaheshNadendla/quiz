// paymentControllers.js (Supabase version)
const { supabase } = require("../config/database");

exports.processPayment = async (req, res) => {
  try {
    const { email, cardNumber, amount } = req.body;
    console.log("Processing payment for:", email, amount);

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !user) {
      console.error("User lookup failed:", userError?.message);
      return res.status(404).json({ message: "User not found" });
    }

    // Check subscription status first
    if (user.is_subscribed) {
      return res.status(200).json({
        message: "Already subscribed",
        failed: true,
      });
    }

    // Create payment record
    const paymentRecord = {
      user_id: user._id,
      email,
      card_last_four_digits: cardNumber.slice(-4),
      amount,
      payment_status: "completed",
      payment_date: new Date().toISOString(),
    };

    const { error: paymentError } = await supabase
      .from("payments")
      .insert([paymentRecord]);

    if (paymentError) {
      console.error("Payment insert failed:", paymentError.message);
      return res
        .status(500)
        .json({
          message: "Failed to record payment",
          error: paymentError.message,
        });
    }

    // Update user subscription status
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_subscribed: true })
      .eq("_id", user._id); // ✅ updated key

    if (updateError) {
      console.error("User update failed:", updateError.message);
      return res
        .status(500)
        .json({
          message: "Failed to update subscription",
          error: updateError.message,
        });
    }

    // Respond success
    res.status(200).json({
      message: "Payment processed successfully",
      subscriptionStatus: true,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({
      message: "Payment processing failed",
      error: error.message,
    });
  }
};
