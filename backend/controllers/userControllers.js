const Question = require("../models/Question");
const Analytics = require("../models/Analytics");

// const Analytics = require("../models/Analytics");
const mongoose = require("mongoose");
exports.resetQuiz = async (req, res) => {
  try {
    console.log("reset ke andar aa gya");
    const { googleId, subModuleId } = req.body.data;
    console.log(req.body);
    console.log(googleId, subModuleId, " in reset quiz");
    if (!googleId || !subModuleId) {
      return res.status(400).json({ message: "Missing googleId or subModuleId" });
    }

    // Find the analytics data by googleId and subModuleId
    const analytics = await Analytics.findOne({ googleId, subModuleId });
    console.log("data mil gya");

    if (!analytics) {
      return res.status(404).json({ message: "Analytics data not found" });
    }

    // Delete the analytics data
    await Analytics.deleteOne({ googleId, subModuleId });
    console.log("data delete ho gya");

    res.status(200).json({ message: "Quiz data has been reset successfully" });
  } catch (error) {
    console.error("Error resetting quiz data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAttemptedSubModules = async (req, res) => {
  try {
    const { googleId, subjectId } = req.query;
    console.log(googleId, subjectId, " in get attempted submodules");
    if (!googleId || !subjectId) {
      return res.status(400).json({ message: "Missing googleId or subjectId" });
    }
    // Find the analytics data by googleId and subjectId
    const analytics = await Analytics.find({ googleId, subjectId });
    console.log("data mil gya");
    // if (!analytics) {
    //   return res.status(404).json({ message: "Analytics data not found" });
    //   }
    // Get the attempted submodules from the analytics data
    attemptedSubmodules = [];
    analytics.forEach((data) => {
      attemptedSubmodules.push(data.subModuleId);
    });
    console.log("attempted submodules mil gya");
    res.status(200).json({ attemptedSubmodules });
  } catch (error) {
    console.log("error in fetching attempted subModules", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAnalyticsData = async (req, res) => {
  try {
    const { googleId, subModuleId } = req.query;
    console.log("Google ID: in get analytics data", googleId);
    console.log("Submodule ID:", subModuleId);

    // Validate input
    if (!googleId) {
      return res.status(400).json({ message: "Missing googleId" });
    }

    let analyticsRecords;

    // If subModuleId is provided, get specific submodule analytics
    // Otherwise, get all analytics for the user
    if (subModuleId) {
      analyticsRecords = await Analytics.find({
        googleId,
        subModuleId: new mongoose.Types.ObjectId(subModuleId),
      })
        .populate("questionAnswers.questionId")
        .sort({ updatedAt: 1 }); // Sort by date ascending
    } else {
      analyticsRecords = await Analytics.find({ googleId })
        .populate("questionAnswers.questionId")
        .sort({ updatedAt: 1 }); // Sort by date ascending
    }

    if (!analyticsRecords || analyticsRecords.length === 0) {
      return res.status(404).json({ message: "No analytics data found" });
    }

    // Aggregate stats across all records
    let totalCorrectAnswers = 0;
    let totalIncorrectAnswers = 0;
    let totalTimeSpent = 0;
    let totalQuestions = 0;
    let bestScore = 0;
    let totalQuizzes = analyticsRecords.length;

    // Classification of questions (aggregate across all quizzes)
    const ok = [];
    const bad = [];
    const important = [];
    const common = [];

    // Timeline data for score trend graph
    const timeline = [];

    // Activity data for last 14 days
    const activityMap = new Map();
    const today = new Date();
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    // Process each analytics record
    analyticsRecords.forEach((record, index) => {
      const { correctAnswers, incorrectAnswers, totalTimeSpent: recordTime, questionAnswers, updatedAt } = record;

      // Aggregate stats
      totalCorrectAnswers += correctAnswers || 0;
      totalIncorrectAnswers += incorrectAnswers || 0;
      totalTimeSpent += recordTime || 0;
      totalQuestions += questionAnswers.length;

      // Calculate score for this quiz
      const quizTotal = questionAnswers.length;
      const quizScore = quizTotal > 0 ? Math.round((correctAnswers / quizTotal) * 100) : 0;

      // Track best score
      if (quizScore > bestScore) {
        bestScore = quizScore;
      }

      // Add to timeline
      const quizDate = new Date(updatedAt);
      const dateLabel = quizDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      timeline.push({
        label: `${dateLabel}`,
        score: quizScore,
        accuracy:
          correctAnswers + incorrectAnswers > 0
            ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100)
            : 0,
        date: updatedAt,
      });

      // Activity tracking (last 14 days)
      if (quizDate >= fourteenDaysAgo) {
        const dayKey = quizDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        activityMap.set(dayKey, (activityMap.get(dayKey) || 0) + 1);
      }

      // Process question classifications
      questionAnswers.forEach((qa) => {
        const { questionId, isCorrect, tag, notes } = qa;

        if (tag === "ok") {
          ok.push({ questionId, notes });
        } else if (tag === "bad") {
          bad.push({ questionId, notes });
        } else if (tag === "important") {
          important.push({ questionId, notes });
        }

        if (notes) {
          common.push({ questionId: questionId, notes: notes });
        }
      });
    });

    // Convert activity map to array for last 14 days
    const activity = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayKey = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      activity.push({
        day: dayKey,
        count: activityMap.get(dayKey) || 0,
      });
    }

    // Prepare the response
    const responseData = {
      stats: {
        totalQuestions,
        correctAnswers: totalCorrectAnswers,
        incorrectAnswers: totalIncorrectAnswers,
        totalTimeSpent,
        totalQuizzes,
        bestScore,
      },
      questionClassification: {
        ok,
        bad,
        important,
        common,
      },
      timeline,
      activity,
    };

    console.log("Analytics response prepared:", {
      totalQuizzes,
      timelineLength: timeline.length,
      activityLength: activity.length,
    });

    // Send response
    res.json({
      responseData,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

/// Controller function to handle analytics submission
exports.submitAnalytics = async (req, res) => {
  try {
    const {
      googleId,
      subjectId,
      subModuleId,
      tagCounts,
      questionAnswers,
      totalTimeSpent,
      correctAnswers,
      incorrectAnswers,
      progress,
    } = req.body;

    console.log("Analytics submission data:", req.body);

    // Basic validation
    if (!googleId || !subModuleId || !questionAnswers || !subjectId) {
      console.log("Missing required fields:", {
        googleId,
        subModuleId,
        subjectId,
        hasQuestionAnswers: !!questionAnswers,
      });
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate questionAnswers array
    if (!Array.isArray(questionAnswers)) {
      console.log("questionAnswers is not an array:", questionAnswers);
      return res.status(400).json({ message: "questionAnswers must be an array" });
    }

    // Create a new analytics document
    const analyticsData = new Analytics({
      googleId,
      subjectId,
      subModuleId: subModuleId,
      tagCounts,
      questionAnswers,
      totalTimeSpent,
      correctAnswers,
      incorrectAnswers,
      progress,
      updatedAt: new Date(),
    });

    // Save the analytics data to the database
    await analyticsData.save();
    // console.log("Analytics data saved successfully:", analyticsData);

    // Respond with success
    res.status(200).json({
      message: "Analytics data submitted successfully",
      data: analyticsData,
    });
  } catch (error) {
    // Error handling
    console.error("Error submitting analytics data:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Fetch questions for a submodule
exports.getSubmoduleQuestions = async (req, res) => {
  try {
    const { id } = req.params; // Submodule ID
    const questions = await Question.find({ subModuleId: id });
    if (questions.length === 0) return res.status(404).json({ error: "No questions found for this submodule" });

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions", details: error.message });
  }
};

// Submit an answer for a question
exports.submitAnswer = async (req, res) => {
  try {
    const { id } = req.params; // Question ID
    const { userId, subModuleId, userAnswer } = req.body;

    // Find or create analytics record
    let analytics = await Analytics.findOne({ userId, subModuleId });
    if (!analytics) {
      analytics = new Analytics({ userId, subModuleId, questionAnswers: [] });
    }

    // Update or add question answer
    const existingAnswer = analytics.questionAnswers.find((q) => q.questionId.toString() === id);
    if (existingAnswer) {
      existingAnswer.userAnswer = userAnswer;
    } else {
      analytics.questionAnswers.push({ questionId: id, userAnswer });
    }

    await analytics.save();
    res.json({ message: "Answer submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting answer", details: error.message });
  }
};

// Add a note to a question
exports.addNote = async (req, res) => {
  try {
    const { id } = req.params; // Question ID
    const { userId, subModuleId, note } = req.body;

    let analytics = await Analytics.findOne({ userId, subModuleId });
    if (!analytics) return res.status(404).json({ error: "Analytics record not found" });

    const questionAnswer = analytics.questionAnswers.find((q) => q.questionId.toString() === id);
    if (!questionAnswer) return res.status(404).json({ error: "Question not found in analytics" });

    questionAnswer.notes = note;

    await analytics.save();
    res.json({ message: "Note added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding note", details: error.message });
  }
};

// Add a tag to a question
exports.addTag = async (req, res) => {
  try {
    const { id } = req.params; // Question ID
    const { userId, subModuleId, tag } = req.body;

    let analytics = await Analytics.findOne({ userId, subModuleId });
    if (!analytics) return res.status(404).json({ error: "Analytics record not found" });

    const questionAnswer = analytics.questionAnswers.find((q) => q.questionId.toString() === id);
    if (!questionAnswer) return res.status(404).json({ error: "Question not found in analytics" });

    questionAnswer.tags = tag;

    await analytics.save();
    res.json({ message: "Tag added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding tag", details: error.message });
  }
};

// // Get user analytics
// exports.getUserAnalytics = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     const analytics = await Analytics.find({ userId }).populate(
//       "subModuleId questionAnswers.questionId"
//     );
//     res.json({ analytics });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error fetching analytics", details: error.message });
//   }
// };
