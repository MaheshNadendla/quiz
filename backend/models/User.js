const mongoose = require("mongoose");

// Define the schema for the user model
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String },
  isSubscribed: { type: Boolean, default: false }, // Subscription status
  isAdmin: { type: Boolean, default: false },
});

// Prevent isAdmin from being accidentally modified
userSchema.pre('save', function(next) {
  // If this is an update and isAdmin is being set to false, prevent it
  if (this.isModified('isAdmin') && this.isAdmin === false && this._originalIsAdmin === true) {
    console.warn('Attempted to remove admin status - preventing save');
    this.isAdmin = true;
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
