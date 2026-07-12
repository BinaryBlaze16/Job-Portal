import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

// @desc    Get all users (paginated, with role filter)
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (role) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-savedJobs')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching users',
      error: error.message,
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private (Admin)
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error toggling user status',
      error: error.message,
    });
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getPlatformStats = async (req, res) => {
  try {
    const [
      totalUsers,
      seekerCount,
      employerCount,
      adminCount,
      totalJobs,
      activeJobs,
      totalApplications,
      applicationsByStatus,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'seeker' }),
      User.countDocuments({ role: 'employer' }),
      User.countDocuments({ role: 'admin' }),
      Job.countDocuments(),
      Job.countDocuments({ isActive: true }),
      Application.countDocuments(),
      Application.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statusMap = {};
    applicationsByStatus.forEach((item) => {
      statusMap[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          seekers: seekerCount,
          employers: employerCount,
          admins: adminCount,
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          inactive: totalJobs - activeJobs,
        },
        applications: {
          total: totalApplications,
          byStatus: {
            applied: statusMap['applied'] || 0,
            'under-review': statusMap['under-review'] || 0,
            shortlisted: statusMap['shortlisted'] || 0,
            interview: statusMap['interview'] || 0,
            accepted: statusMap['accepted'] || 0,
            rejected: statusMap['rejected'] || 0,
          },
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching platform stats',
      error: error.message,
    });
  }
};

// @desc    Get all jobs (admin view with employer info)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
export const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('employer', 'name email companyName companyLogo isActive')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching all jobs',
      error: error.message,
    });
  }
};
