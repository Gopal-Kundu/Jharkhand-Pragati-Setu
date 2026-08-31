import mongoose from 'mongoose';

/**
 * Proposal Schema
 * Represents an R&D and field implementation proposal created by a University for a specific Problem Statement
 */
const proposalSchema = new mongoose.Schema(
  {
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem reference is required'],
      index: true
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: [true, 'University reference is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Proposal title is required'],
      trim: true
    },
    problemStatement: {
      type: String,
      required: [true, 'Problem statement is required']
    },
    description: {
      type: String,
      required: [true, 'Proposal description & technical methodology are required']
    },
    facultyMembers: [
      {
        name: { type: String, required: true },
        designation: { type: String, default: 'Professor & Lead PI' },
        department: { type: String, default: 'Engineering' },
        email: { type: String, default: '' }
      }
    ],
    teamMembers: [
      {
        name: { type: String, required: true },
        rollNo: { type: String, default: '' },
        branch: { type: String, default: 'Engineering' },
        year: { type: String, default: 'Final Year' }
      }
    ],
    projectDuration: {
      type: String,
      required: true,
      default: '6 Months'
    },
    estimatedBudget: {
      type: Number,
      default: 500000
    },
    peopleImpacted: {
      type: Number,
      default: 1000
    },
    industrySupportRequired: [
      {
        type: String,
        enum: [
          'IoT & Embedded Sensors',
          'Water Supply & Sluice Gate Fabrication',
          'Solar & Microgrid Hardware',
          'Drone & Aerial Survey',
          'Chemical & Water Quality Testing Kit',
          'Cloud & AI Compute Infrastructure',
          'Field Trial Vehicles & Logistics',
          'Rapid Prototyping & Metal 3D Printing',
          'Civil & Concrete Encapsulation',
          'Agritech Sensor Nodes',
          'Other Industry Support'
        ],
        default: 'IoT & Embedded Sensors'
      }
    ],
    domain: {
      type: String,
      default: 'Water Resources'
    },
    assignedIndustry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IndustryPartner',
      default: null
    },
    industryOffer: {
      industry: { type: mongoose.Schema.Types.ObjectId, ref: 'IndustryPartner', default: null },
      fundingAmount: { type: Number, default: 0 },
      supportDetails: { type: String, default: '' },
      equipmentProvided: [String],
      mentorName: { type: String, default: '' },
      mentorDesignation: { type: String, default: '' },
      mentorEmail: { type: String, default: '' },
      offeredAt: { type: Date, default: null },
      responseStatus: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
      responseNote: { type: String, default: '' },
      respondedAt: { type: Date, default: null }
    },
    govtApproval: {
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      remarks: { type: String, default: '' },
      sanctionOrderNumber: { type: String, default: '' },
      approvedAt: { type: Date, default: null }
    },
    status: {
      type: String,
      enum: [
        'submitted',
        'ai_triaged',
        'industry_matched',
        'offered_by_industry',
        'rejected_by_industry',
        'accepted_by_university',
        'rejected_by_university',
        'submitted_to_govt',
        'approved_by_govt',
        'rejected_by_govt',
        'in_progress',
        'completed'
      ],
      default: 'submitted'
    }
  },
  {
    timestamps: true
  }
);

export const Proposal = mongoose.model('Proposal', proposalSchema);
export default Proposal;
