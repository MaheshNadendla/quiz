const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  modules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
  ],
  // ADDED: Soft-delete flag to enable/disable subject without permanent deletion
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Subject", subjectSchema);
