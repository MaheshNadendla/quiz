// courseControllers.js
const Subject = require("../models/Subject.js");
const Module = require("../models/Module");
const SubModule = require("../models/SubModule");
const Question = require("../models/Question");
const mongoose = require("mongoose");

/**
 * Get all subjects for the dashboard with optional search.
 */
exports.getSubjects = async (req, res) => {
  try {
    const { search, includeDisabled } = req.query;

    // Build query for optional search
    // ADDED: includeDisabled allows admin UI to fetch disabled content too
    const showAll = includeDisabled === '1' || includeDisabled === 'true';
    // Treat missing isActive as active for backward compatibility
    let query = showAll
      ? {}
      : { $or: [{ isActive: true }, { isActive: { $exists: false } }] };
    if (search) {
      const searchClause = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
      query = Object.keys(query).length ? { $and: [query, searchClause] } : searchClause;
    }

    // Fetch all subjects at once
    //filter user query wala variable
    // CHANGED: Filter subjects by isActive unless admin asks otherwise
    const subjects = await Subject.find(query).sort({
      name: 1,
    });

    res.json({
      subjects,
      totalSubjects: subjects.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch subjects",
      details: error.message,
    });
  }
};

exports.getSubModules = async (req, res) => {
  try {
    const { key } = req.params;
    const { includeDisabled: includeDisabledSub } = req.query;
    const showAllSub = includeDisabledSub === '1' || includeDisabledSub === 'true';

    if (!key) {
      return res.status(400).json({ error: "Valid key is required" });
    }
    // CHANGED: Only active submodules for users (treat missing isActive as active)
    const subModules = await SubModule.find(
      showAllSub
        ? { moduleId: key }
        : { moduleId: key, $or: [{ isActive: true }, { isActive: { $exists: false } }] }
    );
    if (!subModules) {
      return res.status(404).json({ error: "No sub-modules for this module" });
    }
    res.json({
      subModules,
      totalSubModules: subModules?.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch submodules",
      details: error.message,
    });
  }
};

exports.getModulesAndSubModules = async (req, res) => {
  try {
    const { subjectName } = req.params;
    const { includeDisabled: includeDisabledMods } = req.query;
    const showAllMods = includeDisabledMods === '1' || includeDisabledMods === 'true';

    // Validate subject name
    if (!subjectName || typeof subjectName !== "string") {
      return res.status(400).json({ error: "Valid subject name is required" });
    }

    // Find the subject by name (Exact match using regex)
    const subject = await Subject.findOne(
      {
        name: { $regex: new RegExp(`^${subjectName}$`, "i") },
        ...(showAllMods ? {} : { $or: [{ isActive: true }, { isActive: { $exists: false } }] }),
      },
      "_id name description modules"
    ).populate({
      path: "modules",
      // CHANGED: select isActive for filtering in memory when needed
      select: "_id name subModules isActive",
      populate: {
        path: "subModules",
        select: "_id name isPro questions difficulty isActive",
      },
    });

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const modulesWithSubModules = await Promise.all(
      subject.modules
        .filter((m) => (showAllMods ? true : m.isActive !== false))
        .map(async (module) => {
        const subModulesWithCounts = await Promise.all(
          module.subModules
            .filter((sm) => (showAllMods ? true : sm.isActive !== false))
            .map(async (subModule) => {
            // console.log(subModule);
            const questionCount = subModule.questions?.length || 0;
            return {
              id: subModule._id,
              name: subModule.name,
              isPro: subModule.isPro,
              difficulty: subModule.difficulty,
              questionCount,
            };
          })
        );

        return {
          name: module.name,
          id: module._id, // Include the module id
          // ADDED: include isActive so admin UI can show correct toggle label
          isActive: module.isActive,
          subModules: subModulesWithCounts,
          totalSubModules: subModulesWithCounts.length,
        };
      })
    );

    res.json({
      subject: {
        id: subject._id,
        name: subject.name,
        description: subject.description,
      },
      modules: modulesWithSubModules,
      totalModules: subject.modules.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch modules and submodules",
      details: error.message,
    });
  }
};

/**
 * Get questions for a specific submodule with cursor-based pagination.
 */
exports.getQuestions = async (req, res) => {
  try {
    const { subjectName, subModuleId } = req.params;
    const { difficulty, lastQuestionId, limit = 10 } = req.query;

    // Validate subject name
    const subject = await Subject.findOne({
      name: { $regex: new RegExp(`^${subjectName}$`, "i") }, // Exact match regex
    });
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Validate submodule ID
    if (!mongoose.Types.ObjectId.isValid(subModuleId)) {
      return res.status(400).json({ error: "Invalid submodule ID" });
    }

    // Find submodule and validate it belongs to a module under the subject
    const subModule = await SubModule.findById(subModuleId);
    if (!subModule) {
      return res.status(404).json({ error: "Submodule not found" });
    }

    const module = await Module.findOne({
      _id: subModule.moduleId,
      subjectId: subject._id,
    });
    if (!module) {
      return res.status(404).json({
        error: "Submodule does not belong to the specified subject",
      });
    }

    // Build base query
    let query = { subModuleId };
    if (difficulty) {
      query.difficulty = difficulty.toLowerCase();
    }
    if (lastQuestionId) {
      query._id = { $gt: lastQuestionId };
    }

    // Validate limit
    const limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({ error: "Invalid limit number" });
    }

    // Fetch questions using cursor-based pagination
    const questions = await Question.find(query)
      .select("questionText options difficulty")
      .sort({ _id: 1 })
      .limit(limitNumber + 1);

    const hasMore = questions.length > limitNumber;
    const finalQuestions = questions.slice(0, limitNumber);
    const lastQuestion = finalQuestions[finalQuestions.length - 1];
    const nextCursor = hasMore ? lastQuestion._id : null;

    const totalQuestions = await Question.countDocuments({ subModuleId });

    res.json({
      subModule: {
        id: subModule._id,
        name: subModule.name,
        isPro: subModule.isPro,
      },
      questions: finalQuestions,
      pagination: {
        hasMore,
        nextCursor,
        totalQuestions,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch questions",
      details: error.message,
    });
  }
};
