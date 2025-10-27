const express = require("express");
const multer = require("multer");
const adminController = require("../controllers/adminControllers");
const { verifyAdmin } = require("../middleware/authMiddleware");
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ------------------ SUBJECT ROUTES ------------------
router.post("/subjects", adminController.addSubject);
router.put("/subjects/:id", adminController.updateSubject);
router.delete("/subjects/:id", adminController.deleteSubject);
router.patch("/subjects/:id/toggle", adminController.toggleSubjectActive);

// ------------------ MODULE ROUTES ------------------
router.post("/modules", adminController.addModule);
router.delete("/modules/:id", adminController.deleteModule);
router.patch("/modules/:id/toggle", adminController.toggleModuleActive);

// ------------------ SUBMODULE ROUTES ------------------
router.post("/sub-modules", adminController.addSubModule);
router.delete("/sub-modules/:id", adminController.deleteSubModule);
router.patch("/sub-modules/:id/toggle", adminController.toggleSubModuleActive);


router.post("/submodules/upload", (req, res, next) => {
  console.log("hello bro 123 56")
  next()
}, verifyAdmin, upload.single("file"),adminController.createSubmoduleWithQuestions)


 // ,optional file uploadadminController.createSubmoduleWithQuestions

router.get("/submodules/:submoduleId", adminController.getSubmoduleQuestions);

// ------------------ QUESTION ROUTES ------------------
router.post("/questions", adminController.addQuestion);
router.put("/questions/:id", adminController.updateQuestion);

module.exports = router;
