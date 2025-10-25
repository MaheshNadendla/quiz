const express = require("express");
const { googleAuth } = require("../controllers/authController");

const router = express.Router();

// POST route for Google login
router.post("/google", googleAuth);
router.get("/go", (req,res)=>{return res.send("hello")});

module.exports = router;
