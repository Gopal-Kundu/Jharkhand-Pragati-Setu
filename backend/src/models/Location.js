import mongoose from 'mongoose';

/**
 * Location Schema
 * Maps societal problems to geospatial coordinates, district, block, and Gram Panchayat
 */
const locationSchema = new mongoose.Schema(
  {
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      index: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      index: true
    },
    block: {
      type: String,
      default: '',
      index: true
    },
    state: {
      type: String,
      default: 'Jharkhand'
    },
    address: {
      type: String,
      default: ''
    },
    pincode: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Location = mongoose.model('Location', locationSchema);
export default Location;
