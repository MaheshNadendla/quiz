const express = require("express");
const adminController = require("../controllers/adminControllers");
const router = express.Router();

router.post("/subjects", adminController.addSubject);
router.put("/subjects/:id", adminController.updateSubject);
// CHANGED: Use soft-delete by default on DELETE, and expose explicit toggle routes
router.delete("/subjects/:id", adminController.deleteSubject);
router.patch("/subjects/:id/toggle", adminController.toggleSubjectActive);

router.post("/modules", adminController.addModule);
// router.put("/modules/:id", adminController.updateModule);
router.delete("/modules/:id", adminController.deleteModule);
router.patch("/modules/:id/toggle", adminController.toggleModuleActive);

router.post("/sub-modules", adminController.addSubModule);
// router.put("/sub-modules/:id", adminController.updateSubModule);
router.delete("/sub-modules/:id", adminController.deleteSubModule);
router.patch("/sub-modules/:id/toggle", adminController.toggleSubModuleActive);

router.post("/questions", adminController.addQuestion);
router.put("/questions/:id", adminController.updateQuestion);
router.delete("/questions/:id", adminController.deleteQuestion);

// Route to create submodule with questions
// router.post(
//   "/modules/:moduleId/submodules",
//   adminController.createSubmoduleWithQuestions
// );
// File upload route for creating submodule with questions
router.post("/submodules/upload", adminController.createSubmoduleWithQuestions);

// Route to get questions for a submodule
router.get("/submodules/:submoduleId", adminController.getSubmoduleQuestions);

// router.get("/analytics", adminController.getAllAnalytics);

module.exports = router;
