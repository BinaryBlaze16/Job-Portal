import express from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  toggleJobStatus,
  saveJob,
  getSavedJobs,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/jobs/employer/me - Must be before /:id route
router.get('/employer/me', protect, authorize('employer'), getEmployerJobs);
router.get('/employer/myjobs', protect, authorize('employer'), getEmployerJobs);

// @route   GET /api/jobs/saved/all
router.get('/saved/all', protect, authorize('seeker'), getSavedJobs);

// @route   GET /api/jobs
router.get('/', getJobs);

// @route   GET /api/jobs/:id
router.get('/:id', getJob);

// @route   POST /api/jobs
router.post('/', protect, authorize('employer'), createJob);

// @route   PUT /api/jobs/:id
router.put('/:id', protect, authorize('employer'), updateJob);

// @route   DELETE /api/jobs/:id
router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);

// @route   PUT /api/jobs/:id/toggle
router.put('/:id/toggle', protect, authorize('employer'), toggleJobStatus);
router.patch('/:id/toggle', protect, authorize('employer'), toggleJobStatus);

// @route   POST /api/jobs/:id/save
router.post('/:id/save', protect, authorize('seeker'), saveJob);

export default router;
