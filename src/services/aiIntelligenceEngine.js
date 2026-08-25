// AI Problem Intelligence & Matching Engine for Jharkhand Pragati Setu
import { HEI_INSTITUTIONS, INDUSTRY_PARTNERS } from '../data/mockGraphData';

const DOMAIN_KEYWORDS = {
  'Water Resources': ['water', 'pond', 'irrigation', 'drinking water', 'well', 'tubewell', 'fluoride', 'arsenic', 'dam', 'handpump', 'jal', 'scarcity', 'drought', 'silt', 'recharge', 'catchment'],
  'Agriculture': ['crop', 'farming', 'farmer', 'irrigation', 'soil', 'yield', 'harvest', 'fertilizer', 'vegetable', 'mahua', 'pesticide', 'cold storage', 'kisan', 'agri', 'horticulture', 'sapling'],
  'Healthcare': ['hospital', 'clinic', 'fluorosis', 'disease', 'doctor', 'medicine', 'health', 'malaria', 'infection', 'child', 'diarrhea', 'patient', 'phc', 'sanitation', 'drinking water'],
  'Education': ['school', 'teacher', 'student', 'education', 'classroom', 'digital', 'books', 'stem', 'dropout', 'girls education', 'computer', 'lab', 'vidyalaya'],
  'Energy': ['electricity', 'solar', 'power', 'grid', 'biomass', 'outage', 'light', 'clean energy', 'battery', 'microgrid', 'fuel'],
  'Environment': ['forest', 'pollution', 'weed', 'lantana', 'wildfire', 'mine', 'waste', 'reforestation', 'climate', 'river', 'carbon'],
  'Rural Development': ['village', 'panchayat', 'road', 'livelihood', 'shg', 'tribal', 'employment', 'bridge', 'market', 'infrastructure'],
  'Digital Governance': ['internet', 'connectivity', 'portal', 'csc', 'network', 'telecom', 'mobile', 'offline']
};

export function analyzeProblemSubmission(submission, existingClusters = []) {
  const fullText = `${submission.title || ''} ${submission.narrative || ''} ${submission.impact || ''}`.toLowerCase();
  
  // 1. Multi-label Domain Classification
  const domainScores = {};
  Object.keys(DOMAIN_KEYWORDS).forEach(domain => {
    let score = 0;
    DOMAIN_KEYWORDS[domain].forEach(kw => {
      if (fullText.includes(kw)) score += 1;
    });
    if (score > 0) domainScores[domain] = score;
  });

  const sortedDomains = Object.entries(domainScores).sort((a, b) => b[1] - a[1]);
  const primaryDomain = sortedDomains.length > 0 ? sortedDomains[0][0] : 'Rural Development';
  const secondaryDomains = sortedDomains.slice(1, 3).map(d => d[0]);

  // 2. Structured Extraction (Separating Citizen Observation from AI Inferred Causes)
  const isWater = primaryDomain === 'Water Resources' || fullText.includes('water') || fullText.includes('pond');
  const isAgri = primaryDomain === 'Agriculture' || fullText.includes('crop') || fullText.includes('storage');
  const isHealth = primaryDomain === 'Healthcare' || fullText.includes('fluoride') || fullText.includes('health');

  let rootProblem = '';
  let requiredDisciplines = [];
  let constraints = [];
  let aiInferredCauses = '';

  if (isWater) {
    rootProblem = 'Hydrological depletion, lack of automated sluice retention, and seasonal siltation restricting groundwater aquifer recharge.';
    aiInferredCauses = 'Rapid surface runoff loss due to degraded catchment bunds + absence of low-cost water level telemetry.';
    requiredDisciplines = ['Civil & Water Resources Engineering', 'IoT & Embedded Sensors', 'Environmental Science', 'Hydrology'];
    constraints = ['No reliable grid power at rural pond site (requires Solar/Battery)', 'Must be operable by Gram Panchayat VWSC'];
  } else if (isAgri) {
    rootProblem = 'Inadequate localized post-harvest thermal preservation and micro-irrigation infrastructure causing distress sale and spoilage.';
    aiInferredCauses = 'Absence of off-grid decentralized cold storage and direct farm-gate primary processing.';
    requiredDisciplines = ['Horticultural Engineering', 'Renewable Energy / Solar Thermal', 'Agri-economics', 'Embedded Systems'];
    constraints = ['Requires 18-hour thermal buffer for power cuts', 'Affordable maintenance for Women SHG Federations'];
  } else if (isHealth) {
    rootProblem = 'Geogenic mineral contamination (fluoride/arsenic) in deep groundwater aquifers exceeding WHO safety benchmarks.';
    aiInferredCauses = 'Deep unmonitored borehole drilling into granitic bedrock without decentralized adsorption filtration units.';
    requiredDisciplines = ['Chemical Engineering', 'Public Health Diagnostics', 'Materials Science', 'Environmental Geochemistry'];
    constraints = ['Zero hazardous chemical byproduct handling on site', 'Recurring operational cost < ₹0.05 / Liter'];
  } else {
    rootProblem = `Infrastructure and technological intervention needed for ${primaryDomain.toLowerCase()} in rural Jharkhand cluster.`;
    aiInferredCauses = 'Localized resource bottleneck combined with lack of rural-appropriate hardware and digital systems.';
    requiredDisciplines = ['Applied Engineering', 'Data Science & IoT', 'Rural Sociology', 'Domain Specialist'];
    constraints = ['Localized language support (Hindi/Tribal languages)', 'Low upfront CapEx'];
  }

  // 3. Deduplication and Clustering Check
  const duplicates = existingClusters.map(cluster => {
    let similarity = 0;
    if (cluster.district === submission.district) similarity += 0.35;
    if (cluster.block && submission.block && cluster.block.toLowerCase() === submission.block.toLowerCase()) similarity += 0.30;
    if (cluster.primaryDomain === primaryDomain) similarity += 0.25;
    
    // Keyword match
    const clusterText = `${cluster.title} ${cluster.aiIntelligence?.rootProblem || ''}`.toLowerCase();
    const commonWords = ['water', 'pond', 'storage', 'crop', 'fluoride', 'electricity', 'school', 'weed'];
    commonWords.forEach(w => {
      if (fullText.includes(w) && clusterText.includes(w)) similarity += 0.10;
    });

    return {
      clusterId: cluster.id,
      title: cluster.title,
      similarity: Math.min(0.98, similarity),
      district: cluster.districtName
    };
  }).filter(d => d.similarity >= 0.50).sort((a, b) => b.similarity - a.similarity);

  // 4. Prioritization Scoring
  const popAffected = Number(submission.affectedPopulation) || 2500;
  const popScore = Math.min(30, Math.round((popAffected / 5000) * 30));
  const urgencyWeight = submission.urgency === 'High' ? 24 : submission.urgency === 'Critical' ? 25 : 18;
  const duplicateWeight = duplicates.length > 0 ? 18 : 12;
  const sdgWeight = 14;
  const feasScore = 8;
  const prioritizationScore = Math.min(98, popScore + urgencyWeight + duplicateWeight + sdgWeight + feasScore);

  // 5. University Capability Matching
  const universityMatches = HEI_INSTITUTIONS.map(hei => {
    let score = 60;
    const heiCaps = hei.capabilities.join(' ').toLowerCase();
    
    requiredDisciplines.forEach(disc => {
      const parts = disc.toLowerCase().split(' ');
      parts.forEach(p => {
        if (p.length > 3 && heiCaps.includes(p)) score += 6;
      });
    });

    if (hei.district === submission.district) score += 8; // Geographic proximity bonus

    const finalScore = Math.min(97, Math.max(65, score));
    return {
      heiId: hei.id,
      name: hei.name,
      shortName: hei.shortName,
      matchScore: finalScore,
      matchRationale: [
        `Aligned departments in ${hei.capabilities.slice(0, 2).join(', ')}`,
        `Equipped research labs: ${hei.labs[0] || 'State Research Center'}`,
        `Proximity to ${submission.districtName || 'project site'} (${hei.location})`,
        `Historical innovation track record: ${hei.pastSuccessRate}`
      ]
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  // 6. Industry Partner Recommendations
  const industryMatches = INDUSTRY_PARTNERS.map(partner => {
    let fitScore = 70;
    const focusStr = partner.focusAreas.join(' ').toLowerCase();
    if (focusStr.includes(primaryDomain.toLowerCase()) || focusStr.includes('water') && isWater) fitScore += 20;
    return {
      partnerId: partner.id,
      name: partner.name,
      shortName: partner.shortName,
      fitScore: Math.min(95, fitScore),
      focusAreas: partner.focusAreas,
      pledgeCapacity: partner.pledgeCapacity,
      offeredResources: partner.offeredResources
    };
  }).sort((a, b) => b.fitScore - a.fitScore);

  return {
    primaryDomain,
    secondaryDomains,
    confidence: 0.94,
    rootProblem,
    symptoms: [
      submission.urgency ? `Reported as ${submission.urgency} urgency` : 'Immediate community livelihood risk',
      `${popAffected.toLocaleString()} citizens directly affected across locality`,
      'Critical seasonal impact requiring multidisciplinary technological intervention'
    ],
    citizenObserved: submission.narrative || 'Citizen reported societal constraint.',
    aiInferredCauses,
    requiredDisciplines,
    constraints,
    prioritizationScore,
    prioritizationFactors: {
      affectedPopulation: { score: popScore, max: 30, note: `${popAffected} population affected` },
      severityUrgency: { score: urgencyWeight, max: 25, note: `${submission.urgency || 'High'} urgency level` },
      duplicateReportWeight: { score: duplicateWeight, max: 20, note: duplicates.length > 0 ? `${duplicates.length} duplicate/related reports detected` : 'First-instance verified challenge' },
      sdgGovPriority: { score: sdgWeight, max: 15, note: 'State Vision 2030 & Aspirational District Priority' },
      feasibilityValue: { score: feasScore, max: 10, note: 'High turnaround viability through HEI engineering' }
    },
    duplicatesFound: duplicates,
    universityMatches,
    industryMatches
  };
}

export function queryAIAssistant(prompt, role, state) {
  const lower = prompt.toLowerCase();
  const clusters = state.problemClusters || [];
  const projects = state.projects || [];
  const heis = HEI_INSTITUTIONS;
  const industries = INDUSTRY_PARTNERS;

  // RBAC Filtered Responses
  if (role === 'citizen' || role === 'community') {
    if (lower.includes('water') || lower.includes('pond') || lower.includes('1042')) {
      return {
        reply: `Here is the live status for the **Torpa Village Pond Water Crisis (#JH-WTR-1042)**:\n\n` +
               `• **Status:** Active Community Pilot (Stage 5 of 6)\n` +
               `• **Leading University:** BIT Mesra (Centre for Water & IoT)\n` +
               `• **Industry Partner:** Tata Steel Foundation (Providing solar sluice gates & ₹12.5L grant)\n` +
               `• **Latest Progress:** 2 solar hydro-buoys and smart sluice valves have been deployed at Dormba pond. Over 2,400 villagers currently have assured drinking & irrigation supply!`,
        actionType: 'open_cluster',
        targetId: 'JH-WTR-1042'
      };
    }
    if (lower.includes('my') || lower.includes('track') || lower.includes('status')) {
      return {
        reply: `You can track any societal problem using your unique Problem ID (e.g. **JH-WTR-1042**) or phone number. Every submission is analyzed by AI within 3 minutes, verified by the local Panchayat, and matched with top Jharkhand university researchers.`,
        actionType: 'navigate',
        targetView: 'citizen_track'
      };
    }
    return {
      reply: `Namaste! I am **Sangi (संगी)**, your Jharkhand Innovation Copilot. You can ask me:\n• "What happened to the Torpa pond water problem?"\n• "How do I report a school or drinking water problem?"\n• "Has anyone reported water shortages in Khunti before?"`,
      actionType: 'help'
    };
  }

  if (role === 'government') {
    if (lower.includes('high priority') || lower.includes('water') || lower.includes('ranchi') || lower.includes('khunti')) {
      const highWater = clusters.filter(c => c.primaryDomain === 'Water Resources' || c.severity === 'High' || c.severity === 'Critical');
      return {
        reply: `**High-Priority Water & Health Challenges in South Chotanagpur / Palamu:**\n\n` +
               highWater.map(c => `1. **${c.id}** (${c.districtName}): *${c.title}* — Priority Score: **${c.aiIntelligence?.prioritizationScore || 85}/100** (Stage: ${c.status})`).join('\n') +
               `\n\n*Action available:* You can override priority scores, merge duplicate clusters, or approve institutional budget allocations from the Triage Command Center.`,
        actionType: 'navigate',
        targetView: 'gov_triage'
      };
    }
    if (lower.includes('district') || lower.includes('unresolved') || lower.includes('compare')) {
      return {
        reply: `**District-wise Intelligence Summary:**\n• **Highest Problem Density:** Ranchi (42), Dhanbad (36), East Singhbhum (31), Khunti (28).\n• **Critical Water/Health Hotspots:** Khunti (Torpa Pond Depletion) & Palamu (Fluorosis Tubewells).\n• **Average Validation Time:** 1.8 days (Reduced by 64% using AI deduplication).\n• **Total CSR & Govt Funds Mobilized:** ₹27.0 Crores across 24 districts.`,
        actionType: 'navigate',
        targetView: 'gov_analytics'
      };
    }
    return {
      reply: `Government Command AI ready. You can query district heatmaps, prioritize incoming challenges, review multi-university proposals, and monitor measurable social impact metrics.`,
      actionType: 'info'
    };
  }

  if (role === 'university') {
    if (lower.includes('iot') || lower.includes('agriculture') || lower.includes('water') || lower.includes('faculty')) {
      return {
        reply: `**AI Recommended Challenges for HEI Research & Prototyping:**\n\n` +
               `1. **#JH-WTR-1042 (Khunti):** IoT Hydro-Telemetry & Automated Sluice Gates (Match: 94% with BIT Mesra IoT & Civil Depts).\n` +
               `2. **#JH-AGR-2088 (Gumla):** Phase-Change Solar Micro Cold Storage (Match: 96% with BAU Kanke Agronomy & Post-Harvest Dept).\n` +
               `3. **#JH-HLT-3104 (Palamu):** Bio-Composite Fluoride Adsorption Filters (Match: 97% with IIT ISM Water CoE).\n\n` +
               `*Team Builder:* You can invite faculty from Civil, IoT, Agronomy, and Student Researchers to assemble multidisciplinary project teams directly in your workspace.`,
        actionType: 'navigate',
        targetView: 'uni_challenges'
      };
    }
    return {
      reply: `University Workspace AI active. I can match societal problem statements to your university laboratories, faculty expertise profiles, and help assemble multidisciplinary proposal teams.`,
      actionType: 'info'
    };
  }

  if (role === 'industry') {
    if (lower.includes('csr') || lower.includes('iot') || lower.includes('hardware') || lower.includes('fund')) {
      return {
        reply: `**High-Impact Projects Seeking Industry / CSR Co-Creation:**\n\n` +
               `1. **PRJ-JH-2026-004 (Torpa Water Telemetry):** Co-partnered with Tata Steel CSR & JalDrishti IoT. Seeking additional solar battery packs for 14 panchayat scale-up.\n` +
               `2. **PRJ-JH-2026-009 (Gumla Solar Cold Pod):** Adani Renewables pledged ₹8.0L. Seeking modular refrigeration compressor fabrication partner.\n` +
               `3. **PRJ-JH-2026-012 (Palamu Clean Water ATM):** CCL CSR joined with ₹7.0L grant. Field filtration testbed active.\n\n` +
               `*CSR Benefit:* 100% Tax Exemption eligible under Section 135 & verified digital social impact certificates issued by Govt of Jharkhand.`,
        actionType: 'navigate',
        targetView: 'ind_projects'
      };
    }
    return {
      reply: `Industry & CSR Hub AI online. Discover active university research projects that match your ESG/CSR mandates and technical manufacturing capabilities.`,
      actionType: 'info'
    };
  }

  // Public
  return {
    reply: `Welcome to the **Jharkhand Pragati Setu Public Innovation Discovery Portal**. Over 108,000 citizens in 24 districts have been positively impacted through 38 university-industry deployable societal solutions!`,
    actionType: 'info'
  };
}
