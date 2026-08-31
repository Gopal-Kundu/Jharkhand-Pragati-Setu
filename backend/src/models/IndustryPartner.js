import mongoose from 'mongoose';

/**
 * Industry Partner / CSR / Startup / MSME Schema
 * Facilitates matching for mentorship, prototyping funding, testing facilities, and deployment
 */
const industryPartnerSchema = new mongoose.Schema(
  {
    partnerId: {
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
    type: {
      type: String,
      enum: ['Enterprise & PSU', 'CSR Foundation', 'Startup / MSME', 'Research Laboratory', 'Technology Accelerator'],
      default: 'CSR Foundation'
    },
    hqLocation: {
      type: String,
      default: 'Ranchi, Jharkhand'
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    focusDomains: [String],
    availableDomains: [String],
    supportCapabilities: [String],
    csrAnnualBudgetInr: {
      type: Number,
      default: 5000000
    },
    activeGrantsCount: {
      type: Number,
      default: 0
    },
    acceptedProposals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal'
      }
    ],
    sendedProposal: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal'
      }
    ],
    mentorshipAvailable: {
      type: Boolean,
      default: true
    },
    leadMentors: [
      {
        name: { type: String, default: 'Corporate Lead' },
        designation: { type: String, default: 'Technical Lead' },
        domain: { type: String, default: 'Others' }
      }
    ],
    contactEmail: {
      type: String,
      default: ''
    },
    notifications: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        schemaName: { type: String, default: 'Proposal' },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const IndustryPartner = mongoose.model('IndustryPartner', industryPartnerSchema);
export default IndustryPartner;
