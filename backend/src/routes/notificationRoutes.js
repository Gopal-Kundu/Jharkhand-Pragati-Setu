import express from 'express';
import { 
  createNotification, 
  getMyNotifications, 
  markAllNotificationsRead 
} from '../controllers/notificationController.js';
import { sendCustomEmail } from '../controllers/emailController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dynamic Schema Notification Insertion Endpoint
router.post('/', createNotification);
router.post('/create', createNotification);

// User / Role Notifications Endpoints
router.get('/my', protect, getMyNotifications);
router.get('/user', protect, getMyNotifications);
router.patch('/read-all', protect, markAllNotificationsRead);

// Email notification dispatcher
router.post('/email', sendCustomEmail);
router.post('/send', sendCustomEmail);

export default router;
