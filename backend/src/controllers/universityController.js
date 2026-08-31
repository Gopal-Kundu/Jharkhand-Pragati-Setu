import mongoose from 'mongoose';
import University from '../models/University.js';
import User from '../models/User.js';
import Proposal from '../models/Proposal.js';
import Problem from '../models/Problem.js';
import IndustryPartner from '../models/IndustryPartner.js';
import { matchProposalToIndustry } from '../ai/aiService.js';
import { MASTER_HEI_CATALOG } from '../data/masterCatalog.js';

/**
 * @desc    Get all registered Universities & HEI institutions
 * @route   GET /api/universities
 * @access  Public
 */
export const getUniversities = async (req, res) => {
  try {
    const { district, domain, type } = req.query;
    const filter = {};

    if (district && district !== 'all') {
      filter['location.district'] = new RegExp(district, 'i');
    }
    if (domain && domain !== 'all') {
      filter.availableDomains = domain;
    }
    if (type && type !== 'all') {
      filter.type = type;
    }

    let universities = await University.find(filter).sort({ name: 1 });

    if (!universities || universities.length === 0) {
      universities = MASTER_HEI_CATALOG;
    }

    return res.status(200).json({
      success: true,
      count: universities.length,
      universities
    });
  } catch (error) {
    console.error('[Get Universities Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching universities'
    });
  }
};

/**
 * @desc    Get logged-in user's registered university profile, notifications, and proposals
 * @route   GET /api/universities/my
 * @access  Private
 */
export const getMyUniversity = async (req, res) => {
  try {
    let university = null;

    if (req.user.university) {
      university = await University.findById(req.user.university)
        .populate({
          path: 'proposals',
          populate: [{ path: 'problem' }, { path: 'assignedIndustry' }]
        });
    }

    if (!university) {
      university = await University.findOne({ registeredBy: req.user._id })
        .populate({
          path: 'proposals',
          populate: [{ path: 'problem' }, { path: 'assignedIndustry' }]
        });
    }

    // If still not linked, check if user's organization matches a university name
    if (!university && req.user.organization) {
      university = await University.findOne({
        name: new RegExp(req.user.organization, 'i')
      });

      if (university) {
        // Automatically link to user
        await User.findByIdAndUpdate(req.user._id, { university: university._id });
      }
    }

    if (university) {
      const allUnivProposals = await Proposal.find({ university: university._id })
        .populate('problem')
        .populate('assignedIndustry')
        .populate('industryOffer.industry')
        .sort({ createdAt: -1 });

      const univObj = university.toObject ? university.toObject() : university;
      univObj.proposals = allUnivProposals;
      university = univObj;
    }

    return res.status(200).json({
      success: true,
      university
    });
  } catch (error) {
    console.error('[Get My University Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching university profile'
    });
  }
};

/**
 * @desc    Register a new University Institution by a university role user
 * @route   POST /api/universities/register
 * @access  Private (University role)
 */
export const registerUniversity = async (req, res) => {
  try {
    const {
      name,
      location,
      type = 'State University',
      availableDomains = [],
      contactEmail
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'University name is required'
      });
    }

    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : (location || { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' });

    const newUniversity = new University({
      name,
      location: {
        city: parsedLocation.city || 'Ranchi',
        district: parsedLocation.district || 'Ranchi',
        state: parsedLocation.state || 'Jharkhand'
      },
      type,
      availableDomains: Array.isArray(availableDomains) ? availableDomains : [availableDomains],
      contactEmail: contactEmail || req.user.email,
      registeredBy: req.user._id,
      notifications: []
    });

    await newUniversity.save();

    // Link to User
    await User.findByIdAndUpdate(req.user._id, {
      university: newUniversity._id,
      organization: newUniversity.name
    });

    return res.status(201).json({
      success: true,
      message: 'University institution successfully registered!',
      university: newUniversity
    });
  } catch (error) {
    console.error('[Register University Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error registering university'
    });
  }
};

/**
 * @desc    Update registered university details (availableDomains, location, etc.)
 * @route   PUT /api/universities/my
 * @access  Private (University role)
 */
export const updateMyUniversity = async (req, res) => {
  try {
    let universityId = req.user.university;

    if (!universityId) {
      const existing = await University.findOne({ registeredBy: req.user._id });
      if (existing) universityId = existing._id;
    }

    if (!universityId) {
      return res.status(404).json({
        success: false,
        message: 'No university institution registered under your account'
      });
    }

    const {
      name,
      location,
      type,
      availableDomains,
      contactEmail
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (availableDomains) updateData.availableDomains = Array.isArray(availableDomains) ? availableDomains : [availableDomains];
    if (contactEmail) updateData.contactEmail = contactEmail;
    if (location) {
      const parsedLoc = typeof location === 'string' ? JSON.parse(location) : location;
      updateData.location = parsedLoc;
    }

    const updatedUniversity = await University.findByIdAndUpdate(
      universityId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'University details updated successfully',
      university: updatedUniversity
    });
  } catch (error) {
    console.error('[Update University Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating university'
    });
  }
};

/**
 * @desc    Get university notifications
 * @route   GET /api/universities/my/notifications
 * @access  Private
 */
export const getUniversityNotifications = async (req, res) => {
  try {
    const univId = req.user.university;
    if (!univId) {
      return res.status(200).json({ success: true, notifications: [], unreadCount: 0 });
    }

    const university = await University.findById(univId);
    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }

    const notifications = university.notifications || [];
    const unreadCount = notifications.filter(n => !n.read).length;

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('[Get University Notifications Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching notifications'
    });
  }
};

/**
 * @desc    Mark all university notifications as read
 * @route   PATCH /api/universities/my/notifications/read
 * @access  Private
 */
export const markUniversityNotificationsRead = async (req, res) => {
  try {
    const univId = req.user.university;
    const univ = await University.findById(univId);
    if (univ && Array.isArray(univ.notifications) && univ.notifications.length > 0) {
      univ.notifications.forEach(n => {
        n.read = true;
        if (!n.description && n.message) n.description = n.message;
        if (!n.schemaName) n.schemaName = 'Problem';
      });
      await univ.save({ validateModifiedOnly: true });
    }

    return res.status(200).json({
      success: true,
      message: 'All university notifications marked as read'
    });
  } catch (error) {
    console.error('[Mark University Notifications Read Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating notifications'
    });
  }
};

/**
 * @desc    Make an R&D & Implementation Proposal for an assigned problem statement
 * @route   POST /api/universities/proposals
 * @access  Private (University role)
 */
export const createProposal = async (req, res) => {
  try {
    const {
      problemId,
      title,
      description,
      problemStatement,
      facultyMembers = [],
      teamMembers = [],
      projectDuration = '6 Months',
      estimatedBudget = 500000,
      industrySupportRequired = [],
      peopleImpacted = 0
    } = req.body;

    if (!problemId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Problem reference, proposal title, and technical methodology description are required'
      });
    }

    // Resolve university ID
    let universityId = req.user.university;
    if (!universityId) {
      const userUniv = await University.findOne({ registeredBy: req.user._id });
      if (userUniv) universityId = userUniv._id;
    }

    if (!universityId) {
      // Fallback: create default university profile
      const defaultUniv = await University.findOne() || await University.create({
        name: req.user.organization || 'Jharkhand State Innovation HEI',
        location: { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' }
      });
      universityId = defaultUniv._id;
    }

    // Verify problem
    let problem = null;
    if (problemId && /^[0-9a-fA-F]{24}$/.test(problemId)) {
      problem = await Problem.findById(problemId);
    }
    if (!problem) {
      problem = await Problem.findOne();
    }

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem statement #${problemId} not found`
      });
    }

    // 1. Create Proposal Document
    const newProposal = new Proposal({
      problem: problem._id,
      university: universityId,
      title,
      description,
      problemStatement: problemStatement || problem.title,
      domain: problem.domain || 'Water Resources',
      facultyMembers: Array.isArray(facultyMembers) && facultyMembers.length > 0 
        ? facultyMembers 
        : [{ name: req.user.name || 'Lead PI', designation: 'Professor & Head', department: 'Applied Sciences', email: req.user.email }],
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
      projectDuration,
      estimatedBudget: Number(estimatedBudget) || 500000,
      peopleImpacted: Number(peopleImpacted) || 0,
      industrySupportRequired: Array.isArray(industrySupportRequired) && industrySupportRequired.length > 0
        ? industrySupportRequired
        : ['IoT & Embedded Sensors'],
      status: 'submitted'
    });

    // 2. AI Industry Matchmaking & Notification
    try {
      const allIndustries = await IndustryPartner.find();
      const matchResult = await matchProposalToIndustry(newProposal, allIndustries);

      if (matchResult && matchResult.matchedPartnerId) {
        newProposal.status = 'industry_matched';

        // 3. Send Notification to Matched Industry Partner
        const industryNotif = {
          proposalId: newProposal._id,
          problemId: problem._id,
          title: `New University R&D Proposal Matched`,
          message: `Proposal '${title}' was created by university team requiring '${(newProposal.industrySupportRequired || []).join(', ')}' matching your CSR mandate.`,
          domain: problem.domain || 'Innovation',
          read: false,
          createdAt: new Date()
        };

        await IndustryPartner.findByIdAndUpdate(matchResult.matchedPartnerId, {
          $push: {
            notifications: {
              $each: [industryNotif],
              $position: 0
            }
          }
        });
      }
    } catch (aiMatchErr) {
      console.warn('[AI Industry Match Warning]:', aiMatchErr.message);
    }

    await newProposal.save();

    // 4. Update University Schema with proposal reference
    await University.findByIdAndUpdate(universityId, {
      $push: {
        proposals: newProposal._id
      }
    });

    // 5. Update Problem status, allocation, peopleImpacted & push proposal & universityId
    const problemUpdate = {
      status: 'in_progress',
      allocatedUniversity: universityId,
      $addToSet: {
        proposals: newProposal._id,
        proposalGivenUniversity: universityId
      }
    };

    if (peopleImpacted && Number(peopleImpacted) > 0) {
      problemUpdate.peopleImpacted = Number(peopleImpacted);
      problemUpdate['socialImpact.beneficiariesReached'] = Number(peopleImpacted);
      problemUpdate['socialImpact.metricValue'] = Number(peopleImpacted).toLocaleString();
    }

    const universityDoc = await University.findById(universityId);
    const universityName = universityDoc?.name || req.user?.organization || 'University R&D Lab';

    await Problem.findByIdAndUpdate(problem._id, {
      ...problemUpdate,
      $push: {
        auditHistory: {
          $each: [{
            timestamp: new Date(),
            officer: req.user?.name || universityName,
            role: 'university',
            action: `${universityName} submitted R&D Proposal`,
            note: `${universityName} submitted an R&D implementation proposal ('${title}').`
          }],
          $position: 0
        }
      }
    });

    // 6. Send notification to the user/citizen who reported this problem
    const submitterUserId = problem.submitter?.userId || (problem.submitter?.email ? (await User.findOne({ email: problem.submitter.email }))?._id : null);
    if (submitterUserId) {
      try {
        await User.findByIdAndUpdate(submitterUserId, {
          $push: {
            notifications: {
              $each: [{
                id: newProposal._id,
                schemaName: 'Proposal',
                title: `Proposal Submitted for your challenge`,
                description: `${universityName} submitted an R&D proposal for your reported challenge '${problem.title}'.`,
                read: false,
                createdAt: new Date()
              }],
              $position: 0
            }
          }
        });
      } catch (userNotifErr) {
        console.warn('[Problem Submitter Notification Error]:', userNotifErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Proposal sent to required industries',
      proposal: newProposal
    });
  } catch (error) {
    console.error('[Create Proposal Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating proposal'
    });
  }
};

/**
 * @desc    University accepts or rejects an industry CSR co-sponsorship offer
 * @route   POST /api/universities/proposals/:proposalId/respond-offer
 * @access  Private (University role)
 */
export const respondToIndustryOffer = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { proposalId } = req.params;
    const { action, responseNote } = req.body; // 'accept' or 'reject'

    const proposal = await Proposal.findById(proposalId)
      .populate('problem')
      .populate('university')
      .populate('industryOffer.industry');

    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const university = await University.findById(req.user.university);
    if (!university) {
      return res.status(403).json({ success: false, message: 'Only registered universities can respond to offers' });
    }

    const industryPartnerId = proposal.industryOffer?.industry?._id || proposal.assignedIndustry;

    if (action === 'accept') {
      proposal.industryOffer.responseStatus = 'accepted';
      proposal.industryOffer.responseNote = responseNote || 'Offer accepted by University Lead Investigator';
      proposal.industryOffer.respondedAt = new Date();
      proposal.status = 'accepted_by_university';
      await proposal.save();

      // Notify Industry Partner
      if (industryPartnerId) {
        const notif = {
          proposalId: proposal._id,
          problemId: proposal.problem?._id,
          title: `CSR Co-Sponsorship Offer Accepted! (${proposal.domain})`,
          message: `${university.name} accepted your CSR grant & equipment support offer for '${proposal.title}'. Project package forwarded to Government for final sanction.`,
          domain: proposal.domain,
          read: false,
          createdAt: new Date()
        };

        await IndustryPartner.findByIdAndUpdate(industryPartnerId, {
          $push: { notifications: { $each: [notif], $position: 0 } }
        });
      }

      // Append to Problem Audit History
      if (proposal.problem) {
        await Problem.findByIdAndUpdate(proposal.problem._id || proposal.problem, {
          $push: {
            auditHistory: {
              $each: [{
                timestamp: new Date(),
                officer: university.name,
                role: 'university',
                action: 'Industry CSR Offer Accepted by University',
                note: `${university.name} accepted CSR grant (₹${(proposal.industryOffer?.fundingAmount || 0).toLocaleString()}) from ${proposal.industryOffer?.industry?.name || 'Industry Sponsor'}. Forwarded to Government.`
              }],
              $position: 0
            }
          }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Industry offer accepted! Forwarded to Government for final sanction.',
        proposal
      });
    } else {
      proposal.industryOffer.responseStatus = 'rejected';
      proposal.industryOffer.responseNote = responseNote || 'Offer declined by University';
      proposal.industryOffer.respondedAt = new Date();
      proposal.status = 'rejected_by_university';
      await proposal.save();

      // Notify Industry Partner
      if (industryPartnerId) {
        const notif = {
          proposalId: proposal._id,
          problemId: proposal.problem?._id,
          title: `CSR Co-Sponsorship Offer Declined (${proposal.domain})`,
          message: `${university.name} declined the current CSR offer for '${proposal.title}'.`,
          domain: proposal.domain,
          read: false,
          createdAt: new Date()
        };

        await IndustryPartner.findByIdAndUpdate(industryPartnerId, {
          $push: { notifications: { $each: [notif], $position: 0 } }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Industry offer declined',
        proposal
      });
    }
  } catch (error) {
    console.error('[Respond To Industry Offer Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error responding to industry offer'
    });
  }
};

/**
 * @desc    Get single University details
 * @route   GET /api/universities/:id
 * @access  Public
 */
export const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId 
      ? { $or: [{ _id: id }, { name: new RegExp(`^${id}$`, 'i') }] }
      : { name: new RegExp(`^${id}$`, 'i') };

    let university = await University.findOne(query)
      .populate({
        path: 'proposals',
        populate: [
          { path: 'problem' },
          { path: 'assignedIndustry' },
          { path: 'industryOffer.industry' }
        ]
      });

    if (!university) {
      const fallback = (MASTER_HEI_CATALOG || []).find(
        h => h.id === id || h.name?.toLowerCase() === id.toLowerCase()
      );
      if (fallback) {
        return res.status(200).json({ success: true, university: fallback });
      }
      return res.status(404).json({
        success: false,
        message: `University '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      university
    });
  } catch (error) {
    console.error('[Get University By ID Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching university profile'
    });
  }
};

/**
 * @desc    Mark University R&D project as Finished/Completed and resolve the Problem to 'solved'
 * @route   POST /api/universities/proposals/:proposalId/complete
 * @access  Private (University Lead)
 */
export const completeProposal = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { proposalId } = req.params;
    const { completionNotes } = req.body;

    const proposal = await Proposal.findById(proposalId)
      .populate('problem')
      .populate('university')
      .populate('industryOffer.industry');

    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    let university = null;
    if (req.user.university) {
      university = await University.findById(req.user.university);
    }
    if (!university) {
      university = proposal.university;
    }
    const universityName = university?.name || req.user.name || 'University R&D Team';

    // 1. Mark Proposal status as completed
    proposal.status = 'completed';
    await proposal.save();

    // 2. Mark Problem status as 'deployed' and resolutionStatus as 'solved'
    const problemId = proposal.problem?._id || proposal.problem;
    let problem = null;
    if (problemId) {
      problem = await Problem.findByIdAndUpdate(
        problemId,
        {
          status: 'deployed',
          resolutionStatus: 'solved',
          $push: {
            auditHistory: {
              $each: [{
                timestamp: new Date(),
                officer: universityName,
                role: 'university',
                action: 'Project Finished & Problem Solved',
                note: `${universityName} successfully concluded the R&D implementation for '${proposal.title}'. Challenge marked as SOLVED across the state network. ${completionNotes ? `Notes: ${completionNotes}` : ''}`
              }],
              $position: 0
            }
          }
        },
        { new: true }
      );

      if (problem) {
        // 3. Send Notification to Citizen (Problem Submitter / Reporter)
        let citizenUserId = problem.submitter?.userId;
        if (!citizenUserId && problem.submitter?.email) {
          const matchedCitizen = await User.findOne({ email: problem.submitter.email.toLowerCase().trim() });
          if (matchedCitizen) {
            citizenUserId = matchedCitizen._id;
          }
        }

        if (citizenUserId) {
          try {
            await User.findByIdAndUpdate(citizenUserId, {
              $push: {
                notifications: {
                  $each: [{
                    id: new mongoose.Types.ObjectId(),
                    schemaName: 'Problem',
                    title: `Your Reported Problem is SOLVED!`,
                    description: `Great news! ${universityName} has finished the solution project '${proposal.title}' and deployed the fix in your area.`,
                    read: false,
                    createdAt: new Date()
                  }],
                  $position: 0
                }
              }
            });
          } catch (citErr) {
            console.warn('[Citizen Notification Error]:', citErr.message);
          }
        }
      }
    }

    // 4. Send Notification to Industry Partner
    const industryPartnerId = proposal.industryOffer?.industry?._id || proposal.assignedIndustry;
    if (industryPartnerId) {
      try {
        const notif = {
          id: new mongoose.Types.ObjectId(),
          schemaName: 'Proposal',
          title: `Sponsored Project Completed (${proposal.domain || 'Innovation'})`,
          description: `${universityName} has successfully completed the CSR-sponsored R&D solution for '${problem?.title || proposal.title}'. Solution deployed.`,
          read: false,
          createdAt: new Date()
        };
        await IndustryPartner.findByIdAndUpdate(industryPartnerId, {
          $push: { notifications: { $each: [notif], $position: 0 } }
        });
      } catch (indErr) {
        console.warn('[Industry Notification Error]:', indErr.message);
      }
    }

    // 5. Send Notification to Government Officers
    try {
      await User.updateMany(
        { role: { $in: ['government', 'admin'] } },
        {
          $push: {
            notifications: {
              $each: [{
                id: new mongoose.Types.ObjectId(),
                schemaName: 'Problem',
                title: `Project Finished & Challenge Resolved`,
                description: `${universityName} has concluded the tripartite project '${proposal.title}' for problem '${problem?.title || ''}'. Status updated to SOLVED.`,
                read: false,
                createdAt: new Date()
              }],
              $position: 0
            }
          }
        }
      );
    } catch (govtErr) {
      console.warn('[Govt Notification Error]:', govtErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Project marked as finished! Problem resolution updated to Solved.',
      proposal,
      problem
    });
  } catch (error) {
    console.error('[Complete Proposal Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error marking project as completed'
    });
  }
};

export default {
  getUniversities,
  getMyUniversity,
  registerUniversity,
  updateMyUniversity,
  getUniversityNotifications,
  markUniversityNotificationsRead,
  createProposal,
  respondToIndustryOffer,
  completeProposal,
  getUniversityById
};
