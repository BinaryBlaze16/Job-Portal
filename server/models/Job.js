import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employer is required'],
    },
    companyName: {
      type: String,
      trim: true,
    },
    companyLogo: {
      type: String,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    salaryMin: {
      type: Number,
    },
    salaryMax: {
      type: Number,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship', 'contract'],
      set: (v) => (typeof v === 'string' ? v.toLowerCase() : v),
    },
    category: {
      type: String,
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead'],
      set: (v) => (typeof v === 'string' ? v.toLowerCase() : v),
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    requirements: [
      {
        type: String,
      },
    ],
    responsibilities: [
      {
        type: String,
      },
    ],
    benefits: [
      {
        type: String,
      },
    ],
    applicationDeadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for applications
jobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job',
  justOne: false,
});

// Text index for search
jobSchema.index({ title: 'text', description: 'text', location: 'text', skills: 'text' });

const Job = mongoose.model('Job', jobSchema);

export default Job;
