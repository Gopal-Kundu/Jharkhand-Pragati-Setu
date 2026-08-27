import express from 'express';
import {
  getUniversities,
  getMyUniversity,
  registerUniversity,
  updateMyUniversity,
  getUniversityNotifications,
  markUniversityNotificationsRead,
  createProposal,
  respondToIndustryOffer,
  getUniversityById
} from '../controllers/universityController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Discovery
router.get('/', getUniversities);

// Logged-in University User Profile & Institutional Management
router.get('/my', protect, getMyUniversity);
router.post('/register', protect, registerUniversity);
router.put('/my', protect, updateMyUniversity);

// University Notifications
router.get('/my/notifications', protect, getUniversityNotifications);
router.patch('/my/notifications/read', protect, markUniversityNotificationsRead);

// Make Proposal & AI Industry Matching
router.post('/proposals', protect, createProposal);
router.post('/proposals/:proposalId/respond-offer', protect, respondToIndustryOffer);

// Individual University by ID (Public)
router.get('/:id', getUniversityById);

export default router;
