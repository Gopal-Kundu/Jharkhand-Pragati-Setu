import IndustryPartner from '../models/IndustryPartner.js';
import User from '../models/User.js';
import Proposal from '../models/Proposal.js';
import Problem from '../models/Problem.js';
import { pushProblemTimeline } from './timelineController.js';
import University from '../models/University.js';
import { MASTER_INDUSTRY_CATALOG } from '../data/masterCatalog.js';

/**
 * @desc    Get current user's registered Industry Partner Profile
 * @route   GET /api/industry/my-profile
 * @access  Private
 */
export const getMyIndustry = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let industry = null;
    if (req.user.industry) {
      industry = await IndustryPartner.findById(req.user.industry);
    }
    if (!industry) {
      industry = await IndustryPartner.findOne({ registeredBy: req.user._id });
    }

    return res.status(200).json({
      success: true,
      industry: industry || null
    });
  } catch (error) {
    console.error('[Get My Industry Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user industry profile'
    });
  }
};

/**
 * @desc    Register a new Industry Partner Entity (linked to user)
 * @route   POST /api/industry/register
 * @access  Private
 */
export const registerIndustry = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const {
      name,
      type,
      hqLocation,
      focusDomains,
      availableDomains,
      supportCapabilities,
      csrAnnualBudgetInr,
      contactEmail,
      leadMentors
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Company / Industry name is required'
      });
    }

    const domains = availableDomains || focusDomains || ['Water Resources', 'Agriculture'];
    const cleanSupport = Array.isArray(supportCapabilities) ? supportCapabilities : ['IoT & Embedded Sensors'];
    const cleanMentors = Array.isArray(leadMentors) && leadMentors.length > 0
      ? leadMentors
      : [{ name: req.user.name || 'Corporate Mentor', designation: 'Technical Lead', domain: domains[0] || 'Water Resources' }];

    const partnerId = `IND-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

    const newIndustry = await IndustryPartner.create({
      partnerId,
      name: name.trim(),
      type: type || 'CSR Foundation',
      hqLocation: hqLocation || 'Ranchi, Jharkhand',
      registeredBy: req.user._id,
      focusDomains: domains,
      availableDomains: domains,
      supportCapabilities: cleanSupport,
      csrAnnualBudgetInr: Number(csrAnnualBudgetInr) || 5000000,
      leadMentors: cleanMentors,
      contactEmail: contactEmail || req.user.email || ''
    });

    // Link Industry to User
    await User.findByIdAndUpdate(req.user._id, {
      industry: newIndustry._id,
      organization: newIndustry.name,
      role: 'industry'
    });

    return res.status(201).json({
      success: true,
      message: 'Industry Partner successfully registered!',
      industry: newIndustry
    });
  } catch (error) {
    console.error('[Register Industry Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error registering industry partner'
    });
  }
};

/**
 * @desc    Update user's registered Industry Partner Profile
 * @route   PUT /api/industry/my-profile
 * @access  Private
 */
export const updateMyIndustry = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let industry = await IndustryPartner.findOne({
      $or: [{ _id: req.user.industry }, { registeredBy: req.user._id }]
    });

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry profile not found. Please register first.'
      });
    }

    const {
      name,
      type,
      hqLocation,
      focusDomains,
      availableDomains,
      supportCapabilities,
      csrAnnualBudgetInr,
      contactEmail,
      leadMentors
    } = req.body;

    const domains = availableDomains || focusDomains || industry.availableDomains || industry.focusDomains;

    industry.name = name?.trim() || industry.name;
    industry.type = type || industry.type;
    industry.hqLocation = hqLocation || industry.hqLocation;
    industry.focusDomains = domains;
    industry.availableDomains = domains;
    if (supportCapabilities) industry.supportCapabilities = supportCapabilities;
    if (csrAnnualBudgetInr) industry.csrAnnualBudgetInr = Number(csrAnnualBudgetInr);
    if (contactEmail) industry.contactEmail = contactEmail;
    if (leadMentors) industry.leadMentors = leadMentors;

    await industry.save();

    return res.status(200).json({
      success: true,
      message: 'Industry profile updated successfully',
      industry
    });
  } catch (error) {
    console.error('[Update My Industry Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating industry details'
    });
  }
};

/**
 * @desc    Get all domain-related university proposals matching this industry's capabilities
 * @route   GET /api/industry/proposals
 * @access  Private
 */
export const getDomainProposalsForIndustry = async (req, res) => {
  try {
    let industry = null;
    if (req.user) {
      industry = await IndustryPartner.findOne({
        $or: [{ _id: req.user.industry }, { registeredBy: req.user._id }]
      });
    }

    const proposals = await Proposal.find()
      .populate({
        path: 'problem',
        select: 'ticketId title description domain location evidence status resolutionStatus priority createdAt submitter'
      })
      .populate({
        path: 'university',
        select: 'name shortName location type contactEmail availableDomains academicDisciplines'
      })
      .populate({
        path: 'industryOffer.industry',
        select: 'name type hqLocation contactEmail'
      })
      .sort({ createdAt: -1 });

    // Filter out any proposals where the problem is solved
    const activeProposals = proposals.filter(p => {
      if (!p.problem) return true; // Keep standalone proposals if any
      return p.problem.resolutionStatus !== 'solved' && p.problem.status !== 'validated';
    }).map(p => {
      const doc = p.toObject ? p.toObject() : p;
      if (!doc.domain && doc.problem?.domain) {
        doc.domain = doc.problem.domain;
      }
      return doc;
    });

    return res.status(200).json({
      success: true,
      count: activeProposals.length,
      proposals: activeProposals
    });
  } catch (error) {
    console.error('[Get Domain Proposals For Industry Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching proposals'
    });
  }
};

/**
 * @desc    Industry submits CSR funding offer & equipment commitment to a University proposal
 * @route   POST /api/industry/proposals/:proposalId/offer
 * @access  Private
 */
export const makeProposalOffer = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { proposalId } = req.params;
    const {
      action,
      fundingAmount,
      supportDetails,
      equipmentProvided,
      mentorName,
      mentorDesignation,
      mentorEmail,
      rejectionReason
    } = req.body;

    const proposal = await Proposal.findById(proposalId)
      .populate('problem')
      .populate('university');

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    let industry = await IndustryPartner.findOne({
      $or: [{ _id: req.user.industry }, { registeredBy: req.user._id }]
    });

    if (!industry) {
      return res.status(400).json({
        success: false,
        message: 'You must register an industry partner profile first.'
      });
    }

    // 1. Handle REJECT
    if (action === 'reject') {
      proposal.status = 'rejected_by_industry';
      if (proposal.industryOffer) {
        proposal.industryOffer.responseStatus = 'rejected';
        proposal.industryOffer.responseNote = rejectionReason || 'Declined by industry sponsor';
      }
      await proposal.save();

      // Log to problem timeline
      if (proposal.problem) {
        await pushProblemTimeline(
          proposal.problem._id || proposal.problem,
          'Proposal Co-Sponsorship Declined',
          `${industry.name} evaluated research proposal '${proposal.title}' and declined support. Reason: ${rejectionReason || 'Declined by industry sponsor'}`,
          'amber'
        );
      }

      return res.status(200).json({
        success: true,
        message: 'Proposal co-sponsorship declined',
        proposal
      });
    }

    // 2. Handle ACCEPT & MAKE CSR OFFER
    const offerPayload = {
      industry: industry._id,
      fundingAmount: Number(fundingAmount) || proposal.estimatedBudget || 500000,
      supportDetails: supportDetails || `Committed CSR grant and corporate technical mentoring by ${industry.name}.`,
      equipmentProvided: Array.isArray(equipmentProvided) && equipmentProvided.length > 0
        ? equipmentProvided
        : proposal.industrySupportRequired || ['IoT & Embedded Sensors'],
      mentorName: mentorName || req.user.name || 'Corporate Lead',
      mentorDesignation: mentorDesignation || 'CSR & Technology Director',
      mentorEmail: mentorEmail || req.user.email || industry.contactEmail || '',
      offeredAt: new Date(),
      responseStatus: 'pending'
    };

    proposal.industryOffer = offerPayload;
    proposal.assignedIndustry = industry._id;
    proposal.status = 'offered_by_industry';
    await proposal.save();

    // Link proposal to Industry
    await IndustryPartner.findByIdAndUpdate(industry._id, {
      $addToSet: { 
        acceptedProposals: proposal._id,
        sendedProposal: proposal._id 
      },
      $inc: { activeGrantsCount: 1 }
    });

    // Notify University with proposal accepted notification
    if (proposal.university) {
      const targetUnivId = proposal.university._id || proposal.university;
      const univNotification = {
        id: proposal._id,
        schemaName: 'Proposal',
        title: `Proposal Accepted by ${industry.name}`,
        description: `${industry.name} accepted your proposal '${proposal.title}' and committed a funding grant of ₹${Number(offerPayload.fundingAmount).toLocaleString()}.`,
        read: false,
        createdAt: new Date()
      };

      await University.findByIdAndUpdate(targetUnivId, {
        $push: {
          notifications: {
            $each: [univNotification],
            $position: 0
          }
        }
      });
    }

    // Append to Problem Timeline with Industry name & formatted date
    if (proposal.problem) {
      const problemTargetId = proposal.problem._id || proposal.problem;
      const dateFormatted = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      await pushProblemTimeline(
        problemTargetId,
        `${industry.name} accepted & sponsored Proposal`,
        `${industry.name} accepted proposal '${proposal.title}' and committed a CSR grant of ₹${Number(offerPayload.fundingAmount).toLocaleString()} on ${dateFormatted}.`,
        'purple'
      );
    }

    return res.status(200).json({
      success: true,
      message: `CSR grant offer of ₹${Number(offerPayload.fundingAmount).toLocaleString()} submitted to ${proposal.university?.name || 'University'}!`,
      proposal
    });
  } catch (error) {
    console.error('[Make Proposal Offer Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error submitting CSR offer'
    });
  }
};

/**
 * @desc    Get Industry Notifications
 * @route   GET /api/industry/notifications
 * @access  Private
 */
export const getIndustryNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const industry = await IndustryPartner.findOne({
      $or: [{ _id: req.user.industry }, { registeredBy: req.user._id }]
    });

    if (!industry) {
      return res.status(200).json({ success: true, notifications: [], unreadCount: 0 });
    }

    const notifications = industry.notifications || [];
    const unreadCount = notifications.filter(n => !n.read).length;

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('[Get Industry Notifications Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching notifications'
    });
  }
};

/**
 * @desc    Mark Industry Notifications as Read
 * @route   POST /api/industry/notifications/mark-read
 * @access  Private
 */
export const markIndustryNotificationsRead = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const ind = await IndustryPartner.findOne({
      $or: [{ _id: req.user.industry }, { registeredBy: req.user._id }]
    });

    if (ind && Array.isArray(ind.notifications) && ind.notifications.length > 0) {
      ind.notifications.forEach(n => {
        n.read = true;
        if (!n.description && n.message) n.description = n.message;
        if (!n.schemaName) n.schemaName = 'Proposal';
      });
      await ind.save({ validateModifiedOnly: true });
    }

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('[Mark Notifications Read Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating notifications'
    });
  }
};

/**
 * @desc    Get all Industry, CSR Foundations, MSMEs, and Startups (Public Catalog)
 * @route   GET /api/industry
 * @access  Public
 */
export const getIndustryPartners = async (req, res) => {
  try {
    const { domain, type } = req.query;
    const filter = {};

    if (domain && domain !== 'all') {
      filter.focusDomains = new RegExp(domain, 'i');
    }
    if (type && type !== 'all') {
      filter.type = type;
    }

    let partners = await IndustryPartner.find(filter).sort({ csrAnnualBudgetInr: -1, name: 1 });

    if (!partners || partners.length === 0) {
      partners = MASTER_INDUSTRY_CATALOG;
    }

    return res.status(200).json({
      success: true,
      count: partners.length,
      partners
    });
  } catch (error) {
    console.error('[Get Industry Partners Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching industry partners'
    });
  }
};

/**
 * @desc    Get single Industry partner details
 * @route   GET /api/industry/:id
 * @access  Public
 */
export const getIndustryPartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await IndustryPartner.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { partnerId: id }]
    });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: `Industry partner '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      partner
    });
  } catch (error) {
    console.error('[Get Industry Partner By ID Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching industry partner profile'
    });
  }
};

export default {
  getMyIndustry,
  registerIndustry,
  updateMyIndustry,
  getDomainProposalsForIndustry,
  makeProposalOffer,
  getIndustryNotifications,
  markIndustryNotificationsRead,
  getIndustryPartners,
  getIndustryPartnerById
};
