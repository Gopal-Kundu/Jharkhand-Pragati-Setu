import Problem from '../models/Problem.js';
import University from '../models/University.js';
import IndustryPartner from '../models/IndustryPartner.js';
import Proposal from '../models/Proposal.js';
import { MASTER_DEPARTMENTS_CATALOG, MASTER_DISTRICTS_CATALOG } from '../data/masterCatalog.js';

/**
 * @desc    Get Comprehensive Government Analytics & Dashboard Telemetry
 * @route   GET /api/analytics
 * @access  Public / Authenticated
 */
export const getAnalytics = async (req, res) => {
  try {
    const problems = await Problem.find({});
    const universities = await University.find({});
    const industryPartners = await IndustryPartner.find({});
    const totalProposalCount = await Proposal.countDocuments({});

    const totalProblems = problems.length;
    const allocatedProblems = problems.filter(p => p.status !== 'submitted' && p.status !== 'ai_triage').length;
    const activeProposals = totalProposalCount;
    const deployedSolutions = problems.filter(p => p.status === 'deployed' || p.status === 'validated').length;

    // Domain breakdown
    const domainCounts = {};
    const domains = [
      'Education',
      'Agriculture',
      'Healthcare',
      'Water Resources',
      'Environment',
      'Energy',
      'Urban Development',
      'Accessibility',
      'Public Administration',
      'Rural Livelihoods',
      'Others'
    ];
    domains.forEach(d => { domainCounts[d] = 0; });
    problems.forEach(p => {
      if (domainCounts[p.domain] !== undefined) {
        domainCounts[p.domain]++;
      }
    });

    // District-wise distribution & GIS map hotspots
    const districtData = {};
    problems.forEach(p => {
      const dist = p.location?.district || 'Ranchi';
      if (!districtData[dist]) {
        districtData[dist] = {
          district: dist,
          count: 0,
          lat: p.location?.lat || 23.3441,
          lng: p.location?.lng || 85.3096,
          activeProjects: 0,
          beneficiaries: 0
        };
      }
      districtData[dist].count++;
      if (['in_progress', 'prototyping', 'field_testing', 'deployed', 'validated'].includes(p.status)) {
        districtData[dist].activeProjects++;
      }
      districtData[dist].beneficiaries += (p.socialImpact?.beneficiariesReached || 0);
    });

    // Financial & CSR Metrics
    let totalCsrPledgedInr = 0;
    let totalCsrDisbursedInr = 0;
    problems.forEach(p => {
      (p.industryPartners || []).forEach(partner => {
        totalCsrPledgedInr += (partner.grantAmount || 0);
        if (partner.status === 'disbursed' || partner.status === 'completed') {
          totalCsrDisbursedInr += (partner.grantAmount || 0);
        }
      });
    });

    // Measurable Social Impact Metrics
    const totalBeneficiaries = problems.reduce((acc, p) => acc + (p.socialImpact?.beneficiariesReached || 0), 0);
    const totalEconomicSavingsInr = problems.reduce((acc, p) => acc + (p.socialImpact?.economicSavingsInr || 0), 0);
    const totalCarbonReductionTons = problems.reduce((acc, p) => acc + (p.socialImpact?.carbonReductionTons || 0), 0);

    // Status Funnel
    const statusFunnel = {
      submitted: problems.filter(p => p.status === 'submitted').length,
      ai_triaged: problems.filter(p => p.status === 'ai_triage').length,
      allocated: problems.filter(p => p.status === 'allocated').length,
      in_progress: problems.filter(p => p.status === 'in_progress' || p.status === 'proposal_submitted').length,
      prototyping: problems.filter(p => p.status === 'prototyping').length,
      field_testing: problems.filter(p => p.status === 'field_testing').length,
      deployed: problems.filter(p => p.status === 'deployed').length,
      validated: problems.filter(p => p.status === 'validated').length
    };

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalProblems,
          allocatedProblems,
          activeProposals,
          deployedSolutions,
          totalUniversities: universities.length > 0 ? universities.length : 5,
          totalIndustryPartners: industryPartners.length > 0 ? industryPartners.length : 4,
          totalCsrPledgedInr,
          totalCsrDisbursedInr,
          totalBeneficiaries,
          totalEconomicSavingsInr,
          totalCarbonReductionTons
        },
        departments: MASTER_DEPARTMENTS_CATALOG,
        districts: MASTER_DISTRICTS_CATALOG,
        domainBreakdown: Object.keys(domainCounts).map(d => ({
          domain: d,
          count: domainCounts[d],
          percentage: totalProblems > 0 ? Math.round((domainCounts[d] / totalProblems) * 100) : 0
        })),
        districtHotspots: Object.values(districtData),
        statusFunnel,
        recentAuditTrail: problems
          .flatMap(p => (p.auditHistory || []).map(a => ({ ...a.toObject ? a.toObject() : a, problemId: p._id, problemTitle: p.title })))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 15)
      }
    });
  } catch (error) {
    console.error('[Analytics Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error generating analytics'
    });
  }
};

export default {
  getAnalytics
};
