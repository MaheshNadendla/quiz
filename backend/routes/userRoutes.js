const express = require('express');
const { registerUser, getUserScores } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.get('/:id/scores', getUserScores);

module.exports = router;
