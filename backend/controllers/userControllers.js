import { supabase } from "../config/database.js";

// Reset quiz progress for a user
export const resetQuiz = async (req, res) => {
  try {
    const { googleId, subModuleId } = req.body.data;
    if (!googleId || !subModuleId)
      return res.status(400).json({ message: "Missing googleId or subModuleId" });

    const { data: existing, error: fetchError } = await supabase
      .from("analytics")
      .select("_id")
      .eq("google_id", googleId)
      .eq("sub_module_id", subModuleId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
    if (!existing) return res.status(404).json({ message: "Analytics not found" });

    const { error: deleteError } = await supabase
      .from("analytics")
      .delete()
      .eq("google_id", googleId)
      .eq("sub_module_id", subModuleId);

    if (deleteError) throw deleteError;

    res.status(200).json({ message: "Quiz data reset successfully" });
  } catch (error) {
    console.error("Error resetting quiz:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get attempted submodules for a user
export const getAttemptedSubModules = async (req, res) => {
  try {
    const { googleId, subjectId } = req.query;
    if (!googleId || !subjectId)
      return res.status(400).json({ message: "Missing googleId or subjectId" });

    const { data, error } = await supabase
      .from("analytics")
      .select("sub_module_id")
      .eq("google_id", googleId)
      .eq("subject_id", subjectId);

    if (error) throw error;

    const attemptedSubmodules = data.map((d) => d.sub_module_id);
    res.status(200).json({ attemptedSubmodules });
  } catch (error) {
    console.error("Error getting attempted submodules:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Submit analytics data
export const submitAnalytics = async (req, res) => {
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

    if (!googleId || !subModuleId || !subjectId || !Array.isArray(questionAnswers)) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const { data, error } = await supabase.from("analytics").insert([
      {
        google_id: googleId,
        subject_id: subjectId,
        sub_module_id: subModuleId,
        tag_counts: tagCounts,
        question_answers: questionAnswers,
        total_time_spent: totalTimeSpent,
        correct_answers: correctAnswers,
        incorrect_answers: incorrectAnswers,
        progress,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    res.status(200).json({ message: "Analytics submitted", data });
  } catch (error) {
    console.error("Error submitting analytics:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Fetch analytics for user
export const getAnalyticsData = async (req, res) => {
  try {
    const { googleId, subModuleId } = req.query;
    if (!googleId) return res.status(400).json({ message: "Missing googleId" });

    let query = supabase
      .from("analytics")
      .select("*")
      .eq("google_id", googleId)
      .order("updated_at", { ascending: true });

    if (subModuleId) query = query.eq("sub_module_id", subModuleId);

    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0)
      return res.status(404).json({ message: "No analytics found" });

    // Compute stats
    let totalCorrect = 0, totalIncorrect = 0, totalTime = 0, totalQuestions = 0, bestScore = 0;
    const ok = [], bad = [], important = [], common = [], timeline = [], activityMap = new Map();
    const today = new Date();
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    data.forEach((record) => {
      totalCorrect += record.correct_answers || 0;
      totalIncorrect += record.incorrect_answers || 0;
      totalTime += record.total_time_spent || 0;
      totalQuestions += record.question_answers?.length || 0;

      const quizTotal = record.question_answers?.length || 0;
      const score = quizTotal > 0 ? Math.round((record.correct_answers / quizTotal) * 100) : 0;
      bestScore = Math.max(bestScore, score);

      const quizDate = new Date(record.updated_at);
      const dayLabel = quizDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      timeline.push({ label: dayLabel, score });
      if (quizDate >= fourteenDaysAgo) activityMap.set(dayLabel, (activityMap.get(dayLabel) || 0) + 1);

      record.question_answers?.forEach((q) => {
        if (q.tag === "ok") ok.push(q);
        else if (q.tag === "bad") bad.push(q);
        else if (q.tag === "important") important.push(q);
        if (q.notes) common.push(q);
      });
    });

    const activity = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      activity.push({ day: key, count: activityMap.get(key) || 0 });
    }

    res.json({
      responseData: {
        stats: { totalQuestions, correctAnswers: totalCorrect, incorrectAnswers: totalIncorrect, totalTimeSpent: totalTime, totalQuizzes: data.length, bestScore },
        questionClassification: { ok, bad, important, common },
        timeline,
        activity,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ message: "Internal error", error: error.message });
  }
};

// Fetch all questions for a submodule
export const getSubmoduleQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("submodule_id", id);

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: "No questions found" });

    res.json({ questions: data });
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions", details: error.message });
  }
};

// Submit user’s answer
export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, subModuleId, userAnswer } = req.body;

    const { data: analytics } = await supabase
      .from("analytics")
      .select("_id, question_answers")
      .eq("user_id", userId)
      .eq("sub_module_id", subModuleId)
      .single();

    if (!analytics) {
      await supabase.from("analytics").insert([{
        user_id: userId,
        sub_module_id: subModuleId,
        question_answers: [{ question_id: id, user_answer: userAnswer }],
      }]);
    } else {
      const updatedAnswers = analytics.question_answers || [];
      const existing = updatedAnswers.find((q) => q.question_id === id);
      if (existing) existing.user_answer = userAnswer;
      else updatedAnswers.push({ question_id: id, user_answer: userAnswer });

      await supabase.from("analytics").update({ question_answers: updatedAnswers }).eq("_id", analytics._id);
    }

    res.json({ message: "Answer submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting answer", details: error.message });
  }
};

// Add note to a question
export const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, subModuleId, note } = req.body;

    const { data: analytics } = await supabase
      .from("analytics")
      .select("_id, question_answers")
      .eq("user_id", userId)
      .eq("sub_module_id", subModuleId)
      .single();

    if (!analytics) return res.status(404).json({ error: "Analytics not found" });

    const updated = analytics.question_answers.map((q) =>
      q.question_id === id ? { ...q, notes: note } : q
    );

    const { error } = await supabase
      .from("analytics")
      .update({ question_answers: updated })
      .eq("_id", analytics._id);

    if (error) throw error;
    res.json({ message: "Note added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding note", details: error.message });
  }
};

// Add tag to a question
export const addTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, subModuleId, tag } = req.body;

    const { data: analytics } = await supabase
      .from("analytics")
      .select("_id, question_answers")
      .eq("user_id", userId)
      .eq("sub_module_id", subModuleId)
      .single();

    if (!analytics) return res.status(404).json({ error: "Analytics not found" });

    const updated = analytics.question_answers.map((q) =>
      q.question_id === id ? { ...q, tag } : q
    );

    const { error } = await supabase
      .from("analytics")
      .update({ question_answers: updated })
      .eq("_id", analytics._id);

    if (error) throw error;
    res.json({ message: "Tag added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding tag", details: error.message });
  }
};
