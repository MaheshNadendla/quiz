// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema({
//   subModuleId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "SubModule",
//     required: true,
//   },
//   questionText: { type: String, required: true },
//   options: [
//     {
//       optionText: { type: String, required: true },
//       isCorrect: { type: Boolean, default: false },
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Question", questionSchema);

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['mcq', 'truefalse', 'fillblanks', 'matchfollowing'],
    default: 'mcq',
    required: true,
  },
  // For MCQ questions
  options: [
    {
      optionText: {
        type: String,
        required: function() {
          return this.questionType === 'mcq';
        },
      },
      isCorrect: {
        type: Boolean,
        default: false,
      },
    },
  ],
  // For True/False questions
  correctAnswer: {
    type: Boolean,
    required: function() {
      return this.questionType === 'truefalse';
    },
  },
  // For Fill in the blanks questions
  blanks: [
    {
      type: String,
      required: function() {
        return this.questionType === 'fillblanks';
      },
    },
  ],
  // For Match the following questions
  leftItems: [
    {
      type: String,
      required: function() {
        return this.questionType === 'matchfollowing';
      },
    },
  ],
  rightItems: [
    {
      type: String,
      required: function() {
        return this.questionType === 'matchfollowing';
      },
    },
  ],
  // Mapping for match the following (leftItem index -> rightItem index)
  correctMappings: [
    {
      leftIndex: {
        type: Number,
        required: function() {
          return this.questionType === 'matchfollowing';
        },
      },
      rightIndex: {
        type: Number,
        required: function() {
          return this.questionType === 'matchfollowing';
        },
      },
    },
  ],
});
// const questionSchema = new mongoose.Schema({
//   subModuleId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "SubModule",
//     required: true,
//   },
//   questions: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "atomic", // Reference to the Question model
//     },
//   ], // An array of ObjectIds referencing questions
// });

// module.exports = {
//   Question: mongoose.model("Question", questionSchema),
//   atomic: mongoose.model("atomic", question),
// };

module.exports = mongoose.model("Question", questionSchema);
