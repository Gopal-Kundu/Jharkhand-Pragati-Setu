import mongoose from 'mongoose';

/**
 * University / Higher Education Institution (HEI) Schema
 * Powers smart routing based on academic disciplines, research centers, TBI facilities, and faculty specialization
 */
const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, default: 'Jharkhand' }
    },
    type: {
      type: String,
      enum: ['Institute of National Importance', 'Central University', 'Deemed University & Tech Hub', 'State University', 'Autonomous College', 'Medical Institution', 'Agricultural University', 'Others', 'others'],
      default: 'Deemed University & Tech Hub'
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
          'Rural Livelihoods',
          'Others',
          'others'
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
    contactEmail: {
      type: String,
      default: ''
    },
    notifications: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        schemaName: { type: String, default: 'Problem' },
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
