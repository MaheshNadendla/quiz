const Subject = require("../models/Subject");
const Module = require("../models/Module");
const SubModule = require("../models/SubModule");
const Question = require("../models/Question");
const path = require("path");
const mongoose = require("mongoose");
// const { Question, atomic } = require("../models/Question");
const multer = require("multer");
const csv = require("csv-parse");
const fs = require("fs");

// Add a subject
exports.addSubject = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log(name,description,"in add subject")
    // Validate required fields
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Subject name is required" });
    }

    const subject = new Subject({
      name: name.trim(),
      description: description ? description.trim() : undefined,
      modules: [], // Initialize empty modules array
      // ADDED: Default active state for soft-delete
      isActive: true,
    });
    await subject.save();
    res.status(201).json({ message: "Subject added successfully", subject });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding subject", details: error.message });
  }
};

// Update a subject
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Validate ID and required fields
    if (!id) {
      return res.status(400).json({ error: "Subject ID is required" });
    }
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Subject name is required" });
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description ? description.trim() : undefined,
      },
      { new: true }
    );
    if (!updatedSubject)
      return res.status(404).json({ error: "Subject not found" });
    res.json({ message: "Subject updated successfully", updatedSubject });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating subject", details: error.message });
  }
};

// ADDED: Toggle Subject active state (enable/disable)
exports.toggleSubjectActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const subject = await Subject.findById(id);
    if (!subject) return res.status(404).json({ error: "Subject not found" });
    subject.isActive = Boolean(isActive);
    await subject.save();

    // Cascade to modules and submodules under this subject
    const modules = await Module.find({ _id: { $in: subject.modules } });
    const moduleIds = modules.map((m) => m._id);
    await Module.updateMany({ _id: { $in: moduleIds } }, { $set: { isActive: Boolean(isActive) } });
    await SubModule.updateMany({ moduleId: { $in: moduleIds } }, { $set: { isActive: Boolean(isActive) } });

    res.json({ message: `Subject ${isActive ? 'enabled' : 'disabled'}`, subjectId: id, isActive: subject.isActive });
  } catch (error) {
    res.status(500).json({ error: "Error toggling subject", details: error.message });
  }
};

// Add a module
exports.addModule = async (req, res) => {
  try {
    const { name, subjectId } = req.body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Valid module name is required" });
    }
    if (!subjectId) {
      return res.status(400).json({ error: "Subject ID is required" });
    }

    // Check if subject exists
    const subjectExists = await Subject.findById(subjectId);
    if (!subjectExists) {
      return res
        .status(404)
        .json({ error: "Subject not found. Please create the subject first" });
    }

    const module = new Module({
      name: name.trim(),
      subjectId,
      subModules: [], // Initialize empty subModules array
    });
    await module.save();
    // Update subject with new module reference
    subjectExists.modules.push(module._id);
    await subjectExists.save();

    res.status(201).json({ message: "Module added successfully", module });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding module", details: error.message });
  }
};

// ADDED: Toggle Module active state (enable/disable)
exports.toggleModuleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const module = await Module.findById(id);
    if (!module) return res.status(404).json({ error: "Module not found" });
    module.isActive = Boolean(isActive);
    await module.save();
    await SubModule.updateMany({ moduleId: id }, { $set: { isActive: Boolean(isActive) } });
    res.json({ message: `Module ${isActive ? 'enabled' : 'disabled'}`, moduleId: id, isActive: module.isActive });
  } catch (error) {
    res.status(500).json({ error: "Error toggling module", details: error.message });
  }
};

// Add a sub-module
exports.addSubModule = async (req, res) => {
  try {
    const { name, moduleId, isPro, difficulty } = req.body;
    console.log(name, moduleId, isPro, difficulty);
    if (
      !name ||
      typeof name !== "string" ||
      name.trim() === "" ||
      !difficulty
    ) {
      return res
        .status(400)
        .json({ error: "Valid sub-module name is required" });
    }
    if (!moduleId) {
      return res.status(400).json({ error: "Module ID is required" });
    }

    // Check if module exists
    const moduleExists = await Module.findById(moduleId);
    if (!moduleExists) {
      return res
        .status(404)
        .json({ error: "Module not found. Please create the module first" });
    }

    // Create a new SubModule instance
    const subModule = new SubModule({
      name: name.trim(),
      moduleId,
      isPro: Boolean(isPro),
      difficulty,
      questions: [], // Initialize empty questions array
    });
    await subModule.save();

    // Update module with new subModule reference
    moduleExists.subModules.push(subModule._id);
    await moduleExists.save();

    res
      .status(201)
      .json({ message: "Sub-module added successfully", subModule });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding sub-module", details: error.message });
  }
};

// ADDED: Toggle SubModule active state (enable/disable)
exports.toggleSubModuleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const subModule = await SubModule.findById(id);
    if (!subModule) return res.status(404).json({ error: "Sub-module not found" });
    subModule.isActive = Boolean(isActive);
    await subModule.save();
    res.json({ message: `Sub-module ${isActive ? 'enabled' : 'disabled'}`, subModuleId: id, isActive: subModule.isActive });
  } catch (error) {
    res.status(500).json({ error: "Error toggling submodule", details: error.message });
  }
};

// Add a question
exports.addQuestion = async (req, res) => {
  try {
    const { subModuleId, questionText, options } = req.body;

    if (!subModuleId || !questionText || !options) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const subModule = await SubModule.findById(subModuleId);
    if (!subModule) {
      return res.status(404).json({ error: "Sub-module not found" });
    }

    const question = new Question({
      subModuleId,
      questionText: questionText.trim(),
      options: options.map((opt) => ({
        optionText: opt.optionText.trim(),
        isCorrect: Boolean(opt.isCorrect),
      })),
    });

    await question.save();

    // Update subModule with new question reference
    subModule.questions.push(question._id);
    await subModule.save();

    res.status(201).json({ message: "Question added successfully", question });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding question", details: error.message });
  }
};
// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, options, difficulty, subModuleId } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ error: "Question ID is required" });
    }

    // Build update object with validation
    const updateData = {};

    if (questionText) {
      if (typeof questionText !== "string" || questionText.trim() === "") {
        return res
          .status(400)
          .json({ error: "Valid question text is required" });
      }
      updateData.questionText = questionText.trim();
    }

    if (options) {
      if (!Array.isArray(options) || options.length < 2) {
        return res
          .status(400)
          .json({ error: "At least two options are required" });
      }
      if (!options.some((opt) => opt.isCorrect)) {
        return res
          .status(400)
          .json({ error: "At least one correct option must be marked" });
      }
      updateData.options = options.map((opt) => ({
        ...opt,
        text: opt.text.trim(),
      }));
    }

    if (difficulty) {
      const validDifficulties = ["easy", "medium", "hard"];
      if (!validDifficulties.includes(difficulty.toLowerCase())) {
        return res.status(400).json({
          error: "Invalid difficulty level. Must be easy, medium, or hard",
        });
      }
      updateData.difficulty = difficulty.toLowerCase();
    }

    if (subModuleId) {
      const subModuleExists = await SubModule.findById(subModuleId);
      if (!subModuleExists) {
        return res.status(404).json({ error: "Sub-module not found" });
      }
      updateData.subModuleId = subModuleId;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedQuestion)
      return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question updated successfully", updatedQuestion });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating question", details: error.message });
  }
};

/// CHANGED: Soft-disable subject instead of cascading delete
exports.deleteSubject = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const subject = await Subject.findById(id).session(session);
    if (!subject) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Subject not found" });
    }

    // Soft-disable subject and cascade to modules/submodules
    subject.isActive = false;
    await subject.save({ session });
    await Module.updateMany({ _id: { $in: subject.modules } }, { $set: { isActive: false } }).session(session);
    await SubModule.updateMany({ moduleId: { $in: subject.modules } }, { $set: { isActive: false } }).session(session);

    await session.commitTransaction();

    res.json({ message: "Subject disabled successfully (soft delete)", subjectId: id });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: "Error disabling subject", details: error.message });
  } finally {
    session.endSession();
  }
};

// CHANGED: Soft-delete Module instead of permanent deletion
exports.deleteModule = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const module = await Module.findById(id).session(session);
    if (!module) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Module not found" });
    }

    // Instead of deletion, disable module and its submodules
    module.isActive = false;
    await module.save({ session });
    await SubModule.updateMany({ moduleId: id }, { $set: { isActive: false } }).session(session);

    await session.commitTransaction();

    res.json({ message: "Module disabled successfully (soft delete)", moduleId: id });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: "Error disabling module", details: error.message });
  } finally {
    session.endSession();
  }
};

// CHANGED: Soft-delete SubModule instead of permanent deletion
exports.deleteSubModule = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const subModule = await SubModule.findById(id).session(session);
    if (!subModule) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Sub-module not found" });
    }

    // Instead of deletion, disable only the submodule
    subModule.isActive = false;
    await subModule.save({ session });

    await session.commitTransaction();

    res.json({ message: "Sub-module disabled successfully (soft delete)", subModuleId: id });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: "Error disabling sub-module", details: error.message });
  } finally {
    session.endSession();
  }
};
// Delete a question (remains the same as it has no dependencies)
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Question ID is required" });
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion)
      return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting question", details: error.message });
  }
};

// Imports remain the same, but ensure mongoose is properly imported

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/json" || file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JSON and CSV files are allowed."));
    }
  },
}).single("file");

// Helper function to process JSON file
const processJSONFile = async (filePath, subModuleId, session) => {
  try {
    const fileData = JSON.parse(await fs.promises.readFile(filePath, "utf8"));
    if (!Array.isArray(fileData.questions)) {
      throw new Error("Invalid JSON format: questions array not found");
    }

    const questions = [];
    let i = 0;
    for (const questionData of fileData.questions) {
      // Validate question type
      const validTypes = ['mcq', 'truefalse', 'fillblanks', 'matchfollowing'];
      const questionType = questionData.questionType || 'mcq';
      
      if (!validTypes.includes(questionType)) {
        throw new Error(`Invalid question type: ${questionType}. Must be one of: ${validTypes.join(', ')}`);
      }

      // Create question object based on type
      const questionObj = {
        subModuleId,
        questionText: questionData.questionText,
        questionType: questionType,
      };

      // Add type-specific fields
      switch (questionType) {
        case 'mcq':
          if (!questionData.options || !Array.isArray(questionData.options)) {
            throw new Error("MCQ questions must have an options array");
          }
          questionObj.options = questionData.options.map((opt) => ({
            optionText: opt.optionText,
            isCorrect: Boolean(opt.isCorrect),
          }));
          break;

        case 'truefalse':
          if (typeof questionData.correctAnswer !== 'boolean') {
            throw new Error("True/False questions must have a correctAnswer boolean field");
          }
          questionObj.correctAnswer = questionData.correctAnswer;
          break;

        case 'fillblanks':
          if (!questionData.blanks || !Array.isArray(questionData.blanks)) {
            throw new Error("Fill in the blanks questions must have a blanks array");
          }
          questionObj.blanks = questionData.blanks;
          break;

        case 'matchfollowing':
          if (!questionData.leftItems || !Array.isArray(questionData.leftItems) ||
              !questionData.rightItems || !Array.isArray(questionData.rightItems)) {
            throw new Error("Match the following questions must have leftItems and rightItems arrays");
          }
          questionObj.leftItems = questionData.leftItems;
          questionObj.rightItems = questionData.rightItems;
          questionObj.correctMappings = questionData.correctMappings || [];
          break;
      }

      const question = new Question(questionObj);
      console.log("questions beech mein = ", questions);
      if (session) {
        await question.save({ session });
      } else {
        await question.save();
      }
      questions.push(question._id);
      console.log("questions baad mein= ", questions);
      console.log(i++);
    }

    // Update submodule with questions
    const updateOptions = session ? { session, new: true } : { new: true };
    const result = await SubModule.findByIdAndUpdate(
      subModuleId,
      { $push: { questions: { $each: questions } } },
      updateOptions
    );
    console.log(result);

    return questions;
  } catch (error) {
    console.log("error", error);
    throw new Error(`Error processing JSON file: ${error.message}`);
  }
};

// Helper function to process CSV file
const processCSVFile = async (filePath, subModuleId, session) => {
  try {
    const questions = [];
    const records = await new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv.parse({ columns: true, delimiter: "," }))
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });

    for (const record of records) {
      const questionType = record.questionType?.toLowerCase() || 'mcq';
      
      const questionObj = {
        subModuleId,
        questionText: record.questionText.trim(),
        questionType: questionType,
      };

      // Process based on question type
      switch (questionType) {
        case 'mcq':
          const options = [];
          for (let i = 1; i <= 4; i++) {
            if (record[`option${i}`]) {
              options.push({
                optionText: record[`option${i}`].trim(),
                isCorrect: record[`isCorrect${i}`]?.toLowerCase() === "true",
              });
            }
          }
          questionObj.options = options;
          break;

        case 'truefalse':
          questionObj.correctAnswer = record.correctAnswer?.toLowerCase() === "true";
          break;

        case 'fillblanks':
          const blanks = [];
          for (let i = 1; i <= 5; i++) { // Support up to 5 blanks
            if (record[`blank${i}`]) {
              blanks.push(record[`blank${i}`].trim());
            }
          }
          questionObj.blanks = blanks;
          break;

        case 'matchfollowing':
          const leftItems = [];
          const rightItems = [];
          const correctMappings = [];
          
          // Parse left items
          for (let i = 1; i <= 5; i++) {
            if (record[`leftItem${i}`]) {
              leftItems.push(record[`leftItem${i}`].trim());
            }
          }
          
          // Parse right items
          for (let i = 1; i <= 5; i++) {
            if (record[`rightItem${i}`]) {
              rightItems.push(record[`rightItem${i}`].trim());
            }
          }
          
          // Parse correct mappings (format: "0:2,1:0,2:1" means leftItem0->rightItem2, etc.)
          if (record.correctMappings) {
            const mappings = record.correctMappings.split(',');
            mappings.forEach(mapping => {
              const [leftIdx, rightIdx] = mapping.split(':');
              if (leftIdx && rightIdx) {
                correctMappings.push({
                  leftIndex: parseInt(leftIdx.trim()),
                  rightIndex: parseInt(rightIdx.trim())
                });
              }
            });
          }
          
          questionObj.leftItems = leftItems;
          questionObj.rightItems = rightItems;
          questionObj.correctMappings = correctMappings;
          break;

        default:
          throw new Error(`Unsupported question type in CSV: ${questionType}`);
      }

      const question = new Question(questionObj);
      await question.save({ session });
      questions.push(question._id);
    }

    // Update submodule with questions
    await SubModule.findByIdAndUpdate(
      subModuleId,
      { $push: { questions: { $each: questions } } },
      { session, new: true }
    );

    return questions;
  } catch (error) {
    throw new Error(`Error processing CSV file: ${error.message}`);
  }
};

exports.createSubmoduleWithQuestions = async (req, res) => {
  console.log("backend fxn ke andar aaya");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Handle file upload first
    await new Promise((resolve, reject) => {
      upload(req, res, function (err) {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.file) {
      throw new Error("Question file is required");
    }

    console.log(req.body);
    const { name, moduleId, difficulty } = req.body;
    const isPro = req.body.isPro === "true"; // or 'false'

    // Validate inputs
    if (!name || !moduleId || !difficulty) {
      throw new Error("Missing required fields");
    }

    // Check if module exists

    let moduleExists = null;
    try {
      moduleExists = await Module.findById(moduleId).session(session);
    } catch (err) {
      console.error("Error with session while querying module:", err);
    }
    if (!moduleExists) {
      console.log("Module not found");
      throw new Error("Module not found");
    }

    // Create submodule
    const submodule = new SubModule({
      name: name.trim(),
      moduleId,
      difficulty,
      isPro: Boolean(isPro),
      questions: [],
    });
    if (session) {
      await submodule.save({ session });
    } else {
      await submodule.save();
    }

    // Process questions based on file type
    let questionIds;

    if (req.file.mimetype === "application/json") {
      questionIds = await processJSONFile(
        req.file.path,
        submodule._id,
        session
      );
      console.log("Hello");
      console.log(questionIds);
    } else {
      questionIds = await processCSVFile(req.file.path, submodule._id, session);
    }

    // Update module with new submodule
    moduleExists.subModules.push(submodule._id);
    if (session) {
      await moduleExists.save({ session });
    } else {
      await moduleExists.save();
    }

    // Commit transaction
    if (session.inTransaction()) {
      await session.commitTransaction();
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    console.log("path ke baad");
    // Fetch populated submodule
    const populatedSubmodule = await SubModule.findById(submodule._id)
      .populate("questions")
      .lean();

    res.status(201).json({
      message: "Submodule created successfully with questions",
      submodule: populatedSubmodule,
      questionsCount: questionIds.length,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    // Clean up file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: "Failed to create submodule with questions",
      details: error.message,
    });
  } finally {
    try { session.endSession(); } catch (_) {}
  }
};

// Get submodule questions
exports.getSubmoduleQuestions = async (req, res) => {
  try {
    const { submoduleId } = req.params;
    console.log("id fetched", submoduleId);
    const submodule = await SubModule.findById(submoduleId).populate(
      "questions"
    );

    if (!submodule) {
      console.log("submodule not found");
      return res.status(404).json({ error: "Submodule not found" });
    }

    res.json({
      submodule: {
        name: submodule.name,
        difficulty: submodule.difficulty,
        isPro: submodule.isPro,
        questions: submodule.questions,
      },
    });
    console.log("chala gya");
  } catch (error) {
    res.status(500).json({
      error: "Error fetching submodule questions",
      details: error.message,
    });
  }
};
