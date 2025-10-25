const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  subModules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubModule",
    },
  ],
  // ADDED: Soft-delete flag to enable/disable module without permanent deletion
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Module", moduleSchema);
