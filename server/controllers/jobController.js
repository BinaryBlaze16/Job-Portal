import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';

// @desc    Get all jobs with filtering, pagination, and sorting
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      category,
      experienceLevel,
      salaryMin,
      salaryMax,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Location filter (case-insensitive partial match)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Job type filter
    if (jobType) {
      const types = jobType.split(',').map((t) => t.trim().toLowerCase());
      query.jobType = { $in: types };
    }

    // Category filter
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Experience level filter
    const expQuery = experienceLevel || req.query.experience;
    if (expQuery) {
      const levels = expQuery.split(',').map((l) => l.trim().toLowerCase());
      query.experienceLevel = { $in: levels };
    }

    // Salary range filters
    if (salaryMin) {
      query.salaryMax = { $gte: Number(salaryMin) };
    }
    if (salaryMax) {
      query.salaryMin = { ...query.salaryMin, $lte: Number(salaryMax) };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'salary-high') {
      sortOption = { salaryMax: -1 };
    } else if (sort === 'salary-low') {
      sortOption = { salaryMin: 1 };
    } else if (sort === 'applications') {
      sortOption = { applicationsCount: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('employer', 'name email companyName companyLogo')
        .sort(sortOption)
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
      message: 'Server error fetching jobs',
      error: error.message,
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'employer',
      'name email companyName companyLogo companyDescription website companySize industry'
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching job',
      error: error.message,
    });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employer)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      salaryMin,
      salaryMax,
      jobType,
      category,
      experienceLevel,
      skills,
      requirements,
      responsibilities,
      benefits,
      applicationDeadline,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      employer: req.user._id,
      companyName: req.user.companyName || req.user.name,
      companyLogo: req.user.companyLogo || '',
      location,
      salaryMin,
      salaryMax,
      jobType,
      category,
      experienceLevel,
      skills,
      requirements,
      responsibilities,
      benefits,
      applicationDeadline,
    });

    const populatedJob = await Job.findById(job._id).populate(
      'employer',
      'name email companyName companyLogo'
    );

    res.status(201).json({
      success: true,
      data: populatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating job',
      error: error.message,
    });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Employer - own job only)
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check ownership
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    const allowedFields = [
      'title',
      'description',
      'location',
      'salaryMin',
      'salaryMax',
      'jobType',
      'category',
      'experienceLevel',
      'skills',
      'requirements',
      'responsibilities',
      'benefits',
      'applicationDeadline',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();

    const updatedJob = await Job.findById(job._id).populate(
      'employer',
      'name email companyName companyLogo'
    );

    res.status(200).json({
      success: true,
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating job',
      error: error.message,
    });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer - own job, or Admin)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check ownership or admin
    if (
      job.employer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    // Delete associated applications
    await Application.deleteMany({ job: job._id });

    // Delete the job
    await Job.findByIdAndDelete(job._id);

    res.status(200).json({
      success: true,
      message: 'Job and associated applications deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting job',
      error: error.message,
    });
  }
};

// @desc    Get jobs posted by current employer
// @route   GET /api/jobs/employer/me
// @access  Private (Employer)
export const getEmployerJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = { employer: req.user._id };

    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
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
      message: 'Server error fetching employer jobs',
      error: error.message,
    });
  }
};

// @desc    Toggle job active status
// @route   PUT /api/jobs/:id/toggle
// @access  Private (Employer - own job)
export const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check ownership
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this job',
      });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.status(200).json({
      success: true,
      data: job,
      message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error toggling job status',
      error: error.message,
    });
  }
};

// @desc    Save/Unsave a job
// @route   POST /api/jobs/:id/save
// @access  Private (Seeker)
export const saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobIndex = user.savedJobs.indexOf(req.params.id);

    if (jobIndex > -1) {
      user.savedJobs.splice(jobIndex, 1);
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'Job unsaved successfully',
        data: user.savedJobs,
      });
    } else {
      user.savedJobs.push(req.params.id);
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'Job saved successfully',
        data: user.savedJobs,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error saving/unsaving job',
      error: error.message,
    });
  }
};

// @desc    Get all saved jobs (seeker)
// @route   GET /api/jobs/saved/all
// @access  Private (Seeker)
export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedJobs',
      populate: {
        path: 'employer',
        select: 'name email companyName companyLogo',
      },
    });

    res.status(200).json({
      success: true,
      data: user.savedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching saved jobs',
      error: error.message,
    });
  }
};
