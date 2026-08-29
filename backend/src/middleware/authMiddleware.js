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

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: No authentication token found in cookies'
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
  authorizeRoles
};
