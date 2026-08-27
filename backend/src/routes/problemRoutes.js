import express from 'express';
import {
  createProblem,
  getProblems,
  getProblemById,
  triageAndAllocate,
  submitProposal,
  pledgeFunding,
  updateMilestone,
  validateSolution,
  getMapLocations,
  getNearbyProblems
} from '../controllers/problemController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Map & Geospatial Hotspot Routes (Placed before :id parameter)
router.get('/map/locations', getMapLocations);
router.get('/geo/nearby', getNearbyProblems);

// Public / Citizen Problem Submission & Query Routes
// Multer accepts array of evidence files (photos, videos, docs) under field name 'evidence'
router.route('/')
  .get(getProblems)
  .post(upload.array('evidence', 5), createProblem);

router.route('/:id')
  .get(getProblemById);

// Government Triage & Institutional Routing
router.patch('/:id/allocate', triageAndAllocate);

// University Multidisciplinary Proposal Submission
router.post('/:id/proposal', submitProposal);

// Industry CSR Grant Pledging & Sponsorship
router.post('/:id/fund', pledgeFunding);

// Project Workflow Milestone Progress & Testing
router.patch('/:id/milestones/:milestoneId', updateMilestone);

// Government Final Validation & Impact Certification
router.patch('/:id/validate', validateSolution);

export default router;
