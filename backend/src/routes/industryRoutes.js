import express from 'express';
import { getIndustryPartners, getIndustryPartnerById } from '../controllers/industryController.js';

const router = express.Router();

router.get('/', getIndustryPartners);
router.get('/:id', getIndustryPartnerById);

export default router;
