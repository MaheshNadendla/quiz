const { supabase } = require("../config/database");
const multer = require("multer");
const fs = require("fs");
const XLSX = require("xlsx");
/* ============================================================
   SUBJECTS
============================================================ */

// Add Subject
exports.addSubject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Subject name is required" });

    const { data, error } = await supabase
      .from("subjects")
      .insert([{ name: name.trim(), description, is_active: true }])
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Subject added successfully", subject: data });
  } catch (error) {
    res.status(500).json({ error: "Error adding subject", details: error.message });
  }
};

// Update Subject
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const { data, error } = await supabase
      .from("subjects")
      .update({ name, description })
      .eq("_id", id)
      .select("*")
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Subject not found" });

    res.json({ message: "Subject updated successfully", subject: data });
  } catch (error) {
    res.status(500).json({ error: "Error updating subject", details: error.message });
  }
};

// Delete Subject
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("subjects").delete().eq("_id", id);
    if (error) throw error;
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting subject", details: error.message });
  }
};

// Toggle Subject Active (cascade to modules/submodules)
exports.toggleSubjectActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id) return res.status(400).json({ error: "Missing subject ID" });

    const { data: subjectData, error: subjectError } = await supabase
      .from("subjects")
      .update({ is_active: !!isActive })
      .eq("_id", id)
      .select();

    if (subjectError) throw subjectError;
    if (!subjectData?.length) return res.status(404).json({ error: "Subject not found" });

    // Fetch all module IDs linked to subject
    const { data: modules, error: modFetchError } = await supabase
      .from("modules")
      .select("_id")
      .eq("subject_id", id);

    if (modFetchError) throw modFetchError;

    const moduleIds = modules.map((m) => m._id);
    if (moduleIds.length > 0) {
      // Update modules
      const { error: modUpdateError } = await supabase
        .from("modules")
        .update({ is_active: !!isActive })
        .in("_id", moduleIds);
      if (modUpdateError) throw modUpdateError;

      // Update submodules under these modules
      const { error: subUpdateError } = await supabase
        .from("submodules")
        .update({ is_active: !!isActive })
        .in("module_id", moduleIds);
      if (subUpdateError) throw subUpdateError;
    }

    res.json({
      message: `Subject ${isActive ? "enabled" : "disabled"} successfully`,
      subjectId: id,
      isActive: !!isActive,
    });
  } catch (error) {
    console.error("Toggle subject error:", error.message);
    res.status(500).json({ error: "Error toggling subject", details: error.message });
  }
};

/* ============================================================
   MODULES
============================================================ */

// Add Module
exports.addModule = async (req, res) => {
  try {
    const { name, subjectId, googleId } = req.body;

   
    if (!name || !subjectId)
      return res.status(400).json({ error: "Module name and subjectId are required" });
    if (googleId) {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("is_admin")
        .eq("google_id", googleId)
        .single();

      if (userError || !user?.is_admin)
        return res.status(403).json({ error: "Unauthorized: Admin access required" });
    }
    const { data: subject, error: subjectError } = await supabase
      .from("subjects")
      .select("_id")
      .eq("_id", subjectId)
      .single();

    if (subjectError || !subject)
      return res.status(404).json({ error: "Subject not found" });
    const { data, error } = await supabase
      .from("modules")
      .insert([{ name, subject_id: subjectId, is_active: true }])
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Module created successfully",
      module: data,
    });
  } catch (error) {
    console.error("Add Module Error:", error.message);
    res.status(500).json({
      error: "Failed to create module",
      details: error.message,
    });
  }
};

// Delete Module
exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("modules").delete().eq("_id", id);
    if (error) throw error;
    res.json({ message: "Module deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting module", details: error.message });
  }
};

// Toggle Module Active
exports.toggleModuleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const { data, error } = await supabase
      .from("modules")
      .update({ is_active: !!isActive })
      .eq("_id", id)
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: `Module ${isActive ? "enabled" : "disabled"}`, module: data });
  } catch (error) {
    res.status(500).json({ error: "Error toggling module", details: error.message });
  }
};

/* ============================================================
   SUBMODULES
============================================================ */

// Add Submodule
exports.addSubModule = async (req, res) => {
  try {
    const { name, module_id, is_pro, difficulty } = req.body;
    if (!name || !module_id)
      return res.status(400).json({ error: "Submodule name and module_id are required" });

    const { data: module, error: modError } = await supabase
      .from("modules")
      .select("_id")
      .eq("_id", module_id)
      .single();

    if (modError || !module)
      return res.status(404).json({ error: "Module not found" });

    const { data, error } = await supabase
      .from("submodules")
      .insert([{ name, module_id, is_pro: !!is_pro, difficulty, is_active: true }])
      .select("*")
      .single();

    if (error) throw error;
    res.status(201).json({ message: "Submodule added successfully", submodule: data });
  } catch (error) {
    res.status(500).json({ error: "Error adding submodule", details: error.message });
  }
};

// Delete Submodule
exports.deleteSubModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("submodules").delete().eq("_id", id);
    if (error) throw error;
    res.json({ message: "Submodule deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting submodule", details: error.message });
  }
};

// Toggle Submodule Active
exports.toggleSubModuleActive = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: submodule, error: fetchError } = await supabase
      .from("submodules")
      .select("is_active")
      .eq("id", id)
      .single();

    if (fetchError || !submodule) {
      return res.status(404).json({ error: "Submodule not found" });
    }

    const newStatus = !submodule.is_active;
    const { error: updateError } = await supabase
      .from("submodules")
      .update({ is_active: newStatus })
      .eq("id", id);

    if (updateError) throw updateError;

    res.json({ message: "Submodule status updated", isActive: newStatus });
  } catch (err) {
    console.error("Error toggling submodule:", err);
    res.status(500).json({ error: "Failed to toggle submodule" });
  }
};

/* ============================================================
   QUESTIONS
============================================================ */

// Add Question
exports.addQuestion = async (req, res) => {
  try {
    const { submodule_id, question_text, options, question_type, correct_answer } = req.body;
    if (!submodule_id || !question_text)
      return res.status(400).json({ error: "submodule_id and question_text required" });

    const { data, error } = await supabase
      .from("questions")
      .insert([
        {
          submodule_id,
          question_text,
          question_type: question_type || "mcq",
          options,
          correct_answer: correct_answer || null,
        },
      ])
      .select("*")
      .single();

    if (error) throw error;
    res.status(201).json({ message: "Question added successfully", question: data });
  } catch (error) {
    res.status(500).json({ error: "Error adding question", details: error.message });
  }
};

// Update Question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question_text, options } = req.body;

    const updateData = {};
    if (question_text) updateData.question_text = question_text;
    if (options) updateData.options = options;

    const { data, error } = await supabase
      .from("questions")
      .update(updateData)
      .eq("_id", id)
      .select("*")
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Question not found" });

    res.json({ message: "Question updated successfully", question: data });
  } catch (error) {
    res.status(500).json({ error: "Error updating question", details: error.message });
  }
};

// Delete Question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("questions").delete().eq("_id", id);
    if (error) throw error;
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting question", details: error.message });
  }
};

/* ============================================================
   FILE UPLOAD (JSON)
============================================================ */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage }).single("file");

exports.createSubmoduleWithQuestions = async (req, res) => {
  try {
    const { moduleId, submoduleName, isPro, difficulty, questions } = req.body;
    let parsedQuestions = [];

    console.log(req.body);

    // CASE 1: If Excel file was uploaded
    if (req.file) {
      console.log("Processing uploaded Excel file...");
      const filePath = req.file.path;

      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      parsedQuestions = XLSX.utils.sheet_to_json(sheet);

      fs.unlinkSync(filePath); // remove temp file
    }

    // CASE 2: If JSON questions were provided directly
    else if (questions) {
      console.log("Processing JSON questions...");
      parsedQuestions = typeof questions === "string" ? JSON.parse(questions) : questions;
    } else {
      return res.status(400).json({ error: "No file or JSON data provided" });
    }

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      return res.status(400).json({ error: "No valid questions found" });
    }

    if (!moduleId || !submoduleName) {
      return res.status(400).json({ error: "Missing moduleId or submoduleName" });
    }

    // Insert submodule into Supabase
    const { data: submoduleData, error: submoduleError } = await supabase
      .from("submodules")
      .insert([
        {
          module_id: moduleId,
          name: submoduleName,
          is_pro: isPro === "true" || isPro === true,
          difficulty: difficulty || "easy",
          is_active: true,
        },
      ])
      .select()
      .single();

    if (submoduleError) throw submoduleError;

    // Insert all questions
    const formattedQuestions = parsedQuestions.map((q) => ({
      question_text: q.question || q.Question || "",
      option_a: q.option_a || q.OptionA || "",
      option_b: q.option_b || q.OptionB || "",
      option_c: q.option_c || q.OptionC || "",
      option_d: q.option_d || q.OptionD || "",
      correct_answer: q.correct_answer || q.Correct || "",
      submodule_id: submoduleData.id,
    }));

    const { error: insertError } = await supabase
      .from("questions")
      .insert(formattedQuestions);

    if (insertError) throw insertError;

    res.json({
      message: "Submodule and questions uploaded successfully",
      submodule: submoduleData,
      totalQuestions: formattedQuestions.length,
    });
  } catch (err) {
    console.error("Error uploading submodule:", err);
    res.status(500).json({ error: err.message || "Failed to upload submodule" });
  }
};

// Get Submodule with Questions
exports.getSubmoduleQuestions = async (req, res) => {
  try {
    const { submoduleId } = req.params;

    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .eq("submodule_id", submoduleId);

    if (error) throw error;

    res.json({ questions });
  } catch (err) {
    console.error("Error fetching submodule questions:", err);
    res.status(500).json({ error: "Failed to fetch submodule questions" });
  }
};