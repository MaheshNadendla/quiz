// quizController.js
import { supabase } from "../config/database.js";

/**
 * @desc Fetch all quizzes
 * @route GET /api/quizzes
 */
export const getQuizzes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: data?.length || 0,
      quizzes: data,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Add a new quiz
 * @route POST /api/quizzes
 */
export const addQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Title and questions array are required",
      });
    }

    const { data, error } = await supabase
      .from("quizzes")
      .insert([
        {
          title,
          questions,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      quiz: data,
      message: "Quiz created successfully",
    });
  } catch (error) {
    console.error("Error adding quiz:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get a single quiz by ID
 * @route GET /api/quizzes/:id
 */
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("_id", id)
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      quiz: data,
    });
  } catch (error) {
    console.error("Error fetching quiz by ID:", error.message);
    res.status(404).json({ success: false, message: error.message });
  }
};
