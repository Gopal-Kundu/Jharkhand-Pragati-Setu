import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

// Executive Command Center Telemetry, Domain Distribution, and Hotspots
router.get('/', getAnalytics);

export default router;
