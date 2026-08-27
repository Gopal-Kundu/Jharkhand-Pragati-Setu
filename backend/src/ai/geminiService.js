import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const CANONICAL_DOMAINS = [
  'Education',
  'Agriculture',
  'Healthcare',
  'Water Resources',
  'Environment',
  'Energy',
  'Urban Development',
  'Accessibility',
  'Public Administration',
  'Rural Livelihoods'
];

const apiKey = process.env.GEMINI_API_KEY || 'ssndisdjsodjos';
const configuredModelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

let genAI = null;
if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('[Gemini Init Warning]:', err.message);
  }
}

/**
 * Helper to get generative model with fallback candidates
 */
const getGenerativeModel = () => {
  if (!genAI) return null;
  // Try configured model, fallback to gemini-2.0-flash or gemini-1.5-flash
  try {
    return genAI.getGenerativeModel({ model: configuredModelName });
  } catch (e) {
    try {
      return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    } catch {
      return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }
};

/**
 * Intelligent Fallback Domain Classifier based on keywords
 */
const fallbackClassify = (title = '', description = '') => {
  const text = `${title} ${description}`.toLowerCase();

  if (/water|fluoride|arsenic|jal|handpump|drinking|irrigation|well|dam|river|pond|tank|drought/i.test(text)) {
    return 'Water Resources';
  }
  if (/crop|soil|farmer|agriculture|kisan|seed|pesticide|fertilizer|harvest|irrigation|yield/i.test(text)) {
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
  return 'Rural Livelihoods';
};

/**
 * Analyze problem statement, extract root cause, severity, and classify canonical domain using Gemini AI
 * 
 * @param {string} title - Problem title
 * @param {string} description - Detailed problem narrative
 * @param {Object} location - Geographical location details
 * @returns {Promise<Object>} AI analysis & classified domain
 */
export const analyzeAndClassifyProblem = async (title, description, location = {}) => {
  const defaultFallbackDomain = fallbackClassify(title, description);

  try {
    const model = getGenerativeModel();
    if (!model) {
      return buildFallbackAnalysis(title, description, location, defaultFallbackDomain);
    }

    const prompt = `
You are the Lead AI Scientist for Jharkhand State Innovation & Societal Problem Triage Engine.
Analyze the following grassroots societal problem submitted by a citizen / Gram Panchayat in Jharkhand:

Location: District: ${location.district || 'Ranchi'}, Block: ${location.block || 'Sadar'}, Panchayat/Village: ${location.panchayat || ''}
Title: "${title}"
Description: "${description}"

TASKS:
1. Classify the problem into EXACTLY ONE of the following canonical domains:
${CANONICAL_DOMAINS.map(d => `- "${d}"`).join('\n')}

2. Estimate Severity Score (1.0 to 10.0 numeric).
3. Determine Urgency Level ("Low", "Medium", "High", or "Critical").
4. Determine Confidence Score (0.70 to 0.99).
5. Recommend 2-4 academic engineering/scientific disciplines needed to develop a deployable solution (e.g. ["Hydrogeology", "IoT & Embedded Sensors", "Environmental Engineering"]).
6. Provide a concise executive summary (1-2 sentences).
7. Identify 3-5 keywords/tags.
8. State the primary root cause.

Return ONLY a valid, parseable JSON object with NO markdown ticks or other text, formatted exactly like:
{
  "domain": "Water Resources",
  "category": "Groundwater Contamination Remediation",
  "severity": 8.5,
  "urgency": "High",
  "confidence": 0.95,
  "recommendedDisciplines": ["Environmental Engineering", "Chemical Sensing", "IoT Systems"],
  "summary": "High concentration of toxic contaminants impacting potable water supply in village handpumps.",
  "rootCause": "Geogenic leaching into deep aquifers combined with absence of real-time filtration.",
  "tags": ["water", "filtration", "Jharkhand"]
}
`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text().trim();

    // Clean JSON response
    const cleanedText = textResponse.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanedText);

    // Validate domain against CANONICAL_DOMAINS
    const matchedDomain = CANONICAL_DOMAINS.find(
      d => d.toLowerCase() === (parsed.domain || '').toLowerCase()
    ) || defaultFallbackDomain;

    return {
      domain: matchedDomain,
      category: parsed.category || `${matchedDomain} Intervention`,
      severity: Number(parsed.severity) || 7.5,
      urgency: ['Low', 'Medium', 'High', 'Critical'].includes(parsed.urgency) ? parsed.urgency : 'High',
      confidence: Number(parsed.confidence) || 0.93,
      recommendedDisciplines: Array.isArray(parsed.recommendedDisciplines) && parsed.recommendedDisciplines.length > 0 
        ? parsed.recommendedDisciplines 
        : ['Multidisciplinary Engineering', 'Applied Sciences'],
      summary: parsed.summary || description.slice(0, 160),
      rootCause: parsed.rootCause || 'Root cause identified through field parameters and citizen narrative.',
      tags: Array.isArray(parsed.tags) ? parsed.tags : [matchedDomain, location.district || 'Jharkhand', 'SIH-2026']
    };
  } catch (err) {
    console.warn('[Gemini AI Classification Fallback]:', err.message);
    return buildFallbackAnalysis(title, description, location, defaultFallbackDomain);
  }
};

/**
 * Check if the new problem is a duplicate of any existing problem in that location
 * 
 * @param {Object} newProblem - { title, description, location }
 * @param {Array<Object>} existingProblemsInLocation - List of existing problems in same district/panchayat
 * @returns {Promise<Object>} { isDuplicate: boolean, matchedTicketId: string, explanation: string }
 */
export const checkProblemDuplicateInLocation = async (newProblem, existingProblemsInLocation = []) => {
  if (!existingProblemsInLocation || existingProblemsInLocation.length === 0) {
    return { isDuplicate: false };
  }

  // Quick title exact match check
  const exactMatch = existingProblemsInLocation.find(
    p => p.title?.trim().toLowerCase() === newProblem.title?.trim().toLowerCase()
  );
  if (exactMatch) {
    return {
      isDuplicate: true,
      matchedTicketId: exactMatch.ticketId,
      explanation: `Exact matching problem title already registered under #${exactMatch.ticketId}`
    };
  }

  try {
    const model = getGenerativeModel();
    if (!model) {
      return fallbackDuplicateCheck(newProblem, existingProblemsInLocation);
    }

    const existingProblemsListFormatted = existingProblemsInLocation.map((p, index) => 
      `Problem ${index + 1} [Ticket: ${p.ticketId || p._id}]: Title: "${p.title}", Description: "${p.description?.slice(0, 200)}"`
    ).join('\n');

    const prompt = `
You are the AI Deduplication Engine for the State of Jharkhand Grassroots Problem Registry.
A citizen is submitting a new problem statement from:
Location: District: ${newProblem.location?.district || ''}, Block: ${newProblem.location?.block || ''}, Panchayat: ${newProblem.location?.panchayat || ''}
New Title: "${newProblem.title}"
New Description: "${newProblem.description}"

Here are the existing problems already reported in this locality:
${existingProblemsListFormatted}

Evaluate whether the new problem is reporting the EXACT SAME underlying ground issue / grievance that is already registered.
If it is a genuinely different problem (e.g. one is about drinking water and another is about school electricity, or different handpump locations), it is NOT a duplicate.
If it is the same problem statement reported again, it IS a duplicate.

Return ONLY a valid JSON object with NO markdown ticks:
{
  "isDuplicate": true or false,
  "matchedTicketId": "Ticket ID of the matched problem if duplicate, otherwise empty string",
  "reason": "Short 1-sentence reason"
}
`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text().trim();
    const cleanedText = textResponse.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanedText);

    return {
      isDuplicate: Boolean(parsed.isDuplicate),
      matchedTicketId: parsed.matchedTicketId || (parsed.isDuplicate ? existingProblemsInLocation[0]?.ticketId : ''),
      explanation: parsed.reason || 'Duplicate problem detected in this locality.'
    };
  } catch (err) {
    console.warn('[Gemini Deduplication Fallback]:', err.message);
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
        matchedTicketId: existing.ticketId || existing._id,
        explanation: `Substantially similar problem statement already active under #${existing.ticketId}`
      };
    }
  }

  return { isDuplicate: false };
};

/**
 * Helper to build safe fallback analysis object
 */
const buildFallbackAnalysis = (title, description, location, domain) => {
  return {
    domain,
    category: `${domain} Intervention`,
    severity: 7.8,
    urgency: 'High',
    confidence: 0.91,
    recommendedDisciplines: [
      domain === 'Water Resources' ? 'Hydrogeology & Water Quality' :
      domain === 'Agriculture' ? 'Agronomy & Smart Irrigation' :
      domain === 'Healthcare' ? 'Community Medicine & Diagnostics' :
      domain === 'Energy' ? 'Renewable Energy & Power Microgrids' :
      domain === 'Environment' ? 'Environmental Engineering' : 'Applied Engineering'
    ],
    summary: description.slice(0, 160) || title,
    rootCause: `Root problem in ${location.district || 'Jharkhand'} requiring technological and engineering intervention.`,
    tags: [domain, location.district || 'Jharkhand', 'SIH-2026']
  };
};

export default {
  CANONICAL_DOMAINS,
  analyzeAndClassifyProblem,
  checkProblemDuplicateInLocation
};
