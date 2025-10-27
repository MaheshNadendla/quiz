const { supabase } = require('../config/database.js');

/**
 * @desc Register a new user (Google Auth)
 * @route POST /api/users/register
 */
exports.registerUser = async (req, res) => {
  try {
    const { google_id, name, email } = req.body;

    if (!google_id || !email) {
      return res.status(400).json({ error: "Google ID and email are required" });
    }

    // Check if user already exists
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("google_id", google_id)
      .single();

    if (findError && findError.code !== "PGRST116") {
      throw findError;
    }

    if (existingUser) {
      return res.status(200).json({
        message: "User already registered",
        user: existingUser,
      });
    }

    // Insert new user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          google_id,
          name,
          email,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "User registered successfully",
      user: data,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * @desc Get all scores for a user
 * @route GET /api/users/:id/scores
 */
exports.getUserScores = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      totalScores: data.length,
      scores: data,
    });
  } catch (error) {
    console.error("Error fetching user scores:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};
