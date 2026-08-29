import Problem from '../models/Problem.js';
import { analyzeAndClassifyProblem, checkProblemDuplicateInLocation, CANONICAL_DOMAINS } from '../ai/aiService.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export const SIH_DOMAINS = CANONICAL_DOMAINS;

/**
 * Initialize AI client using API key from .env
 */
const getAIClient = () => {
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * @desc    AI Automatic Categorization (Assigns Domain & Checks Location Duplicates)
 * @route   POST /api/ai/categorize
 * @access  Public / Authenticated
 */
export const categorizeProblem = async (req, res) => {
  try {
    const { title, description, location = {} } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Problem title and description are required for AI categorization'
      });
    }

    const district = location.district || location.districtName || 'Ranchi';
    const block = location.block || '';
    const panchayat = location.panchayat || '';

    // 1. Fetch existing problems strictly within the specified locality
    const locFilter = { 'location.district': new RegExp(`^${district}$`, 'i') };
    if (block) {
      locFilter['location.block'] = new RegExp(`^${block}$`, 'i');
    }
    if (panchayat) {
      locFilter['location.panchayat'] = new RegExp(`^${panchayat}$`, 'i');
    }

    const existingInLocality = await Problem.find(locFilter)
      .select('ticketId title description domain location status')
      .limit(20);

    // 2. Check for duplicate problem in that location
    const duplicateResult = await checkProblemDuplicateInLocation(
      { title, description, location: { district, block, panchayat } },
      existingInLocality
    );

    // 3. AI Assigns Domain from the 10 Canonical Domains
    const aiDomainResult = await analyzeAndClassifyProblem(title, description, { district, block, panchayat });
    const decidedDomain = aiDomainResult.domain || 'Water Resources';

    return res.status(200).json({
      success: true,
      data: {
        domain: decidedDomain,
        duplicateCheck: {
          isDuplicate: duplicateResult.isDuplicate,
          matchedTicketId: duplicateResult.matchedTicketId || null,
          reason: duplicateResult.explanation || ''
        }
      }
    });
  } catch (error) {
    console.error('[AI Categorization Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing AI problem categorization'
    });
  }
};

/**
 * @desc    AI Assistant Chatbot API Endpoint for SIH 2026 Platform
 * @route   POST /api/ai/chat
 * @access  Public / Authenticated
 */
export const aiChat = async (req, res) => {
  try {
    const { message, contextRole, activeProblemId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required for AI Assistant'
      });
    }

    const aiClient = getAIClient();
    const modelName = process.env.AI_MODEL || process.env.GEMINI_MODEL || 'gemini-2.0-flash';

    let reply = '';

    if (aiClient) {
      try {
        const model = aiClient.getGenerativeModel({ model: modelName });
        const systemPrompt = `
          You are "Pragati AI", the intelligent orchestrator of the Smart India Hackathon (SIH 2026) Societal Problem-to-Innovation Ecosystem in Jharkhand.
          The user has the role: "${contextRole || 'citizen'}".
          Platform workflow: Citizens / Local Bodies (PRI/ULB) → AI Domain Assignment & Location Deduplication → Government Institutional Allocation → Universities & Multidisciplinary Teams (Proposals) → Industry / CSR Grants & Mentorship → Milestone Field Testing & Measurable Social Impact.
          10 Domains: Education, Agriculture, Healthcare, Water Resources, Environment, Energy, Urban Development, Accessibility, Public Administration, Rural Livelihoods.

          Provide clear, concise, actionable, and encouraging answers formatted in markdown.
        `;

        const result = await model.generateContent(`${systemPrompt}\n\nUser Question: ${message}`);
        reply = result.response.text();
      } catch (err) {
        console.warn(`[AI Chat (${modelName}) Warning]:`, err.message);
      }
    }

    if (!reply) {
      // Intelligent fallback responses based on queries
      const lower = message.toLowerCase();
      if (lower.includes('submit') || lower.includes('problem') || lower.includes('citizen')) {
        reply = `**How to Submit a Societal Challenge:**\n\n1. Click the **Submit Challenge** button on your navbar.\n2. Upload clear multimedia evidence (**photographs, video clips, or PDF documents**).\n3. Provide exact geographical details (District, Block, GPS coordinates).\n4. Our **AI Intelligence Engine** automatically assigns the domain, checks for location duplicates, and routes it to the relevant Government Department and University Innovation Centers.`;
      } else if (lower.includes('university') || lower.includes('proposal') || lower.includes('team')) {
        reply = `**University Multidisciplinary Innovation Workflow:**\n\n1. Review allocated problem statements matched to your institution's domain capabilities.\n2. Form a **multidisciplinary team** (e.g. Faculty Lead + Student Engineers from Civil, IoT, and Biotech).\n3. Submit a detailed **Solution Proposal** with milestones, budget estimates, and hardware/software tech stack.\n4. Access **Industry CSR Grants** (Tata Steel, Coal India, SAIL) for prototyping & field testing.`;
      } else if (lower.includes('grant') || lower.includes('csr') || lower.includes('funding') || lower.includes('industry')) {
        reply = `**Industry CSR & Startup Collaboration:**\n\n- Industry partners (Tata Steel Foundation, Coal India, SAIL, Adani CSR) can pledge matching grants up to ₹25 Lakhs per validated project.\n- Assign corporate technical mentors to guide student prototypes.\n- Track verifiable milestone deliverables before disbursing grant tranches.`;
      } else {
        reply = `Hello! I am **Pragati AI**, your SIH 2026 ecosystem assistant. I can help you with:\n\n- **Submitting & Categorizing Societal Challenges**\n- **University Innovation & Multidisciplinary Proposals**\n- **Industry CSR Matching Grants & Mentorship**\n- **Government Triage & Milestone Tracking**\n\nWhat would you like to explore today?`;
      }
    }

    return res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    console.error('[AI Chat Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing AI chat query'
    });
  }
};

export default {
  categorizeProblem,
  aiChat,
  SIH_DOMAINS
};
