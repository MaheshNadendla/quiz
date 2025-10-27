// courseControllers.js
const { supabase } = require("../config/database");

/**
 * Get all subjects for the dashboard with optional search.
 */
exports.getSubjects = async (req, res) => {
  try {
    const { search, includeDisabled } = req.query;
    const showAll = includeDisabled === "1" || includeDisabled === "true";
    let query = supabase
      .from("subjects")
      .select(`
        _id,
        name,
        description,
        is_active,
        created_at,
        modules (
          _id,
          name,
          is_active,
          created_at
        )
      `);

    if (!showAll) query = query.eq("is_active", true);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data: subjects, error } = await query.order("name", {
      ascending: true,
    });

    if (error) throw error;

    res.json({
      subjects,
      totalSubjects: subjects?.length || 0,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch subjects",
      details: error.message,
    });
  }
};

/**
 * Get submodules for a given module
 */
exports.getSubModules = async (req, res) => {
  try {
    const { key } = req.params;
    const { includeDisabled } = req.query;

    const query = supabase.from("submodules").select("*").eq("module_id", key);
    if (!includeDisabled) query.eq("is_active", true);

    const { data: subModules, error } = await query;

    if (error) throw error;

    // Map DB fields to frontend expectations
    const formatted = subModules.map((sm) => ({
      _id: sm.id,
      name: sm.name,
      isActive: sm.is_active,
      isPro: sm.is_pro,
      difficulty: sm.difficulty,
      created_at: sm.created_at,
    }));

    res.json({
      submodules: formatted,
      totalSubModules: formatted.length,
    });
  } catch (err) {
    console.error("Error fetching submodules:", err);
    res.status(500).json({ error: "Failed to fetch submodules" });
  }
};

/**
 * Get all modules and their submodules for a given subject
 */
exports.getModulesAndSubModules = async (req, res) => {
  try {
    const { subjectName } = req.params;
    const { includeDisabled } = req.query;
    const showAll = includeDisabled === "1" || includeDisabled === "true";

    // Find subject by name
    const { data: subject, error: subjectError } = await supabase
      .from("subjects")
      .select("_id, name, description")
      .ilike("name", subjectName)
      .maybeSingle(); // Safer than .single() to avoid fatal errors

    if (subjectError || !subject)
      return res.status(404).json({ error: "Subject not found" });

    // Get modules for this subject
    let modQuery = supabase
      .from("modules")
      .select("_id, name, is_active")
      .eq("subject_id", subject._id);
    if (!showAll) modQuery = modQuery.eq("is_active", true);

    const { data: modules, error: modError } = await modQuery;
    if (modError) throw modError;

    // Get submodules for all modules
    const moduleIds = modules.map((m) => m._id);
    let subQuery = supabase
      .from("submodules")
      .select("_id, name, is_pro, difficulty, is_active, module_id");

    if (moduleIds.length) subQuery = subQuery.in("module_id", moduleIds);
    if (!showAll) subQuery = subQuery.eq("is_active", true);

    const { data: submodules, error: subError } = await subQuery;
    if (subError) throw subError;

    // Get question counts grouped by submodule
    const subIds = submodules.map((s) => s._id);
    let qQuery = supabase
      .from("questions")
      .select("submodule_id", { count: "exact", head: true });

    if (subIds.length) qQuery = qQuery.in("submodule_id", subIds);

    const { count, error: qError } = await qQuery;
    if (qError) console.warn("Question count fetch error:", qError.message);

    // Combine data
    const modulesWithSubs = modules.map((m) => {
      const subMods = submodules.filter((s) => s.module_id === m._id);
      const formattedSubs = subMods.map((sm) => ({
        _id: sm._id,
        name: sm.name,
        isPro: sm.is_pro,
        difficulty: sm.difficulty,
        questionCount: count || 0,
      }));
      return {
        _id: m._id,
        name: m.name,
        isActive: m.is_active,
        subModules: formattedSubs,
        totalSubModules: formattedSubs.length,
      };
    });

    res.json({
      subject,
      modules: modulesWithSubs,
      totalModules: modulesWithSubs.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch modules and submodules",
      details: error.message,
    });
  }
};

/**
 * Get questions for a specific submodule with pagination
 */
exports.getQuestions = async (req, res) => {
  try {
    const { subModuleId } = req.params;
    const { difficulty, lastQuestionId, limit = 10 } = req.query;

    if (!subModuleId)
      return res.status(400).json({ error: "Submodule ID is required" });

    let query = supabase
      .from("questions")
      .select(
        "_id, question_text, options, correct_answer, question_type, difficulty"
      )
      .eq("submodule_id", subModuleId)
      .order("created_at", { ascending: true })
      .limit(parseInt(limit));

    if (difficulty) query = query.eq("difficulty", difficulty);
    if (lastQuestionId) query = query.gt("_id", lastQuestionId);

    const { data: questions, error } = await query;
    if (error) throw error;

    res.json({
      questions,
      pagination: {
        hasMore: questions.length === parseInt(limit),
        nextCursor: questions.length
          ? questions[questions.length - 1]._id
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch questions",
      details: error.message,
    });
  }
};
