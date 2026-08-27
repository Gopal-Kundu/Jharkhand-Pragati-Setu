import express from 'express';
import { categorizeProblem, aiChat } from '../controllers/aiController.js';

const router = express.Router();

// AI Automatic 10-Domain Categorization, Deduplication, and University Matching
router.post('/categorize', categorizeProblem);

// Live AI Assistant Chat Endpoint (Gemini 3.1 Flash Lite)
router.post('/chat', aiChat);

export default router;
