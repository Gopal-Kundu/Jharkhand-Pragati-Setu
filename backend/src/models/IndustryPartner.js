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
    focusDomains: [String],
    csrAnnualBudgetInr: {
      type: Number,
      default: 5000000
    },
    activeGrantsCount: {
      type: Number,
      default: 0
    },
    mentorshipAvailable: {
      type: Boolean,
      default: true
    },
    leadMentors: [
      {
        name: { type: String, required: true },
        designation: { type: String, required: true },
        domain: { type: String, required: true }
      }
    ],
    contactEmail: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const IndustryPartner = mongoose.model('IndustryPartner', industryPartnerSchema);
export default IndustryPartner;
