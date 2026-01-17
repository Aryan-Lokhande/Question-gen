import express from 'express';
import { generateQuestions } from '../controllers/questionController.js';

const router = express.Router();

// POST /api/questions/generate
router.post('/generate', generateQuestions);

export default router;