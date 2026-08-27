import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generate JWT Token and set it inside an HTTP-Only secure cookie
 * 
 * @param {Object} res - Express Response object
 * @param {string} userId - Mongo ID of the authenticated user
 */
const sendTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'sih_2026_default_secret', {
    expiresIn: '7d'
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Prevents XSS attacks by disallowing client-side JS access
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  res.cookie('token', token, cookieOptions);
  return token;
};

/**
 * @desc    Register a new user (Citizen, PRI/ULB Panchayat, Govt Officer, University Lead, Industry CSR)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, organization, department, district, state, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    // Explicit Bcrypt Password Hashing inside the API
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'citizen',
      organization: organization || 'General Citizen Body',
      department: department || '',
      district: district || 'Ranchi',
      state: state || 'Jharkhand',
      phone: phone || ''
    });

    // Set secure HTTP-Only cookie
    sendTokenCookie(res, user._id);

    return res.status(201).json({
      success: true,
      message: `User registered successfully with role '${user.role}'`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        department: user.department,
        district: user.district,
        state: user.state,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during user registration'
    });
  }
};

/**
 * @desc    Login existing user & set JWT HTTP-Only cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Explicit Bcrypt Password Comparison inside the API
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Set secure HTTP-Only cookie
    sendTokenCookie(res, user._id);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        department: user.department,
        district: user.district,
        state: user.state,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

/**
 * @desc    Logout user & clear HTTP-Only cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0), // Expire cookie immediately
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully. Cookie cleared.'
    });
  } catch (error) {
    console.error('[Auth Logout Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during logout'
    });
  }
};

/**
 * @desc    Get currently authenticated user info from cookie
 * @route   GET /api/auth/me
 * @access  Private (Requires JWT in Cookie)
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('[Auth GetMe Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user session'
    });
  }
};

/**
 * @desc    Get all notifications for logged-in user
 * @route   GET /api/auth/notifications
 * @access  Private
 */
export const getUserNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const notifications = user.notifications || [];
    const unreadCount = notifications.filter(n => !n.read).length;

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications: [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('[Get Notifications Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Mark all user notifications as read
 * @route   PATCH /api/auth/notifications/read
 * @access  Private
 */
export const markNotificationsAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.notifications && user.notifications.length > 0) {
      user.notifications.forEach(n => {
        n.read = true;
      });
      await user.save();
    }

    return res.status(200).json({
      success: true,
      unreadCount: 0,
      notifications: (user.notifications || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('[Mark Notifications Read Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  register,
  login,
  logout,
  getMe,
  getUserNotifications,
  markNotificationsAsRead
};
