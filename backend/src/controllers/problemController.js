import Problem from '../models/Problem.js';
import University from '../models/University.js';
import User from '../models/User.js';
import Location from '../models/Location.js';
import { analyzeAndClassifyProblem, checkProblemDuplicateInLocation } from '../ai/aiService.js';
import { uploadMediaToCloudinary } from '../cloudinary/upload.js';
import { sendProblemSubmittedEmail, sendUniversityAllocationEmail } from '../email/emailService.js';

/**
 * Helper to generate unique domain-based ticket ID
 */
const generateTicketId = (domain = 'GEN') => {
  const map = {
    'Water Resources': 'WTR',
    'Agriculture': 'AGR',
    'Healthcare': 'HLT',
    'Education': 'EDU',
    'Environment': 'ENV',
    'Energy': 'NRG',
    'Urban Development': 'URB',
    'Accessibility': 'ACC',
    'Public Administration': 'PAD',
    'Rural Livelihoods': 'RLH'
  };
  const code = map[domain] || 'SOC';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `JH-${code}-${randomNum}`;
};

/**
 * @desc    Submit a new societal challenge statement (AI domain classification, location deduplication & university matching)
 * @route   POST /api/problems
 * @access  Public / Authenticated
 */
export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      submitter,
      priority = 'Medium'
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required to submit a problem statement'
      });
    }

    // 1. Parse nested JSON if sent via multipart/form-data
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : (location || { district: 'Ranchi', state: 'Jharkhand' });
    const parsedSubmitter = typeof submitter === 'string' ? JSON.parse(submitter) : (submitter || { name: 'Concerned Citizen', role: 'individual_citizen' });

    // Ensure GPS coordinates are structured for MongoDB Geospatial storage
    const lat = Number(parsedLocation.lat) || 23.3441;
    const lng = Number(parsedLocation.lng) || 85.3096;
    parsedLocation.lat = lat;
    parsedLocation.lng = lng;
    parsedLocation.geoPoint = {
      type: 'Point',
      coordinates: [lng, lat]
    };

    // 2. Locality Deduplication Search (District, Block, Panchayat)
    const locFilter = { district: new RegExp(`^${parsedLocation.district || 'Ranchi'}$`, 'i') };
    if (parsedLocation.block) {
      locFilter.block = new RegExp(`^${parsedLocation.block}$`, 'i');
    }
    if (parsedLocation.panchayat) {
      locFilter.panchayat = new RegExp(`^${parsedLocation.panchayat}$`, 'i');
    }

    const existingLocationRecords = await Location.find(locFilter).populate('problem').limit(15);
    const existingProblemsInLocality = existingLocationRecords
      .map(loc => loc.problem)
      .filter(p => p && p.title && p.status !== 'rejected');

    if (existingProblemsInLocality.length > 0) {
      const duplicateResult = await checkProblemDuplicateInLocation(
        { title, description, location: parsedLocation },
        existingProblemsInLocality
      );

      if (duplicateResult.isDuplicate) {
        return res.status(409).json({
          success: false,
          duplicate: true,
          message: `This problem has already been reported in this locality (${parsedLocation.panchayat || parsedLocation.block || parsedLocation.district}). Registered under #${duplicateResult.matchedTicketId || 'JH-WTR-1042'}.`,
          existingTicketId: duplicateResult.matchedTicketId
        });
      }
    }

    // 3. AI Autonomous Domain Classification & Problem Analysis
    const aiAnalysisResult = await analyzeAndClassifyProblem(title, description, parsedLocation);
    const decidedDomain = aiAnalysisResult.domain || 'Water Resources';

    // 4. Upload multimedia evidence files if present via Multer & Cloudinary
    const evidenceList = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const isVideo = file.mimetype.startsWith('video');
        const isAudio = file.mimetype.startsWith('audio');
        const isDoc = file.mimetype === 'application/pdf' || file.mimetype.includes('document');
        
        const resourceType = isVideo ? 'video' : isDoc ? 'raw' : 'image';
        const fileType = isVideo ? 'video' : isAudio ? 'audio' : isDoc ? 'document' : 'photo';

        const uploadRes = await uploadMediaToCloudinary(file.buffer, {
          resourceType,
          fileName: `sih_${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9]/g, '_')}`
        });

        evidenceList.push({
          type: fileType,
          url: uploadRes.url,
          publicId: uploadRes.publicId,
          caption: file.originalname,
          uploadedAt: new Date()
        });
      }
    } else if (req.body.evidenceUrl) {
      evidenceList.push({
        type: 'photo',
        url: req.body.evidenceUrl,
        caption: 'Uploaded Evidence',
        uploadedAt: new Date()
      });
    }

    const ticketId = generateTicketId(decidedDomain);

    if (req.user) {
      parsedSubmitter.userId = req.user._id;
      if (!parsedSubmitter.name || parsedSubmitter.name === 'Concerned Citizen') {
        parsedSubmitter.name = req.user.name;
      }
      if (!parsedSubmitter.email) {
        parsedSubmitter.email = req.user.email;
      }
      if (!parsedSubmitter.phone && req.user.phone) {
        parsedSubmitter.phone = req.user.phone;
      }
    }

    // 5. Create Problem Record with AI-decided Domain
    const newProblem = new Problem({
      ticketId,
      title,
      description,
      domain: decidedDomain,
      location: parsedLocation,
      user: req.user ? req.user._id : undefined,
      submitter: parsedSubmitter,
      evidence: evidenceList,
      aiAnalysis: {
        domain: decidedDomain,
        category: aiAnalysisResult.category,
        severity: aiAnalysisResult.severity,
        confidence: aiAnalysisResult.confidence,
        urgency: aiAnalysisResult.urgency,
        recommendedDisciplines: aiAnalysisResult.recommendedDisciplines,
        recommendedUniversities: [],
        tags: aiAnalysisResult.tags,
        summary: aiAnalysisResult.summary,
        rootCause: aiAnalysisResult.rootCause
      },
      status: 'submitted',
      priority: aiAnalysisResult.urgency || priority,
      auditHistory: [
        {
          timestamp: new Date(),
          officer: parsedSubmitter.name || 'Citizen / Local Body',
          role: parsedSubmitter.role || 'citizen',
          action: 'Problem Statement Registered (AI Domain Decided)',
          note: `Classified into '${decidedDomain}' by AI with ${evidenceList.length} evidence attachments from ${parsedLocation.district || 'Jharkhand'}`
        }
      ]
    });

    await newProblem.save();

    // 6. Create Location Document linking Problem
    try {
      await Location.create({
        problem: newProblem._id,
        district: parsedLocation.district || 'Ranchi',
        block: parsedLocation.block || '',
        panchayat: parsedLocation.panchayat || '',
        state: parsedLocation.state || 'Jharkhand',
        lat: parsedLocation.lat,
        lng: parsedLocation.lng,
        address: parsedLocation.address || '',
        pincode: parsedLocation.pincode || '',
        geoPoint: parsedLocation.geoPoint
      });
    } catch (locErr) {
      console.warn('[Location Save Warning]:', locErr.message);
    }

    // 7. University Matching & Notification Dispatch based on availableDomains
    try {
      const disciplineRegexes = (aiAnalysisResult.recommendedDisciplines || []).map(d => new RegExp(d, 'i'));
      const matchedUniversities = await University.find({
        $or: [
          { availableDomains: decidedDomain },
          { academicDisciplines: { $in: disciplineRegexes } },
          { academicDisciplines: new RegExp(decidedDomain, 'i') },
          { researchCentres: new RegExp(decidedDomain, 'i') }
        ]
      });

      const universitiesToNotify = matchedUniversities.length > 0 
        ? matchedUniversities 
        : await University.find().limit(3);

      const univNotification = {
        problemId: newProblem._id,
        ticketId: newProblem.ticketId,
        title: `New Challenge Statement Matched (${decidedDomain})`,
        message: `A new societal problem from ${parsedLocation.district} ('${newProblem.title}') was matched to your university domain capabilities.`,
        domain: decidedDomain,
        read: false,
        createdAt: new Date()
      };

      for (const univ of universitiesToNotify) {
        await University.findByIdAndUpdate(univ._id, {
          $push: {
            notifications: {
              $each: [univNotification],
              $position: 0
            }
          }
        });
      }
    } catch (univNotifErr) {
      console.warn('[University Notification Error]:', univNotifErr.message);
    }

    // 8. Push notification to Submitter User
    if (req.user) {
      try {
        await User.findByIdAndUpdate(req.user._id, {
          $push: {
            notifications: {
              $each: [{
                title: `Challenge Logged: ${decidedDomain} (#${ticketId})`,
                message: `Your challenge '${title}' was analyzed by AI and classified as '${decidedDomain}'. Sent for University R&D matching.`,
                ticketId,
                type: 'status_update',
                read: false,
                createdAt: new Date()
              }],
              $position: 0
            }
          }
        });
      } catch (notifErr) {
        console.warn('[User Notification Error]:', notifErr.message);
      }
    }

    // 9. Trigger confirmation email if email provided
    if (parsedSubmitter.email) {
      sendProblemSubmittedEmail(newProblem, parsedSubmitter.email).catch(err =>
        console.warn('[Email Warning]:', err.message)
      );
    }

    return res.status(201).json({
      success: true,
      message: `Societal challenge registered successfully with Ticket ID #${ticketId}. AI classified domain: '${decidedDomain}'`,
      problem: newProblem
    });
  } catch (error) {
    console.error('[Problem Create Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error submitting problem statement'
    });
  }
};

/**
 * @desc    Get all problems submitted by currently authenticated user
 * @route   GET /api/problems/user/my
 * @access  Private
 */
export const getMyProblems = async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;
    const userPhone = req.user.phone;

    const queryConditions = [
      { user: userId },
      { 'submitter.userId': userId }
    ];
    if (userEmail) {
      queryConditions.push({ 'submitter.email': userEmail });
    }
    if (userPhone) {
      queryConditions.push({ 'submitter.phone': userPhone });
    }

    const problems = await Problem.find({ $or: queryConditions }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: problems.length,
      problems
    });
  } catch (error) {
    console.error('[Get My Problems Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching your submitted problems'
    });
  }
};

/**
 * @desc    Get all problems with filtering, search, and pagination
 * @route   GET /api/problems
 * @access  Public
 */
export const getProblems = async (req, res) => {
  try {
    const { domain, district, status, priority, resolutionStatus, search, sort = 'newest', page = 1, limit = 50 } = req.query;

    const filter = {};

    if (domain && domain !== 'all') {
      filter.domain = domain;
    }
    if (district && district !== 'all') {
      filter['location.district'] = new RegExp(district, 'i');
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (resolutionStatus && resolutionStatus !== 'all') {
      filter.resolutionStatus = resolutionStatus;
    }
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { ticketId: new RegExp(search, 'i') },
        { 'aiAnalysis.tags': new RegExp(search, 'i') }
      ];
    }

    const sortOption = sort === 'oldest' || sort === 'asc' ? { createdAt: 1 } : { createdAt: -1 };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const problems = await Problem.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Problem.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: problems.length,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10)),
      problems
    });
  } catch (error) {
    console.error('[Get Problems Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching problems'
    });
  }
};

/**
 * @desc    Get a single problem statement by ID or Ticket ID
 * @route   GET /api/problems/:id
 * @access  Public
 */
export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { ticketId: id }]
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem statement with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      problem
    });
  } catch (error) {
    console.error('[Get Problem By ID Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching problem details'
    });
  }
};

/**
 * @desc    Government Triage & Smart Institutional Allocation to a University
 * @route   PATCH /api/problems/:id/allocate
 * @access  Private (Government / Admin)
 */
export const triageAndAllocate = async (req, res) => {
  try {
    const { id } = req.params;
    const { universityId, universityName, facultyLead, note, officerName } = req.body;

    if (!universityId || !universityName) {
      return res.status(400).json({
        success: false,
        message: 'University ID and University Name are required for allocation'
      });
    }

    const problem = await Problem.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { ticketId: id }]
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem statement '${id}' not found`
      });
    }

    // Update allocation details
    problem.status = 'allocated';
    problem.allocatedUniversity = {
      universityId,
      name: universityName,
      facultyLead: facultyLead || { name: 'Dr. Faculty Lead', email: 'faculty@institution.ac.in', department: 'Engineering & Innovation' },
      allocatedAt: new Date(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days to submit proposal
    };

    // Append to audit trail
    problem.auditHistory.unshift({
      timestamp: new Date(),
      officer: officerName || req.user?.name || 'Government Nodal Officer',
      role: 'government',
      action: `Institutional Allocation to ${universityName}`,
      note: note || `Routed based on research expertise and faculty specialization in ${problem.domain}`
    });

    await problem.save();

    // Trigger email notification to University Lead
    const university = await University.findOne({ institutionId: universityId });
    if (university?.contactEmail || facultyLead?.email) {
      sendUniversityAllocationEmail(
        problem,
        facultyLead?.email || university?.contactEmail,
        universityName
      ).catch(err => console.warn('[Email Warning]:', err.message));
    }

    return res.status(200).json({
      success: true,
      message: `Problem successfully allocated to ${universityName}`,
      problem
    });
  } catch (error) {
    console.error('[Triage & Allocate Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error allocating problem to university'
    });
  }
};

/**
 * @desc    University Submits Multidisciplinary Solution Proposal
 * @route   POST /api/problems/:id/proposal
 * @access  Private (University / Student Team)
 */
export const submitProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      teamLead,
      facultyAdvisor,
      multidisciplinaryTeam,
      abstract,
      timelineMonths = 6,
      estimatedBudget = 500000,
      techStack = []
    } = req.body;

    if (!title || !teamLead) {
      return res.status(400).json({
        success: false,
        message: 'Proposal title and team lead are required'
      });
    }

    const problem = await Problem.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { ticketId: id }]
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem statement '${id}' not found`
      });
    }

    const proposalId = `PROP-${problem.ticketId}-${Date.now().toString().slice(-4)}`;

    const newProposal = {
      id: proposalId,
      title,
      teamLead,
      facultyAdvisor: facultyAdvisor || problem.allocatedUniversity?.facultyLead?.name || 'Faculty Advisor',
      multidisciplinaryTeam: multidisciplinaryTeam || [
        { name: teamLead, role: 'Lead Innovator', department: 'Primary Engineering', institution: problem.allocatedUniversity?.name || 'HEI' }
      ],
      abstract: abstract || 'Detailed multidisciplinary R&D and hardware/software prototyping proposal.',
      timelineMonths: parseInt(timelineMonths, 10),
      estimatedBudget: parseFloat(estimatedBudget),
      techStack,
      submissionDate: new Date(),
      status: 'approved' // Automatically activated into workflow
    };

    problem.proposals.push(newProposal);
    problem.status = 'in_progress';

    // Generate standard initial milestones if empty
    if (problem.milestones.length === 0) {
      problem.milestones = [
        { id: 'M1', title: 'Multidisciplinary laboratory simulation & design verification', progress: 100, status: 'completed', targetDate: 'Month 1', completionDate: new Date().toLocaleDateString() },
        { id: 'M2', title: 'Hardware-Software MVP prototyping & lab calibration', progress: 50, status: 'in_progress', targetDate: 'Month 3' },
        { id: 'M3', title: 'Field trial pilot deployment at local community site', progress: 0, status: 'pending', targetDate: 'Month 5' },
        { id: 'M4', title: 'Stakeholder validation & measurable social impact assessment', progress: 0, status: 'pending', targetDate: 'Month 6' }
      ];
    }

    problem.auditHistory.unshift({
      timestamp: new Date(),
      officer: teamLead,
      role: 'university',
      action: `Solution Proposal Submitted (${title})`,
      note: `Constituted multidisciplinary team of ${newProposal.multidisciplinaryTeam.length} members with ₹${estimatedBudget} budget`
    });

    await problem.save();

    return res.status(201).json({
      success: true,
      message: 'Multidisciplinary solution proposal successfully registered',
      proposal: newProposal,
      problem
    });
  } catch (error) {
    console.error('[Submit Proposal Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error registering solution proposal'
    });
  }
};

/**
 * @desc    Industry / CSR Partner Pledges Matching Grant & Mentorship
 * @route   POST /api/problems/:id/fund
 * @access  Private (Industry / CSR)
 */
export const pledgeFunding = async (req, res) => {
  try {
    const { id } = req.params;
    const { partnerId, partnerName, partnerType, grantAmount, mentorAssigned } = req.body;

    if (!partnerName || !grantAmount) {
      return res.status(400).json({
        success: false,
        message: 'Partner name and grant amount are required'
      });
    }

    const problem = await Problem.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { ticketId: id }]
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem statement '${id}' not found`
      });
    }

    const newPartner = {
      partnerId: partnerId || `IND-${Date.now()}`,
      name: partnerName,
      type: partnerType || 'CSR Foundation',
      grantAmount: parseFloat(grantAmount),
      status: 'disbursed',
      pledgedAt: new Date(),
      mentorAssigned: mentorAssigned || 'Corporate Technical Mentor',
      csrReference: `CSR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    problem.industryPartners.push(newPartner);

    problem.auditHistory.unshift({
      timestamp: new Date(),
      officer: partnerName,
      role: 'industry',
      action: `CSR Matching Grant ₹${parseFloat(grantAmount).toLocaleString('en-IN')} Disbursed`,
      note: `Assigned technical mentor: ${newPartner.mentorAssigned}`
    });

    await problem.save();

    return res.status(200).json({
      success: true,
      message: `CSR Grant ₹${parseFloat(grantAmount).toLocaleString('en-IN')} successfully pledged & disbursed`,
      problem
    });
  } catch (error) {
    console.error('[Pledge Funding Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error processing industry sponsorship'
    });
  }
};

/**
 * @desc    Update Milestone Progress & Deliverable Verification
 * @route   PATCH /api/problems/:id/milestones/:milestoneId
 * @access  Private (University / Govt / Industry)
 */
export const updateMilestone = async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const { progress, status, deliverableUrl, note } = req.body;

    const problem = await Problem.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { ticketId: id }]
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem statement '${id}' not found`
      });
    }

    const milestone = problem.milestones.find(m => m.id === milestoneId || m._id?.toString() === milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: `Milestone '${milestoneId}' not found in this problem`
      });
    }

    if (progress !== undefined) milestone.progress = Math.min(100, Math.max(0, parseInt(progress, 10)));
    if (status) milestone.status = status;
    if (deliverableUrl) milestone.deliverableUrl = deliverableUrl;
    if (milestone.progress === 100) milestone.completionDate = new Date().toLocaleDateString();

    // Check if all milestones completed to advance status
    const allCompleted = problem.milestones.every(m => m.progress === 100);
    if (allCompleted) {
      problem.status = 'field_testing';
    }

    problem.auditHistory.unshift({
      timestamp: new Date(),
      officer: req.user?.name || 'Project Lead',
      role: req.user?.role || 'university',
      action: `Milestone Progress Updated: ${milestone.title} (${milestone.progress}%)`,
      note: note || `Status set to ${milestone.status}`
    });

    await problem.save();

    return res.status(200).json({
      success: true,
      message: 'Milestone progress updated successfully',
      problem
    });
  } catch (error) {
    console.error('[Update Milestone Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating milestone progress'
    });
  }
};

/**
 * @desc    Final Solution Validation & Social Impact Certification
 * @route   PATCH /api/problems/:id/validate
 * @access  Private (Government / Admin)
 */
export const validateSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { beneficiariesReached, economicSavingsInr, metricName, metricValue, officerName } = req.body;

    const problem = await Problem.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { ticketId: id }]
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem statement '${id}' not found`
      });
    }

    problem.status = 'validated';
    problem.socialImpact = {
      beneficiariesReached: beneficiariesReached || problem.socialImpact?.beneficiariesReached || 10000,
      economicSavingsInr: economicSavingsInr || problem.socialImpact?.economicSavingsInr || 2000000,
      metricName: metricName || problem.socialImpact?.metricName || 'Lives Positively Impacted',
      metricValue: metricValue || problem.socialImpact?.metricValue || '10,000+',
      carbonReductionTons: problem.socialImpact?.carbonReductionTons || 25,
      sdgGoals: problem.socialImpact?.sdgGoals || [1, 3, 6, 9]
    };

    problem.auditHistory.unshift({
      timestamp: new Date(),
      officer: officerName || req.user?.name || 'State Validation Committee',
      role: 'government',
      action: 'Solution Certified & Deployed for Statewide Scaling',
      note: `Verified measurable social outcome: ${problem.socialImpact.metricValue} ${problem.socialImpact.metricName}`
    });

    await problem.save();

    return res.status(200).json({
      success: true,
      message: 'Solution officially validated and certified for statewide scaling',
      problem
    });
  } catch (error) {
    console.error('[Validate Solution Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error validating solution'
    });
  }
};

/**
 * @desc    Get all problem hotspots with GPS coordinates for React Map rendering
 * @route   GET /api/problems/map/locations
 * @access  Public
 */
export const getMapLocations = async (req, res) => {
  try {
    const { domain, severity, district } = req.query;
    const filter = {};
    if (domain && domain !== 'all') filter.domain = domain;
    if (severity) filter.priority = severity;
    if (district) filter['location.district'] = new RegExp(district, 'i');

    const problems = await Problem.find(filter)
      .select('ticketId title domain priority status location evidence aiAnalysis allocatedUniversity proposals industryPartners')
      .lean();

    const hotspots = problems.map((p) => ({
      id: p._id,
      ticketId: p.ticketId,
      title: p.title,
      domain: p.domain,
      severity: p.priority || p.aiAnalysis?.urgency || 'High',
      status: p.status,
      coordinates: {
        lat: p.location?.lat || 23.3441,
        lng: p.location?.lng || 85.3096
      },
      location: {
        district: p.location?.district || 'Ranchi',
        block: p.location?.block || '',
        panchayat: p.location?.panchayat || '',
        address: p.location?.address || ''
      },
      evidenceUrl: p.evidence?.[0]?.url || '',
      allocatedHei: p.allocatedUniversity?.name || '',
      csrPartner: p.industryPartners?.[0]?.name || ''
    }));

    return res.status(200).json({
      success: true,
      count: hotspots.length,
      hotspots
    });
  } catch (error) {
    console.error('[Map Locations Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching map coordinates'
    });
  }
};

/**
 * @desc    Get problems near a specific GPS coordinate
 * @route   GET /api/problems/geo/nearby
 * @access  Public
 */
export const getNearbyProblems = async (req, res) => {
  try {
    const { lat, lng, radiusKm = 50 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude (lat) and Longitude (lng) are required'
      });
    }

    const maxDistanceMeters = parseFloat(radiusKm) * 1000;
    const problems = await Problem.find({
      'location.geoPoint': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: maxDistanceMeters
        }
      }
    }).limit(20);

    return res.status(200).json({
      success: true,
      count: problems.length,
      problems
    });
  } catch (error) {
    console.error('[Geo Nearby Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error querying nearby coordinates'
    });
  }
};

/**
 * @desc    Government reviews and sanctions a tripartite partnership proposal
 * @route   PATCH /api/problems/proposals/:proposalId/govt-approve
 * @access  Private (Government / Admin)
 */
export const approveTripartiteProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { action = 'approve', remarks = '', sanctionOrderNumber = '' } = req.body;

    const ProposalModel = (await import('../models/Proposal.js')).default;
    const proposal = await ProposalModel.findById(proposalId)
      .populate('problem')
      .populate('university')
      .populate('industryOffer.industry');

    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const problem = await Problem.findById(proposal.problem._id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Associated problem not found' });
    }

    if (action === 'approve') {
      const generatedSanction = sanctionOrderNumber || `JH-SANCTION-${Date.now().toString().slice(-6)}`;
      proposal.status = 'approved_by_govt';
      proposal.govtApproval = {
        approvedBy: req.user?._id || null,
        status: 'approved',
        remarks: remarks || 'Tripartite Project sanctioned and approved by Government Authority.',
        sanctionOrderNumber: generatedSanction,
        approvedAt: new Date()
      };
      await proposal.save();

      // Update Problem status & allocation
      problem.status = 'in_progress';
      if (proposal.university) {
        problem.allocatedUniversity = {
          universityId: proposal.university._id.toString(),
          name: proposal.university.name,
          facultyLead: proposal.facultyMembers?.[0] || { name: 'Lead PI' }
        };
      }
      if (proposal.industryOffer?.industry) {
        const ind = proposal.industryOffer.industry;
        problem.industryPartners = [
          {
            partnerId: ind._id.toString(),
            name: ind.name,
            grantAmount: proposal.industryOffer.fundingAmount || 500000,
            mentorName: proposal.industryOffer.mentorName || 'Corporate Mentor',
            committedResources: proposal.industryOffer.equipmentProvided || []
          }
        ];
      }

      // Initialize milestones if empty
      if (!problem.milestones || problem.milestones.length === 0) {
        problem.milestones = [
          { id: 'M1', title: 'Multidisciplinary laboratory simulation & design verification', progress: 100, status: 'completed', targetDate: 'Month 1', completionDate: new Date().toLocaleDateString() },
          { id: 'M2', title: 'Hardware-Software MVP prototyping & lab calibration', progress: 50, status: 'in_progress', targetDate: 'Month 3' },
          { id: 'M3', title: 'Field trial pilot deployment at local community site', progress: 0, status: 'pending', targetDate: 'Month 5' },
          { id: 'M4', title: 'Stakeholder validation & measurable social impact assessment', progress: 0, status: 'pending', targetDate: 'Month 6' }
        ];
      }

      // Append to Problem Timeline and Audit History for Citizen visibility
      if (!Array.isArray(problem.timeline)) problem.timeline = [];
      if (!Array.isArray(problem.auditHistory)) problem.auditHistory = [];

      const sanctionEntry = {
        timestamp: new Date(),
        officer: req.user?.name || 'Govt Secretary / Triage Officer',
        role: 'government',
        action: 'Tripartite Partnership Sanctioned by Government',
        note: `Government approved research implementation by ${proposal.university?.name || 'HEI'} with CSR co-sponsorship from ${proposal.industryOffer?.industry?.name || 'Industry Sponsor'} (Sanction: ${generatedSanction}).`
      };

      problem.timeline.push(sanctionEntry);
      problem.auditHistory.unshift(sanctionEntry);

      await problem.save();

      // Notify University
      if (proposal.university) {
        const UniversityModel = (await import('../models/University.js')).default;
        await UniversityModel.findByIdAndUpdate(proposal.university._id, {
          $push: {
            notifications: {
              $each: [{
                proposalId: proposal._id,
                problemId: problem._id,
                title: `Project Sanction Approved by Government! (#${problem.ticketId})`,
                message: `Government has approved and sanctioned the tripartite project with ${proposal.industryOffer?.industry?.name || 'Industry Sponsor'}. Implementation is now active.`,
                domain: problem.domain,
                read: false,
                createdAt: new Date()
              }],
              $position: 0
            }
          }
        });
      }

      // Notify Industry
      if (proposal.industryOffer?.industry) {
        const IndustryModel = (await import('../models/IndustryPartner.js')).default;
        await IndustryModel.findByIdAndUpdate(proposal.industryOffer.industry._id, {
          $push: {
            notifications: {
              $each: [{
                proposalId: proposal._id,
                problemId: problem._id,
                title: `Govt Sanction Order Issued for Co-Sponsorship (#${problem.ticketId})`,
                message: `Tripartite project with ${proposal.university?.name || 'University'} has been sanctioned by Government under Section 135 CSR mandate.`,
                domain: problem.domain,
                read: false,
                createdAt: new Date()
              }],
              $position: 0
            }
          }
        });
      }

      // Notify Submitter Citizen
      if (problem.user) {
        const UserModel = (await import('../models/User.js')).default;
        await UserModel.findByIdAndUpdate(problem.user, {
          $push: {
            notifications: {
              $each: [{
                title: `Your Challenge is Now In Progress! (#${problem.ticketId})`,
                message: `Your challenge '${problem.title}' has been matched with ${proposal.university?.name || 'University'} and co-sponsored by ${proposal.industryOffer?.industry?.name || 'Industry Partner'}.`,
                ticketId: problem.ticketId,
                type: 'status_update',
                read: false,
                createdAt: new Date()
              }],
              $position: 0
            }
          }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Tripartite project approved and sanctioned by Government!',
        problem,
        proposal
      });
    } else {
      proposal.status = 'rejected_by_govt';
      proposal.govtApproval = {
        approvedBy: req.user?._id || null,
        status: 'rejected',
        remarks: remarks || 'Declined by Government Review Committee',
        approvedAt: new Date()
      };
      await proposal.save();

      // Append to Problem timeline and auditHistory
      if (!Array.isArray(problem.timeline)) problem.timeline = [];
      if (!Array.isArray(problem.auditHistory)) problem.auditHistory = [];

      const declineEntry = {
        timestamp: new Date(),
        officer: req.user?.name || 'Govt Secretary / Review Committee',
        role: 'government',
        action: 'Tripartite Proposal Declined by Government',
        note: `Government review committee declined the proposal from ${proposal.university?.name || 'HEI'}. Remarks: ${remarks || 'Review committee decision'}`
      };

      problem.timeline.push(declineEntry);
      problem.auditHistory.unshift(declineEntry);

      await problem.save();

      // Notify University
      if (proposal.university) {
        const UniversityModel = (await import('../models/University.js')).default;
        await UniversityModel.findByIdAndUpdate(proposal.university._id, {
          $push: {
            notifications: {
              $each: [{
                proposalId: proposal._id,
                problemId: problem._id,
                title: `Proposal Review Decision: Declined (#${problem.ticketId})`,
                message: `Government has declined the tripartite proposal for '${problem.title}'. Reason: ${remarks || 'Administrative review committee decision'}`,
                domain: problem.domain,
                read: false,
                createdAt: new Date()
              }],
              $position: 0
            }
          }
        });
      }

      // Notify Industry
      if (proposal.industryOffer?.industry) {
        const IndustryModel = (await import('../models/IndustryPartner.js')).default;
        await IndustryModel.findByIdAndUpdate(proposal.industryOffer.industry._id, {
          $push: {
            notifications: {
              $each: [{
                proposalId: proposal._id,
                problemId: problem._id,
                title: `Govt Sanction Update: Proposal Declined (#${problem.ticketId})`,
                message: `Government has declined the tripartite project proposal for challenge #${problem.ticketId}. Reason: ${remarks || 'Administrative review committee decision'}`,
                domain: problem.domain,
                read: false,
                createdAt: new Date()
              }],
              $position: 0
            }
          }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Proposal declined by Government',
        proposal
      });
    }
  } catch (error) {
    console.error('[Approve Tripartite Proposal Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error approving proposal'
    });
  }
};

/**
 * @desc    Get all tripartite proposals forwarded for Government sanction
 * @route   GET /api/problems/proposals/tripartite-packages
 * @access  Private (Government / Admin)
 */
export const getTripartiteProposalsForGovt = async (req, res) => {
  try {
    const ProposalModel = (await import('../models/Proposal.js')).default;
    const proposals = await ProposalModel.find()
      .populate({
        path: 'problem',
        select: 'ticketId title description domain location evidence status priority resolutionStatus timeline submitter createdAt'
      })
      .populate({
        path: 'university',
        select: 'name shortName location type contactEmail availableDomains academicDisciplines facultySpecializations facultyMembers'
      })
      .populate({
        path: 'industryOffer.industry',
        select: 'name type hqLocation contactEmail availableDomains supportCapabilities csrAnnualBudgetInr leadMentors'
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: proposals.length,
      proposals
    });
  } catch (error) {
    console.error('[Get Tripartite Proposals For Govt Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching tripartite proposals'
    });
  }
};

export default {
  createProblem,
  getProblems,
  getProblemById,
  triageAndAllocate,
  submitProposal,
  pledgeFunding,
  updateMilestone,
  validateSolution,
  getMapLocations,
  getNearbyProblems,
  approveTripartiteProposal,
  getTripartiteProposalsForGovt
};
