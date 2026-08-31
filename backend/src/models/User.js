import mongoose from 'mongoose';

/**
 * Consolidated User Schema
 * Handles all 6 roles: Citizen, Panchayat (PRI/ULB), Government, University, Industry, and Public
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['citizen', 'panchayat', 'government', 'university', 'industry', 'public', 'admin'],
      default: 'citizen'
    },
    organization: {
      type: String,
      default: 'General Citizen Body'
    },
    district: {
      type: String,
      default: 'Ranchi'
    },
    state: {
      type: String,
      default: 'Jharkhand'
    },
    phone: {
      type: String,
      default: ''
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      default: null
    },
    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IndustryPartner',
      default: null
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

export const User = mongoose.model('User', userSchema);
export default User;

