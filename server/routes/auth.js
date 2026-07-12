import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty().trim(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('role').optional().isIn(['seeker', 'employer']).withMessage('Role must be seeker or employer'),
    body('companyName').custom((value, { req }) => {
      if (req.body.role === 'employer' && (!value || !value.trim())) {
        throw new Error('Company name is required for employer');
      }
      return true;
    }),
  ],
  register
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  login
);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

// @route   PUT /api/auth/profile
router.put('/profile', protect, upload.single('resume'), updateProfile);

export default router;
