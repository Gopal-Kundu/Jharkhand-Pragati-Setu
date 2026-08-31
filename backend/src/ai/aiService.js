import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const configuredModelName = process.env.GEMINI_MODEL;

/**
 * Helper to get generative model
 */
const getGenerativeModel = () => {
  return genAI.getGenerativeModel({ model: configuredModelName });
};

/**
 * Deterministic Fallback Domain Classifier based on keywords
 */
export const fallbackClassify = (title = '', description = '') => {
  const text = `${title} ${description}`.toLowerCase();

  if (/water|fluoride|arsenic|jal|handpump|drinking|irrigation|well|dam|river|pond|tank|drought|borewell/i.test(text)) {
    return 'Water Resources';
  }
  if (/crop|soil|farmer|agriculture|kisan|seed|pesticide|fertilizer|harvest|yield|cold storage/i.test(text)) {
    return 'Agriculture';
  }
  if (/health|doctor|hospital|medicine|disease|malaria|clinic|maternal|patient|phc|sanitation|vaccine/i.test(text)) {
    return 'Healthcare';
  }
  if (/school|teacher|student|education|classroom|study|college|literacy|book|exam/i.test(text)) {
    return 'Education';
  }
  if (/pollution|forest|mine|fire|air|smoke|waste|garbage|ecology|conservation|landslide/i.test(text)) {
    return 'Environment';
  }
  if (/solar|power|electricity|grid|microgrid|light|voltage|blackout|transformer|energy|battery/i.test(text)) {
    return 'Energy';
  }
  if (/drainage|sewage|traffic|road|pothole|city|urban|street|housing|slum|transport/i.test(text)) {
    return 'Urban Development';
  }
  if (/blind|deaf|disability|disabled|wheelchair|ramp|accessibility|elderly|hearing/i.test(text)) {
    return 'Accessibility';
  }
  if (/panchayat|ration|scheme|pension|corruption|govt|block office|certificate|brib|aadhaar/i.test(text)) {
    return 'Public Administration';
  }
  if (/livelihood|tribal|artisan|handicraft|silk|tussar|mahua|shg|women group|forest produce|weaver/i.test(text)) {
    return 'Rural Livelihoods';
  }
  return 'Others';
};

/**
 * AI Domain Assignment: Assigns exactly one canonical domain to the problem statement
 * 
 * @param {string} title - Problem title
 * @param {string} description - Problem narrative
 * @param {Object} location - Geographical location details
 * @returns {Promise<{ domain: string }>}
 */
export const analyzeAndClassifyProblem = async (title, description, location = {}) => {
  const defaultFallbackDomain = fallbackClassify(title, description);

  try {
    const model = getGenerativeModel();
    if (!model) {
      return { domain: defaultFallbackDomain };
    }

    const prompt = `
You are the AI Domain Classification Engine for the Jharkhand State Societal Problem Registry.
Analyze the following grassroots societal problem statement:

Location: District: ${location.district || 'Ranchi'}, Block: ${location.block || 'Sadar'}, Panchayat/Village: ${location.panchayat || ''}
Title: "${title}"
Description: "${description}"

TASK:
Classify this problem into EXACTLY ONE of the following canonical domains:
${CANONICAL_DOMAINS.map(d => `- "${d}"`).join('\n')}

Return ONLY a valid, parseable JSON object with NO markdown ticks or other text:
{
  "domain": "One of the canonical domains from the list above"
}
`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text().trim();
    const cleanedText = textResponse.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanedText);

    const matchedDomain = CANONICAL_DOMAINS.find(
      d => d.toLowerCase() === (parsed.domain || '').toLowerCase()
    ) || defaultFallbackDomain;

    return { domain: matchedDomain };
  } catch (err) {
    console.warn('[AI Classification Fallback]:', err.message);
    return { domain: defaultFallbackDomain };
  }
};

/**
 * AI Deduplication Check by Location: Evaluates whether a new problem statement is a duplicate
 * of an existing problem registered in that specific locality (district, block, panchayat).
 * 
 * @param {Object} newProblem - { title, description, location }
 * @param {Array<Object>} existingProblemsInLocation - List of existing problems in same locality
 * @returns {Promise<{ isDuplicate: boolean, matchedTicketId: string, explanation: string }>}
 */
export const checkProblemDuplicateInLocation = async (newProblem, existingProblemsInLocation = []) => {
  if (!existingProblemsInLocation || existingProblemsInLocation.length === 0) {
    return { isDuplicate: false, matchedTicketId: '', explanation: 'No existing problems in this locality' };
  }

  // Exact title match check
  const exactMatch = existingProblemsInLocation.find(
    p => p.title?.trim().toLowerCase() === newProblem.title?.trim().toLowerCase()
  );
  if (exactMatch) {
    return {
      isDuplicate: true,
      matchedTicketId: exactMatch.ticketId,
      explanation: `Exact matching problem title already registered in this locality under #${exactMatch.ticketId}`
    };
  }

  try {
    const model = getGenerativeModel();
    if (!model) {
      return fallbackDuplicateCheck(newProblem, existingProblemsInLocation);
    }

    const existingProblemsListFormatted = existingProblemsInLocation.map((p, index) => 
      `Problem ${index + 1} [ID: ${p._id}]: Title: "${p.title}", Description: "${p.description?.slice(0, 200)}"`
    ).join('\n');

    const prompt = `
You are the AI Deduplication Engine for the Problem Registry.
A citizen is submitting a problem from:
Locality: District: ${newProblem.location?.district || ''}, Block: ${newProblem.location?.block || ''}, Panchayat: ${newProblem.location?.panchayat || ''}
New Title: "${newProblem.title}"
New Description: "${newProblem.description}"

Existing problems registered in this same locality:
${existingProblemsListFormatted}

TASK:
Determine if the new problem is reporting the EXACT SAME underlying ground issue/grievance that is already registered in this locality.
If it is a different issue, isDuplicate is false.
If it is reporting the same issue, isDuplicate is true.

Return ONLY a valid JSON object with NO markdown ticks:
{
  "isDuplicate": true or false,
  "matchedProblemId": "Problem ID of matched problem if duplicate, otherwise empty string",
  "reason": "Short 1-sentence explanation"
}
`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text().trim();
    const cleanedText = textResponse.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanedText);

    return {
      isDuplicate: Boolean(parsed.isDuplicate),
      matchedProblemId: parsed.matchedProblemId || parsed.matchedTicketId || (parsed.isDuplicate ? existingProblemsInLocation[0]?._id : ''),
      explanation: parsed.reason || 'Duplicate problem detected in this locality.'
    };
  } catch (err) {
    console.warn('[AI Deduplication Fallback]:', err.message);
    return fallbackDuplicateCheck(newProblem, existingProblemsInLocation);
  }
};

/**
 * Fallback duplicate check using token similarity
 */
const fallbackDuplicateCheck = (newProblem, existingProblems) => {
  const newTokens = new Set(
    `${newProblem.title} ${newProblem.description}`.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/)
  );

  for (const existing of existingProblems) {
    const existingTokens = `${existing.title} ${existing.description}`.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    let common = 0;
    for (const t of existingTokens) {
      if (t.length > 3 && newTokens.has(t)) common++;
    }
    const ratio = common / Math.max(existingTokens.length, 1);
    if (ratio > 0.75) {
      return {
        isDuplicate: true,
        matchedProblemId: existing._id,
        explanation: `Substantially similar problem statement already active in this locality`
      };
    }
  }

  return { isDuplicate: false, matchedProblemId: '', explanation: 'No duplicate found in this locality' };
};

/**
 * Match Proposal to Industry Partner based on domain
 */
export const matchProposalToIndustry = async (proposal, industryList = []) => {
  if (!industryList || industryList.length === 0) {
    return {
      matchedPartnerId: null,
      matchedRationale: 'General CSR Pool allocated for innovative grassroots intervention.',
      confidence: 0.90,
      suggestedFundingRange: '₹5,00,000 - ₹15,00,000'
    };
  }

  const propText = `${proposal.title || ''} ${proposal.description || ''} ${(proposal.industrySupportRequired || []).join(' ')}`.toLowerCase();
  let chosen = industryList[0];
  for (const ind of industryList) {
    const indText = `${ind.name || ''} ${(ind.availableDomains || ind.focusDomains || []).join(' ')}`.toLowerCase();
    if (proposal.domain && indText.includes(proposal.domain.toLowerCase())) {
      chosen = ind;
      break;
    }
  }

  return {
    matchedPartnerId: chosen?._id,
    matchedPartnerObj: chosen,
    matchedRationale: `Matched with ${chosen?.name || 'CSR Partner'} based on aligned capabilities and CSR mandate.`,
    confidence: 0.92,
    suggestedFundingRange: '₹5,00,000 - ₹15,00,000'
  };
};

export default {
  CANONICAL_DOMAINS,
  analyzeAndClassifyProblem,
  checkProblemDuplicateInLocation,
  fallbackClassify,
  matchProposalToIndustry
};
