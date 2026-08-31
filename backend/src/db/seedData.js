import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import University from '../models/University.js';
import IndustryPartner from '../models/IndustryPartner.js';
import Proposal from '../models/Proposal.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to database:', mongoose.connection.name);

    // 1. Clear existing collections and drop legacy indexes
    try {
      await mongoose.connection.collection('universities').dropIndexes();
    } catch (e) {}
    try {
      await mongoose.connection.collection('problems').dropIndexes();
    } catch (e) {}
    try {
      await mongoose.connection.collection('proposals').dropIndexes();
    } catch (e) {}
    try {
      await mongoose.connection.collection('users').dropIndexes();
    } catch (e) {}
    try {
      await mongoose.connection.collection('industrypartners').dropIndexes();
    } catch (e) {}
    try {
      await mongoose.connection.collection('locations').dropIndexes();
    } catch (e) {}

    await User.deleteMany({});
    await Problem.deleteMany({});
    await University.deleteMany({});
    await IndustryPartner.deleteMany({});
    await Proposal.deleteMany({});
    console.log('[Seed] Cleared existing data collections and dropped legacy indexes.');

    // 2. Hash Password Generator
    const salt = await bcrypt.genSalt(10);
    const hash = (pwd) => bcrypt.hash(pwd, salt);

    // 3. Fixed ObjectIds for deterministic references
    const ID_BIT_MESRA = new mongoose.Types.ObjectId('6a8feb364bd1960adfba8a7a');
    const ID_IIT_ISM = new mongoose.Types.ObjectId('6a8feb364bd1960adfba8a7c');
    const ID_BAU_KANKE = new mongoose.Types.ObjectId('6a8feb364bd1960adfba8a7d');
    const ID_NIT_JSR = new mongoose.Types.ObjectId('6a8feb364bd1960adfba8a7e');
    const ID_RIMS_RANCHI = new mongoose.Types.ObjectId('6a8feb364bd1960adfba8a7f');
    const ID_ELITTE_ENG = new mongoose.Types.ObjectId('6a8feb364bd1960adfba8a7b');

    const ID_TATA_STEEL = new mongoose.Types.ObjectId('6a900e0f8904bbf5d163336a');
    const ID_COAL_INDIA = new mongoose.Types.ObjectId('6a900e0f8904bbf5d163336b');
    const ID_SAIL_BOKARO = new mongoose.Types.ObjectId('6a900e0f8904bbf5d163336d');
    const ID_JSPL_FOUNDATION = new mongoose.Types.ObjectId('6a900e0f8904bbf5d163336e');
    const ID_WAYNE_ENTERPRISE = new mongoose.Types.ObjectId('6a900e0f8904bbf5d163336c');

    const ID_CITIZEN_USER = new mongoose.Types.ObjectId('6a8f979344a88f09289b5616');
    const ID_PANCHAYAT_USER = new mongoose.Types.ObjectId('6a8f979344a88f09289b5617');
    const ID_GOVT_USER = new mongoose.Types.ObjectId('6a8f979344a88f09289b5618');
    const ID_UNIV_USER = new mongoose.Types.ObjectId('6a8f979344a88f09289b5619');
    const ID_IND_USER = new mongoose.Types.ObjectId('6a8f979344a88f09289b561a');
    const ID_ADMIN_USER = new mongoose.Types.ObjectId('6a8f979344a88f09289b561b');

    // 4. Create Persona Test Users
    const users = [
      {
        _id: ID_CITIZEN_USER,
        name: 'Gopal Kundu (Citizen)',
        email: 'citizen@sih2026.gov.in',
        password: await hash('Citizen@2026'),
        role: 'citizen',
        organization: 'Jharkhand Citizen Forum',
        district: 'Ranchi',
        phone: '+91 79808 27691'
      },
      {
        _id: ID_PANCHAYAT_USER,
        name: 'Mukesh Bhagat (Mukhiya, Dormba Gram Panchayat)',
        email: 'panchayat@sih2026.gov.in',
        password: await hash('Panchayat@2026'),
        role: 'panchayat',
        organization: 'Dormba Gram Panchayat & Torpa Block BDO',
        district: 'Khunti',
        phone: '+91 94311 55678'
      },
      {
        _id: ID_GOVT_USER,
        name: 'Dr. Manish Ranjan, IAS (Secretary)',
        email: 'govt@sih2026.gov.in',
        password: await hash('Govt@2026'),
        role: 'government',
        organization: 'Government of Jharkhand',
        district: 'Ranchi',
        phone: '+91 651 2400123'
      },
      {
        _id: ID_UNIV_USER,
        name: 'Amitava Roy (Lead Investigator & Professor)',
        email: 'university@sih2026.gov.in',
        password: await hash('Univ@2026'),
        role: 'university',
        organization: 'Birla Institute of Technology (BIT) Mesra',
        district: 'Ranchi',
        phone: '+91 94313 98765',
        university: ID_BIT_MESRA
      },
      {
        _id: ID_IND_USER,
        name: 'Saurav Roy (Chief - Corporate Social Responsibility)',
        email: 'industry@sih2026.gov.in',
        password: await hash('Industry@2026'),
        role: 'industry',
        organization: 'Tata Steel Foundation',
        district: 'East Singhbhum',
        phone: '+91 657 2431234',
        industry: ID_TATA_STEEL
      },
      {
        _id: ID_ADMIN_USER,
        name: 'State Innovation Admin',
        email: 'admin@sih2026.gov.in',
        password: await hash('Admin@2026'),
        role: 'admin',
        organization: 'Jharkhand State Innovation Council',
        district: 'Ranchi',
        phone: '+91 651 2200000'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`[Seed] Created ${createdUsers.length} users.`);

    // 5. Create Universities
    const universities = [
      {
        _id: ID_BIT_MESRA,
        name: 'Birla Institute of Technology (BIT) Mesra',
        location: { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' },
        type: 'Deemed University & Tech Hub',
        availableDomains: ['Water Resources', 'Agriculture', 'Energy', 'Urban Development', 'Others'],
        contactEmail: 'aroy@bitmesra.ac.in',
        registeredBy: ID_UNIV_USER,
        proposals: []
      },
      {
        _id: ID_IIT_ISM,
        name: 'Indian Institute of Technology (ISM) Dhanbad',
        location: { city: 'Dhanbad', district: 'Dhanbad', state: 'Jharkhand' },
        type: 'Institute of National Importance',
        availableDomains: ['Energy', 'Environment', 'Water Resources', 'Others'],
        contactEmail: 'rksinha@iitism.ac.in',
        registeredBy: ID_ADMIN_USER,
        proposals: []
      },
      {
        _id: ID_BAU_KANKE,
        name: 'Birsa Agricultural University (BAU) Kanke',
        location: { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' },
        type: 'Agricultural University',
        availableDomains: ['Agriculture', 'Rural Livelihoods', 'Environment', 'Others'],
        contactEmail: 'smurmu@bauranchi.org',
        registeredBy: ID_ADMIN_USER,
        proposals: []
      },
      {
        _id: ID_NIT_JSR,
        name: 'National Institute of Technology (NIT) Jamshedpur',
        location: { city: 'Jamshedpur', district: 'East Singhbhum', state: 'Jharkhand' },
        type: 'Institute of National Importance',
        availableDomains: ['Energy', 'Urban Development', 'Accessibility', 'Others'],
        contactEmail: 'vpandey@nitjsr.ac.in',
        registeredBy: ID_ADMIN_USER,
        proposals: []
      },
      {
        _id: ID_RIMS_RANCHI,
        name: 'Rajendra Institute of Medical Sciences (RIMS) Ranchi',
        location: { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' },
        type: 'Medical Institution',
        availableDomains: ['Healthcare', 'Accessibility', 'Public Administration', 'Others'],
        contactEmail: 'skumar@rimsranchi.ac.in',
        registeredBy: ID_ADMIN_USER,
        proposals: []
      },
      {
        _id: ID_ELITTE_ENG,
        name: 'Elitte College of Engineering',
        location: { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' },
        type: 'Autonomous College',
        availableDomains: ['Education', 'Urban Development', 'Water Resources', 'Agriculture', 'Others'],
        contactEmail: 'rnd@ece.edu.in',
        registeredBy: ID_ADMIN_USER,
        proposals: []
      }
    ];

    const createdUniversities = await University.insertMany(universities);
    console.log(`[Seed] Created ${createdUniversities.length} universities.`);

    // 6. Create Industry CSR Partners
    const industryPartners = [
      {
        _id: ID_TATA_STEEL,
        partnerId: 'tata_steel_foundation',
        name: 'Tata Steel Foundation',
        type: 'CSR Foundation',
        hqLocation: 'Jamshedpur, East Singhbhum',
        focusDomains: ['Water Resources', 'Agriculture', 'Healthcare', 'Rural Livelihoods', 'Education'],
        availableDomains: ['Water Resources', 'Agriculture', 'Healthcare', 'Rural Livelihoods', 'Education', 'Others'],
        supportCapabilities: ['CSR Grant Co-Funding', 'IoT Sensors & Hardware', 'Field Pilot Infrastructure'],
        csrAnnualBudgetInr: 1250000000,
        activeGrantsCount: 18,
        acceptedProposals: [],
        sendedProposal: [],
        leadMentors: [
          { name: 'Saurav Roy', designation: 'Chief - CSR', domain: 'Water & Rural Development' },
          { name: 'Debdoot Mohanty', designation: 'Head - CSR Programs', domain: 'Tribal Livelihoods & Agro-Processing' }
        ],
        contactEmail: 'csr@tatasteel.com',
        registeredBy: ID_IND_USER
      },
      {
        _id: ID_COAL_INDIA,
        partnerId: 'coal_india_csr',
        name: 'Coal India Limited (CIL) / BCCL CSR Division',
        type: 'Enterprise & PSU',
        hqLocation: 'Dhanbad & Ranchi',
        focusDomains: ['Environment', 'Energy', 'Urban Development', 'Healthcare', 'Water Resources'],
        availableDomains: ['Environment', 'Energy', 'Urban Development', 'Healthcare', 'Water Resources', 'Others'],
        supportCapabilities: ['Heavy Machinery & Drilling', 'CSR Co-Funding', 'Environmental Testing Labs'],
        csrAnnualBudgetInr: 2100000000,
        activeGrantsCount: 24,
        acceptedProposals: [],
        sendedProposal: [],
        leadMentors: [
          { name: 'B. K. Tripathy', designation: 'General Manager (CSR)', domain: 'Mine Environment & Community Infrastructure' }
        ],
        contactEmail: 'csr@coalindia.in',
        registeredBy: ID_ADMIN_USER
      },
      {
        _id: ID_SAIL_BOKARO,
        partnerId: 'sail_csr',
        name: 'Steel Authority of India Limited (SAIL) - Bokaro Division',
        type: 'Enterprise & PSU',
        hqLocation: 'Bokaro Steel City',
        focusDomains: ['Education', 'Accessibility', 'Urban Development', 'Rural Livelihoods'],
        availableDomains: ['Education', 'Accessibility', 'Urban Development', 'Rural Livelihoods', 'Others'],
        supportCapabilities: ['CSR Grant Co-Funding', 'Technical Mentorship', 'Workshop Facilities'],
        csrAnnualBudgetInr: 850000000,
        activeGrantsCount: 11,
        acceptedProposals: [],
        sendedProposal: [],
        leadMentors: [
          { name: 'Meena Hembrom', designation: 'DGM (CSR)', domain: 'Divyangjan Mobility & Skill Development' }
        ],
        contactEmail: 'csr@sail-bokaro.com',
        registeredBy: ID_ADMIN_USER
      },
      {
        _id: ID_JSPL_FOUNDATION,
        partnerId: 'jspl_csr',
        name: 'Jindal Steel & Power Foundation (JSPL CSR)',
        type: 'CSR Foundation',
        hqLocation: 'Ranchi & Godda',
        focusDomains: ['Energy', 'Agriculture', 'Water Resources'],
        availableDomains: ['Energy', 'Agriculture', 'Water Resources', 'Others'],
        supportCapabilities: ['Renewable Energy Equipment', 'CSR Grants', 'Civil Site Support'],
        csrAnnualBudgetInr: 620000000,
        activeGrantsCount: 9,
        acceptedProposals: [],
        sendedProposal: [],
        leadMentors: [
          { name: 'Alok Kumar', designation: 'Head - CSR Jharkhand', domain: 'Renewable Microgrids & Rural Energy' }
        ],
        contactEmail: 'csr@jindalsteel.com',
        registeredBy: ID_ADMIN_USER
      },
      {
        _id: ID_WAYNE_ENTERPRISE,
        partnerId: 'wayne_enterprise_csr',
        name: 'Wayne Enterprise',
        type: 'CSR Foundation',
        hqLocation: 'Bokaro Industrial Area',
        focusDomains: ['Education', 'Urban Development', 'Water Resources', 'Accessibility'],
        availableDomains: ['Education', 'Urban Development', 'Water Resources', 'Accessibility', 'Others'],
        supportCapabilities: ['Rapid Prototyping Lab', 'CSR Co-Funding', 'Cloud & IoT Edge Telemetry'],
        csrAnnualBudgetInr: 500000000,
        activeGrantsCount: 14,
        acceptedProposals: [],
        sendedProposal: [],
        leadMentors: [
          { name: 'Bruce W.', designation: 'Director of Technology & CSR', domain: 'Urban Smart City & IoT Systems' }
        ],
        contactEmail: 'csr@wayneenterprise.com',
        registeredBy: ID_ADMIN_USER
      }
    ];

    const createdIndustryPartners = await IndustryPartner.insertMany(industryPartners);
    console.log(`[Seed] Created ${createdIndustryPartners.length} industry partners.`);

    // 7. Problem ObjectIds
    const P1_ID = new mongoose.Types.ObjectId('6a8f979344a88f09289b5633');
    const P2_ID = new mongoose.Types.ObjectId('6a8f979344a88f09289b563f');
    const P3_ID = new mongoose.Types.ObjectId('6a8f979344a88f09289b564b');
    const P4_ID = new mongoose.Types.ObjectId('6a8f979444a88f09289b5657');
    const P5_ID = new mongoose.Types.ObjectId('6a8f979444a88f09289b5663');
    const P6_ID = new mongoose.Types.ObjectId('6a8f979444a88f09289b566f');
    const P7_ID = new mongoose.Types.ObjectId('6a8f979444a88f09289b567b');
    const P8_ID = new mongoose.Types.ObjectId('6a8f979444a88f09289b5684');
    const P9_ID = new mongoose.Types.ObjectId('6a8feed14bd1960adfba8d3f');
    const P10_ID = new mongoose.Types.ObjectId('6a92bc4e6a3f8457ab8e7d43');
    const P11_ID = new mongoose.Types.ObjectId('6a946b365c2d80074b54e3b5');

    // 8. Proposal ObjectIds
    const PROP1_ID = new mongoose.Types.ObjectId('6a8f979344a88f09289b5636');
    const PROP2_ID = new mongoose.Types.ObjectId('6a8f979344a88f09289b5642');
    const PROP3_ID = new mongoose.Types.ObjectId('6a8f979444a88f09289b564e');
    const PROP4_ID = new mongoose.Types.ObjectId('6a8f979444a88f09289b565a');
    const PROP5_ID = new mongoose.Types.ObjectId('6a8f979444a88f09289b5666');
    const PROP6_ID = new mongoose.Types.ObjectId('6a8f979444a88f09289b5672');
    const PROP7_ID = new mongoose.Types.ObjectId('6a8f979444a88f09289b567e');
    const PROP8_ID = new mongoose.Types.ObjectId('6a8f979444a88f09289b5689');
    const PROP9_ID = new mongoose.Types.ObjectId('6a901d36c3b30f9e31f9b675');
    const PROP10_ID = new mongoose.Types.ObjectId('6a92bc9b6a3f8457ab8e7fae');
    const PROP11_ID = new mongoose.Types.ObjectId('6a946c945c2d80074b54e879');

    const proposals = [
      {
        _id: PROP1_ID,
        problem: P1_ID,
        university: ID_BIT_MESRA,
        title: 'Solar Activated Alumina Fluoride Filter with LoRaWAN Telemetry',
        description: 'Engineered and deployed 45,000 L/day solar activated alumina adsorption filter with hydrostatic telemetry for real-time water quality tracking.',
        problemStatement: 'Geogenic Fluoride Contamination & Pre-Monsoon Drying of Check-Dam Pond',
        domain: 'Water Resources',
        projectDuration: '4 Months',
        estimatedBudget: 1250000,
        peopleImpacted: 2400,
        industrySupportRequired: ['IoT & Embedded Sensors', 'Water Supply & Sluice Gate Fabrication'],
        status: 'completed',
        assignedIndustry: ID_TATA_STEEL,
        industryOffer: {
          industry: ID_TATA_STEEL,
          fundingAmount: 1250000,
          supportDetails: 'Full CSR grant co-sponsorship with activated alumina filter media and ultrasonic water telemetry probes.',
          mentorName: 'Saurav Roy',
          mentorDesignation: 'Chief - CSR',
          mentorEmail: 'csr@tatasteel.com',
          responseStatus: 'accepted',
          responseNote: 'Offer approved and integrated into laboratory testing pipeline.'
        },
        govtApproval: {
          approvedBy: ID_GOVT_USER,
          status: 'approved',
          remarks: 'Sanctioned under Section 135 CSR State Innovation Mandate.',
          sanctionOrderNumber: 'JH-SANCTION-2026-1042',
          approvedAt: new Date('2026-06-05T00:00:00.000Z')
        },
        facultyMembers: [{ name: 'Dr. Amitava Roy', designation: 'Professor & Lead PI', department: 'Civil & Environmental Engineering', email: 'aroy@bitmesra.ac.in' }],
        teamMembers: [{ name: 'Rahul Sharma', rollNo: 'MT/ENV/2026', branch: 'Environmental Engineering', year: 'Final Year' }]
      },
      {
        _id: PROP2_ID,
        problem: P2_ID,
        university: ID_BAU_KANKE,
        title: 'Off-Grid Phase-Change Thermal Cold Chamber & Solar Dehydrator',
        description: 'Constructed 5 Metric Ton PCM-based cold storage maintaining 4-8°C with hybrid solar-biomass backup, increasing tribal farm-gate realization by 42%.',
        problemStatement: 'Post-Harvest Cold Storage & Mahua Processing Technology for Tribal Women SHGs',
        domain: 'Agriculture',
        projectDuration: '4 Months',
        estimatedBudget: 1480000,
        peopleImpacted: 1850,
        industrySupportRequired: ['Agritech Sensor Nodes', 'Solar & Microgrid Hardware'],
        status: 'completed',
        assignedIndustry: ID_TATA_STEEL,
        industryOffer: {
          industry: ID_TATA_STEEL,
          fundingAmount: 1480000,
          supportDetails: 'Phase change material canisters, solar thermal panels, and field training infrastructure.',
          mentorName: 'Debdoot Mohanty',
          mentorDesignation: 'Head - CSR Programs',
          mentorEmail: 'csr@tatasteel.com',
          responseStatus: 'accepted'
        },
        govtApproval: {
          approvedBy: ID_GOVT_USER,
          status: 'approved',
          remarks: 'Approved for statewide tribal SHG deployment.',
          sanctionOrderNumber: 'JH-SANCTION-2026-4091',
          approvedAt: new Date('2026-05-15T00:00:00.000Z')
        },
        facultyMembers: [{ name: 'Dr. Sunita Murmu', designation: 'Professor & Lead PI', department: 'Plant Pathology & Agronomy', email: 'smurmu@bauranchi.org' }],
        teamMembers: [{ name: 'Anand Mahto', rollNo: 'AG/TECH/2026', branch: 'Agricultural Engineering', year: 'Final Year' }]
      },
      {
        _id: PROP3_ID,
        problem: P3_ID,
        university: ID_RIMS_RANCHI,
        title: 'Drone-Assisted Tribal Emergency Medical Courier & Rapid Anemia Diagnostics',
        description: 'Operated 35 km BVLOS autonomous medical delivery drone paired with paper-microfluidic test strips delivering 200+ emergency doses in tribal pockets.',
        problemStatement: 'Autonomous Drone Medical Logistics & Sickle Cell Diagnostics in Remote Hilly Hamlets',
        domain: 'Healthcare',
        projectDuration: '5 Months',
        estimatedBudget: 2450000,
        peopleImpacted: 8200,
        industrySupportRequired: ['Drone & Aerial Survey', 'Chemical & Water Quality Testing Kit'],
        status: 'completed',
        assignedIndustry: ID_COAL_INDIA,
        industryOffer: {
          industry: ID_COAL_INDIA,
          fundingAmount: 2450000,
          supportDetails: 'Autonomous VTOL UAV hardware, active cooling vaccine transport containers, and diagnostics kits.',
          mentorName: 'B. K. Tripathy',
          mentorDesignation: 'General Manager (CSR)',
          mentorEmail: 'csr@coalindia.in',
          responseStatus: 'accepted'
        },
        govtApproval: {
          approvedBy: ID_GOVT_USER,
          status: 'approved',
          remarks: 'Approved under Emergency Health Logistics Mandate.',
          sanctionOrderNumber: 'JH-SANCTION-2026-5012',
          approvedAt: new Date('2026-04-10T00:00:00.000Z')
        },
        facultyMembers: [{ name: 'Dr. Sanjay Kumar', designation: 'Professor & Head', department: 'Community Medicine', email: 'skumar@rimsranchi.ac.in' }],
        teamMembers: [{ name: 'Kunal Sen', rollNo: 'BME/2026', branch: 'Biomedical Engineering', year: 'Final Year' }]
      },
      {
        _id: PROP4_ID,
        problem: P4_ID,
        university: ID_IIT_ISM,
        title: 'Subsurface Thermal Tomography & High-Pressure Nitrogen-Foam Encapsulation',
        description: 'Injected 12,000 m³ of fly-ash nitrogen composite grout through 32 directional boreholes, completely extinguishing active oxygen intake.',
        problemStatement: 'Subterranean Mine Fire Tomography & Fly-Ash Grout Encapsulation',
        domain: 'Environment',
        projectDuration: '6 Months',
        estimatedBudget: 3200000,
        peopleImpacted: 12000,
        industrySupportRequired: ['Civil & Concrete Encapsulation', 'Chemical & Water Quality Testing Kit'],
        status: 'completed',
        assignedIndustry: ID_COAL_INDIA,
        industryOffer: {
          industry: ID_COAL_INDIA,
          fundingAmount: 3200000,
          supportDetails: 'High pressure slurry pumps, nitrogen foam generator, and borehole thermistor arrays.',
          mentorName: 'B. K. Tripathy',
          mentorDesignation: 'General Manager (CSR)',
          mentorEmail: 'csr@coalindia.in',
          responseStatus: 'accepted'
        },
        govtApproval: {
          approvedBy: ID_GOVT_USER,
          status: 'approved',
          remarks: 'Sanctioned for Jharia Coalfield fire containment.',
          sanctionOrderNumber: 'JH-SANCTION-2026-3104',
          approvedAt: new Date('2026-03-12T00:00:00.000Z')
        },
        facultyMembers: [{ name: 'Prof. Rajesh K. Sinha', designation: 'Professor & Chair', department: 'Mining Engineering', email: 'rksinha@iitism.ac.in' }],
        teamMembers: [{ name: 'Debashish Bannerjee', rollNo: 'PHD/MIN/2026', branch: 'Applied Geophysics', year: 'Doctoral Scholar' }]
      },
      {
        _id: PROP5_ID,
        problem: P5_ID,
        university: ID_NIT_JSR,
        title: 'Decentralized 48V DC Solar-Biomass Microgrid for Tribal Hill Topography',
        description: 'Designed and installed 25 kWp modular DC nanogrid eliminating AC conversion losses and powering 320 tribal households with smart prepaid RFID keys.',
        problemStatement: 'Off-Grid Smart DC Microgrid & Solar-Pumping for Tribal Hill Topography',
        domain: 'Energy',
        projectDuration: '4 Months',
        estimatedBudget: 1820000,
        peopleImpacted: 1950,
        industrySupportRequired: ['Solar & Microgrid Hardware', 'IoT & Embedded Sensors'],
        status: 'completed',
        assignedIndustry: ID_JSPL_FOUNDATION,
        industryOffer: {
          industry: ID_JSPL_FOUNDATION,
          fundingAmount: 1820000,
          supportDetails: 'Solar PV 25kWp modules, Lithium-Ferro-Phosphate batteries, and prepaid RFID meters.',
          mentorName: 'Alok Kumar',
          mentorDesignation: 'Head - CSR Jharkhand',
          mentorEmail: 'csr@jindalsteel.com',
          responseStatus: 'accepted'
        },
        govtApproval: {
          approvedBy: ID_GOVT_USER,
          status: 'approved',
          remarks: 'Approved in coordination with JREDA for tribal electrification.',
          sanctionOrderNumber: 'JH-SANCTION-2026-6023',
          approvedAt: new Date('2026-02-20T00:00:00.000Z')
        },
        facultyMembers: [{ name: 'Dr. Vivek Pandey', designation: 'Professor & Lead PI', department: 'Mechanical & Electrical Engineering', email: 'vpandey@nitjsr.ac.in' }],
        teamMembers: [{ name: 'Suman Mahato', rollNo: 'MT/EE/2026', branch: 'Power Systems', year: 'Final Year' }]
      },
      {
        _id: PROP6_ID,
        problem: P6_ID,
        university: ID_BIT_MESRA,
        title: 'Circular Economy High-Permeability Slag Pavement for Stormwater Harvesting',
        description: 'Paved 4.2 km test corridor using blast-furnace slag activated with fly ash geopolymer, preventing urban inundation and recharging the Subarnarekha aquifer.',
        problemStatement: 'Industrial Blast-Furnace Slag Geopolymer Permeable Pavement for Urban Flood Control',
        domain: 'Urban Development',
        projectDuration: '5 Months',
        estimatedBudget: 2200000,
        peopleImpacted: 35000,
        industrySupportRequired: ['Civil & Concrete Encapsulation', 'Rapid Prototyping & Metal 3D Printing'],
        status: 'completed',
        assignedIndustry: ID_TATA_STEEL,
        industryOffer: {
          industry: ID_TATA_STEEL,
          fundingAmount: 2200000,
          supportDetails: 'Blast furnace slag raw materials, automated paving machinery, and quality control lab testing.',
          mentorName: 'Saurav Roy',
          mentorDesignation: 'Chief - CSR',
          mentorEmail: 'csr@tatasteel.com',
          responseStatus: 'accepted'
        },
        govtApproval: {
          approvedBy: ID_GOVT_USER,
          status: 'approved',
          remarks: 'Sanctioned for urban flood resilience.',
          sanctionOrderNumber: 'JH-SANCTION-2026-7088',
          approvedAt: new Date('2026-02-18T00:00:00.000Z')
        },
        facultyMembers: [{ name: 'Dr. Amitava Roy', designation: 'Professor & Lead PI', department: 'Civil & Environmental Engineering', email: 'aroy@bitmesra.ac.in' }],
        teamMembers: [{ name: 'Rohit Agarwal', rollNo: 'MT/STR/2026', branch: 'Structural Engineering', year: 'Final Year' }]
      },
      {
        _id: PROP7_ID,
        problem: P7_ID,
        university: ID_ELITTE_ENG,
        title: 'Ol Chiki Speech AI Audio Companion for Foundational Literacy',
        description: 'Building offline mobile speech recognition model for tribal dialects with interactive gamified phonetics.',
        problemStatement: 'Multi-Lingual Speech AI for Santhali & Ho Tribal Primary School Literacy',
        domain: 'Education',
        projectDuration: '4 Months',
        estimatedBudget: 650000,
        peopleImpacted: 6400,
        industrySupportRequired: ['Cloud & AI Compute Infrastructure', 'Other Industry Support'],
        status: 'industry_matched',
        assignedIndustry: ID_WAYNE_ENTERPRISE,
        industryOffer: {
          industry: ID_WAYNE_ENTERPRISE,
          fundingAmount: 500000,
          supportDetails: 'Hardware tablets, speech dataset hosting, and GPU compute credits for offline Whisper model optimization.',
          mentorName: 'Bruce W.',
          mentorDesignation: 'Director of Technology & CSR',
          mentorEmail: 'csr@wayneenterprise.com',
          responseStatus: 'pending'
        },
        facultyMembers: [{ name: 'Dr. Priya Sengupta', designation: 'Professor & Head', department: 'Computer Science', email: 'psengupta@ece.edu.in' }],
        teamMembers: [{ name: 'Aman Hembrom', rollNo: 'BT/CSE/2026', branch: 'Computer Science', year: 'Final Year' }]
      },
      {
        _id: PROP8_ID,
        problem: P8_ID,
        university: ID_NIT_JSR,
        title: 'Smart Solid-State LiDAR Haptic Feedback Wristband & Voice Spatial Beacon',
        description: 'Low-cost wearable solid-state LiDAR band providing vibration depth cues to avoid potholes and obstacles.',
        problemStatement: 'LiDAR-Haptic Wearable Assistive Band for Divyangjan Mobility in Rural Topography',
        domain: 'Accessibility',
        projectDuration: '4 Months',
        estimatedBudget: 850000,
        peopleImpacted: 4100,
        industrySupportRequired: ['IoT & Embedded Sensors', 'Rapid Prototyping & Metal 3D Printing'],
        status: 'submitted',
        assignedIndustry: ID_TATA_STEEL,
        industryOffer: {
          industry: ID_TATA_STEEL,
          fundingAmount: 850000,
          supportDetails: 'Haptic actuator components, solid state LiDAR sensors, and assistive mobility lab support.',
          mentorName: 'Saurav Roy',
          mentorDesignation: 'Chief - CSR',
          mentorEmail: 'csr@tatasteel.com',
          responseStatus: 'pending'
        },
        facultyMembers: [{ name: 'Dr. Vivek Pandey', designation: 'Professor & Lead PI', department: 'Mechanical & Mechatronics', email: 'vpandey@nitjsr.ac.in' }],
        teamMembers: [{ name: 'Rahul Murmu', rollNo: 'BT/MECH/2026', branch: 'Robotics Engineering', year: 'Final Year' }]
      },
      {
        _id: PROP9_ID,
        problem: P9_ID,
        university: ID_ELITTE_ENG,
        title: 'Solar-Powered Smart Edge Computational Lab for Rural Pedagogy',
        description: 'Design and deployment of zero-grid solar powered micro-servers with offline digital syllabus access and interactive STEM tools.',
        problemStatement: 'Limited Digital Learning Facilities in Rural Schools',
        domain: 'Education',
        projectDuration: '6 Months',
        estimatedBudget: 500000,
        peopleImpacted: 100200,
        industrySupportRequired: ['Cloud & AI Compute Infrastructure', 'IoT & Embedded Sensors'],
        status: 'approved_by_govt',
        assignedIndustry: ID_WAYNE_ENTERPRISE,
        industryOffer: {
          industry: ID_WAYNE_ENTERPRISE,
          fundingAmount: 500000,
          supportDetails: '25 low-power edge computer nodes, solar backup battery packs, and LoRaWAN educational sync router.',
          mentorName: 'Bruce W.',
          mentorDesignation: 'Director of Technology & CSR',
          mentorEmail: 'csr@wayneenterprise.com',
          responseStatus: 'accepted'
        },
        govtApproval: {
          approvedBy: ID_GOVT_USER,
          status: 'approved',
          remarks: 'Tripartite project approved and sanctioned for Ratu block school modernization.',
          sanctionOrderNumber: 'JH-SANCTION-2026-6457',
          approvedAt: new Date('2026-08-27T11:19:18.997Z')
        },
        facultyMembers: [{ name: 'Amitava Roy (Lead Investigator & Professor)', designation: 'Professor & Lead PI', department: 'Applied Environmental & IoT Engineering', email: 'university@sih2026.gov.in' }],
        teamMembers: [{ name: 'Gopal Team Lead', rollNo: 'BT/ECE/2026', branch: 'IoT Engineering', year: 'Final Year' }]
      },
      {
        _id: PROP10_ID,
        problem: P10_ID,
        university: ID_ELITTE_ENG,
        title: 'IoT Smart Ultrasonic Waste Bin Telemetry & Automated Compaction',
        description: 'Solar-assisted ultrasonic fill-level sensors with automated municipal truck dispatch routing and compaction to prevent overflow.',
        problemStatement: 'Poor Urban Waste Management',
        domain: 'Urban Development',
        projectDuration: '3 Months',
        estimatedBudget: 100000,
        peopleImpacted: 75000,
        industrySupportRequired: ['IoT & Embedded Sensors', 'Civil & Concrete Encapsulation'],
        status: 'completed',
        assignedIndustry: ID_WAYNE_ENTERPRISE,
        industryOffer: {
          industry: ID_WAYNE_ENTERPRISE,
          fundingAmount: 100000,
          supportDetails: 'Ultrasonic bin level nodes, GPS truck tracking modules, and central dispatch dashboard server.',
          mentorName: 'Bruce W.',
          mentorDesignation: 'Director of Technology & CSR',
          mentorEmail: 'csr@wayneenterprise.com',
          responseStatus: 'accepted'
        },
        govtApproval: {
          approvedBy: ID_GOVT_USER,
          status: 'approved',
          remarks: 'Approved for urban solid waste reduction across Bokaro urban clusters.',
          sanctionOrderNumber: 'JH-SANCTION-2026-9040',
          approvedAt: new Date('2026-08-29T11:08:07.208Z')
        },
        facultyMembers: [{ name: 'Amitava Roy (Lead Investigator & Professor)', designation: 'Professor & Lead PI', department: 'Applied Environmental & IoT Engineering', email: 'university@sih2026.gov.in' }],
        teamMembers: [{ name: 'Siddharth Sen', rollNo: 'BT/ME/2026', branch: 'Mechatronics', year: 'Final Year' }]
      },
      {
        _id: PROP11_ID,
        problem: P11_ID,
        university: ID_ELITTE_ENG,
        title: 'Rapid-Set Polymer-Modified Bituminous Slag Pothole Sealant',
        description: 'Cold-mix polymer bituminous composite utilizing industrial steel slag aggregate for instantaneous high-durability road patch repair under wet conditions.',
        problemStatement: 'Poth Holes',
        domain: 'Urban Development',
        projectDuration: '3 Months',
        estimatedBudget: 400000,
        peopleImpacted: 100000,
        industrySupportRequired: ['Civil & Concrete Encapsulation', 'Rapid Prototyping & Metal 3D Printing'],
        status: 'completed',
        assignedIndustry: ID_WAYNE_ENTERPRISE,
        industryOffer: {
          industry: ID_WAYNE_ENTERPRISE,
          fundingAmount: 400000,
          supportDetails: 'Bituminous polymer additives, steel slag screening equipment, and road test vibratory compaction kit.',
          mentorName: 'Bruce W.',
          mentorDesignation: 'Director of Technology & CSR',
          mentorEmail: 'csr@wayneenterprise.com',
          responseStatus: 'accepted'
        },
        govtApproval: {
          approvedBy: ID_GOVT_USER,
          status: 'approved',
          remarks: 'Sanctioned for fast emergency pothole remediation in Dhanbad high-density transit corridors.',
          sanctionOrderNumber: 'JH-SANCTION-2026-5195',
          approvedAt: new Date('2026-08-30T17:50:59.674Z')
        },
        facultyMembers: [{ name: 'Amitava Roy (Lead Investigator & Professor)', designation: 'Professor & Lead PI', department: 'Applied Environmental & IoT Engineering', email: 'university@sih2026.gov.in' }],
        teamMembers: [{ name: 'Prithvi Student Lead', rollNo: 'BT/CE/2026', branch: 'Civil Engineering', year: 'Final Year' }]
      }
    ];

    const createdProposals = await Proposal.insertMany(proposals);
    console.log(`[Seed] Created ${createdProposals.length} proposals.`);

    // 9. Update Universities & Industry Partners with Proposal References
    await University.findByIdAndUpdate(ID_BIT_MESRA, { proposals: [PROP1_ID, PROP6_ID] });
    await University.findByIdAndUpdate(ID_BAU_KANKE, { proposals: [PROP2_ID] });
    await University.findByIdAndUpdate(ID_RIMS_RANCHI, { proposals: [PROP3_ID] });
    await University.findByIdAndUpdate(ID_IIT_ISM, { proposals: [PROP4_ID] });
    await University.findByIdAndUpdate(ID_NIT_JSR, { proposals: [PROP5_ID, PROP8_ID] });
    await University.findByIdAndUpdate(ID_ELITTE_ENG, { proposals: [PROP7_ID, PROP9_ID, PROP10_ID, PROP11_ID] });

    await IndustryPartner.findByIdAndUpdate(ID_TATA_STEEL, { acceptedProposals: [PROP1_ID, PROP2_ID, PROP6_ID], sendedProposal: [PROP1_ID, PROP2_ID, PROP6_ID, PROP8_ID] });
    await IndustryPartner.findByIdAndUpdate(ID_COAL_INDIA, { acceptedProposals: [PROP3_ID, PROP4_ID], sendedProposal: [PROP3_ID, PROP4_ID] });
    await IndustryPartner.findByIdAndUpdate(ID_JSPL_FOUNDATION, { acceptedProposals: [PROP5_ID], sendedProposal: [PROP5_ID] });
    await IndustryPartner.findByIdAndUpdate(ID_WAYNE_ENTERPRISE, { acceptedProposals: [PROP9_ID, PROP10_ID, PROP11_ID], sendedProposal: [PROP7_ID, PROP9_ID, PROP10_ID, PROP11_ID] });

    // 10. Seed Exact Clean Problem Documents with rich timelines & "Project Finished" conclusion
    const problems = [
      {
        _id: P1_ID,
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
          pincode: '835227'
        },
        submitter: {
          userId: ID_PANCHAYAT_USER,
          name: 'Mukesh Bhagat (Mukhiya)',
          role: 'pri_panchayat',
          organization: 'Dormba Gram Panchayat',
          email: 'panchayat@sih2026.gov.in',
          phone: '+91 94311 55678'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://res.cloudinary.com/dp7n7fxq5/image/upload/v1787799923/Job%20Portal%20Uploads/Resumes/xim8gzj8e7vnucnlf3jy.png',
            publicId: '',
            caption: 'Dormba Check-Dam Sluice Gate Before Remediation',
            uploadedAt: new Date('2026-05-10T00:00:00.000Z'),
            _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b5634')
          }
        ],
        status: 'validated',
        resolutionStatus: 'solved',
        priority: 'Critical',
        peopleImpacted: 2400,
        allocatedUniversity: ID_BIT_MESRA,
        proposalGivenUniversity: [ID_BIT_MESRA],
        proposals: [PROP1_ID],
        industryPartners: [ID_TATA_STEEL],
        milestones: [
          { id: 'M1', title: 'Hydrogeological mapping & fluoride benchmarking', targetDate: '2026-06-15', progress: 100, status: 'completed', completionDate: '2026-06-15', _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b563a') },
          { id: 'M2', title: 'Solar filtration unit bench & flow testing', targetDate: '2026-07-05', progress: 100, status: 'completed', completionDate: '2026-07-05', _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b563b') },
          { id: 'M3', title: 'On-site installation at Dormba check-dam', targetDate: '2026-07-28', progress: 100, status: 'completed', completionDate: '2026-07-28', _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b563c') },
          { id: 'M4', title: 'Water quality certification by State Testing Lab', targetDate: '2026-08-10', progress: 100, status: 'completed', completionDate: '2026-08-10', _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b563d') }
        ],
        socialImpact: {
          beneficiariesReached: 2400,
          economicSavingsInr: 1650000,
          metricName: 'Clean Drinking Water Delivered Daily',
          metricValue: '45,000 Litres/Day',
          carbonReductionTons: 22,
          sdgGoals: [6, 3, 1]
        },
        timeline: [
          {
            title: 'Project Finished & Problem Solved',
            description: 'Birla Institute of Technology (BIT) Mesra successfully concluded the R&D implementation. Challenge marked as SOLVED across the state network. High geogenic fluoride reduced to <0.42 mg/L via solar activated alumina filter.',
            colour: 'green',
            createdAt: new Date('2026-08-12T00:00:00.000Z')
          },
          {
            title: 'Tripartite Partnership Sanctioned by Government',
            description: 'Government approved research implementation by BIT Mesra with CSR co-sponsorship from Tata Steel Foundation (Sanction: JH-SANCTION-2026-1042).',
            colour: 'green',
            createdAt: new Date('2026-06-05T00:00:00.000Z')
          },
          {
            title: 'Tata Steel Foundation accepted & sponsored Proposal',
            description: 'Tata Steel Foundation disbursed CSR Grant of ₹12,50,000. Mentor assigned: Saurav Roy (Chief - CSR).',
            colour: 'purple',
            createdAt: new Date('2026-06-01T00:00:00.000Z')
          },
          {
            title: 'Birla Institute of Technology (BIT) Mesra submitted R&D Proposal',
            description: 'Dr. Amitava Roy submitted prototype proposal (Solar Activated Alumina Fluoride Filter with LoRaWAN Telemetry) with estimated budget ₹12,50,000.',
            colour: 'indigo',
            createdAt: new Date('2026-05-25T00:00:00.000Z')
          },
          {
            title: 'Institutional Allocation to BIT Mesra',
            description: 'Government routed challenge to Birla Institute of Technology (BIT) Mesra. Faculty Lead: Dr. Amitava Roy (Civil & Environmental Engineering).',
            colour: 'indigo',
            createdAt: new Date('2026-05-18T00:00:00.000Z')
          },
          {
            title: 'Problem Statement Registered',
            description: 'Mukesh Bhagat (Mukhiya) registered problem with Dormba check-dam evidence. Classified into Water Resources.',
            colour: 'blue',
            createdAt: new Date('2026-05-10T00:00:00.000Z')
          }
        ],
        auditHistory: [
          {
            timestamp: new Date('2026-08-12T00:00:00.000Z'),
            officer: 'State Validation Board',
            role: 'government',
            action: 'Project Finished & Problem Solved',
            note: 'Fluoride level verified at 0.42 mg/L. Full statewide replication approved.',
            _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b563e')
          },
          {
            timestamp: new Date('2026-06-05T00:00:00.000Z'),
            officer: 'Dr. Manish Ranjan, IAS (Secretary)',
            role: 'government',
            action: 'Tripartite Partnership Sanctioned by Government',
            note: 'Government approved research implementation by BIT Mesra with CSR co-sponsorship from Tata Steel Foundation (Sanction: JH-SANCTION-2026-1042).'
          },
          {
            timestamp: new Date('2026-06-01T00:00:00.000Z'),
            officer: 'Tata Steel Foundation',
            role: 'industry',
            action: 'CSR Grant Disbursed',
            note: 'Tata Steel Foundation disbursed CSR Grant of ₹12,50,000. Mentor assigned: Saurav Roy (Chief - CSR).'
          },
          {
            timestamp: new Date('2026-05-25T00:00:00.000Z'),
            officer: 'Dr. Amitava Roy',
            role: 'university',
            action: 'Solution Proposal Submitted (Solar Activated Alumina Fluoride Filter with LoRaWAN Telemetry)',
            note: 'Proposal registered with ₹12,50,000 estimated budget.'
          },
          {
            timestamp: new Date('2026-05-18T00:00:00.000Z'),
            officer: 'Government Innovation Nodal Officer',
            role: 'government',
            action: 'Institutional Allocation to Birla Institute of Technology (BIT) Mesra',
            note: 'Faculty Lead: Dr. Amitava Roy (Civil & Environmental Engineering).'
          },
          {
            timestamp: new Date('2026-05-10T00:00:00.000Z'),
            officer: 'Mukesh Bhagat (Mukhiya)',
            role: 'pri_panchayat',
            action: 'Problem Statement Registered',
            note: 'Submitted with Dormba check-dam evidence.'
          }
        ],
        createdAt: new Date('2026-08-27T01:49:08.141Z'),
        updatedAt: new Date('2026-08-27T01:49:08.141Z')
      },
      {
        _id: P2_ID,
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
          pincode: '822119'
        },
        submitter: {
          userId: ID_CITIZEN_USER,
          name: 'Sita Devi (Latehar Mahila Kisan Samiti)',
          role: 'community_org',
          organization: 'Tribal Women SHG Federation',
          email: 'citizen@sih2026.gov.in',
          phone: '+91 94312 44321'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
            publicId: '',
            caption: 'Mahua Solar-Biomass Storage Facility',
            uploadedAt: new Date('2026-04-15T00:00:00.000Z'),
            _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b5640')
          }
        ],
        status: 'validated',
        resolutionStatus: 'solved',
        priority: 'High',
        peopleImpacted: 1850,
        allocatedUniversity: ID_BAU_KANKE,
        proposalGivenUniversity: [ID_BAU_KANKE],
        proposals: [PROP2_ID],
        industryPartners: [ID_TATA_STEEL],
        milestones: [
          { id: 'M1', title: 'Design & PCM thermal simulation', targetDate: '2026-05-20', progress: 100, status: 'completed', completionDate: '2026-05-20', _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b5646') },
          { id: 'M2', title: 'Cold chamber fabrication at Mahuadanr center', targetDate: '2026-06-15', progress: 100, status: 'completed', completionDate: '2026-06-15', _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b5647') },
          { id: 'M3', title: 'SHG women operational training & pilot trials', targetDate: '2026-07-10', progress: 100, status: 'completed', completionDate: '2026-07-10', _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b5648') },
          { id: 'M4', title: 'Economic impact & spoilage reduction certification', targetDate: '2026-08-01', progress: 100, status: 'completed', completionDate: '2026-08-01', _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b5649') }
        ],
        socialImpact: {
          beneficiariesReached: 1850,
          economicSavingsInr: 2850000,
          metricName: 'Produce Shelf-Life Extension',
          metricValue: 'From 3 Days to 28 Days',
          carbonReductionTons: 16,
          sdgGoals: [2, 5, 8]
        },
        timeline: [
          {
            title: 'Project Finished & Problem Solved',
            description: 'Birsa Agricultural University (BAU) Kanke concluded the R&D implementation. Challenge marked as SOLVED across the state network. Zero electricity operational cold storage extended produce shelf-life from 3 to 28 days for 1,850 women farmers.',
            colour: 'green',
            createdAt: new Date('2026-08-05T00:00:00.000Z')
          },
          {
            title: 'Tripartite Partnership Sanctioned by Government',
            description: 'Government approved research implementation by BAU Ranchi with CSR co-sponsorship from Tata Steel Foundation (Sanction: JH-SANCTION-2026-4091).',
            colour: 'green',
            createdAt: new Date('2026-05-15T00:00:00.000Z')
          },
          {
            title: 'Tata Steel Foundation accepted & sponsored Proposal',
            description: 'Tata Steel Foundation disbursed CSR Grant of ₹14,80,000. Mentor assigned: Debdoot Mohanty.',
            colour: 'purple',
            createdAt: new Date('2026-05-05T00:00:00.000Z')
          },
          {
            title: 'BAU Ranchi submitted R&D Proposal',
            description: 'Dr. Sunita Murmu submitted prototype proposal (Off-Grid Phase-Change Thermal Cold Chamber & Solar Dehydrator) with budget ₹14,80,000.',
            colour: 'indigo',
            createdAt: new Date('2026-04-28T00:00:00.000Z')
          },
          {
            title: 'Institutional Allocation to BAU Kanke',
            description: 'Government allocated problem to Birsa Agricultural University (BAU) Kanke. Faculty Lead: Dr. Sunita Murmu (Plant Pathology & Agronomy).',
            colour: 'indigo',
            createdAt: new Date('2026-04-20T00:00:00.000Z')
          },
          {
            title: 'Problem Statement Registered',
            description: 'Sita Devi registered problem with Mahua harvest spoilage evidence. Classified into Agriculture.',
            colour: 'blue',
            createdAt: new Date('2026-04-15T00:00:00.000Z')
          }
        ],
        auditHistory: [
          {
            timestamp: new Date('2026-08-05T00:00:00.000Z'),
            officer: 'Dept. of Agriculture, Jharkhand',
            role: 'government',
            action: 'Project Finished & Problem Solved',
            note: 'Over 1,850 women farmers benefiting. Zero electricity operational expenditure.',
            _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b564a')
          },
          {
            timestamp: new Date('2026-05-15T00:00:00.000Z'),
            officer: 'Dr. Manish Ranjan, IAS (Secretary)',
            role: 'government',
            action: 'Tripartite Partnership Sanctioned by Government',
            note: 'Government approved research implementation by BAU Ranchi with CSR co-sponsorship from Tata Steel Foundation (Sanction: JH-SANCTION-2026-4091).'
          },
          {
            timestamp: new Date('2026-05-05T00:00:00.000Z'),
            officer: 'Tata Steel Foundation',
            role: 'industry',
            action: 'CSR Grant Disbursed',
            note: 'Tata Steel Foundation disbursed CSR Grant of ₹14,80,000. Mentor assigned: Debdoot Mohanty.'
          },
          {
            timestamp: new Date('2026-04-28T00:00:00.000Z'),
            officer: 'Dr. Sunita Murmu',
            role: 'university',
            action: 'Solution Proposal Submitted (Off-Grid Phase-Change Thermal Cold Chamber & Solar Dehydrator)',
            note: 'Proposal registered with ₹14,80,000 estimated budget.'
          },
          {
            timestamp: new Date('2026-04-20T00:00:00.000Z'),
            officer: 'Government Innovation Nodal Officer',
            role: 'government',
            action: 'Institutional Allocation to Birsa Agricultural University (BAU) Kanke',
            note: 'Faculty Lead: Dr. Sunita Murmu (Plant Pathology & Agronomy).'
          },
          {
            timestamp: new Date('2026-04-15T00:00:00.000Z'),
            officer: 'Sita Devi',
            role: 'community_org',
            action: 'Problem Statement Registered',
            note: 'Submitted by Tribal Women SHG Federation.'
          }
        ],
        createdAt: new Date('2026-08-27T01:49:08.149Z'),
        updatedAt: new Date('2026-08-27T01:49:08.149Z')
      },
      {
        _id: P3_ID,
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
          pincode: '822123'
        },
        submitter: {
          userId: ID_GOVT_USER,
          name: 'Dr. Alok Tirkey (Medical Officer In-Charge)',
          role: 'govt_department',
          organization: 'Garu Primary Health Center',
          email: 'govt@sih2026.gov.in',
          phone: '+91 94314 88765'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.openai.com/static-rsc-4/rqSEEueWrmhI42vP5ZtCykftpPH1OP1QxVvPjXK8qggOjnNzLka4yx_6sIEH9Kkj-0TAUl6sXgubJ4T5NrpNZyjQyhV-63F-f6wZ0UCS0dL7cHlr_LJADp5rt9pxpxoftVbsNEdmmmVH9kTHgDrFMJzpsJbvo9HCfby40gp2kDU?purpose=inline',
            publicId: '',
            caption: 'Autonomous Medical Drone Docking Station',
            uploadedAt: new Date('2026-03-10T00:00:00.000Z'),
            _id: new mongoose.Types.ObjectId('6a8f979344a88f09289b564c')
          }
        ],
        status: 'validated',
        resolutionStatus: 'solved',
        priority: 'Critical',
        peopleImpacted: 8200,
        allocatedUniversity: ID_RIMS_RANCHI,
        proposalGivenUniversity: [ID_RIMS_RANCHI],
        proposals: [PROP3_ID],
        industryPartners: [ID_COAL_INDIA],
        milestones: [
          { id: 'M1', title: 'GPS Corridor mapping & DGCA clearance', targetDate: '2026-04-15', progress: 100, status: 'completed', completionDate: '2026-04-15', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5652') },
          { id: 'M2', title: '50-Flight trial with temperature sensor payloads', targetDate: '2026-05-10', progress: 100, status: 'completed', completionDate: '2026-05-10', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5653') },
          { id: 'M3', title: 'Screening 3,000 students for sickle cell trait', targetDate: '2026-06-20', progress: 100, status: 'completed', completionDate: '2026-06-20', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5654') },
          { id: 'M4', title: 'Live emergency dispatch validation by Civil Surgeon', targetDate: '2026-07-15', progress: 100, status: 'completed', completionDate: '2026-07-15', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5655') }
        ],
        socialImpact: {
          beneficiariesReached: 8200,
          economicSavingsInr: 4100000,
          metricName: 'Emergency Medical Transit Time Reduced',
          metricValue: 'From 240 mins to 14 mins',
          carbonReductionTons: 8,
          sdgGoals: [3, 10, 1]
        },
        timeline: [
          {
            title: 'Project Finished & Problem Solved',
            description: 'Rajendra Institute of Medical Sciences (RIMS) Ranchi concluded the R&D implementation. Challenge marked as SOLVED across the state network. Medical transit time reduced from 240 mins to 14 mins with zero flight failure across 180 missions.',
            colour: 'green',
            createdAt: new Date('2026-07-20T00:00:00.000Z')
          },
          {
            title: 'Tripartite Partnership Sanctioned by Government',
            description: 'Government approved research implementation by RIMS Ranchi with CSR co-sponsorship from Coal India Limited (Sanction: JH-SANCTION-2026-5012).',
            colour: 'green',
            createdAt: new Date('2026-04-10T00:00:00.000Z')
          },
          {
            title: 'Coal India Limited accepted & sponsored Proposal',
            description: 'Coal India Limited disbursed CSR Grant of ₹24,50,000. Mentor assigned: B. K. Tripathy.',
            colour: 'purple',
            createdAt: new Date('2026-03-30T00:00:00.000Z')
          },
          {
            title: 'RIMS Ranchi submitted R&D Proposal',
            description: 'Dr. Sanjay Kumar submitted prototype proposal (Drone-Assisted Tribal Emergency Medical Courier) with budget ₹24,50,000.',
            colour: 'indigo',
            createdAt: new Date('2026-03-22T00:00:00.000Z')
          },
          {
            title: 'Institutional Allocation to RIMS Ranchi',
            description: 'Government allocated problem to Rajendra Institute of Medical Sciences (RIMS) Ranchi. Faculty Lead: Dr. Sanjay Kumar (Community Medicine).',
            colour: 'indigo',
            createdAt: new Date('2026-03-15T00:00:00.000Z')
          },
          {
            title: 'Problem Statement Registered',
            description: 'Dr. Alok Tirkey registered problem with Netarhat emergency transport evidence. Classified into Healthcare.',
            colour: 'blue',
            createdAt: new Date('2026-03-10T00:00:00.000Z')
          }
        ],
        auditHistory: [
          {
            timestamp: new Date('2026-07-20T00:00:00.000Z'),
            officer: 'Dept. of Health, Govt of Jharkhand',
            role: 'government',
            action: 'Project Finished & Problem Solved',
            note: 'Zero transit failure across 180 flight missions.',
            _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5656')
          },
          {
            timestamp: new Date('2026-04-10T00:00:00.000Z'),
            officer: 'Dr. Manish Ranjan, IAS (Secretary)',
            role: 'government',
            action: 'Tripartite Partnership Sanctioned by Government',
            note: 'Government approved research implementation by RIMS Ranchi with CSR co-sponsorship from Coal India Limited (Sanction: JH-SANCTION-2026-5012).'
          },
          {
            timestamp: new Date('2026-03-30T00:00:00.000Z'),
            officer: 'Coal India Limited',
            role: 'industry',
            action: 'CSR Grant Disbursed',
            note: 'Coal India Limited disbursed CSR Grant of ₹24,50,000. Mentor assigned: B. K. Tripathy.'
          },
          {
            timestamp: new Date('2026-03-22T00:00:00.000Z'),
            officer: 'Dr. Sanjay Kumar',
            role: 'university',
            action: 'Solution Proposal Submitted (Drone-Assisted Tribal Emergency Medical Courier & Rapid Anemia Diagnostics)',
            note: 'Proposal registered with ₹24,50,000 estimated budget.'
          },
          {
            timestamp: new Date('2026-03-15T00:00:00.000Z'),
            officer: 'Government Innovation Nodal Officer',
            role: 'government',
            action: 'Institutional Allocation to Rajendra Institute of Medical Sciences (RIMS) Ranchi',
            note: 'Faculty Lead: Dr. Sanjay Kumar (Community Medicine).'
          },
          {
            timestamp: new Date('2026-03-10T00:00:00.000Z'),
            officer: 'Dr. Alok Tirkey',
            role: 'govt_department',
            action: 'Problem Statement Registered',
            note: 'Submitted by Garu Primary Health Center.'
          }
        ],
        createdAt: new Date('2026-08-27T01:49:08.149Z'),
        updatedAt: new Date('2026-08-27T01:49:08.149Z')
      },
      {
        _id: P4_ID,
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
          pincode: '828111'
        },
        submitter: {
          userId: ID_CITIZEN_USER,
          name: 'Rameshwar Singh (Community Activist)',
          role: 'community_org',
          organization: 'Jharia Coalfield Bachao Samiti',
          email: 'citizen@sih2026.gov.in',
          phone: '+91 94315 77890'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.openai.com/static-rsc-4/RJ4xtsgCtZyoQTqy4CtggZP-KM9vTwX1vTb40M7i5465tceWp7bEsr-hJ6oIqzsHtiGj6Zq6_I9v0E54xcD6sQOT9KrDMNww8saNIu26eIduj-TT2z8zy1oc-1oVPUsSSZ0zwOMxseDfVK15K-4-c9Zl-fadM6eL8HiSOkA34YAgVLXdBYNuQx6EGC0PdJEQ?purpose=fullsize',
            publicId: '',
            caption: 'Underground Thermal Contouring & Nitrogen Grout Borehole',
            uploadedAt: new Date('2026-02-10T00:00:00.000Z'),
            _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5658')
          }
        ],
        status: 'validated',
        resolutionStatus: 'solved',
        priority: 'Critical',
        peopleImpacted: 12000,
        allocatedUniversity: ID_IIT_ISM,
        proposalGivenUniversity: [ID_IIT_ISM],
        proposals: [PROP4_ID],
        industryPartners: [ID_COAL_INDIA],
        milestones: [
          { id: 'M1', title: '3D isothermal contour tomography', targetDate: '2026-03-25', progress: 100, status: 'completed', completionDate: '2026-03-25', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b565e') },
          { id: 'M2', title: 'Directional drilling of 32 grout boreholes', targetDate: '2026-04-30', progress: 100, status: 'completed', completionDate: '2026-04-30', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b565f') },
          { id: 'M3', title: 'Nitrogen-foam fly ash slurry injection', targetDate: '2026-06-15', progress: 100, status: 'completed', completionDate: '2026-06-15', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5660') },
          { id: 'M4', title: 'Thermal subsidence stability certification', targetDate: '2026-07-20', progress: 100, status: 'completed', completionDate: '2026-07-20', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5661') }
        ],
        socialImpact: {
          beneficiariesReached: 12000,
          economicSavingsInr: 9200000,
          metricName: 'Hazardous Fire Land Stabilized',
          metricValue: '14.5 Hectares',
          carbonReductionTons: 350,
          sdgGoals: [11, 13, 3]
        },
        timeline: [
          {
            title: 'Project Finished & Problem Solved',
            description: 'IIT (ISM) Dhanbad concluded the R&D implementation. Challenge marked as SOLVED across the state network. 14.5 hectares of burning coal strata stabilized with zero subsurface smoke resurgence detected by DGMS for 90 days.',
            colour: 'green',
            createdAt: new Date('2026-07-25T00:00:00.000Z')
          },
          {
            title: 'Tripartite Partnership Sanctioned by Government',
            description: 'Government approved research implementation by IIT ISM Dhanbad with CSR co-sponsorship from Coal India Limited (Sanction: JH-SANCTION-2026-3104).',
            colour: 'green',
            createdAt: new Date('2026-03-12T00:00:00.000Z')
          },
          {
            title: 'Coal India Limited accepted & sponsored Proposal',
            description: 'Coal India Limited disbursed CSR Grant of ₹32,00,000. Mentor assigned: B. K. Tripathy.',
            colour: 'purple',
            createdAt: new Date('2026-03-05T00:00:00.000Z')
          },
          {
            title: 'IIT ISM Dhanbad submitted R&D Proposal',
            description: 'Prof. Rajesh K. Sinha submitted prototype proposal (Subsurface Thermal Tomography & High-Pressure Nitrogen-Foam Encapsulation) with budget ₹32,00,000.',
            colour: 'indigo',
            createdAt: new Date('2026-02-25T00:00:00.000Z')
          },
          {
            title: 'Institutional Allocation to IIT (ISM) Dhanbad',
            description: 'Government allocated problem to Indian Institute of Technology (ISM) Dhanbad. Faculty Lead: Prof. Rajesh K. Sinha (Mining Engineering).',
            colour: 'indigo',
            createdAt: new Date('2026-02-18T00:00:00.000Z')
          },
          {
            title: 'Problem Statement Registered',
            description: 'Rameshwar Singh registered problem with Jharia coalfield subsidence evidence. Classified into Environment.',
            colour: 'blue',
            createdAt: new Date('2026-02-10T00:00:00.000Z')
          }
        ],
        auditHistory: [
          {
            timestamp: new Date('2026-07-25T00:00:00.000Z'),
            officer: 'Directorate General of Mines Safety (DGMS)',
            role: 'government',
            action: 'Project Finished & Problem Solved',
            note: 'Zero subsurface smoke resurgence detected for 90 days.',
            _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5662')
          },
          {
            timestamp: new Date('2026-03-12T00:00:00.000Z'),
            officer: 'Dr. Manish Ranjan, IAS (Secretary)',
            role: 'government',
            action: 'Tripartite Partnership Sanctioned by Government',
            note: 'Government approved research implementation by IIT ISM Dhanbad with CSR co-sponsorship from Coal India Limited (Sanction: JH-SANCTION-2026-3104).'
          },
          {
            timestamp: new Date('2026-03-05T00:00:00.000Z'),
            officer: 'Coal India Limited',
            role: 'industry',
            action: 'CSR Grant Disbursed',
            note: 'Coal India Limited disbursed CSR Grant of ₹32,00,000. Mentor assigned: B. K. Tripathy.'
          },
          {
            timestamp: new Date('2026-02-25T00:00:00.000Z'),
            officer: 'Prof. Rajesh K. Sinha',
            role: 'university',
            action: 'Solution Proposal Submitted (Subsurface Thermal Tomography & High-Pressure Nitrogen-Foam Encapsulation)',
            note: 'Proposal registered with ₹32,00,000 estimated budget.'
          },
          {
            timestamp: new Date('2026-02-18T00:00:00.000Z'),
            officer: 'Government Innovation Nodal Officer',
            role: 'government',
            action: 'Institutional Allocation to Indian Institute of Technology (ISM) Dhanbad',
            note: 'Faculty Lead: Prof. Rajesh K. Sinha (Mining Engineering).'
          },
          {
            timestamp: new Date('2026-02-10T00:00:00.000Z'),
            officer: 'Rameshwar Singh',
            role: 'community_org',
            action: 'Problem Statement Registered',
            note: 'Submitted by Jharia Coalfield Bachao Samiti.'
          }
        ],
        createdAt: new Date('2026-08-27T01:49:08.154Z'),
        updatedAt: new Date('2026-08-27T01:49:08.154Z')
      },
      {
        _id: P5_ID,
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
          pincode: '835302'
        },
        submitter: {
          userId: ID_PANCHAYAT_USER,
          name: 'Shankar Asur (Gram Pradhan)',
          role: 'pri_panchayat',
          organization: 'Asur Tribal Livelihoods Committee',
          email: 'panchayat@sih2026.gov.in',
          phone: '+91 94317 22119'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.openai.com/static-rsc-4/A8IHvcT3TdP6Cw2CDFlw-eu9IK_gldQRJYfh55R_QlmapQuafRXas6u3vp-RlC9FWeaT8mukDfVLt18IClc1w5SADU48lJHJwJzVLSgByDJloa7uLE-bWI2ROBNtiOSsc3I0S9Not6bvid9UsFTsEdtn2VxaQbQ0fRCPsJohoAY?purpose=inline',
            publicId: '',
            caption: '25 kWp Solar DC Nanogrid Installation',
            uploadedAt: new Date('2026-01-20T00:00:00.000Z'),
            _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5664')
          }
        ],
        status: 'validated',
        resolutionStatus: 'solved',
        priority: 'High',
        peopleImpacted: 1950,
        allocatedUniversity: ID_NIT_JSR,
        proposalGivenUniversity: [ID_NIT_JSR],
        proposals: [PROP5_ID],
        industryPartners: [ID_JSPL_FOUNDATION],
        milestones: [
          { id: 'M1', title: 'Terrain load calculation & solar irradiance study', targetDate: '2026-03-01', progress: 100, status: 'completed', completionDate: '2026-03-01', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b566a') },
          { id: 'M2', title: 'Solar array & DC distribution cabling', targetDate: '2026-04-10', progress: 100, status: 'completed', completionDate: '2026-04-10', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b566b') },
          { id: 'M3', title: 'Lift irrigation pump head integration', targetDate: '2026-05-15', progress: 100, status: 'completed', completionDate: '2026-05-15', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b566c') },
          { id: 'M4', title: 'Village energy committee handover & certification', targetDate: '2026-06-10', progress: 100, status: 'completed', completionDate: '2026-06-10', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b566d') }
        ],
        socialImpact: {
          beneficiariesReached: 1950,
          economicSavingsInr: 1850000,
          metricName: 'Renewable Power Generated Annually',
          metricValue: '36,500 kWh/Year',
          carbonReductionTons: 38,
          sdgGoals: [7, 1, 13]
        },
        timeline: [
          {
            title: 'Project Finished & Problem Solved',
            description: 'NIT Jamshedpur concluded the R&D implementation. Challenge marked as SOLVED across the state network. 100% 24x7 household electrification achieved in remote Banari with 36,500 kWh annual clean energy.',
            colour: 'green',
            createdAt: new Date('2026-06-15T00:00:00.000Z')
          },
          {
            title: 'Tripartite Partnership Sanctioned by Government',
            description: 'Government approved research implementation by NIT Jamshedpur with CSR co-sponsorship from JSPL CSR Foundation (Sanction: JH-SANCTION-2026-6023).',
            colour: 'green',
            createdAt: new Date('2026-02-20T00:00:00.000Z')
          },
          {
            title: 'JSPL Foundation accepted & sponsored Proposal',
            description: 'JSPL Foundation disbursed CSR Grant of ₹18,20,000. Mentor assigned: Alok Kumar.',
            colour: 'purple',
            createdAt: new Date('2026-02-12T00:00:00.000Z')
          },
          {
            title: 'NIT Jamshedpur submitted R&D Proposal',
            description: 'Dr. Vivek Pandey submitted prototype proposal (Decentralized 48V DC Solar-Biomass Microgrid) with budget ₹18,20,000.',
            colour: 'indigo',
            createdAt: new Date('2026-02-05T00:00:00.000Z')
          },
          {
            title: 'Institutional Allocation to NIT Jamshedpur',
            description: 'Government allocated problem to National Institute of Technology (NIT) Jamshedpur. Faculty Lead: Dr. Vivek Pandey (Mechanical & Electrical Engineering).',
            colour: 'indigo',
            createdAt: new Date('2026-01-28T00:00:00.000Z')
          },
          {
            title: 'Problem Statement Registered',
            description: 'Shankar Asur registered problem with mountainous terrain lighting challenge. Classified into Energy.',
            colour: 'blue',
            createdAt: new Date('2026-01-20T00:00:00.000Z')
          }
        ],
        auditHistory: [
          {
            timestamp: new Date('2026-06-15T00:00:00.000Z'),
            officer: 'JREDA (Jharkhand Renewable Energy Development Agency)',
            role: 'government',
            action: 'Project Finished & Problem Solved',
            note: '100% household electrification achieved in remote Banari.',
            _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b566e')
          },
          {
            timestamp: new Date('2026-02-20T00:00:00.000Z'),
            officer: 'Dr. Manish Ranjan, IAS (Secretary)',
            role: 'government',
            action: 'Tripartite Partnership Sanctioned by Government',
            note: 'Government approved research implementation by NIT Jamshedpur with CSR co-sponsorship from JSPL CSR Foundation (Sanction: JH-SANCTION-2026-6023).'
          },
          {
            timestamp: new Date('2026-02-12T00:00:00.000Z'),
            officer: 'JSPL Foundation',
            role: 'industry',
            action: 'CSR Grant Disbursed',
            note: 'JSPL Foundation disbursed CSR Grant of ₹18,20,000. Mentor assigned: Alok Kumar.'
          },
          {
            timestamp: new Date('2026-02-05T00:00:00.000Z'),
            officer: 'Dr. Vivek Pandey',
            role: 'university',
            action: 'Solution Proposal Submitted (Decentralized 48V DC Solar-Biomass Microgrid)',
            note: 'Proposal registered with ₹18,20,000 estimated budget.'
          },
          {
            timestamp: new Date('2026-01-28T00:00:00.000Z'),
            officer: 'Government Innovation Nodal Officer',
            role: 'government',
            action: 'Institutional Allocation to National Institute of Technology (NIT) Jamshedpur',
            note: 'Faculty Lead: Dr. Vivek Pandey (Mechanical & Electrical Engineering).'
          },
          {
            timestamp: new Date('2026-01-20T00:00:00.000Z'),
            officer: 'Shankar Asur',
            role: 'pri_panchayat',
            action: 'Problem Statement Registered',
            note: 'Submitted by Asur Tribal Livelihoods Committee.'
          }
        ],
        createdAt: new Date('2026-08-27T01:49:08.154Z'),
        updatedAt: new Date('2026-08-27T01:49:08.154Z')
      },
      {
        _id: P6_ID,
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
          pincode: '831001'
        },
        submitter: {
          userId: ID_GOVT_USER,
          name: 'Pravin Murmu (Urban Executive Engineer)',
          role: 'ulb_urban_body',
          organization: 'Jamshedpur Notified Area Committee (JNAC)',
          email: 'govt@sih2026.gov.in',
          phone: '+91 657 2223344'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.openai.com/static-rsc-4/K6ZRUcMZkAMzkiQOZA99aLLIGCzzZbKsY0FO0bi1CwHJzi6zGDQXPiU8SUdqD8K5-r44o_gg16_FSvtgtS97T12hH-p8Z_hdxmXVKplP2cSyTPJn5RWXFmePf7bLymgrE0m4uzi424Cih9O0y9irW9cZIppDo2OCW_D-kJg42bs?purpose=inline',
            publicId: '',
            caption: 'Slag Geopolymer Permeable Road Pavement Test Bed',
            uploadedAt: new Date('2026-01-15T00:00:00.000Z'),
            _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5670')
          }
        ],
        status: 'validated',
        resolutionStatus: 'solved',
        priority: 'Medium',
        peopleImpacted: 35000,
        allocatedUniversity: ID_BIT_MESRA,
        proposalGivenUniversity: [ID_BIT_MESRA],
        proposals: [PROP6_ID],
        industryPartners: [ID_TATA_STEEL],
        milestones: [
          { id: 'M1', title: 'Slag chemistry & compressive strength optimization', targetDate: '2026-03-01', progress: 100, status: 'completed', completionDate: '2026-03-01', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5676') },
          { id: 'M2', title: 'Pilot paving along 4.2 km corridor', targetDate: '2026-04-20', progress: 100, status: 'completed', completionDate: '2026-04-20', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5677') },
          { id: 'M3', title: 'Heavy monsoon storm permeability testing', targetDate: '2026-06-15', progress: 100, status: 'completed', completionDate: '2026-06-15', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5678') },
          { id: 'M4', title: 'Municipal drainage & ground recharge certification', targetDate: '2026-07-10', progress: 100, status: 'completed', completionDate: '2026-07-10', _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5679') }
        ],
        socialImpact: {
          beneficiariesReached: 35000,
          economicSavingsInr: 3400000,
          metricName: 'Industrial Slag Recycled into Infrastructure',
          metricValue: '3,800 Metric Tons',
          carbonReductionTons: 85,
          sdgGoals: [11, 9, 12]
        },
        timeline: [
          {
            title: 'Project Finished & Problem Solved',
            description: 'Birla Institute of Technology (BIT) Mesra concluded the R&D implementation. Challenge marked as SOLVED across the state network. Zero waterlogging recorded during 140mm rainfall event. Scaled to Ranchi Smart City.',
            colour: 'green',
            createdAt: new Date('2026-07-15T00:00:00.000Z')
          },
          {
            title: 'Tripartite Partnership Sanctioned by Government',
            description: 'Government approved research implementation by BIT Mesra with CSR co-sponsorship from Tata Steel Foundation (Sanction: JH-SANCTION-2026-7088).',
            colour: 'green',
            createdAt: new Date('2026-02-18T00:00:00.000Z')
          },
          {
            title: 'Tata Steel Foundation accepted & sponsored Proposal',
            description: 'Tata Steel Foundation disbursed CSR Grant of ₹22,00,000. Mentor assigned: Saurav Roy (Chief - CSR).',
            colour: 'purple',
            createdAt: new Date('2026-02-10T00:00:00.000Z')
          },
          {
            title: 'BIT Mesra submitted R&D Proposal',
            description: 'Dr. Amitava Roy submitted prototype proposal (Circular Economy High-Permeability Slag Pavement for Stormwater Harvesting) with budget ₹22,00,000.',
            colour: 'indigo',
            createdAt: new Date('2026-02-01T00:00:00.000Z')
          },
          {
            title: 'Institutional Allocation to BIT Mesra',
            description: 'Government allocated problem to Birla Institute of Technology (BIT) Mesra. Faculty Lead: Dr. Amitava Roy (Civil & Environmental Engineering).',
            colour: 'indigo',
            createdAt: new Date('2026-01-22T00:00:00.000Z')
          },
          {
            title: 'Problem Statement Registered',
            description: 'Pravin Murmu (JNAC) registered problem with Sakchi waterlogging evidence. Classified into Urban Development.',
            colour: 'blue',
            createdAt: new Date('2026-01-15T00:00:00.000Z')
          }
        ],
        auditHistory: [
          {
            timestamp: new Date('2026-07-15T00:00:00.000Z'),
            officer: 'Urban Development & Housing Dept. (UDHD)',
            role: 'government',
            action: 'Project Finished & Problem Solved',
            note: 'Zero waterlogging recorded during 140mm rainfall event. Scaled to Ranchi Smart City.',
            _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b567a')
          },
          {
            timestamp: new Date('2026-02-18T00:00:00.000Z'),
            officer: 'Dr. Manish Ranjan, IAS (Secretary)',
            role: 'government',
            action: 'Tripartite Partnership Sanctioned by Government',
            note: 'Government approved research implementation by BIT Mesra with CSR co-sponsorship from Tata Steel Foundation (Sanction: JH-SANCTION-2026-7088).'
          },
          {
            timestamp: new Date('2026-02-10T00:00:00.000Z'),
            officer: 'Tata Steel Foundation',
            role: 'industry',
            action: 'CSR Grant Disbursed',
            note: 'Tata Steel Foundation disbursed CSR Grant of ₹22,00,000. Mentor assigned: Saurav Roy (Chief - CSR).'
          },
          {
            timestamp: new Date('2026-02-01T00:00:00.000Z'),
            officer: 'Dr. Amitava Roy',
            role: 'university',
            action: 'Solution Proposal Submitted (Circular Economy High-Permeability Slag Pavement for Stormwater Harvesting)',
            note: 'Proposal registered with ₹22,00,000 estimated budget.'
          },
          {
            timestamp: new Date('2026-01-22T00:00:00.000Z'),
            officer: 'Government Innovation Nodal Officer',
            role: 'government',
            action: 'Institutional Allocation to Birla Institute of Technology (BIT) Mesra',
            note: 'Faculty Lead: Dr. Amitava Roy (Civil & Environmental Engineering).'
          },
          {
            timestamp: new Date('2026-01-15T00:00:00.000Z'),
            officer: 'Pravin Murmu',
            role: 'ulb_urban_body',
            action: 'Problem Statement Registered',
            note: 'Submitted by Jamshedpur Notified Area Committee (JNAC).'
          }
        ],
        createdAt: new Date('2026-08-27T01:49:08.154Z'),
        updatedAt: new Date('2026-08-27T01:49:08.154Z')
      },
      {
        _id: P7_ID,
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
          pincode: '814101'
        },
        submitter: {
          userId: ID_CITIZEN_USER,
          name: 'Sunil Soren (Gram Pradhan)',
          role: 'pri_panchayat',
          organization: 'Dumka Tribal Education Committee',
          email: 'citizen@sih2026.gov.in',
          phone: '+91 94318 99881'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
            publicId: '',
            caption: 'Primary School Ol Chiki Classroom',
            uploadedAt: new Date('2026-08-01T00:00:00.000Z'),
            _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b567c')
          }
        ],
        status: 'in_progress',
        resolutionStatus: 'unsolved',
        priority: 'Medium',
        peopleImpacted: 6400,
        allocatedUniversity: ID_ELITTE_ENG,
        proposalGivenUniversity: [ID_ELITTE_ENG],
        proposals: [PROP7_ID],
        industryPartners: [ID_WAYNE_ENTERPRISE],
        milestones: [
          { id: 'M1', title: '5,000-Hour Santhali audio corpus curation', targetDate: '2026-09-01', progress: 45, status: 'in_progress', completionDate: null, _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5681') },
          { id: 'M2', title: 'Offline mobile APK prototype deployment', targetDate: '2026-10-15', progress: 0, status: 'pending', completionDate: null, _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5682') }
        ],
        socialImpact: {
          beneficiariesReached: 6400,
          economicSavingsInr: 950000,
          metricName: 'Tribal Foundational Literacy Uplift',
          metricValue: '6,400 Students Targeted',
          carbonReductionTons: 2,
          sdgGoals: [4, 10]
        },
        timeline: [
          {
            title: 'Wayne Enterprise offered CSR Co-Sponsorship',
            description: 'Wayne Enterprise submitted co-sponsorship grant of ₹5,00,000 with interactive tablet hardware support.',
            colour: 'purple',
            createdAt: new Date('2026-08-29T09:50:15.551Z')
          },
          {
            title: 'Elitte College of Engineering submitted R&D Proposal',
            description: 'Dr. Priya Sengupta submitted prototype proposal (Ol Chiki Speech AI Audio Companion) with budget ₹6,50,000.',
            colour: 'indigo',
            createdAt: new Date('2026-08-15T00:00:00.000Z')
          },
          {
            title: 'Institutional Allocation to Elitte College of Engineering',
            description: 'Government allocated problem to Elitte College of Engineering. Faculty Lead: Dr. Priya Sengupta (Computer Science).',
            colour: 'indigo',
            createdAt: new Date('2026-08-05T00:00:00.000Z')
          },
          {
            title: 'Problem Statement Registered',
            description: 'Sunil Soren registered problem with Ol Chiki classroom evidence. Classified into Education.',
            colour: 'blue',
            createdAt: new Date('2026-08-01T00:00:00.000Z')
          }
        ],
        auditHistory: [
          {
            timestamp: new Date('2026-08-29T09:50:15.551Z'),
            officer: 'Wayne Enterprise',
            role: 'industry',
            action: 'Industry CSR Grant & Equipment Offered',
            note: 'Wayne Enterprise submitted a co-sponsorship offer of ₹5,00,000 with hardware equipment support.'
          },
          {
            timestamp: new Date('2026-08-15T00:00:00.000Z'),
            officer: 'Dr. Priya Sengupta',
            role: 'university',
            action: 'Solution Proposal Submitted (Ol Chiki Speech AI Audio Companion for Foundational Literacy)',
            note: 'Proposal registered with ₹6,50,000 estimated budget.'
          },
          {
            timestamp: new Date('2026-08-05T00:00:00.000Z'),
            officer: 'Government Innovation Nodal Officer',
            role: 'government',
            action: 'Institutional Allocation to Elitte College of Engineering',
            note: 'Faculty Lead: Dr. Priya Sengupta (Computer Science).'
          },
          {
            timestamp: new Date('2026-08-01T00:00:00.000Z'),
            officer: 'Sunil Soren',
            role: 'pri_panchayat',
            action: 'Problem Statement Registered',
            note: 'Submitted with village classroom evidence from Dumka.',
            _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5683')
          }
        ],
        createdAt: new Date('2026-08-27T01:49:08.154Z'),
        updatedAt: new Date('2026-08-29T09:50:15.551Z')
      },
      {
        _id: P8_ID,
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
          pincode: '835202'
        },
        submitter: {
          userId: ID_CITIZEN_USER,
          name: 'Nirmal Toppo (Divyangjan Welfare Samiti)',
          role: 'community_org',
          organization: 'Jharkhand Divyangjan Federation',
          email: 'citizen@sih2026.gov.in',
          phone: '+91 94319 77654'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
            publicId: '',
            caption: 'Divyangjan Mobility Pathway Challenge',
            uploadedAt: new Date('2026-08-12T00:00:00.000Z'),
            _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5685')
          }
        ],
        status: 'in_progress',
        resolutionStatus: 'unsolved',
        priority: 'High',
        peopleImpacted: 4100,
        allocatedUniversity: ID_NIT_JSR,
        proposalGivenUniversity: [ID_NIT_JSR],
        proposals: [PROP8_ID],
        industryPartners: [ID_TATA_STEEL],
        milestones: [
          { id: 'M1', title: 'Solid-state LiDAR sensor calibration', targetDate: '2026-09-15', progress: 10, status: 'in_progress', completionDate: null, _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5687') },
          { id: 'M2', title: 'Wearable haptic belt integration', targetDate: '2026-10-30', progress: 0, status: 'pending', completionDate: null }
        ],
        socialImpact: {
          beneficiariesReached: 4100,
          economicSavingsInr: 1200000,
          metricName: 'Visually Impaired Individuals Empowered',
          metricValue: '4,100 Beneficiaries',
          carbonReductionTons: 1,
          sdgGoals: [10, 3]
        },
        timeline: [
          {
            title: 'Tata Steel Foundation pledged initial prototyping sponsorship',
            description: 'Tata Steel Foundation pledged CSR grant of ₹8,50,000 with hardware robotics lab support.',
            colour: 'purple',
            createdAt: new Date('2026-08-25T00:00:00.000Z')
          },
          {
            title: 'NIT Jamshedpur submitted R&D Proposal',
            description: 'Dr. Vivek Pandey submitted prototype proposal (Smart Solid-State LiDAR Haptic Feedback Wristband) with budget ₹8,50,000.',
            colour: 'indigo',
            createdAt: new Date('2026-08-22T00:00:00.000Z')
          },
          {
            title: 'Institutional Allocation to NIT Jamshedpur',
            description: 'Government allocated problem to National Institute of Technology (NIT) Jamshedpur. Faculty Lead: Dr. Vivek Pandey (Mechanical & Mechatronics).',
            colour: 'indigo',
            createdAt: new Date('2026-08-20T00:00:00.000Z')
          },
          {
            title: 'Problem Statement Registered',
            description: 'Nirmal Toppo registered problem with Bero rural mobility pathways. Classified into Accessibility.',
            colour: 'blue',
            createdAt: new Date('2026-08-12T00:00:00.000Z')
          }
        ],
        auditHistory: [
          {
            timestamp: new Date('2026-08-25T00:00:00.000Z'),
            officer: 'Tata Steel Foundation',
            role: 'industry',
            action: 'CSR Grant Disbursed',
            note: 'Tata Steel Foundation pledged initial prototyping sponsorship of ₹8,50,000.'
          },
          {
            timestamp: new Date('2026-08-22T00:00:00.000Z'),
            officer: 'Dr. Vivek Pandey',
            role: 'university',
            action: 'Solution Proposal Submitted (Smart Solid-State LiDAR Haptic Feedback Wristband & Voice Spatial Beacon)',
            note: 'Proposal registered with ₹8,50,000 estimated budget.'
          },
          {
            timestamp: new Date('2026-08-20T00:00:00.000Z'),
            officer: 'Government Innovation Nodal Officer',
            role: 'government',
            action: 'Institutional Allocation to National Institute of Technology (NIT) Jamshedpur',
            note: 'Faculty Lead: Dr. Vivek Pandey (Mechanical & Mechatronics).',
            _id: new mongoose.Types.ObjectId('6a8f979444a88f09289b5688')
          },
          {
            timestamp: new Date('2026-08-12T00:00:00.000Z'),
            officer: 'Nirmal Toppo',
            role: 'community_org',
            action: 'Problem Statement Registered',
            note: 'Submitted by Jharkhand Divyangjan Federation.'
          }
        ],
        createdAt: new Date('2026-08-27T01:49:08.154Z'),
        updatedAt: new Date('2026-08-27T01:49:08.154Z')
      },
      {
        _id: P9_ID,
        title: 'Limited Digital Learning Facilities in Rural Schools',
        description: 'Many students in rural schools have limited access to computers, reliable internet connectivity, and digital learning resources. This makes it difficult for students to access online educational content, develop digital skills, and participate in technology-enabled learning programs.',
        domain: 'Education',
        location: {
          district: 'Ranchi',
          block: 'Ratu',
          panchayat: '',
          state: 'Jharkhand',
          lat: 23.3441,
          lng: 85.3096,
          address: '',
          pincode: ''
        },
        submitter: {
          userId: ID_CITIZEN_USER,
          name: 'Gopal',
          role: 'individual_citizen',
          organization: 'Community Resident',
          email: 'citizen@sih2026.gov.in',
          phone: '7980827691'
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://res.cloudinary.com/dp7n7fxq5/image/upload/v1787817670/sih2026_societal_evidence/sih_1787817668241_images_jfif.jpg',
            publicId: 'sih2026_societal_evidence/sih_1787817668241_images_jfif',
            caption: 'images.jfif',
            uploadedAt: new Date('2026-08-27T08:01:10.991Z'),
            _id: new mongoose.Types.ObjectId('6a8feed14bd1960adfba8d40')
          },
          {
            type: 'video',
            url: 'https://res.cloudinary.com/dp7n7fxq5/video/upload/v1787817681/sih2026_societal_evidence/sih_1787817670991_ezgif_20bd7fa80947663a_mp4.mp4',
            publicId: 'sih2026_societal_evidence/sih_1787817670991_ezgif_20bd7fa80947663a_mp4',
            caption: 'ezgif-20bd7fa80947663a.mp4',
            uploadedAt: new Date('2026-08-27T08:01:21.371Z'),
            _id: new mongoose.Types.ObjectId('6a8feed14bd1960adfba8d41')
          }
        ],
        status: 'in_progress',
        resolutionStatus: 'unsolved',
        priority: 'High',
        peopleImpacted: 100200,
        allocatedUniversity: ID_ELITTE_ENG,
        proposalGivenUniversity: [ID_ELITTE_ENG],
        proposals: [PROP9_ID],
        industryPartners: [ID_WAYNE_ENTERPRISE],
        milestones: [
          { id: 'M1', title: 'Multidisciplinary laboratory simulation & design verification', targetDate: 'Month 1', completionDate: '27/8/2026', progress: 100, status: 'completed', _id: new mongoose.Types.ObjectId('6a901d36c3b30f9e31f9b677') },
          { id: 'M2', title: 'Hardware-Software MVP prototyping & lab calibration', targetDate: 'Month 3', completionDate: null, progress: 50, status: 'in_progress', _id: new mongoose.Types.ObjectId('6a901d36c3b30f9e31f9b678') },
          { id: 'M3', title: 'Field trial pilot deployment at local community site', targetDate: 'Month 5', completionDate: null, progress: 0, status: 'pending', _id: new mongoose.Types.ObjectId('6a901d36c3b30f9e31f9b679') },
          { id: 'M4', title: 'Stakeholder validation & measurable social impact assessment', targetDate: 'Month 6', completionDate: null, progress: 0, status: 'pending', _id: new mongoose.Types.ObjectId('6a901d36c3b30f9e31f9b67a') }
        ],
        socialImpact: {
          beneficiariesReached: 100200,
          economicSavingsInr: 0,
          metricName: 'Lives Impacted',
          metricValue: '0',
          carbonReductionTons: 0,
          sdgGoals: []
        },
        timeline: [
          {
            title: 'Tripartite Partnership Sanctioned by Government',
            description: 'Government approved research implementation by Elitte College of Engineering with CSR co-sponsorship from Wayne Enterprise (Sanction: JH-SANCTION-2026-6457).',
            colour: 'green',
            createdAt: new Date('2026-08-27T11:19:18.997Z')
          },
          {
            title: 'Wayne Enterprise accepted & sponsored Proposal',
            description: 'Wayne Enterprise committed CSR grant of ₹5,00,000 with 25 edge compute nodes.',
            colour: 'purple',
            createdAt: new Date('2026-08-27T10:30:00.000Z')
          },
          {
            title: 'Elitte College of Engineering submitted R&D Proposal',
            description: 'Prof. Amitava Roy submitted prototype proposal (Solar-Powered Smart Edge Computational Lab) with budget ₹5,00,000.',
            colour: 'indigo',
            createdAt: new Date('2026-08-27T09:15:00.000Z')
          },
          {
            title: 'Problem Statement Registered',
            description: 'Gopal registered problem with 2 evidence attachments. Classified into Education.',
            colour: 'blue',
            createdAt: new Date('2026-08-27T08:01:21.371Z')
          }
        ],
        auditHistory: [
          {
            timestamp: new Date('2026-08-27T11:19:18.997Z'),
            officer: 'Dr. Manish Ranjan, IAS (Secretary)',
            role: 'government',
            action: 'Tripartite Partnership Sanctioned by Government',
            note: 'Government approved research implementation by Elitte College of Engineering with CSR co-sponsorship from Wayne Enterprise (Sanction: JH-SANCTION-2026-6457).',
            _id: new mongoose.Types.ObjectId('6a901d37c3b30f9e31f9b67c')
          },
          {
            timestamp: new Date('2026-08-27T08:01:21.371Z'),
            officer: 'Gopal',
            role: 'individual_citizen',
            action: 'Problem Statement Registered',
            note: 'Classified into Education by Gemini AI with 2 evidence attachments from Ranchi',
            _id: new mongoose.Types.ObjectId('6a8feed14bd1960adfba8d42')
          }
        ],
        createdAt: new Date('2026-08-27T08:01:21.421Z'),
        updatedAt: new Date('2026-08-27T14:20:59.585Z')
      },
      {
        _id: P10_ID,
        title: 'Poor Urban Waste Management',
        description: 'Urban areas face problems such as irregular garbage collection, overflowing dustbins, improper waste segregation, and illegal dumping. These issues create unhygienic surroundings, bad odour, blocked drains, and increase the risk of disease. Lack of real-time monitoring and coordination between citizens and municipal authorities makes it difficult to identify and resolve waste-related issues quickly.',
        domain: 'Urban Development',
        location: {
          district: 'Bokaro',
          block: '',
          panchayat: '',
          state: 'Jharkhand',
          lat: 23.3441,
          lng: 85.3096,
          address: '',
          pincode: ''
        },
        submitter: {
          userId: ID_CITIZEN_USER,
          name: 'Gopal Kundu',
          role: 'individual_citizen',
          organization: 'Community Resident',
          email: 'citizen@sih2026.gov.in',
          phone: ''
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://res.cloudinary.com/dp7n7fxq5/image/upload/v1788001358/sih2026_societal_evidence/sih_1788001355868_images__1__jfif.jpg',
            publicId: 'sih2026_societal_evidence/sih_1788001355868_images__1__jfif',
            caption: 'images (1).jfif',
            uploadedAt: new Date('2026-08-29T11:02:38.634Z'),
            _id: new mongoose.Types.ObjectId('6a92bc4e6a3f8457ab8e7d44')
          }
        ],
        status: 'deployed',
        resolutionStatus: 'solved',
        priority: 'Medium',
        peopleImpacted: 75000,
        allocatedUniversity: ID_ELITTE_ENG,
        proposalGivenUniversity: [ID_ELITTE_ENG],
        proposals: [PROP10_ID],
        industryPartners: [ID_WAYNE_ENTERPRISE],
        milestones: [
          { id: 'M1', title: 'Multidisciplinary laboratory simulation & design verification', targetDate: 'Month 1', completionDate: '29/8/2026', progress: 100, status: 'completed', _id: new mongoose.Types.ObjectId('6a92bd976a3f8457ab8e8735') },
          { id: 'M2', title: 'Hardware-Software MVP prototyping & lab calibration', targetDate: 'Month 3', completionDate: null, progress: 100, status: 'completed', _id: new mongoose.Types.ObjectId('6a92bd976a3f8457ab8e8736') },
          { id: 'M3', title: 'Field trial pilot deployment at local community site', targetDate: 'Month 5', completionDate: null, progress: 100, status: 'completed', _id: new mongoose.Types.ObjectId('6a92bd976a3f8457ab8e8737') },
          { id: 'M4', title: 'Stakeholder validation & measurable social impact assessment', targetDate: 'Month 6', completionDate: null, progress: 100, status: 'completed', _id: new mongoose.Types.ObjectId('6a92bd976a3f8457ab8e8738') }
        ],
        socialImpact: {
          beneficiariesReached: 75000,
          economicSavingsInr: 0,
          metricName: 'Lives Impacted',
          metricValue: '75000',
          carbonReductionTons: 0,
          sdgGoals: []
        },
        timeline: [
          {
            title: 'Project Finished & Problem Solved',
            description: 'Elitte College of Engineering successfully concluded the R&D implementation for Poor Urban Waste Management. Challenge marked as SOLVED across the state network. 18.5 Metric Tons/Day urban waste diverted.',
            colour: 'green',
            createdAt: new Date('2026-08-29T11:09:25.036Z')
          },
          {
            title: 'Tripartite Partnership Sanctioned by Government',
            description: 'Government approved research implementation by Elitte College of Engineering with CSR co-sponsorship from Wayne Enterprise (Sanction: JH-SANCTION-2026-9040).',
            colour: 'green',
            createdAt: new Date('2026-08-29T11:08:07.208Z')
          },
          {
            title: 'Industry CSR Offer Accepted by University',
            description: 'Elitte College of Engineering accepted CSR grant (₹1,00,000) and equipment support from Wayne Enterprise. Forwarded to Government.',
            colour: 'indigo',
            createdAt: new Date('2026-08-29T11:07:31.143Z')
          },
          {
            title: 'Wayne Enterprise accepted & sponsored Proposal',
            description: 'Wayne Enterprise accepted proposal Poor Urban Waste Management and committed a CSR grant of ₹1,00,000 on 29 Aug 2026.',
            colour: 'purple',
            createdAt: new Date('2026-08-29T11:07:00.909Z')
          },
          {
            title: 'Elitte College of Engineering submitted R&D Proposal',
            description: 'Elitte College of Engineering submitted an R&D implementation proposal (Poor Urban Waste Management) on 29 Aug 2026.',
            colour: 'indigo',
            createdAt: new Date('2026-08-29T11:03:55.818Z')
          },
          {
            title: 'Problem Statement Registered',
            description: 'Classified into Urban Development by AI with 1 evidence attachment from Bokaro.',
            colour: 'blue',
            createdAt: new Date('2026-08-29T11:02:38.634Z')
          }
        ],
        auditHistory: [
          {
            timestamp: new Date('2026-08-29T11:09:25.036Z'),
            officer: 'Elitte College of Engineering',
            role: 'university',
            action: 'Project Finished & Problem Solved',
            note: 'Elitte College of Engineering successfully concluded the R&D implementation for Poor Urban Waste Management. Challenge marked as SOLVED across the state network.',
            _id: new mongoose.Types.ObjectId('6a92bde56a3f8457ab8e8b1e')
          },
          {
            timestamp: new Date('2026-08-29T11:08:07.325Z'),
            officer: 'Dr. Manish Ranjan, IAS (Secretary)',
            role: 'government',
            action: 'Tripartite Partnership Sanctioned by Government',
            note: 'Government approved research implementation by Elitte College of Engineering with CSR co-sponsorship from Wayne Enterprise (Sanction: JH-SANCTION-2026-9040).',
            _id: new mongoose.Types.ObjectId('6a92bd976a3f8457ab8e8741')
          },
          {
            timestamp: new Date('2026-08-29T11:07:31.143Z'),
            officer: 'Elitte College of Engineering',
            role: 'university',
            action: 'Industry CSR Offer Accepted by University',
            note: 'Elitte College of Engineering accepted CSR grant (₹1,00,000) and equipment support from Wayne Enterprise. Forwarded to Government.',
            _id: new mongoose.Types.ObjectId('6a92bd736a3f8457ab8e8540')
          },
          {
            timestamp: new Date('2026-08-29T11:07:00.909Z'),
            officer: 'Wayne Enterprise',
            role: 'industry',
            action: 'Wayne Enterprise accepted & sponsored Proposal',
            note: 'Wayne Enterprise accepted proposal Poor Urban Waste Management and committed a CSR grant of ₹1,00,000 on 29 Aug 2026.',
            _id: new mongoose.Types.ObjectId('6a92bd546a3f8457ab8e82e7')
          },
          {
            timestamp: new Date('2026-08-29T11:03:55.818Z'),
            officer: 'Elitte College of Engineering',
            role: 'university',
            action: 'Elitte College of Engineering submitted R&D Proposal',
            note: 'Elitte College of Engineering submitted an R&D implementation proposal (Poor Urban Waste Management) on 29 Aug 2026.',
            _id: new mongoose.Types.ObjectId('6a92bc9b6a3f8457ab8e7faf')
          },
          {
            timestamp: new Date('2026-08-29T11:02:38.634Z'),
            officer: 'Gopal Kundu',
            role: 'individual_citizen',
            action: 'Problem Statement Registered',
            note: 'Classified into Urban Development by AI with 1 evidence attachments from Bokaro',
            _id: new mongoose.Types.ObjectId('6a92bc4e6a3f8457ab8e7d45')
          }
        ],
        createdAt: new Date('2026-08-29T11:02:38.661Z'),
        updatedAt: new Date('2026-08-29T11:09:25.036Z')
      },
      {
        _id: P11_ID,
        title: 'Poth Holes',
        description: 'There are too much poth holes in road',
        domain: 'Urban Development',
        location: {
          district: 'Dhanbad',
          block: '',
          panchayat: '',
          state: 'Jharkhand',
          lat: 23.3441,
          lng: 85.3096,
          address: '',
          pincode: ''
        },
        submitter: {
          userId: ID_CITIZEN_USER,
          name: 'Prithvi',
          role: 'individual_citizen',
          organization: 'Community Resident',
          email: 'citizen@sih2026.gov.in',
          phone: ''
        },
        evidence: [
          {
            type: 'photo',
            url: 'https://res.cloudinary.com/dp7n7fxq5/image/upload/v1788111669/sih2026_societal_evidence/sih_1788111669454_image_ab9fea7_png.png',
            publicId: 'sih2026_societal_evidence/sih_1788111669454_image_ab9fea7_png',
            caption: 'image_ab9fea7.png',
            uploadedAt: new Date('2026-08-30T17:41:10.042Z'),
            _id: new mongoose.Types.ObjectId('6a946b365c2d80074b54e3b6')
          }
        ],
        status: 'deployed',
        resolutionStatus: 'solved',
        priority: 'Medium',
        peopleImpacted: 100000,
        allocatedUniversity: ID_ELITTE_ENG,
        proposalGivenUniversity: [ID_ELITTE_ENG],
        proposals: [PROP11_ID],
        industryPartners: [ID_WAYNE_ENTERPRISE],
        milestones: [
          { id: 'M1', title: 'Multidisciplinary laboratory simulation & design verification', targetDate: 'Month 1', completionDate: '8/30/2026', progress: 100, status: 'completed', _id: new mongoose.Types.ObjectId('6a946d83dc56082ab5c0731a') },
          { id: 'M2', title: 'Hardware-Software MVP prototyping & lab calibration', targetDate: 'Month 3', completionDate: null, progress: 100, status: 'completed', _id: new mongoose.Types.ObjectId('6a946d83dc56082ab5c0731b') },
          { id: 'M3', title: 'Field trial pilot deployment at local community site', targetDate: 'Month 5', completionDate: null, progress: 100, status: 'completed', _id: new mongoose.Types.ObjectId('6a946d83dc56082ab5c0731c') },
          { id: 'M4', title: 'Stakeholder validation & measurable social impact assessment', targetDate: 'Month 6', completionDate: null, progress: 100, status: 'completed', _id: new mongoose.Types.ObjectId('6a946d83dc56082ab5c0731d') }
        ],
        socialImpact: {
          beneficiariesReached: 100000,
          economicSavingsInr: 0,
          metricName: 'Lives Impacted',
          metricValue: '100,000',
          carbonReductionTons: 0,
          sdgGoals: []
        },
        timeline: [
          {
            title: 'Project Finished & Problem Solved',
            description: 'Elitte College of Engineering successfully concluded the R&D implementation for Poth Holes cure. Challenge marked as SOLVED across the state network. Commuter transit safety restored for 100,000 daily commuters.',
            colour: 'green',
            createdAt: new Date('2026-08-30T17:55:07.097Z')
          },
          {
            title: 'Tripartite Partnership Sanctioned by Government',
            description: 'Government approved research implementation by Elitte College of Engineering with CSR co-sponsorship from Wayne Enterprise (Sanction: JH-SANCTION-2026-5195).',
            colour: 'green',
            createdAt: new Date('2026-08-30T17:50:59.674Z')
          },
          {
            title: 'Industry CSR Offer Accepted by University',
            description: 'Elitte College of Engineering accepted CSR grant (₹400,000) and equipment support from Wayne Enterprise. Forwarded to Government.',
            colour: 'indigo',
            createdAt: new Date('2026-08-30T17:49:28.377Z')
          },
          {
            title: 'Wayne Enterprise accepted & sponsored Proposal',
            description: 'Wayne Enterprise accepted proposal Poth Holes cure and committed a CSR grant of ₹400,000 on 30 Aug 2026.',
            colour: 'purple',
            createdAt: new Date('2026-08-30T17:48:43.951Z')
          },
          {
            title: 'Elitte College of Engineering submitted R&D Proposal',
            description: 'Elitte College of Engineering submitted an R&D implementation proposal (Poth Holes cure) on 30 Aug 2026.',
            colour: 'indigo',
            createdAt: new Date('2026-08-30T17:47:00.094Z')
          },
          {
            title: 'Problem Statement Registered',
            description: 'Classified into Urban Development by AI with 1 evidence attachment from Dhanbad.',
            colour: 'blue',
            createdAt: new Date('2026-08-30T17:41:10.042Z')
          }
        ],
        auditHistory: [
          {
            timestamp: new Date('2026-08-30T17:55:07.097Z'),
            officer: 'Elitte College of Engineering',
            role: 'university',
            action: 'Project Finished & Problem Solved',
            note: 'Elitte College of Engineering successfully concluded the R&D implementation for Poth Holes cure. Challenge marked as SOLVED across the state network.',
            _id: new mongoose.Types.ObjectId('6a946e7bdc56082ab5c07a28')
          },
          {
            timestamp: new Date('2026-08-30T17:50:59.867Z'),
            officer: 'Dr. Manish Ranjan, IAS (Secretary)',
            role: 'government',
            action: 'Tripartite Partnership Sanctioned by Government',
            note: 'Government approved research implementation by Elitte College of Engineering with CSR co-sponsorship from Wayne Enterprise (Sanction: JH-SANCTION-2026-5195).',
            _id: new mongoose.Types.ObjectId('6a946d83dc56082ab5c07327')
          },
          {
            timestamp: new Date('2026-08-30T17:49:31.344Z'),
            officer: 'Elitte College of Engineering',
            role: 'university',
            action: 'Industry CSR Offer Accepted by University',
            note: 'Elitte College of Engineering accepted CSR grant (₹400,000) and equipment support from Wayne Enterprise. Forwarded to Government.',
            _id: new mongoose.Types.ObjectId('6a946d2b3080011f14d512a5')
          },
          {
            timestamp: new Date('2026-08-30T17:48:43.951Z'),
            officer: 'Wayne Enterprise',
            role: 'industry',
            action: 'Wayne Enterprise accepted & sponsored Proposal',
            note: 'Wayne Enterprise accepted proposal Poth Holes cure and committed a CSR grant of ₹400,000 on 30 Aug 2026.',
            _id: new mongoose.Types.ObjectId('6a946cfb91210947f17ae18b')
          },
          {
            timestamp: new Date('2026-08-30T17:47:00.094Z'),
            officer: 'Elitte College of Engineering',
            role: 'university',
            action: 'Elitte College of Engineering submitted R&D Proposal',
            note: 'Elitte College of Engineering submitted an R&D implementation proposal (Poth Holes cure) on 30 Aug 2026.',
            _id: new mongoose.Types.ObjectId('6a946c945c2d80074b54e87a')
          },
          {
            timestamp: new Date('2026-08-30T17:41:10.042Z'),
            officer: 'Prithvi',
            role: 'individual_citizen',
            action: 'Problem Statement Registered',
            note: 'Classified into Urban Development by AI with 1 evidence attachments from Dhanbad',
            _id: new mongoose.Types.ObjectId('6a946b365c2d80074b54e3b7')
          }
        ],
        createdAt: new Date('2026-08-30T17:41:10.055Z'),
        updatedAt: new Date('2026-08-30T17:55:07.098Z')
      }
    ];

    const createdProblems = await Problem.insertMany(problems);
    console.log(`[Seed] Created ${createdProblems.length} cleaned problems with full timelines.`);

    console.log('\n======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Universities: ${createdUniversities.length}`);
    console.log(`   - Industry Partners: ${createdIndustryPartners.length}`);
    console.log(`   - Proposals: ${createdProposals.length}`);
    console.log(`   - Problems: ${createdProblems.length}`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
