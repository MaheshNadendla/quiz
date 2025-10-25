import express from 'express';
import { getQuizzes, addQuiz, getQuizById } from '../controllers/quizController.js';
const router = express.Router();

router.get('/', getQuizzes);
router.post('/', addQuiz);
router.get('/:id', getQuizById);

export default router;
