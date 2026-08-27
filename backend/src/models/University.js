import mongoose from 'mongoose';

/**
 * University / Higher Education Institution (HEI) Schema
 * Powers smart routing based on academic disciplines, research centers, TBI facilities, and faculty specialization
 */
const universitySchema = new mongoose.Schema(
  {
    institutionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    shortName: {
      type: String,
      default: ''
    },
    location: {
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, default: 'Jharkhand' }
    },
    type: {
      type: String,
      enum: ['Institute of National Importance', 'Central University', 'Deemed University & Tech Hub', 'State University', 'Autonomous College', 'Medical Institution', 'Agricultural University'],
      default: 'Deemed University & Tech Hub'
    },
    nirfRank: {
      type: Number,
      default: null
    },
    availableDomains: [
      {
        type: String,
        enum: [
          'Education',
          'Agriculture',
          'Healthcare',
          'Water Resources',
          'Environment',
          'Energy',
          'Urban Development',
          'Accessibility',
          'Public Administration',
          'Rural Livelihoods'
        ]
      }
    ],
    proposals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal'
      }
    ],
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    academicDisciplines: [String],
    researchCentres: [String],
    incubationCentres: [String],
    facultyCount: {
      type: Number,
      default: 100
    },
    activeProjects: {
      type: Number,
      default: 0
    },
    successRate: {
      type: String,
      default: '90%'
    },
    facultySpecializations: [
      {
        name: { type: String, required: true },
        department: { type: String, required: true },
        expertise: { type: String, required: true },
        email: { type: String, default: '' },
        avatar: { type: String, default: '' }
      }
    ],
    contactEmail: {
      type: String,
      default: ''
    },
    notifications: [
      {
        problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
        ticketId: { type: String, default: '' },
        title: { type: String, required: true },
        message: { type: String, required: true },
        domain: { type: String, default: '' },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const University = mongoose.model('University', universitySchema);
export default University;
