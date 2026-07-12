import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Seeker)
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications',
      });
    }

    // Check application deadline
    if (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed',
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }

    // Determine resume URL: from upload, from body, or from user profile
    let finalResumeUrl = resumeUrl;
    if (req.file) {
      finalResumeUrl = `/uploads/${req.file.filename}`;
    } else if (!finalResumeUrl) {
      finalResumeUrl = req.user.resumeUrl || '';
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      employer: job.employer,
      resumeUrl: finalResumeUrl,
      coverLetter,
    });

    // Increment applications count on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    const populatedApplication = await Application.findById(application._id)
      .populate('job', 'title companyName location')
      .populate('applicant', 'name email');

    res.status(201).json({
      success: true,
      data: populatedApplication,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    // Handle duplicate key error (race condition)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error applying to job',
      error: error.message,
    });
  }
};

// @desc    Get my applications (seeker)
// @route   GET /api/applications/me
// @access  Private (Seeker)
export const getMyApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = { applicant: req.user._id };
    if (status) {
      query.status = status;
    }

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('job', 'title companyName companyLogo location jobType salaryMin salaryMax isActive')
        .populate('employer', 'name email companyName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Application.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: applications,
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
      message: 'Server error fetching applications',
      error: error.message,
    });
  }
};

// @desc    Get applications for a specific job (employer)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Verify job exists and belongs to employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job',
      });
    }

    const query = { job: jobId };
    if (status) {
      query.status = status;
    }

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('applicant', 'name email phone bio skills experience education resumeUrl')
        .populate('job', 'title companyName location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Application.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: applications,
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
      message: 'Server error fetching job applications',
      error: error.message,
    });
  }
};

// @desc    Update application status (employer)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, employerNotes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const validStatuses = ['applied', 'under-review', 'shortlisted', 'interview', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Verify employer owns this application's job
    if (application.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    application.status = status;
    if (employerNotes !== undefined) {
      application.employerNotes = employerNotes;
    }

    await application.save();

    const updatedApplication = await Application.findById(application._id)
      .populate('applicant', 'name email phone')
      .populate('job', 'title companyName location');

    res.status(200).json({
      success: true,
      data: updatedApplication,
      message: `Application status updated to '${status}'`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating application status',
      error: error.message,
    });
  }
};

// @desc    Get application stats for current user
// @route   GET /api/applications/stats
// @access  Private
export const getApplicationStats = async (req, res) => {
  try {
    let stats;

    if (req.user.role === 'seeker') {
      // Seeker stats: applications grouped by status
      const pipeline = [
        { $match: { applicant: req.user._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ];

      const statusCounts = await Application.aggregate(pipeline);
      const totalApplications = await Application.countDocuments({ applicant: req.user._id });

      const statusMap = {};
      statusCounts.forEach((item) => {
        statusMap[item._id] = item.count;
      });

      stats = {
        total: totalApplications,
        byStatus: {
          applied: statusMap['applied'] || 0,
          'under-review': statusMap['under-review'] || 0,
          shortlisted: statusMap['shortlisted'] || 0,
          interview: statusMap['interview'] || 0,
          accepted: statusMap['accepted'] || 0,
          rejected: statusMap['rejected'] || 0,
        },
      };
    } else if (req.user.role === 'employer') {
      // Employer stats: applications for their jobs grouped by status
      const pipeline = [
        { $match: { employer: req.user._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ];

      const statusCounts = await Application.aggregate(pipeline);
      const totalApplications = await Application.countDocuments({ employer: req.user._id });
      const totalJobs = await Job.countDocuments({ employer: req.user._id });
      const activeJobs = await Job.countDocuments({ employer: req.user._id, isActive: true });

      const statusMap = {};
      statusCounts.forEach((item) => {
        statusMap[item._id] = item.count;
      });

      stats = {
        totalApplications,
        totalJobs,
        activeJobs,
        byStatus: {
          applied: statusMap['applied'] || 0,
          'under-review': statusMap['under-review'] || 0,
          shortlisted: statusMap['shortlisted'] || 0,
          interview: statusMap['interview'] || 0,
          accepted: statusMap['accepted'] || 0,
          rejected: statusMap['rejected'] || 0,
        },
      };
    } else {
      return res.status(403).json({
        success: false,
        message: 'Stats not available for this role',
      });
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching application stats',
      error: error.message,
    });
  }
};
