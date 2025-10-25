const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  subModuleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubModule",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  tagCounts: {
    bad: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    ok: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    important: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  questionAnswers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      userAnswer: { 
        type: mongoose.Schema.Types.Mixed, // Can be String, Boolean, Object, etc.
        required: false 
      },
      isCorrect: { type: Boolean },
      notes: { type: String },
      tag: { type: String, enum: ["bad", "ok", "important"], required: false },
      timeSpent: { type: Number }, // Time spent on this specific question
    },
  ],
  totalTimeSpent: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  incorrectAnswers: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
