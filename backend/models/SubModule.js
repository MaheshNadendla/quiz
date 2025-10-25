const mongoose = require("mongoose");

const subModuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  isPro: { type: Boolean, default: false },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  // ADDED: Soft-delete flag to enable/disable submodule without permanent deletion
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("SubModule", subModuleSchema);
