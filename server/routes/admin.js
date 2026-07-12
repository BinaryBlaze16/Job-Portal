import express from 'express';
import {
  getAllUsers,
  toggleUserStatus,
  getPlatformStats,
  getAllJobs,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// @route   GET /api/admin/stats
router.get('/stats', getPlatformStats);

// @route   GET /api/admin/users
router.get('/users', getAllUsers);

// @route   PUT /api/admin/users/:id/toggle
router.put('/users/:id/toggle', toggleUserStatus);
router.patch('/users/:id/toggle', toggleUserStatus);

// @route   GET /api/admin/jobs
router.get('/jobs', getAllJobs);

export default router;
