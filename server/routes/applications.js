import express from 'express';
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplicationStats,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/applications/stats
router.get('/stats', protect, authorize('seeker', 'employer'), getApplicationStats);

// @route   GET /api/applications/me
router.get('/me', protect, authorize('seeker'), getMyApplications);
router.get('/my', protect, authorize('seeker'), getMyApplications);

// @route   GET /api/applications/job/:jobId
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.get('/jobs/:jobId', protect, authorize('employer'), getJobApplications);

// @route   POST /api/applications/:jobId
router.post('/:jobId', protect, authorize('seeker'), upload.single('resume'), applyToJob);
router.post('/jobs/:jobId/apply', protect, authorize('seeker'), upload.single('resume'), applyToJob);

// @route   PUT /api/applications/:id/status
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);
router.patch('/:id/status', protect, authorize('employer'), updateApplicationStatus);

export default router;
