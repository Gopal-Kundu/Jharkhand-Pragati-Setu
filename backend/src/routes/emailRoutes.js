import express from 'express';
import { sendCustomEmail } from '../controllers/emailController.js';

const router = express.Router();

// Email notification dispatcher
router.post('/send', sendCustomEmail);

export default router;
