import express from 'express';
import {
  saveQuiz,
  getAllQuizzes,
  getQuizByRoomName,
  updateQuizQuestions,
  deleteQuiz
} from '../controllers/quizController.js';

const router = express.Router();

// POST /api/quiz/save
router.post('/save', saveQuiz);

// GET /api/quiz/all
router.get('/all', getAllQuizzes);

// GET /api/quiz/:roomName
router.get('/:roomName', getQuizByRoomName);

// PUT /api/quiz/:roomName/questions
router.put('/:roomName/questions', updateQuizQuestions);

// DELETE /api/quiz/:roomName
router.delete('/:roomName', deleteQuiz);

export default router;