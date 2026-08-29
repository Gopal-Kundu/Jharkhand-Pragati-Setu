import mongoose from 'mongoose';
import User from '../models/User.js';
import University from '../models/University.js';
import IndustryPartner from '../models/IndustryPartner.js';
import Problem from '../models/Problem.js';
import Proposal from '../models/Proposal.js';

const MODEL_MAP = {
  user: User,
  university: University,
  industrypartner: IndustryPartner,
  industry: IndustryPartner,
  problem: Problem,
  proposal: Proposal
};

/**
 * @desc    Create dynamic notification and push to the specified schema
 * @route   POST /api/notifications
 * @access  Public / Protected
 */
export const createNotification = async (req, res) => {
  try {
    const { title, description, id, schemaName } = req.body;

    if (!title || !description || !id || !schemaName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, id, schemaName are all required'
      });
    }

    const key = String(schemaName).trim().toLowerCase();
    let TargetModel = MODEL_MAP[key];

    if (!TargetModel) {
      try {
        TargetModel = mongoose.model(schemaName);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: `Unknown schemaName: '${schemaName}'. Supported schemas: User, University, IndustryPartner, Problem, Proposal`
        });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ObjectId: '${id}'`
      });
    }

    const targetDoc = await TargetModel.findById(id);
    if (!targetDoc) {
      return res.status(404).json({
        success: false,
        message: `Record with id '${id}' not found in ${schemaName}`
      });
    }

    const newNotification = {
      title,
      description,
      id: new mongoose.Types.ObjectId(id),
      schemaName,
      read: false,
      createdAt: new Date()
    };

    await TargetModel.findByIdAndUpdate(id, {
      $push: {
        notifications: {
          $each: [newNotification],
          $position: 0
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: `Notification successfully pushed to ${schemaName} #${id}`,
      notification: newNotification
    });
  } catch (error) {
    console.error('[Create Notification Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating notification'
    });
  }
};

/**
 * @desc    Get current user / entity notifications
 * @route   GET /api/notifications/my
 * @access  Protected
 */
export const getMyNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(req.user._id);
    let notifications = user?.notifications || [];

    // If user belongs to University or Industry, also fetch those notifications
    if (user.role === 'university' && user.university) {
      const univ = await University.findById(user.university);
      if (univ && Array.isArray(univ.notifications)) {
        notifications = [...univ.notifications, ...notifications];
      }
    } else if (user.role === 'industry' && user.industry) {
      const ind = await IndustryPartner.findById(user.industry);
      if (ind && Array.isArray(ind.notifications)) {
        notifications = [...ind.notifications, ...notifications];
      }
    }

    // Sort by createdAt descending
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const unreadCount = notifications.filter(n => !n.read).length;

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('[Get My Notifications Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Mark all notifications as read for current user
 * @route   PATCH /api/notifications/read-all
 * @access  Protected
 */
export const markAllNotificationsRead = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // 1. Mark User notifications
    const user = await User.findById(req.user._id);
    if (user && Array.isArray(user.notifications) && user.notifications.length > 0) {
      user.notifications.forEach(n => {
        n.read = true;
        if (!n.description && n.message) n.description = n.message;
        if (!n.schemaName) n.schemaName = 'Problem';
      });
      await user.save({ validateModifiedOnly: true });
    }

    // 2. Mark University notifications if applicable
    if (req.user.university) {
      const univ = await University.findById(req.user.university);
      if (univ && Array.isArray(univ.notifications) && univ.notifications.length > 0) {
        univ.notifications.forEach(n => {
          n.read = true;
          if (!n.description && n.message) n.description = n.message;
          if (!n.schemaName) n.schemaName = 'Problem';
        });
        await univ.save({ validateModifiedOnly: true });
      }
    }

    // 3. Mark Industry notifications if applicable
    if (req.user.industry) {
      const ind = await IndustryPartner.findById(req.user.industry);
      if (ind && Array.isArray(ind.notifications) && ind.notifications.length > 0) {
        ind.notifications.forEach(n => {
          n.read = true;
          if (!n.description && n.message) n.description = n.message;
          if (!n.schemaName) n.schemaName = 'Proposal';
        });
        await ind.save({ validateModifiedOnly: true });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('[Mark Notifications Read Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createNotification,
  getMyNotifications,
  markAllNotificationsRead
};
