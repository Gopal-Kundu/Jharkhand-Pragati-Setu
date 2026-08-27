import mongoose from 'mongoose';

/**
 * Comprehensive Problem Schema
 * Implements the full SIH 2026 lifecycle:
 * Citizens → Government Triage → Universities/Students → Industry/Startups → Real-World Solution
 */
const problemSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Problem description is required'],
      trim: true
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
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
      ],
      index: true
    },
    location: {
      district: { type: String, required: true },
      block: { type: String, default: '' },
      panchayat: { type: String, default: '' },
      state: { type: String, default: 'Jharkhand' },
      lat: { type: Number, default: 23.3441 },
      lng: { type: Number, default: 85.3096 },
      address: { type: String, default: '' },
      pincode: { type: String, default: '' },
      geoPoint: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [85.3096, 23.3441] } // GeoJSON: [longitude, latitude]
      }
    },
    submitter: {
      name: { type: String, default: 'Concerned Citizen' },
      role: {
        type: String,
        enum: ['individual_citizen', 'community_org', 'pri_panchayat', 'ulb_urban_body', 'govt_department', 'ngo'],
        default: 'individual_citizen'
      },
      organization: { type: String, default: 'Community Resident' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      isAnonymous: { type: Boolean, default: false }
    },
    evidence: [
      {
        type: { type: String, enum: ['photo', 'video', 'document', 'audio'], default: 'photo' },
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
        caption: { type: String, default: '' },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    aiAnalysis: {
      domain: { type: String, default: '' },
      category: { type: String, default: '' },
      severity: { type: Number, min: 1, max: 10, default: 5 },
      confidence: { type: Number, min: 0, max: 1, default: 0.85 },
      urgency: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
      duplicateScore: { type: Number, default: 0 },
      duplicateOf: { type: String, default: null },
      recommendedDisciplines: [String],
      recommendedUniversities: [
        {
          universityId: String,
          name: String,
          matchScore: Number,
          reason: String
        }
      ],
      tags: [String],
      summary: { type: String, default: '' },
      analyzedAt: { type: Date, default: Date.now }
    },
    status: {
      type: String,
      enum: [
        'submitted',
        'ai_triage',
        'govt_review',
        'allocated',
        'proposal_submitted',
        'in_progress',
        'prototyping',
        'field_testing',
        'deployed',
        'validated',
        'rejected'
      ],
      default: 'submitted',
      index: true
    },
    resolutionStatus: {
      type: String,
      enum: ['unsolved', 'solved'],
      default: 'unsolved',
      index: true
    },
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium'
    },
    allocatedUniversity: {
      universityId: { type: String, default: null },
      name: { type: String, default: null },
      facultyLead: {
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        department: { type: String, default: '' }
      },
      allocatedAt: { type: Date, default: null },
      deadline: { type: Date, default: null }
    },
    proposals: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        teamLead: { type: String, required: true },
        facultyAdvisor: { type: String, default: '' },
        multidisciplinaryTeam: [
          {
            name: { type: String, required: true },
            role: { type: String, default: 'Researcher' },
            department: { type: String, required: true },
            institution: { type: String, default: '' }
          }
        ],
        abstract: { type: String, default: '' },
        timelineMonths: { type: Number, default: 6 },
        estimatedBudget: { type: Number, default: 500000 },
        techStack: [String],
        submissionDate: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['pending_review', 'approved', 'under_revision', 'rejected'],
          default: 'pending_review'
        }
      }
    ],
    industryPartners: [
      {
        partnerId: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, default: 'CSR Enterprise' },
        grantAmount: { type: Number, default: 0 },
        status: { type: String, enum: ['pledged', 'disbursed', 'completed'], default: 'pledged' },
        pledgedAt: { type: Date, default: Date.now },
        mentorAssigned: { type: String, default: '' },
        csrReference: { type: String, default: '' }
      }
    ],
    milestones: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        targetDate: { type: String, default: '' },
        completionDate: { type: String, default: null },
        progress: { type: Number, min: 0, max: 100, default: 0 },
        status: { type: String, enum: ['pending', 'in_progress', 'completed', 'delayed'], default: 'pending' },
        deliverableUrl: { type: String, default: '' },
        verifiedBy: { type: String, default: '' }
      }
    ],
    socialImpact: {
      beneficiariesReached: { type: Number, default: 0 },
      economicSavingsInr: { type: Number, default: 0 },
      metricName: { type: String, default: 'Lives Impacted' },
      metricValue: { type: String, default: '0' },
      carbonReductionTons: { type: Number, default: 0 },
      sdgGoals: [Number]
    },
    auditHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        officer: { type: String, default: 'System' },
        role: { type: String, default: 'ai_engine' },
        action: { type: String, required: true },
        note: { type: String, default: '' }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Search indexes for text and geospatial coordinates
problemSchema.index({ title: 'text', description: 'text', 'aiAnalysis.tags': 'text' });
problemSchema.index({ 'location.geoPoint': '2dsphere' });
problemSchema.index({ 'location.lat': 1, 'location.lng': 1 });

export const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
