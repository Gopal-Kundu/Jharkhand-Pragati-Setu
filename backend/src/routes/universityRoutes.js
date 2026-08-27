import express from 'express';
import { getUniversities, getUniversityById } from '../controllers/universityController.js';

const router = express.Router();

router.get('/', getUniversities);
router.get('/:id', getUniversityById);

export default router;
