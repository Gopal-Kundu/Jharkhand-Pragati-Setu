import express from 'express';
import {
  getMyIndustry,
  registerIndustry,
  updateMyIndustry,
  getDomainProposalsForIndustry,
  makeProposalOffer,
  getIndustryNotifications,
  markIndustryNotificationsRead,
  getIndustryPartners,
  getIndustryPartnerById
} from '../controllers/industryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Private Industry Profile & Proposal Endpoints
router.get('/my-profile', protect, getMyIndustry);
router.post('/register', protect, registerIndustry);
router.put('/my-profile', protect, updateMyIndustry);
router.get('/proposals', protect, getDomainProposalsForIndustry);
router.post('/proposals/:proposalId/offer', protect, makeProposalOffer);
router.get('/notifications', protect, getIndustryNotifications);
router.post('/notifications/mark-read', protect, markIndustryNotificationsRead);

// Public Endpoints
router.get('/', getIndustryPartners);
router.get('/:id', getIndustryPartnerById);

export default router;
