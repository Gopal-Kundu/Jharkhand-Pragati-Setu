import express from 'express';
import {
  createProblem,
  getProblems,
  getMyProblems,
  getProblemById,
  triageAndAllocate,
  submitProposal,
  pledgeFunding,
  updateMilestone,
  validateSolution,
  getMapLocations,
  getNearbyProblems,
  approveTripartiteProposal,
  getTripartiteProposalsForGovt
} from '../controllers/problemController.js';
import { addTimelineEvent } from '../controllers/timelineController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Map & Geospatial Hotspot Routes (Placed before :id parameter)
router.get('/map/locations', getMapLocations);
router.get('/geo/nearby', getNearbyProblems);

// User-Specific Problems (Track own submitted problems)
router.get('/user/my', protect, getMyProblems);

// Government Tripartite Proposal Packages & Sanction
router.get('/proposals/tripartite-packages', protect, getTripartiteProposalsForGovt);
router.patch('/proposals/:proposalId/govt-approve', protect, approveTripartiteProposal);

// Public / Citizen Problem Submission & Query Routes
// Multer accepts array of evidence files (photos, videos, docs) under any field name
router.route('/')
  .get(getProblems)
  .post(upload.any(), createProblem);

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

// Append Timeline Milestone Event
router.post('/:problemId/timeline', protect, addTimelineEvent);

export default router;
