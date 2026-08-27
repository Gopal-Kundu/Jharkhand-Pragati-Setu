import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configure Nodemailer SMTP Transporter using .env variables
 */
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass
    }
  });
};

/**
 * Send an email notification
 * 
 * @param {Object} mailOptions
 * @param {string} mailOptions.to - Recipient email address
 * @param {string} mailOptions.subject - Email subject line
 * @param {string} mailOptions.html - HTML body content
 * @param {string} [mailOptions.text] - Fallback plain text content
 * @returns {Promise<{ success: boolean, messageId?: string, simulated?: boolean }>}
 */
export const sendEmailNotification = async ({ to, subject, html, text }) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || `"SIH 2026 Pragati Setu" <${user}>`;

  // If using placeholder password in development, simulate email delivery
  if (!user || !pass || pass.includes('mock') || pass.includes('password_here')) {
    console.log(`[Email Service] Simulated notification sent to <${to}>: "${subject}"`);
    return {
      success: true,
      simulated: true,
      messageId: `simulated_msg_${Date.now()}`
    };
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || subject,
      html
    });

    console.log(`[Email Service] Email successfully delivered to ${to} (MessageId: ${info.messageId})`);
    return {
      success: true,
      messageId: info.messageId,
      simulated: false
    };
  } catch (error) {
    console.error(`[Email Service Error] Failed to send email to ${to}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Email template for Citizen Problem Submission Receipt
 */
export const sendProblemSubmittedEmail = async (problemData, recipientEmail) => {
  const subject = `[SIH 2026 Ticket #${problemData.ticketId || problemData._id}] Problem Registered Successfully`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <div style="background-color: #0f172a; padding: 16px; border-radius: 6px; text-align: center; color: white;">
        <h2 style="margin: 0; color: #38bdf8;">Government of Jharkhand & SIH 2026</h2>
        <p style="margin: 4px 0 0 0; font-size: 14px;">Societal Problem-to-Innovation Platform</p>
      </div>
      <div style="padding: 20px 0;">
        <p>Dear Citizen / Local Body Representative,</p>
        <p>Your societal challenge statement has been successfully logged into the AI Triage & Innovation pipeline:</p>
        <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #0284c7; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0; color: #0f172a;">${problemData.title}</h3>
          <p style="margin: 4px 0;"><strong>Ticket ID:</strong> ${problemData.ticketId || problemData._id}</p>
          <p style="margin: 4px 0;"><strong>Domain:</strong> ${problemData.domain}</p>
          <p style="margin: 4px 0;"><strong>Location:</strong> ${problemData.location?.district || 'Jharkhand'}, Block: ${problemData.location?.block || 'N/A'}</p>
          <p style="margin: 4px 0;"><strong>AI Severity Score:</strong> ${problemData.aiAnalysis?.severity || '7.5'}/10</p>
        </div>
        <p>Our AI system has categorized this problem statement and forwarded it to the relevant Government Department and University Innovation Centers for multidisciplinary solution prototyping.</p>
        <p style="color: #64748b; font-size: 13px;">You can track real-time milestones on the portal using your Ticket ID.</p>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">Smart India Hackathon 2026 • Societal Problem-to-Innovation Ecosystem</p>
    </div>
  `;

  return sendEmailNotification({ to: recipientEmail, subject, html });
};

/**
 * Email template for Institutional Allocation to University Nodal Officer & Faculty Lead
 */
export const sendUniversityAllocationEmail = async (problemData, universityEmail, universityName) => {
  const subject = `[Action Required] Challenge Statement Allocated to ${universityName} #${problemData.ticketId || problemData._id}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <div style="background-color: #0f172a; padding: 16px; border-radius: 6px; text-align: center; color: white;">
        <h2 style="margin: 0; color: #4ade80;">Institutional Challenge Allocation</h2>
        <p style="margin: 4px 0 0 0; font-size: 14px;">SIH 2026 Academic Innovation Gateway</p>
      </div>
      <div style="padding: 20px 0;">
        <p>Dear Faculty Innovation Lead & Nodal Officer (${universityName}),</p>
        <p>A validated societal challenge statement has been matched and routed to your institution based on your research expertise, faculty specialization, and incubation facility capabilities:</p>
        <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #16a34a; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0; color: #0f172a;">${problemData.title}</h3>
          <p style="margin: 4px 0;"><strong>Domain:</strong> ${problemData.domain}</p>
          <p style="margin: 4px 0;"><strong>Target District:</strong> ${problemData.location?.district}</p>
          <p style="margin: 4px 0;"><strong>Recommended Disciplines:</strong> ${problemData.aiAnalysis?.recommendedDisciplines?.join(', ') || 'Interdisciplinary'}</p>
        </div>
        <p>Please log in to your <strong>University Portal</strong> to:</p>
        <ol>
          <li>Constitute a multidisciplinary student & faculty team.</li>
          <li>Submit a detailed R&D / Prototype Solution Proposal.</li>
          <li>Access Industry CSR matching grants and incubation facility support.</li>
        </ol>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">Smart India Hackathon 2026 • Higher Education Innovation Wing</p>
    </div>
  `;

  return sendEmailNotification({ to: universityEmail, subject, html });
};

export default {
  sendEmailNotification,
  sendProblemSubmittedEmail,
  sendUniversityAllocationEmail
};
