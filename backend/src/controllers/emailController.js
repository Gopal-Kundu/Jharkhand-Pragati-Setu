import { sendEmailNotification } from '../email/emailService.js';

/**
 * @desc    Send custom / test email notification
 * @route   POST /api/notifications/email
 * @access  Private / Authenticated
 */
export const sendCustomEmail = async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email address ("to") and "subject" are required'
      });
    }

    const result = await sendEmailNotification({
      to,
      subject,
      html: html || `<p>${text || subject}</p>`,
      text: text || subject
    });

    return res.status(200).json({
      success: result.success,
      message: result.simulated ? 'Simulated email sent' : 'Email delivered successfully',
      result
    });
  } catch (error) {
    console.error('[Email Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error sending email'
    });
  }
};

export default {
  sendCustomEmail
};
