import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Authentication Middleware
 * Validates JWT token from secure HTTP-Only Cookies (or Authorization header fallback)
 * Attaches the authenticated user to `req.user`
 */
export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Check Authorization header fallback
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: No authentication token found'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sih_2026_default_secret');
    
    // Attach user from database (excluding password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Token verification failed or expired'
    });
  }
};

/**
 * Optional Authentication Middleware
 * Decodes JWT if present in cookies or Authorization header and attaches `req.user`,
 * but proceeds smoothly as guest if no token is present or token is expired.
 */
export const optionalProtect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sih_2026_default_secret');
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Continue as guest without failing
  }
  next();
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts route access to specified roles
 * 
 * @param {...string} allowedRoles - 'citizen', 'panchayat', 'government', 'university', 'industry', 'admin'
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user?.role || 'Guest'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

export default {
  protect,
  optionalProtect,
  authorizeRoles
};
