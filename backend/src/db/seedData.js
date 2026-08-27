import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import University from '../models/University.js';
import IndustryPartner from '../models/IndustryPartner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to database:', mongoose.connection.name);

    // 1. Clear existing collections
    await User.deleteMany({});
    await Problem.deleteMany({});
    await University.deleteMany({});
    await IndustryPartner.deleteMany({});
    console.log('[Seed] Cleared existing data collections.');

    // 2. Hash Password Generator
    const salt = await bcrypt.genSalt(10);
    const hash = (pwd) => bcrypt.hash(pwd, salt);

    // 3. Create Persona Test Users
    const users = [
      {
        name: 'Birsa Oraon (Citizen / Farmer)',
        email: 'citizen@sih2026.gov.in',
        password: await hash('Citizen@2026'),
        role: 'citizen',
        organization: 'Torpa Farmers Producer Collective',
        district: 'Khunti',
        phone: '+91 94311 12345',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Mukesh Bhagat (Mukhiya, Dormba Gram Panchayat)',
        email: 'panchayat@sih2026.gov.in',
        password: await hash('Panchayat@2026'),
        role: 'panchayat',
        organization: 'Dormba Gram Panchayat & Torpa Block BDO',
        district: 'Khunti',
        phone: '+91 94311 55678',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Dr. Manish Ranjan, IAS (Secretary)',
        email: 'govt@sih2026.gov.in',
        password: await hash('Govt@2026'),
        role: 'government',
        department: 'Department of Drinking Water & Sanitation',
        organization: 'Government of Jharkhand',
        district: 'Ranchi',
        phone: '+91 651 2400123',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Dr. Amitava Roy (Lead Investigator & Professor)',
        email: 'university@sih2026.gov.in',
        password: await hash('Univ@2026'),
        role: 'university',
        department: 'Civil & Environmental Engineering',
        organization: 'Birla Institute of Technology (BIT) Mesra',
        district: 'Ranchi',
        phone: '+91 94313 98765',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        institutionDetails: {
          disciplines: ['Civil & Environmental Engineering', 'IoT & Hydro-Telemetry'],
          incubationCenter: 'BIT-TBI Incubation Hub',
          facultyLead: 'Dr. Amitava Roy'
        }
      },
      {
        name: 'Saurav Roy (Chief - Corporate Social Responsibility)',
        email: 'industry@sih2026.gov.in',
        password: await hash('Industry@2026'),
        role: 'industry',
        organization: 'Tata Steel Foundation',
        district: 'East Singhbhum',
        phone: '+91 657 2431234',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
        industryDetails: {
          partnerType: 'CSR Foundation',
          csrBudget: 1250000000,
          focusDomains: ['Water Resources', 'Agriculture', 'Healthcare', 'Rural Livelihoods']
        }
      },
      {
        name: 'State Innovation Admin',
        email: 'admin@sih2026.gov.in',
        password: await hash('Admin@2026'),
        role: 'admin',
        organization: 'Jharkhand State Innovation Council',
        district: 'Ranchi',
        phone: '+91 651 2200000',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
      }
    ];

    await User.insertMany(users);
    console.log(`[Seed] Successfully created ${users.length} testing users.`);

    // 4. Create Universities
    const universities = [
      {
        institutionId: 'bit_mesra',
        name: 'Birla Institute of Technology (BIT) Mesra',
        shortName: 'BIT Mesra',
        nirfRank: 48,
        location: { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' },
        type: 'Deemed University & Tech Hub',
        academicDisciplines: ['Civil & Environmental Engineering', 'IoT & Embedded Systems', 'Biotechnology', 'Remote Sensing & GIS', 'Computer Science & AI', 'Mechanical Engineering'],
        researchCentres: ['Centre of Excellence in Water Technologies & Hydro-Informatics', 'Tribal Technology Innovation & Rural Livelihood Cell'],
        incubationCentres: ['BIT-TBI Incubation Center (DST Supported)', 'Makerspace IoT Hardware Lab', 'Biotech Rapid Prototyping Facility'],
        facultySpecializations: [
          { name: 'Dr. Amitava Roy', department: 'Civil & Environmental Engineering', expertise: 'Water Quality Modelling, Fluoride Remediation, IoT Hydro-Telemetry', email: 'aroy@bitmesra.ac.in' },
          { name: 'Dr. Priya Sengupta', department: 'Bio-Engineering & Biotechnology', expertise: 'Bio-Sensors, Tribal Nutrition, Phyto-Remediation', email: 'psengupta@bitmesra.ac.in' }
        ],
        contactEmail: 'rnd@bitmesra.ac.in'
      },
      {
        institutionId: 'iit_ism_dhanbad',
        name: 'Indian Institute of Technology (ISM) Dhanbad',
        shortName: 'IIT (ISM) Dhanbad',
        nirfRank: 17,
        location: { city: 'Dhanbad', district: 'Dhanbad', state: 'Jharkhand' },
        type: 'Institute of National Importance',
        academicDisciplines: ['Mining & Geo-Engineering', 'Environmental Science', 'Electronics Engineering', 'Applied Geophysics', 'Clean Energy Technologies'],
        researchCentres: ['Centre of Mining Fire & Hazard Mitigation Technologies', 'Sustainable Mineral & Geo-Resource Hub'],
        incubationCentres: ['IIT ISM Technology Innovation Hub (TEXMiN)', 'Centre for Innovation, Incubation & Entrepreneurship (CIIE)'],
        facultySpecializations: [
          { name: 'Prof. Rajesh K. Sinha', department: 'Mining Engineering', expertise: 'Underground Coal Fire Dynamics, Thermal Infrared Sensor Arrays, Mine Safety', email: 'rksinha@iitism.ac.in' }
        ],
        contactEmail: 'director@iitism.ac.in'
      },
      {
        institutionId: 'bau_ranchi',
        name: 'Birsa Agricultural University (BAU) Kanke',
        shortName: 'BAU Ranchi',
        nirfRank: 92,
        location: { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' },
        type: 'Agricultural University',
        academicDisciplines: ['Agronomy & Crop Sciences', 'Forestry & Agro-Forestry', 'Soil Science & Agricultural Chemistry', 'Plant Pathology & Pest Forensics'],
        researchCentres: ['Centre of Tribal Crop Resilience & Lac Culture'],
        incubationCentres: ['BAU Agribusiness Incubator (R-ABI)', 'Seed Testing & Soil Chemistry Lab'],
        facultySpecializations: [
          { name: 'Dr. Sunita Murmu', department: 'Plant Pathology & Agronomy', expertise: 'Lac Production Optimization, Soil Nutrient Profiling, Tribal Agro-Ecosystems', email: 'smurmu@bauranchi.org' }
        ],
        contactEmail: 'vc@bauranchi.org'
      },
      {
        institutionId: 'nit_jamshedpur',
        name: 'National Institute of Technology (NIT) Jamshedpur',
        shortName: 'NIT Jamshedpur',
        nirfRank: 86,
        location: { city: 'Jamshedpur', district: 'East Singhbhum', state: 'Jharkhand' },
        type: 'Institute of National Importance',
        academicDisciplines: ['Metallurgical & Materials Engineering', 'Mechanical & Thermal Systems', 'Electrical & Renewable Microgrids', 'Production Engineering'],
        researchCentres: ['Appropriate Rural Machinery & Industrial Metallurgy Lab'],
        incubationCentres: ['NIT Incubation and Innovation Centre (NIIC)', 'Advanced Metal Fab & Prototyping Workshop'],
        facultySpecializations: [
          { name: 'Dr. Vivek Pandey', department: 'Mechanical & Materials Engineering', expertise: 'Low-Cost Agricultural Machinery, Solar Thermal Systems', email: 'vpandey@nitjsr.ac.in' }
        ],
        contactEmail: 'director@nitjsr.ac.in'
      },
      {
        institutionId: 'rims_ranchi',
        name: 'Rajendra Institute of Medical Sciences (RIMS) Ranchi',
        shortName: 'RIMS Ranchi',
        nirfRank: 65,
        location: { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' },
        type: 'Medical Institution',
        academicDisciplines: ['Community Medicine', 'Tele-Medicine', 'Pathology & Point-of-Care Diagnostics', 'Pediatrics & Maternal Health'],
        researchCentres: ['Centre for Tribal Health, Sickle Cell & Anemia Forensics'],
        incubationCentres: ['RIMS MedTech Innovation Hub', 'Molecular Diagnostic Laboratory'],
        facultySpecializations: [
          { name: 'Dr. Sanjay Kumar', department: 'Community Medicine', expertise: 'Tribal Public Health, Mobile Tele-Diagnostics', email: 'skumar@rimsranchi.ac.in' }
        ],
        contactEmail: 'director@rimsranchi.ac.in'
      }
    ];

    await University.insertMany(universities);
    console.log(`[Seed] Successfully created ${universities.length} universities.`);

    // 5. Create Industry CSR Partners
    const industryPartners = [
      {
        partnerId: 'tata_steel_foundation',
        name: 'Tata Steel Foundation',
        type: 'CSR Foundation',
        hqLocation: 'Jamshedpur, East Singhbhum',
        focusDomains: ['Water Resources', 'Agriculture', 'Healthcare', 'Rural Livelihoods', 'Education'],
        csrAnnualBudgetInr: 1250000000,
        activeGrantsCount: 18,
        mentorshipAvailable: true,
        leadMentors: [
          { name: 'Saurav Roy', designation: 'Chief - CSR', domain: 'Water & Rural Development' },
          { name: 'Debdoot Mohanty', designation: 'Head - CSR Programs', domain: 'Tribal Livelihoods & Agro-Processing' }
        ],
        contactEmail: 'csr@tatasteel.com'
      },
      {
        partnerId: 'coal_india_csr',
        name: 'Coal India Limited (CIL) / BCCL CSR Division',
        type: 'Enterprise & PSU',
        hqLocation: 'Dhanbad & Ranchi',
        focusDomains: ['Environment', 'Energy', 'Urban Development', 'Healthcare', 'Water Resources'],
        csrAnnualBudgetInr: 2100000000,
        activeGrantsCount: 24,
        mentorshipAvailable: true,
        leadMentors: [
          { name: 'B. K. Tripathy', designation: 'General Manager (CSR)', domain: 'Mine Environment & Community Infrastructure' }
        ],
        contactEmail: 'csr@coalindia.in'
      },
      {
        partnerId: 'sail_csr',
        name: 'Steel Authority of India Limited (SAIL) - Bokaro Division',
        type: 'Enterprise & PSU',
        hqLocation: 'Bokaro Steel City',
        focusDomains: ['Education', 'Accessibility', 'Urban Development', 'Rural Livelihoods'],
        csrAnnualBudgetInr: 850000000,
        activeGrantsCount: 11,
        mentorshipAvailable: true,
        leadMentors: [
          { name: 'Meena Hembrom', designation: 'DGM (CSR)', domain: 'Divyangjan Mobility & Skill Development' }
        ],
        contactEmail: 'csr@sail-bokaro.com'
      },
      {
        partnerId: 'jspl_csr',
        name: 'Jindal Steel & Power Foundation (JSPL CSR)',
        type: 'CSR Foundation',
        hqLocation: 'Ranchi & Godda',
        focusDomains: ['Energy', 'Agriculture', 'Women Empowerment', 'Water Resources'],
        csrAnnualBudgetInr: 620000000,
        activeGrantsCount: 9,
        mentorshipAvailable: true,
        leadMentors: [
          { name: 'Alok Kumar', designation: 'Head - CSR Jharkhand', domain: 'Renewable Microgrids & Rural Energy' }
        ],
        contactEmail: 'csr@jindalsteel.com'
      }
    ];

    await IndustryPartner.insertMany(industryPartners);
    console.log(`[Seed] Successfully created ${industryPartners.length} industry partners.`);

    // 6. Create Realistic Solved (6) and Unsolved (3) Problem Statements
    const problems = [
      // ======================= SOLVED CHALLENGE 1 =======================
      {
        ticketId: 'JH-WTR-1042',
        title: 'Geogenic Fluoride Contamination & Pre-Monsoon Drying of Check-Dam Pond',
        description: 'Borewells and village ponds in Dormba Panchayat exceed 3.8 mg/L fluoride level causing severe dental fluorosis and acute water scarcity for 2,400 farmers.',
        domain: 'Water Resources',
        location: {
          district: 'Khunti',
          block: 'Torpa',
          panchayat: 'Dormba',
          state: 'Jharkhand',
          lat: 23.0841,
          lng: 85.2514,
          address: 'Dormba Village check-dam pond site, Torpa Block',
          pincode: '835227',
          geoPoint: { type: 'Point', coordinates: [85.2514, 23.0841] }
        },
        submitter: {
          name: 'Mukesh Bhagat (Mukhiya)',
          role: 'pri_panchayat',
          organization: 'Dormba Gram Panchayat',
          phone: '+91 94311 55678',
          email: 'panchayat@sih2026.gov.in'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
            caption: 'Dormba Check-Dam Sluice Gate Before Remediation',
            uploadedAt: new Date('2026-05-10')
          }
        ],
        aiAnalysis: {
          domain: 'Water Resources',
          category: 'Solar Activated Alumina Fluoride Filtration & IoT Hydro-Telemetry',
          severity: 9.2,
          confidence: 0.96,
          urgency: 'Critical',
          recommendedDisciplines: ['Civil & Environmental Engineering', 'IoT & Hydro-Informatics', 'Materials Science'],
          recommendedUniversities: [
            { universityId: 'bit_mesra', name: 'BIT Mesra', matchScore: 96, rationale: 'Centre of Excellence in Water Technologies' }
          ],
          tags: ['Water Resources', 'Fluoride Remediation', 'IoT Hydro-Telemetry', 'SDG-6'],
          summary: 'High geogenic fluoride reduced to <0.5 mg/L via solar activated alumina filter and automated retention sluice.'
        },
        status: 'validated',
        resolutionStatus: 'solved',
        priority: 'Critical',
        allocatedUniversity: {
          universityId: 'bit_mesra',
          name: 'Birla Institute of Technology (BIT) Mesra',
          facultyLead: { name: 'Dr. Amitava Roy', email: 'aroy@bitmesra.ac.in', department: 'Civil & Environmental Engineering' },
          allocatedAt: new Date('2026-05-18')
        },
        proposals: [
          {
            id: 'PROP-JH-WTR-1042',
            title: 'Solar Activated Alumina Fluoride Filter with LoRaWAN Telemetry',
            abstract: 'Engineered and deployed 45,000 L/day solar activated alumina adsorption filter with hydrostatic telemetry for real-time water quality tracking.',
            teamLead: 'Rahul Sharma (M.Tech)',
            facultyAdvisor: 'Dr. Amitava Roy',
            multidisciplinaryTeam: [
              { name: 'Dr. Amitava Roy', role: 'Principal Investigator', department: 'Civil Engineering', institution: 'BIT Mesra' },
              { name: 'Rahul Sharma', role: 'IoT Lead', department: 'Electronics Engineering', institution: 'BIT Mesra' }
            ],
            techStack: ['Solar PV', 'Activated Alumina', 'LoRaWAN Edge Node'],
            estimatedBudget: 1250000,
            timelineMonths: 4,
            submissionDate: new Date('2026-05-25'),
            status: 'approved'
          }
        ],
        industryPartners: [
          {
            partnerId: 'tata_steel_foundation',
            name: 'Tata Steel Foundation',
            grantAmount: 1250000,
            status: 'completed',
            mentorAssigned: 'Saurav Roy',
            pledgedAt: new Date('2026-06-01')
          }
        ],
        milestones: [
          { id: 'M1', title: 'Hydrogeological mapping & fluoride benchmarking', targetDate: '2026-06-15', status: 'completed', progress: 100 },
          { id: 'M2', title: 'Solar filtration unit bench & flow testing', targetDate: '2026-07-05', status: 'completed', progress: 100 },
          { id: 'M3', title: 'On-site installation at Dormba check-dam', targetDate: '2026-07-28', status: 'completed', progress: 100 },
          { id: 'M4', title: 'Water quality certification by State Testing Lab', targetDate: '2026-08-10', status: 'completed', progress: 100 }
        ],
        socialImpact: {
          beneficiariesReached: 2400,
          economicSavingsInr: 1650000,
          metricName: 'Clean Drinking Water Delivered Daily',
          metricValue: '45,000 Litres/Day',
          carbonReductionTons: 22,
          sdgGoals: [6, 3, 1]
        },
        auditHistory: [
          { timestamp: new Date('2026-08-12'), officer: 'State Validation Board', role: 'government', action: 'Solution Certified & Deployed', note: 'Fluoride level verified at 0.42 mg/L. Full statewide replication approved.' }
        ]
      },

      // ======================= SOLVED CHALLENGE 2 =======================
      {
        ticketId: 'JH-AGR-4091',
        title: 'Post-Harvest Cold Storage & Mahua Processing Technology for Tribal Women SHGs',
        description: 'Over 1,850 tribal women collectors in Latehar experienced 65% post-harvest spoilage and distress selling of Mahua flowers and perishables due to lack of zero-grid cold storage.',
        domain: 'Agriculture',
        location: {
          district: 'Latehar',
          block: 'Mahuadanr',
          panchayat: 'Orsa',
          state: 'Jharkhand',
          lat: 23.7431,
          lng: 84.4983,
          address: 'Mahuadanr Forest Produce Collection Center',
          pincode: '822119',
          geoPoint: { type: 'Point', coordinates: [84.4983, 23.7431] }
        },
        submitter: {
          name: 'Sita Devi (Latehar Mahila Kisan Samiti)',
          role: 'community_org',
          organization: 'Tribal Women SHG Federation',
          phone: '+91 94312 44321',
          email: 'citizen@sih2026.gov.in'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
            caption: 'Mahua Solar-Biomass Storage Facility',
            uploadedAt: new Date('2026-04-15')
          }
        ],
        aiAnalysis: {
          domain: 'Agriculture',
          category: 'Phase-Change Material Solar-Thermal Cold Chamber & Mechanized Solar Dryer',
          severity: 8.7,
          confidence: 0.95,
          urgency: 'High',
          recommendedDisciplines: ['Agro-Processing & Food Technology', 'Solar Thermal Engineering', 'Rural Livelihoods'],
          recommendedUniversities: [
            { universityId: 'bau_ranchi', name: 'BAU Ranchi', matchScore: 97, rationale: 'Centre of Tribal Crop Resilience' }
          ],
          tags: ['AgriTech', 'Mahua Processing', 'Phase Change Cold Room', 'SDG-2', 'SDG-5'],
          summary: 'Solar micro cold unit equipped with thermal phase-change buffer ensures 4°C storage for 18 hours without electricity.'
        },
        status: 'validated',
        resolutionStatus: 'solved',
        priority: 'High',
        allocatedUniversity: {
          universityId: 'bau_ranchi',
          name: 'Birsa Agricultural University (BAU) Kanke',
          facultyLead: { name: 'Dr. Sunita Murmu', email: 'smurmu@bauranchi.org', department: 'Plant Pathology & Agronomy' },
          allocatedAt: new Date('2026-04-20')
        },
        proposals: [
          {
            id: 'PROP-JH-AGR-4091',
            title: 'Off-Grid Phase-Change Thermal Cold Chamber & Solar Dehydrator',
            abstract: 'Constructed 5 Metric Ton PCM-based cold storage maintaining 4-8°C with hybrid solar-biomass backup, increasing tribal farm-gate realization by 42%.',
            teamLead: 'Anand Mahto (B.Tech Agri)',
            facultyAdvisor: 'Dr. Sunita Murmu',
            multidisciplinaryTeam: [
              { name: 'Dr. Sunita Murmu', role: 'Lead Agronomist', department: 'Agronomy', institution: 'BAU Ranchi' },
              { name: 'Dr. Vivek Pandey', role: 'Thermal Consultant', department: 'Mechanical Eng', institution: 'NIT Jamshedpur' }
            ],
            techStack: ['Phase Change Material', 'Solar Thermal Collector', 'IoT Temperature Logger'],
            estimatedBudget: 1480000,
            timelineMonths: 4,
            submissionDate: new Date('2026-04-28'),
            status: 'approved'
          }
        ],
        industryPartners: [
          {
            partnerId: 'tata_steel_foundation',
            name: 'Tata Steel Foundation',
            grantAmount: 1480000,
            status: 'completed',
            mentorAssigned: 'Debdoot Mohanty',
            pledgedAt: new Date('2026-05-05')
          }
        ],
        milestones: [
          { id: 'M1', title: 'Design & PCM thermal simulation', targetDate: '2026-05-20', status: 'completed', progress: 100 },
          { id: 'M2', title: 'Cold chamber fabrication at Mahuadanr center', targetDate: '2026-06-15', status: 'completed', progress: 100 },
          { id: 'M3', title: 'SHG women operational training & pilot trials', targetDate: '2026-07-10', status: 'completed', progress: 100 },
          { id: 'M4', title: 'Economic impact & spoilage reduction certification', targetDate: '2026-08-01', status: 'completed', progress: 100 }
        ],
        socialImpact: {
          beneficiariesReached: 1850,
          economicSavingsInr: 2850000,
          metricName: 'Produce Shelf-Life Extension',
          metricValue: 'From 3 Days to 28 Days',
          carbonReductionTons: 16,
          sdgGoals: [2, 5, 8]
        },
        auditHistory: [
          { timestamp: new Date('2026-08-05'), officer: 'Dept. of Agriculture, Jharkhand', role: 'government', action: 'Project Validated & Certified', note: 'Over 1,850 women farmers benefiting. Zero electricity operational expenditure.' }
        ]
      },

      // ======================= SOLVED CHALLENGE 3 =======================
      {
        ticketId: 'JH-HLT-5012',
        title: 'Autonomous Drone Medical Logistics & Sickle Cell Diagnostics in Remote Hilly Hamlets',
        description: 'Over 8,200 tribal residents in Netarhat hills lacked emergency antivenom, vaccine cold-chain access, and on-site sickle cell anemia screening due to dense forest roads.',
        domain: 'Healthcare',
        location: {
          district: 'Latehar',
          block: 'Garu',
          panchayat: 'Netarhat',
          state: 'Jharkhand',
          lat: 23.4795,
          lng: 84.2678,
          address: 'Garu Primary Health Center & Hilly Tribal Hamlets',
          pincode: '822123',
          geoPoint: { type: 'Point', coordinates: [84.2678, 23.4795] }
        },
        submitter: {
          name: 'Dr. Alok Tirkey (Medical Officer In-Charge)',
          role: 'govt_department',
          organization: 'Garu Primary Health Center',
          phone: '+91 94314 88765',
          email: 'govt@sih2026.gov.in'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1200&q=80',
            caption: 'Autonomous Medical Drone Docking Station',
            uploadedAt: new Date('2026-03-10')
          }
        ],
        aiAnalysis: {
          domain: 'Healthcare',
          category: 'Long-Range Autonomous VTOL UAV Delivery & Paper-Microfluidic Diagnostics',
          severity: 9.4,
          confidence: 0.98,
          urgency: 'Critical',
          recommendedDisciplines: ['Biomedical Diagnostics', 'Autonomous UAV Robotics', 'Community Medicine'],
          recommendedUniversities: [
            { universityId: 'rims_ranchi', name: 'RIMS Ranchi', matchScore: 98, rationale: 'Centre for Tribal Health & Sickle Cell Diagnostics' }
          ],
          tags: ['MedTech', 'Drone Logistics', 'Sickle Cell', 'Point of Care', 'SDG-3'],
          summary: 'VTOL medical drone network cuts transit from 4 hours to 14 minutes with point-of-care sickle cell test strips.'
        },
        status: 'validated',
        resolutionStatus: 'solved',
        priority: 'Critical',
        allocatedUniversity: {
          universityId: 'rims_ranchi',
          name: 'Rajendra Institute of Medical Sciences (RIMS) Ranchi',
          facultyLead: { name: 'Dr. Sanjay Kumar', email: 'skumar@rimsranchi.ac.in', department: 'Community Medicine' },
          allocatedAt: new Date('2026-03-15')
        },
        proposals: [
          {
            id: 'PROP-JH-HLT-5012',
            title: 'Drone-Assisted Tribal Emergency Medical Courier & Rapid Anemia Diagnostics',
            abstract: 'Operated 35 km BVLOS autonomous medical delivery drone paired with paper-microfluidic test strips delivering 200+ emergency doses in tribal pockets.',
            teamLead: 'Kunal Sen (Biomedical Eng)',
            facultyAdvisor: 'Dr. Sanjay Kumar',
            multidisciplinaryTeam: [
              { name: 'Dr. Sanjay Kumar', role: 'Principal Investigator', department: 'Community Medicine', institution: 'RIMS Ranchi' },
              { name: 'Kunal Sen', role: 'Drone Telemetry Lead', department: 'Electronics Eng', institution: 'BIT Mesra' }
            ],
            techStack: ['VTOL UAV', 'Active Temperature Vaccine Box', 'Paper Microfluidics'],
            estimatedBudget: 2450000,
            timelineMonths: 5,
            submissionDate: new Date('2026-03-22'),
            status: 'approved'
          }
        ],
        industryPartners: [
          {
            partnerId: 'coal_india_csr',
            name: 'Coal India Limited (CIL) / BCCL CSR Division',
            grantAmount: 2450000,
            status: 'completed',
            mentorAssigned: 'B. K. Tripathy',
            pledgedAt: new Date('2026-03-30')
          }
        ],
        milestones: [
          { id: 'M1', title: 'GPS Corridor mapping & DGCA clearance', targetDate: '2026-04-15', status: 'completed', progress: 100 },
          { id: 'M2', title: '50-Flight trial with temperature sensor payloads', targetDate: '2026-05-10', status: 'completed', progress: 100 },
          { id: 'M3', title: 'Screening 3,000 students for sickle cell trait', targetDate: '2026-06-20', status: 'completed', progress: 100 },
          { id: 'M4', title: 'Live emergency dispatch validation by Civil Surgeon', targetDate: '2026-07-15', status: 'completed', progress: 100 }
        ],
        socialImpact: {
          beneficiariesReached: 8200,
          economicSavingsInr: 4100000,
          metricName: 'Emergency Medical Transit Time Reduced',
          metricValue: 'From 240 mins to 14 mins',
          carbonReductionTons: 8,
          sdgGoals: [3, 10, 1]
        },
        auditHistory: [
          { timestamp: new Date('2026-07-20'), officer: 'Dept. of Health, Govt of Jharkhand', role: 'government', action: 'Certified for Statewide Scaling', note: 'Zero transit failure across 180 flight missions.' }
        ]
      },

      // ======================= SOLVED CHALLENGE 4 =======================
      {
        ticketId: 'JH-ENV-3104',
        title: 'Subterranean Mine Fire Tomography & Fly-Ash Grout Encapsulation',
        description: 'Underground coal fires in Jharia posed critical land subsidence and toxic gas hazards to 12,000 residents living along Ghanudih mining fringes.',
        domain: 'Environment',
        location: {
          district: 'Dhanbad',
          block: 'Jharia',
          panchayat: 'Ghanudih',
          state: 'Jharkhand',
          lat: 23.7957,
          lng: 86.4304,
          address: 'Ghanudih Colliery Mine Boundary',
          pincode: '828111',
          geoPoint: { type: 'Point', coordinates: [86.4304, 23.7957] }
        },
        submitter: {
          name: 'Rameshwar Singh (Community Activist)',
          role: 'community_org',
          organization: 'Jharia Coalfield Bachao Samiti',
          phone: '+91 94315 77890',
          email: 'citizen@sih2026.gov.in'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
            caption: 'Underground Thermal Contouring & Nitrogen Grout Borehole',
            uploadedAt: new Date('2026-02-10')
          }
        ],
        aiAnalysis: {
          domain: 'Environment',
          category: 'Thermal InSAR Satellite Tomography & High-Pressure Nitrogen-Foam Grout',
          severity: 9.7,
          confidence: 0.98,
          urgency: 'Critical',
          recommendedDisciplines: ['Mining & Geo-Engineering', 'Applied Geophysics', 'Hazard Mitigation'],
          recommendedUniversities: [
            { universityId: 'iit_ism_dhanbad', name: 'IIT (ISM) Dhanbad', matchScore: 98, rationale: 'Centre of Mining Fire & Hazard Mitigation' }
          ],
          tags: ['Mine Fire', 'InSAR Satellite', 'Thermal Grout', 'Disaster Mitigation', 'SDG-11'],
          summary: 'Multi-borehole nitrogen foam sealant stabilized 14.5 hectares of burning coal strata, dropping ground temp from 180°C to 38°C.'
        },
        status: 'validated',
        resolutionStatus: 'solved',
        priority: 'Critical',
        allocatedUniversity: {
          universityId: 'iit_ism_dhanbad',
          name: 'Indian Institute of Technology (ISM) Dhanbad',
          facultyLead: { name: 'Prof. Rajesh K. Sinha', email: 'rksinha@iitism.ac.in', department: 'Mining Engineering' },
          allocatedAt: new Date('2026-02-18')
        },
        proposals: [
          {
            id: 'PROP-JH-ENV-3104',
            title: 'Subsurface Thermal Tomography & High-Pressure Nitrogen-Foam Encapsulation',
            abstract: 'Injected 12,000 m³ of fly-ash nitrogen composite grout through 32 directional boreholes, completely extinguishing active oxygen intake.',
            teamLead: 'Debashish Bannerjee (Ph.D)',
            facultyAdvisor: 'Prof. Rajesh K. Sinha',
            multidisciplinaryTeam: [
              { name: 'Prof. Rajesh K. Sinha', role: 'Principal Investigator', department: 'Mining Engineering', institution: 'IIT ISM' },
              { name: 'Debashish Bannerjee', role: 'Geophysics Lead', department: 'Applied Geophysics', institution: 'IIT ISM' }
            ],
            techStack: ['Thermal InSAR', 'Borehole Thermistors', 'Nitrogen Foam Grout'],
            estimatedBudget: 3200000,
            timelineMonths: 6,
            submissionDate: new Date('2026-02-25'),
            status: 'approved'
          }
        ],
        industryPartners: [
          {
            partnerId: 'coal_india_csr',
            name: 'Coal India Limited (CIL) / BCCL CSR Division',
            grantAmount: 3200000,
            status: 'completed',
            mentorAssigned: 'B. K. Tripathy',
            pledgedAt: new Date('2026-03-05')
          }
        ],
        milestones: [
          { id: 'M1', title: '3D isothermal contour tomography', targetDate: '2026-03-25', status: 'completed', progress: 100 },
          { id: 'M2', title: 'Directional drilling of 32 grout boreholes', targetDate: '2026-04-30', status: 'completed', progress: 100 },
          { id: 'M3', title: 'Nitrogen-foam fly ash slurry injection', targetDate: '2026-06-15', status: 'completed', progress: 100 },
          { id: 'M4', title: 'Thermal subsidence stability certification', targetDate: '2026-07-20', status: 'completed', progress: 100 }
        ],
        socialImpact: {
          beneficiariesReached: 12000,
          economicSavingsInr: 9200000,
          metricName: 'Hazardous Fire Land Stabilized',
          metricValue: '14.5 Hectares',
          carbonReductionTons: 350,
          sdgGoals: [11, 13, 3]
        },
        auditHistory: [
          { timestamp: new Date('2026-07-25'), officer: 'Directorate General of Mines Safety (DGMS)', role: 'government', action: 'Thermal Stabilization Certified', note: 'Zero subsurface smoke resurgence detected for 90 days.' }
        ]
      },

      // ======================= SOLVED CHALLENGE 5 =======================
      {
        ticketId: 'JH-NRG-6023',
        title: 'Off-Grid Smart DC Microgrid & Solar-Pumping for Tribal Hill Topography',
        description: '320 tribal families in high-altitude Bishunpur hamlets suffered chronic lack of lighting and irrigation due to steep mountainous terrain preventing grid pole installation.',
        domain: 'Energy',
        location: {
          district: 'Gumla',
          block: 'Bishunpur',
          panchayat: 'Banari',
          state: 'Jharkhand',
          lat: 23.3854,
          lng: 84.3647,
          address: 'Banari High-Altitude Tribal Cluster',
          pincode: '835302',
          geoPoint: { type: 'Point', coordinates: [84.3647, 23.3854] }
        },
        submitter: {
          name: 'Shankar Asur (Gram Pradhan)',
          role: 'pri_panchayat',
          organization: 'Asur Tribal Livelihoods Committee',
          phone: '+91 94317 22119',
          email: 'panchayat@sih2026.gov.in'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
            caption: '25 kWp Solar DC Nanogrid Installation',
            uploadedAt: new Date('2026-01-20')
          }
        ],
        aiAnalysis: {
          domain: 'Energy',
          category: 'Hybrid Solar PV-Biomass DC Nanogrid & IoT Smart Prepaid Energy Metering',
          severity: 8.9,
          confidence: 0.97,
          urgency: 'High',
          recommendedDisciplines: ['Electrical & Power Systems', 'Renewable Energy Technologies', 'Embedded IoT Systems'],
          recommendedUniversities: [
            { universityId: 'nit_jamshedpur', name: 'NIT Jamshedpur', matchScore: 96, rationale: 'Centre for Appropriate Rural Machinery & Microgrids' }
          ],
          tags: ['Energy', 'Solar Microgrid', 'DC Nanogrid', 'Asur Tribal Uplift', 'SDG-7'],
          summary: '25 kWp solar microgrid with DC-to-DC distribution provides 24x7 electricity to 320 homes and 4 lift-irrigation pump heads.'
        },
        status: 'validated',
        resolutionStatus: 'solved',
        priority: 'High',
        allocatedUniversity: {
          universityId: 'nit_jamshedpur',
          name: 'National Institute of Technology (NIT) Jamshedpur',
          facultyLead: { name: 'Dr. Vivek Pandey', email: 'vpandey@nitjsr.ac.in', department: 'Mechanical & Electrical Engineering' },
          allocatedAt: new Date('2026-01-28')
        },
        proposals: [
          {
            id: 'PROP-JH-NRG-6023',
            title: 'Decentralized 48V DC Solar-Biomass Microgrid for Tribal Hill Topography',
            abstract: 'Designed and installed 25 kWp modular DC nanogrid eliminating AC conversion losses and powering 320 tribal households with smart prepaid RFID keys.',
            teamLead: 'Suman Mahato (M.Tech Power Systems)',
            facultyAdvisor: 'Dr. Vivek Pandey',
            multidisciplinaryTeam: [
              { name: 'Dr. Vivek Pandey', role: 'Principal Investigator', department: 'Electrical Eng', institution: 'NIT Jamshedpur' },
              { name: 'Suman Mahato', role: 'Power Hardware Lead', department: 'Electrical Eng', institution: 'NIT Jamshedpur' }
            ],
            techStack: ['48V DC Bus', 'Solar PV 25kWp', 'Smart RFID Prepaid Energy Meter'],
            estimatedBudget: 1820000,
            timelineMonths: 4,
            submissionDate: new Date('2026-02-05'),
            status: 'approved'
          }
        ],
        industryPartners: [
          {
            partnerId: 'jspl_csr',
            name: 'Jindal Steel & Power Foundation (JSPL CSR)',
            grantAmount: 1820000,
            status: 'completed',
            mentorAssigned: 'Alok Kumar',
            pledgedAt: new Date('2026-02-12')
          }
        ],
        milestones: [
          { id: 'M1', title: 'Terrain load calculation & solar irradiance study', targetDate: '2026-03-01', status: 'completed', progress: 100 },
          { id: 'M2', title: 'Solar array & DC distribution cabling', targetDate: '2026-04-10', status: 'completed', progress: 100 },
          { id: 'M3', title: 'Lift irrigation pump head integration', targetDate: '2026-05-15', status: 'completed', progress: 100 },
          { id: 'M4', title: 'Village energy committee handover & certification', targetDate: '2026-06-10', status: 'completed', progress: 100 }
        ],
        socialImpact: {
          beneficiariesReached: 1950,
          economicSavingsInr: 1850000,
          metricName: 'Renewable Power Generated Annually',
          metricValue: '36,500 kWh/Year',
          carbonReductionTons: 38,
          sdgGoals: [7, 1, 13]
        },
        auditHistory: [
          { timestamp: new Date('2026-06-15'), officer: 'JREDA (Jharkhand Renewable Energy Development Agency)', role: 'government', action: 'Microgrid Certified Active', note: '100% household electrification achieved in remote Banari.' }
        ]
      },

      // ======================= SOLVED CHALLENGE 6 =======================
      {
        ticketId: 'JH-URB-7088',
        title: 'Industrial Blast-Furnace Slag Geopolymer Permeable Pavement for Urban Flood Control',
        description: 'Severe urban waterlogging and accumulation of 45,000 tonnes of steel slag along Sakchi and Bistupur roads caused road collapses and traffic gridlock during monsoon.',
        domain: 'Urban Development',
        location: {
          district: 'East Singhbhum',
          block: 'Jamshedpur',
          panchayat: 'Sakchi',
          state: 'Jharkhand',
          lat: 22.8046,
          lng: 86.2029,
          address: 'Sakchi-Bistupur Urban Corridor',
          pincode: '831001',
          geoPoint: { type: 'Point', coordinates: [86.2029, 22.8046] }
        },
        submitter: {
          name: 'Pravin Murmu (Urban Executive Engineer)',
          role: 'ulb_urban_body',
          organization: 'Jamshedpur Notified Area Committee (JNAC)',
          phone: '+91 657 2223344',
          email: 'govt@sih2026.gov.in'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
            caption: 'Slag Geopolymer Permeable Road Pavement Test Bed',
            uploadedAt: new Date('2026-01-15')
          }
        ],
        aiAnalysis: {
          domain: 'Urban Development',
          category: 'Circular Economy Blast Furnace Slag Geopolymer Concrete & Subsurface Recharge',
          severity: 8.4,
          confidence: 0.94,
          urgency: 'Medium',
          recommendedDisciplines: ['Civil & Structural Engineering', 'Materials Science & Metallurgy', 'Urban Hydrology'],
          recommendedUniversities: [
            { universityId: 'bit_mesra', name: 'BIT Mesra', matchScore: 94, rationale: 'Centre of Advanced Civil Materials' }
          ],
          tags: ['Circular Economy', 'Slag Concrete', 'Permeable Pavement', 'Urban Flood', 'SDG-11', 'SDG-9'],
          summary: 'Permeable geopolymer pavement manufactured from 85% recycled industrial slag absorbs 1,200 L/min of runoff.'
        },
        status: 'validated',
        resolutionStatus: 'solved',
        priority: 'Medium',
        allocatedUniversity: {
          universityId: 'bit_mesra',
          name: 'Birla Institute of Technology (BIT) Mesra',
          facultyLead: { name: 'Dr. Amitava Roy', email: 'aroy@bitmesra.ac.in', department: 'Civil & Environmental Engineering' },
          allocatedAt: new Date('2026-01-22')
        },
        proposals: [
          {
            id: 'PROP-JH-URB-7088',
            title: 'Circular Economy High-Permeability Slag Pavement for Stormwater Harvesting',
            abstract: 'Paved 4.2 km test corridor using blast-furnace slag activated with fly ash geopolymer, preventing urban inundation and recharging the Subarnarekha aquifer.',
            teamLead: 'Rohit Agarwal (M.Tech Structural)',
            facultyAdvisor: 'Dr. Amitava Roy',
            multidisciplinaryTeam: [
              { name: 'Dr. Amitava Roy', role: 'Principal Investigator', department: 'Civil Engineering', institution: 'BIT Mesra' },
              { name: 'Rohit Agarwal', role: 'Materials Lead', department: 'Materials Science', institution: 'BIT Mesra' }
            ],
            techStack: ['Blast Furnace Slag', 'Fly Ash Geopolymer', 'Subsurface Infiltration Probes'],
            estimatedBudget: 2200000,
            timelineMonths: 5,
            submissionDate: new Date('2026-02-01'),
            status: 'approved'
          }
        ],
        industryPartners: [
          {
            partnerId: 'tata_steel_foundation',
            name: 'Tata Steel Foundation',
            grantAmount: 2200000,
            status: 'completed',
            mentorAssigned: 'Saurav Roy',
            pledgedAt: new Date('2026-02-10')
          }
        ],
        milestones: [
          { id: 'M1', title: 'Slag chemistry & compressive strength optimization', targetDate: '2026-03-01', status: 'completed', progress: 100 },
          { id: 'M2', title: 'Pilot paving along 4.2 km corridor', targetDate: '2026-04-20', status: 'completed', progress: 100 },
          { id: 'M3', title: 'Heavy monsoon storm permeability testing', targetDate: '2026-06-15', status: 'completed', progress: 100 },
          { id: 'M4', title: 'Municipal drainage & ground recharge certification', targetDate: '2026-07-10', status: 'completed', progress: 100 }
        ],
        socialImpact: {
          beneficiariesReached: 35000,
          economicSavingsInr: 3400000,
          metricName: 'Industrial Slag Recycled into Infrastructure',
          metricValue: '3,800 Metric Tons',
          carbonReductionTons: 85,
          sdgGoals: [11, 9, 12]
        },
        auditHistory: [
          { timestamp: new Date('2026-07-15'), officer: 'Urban Development & Housing Dept. (UDHD)', role: 'government', action: 'Pavement Innovation Certified', note: 'Zero waterlogging recorded during 140mm rainfall event. Scaled to Ranchi Smart City.' }
        ]
      },

      // ======================= ACTIVE UNSOLVED CHALLENGE 1 =======================
      {
        ticketId: 'JH-EDU-8102',
        title: 'Multi-Lingual Speech AI for Santhali & Ho Tribal Primary School Literacy',
        description: 'Over 6,400 primary school children in Dumka and Godda face high dropout rates due to lack of interactive digital learning in indigenous Santhali (Ol Chiki) and Ho languages.',
        domain: 'Education',
        location: {
          district: 'Dumka',
          block: 'Shikaripara',
          panchayat: 'Haripur',
          state: 'Jharkhand',
          lat: 24.2694,
          lng: 87.2471,
          address: 'Haripur Tribal Primary School Cluster',
          pincode: '814101',
          geoPoint: { type: 'Point', coordinates: [87.2471, 24.2694] }
        },
        submitter: {
          name: 'Sunil Soren (Gram Pradhan)',
          role: 'pri_panchayat',
          organization: 'Dumka Tribal Education Committee',
          phone: '+91 94318 99881',
          email: 'citizen@sih2026.gov.in'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
            caption: 'Primary School Ol Chiki Classroom',
            uploadedAt: new Date('2026-08-01')
          }
        ],
        aiAnalysis: {
          domain: 'Education',
          category: 'Indigenous Multi-Lingual Speech AI & Interactive Audio-Visual Tablet',
          severity: 8.1,
          confidence: 0.93,
          urgency: 'Medium',
          recommendedDisciplines: ['Speech AI & Computational Linguistics', 'Computer Science', 'Tribal Languages'],
          recommendedUniversities: [
            { universityId: 'bit_mesra', name: 'BIT Mesra', matchScore: 92, rationale: 'Speech AI & NLP Laboratory' }
          ],
          tags: ['Santhali', 'Ol Chiki', 'Speech AI', 'Foundational Literacy', 'SDG-4'],
          summary: 'Developing speech-to-text educational companion for foundational multilingual tribal literacy.'
        },
        status: 'in_progress',
        resolutionStatus: 'unsolved',
        priority: 'Medium',
        allocatedUniversity: {
          universityId: 'bit_mesra',
          name: 'Birla Institute of Technology (BIT) Mesra',
          facultyLead: { name: 'Dr. Priya Sengupta', email: 'psengupta@bitmesra.ac.in', department: 'Computer Science & AI' },
          allocatedAt: new Date('2026-08-10')
        },
        proposals: [
          {
            id: 'PROP-JH-EDU-8102',
            title: 'Ol Chiki Speech AI Audio Companion for Foundational Literacy',
            abstract: 'Building offline mobile speech recognition model for tribal dialects with interactive gamified phonetics.',
            teamLead: 'Aman Hembrom (B.Tech CSE)',
            facultyAdvisor: 'Dr. Priya Sengupta',
            multidisciplinaryTeam: [
              { name: 'Dr. Priya Sengupta', role: 'PI', department: 'Computer Science', institution: 'BIT Mesra' }
            ],
            techStack: ['Whisper Fine-Tuning', 'React Native', 'Offline SQLite'],
            estimatedBudget: 650000,
            timelineMonths: 4,
            submissionDate: new Date('2026-08-15'),
            status: 'approved'
          }
        ],
        industryPartners: [
          {
            partnerId: 'sail_csr',
            name: 'Steel Authority of India Limited (SAIL) - Bokaro Division',
            grantAmount: 650000,
            status: 'pledged',
            mentorAssigned: 'Meena Hembrom',
            pledgedAt: new Date('2026-08-18')
          }
        ],
        milestones: [
          { id: 'M1', title: '5,000-Hour Santhali audio corpus curation', targetDate: '2026-09-01', status: 'in_progress', progress: 45 },
          { id: 'M2', title: 'Offline mobile APK prototype deployment', targetDate: '2026-10-15', status: 'pending', progress: 0 }
        ],
        socialImpact: {
          beneficiariesReached: 6400,
          economicSavingsInr: 950000,
          metricName: 'Tribal Foundational Literacy Uplift',
          metricValue: '6,400 Students Targeted',
          carbonReductionTons: 2,
          sdgGoals: [4, 10]
        },
        auditHistory: [
          { timestamp: new Date('2026-08-01'), officer: 'Sunil Soren', role: 'citizen', action: 'Problem Statement Registered', note: 'Submitted with village classroom evidence.' }
        ]
      },

      // ======================= ACTIVE UNSOLVED CHALLENGE 2 =======================
      {
        ticketId: 'JH-ACC-9045',
        title: 'LiDAR-Haptic Wearable Assistive Band for Divyangjan Mobility in Rural Topography',
        description: 'Over 4,100 visually impaired citizens in rural Ranchi and Khunti face severe mobility hazards due to unpaved hilly paths, uneven drains, and absence of audio beacons.',
        domain: 'Accessibility',
        location: {
          district: 'Ranchi',
          block: 'Bero',
          panchayat: 'Kero',
          state: 'Jharkhand',
          lat: 23.2755,
          lng: 85.0423,
          address: 'Bero Divyangjan Community Center',
          pincode: '835202',
          geoPoint: { type: 'Point', coordinates: [85.0423, 23.2755] }
        },
        submitter: {
          name: 'Nirmal Toppo (Divyangjan Welfare Samiti)',
          role: 'community_org',
          organization: 'Jharkhand Divyangjan Federation',
          phone: '+91 94319 77654',
          email: 'citizen@sih2026.gov.in'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
            caption: 'Divyangjan Mobility Pathway Challenge',
            uploadedAt: new Date('2026-08-12')
          }
        ],
        aiAnalysis: {
          domain: 'Accessibility',
          category: 'Smart Solid-State LiDAR Haptic Feedback Wristband & Voice Spatial Beacon',
          severity: 8.6,
          confidence: 0.95,
          urgency: 'High',
          recommendedDisciplines: ['Biomedical & Assistive Robotics', 'Embedded Electronics', 'Ergonomics'],
          recommendedUniversities: [
            { universityId: 'nit_jamshedpur', name: 'NIT Jamshedpur', matchScore: 94, rationale: 'Assistive Device Design Hub' }
          ],
          tags: ['Divyangjan', 'LiDAR Haptic', 'Assistive Tech', 'SDG-10'],
          summary: 'Low-cost wearable solid-state LiDAR band providing vibration depth cues to avoid potholes and obstacles.'
        },
        status: 'ai_triage',
        resolutionStatus: 'unsolved',
        priority: 'High',
        allocatedUniversity: {
          universityId: 'nit_jamshedpur',
          name: 'National Institute of Technology (NIT) Jamshedpur',
          facultyLead: { name: 'Dr. Vivek Pandey', email: 'vpandey@nitjsr.ac.in', department: 'Mechanical & Mechatronics' },
          allocatedAt: new Date('2026-08-20')
        },
        proposals: [],
        industryPartners: [],
        milestones: [
          { id: 'M1', title: 'Solid-state LiDAR sensor calibration', targetDate: '2026-09-15', status: 'pending', progress: 10 }
        ],
        socialImpact: {
          beneficiariesReached: 4100,
          economicSavingsInr: 1200000,
          metricName: 'Visually Impaired Individuals Empowered',
          metricValue: '4,100 Beneficiaries',
          carbonReductionTons: 1,
          sdgGoals: [10, 3]
        },
        auditHistory: [
          { timestamp: new Date('2026-08-12'), officer: 'Nirmal Toppo', role: 'citizen', action: 'Problem Statement Registered', note: 'AI automatically classified under Accessibility domain.' }
        ]
      }
    ];

    await Problem.insertMany(problems);
    console.log(`[Seed] Successfully created ${problems.length} societal problem statements (6 Solved, 2 Unsolved).`);

    console.log('====================================================');
    console.log('✨ SIH 2026 DATABASE SEEDED SUCCESSFULLY! ✨');
    console.log('====================================================');
    console.log('Test User Credentials:');
    console.log('1. Citizen:      citizen@sih2026.gov.in     / Citizen@2026');
    console.log('2. Panchayat:    panchayat@sih2026.gov.in   / Panchayat@2026');
    console.log('3. Government:   govt@sih2026.gov.in        / Govt@2026');
    console.log('4. University:   university@sih2026.gov.in  / Univ@2026');
    console.log('5. Industry CSR: industry@sih2026.gov.in    / Industry@2026');
    console.log('6. Admin:        admin@sih2026.gov.in       / Admin@2026');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
