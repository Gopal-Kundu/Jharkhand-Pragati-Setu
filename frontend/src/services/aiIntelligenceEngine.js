// AI Problem Domain & Location Deduplication Engine for Jharkhand Pragati Setu

export const CANONICAL_DOMAINS = [
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

const DOMAIN_KEYWORDS = {
  'Water Resources': ['water', 'pond', 'irrigation', 'drinking water', 'well', 'tubewell', 'fluoride', 'arsenic', 'dam', 'handpump', 'jal', 'scarcity', 'drought', 'silt', 'recharge', 'catchment', 'borewell'],
  'Agriculture': ['crop', 'farming', 'farmer', 'irrigation', 'soil', 'yield', 'harvest', 'fertilizer', 'vegetable', 'pesticide', 'cold storage', 'kisan', 'agri', 'horticulture', 'sapling'],
  'Healthcare': ['hospital', 'clinic', 'fluorosis', 'disease', 'doctor', 'medicine', 'health', 'malaria', 'infection', 'child', 'diarrhea', 'patient', 'phc', 'sanitation'],
  'Education': ['school', 'teacher', 'student', 'education', 'classroom', 'digital', 'books', 'stem', 'dropout', 'girls education', 'computer', 'lab', 'vidyalaya'],
  'Energy': ['electricity', 'solar', 'power', 'grid', 'biomass', 'outage', 'light', 'clean energy', 'battery', 'microgrid', 'fuel'],
  'Environment': ['forest', 'pollution', 'weed', 'wildfire', 'mine', 'waste', 'reforestation', 'climate', 'river', 'carbon', 'smoke', 'air'],
  'Urban Development': ['drainage', 'sewage', 'traffic', 'road', 'pothole', 'city', 'urban', 'street', 'housing', 'slum', 'transport'],
  'Accessibility': ['blind', 'deaf', 'disability', 'disabled', 'wheelchair', 'ramp', 'accessibility', 'elderly', 'hearing'],
  'Public Administration': ['panchayat', 'ration', 'scheme', 'pension', 'corruption', 'govt', 'block office', 'certificate', 'bribe', 'aadhaar'],
  'Rural Livelihoods': ['village', 'livelihood', 'shg', 'tribal', 'employment', 'artisan', 'tussar', 'silk', 'mahua', 'handicraft', 'women group']
};

export function analyzeProblemSubmission(submission, existingProblems = []) {
  const fullText = `${submission.title || ''} ${submission.narrative || submission.description || ''}`.toLowerCase();
  
  // 1. Domain Classification
  const domainScores = {};
  Object.keys(DOMAIN_KEYWORDS).forEach(domain => {
    let score = 0;
    DOMAIN_KEYWORDS[domain].forEach(kw => {
      if (fullText.includes(kw)) score += 1;
    });
    if (score > 0) domainScores[domain] = score;
  });

  const sortedDomains = Object.entries(domainScores).sort((a, b) => b[1] - a[1]);
  const primaryDomain = sortedDomains.length > 0 ? sortedDomains[0][0] : 'Others';

  // 2. Locality Deduplication Check
  const subDistrict = (submission.districtName || submission.district || '').toLowerCase();
  const subBlock = (submission.block || '').toLowerCase();
  const subTitle = (submission.title || '').trim().toLowerCase();

  const matchedProblem = existingProblems.find(p => {
    const pDist = (p.location?.district || p.district || '').toLowerCase();
    const pBlock = (p.location?.block || p.block || '').toLowerCase();
    const pTitle = (p.title || '').trim().toLowerCase();

    const isSameLocality = pDist && subDistrict && pDist === subDistrict && (!subBlock || !pBlock || pBlock === subBlock);
    if (!isSameLocality) return false;

    if (pTitle && subTitle && (pTitle === subTitle || pTitle.includes(subTitle) || subTitle.includes(pTitle))) {
      return true;
    }
    return false;
  });

  return {
    domain: primaryDomain,
    isDuplicate: Boolean(matchedProblem),
    duplicateTicketId: matchedProblem?.ticketId || matchedProblem?.id || null,
    duplicateReason: matchedProblem ? `Matching problem statement already reported in ${submission.districtName || 'this locality'}` : ''
  };
}

export function queryAIAssistant(prompt, role, state) {
  const lower = prompt.toLowerCase();

  if (lower.includes('submit') || lower.includes('problem') || lower.includes('citizen')) {
    return {
      reply: `**How to Submit a Grassroots Challenge:**\n\n1. Click **Submit Challenge** on your dashboard.\n2. Describe the problem in your local language or words.\n3. Upload photo/video/document evidence.\n4. Pinpoint the exact district & block location.\n5. Our AI assigns the domain and checks for duplicates in your locality.`,
      actionType: 'navigate',
      targetView: 'citizen_track'
    };
  }

  return {
    reply: `Namaste! I am **Sangi (संगी)**, your Jharkhand Innovation Copilot. Ask me about ongoing problems, tracking your ticket, or university innovation proposals in your district.`,
    actionType: 'help'
  };
}

export default {
  CANONICAL_DOMAINS,
  analyzeProblemSubmission,
  queryAIAssistant
};
