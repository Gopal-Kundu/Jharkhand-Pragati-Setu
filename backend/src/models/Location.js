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
    panchayat: {
      type: String,
      default: '',
      index: true
    },
    state: {
      type: String,
      default: 'Jharkhand'
    },
    lat: {
      type: Number,
      default: 23.3441
    },
    lng: {
      type: Number,
      default: 85.3096
    },
    address: {
      type: String,
      default: ''
    },
    pincode: {
      type: String,
      default: ''
    },
    geoPoint: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [85.3096, 23.3441] // [longitude, latitude] GeoJSON
      }
    }
  },
  {
    timestamps: true
  }
);

locationSchema.index({ geoPoint: '2dsphere' });

export const Location = mongoose.model('Location', locationSchema);
export default Location;
