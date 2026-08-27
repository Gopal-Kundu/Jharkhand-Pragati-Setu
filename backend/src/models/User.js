import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    department: {
      type: String,
      default: ''
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
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    institutionDetails: {
      disciplines: [String],
      incubationCenter: String,
      facultyLead: String
    },
    industryDetails: {
      partnerType: String,
      csrBudget: Number,
      focusDomains: [String]
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model('User', userSchema);
export default User;

