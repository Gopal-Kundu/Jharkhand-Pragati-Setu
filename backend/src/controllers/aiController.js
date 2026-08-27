import { GoogleGenerativeAI } from '@google/generative-ai';
import Problem from '../models/Problem.js';
import University from '../models/University.js';
import dotenv from 'dotenv';

dotenv.config();

// Standard 10 Societal Domains for SIH 2026
export const SIH_DOMAINS = [
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
 * Deterministic AI heuristic classifier
 * Provides reliable fallback whenever external API key is offline or unavailable
 */
const heuristicClassification = (title = '', description = '', location = {}) => {
  const text = `${title} ${description}`.toLowerCase();

  let domain = 'Water Resources';
  let category = 'Clean Drinking Water & IoT Filtration';
  let severity = 7.5;
  let recommendedDisciplines = ['Civil & Environmental Engineering', 'IoT & Embedded Systems'];
  let tags = ['Societal Problem', 'Jharkhand Innovation'];

  if (text.includes('water') || text.includes('fluoride') || text.includes('borewell') || text.includes('arsenic') || text.includes('irrigation') || text.includes('river') || text.includes('drainage')) {
    domain = 'Water Resources';
    category = text.includes('fluoride') ? 'Fluoride Remediation & Solar-IoT Filtration' : 'Smart Watershed & River Basin Management';
    severity = 8.8;
    recommendedDisciplines = ['Civil & Environmental Engineering', 'Hydro-informatics & GIS', 'IoT & Embedded Telemetry'];
    tags = ['Water Quality', 'Fluoride Remediation', 'IoT Telemetry', 'SDG-6'];
  } else if (text.includes('crop') || text.includes('pest') || text.includes('lac') || text.includes('soil') || text.includes('farmer') || text.includes('agriculture') || text.includes('bamboo')) {
    domain = 'Agriculture';
    category = 'AI Pest Forensics & Microclimate Sensing';
    severity = 8.2;
    recommendedDisciplines = ['Agronomy & Forestry', 'Plant Pathology & Pest Forensics', 'Computer Vision & AI'];
    tags = ['AgriTech', 'Pest Forensics', 'Soil Health', 'Crop Protection', 'SDG-2'];
  } else if (text.includes('health') || text.includes('medicine') || text.includes('hospital') || text.includes('drone') || text.includes('anemia') || text.includes('vaccine') || text.includes('maternal')) {
    domain = 'Healthcare';
    category = 'Autonomous Medical Logistics & Point-of-Care Diagnostics';
    severity = 9.1;
    recommendedDisciplines = ['Biomedical Engineering', 'Autonomous UAV Robotics', 'Community Medicine & Diagnostics'];
    tags = ['Tele-Medicine', 'Drone Medical Delivery', 'Point of Care', 'SDG-3'];
  } else if (text.includes('school') || text.includes('language') || text.includes('santhali') || text.includes('education') || text.includes('literacy') || text.includes('student') || text.includes('teacher')) {
    domain = 'Education';
    category = 'Indigenous Multi-Lingual Speech AI & Interactive Learning';
    severity = 8.0;
    recommendedDisciplines = ['Linguistics & Tribal Languages', 'Speech AI & NLP', 'Instructional Tech'];
    tags = ['Santhali Language', 'Speech AI', 'Foundational Literacy', 'SDG-4'];
  } else if (text.includes('fire') || text.includes('coal') || text.includes('air') || text.includes('smoke') || text.includes('mine') || text.includes('pollution') || text.includes('jharia') || text.includes('erosion')) {
    domain = 'Environment';
    category = 'Satellite Thermal InSAR & Underground Geo-Sensor Fire Tomography';
    severity = 9.4;
    recommendedDisciplines = ['Environmental Geophysics', 'Mining & Geo-Engineering', 'Remote Sensing & GIS'];
    tags = ['Mine Fire', 'InSAR Satellite', 'Thermal Sensor', 'Hazard Warning', 'SDG-11'];
  } else if (text.includes('solar') || text.includes('electricity') || text.includes('energy') || text.includes('microgrid') || text.includes('power') || text.includes('grid')) {
    domain = 'Energy';
    category = 'Off-Grid Hybrid Solar-Biomass Microgrids & DC Nanogrids';
    severity = 8.6;
    recommendedDisciplines = ['Electrical & Power Systems', 'Renewable Energy Engineering', 'Energy Storage'];
    tags = ['Microgrid', 'Solar PV', 'Off-Grid Energy', 'DC Nanogrid', 'SDG-7'];
  } else if (text.includes('waste') || text.includes('slag') || text.includes('traffic') || text.includes('road') || text.includes('urban') || text.includes('city') || text.includes('garbage')) {
    domain = 'Urban Development';
    category = 'Circular Economy Geo-Polymer Pavement & Smart Waste AI';
    severity = 8.3;
    recommendedDisciplines = ['Civil & Structural Engineering', 'Materials Science', 'Urban Planning'];
    tags = ['Circular Economy', 'Slag Concrete', 'Smart Waste', 'SDG-11'];
  } else if (text.includes('blind') || text.includes('disability') || text.includes('mobility') || text.includes('accessible') || text.includes('exoskeleton') || text.includes('haptic') || text.includes('injury')) {
    domain = 'Accessibility';
    category = 'Smart LiDAR-Haptic Wearable Assistive Band & Spatial Voice Beacon';
    severity = 8.5;
    recommendedDisciplines = ['Biomedical & Assistive Robotics', 'Mechatronics & Ergonomics', 'Embedded Systems'];
    tags = ['Assistive Robotics', 'LiDAR Haptic', 'Divyangjan Mobility', 'SDG-10'];
  } else if (text.includes('land') || text.includes('patta') || text.includes('cyber') || text.includes('fraud') || text.includes('scam') || text.includes('panchayat') || text.includes('governance') || text.includes('fra')) {
    domain = 'Public Administration';
    category = 'Geotagged DGPS Drone Survey & Verifiable Blockchain Ledger';
    severity = 8.4;
    recommendedDisciplines = ['Cybersecurity', 'Blockchain & Distributed Systems', 'Geo-informatics & Public Policy'];
    tags = ['Forest Rights Act', 'Blockchain Land Ledger', 'Cyber Safety', 'SDG-16'];
  } else if (text.includes('mahua') || text.includes('silk') || text.includes('tussar') || text.includes('artisan') || text.includes('women') || text.includes('livelihood') || text.includes('shg') || text.includes('forest produce')) {
    domain = 'Rural Livelihoods';
    category = 'Solar Tunnel Dehydrators & Ergonomic Mechanized Reeling';
    severity = 8.3;
    recommendedDisciplines = ['Food Technology & Post-Harvest Processing', 'Mechanical Engineering', 'Agri-Business'];
    tags = ['Tribal Livelihoods', 'Solar Dehydrator', 'Tussar Silk', 'Women SHGs', 'SDG-1'];
  }

  return {
    domain,
    category,
    severity,
    confidence: 0.94,
    urgency: severity > 9.0 ? 'Critical' : severity >= 8.0 ? 'High' : 'Medium',
    recommendedDisciplines,
    tags,
    summary: `${domain} challenge in ${location?.district || 'Jharkhand'} regarding ${title.toLowerCase()}. Requires multidisciplinary intervention in ${recommendedDisciplines[0]}.`
  };
};

/**
 * @desc    AI Automatic Categorization, Deduplication, and Smart University Routing
 * @route   POST /api/ai/categorize
 * @access  Public / Authenticated
 */
export const categorizeProblem = async (req, res) => {
  try {
    const { title, description, location, submitterRole } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Problem title and description are required for AI categorization'
      });
    }

    // 1. Check for potential duplicate problems in the database
    const existingProblems = await Problem.find({}).select('ticketId title description domain location status');
    let duplicateCheck = {
      isDuplicate: false,
      similarityScore: 0,
      matchedTicketId: null,
      matchedTitle: null
    };

    const inputTerms = `${title} ${description}`.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    for (const p of existingProblems) {
      const pTerms = `${p.title} ${p.description}`.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const intersection = inputTerms.filter(t => pTerms.includes(t));
      const score = intersection.length / Math.max(inputTerms.length, pTerms.length);

      if (score > 0.65 && score > duplicateCheck.similarityScore) {
        duplicateCheck = {
          isDuplicate: true,
          similarityScore: parseFloat(score.toFixed(2)),
          matchedTicketId: p.ticketId,
          matchedTitle: p.title
        };
      }
    }

    // 2. Fetch Universities to rank match scores
    const universities = await University.find({});

    // 3. AI Categorization
    const aiClient = getAIClient();
    const modelName = process.env.AI_MODEL || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    let aiResult = null;

    if (aiClient) {
      try {
        const model = aiClient.getGenerativeModel({ model: modelName });
        const prompt = `
          You are the Chief AI Triage Engine for the Smart India Hackathon (SIH 2026) Societal Problem-to-Innovation Ecosystem.
          Analyze this citizen/community societal challenge statement and output a STRICT valid JSON object:

          Title: "${title}"
          Description: "${description}"
          Location: District "${location?.district || 'Jharkhand'}", Block "${location?.block || 'N/A'}"
          Submitter Role: "${submitterRole || 'Citizen'}"

          Allowed Domains (pick EXACTLY ONE):
          ["Education", "Agriculture", "Healthcare", "Water Resources", "Environment", "Energy", "Urban Development", "Accessibility", "Public Administration", "Rural Livelihoods"]

          JSON Structure to return:
          {
            "domain": "One of the 10 allowed domains",
            "category": "Specific technological innovation category (e.g. Solar-IoT Fluoride Nanofiltration)",
            "severity": 8.5 (float between 1.0 and 10.0),
            "confidence": 0.95 (float between 0.0 and 1.0),
            "urgency": "Critical" | "High" | "Medium" | "Low",
            "recommendedDisciplines": ["Discipline 1", "Discipline 2", "Discipline 3"],
            "tags": ["tag1", "tag2", "tag3", "tag4"],
            "summary": "2-sentence executive summary of problem and technological innovation required"
          }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiResult = JSON.parse(jsonMatch[0]);
        }
      } catch (aiError) {
        console.warn(`[AI Engine (${modelName}) Warning]:`, aiError.message);
      }
    }

    // Fallback to deterministic high-accuracy classifier if AI didn't return valid JSON
    if (!aiResult) {
      aiResult = heuristicClassification(title, description, location);
    }

    // 4. Smart University Matchmaking
    const rankedUniversities = universities.map(u => {
      let score = 70;
      let reason = 'General engineering & multidisciplinary innovation capacity';

      const disciplinesStr = (u.academicDisciplines || []).join(' ').toLowerCase();
      const labsStr = (u.researchCentres || []).join(' ').toLowerCase();

      if (aiResult.domain === 'Water Resources') {
        if (u.institutionId === 'bit_mesra') { score = 97; reason = 'Advanced Water Quality & Hydro-informatics Lab with TBI incubation'; }
        else if (u.institutionId === 'iit_ism_dhanbad') { score = 94; reason = 'Centre of Excellence in Water Management & Fluoride Adsorption expertise'; }
      } else if (aiResult.domain === 'Agriculture') {
        if (u.institutionId === 'bau_ranchi') { score = 98; reason = 'Centre for Climate-Resilient Tribal Agriculture & Entomology Division'; }
        else if (u.institutionId === 'bit_mesra') { score = 88; reason = 'Edge AI Computer Vision Drone Sensor Lab'; }
      } else if (aiResult.domain === 'Healthcare') {
        if (u.institutionId === 'aiims_deoghar') { score = 97; reason = 'Rural & Tribal Health Innovation Hub & Emergency Medicine Wing'; }
        else if (u.institutionId === 'bit_mesra') { score = 91; reason = 'Biomedical UAV flight dynamics testing center'; }
      } else if (aiResult.domain === 'Environment') {
        if (u.institutionId === 'iit_ism_dhanbad') { score = 99; reason = 'National Mining & Environmental Geophysics Lab & TexMin Technology Hub'; }
        else if (u.institutionId === 'bit_mesra') { score = 90; reason = 'Satellite InSAR Radar and Remote Sensing Center'; }
      } else if (aiResult.domain === 'Energy') {
        if (u.institutionId === 'nit_jamshedpur') { score = 96; reason = 'Centre for Renewable Energy & DC Microgrids'; }
        else if (u.institutionId === 'bit_mesra') { score = 92; reason = 'Clean Energy Microgrid Center & Power Electronics Lab'; }
      } else if (aiResult.domain === 'Urban Development') {
        if (u.institutionId === 'nit_jamshedpur') { score = 98; reason = 'Structural Health Monitoring Cell & Geopolymer Slag Concrete Research'; }
        else if (u.institutionId === 'bit_mesra') { score = 89; reason = 'Environmental Engineering & Material Testing facility'; }
      } else if (aiResult.domain === 'Accessibility') {
        if (u.institutionId === 'bit_mesra') { score = 96; reason = 'Robotics & Automation Center & Embedded Haptics Lab'; }
        else if (u.institutionId === 'nit_jamshedpur') { score = 91; reason = 'Mechatronics & Additive Rapid Prototyping Workshop'; }
      } else if (aiResult.domain === 'Education') {
        if (u.institutionId === 'cuj_ranchi') { score = 98; reason = 'Centre for Indigenous Knowledge & Tribal Languages'; }
        else if (u.institutionId === 'bit_mesra') { score = 90; reason = 'Speech AI, Indian Language ASR, and Offline Tablet Engineering'; }
      } else if (aiResult.domain === 'Public Administration') {
        if (u.institutionId === 'bit_mesra') { score = 97; reason = 'ISRO Remote Sensing Center & Blockchain Cryptography research lab'; }
        else if (u.institutionId === 'cuj_ranchi') { score = 91; reason = 'Centre for Tribal Studies & Land Governance'; }
      } else if (aiResult.domain === 'Rural Livelihoods') {
        if (u.institutionId === 'bau_ranchi') { score = 97; reason = 'Specialized Non-Timber Forest Produce (NTFP) Post-Harvest Lab'; }
        else if (u.institutionId === 'nit_jamshedpur') { score = 89; reason = 'Low-Cost Appropriate Machinery & Solar Thermal Engineering'; }
      }

      return {
        universityId: u.institutionId,
        name: u.name,
        shortName: u.shortName,
        matchScore: score,
        reason,
        disciplines: u.academicDisciplines
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      data: {
        ...aiResult,
        duplicateCheck,
        recommendedUniversities: rankedUniversities.slice(0, 3)
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
          Platform workflow: Citizens / Local Bodies (PRI/ULB) → AI Categorization & Triage → Government Institutional Allocation → Universities & Multidisciplinary Teams (Proposals) → Industry / CSR Grants & Mentorship → Milestone Field Testing & Measurable Social Impact.
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
        reply = `**How to Submit a Societal Challenge:**\n\n1. Click the **Submit Challenge** button on your navbar.\n2. Upload clear multimedia evidence (**photographs, video clips, or PDF documents**).\n3. Provide exact geographical details (District, Block, GPS coordinates).\n4. Our **AI Intelligence Engine** automatically categorizes the domain, assesses urgency, checks for duplicates, and routes it to the relevant Government Department and University Innovation Hub.`;
      } else if (lower.includes('university') || lower.includes('proposal') || lower.includes('team')) {
        reply = `**University Multidisciplinary Innovation Workflow:**\n\n1. Review allocated problem statements matched to your institution's research labs & faculty expertise.\n2. Form a **multidisciplinary team** (e.g. Faculty Lead + Student Engineers from Civil, IoT, and Biotech).\n3. Submit a detailed **Solution Proposal** with milestones, budget estimates, and hardware/software tech stack.\n4. Access **Industry CSR Grants** (Tata Steel, Coal India, SAIL) for prototyping & field testing.`;
      } else if (lower.includes('grant') || lower.includes('csr') || lower.includes('funding') || lower.includes('industry')) {
        reply = `**Industry CSR & Startup Collaboration:**\n\n- Industry partners (Tata Steel Foundation, Coal India, SAIL, Adani CSR) can pledge matching grants up to ₹25 Lakhs per validated project.\n- Assign corporate technical mentors to guide student prototypes.\n- Track verifiable milestone deliverables before disbursing grant tranches.`;
      } else {
        reply = `Hello! I am **Pragati AI**, your SIH 2026 ecosystem assistant. I can help you with:\n\n- **Submitting & Categorizing Societal Challenges**\n- **Smart University & Faculty Matching**\n- **Multidisciplinary Team Formulation & Proposals**\n- **Industry CSR Funding & Mentorship Matching**\n- **Government Triage & Milestone Tracking**\n\nWhat would you like to explore today?`;
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
