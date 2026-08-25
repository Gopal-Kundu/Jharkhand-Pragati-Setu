// Master Mock Graph Dataset for Jharkhand Societal Innovation Collaboration Platform (Jharkhand Pragati Setu)

export const JHARKHAND_DISTRICTS = [
  { id: 'ranchi', name: 'Ranchi', nameHi: 'राँची', lat: 23.3441, lng: 85.3096, totalProblems: 42, activeProjects: 11, impactCount: 14200, tier: 'Headquarters', blocks: ['Kanke', 'Namkum', 'Ratu', 'Ormanjhi', 'Burmu', 'Bero', 'Itki', 'Mandar', 'Lapung', 'Silli'] },
  { id: 'khunti', name: 'Khunti', nameHi: 'खूँटी', lat: 23.0722, lng: 85.2796, totalProblems: 28, activeProjects: 6, impactCount: 8900, tier: 'Tribal / Aspirational', blocks: ['Torpa', 'Karra', 'Rania', 'Murhu', 'Arki', 'Khunti'] },
  { id: 'dhanbad', name: 'Dhanbad', nameHi: 'धनबाद', lat: 23.7957, lng: 86.4304, totalProblems: 36, activeProjects: 9, impactCount: 18500, tier: 'Industrial / Mining', blocks: ['Jharia', 'Baghmara', 'Govindpur', 'Nirsa', 'Tundi', 'Topchanchi', 'Baliapur', 'Egarkund'] },
  { id: 'east_singhbhum', name: 'East Singhbhum (Jamshedpur)', nameHi: 'पूर्वी सिंहभूम', lat: 22.8046, lng: 86.2029, totalProblems: 31, activeProjects: 8, impactCount: 22400, tier: 'Industrial Hub', blocks: ['Golmuri', 'Ghatshila', 'Potka', 'Baharagora', 'Chakulia', 'Musabani', 'Dhalbhumgarh', 'Dumaria'] },
  { id: 'bokaro', name: 'Bokaro', nameHi: 'बोकारो', lat: 23.6693, lng: 86.1511, totalProblems: 24, activeProjects: 5, impactCount: 11200, tier: 'Steel / Energy', blocks: ['Chas', 'Bermo', 'Gomia', 'Chandankiyari', 'Jaridih', 'Kasmar', 'Nawadih', 'Petarwar'] },
  { id: 'hazaribagh', name: 'Hazaribagh', nameHi: 'हजारीबाग', lat: 23.9925, lng: 85.3637, totalProblems: 19, activeProjects: 4, impactCount: 7800, tier: 'Forestry / Ag', blocks: ['Barhi', 'Barkagaon', 'Chauparan', 'Churchu', 'Daroo', 'Ichak', 'Katkamsandi', 'Padma'] },
  { id: 'gumla', name: 'Gumla', nameHi: 'गुमला', lat: 23.0436, lng: 84.5414, totalProblems: 22, activeProjects: 4, impactCount: 6500, tier: 'Tribal / Horticulture', blocks: ['Bishunpur', 'Chainpur', 'Dumri', 'Ghaghra', 'Gumla', 'Kamdara', 'Palkot', 'Raidih', 'Sisai'] },
  { id: 'dumka', name: 'Dumka', nameHi: 'दुमका', lat: 24.2676, lng: 87.2483, totalProblems: 27, activeProjects: 5, impactCount: 9400, tier: 'Santhal Pargana HQ', blocks: ['Dumka', 'Gopikandar', 'Jama', 'Jarmundi', 'Kathikund', 'Masalia', 'Ramgarh', 'Ranishwar', 'Sikaripara', 'Saraiyahat'] },
  { id: 'deoghar', name: 'Deoghar', nameHi: 'देवघर', lat: 24.4826, lng: 86.7001, totalProblems: 18, activeProjects: 3, impactCount: 7100, tier: 'Pilgrimage / Health', blocks: ['Deoghar', 'Devipur', 'Karon', 'Madhupur', 'Margomunda', 'Mohanpur', 'Palojori', 'Sarath', 'Sarwan', 'Sonaraithari'] },
  { id: 'west_singhbhum', name: 'West Singhbhum (Chaibasa)', nameHi: 'पश्चिमी सिंहभूम', lat: 22.5658, lng: 85.8083, totalProblems: 25, activeProjects: 4, impactCount: 8200, tier: 'Forest / Mineral', blocks: ['Chaibasa', 'Chakradharpur', 'Jhinkpani', 'Khuntpani', 'Manjhari', 'Tonto', 'Jagannathpur', 'Noamundi', 'Kumardungi'] },
  { id: 'palamu', name: 'Palamu', nameHi: 'पलामू', lat: 24.0384, lng: 84.0722, totalProblems: 23, activeProjects: 4, impactCount: 9600, tier: 'Drought-Prone / Ag', blocks: ['Daltonganj', 'Bishrampur', 'Chhatarpur', 'Chainpur', 'Hariharganj', 'Hussainabad', 'Leslieganj', 'Manatu', 'Pandu', 'Patan'] },
  { id: 'giridih', name: 'Giridih', nameHi: 'गिरिडीह', lat: 24.1856, lng: 86.3072, totalProblems: 21, activeProjects: 3, impactCount: 6800, tier: 'Rural / Mica Belt', blocks: ['Giridih', 'Bengabad', 'Birni', 'Deori', 'Dhanwar', 'Dumri', 'Gandey', 'Gawan', 'Jamua', 'Pirtand', 'Tisri'] },
  { id: 'simdega', name: 'Simdega', nameHi: 'सिमडेगा', lat: 22.6174, lng: 84.5074, totalProblems: 16, activeProjects: 3, impactCount: 5200, tier: 'Sports / Minor Forest', blocks: ['Simdega', 'Bano', 'Bansjor', 'Bolba', 'Jaldega', 'Kersai', 'Kolebira', 'Kurdeg', 'Pakartanr', 'Thethaitangar'] },
  { id: 'ramgarh', name: 'Ramgarh', nameHi: 'रामगढ़', lat: 23.6322, lng: 85.5133, totalProblems: 15, activeProjects: 3, impactCount: 5900, tier: 'Coal / Industrial', blocks: ['Ramgarh', 'Gola', 'Mandu', 'Patratu', 'Chitarpur', 'Dulmi'] },
  { id: 'saraikela_kharsawan', name: 'Saraikela Kharsawan', nameHi: 'सरायकेला खरसावां', lat: 22.7000, lng: 85.9300, totalProblems: 17, activeProjects: 3, impactCount: 6300, tier: 'Auto-Component / Art', blocks: ['Saraikela', 'Kharsawan', 'Gamharia', 'Adityapur', 'Chandil', 'Ichagarh', 'Kandra', 'Kuchai', 'Nimdih', 'Rajnagar'] },
  { id: 'koderma', name: 'Koderma', nameHi: 'कोडरमा', lat: 24.4682, lng: 85.5947, totalProblems: 14, activeProjects: 2, impactCount: 4700, tier: 'Energy / Transport', blocks: ['Koderma', 'Chandwara', 'Domchanch', 'Jainagar', 'Markacho', 'Satgawan'] },
  { id: 'jamtara', name: 'Jamtara', nameHi: 'जामताड़ा', lat: 23.9622, lng: 86.8021, totalProblems: 13, activeProjects: 2, impactCount: 4100, tier: 'Cyber-Safety / Digital', blocks: ['Jamtara', 'Fatehpur', 'Kundhit', 'Nala', 'Narayanpur', 'Karmatanr'] },
  { id: 'godda', name: 'Godda', nameHi: 'गोड्डा', lat: 24.8306, lng: 87.2144, totalProblems: 14, activeProjects: 2, impactCount: 4800, tier: 'Thermal Power / Silk', blocks: ['Godda', 'Boarijor', 'Mahagama', 'Meharma', 'Pathargama', 'Poreyahat', 'Sundarpahari', 'Thakurgangti'] },
  { id: 'latehar', name: 'Latehar', nameHi: 'लातेहार', lat: 23.7438, lng: 84.4984, totalProblems: 15, activeProjects: 2, impactCount: 4500, tier: 'Forest / Ecotourism', blocks: ['Latehar', 'Balumath', 'Bariyatu', 'Barwadih', 'Chandwa', 'Garu', 'Herhanj', 'Mahuadanr', 'Manika'] },
  { id: 'garhwa', name: 'Garhwa', nameHi: 'गढ़वा', lat: 24.1592, lng: 83.8052, totalProblems: 16, activeProjects: 2, impactCount: 5100, tier: 'Border Region / Ag', blocks: ['Garhwa', 'Bhandaria', 'Bhawanathpur', 'Chiniya', 'Dandai', 'Dhurki', 'Kandi', 'Kharaundhi', 'Majhiaon', 'Meral', 'Nagar Untari', 'Ramkanda', 'Ranka', 'Sandi'] },
  { id: 'chatra', name: 'Chatra', nameHi: 'चतरा', lat: 24.2145, lng: 84.8711, totalProblems: 13, activeProjects: 2, impactCount: 3900, tier: 'Forest Produce / Coal', blocks: ['Chatra', 'Hunterganj', 'Itkhori', 'Kanhachatti', 'Kunda', 'Lawalong', 'Mayurhand', 'Pratappur', 'Pathalgada', 'Simaria', 'Tandwa'] },
  { id: 'lohardaga', name: 'Lohardaga', nameHi: 'लोहरदगा', lat: 23.4326, lng: 84.6806, totalProblems: 12, activeProjects: 2, impactCount: 3800, tier: 'Bauxite / Tribal', blocks: ['Lohardaga', 'Bhandra', 'Kisko', 'Kuru', 'Peshrar', 'Sena'] },
  { id: 'pakur', name: 'Pakur', nameHi: 'पाकुड़', lat: 24.6344, lng: 87.8489, totalProblems: 14, activeProjects: 2, impactCount: 4200, tier: 'Stone Quarry / Border', blocks: ['Pakur', 'Hiranpur', 'Littipara', 'Amrapara', 'Pakuria', 'Maheshpur'] },
  { id: 'sahibganj', name: 'Sahibganj', nameHi: 'साहिबगंज', lat: 25.2444, lng: 87.6439, totalProblems: 16, activeProjects: 2, impactCount: 4900, tier: 'River Port / Ganga', blocks: ['Sahibganj', 'Borio', 'Barhait', 'Taljhari', 'Rajmahal', 'Udhwa', 'Pathna', 'Barharwa', 'Mandro'] }
];

export const HEI_INSTITUTIONS = [
  {
    id: 'bit_mesra',
    name: 'Birla Institute of Technology (BIT) Mesra',
    shortName: 'BIT Mesra',
    location: 'Ranchi',
    district: 'ranchi',
    type: 'Deemed University & Technology Hub',
    capabilities: [
      'IoT & Embedded Telemetry',
      'Water Resources & Hydro-Informatics',
      'Remote Sensing & GIS',
      'Environmental Engineering',
      'Robotics & Automation',
      'Machine Learning & Data Science'
    ],
    labs: [
      'Advanced Water Quality & Hydro-sensing Lab',
      'ISRO-supported Remote Sensing Center',
      'TBI Incubation & Rapid Prototyping Centre',
      'Clean Energy & Microgrid Lab'
    ],
    facultyCount: 142,
    activeProjects: 6,
    pastSuccessRate: '94%',
    notableFaculty: [
      { name: 'Dr. Amitava Roy', dept: 'Civil & Environmental Engineering', expertise: 'Groundwater Hydrology & Watershed Modeling', avatar: 'AR' },
      { name: 'Dr. Priya Toppo', dept: 'Electronics & Communication', expertise: 'Low-Power IoT Sensors & LoRaWAN Networks', avatar: 'PT' },
      { name: 'Dr. Ramesh Soren', dept: 'Computer Science', expertise: 'Edge AI & Environmental Telemetry Analytics', avatar: 'RS' }
    ]
  },
  {
    id: 'iit_ism_dhanbad',
    name: 'Indian Institute of Technology (IIT - ISM) Dhanbad',
    shortName: 'IIT (ISM) Dhanbad',
    location: 'Dhanbad',
    district: 'dhanbad',
    type: 'Institute of National Importance',
    capabilities: [
      'Groundwater Exploration & Geo-Hydrology',
      'Heavy Metal Remediation & Fluoride Removal',
      'Mining Subsidence & Drone Land Mapping',
      'Clean Energy & Coal-Bed Methane',
      'Sensor Fabrication & Instrumentation'
    ],
    labs: [
      'Centre of Excellence in Water Management',
      'National Mining & Environmental Geophysics Lab',
      'TexMin Technology Innovation Hub'
    ],
    facultyCount: 220,
    activeProjects: 7,
    pastSuccessRate: '96%',
    notableFaculty: [
      { name: 'Prof. K. N. Mohanta', dept: 'Mining & Geo-Hydrology', expertise: 'Sub-surface aquifer rejuvenation & arsenic removal', avatar: 'KM' },
      { name: 'Dr. S. K. Maiti', dept: 'Environmental Science', expertise: 'Industrial effluent treatment & bio-remediation', avatar: 'SM' }
    ]
  },
  {
    id: 'nit_jamshedpur',
    name: 'National Institute of Technology (NIT) Jamshedpur',
    shortName: 'NIT Jamshedpur',
    location: 'Jamshedpur',
    district: 'east_singhbhum',
    type: 'National Institute of Technology',
    capabilities: [
      'Low-Cost Structural Engineering',
      'Solar Thermal & Hybrid Microgrids',
      'Solid Waste Recycling & Metallurgical Reuse',
      'Smart City Telemetry & Urban Drainage'
    ],
    labs: [
      'Renewable Energy Systems Lab',
      'Materials Characterization & Tensile Lab',
      'IoT & Smart Automation Testbed'
    ],
    facultyCount: 165,
    activeProjects: 5,
    pastSuccessRate: '91%',
    notableFaculty: [
      { name: 'Dr. Rajesh Kumar', dept: 'Electrical Engineering', expertise: 'Decentralized Solar Pumping & Battery Storage', avatar: 'RK' },
      { name: 'Dr. Meena Soren', dept: 'Civil Engineering', expertise: 'Rural Water Supply & Desiltation Structures', avatar: 'MS' }
    ]
  },
  {
    id: 'bau_ranchi',
    name: 'Birsa Agricultural University (BAU)',
    shortName: 'BAU Kanke',
    location: 'Kanke, Ranchi',
    district: 'ranchi',
    type: 'State Agricultural University',
    capabilities: [
      'Precision Irrigation & Soil Nutrient Mapping',
      'Tribal Agro-forestry & Mahua Cold Storage',
      'Drought-Resistant Crop Strains',
      'Organic Pest Management & Biopesticides'
    ],
    labs: [
      'State Soil & Water Testing Central Lab',
      'Post-Harvest Technology & Processing Centre',
      'Bio-fertilizer & Bio-control Production Unit'
    ],
    facultyCount: 110,
    activeProjects: 4,
    pastSuccessRate: '89%',
    notableFaculty: [
      { name: 'Dr. P. K. Singh', dept: 'Agronomy & Soil Conservation', expertise: 'Micro-watershed rainwater harvesting & Rabi yields', avatar: 'PS' },
      { name: 'Dr. Anjali Kerketta', dept: 'Horticulture & Post-Harvest', expertise: 'Solar decentralized cold storage for minor forest produce', avatar: 'AK' }
    ]
  },
  {
    id: 'ranchi_university',
    name: 'Ranchi University & Institute of Tribal Studies',
    shortName: 'Ranchi University',
    location: 'Ranchi',
    district: 'ranchi',
    type: 'State Central University',
    capabilities: [
      'Tribal Ethno-medicine & Livelihoods',
      'Community Participatory Governance',
      'Biomass Briquetting from Invasive Weeds',
      'Socio-Economic Impact Assessment'
    ],
    labs: [
      'Tribal Research Institute Field Lab',
      'Rural Development & Socio-economic Monitoring Cell'
    ],
    facultyCount: 95,
    activeProjects: 3,
    pastSuccessRate: '87%',
    notableFaculty: [
      { name: 'Dr. Sanjay Oraon', dept: 'Tribal Regional Languages & Studies', expertise: 'Indigenous knowledge systems & community mobilization', avatar: 'SO' }
    ]
  }
];

export const INDUSTRY_PARTNERS = [
  {
    id: 'tata_steel_csr',
    name: 'Tata Steel Foundation & CSR Ecosystem',
    shortName: 'Tata Steel CSR',
    category: 'Corporate CSR & Manufacturing Giant',
    hq: 'Jamshedpur',
    focusAreas: ['Rural Water Security', 'Tribal Livelihoods', 'Solar Micro-utilities', 'Maternal Healthcare'],
    pledgeCapacity: '₹5.0 Crore Grant Pool',
    offeredResources: [
      'CSR Innovation Grants (up to ₹25 Lakhs / project)',
      'Industrial Prototype Fabrication & Metal Tooling',
      'Field Testing Vehicle & Ground Engineering Teams',
      'Direct Scale-up in 250+ Panchayats across Kolhan Division'
    ],
    activeCollaborations: 6,
    spoc: 'Mr. Sourav Roy (Chief CSR & Public Partnerships)'
  },
  {
    id: 'ccl_ranchi',
    name: 'Central Coalfields Limited (CCL) CSR & Eco-Restoration',
    shortName: 'CCL CSR',
    category: 'Public Sector Undertaking (PSU)',
    hq: 'Ranchi',
    focusAreas: ['Mine-pit Water Purification', 'Solar Microgrids', 'Rural Skill Hubs'],
    pledgeCapacity: '₹3.5 Crore Grant Pool',
    offeredResources: [
      'Heavy Equipment & Pump Infrastructure',
      'CSR Pilot Funding & Safety Certifications',
      'Mine-discharge telemetry test sites'
    ],
    activeCollaborations: 4,
    spoc: 'Dr. Alok Kumar (General Manager - CSR)'
  },
  {
    id: 'adani_renewables_jh',
    name: 'Adani Solar & Decarbonization Hub',
    shortName: 'Adani Renewables',
    category: 'Clean Energy & Infrastructure',
    hq: 'Godda / Ranchi',
    focusAreas: ['Decentralized Solar Cold Storage', 'Agri-photovoltaic Pumping', 'Off-grid Tribal Lighting'],
    pledgeCapacity: '₹2.0 Crore Technical Hardware Fund',
    offeredResources: [
      'High-efficiency Solar PV Modules & Inverters',
      'Lithium Iron Phosphate Battery Packs',
      'Technical Mentorship for Field Microgrid Systems'
    ],
    activeCollaborations: 3,
    spoc: 'Ms. Radhika Verma (Clean Tech Alliances Lead)'
  },
  {
    id: 'jaldrishti_iot',
    name: 'JalDrishti Smart Telemetry Labs Pvt Ltd',
    shortName: 'JalDrishti IoT (Startup)',
    category: 'DeepTech Startup (BIT Mesra TBI Incubated)',
    hq: 'Ranchi',
    focusAreas: ['Submersible Hydro-Sensors', 'LoRaWAN Long Range Gateways', 'Cloud Telemetry Dashboards'],
    pledgeCapacity: 'Technology & Hardware Co-Creation',
    offeredResources: [
      'Submersible Hydrostatic Level Transducers',
      'Solar-powered LoRaWAN Field Gateways',
      'Mobile App Firmware & Telemetry API'
    ],
    activeCollaborations: 4,
    spoc: 'Ankit Kumar (Co-Founder & CTO)'
  }
];

// Preloaded Comprehensive Problem Clusters and Projects
export const INITIAL_PROBLEM_CLUSTERS = [
  {
    id: 'JH-WTR-1042',
    title: 'Seasonal Pond Depletion & Agricultural Irrigation Collapse in Torpa Block',
    titleHi: 'तोरपा प्रखंड में मौसमी तालाब जल संकट एवं सूक्ष्म सिंचाई व्यवधान',
    primaryDomain: 'Water Resources',
    secondaryDomains: ['Agriculture', 'Rural Livelihoods', 'Environment'],
    district: 'khunti',
    districtName: 'Khunti',
    block: 'Torpa',
    panchayats: ['Dormba', 'Karra-South', 'Torpa-East'],
    villages: ['Dormba', 'Kamatoli', 'Dandradih'],
    reportedDate: '2026-03-12',
    severity: 'High',
    urgency: 'Immediate (Summer Crisis)',
    affectedPopulation: 4800,
    reportCount: 17,
    status: 'Pilot', // Submitted, Under Review, Validated, Institution Matched, Proposal Submitted, Team Formed, Industry Joined, Prototype, Testing, Pilot, Deployed, Completed
    sdgGoals: ['SDG 6: Clean Water & Sanitation', 'SDG 2: Zero Hunger', 'SDG 1: No Poverty'],
    
    // AI Problem Intelligence Layer
    aiIntelligence: {
      confidence: 0.96,
      rootProblem: 'Accelerated evaporation, heavy silt accumulation in earthen check-dams, and unmonitored over-extraction during late rabi season without recharge telemetry.',
      symptoms: [
        'Pond water level drops below suction threshold by late February',
        'Over 420 smallholder farming households forced to abandon vegetable crops',
        'Women and adolescent girls walk 3.8 km to riverbed dugwells',
        'Unsafe stagnant water consumption causing gastrointestinal infections'
      ],
      citizenObserved: '“The village pond dries up every February-March. We cannot cultivate vegetables or provide water to livestock. We have to travel miles on foot.”',
      aiInferredCauses: 'Topographical run-off loss due to degraded catchment bunds + absence of automated seasonal sluice control & water-table recharge sensing.',
      requiredDisciplines: ['Civil & Water Resources Engineering', 'Environmental Engineering', 'IoT & Embedded Sensors', 'Hydrology & Watershed GIS', 'Agronomy'],
      constraints: ['No grid power at remote pond sites (requires 100% solar autonomy)', 'Must resist torrential monsoon flooding (IP68 ruggedization)', 'Must be maintainable by Village Water & Sanitation Committee (VWSC)'],
      prioritizationScore: 91,
      prioritizationFactors: {
        affectedPopulation: { score: 28, max: 30, note: '4,800 direct beneficiaries across 3 panchayats' },
        severityUrgency: { score: 24, max: 25, note: 'Acute seasonal drinking & livelihood threat' },
        duplicateReportWeight: { score: 18, max: 20, note: '17 independent citizen & Panchayat submissions verified' },
        sdgGovPriority: { score: 14, max: 15, note: 'Jharkhand State Jal Jeevan & Krishi Mission Priority' },
        feasibilityValue: { score: 7, max: 10, note: 'High innovation viability with local IoT + desiltation' }
      },
      priorityOverride: {
        hasOverride: true,
        officer: 'Sri Manoj Jha, IAS (Secretary, Water Resources & Drinking Water)',
        timestamp: '2026-03-18 11:24 AM',
        reason: 'Fast-tracked to High Priority under South Chotanagpur Drought Mitigation Action Plan.'
      }
    },

    // Individual Reports aggregated into this cluster
    reports: [
      {
        id: 'REP-1042-01',
        submittedBy: 'Birsa Munda (Gram Pradhan, Dormba)',
        role: 'Panchayati Raj Institution',
        date: '2026-03-12',
        village: 'Dormba, Khunti',
        phone: '+91 94311 87210',
        narrative: 'The main Dormba check-dam pond has silted up. Farmers cannot do second crop sowing. Over 200 cattle lack water.',
        media: [
          { type: 'image', caption: 'Dormba Village Pond Silted Basin (Dry Season)', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80' },
          { type: 'image', caption: 'Cracked reservoir bed & defunct manual sluice', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80' }
        ],
        gps: { lat: 23.0841, lng: 85.2514 },
        verification: 'Verified by Block Development Officer (Torpa)'
      },
      {
        id: 'REP-1042-02',
        submittedBy: 'Sunita Devi (President, Mahila Vikas SHG)',
        role: 'Community Organization',
        date: '2026-03-14',
        village: 'Kamatoli, Khunti',
        phone: '+91 98352 14890',
        narrative: 'Handpumps yield iron-contaminated water when pond is dry. We have to walk before 5 AM to fetch potable water from forest spring.',
        media: [
          { type: 'image', caption: 'Community queue at seasonal spring outlet', url: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=800&q=80' }
        ],
        gps: { lat: 23.0762, lng: 85.2638 },
        verification: 'Verified by Mukhiya'
      },
      {
        id: 'REP-1042-03',
        submittedBy: 'Rameshwar Sahu (Farmer, 4 Acres)',
        role: 'Citizen',
        date: '2026-03-15',
        village: 'Dandradih, Khunti',
        phone: '+91 91224 55678',
        narrative: 'My tomato and cauliflower saplings withered because we could not run the diesel pump for more than 20 minutes.',
        media: [],
        gps: { lat: 23.0691, lng: 85.2711 },
        verification: 'AI Deduplication Matched (98% similarity)'
      }
    ],

    // Matched Institutions (Ranked Recommendation Engine)
    institutionMatches: [
      {
        heiId: 'bit_mesra',
        name: 'BIT Mesra',
        matchScore: 94,
        status: 'Assigned & Active',
        matchRationale: [
          'High expertise in IoT telemetry & LoRaWAN rural gateways',
          'Active Water Quality & Hydro-sensing laboratory',
          'Proximity to Khunti (45 km distance allows rapid field access)',
          'Previous successful micro-watershed automation in Namkum'
        ]
      },
      {
        heiId: 'bau_ranchi',
        name: 'Birsa Agricultural University (BAU)',
        matchScore: 88,
        status: 'Co-Investigator / Agri Consultant',
        matchRationale: [
          'Agronomy & Micro-irrigation water duty calculation expertise',
          'KVK Khunti field network for farmer training'
        ]
      },
      {
        heiId: 'iit_ism_dhanbad',
        name: 'IIT (ISM) Dhanbad',
        matchScore: 82,
        status: 'Technical Reviewer',
        matchRationale: [
          'Aquifer recharge modeling & geo-hydrological simulation capability'
        ]
      }
    ],

    // Active Multidisciplinary Project Details
    project: {
      projectId: 'PRJ-JH-2026-004',
      title: 'Solar-Powered Hydro-Telemetry & Automated Sluice Gate Control for Desilted Village Ponds',
      leadInstitution: 'BIT Mesra (Centre for Water & IoT)',
      coInstitutions: ['Birsa Agricultural University'],
      budget: {
        totalRequested: '₹24,50,000',
        govtGrantApproved: '₹12,00,000',
        industryCSRContribution: '₹12,50,000 (Tata Steel Foundation)',
        disbursedToDate: '₹19,00,000'
      },
      teamMembers: [
        { name: 'Dr. Amitava Roy', role: 'Principal Investigator (Civil/Hydrology, BIT Mesra)', contact: 'aroy@bitmesra.ac.in', avatar: 'AR' },
        { name: 'Dr. Priya Toppo', role: 'Co-PI (IoT Hardware & Firmware, BIT Mesra)', contact: 'ptoppo@bitmesra.ac.in', avatar: 'PT' },
        { name: 'Dr. P. K. Singh', role: 'Agri Water Specialist (BAU Kanke)', contact: 'pksingh@bauranchi.org', avatar: 'PS' },
        { name: 'Shweta Kumari', role: 'Lead Graduate Researcher (M.Tech IoT)', contact: 'shweta.res@bitmesra.ac.in', avatar: 'SK' },
        { name: 'Birsa Munda', role: 'Panchayat & Community Coordinator', contact: 'dormba.panchayat@jharkhand.gov.in', avatar: 'BM' },
        { name: 'Alok Ranjan', role: 'Industry Mentor (Tata Steel CSR Engineering)', contact: 'alok.ranjan@tatasteel.com', avatar: 'AR' }
      ],
      industryPartners: [
        {
          partnerId: 'tata_steel_csr',
          name: 'Tata Steel Foundation',
          type: 'CSR Funding & Heavy Fabricated Sluice Hardware',
          contribution: '₹12.5L Grant + Heavy Galvanized Steel Gates + Field Van',
          dateJoined: '2026-04-05'
        },
        {
          partnerId: 'jaldrishti_iot',
          name: 'JalDrishti IoT Labs',
          type: 'Submersible Sensors & Telemetry Gateway',
          contribution: '15 High-precision Hydrostatic Probes + Custom Cloud API',
          dateJoined: '2026-04-12'
        }
      ],
      milestones: [
        {
          id: 'M1',
          title: 'Field Hydrological Survey, Soil Stratigraphy & Community Consultations',
          status: 'Completed',
          dueDate: '2026-04-20',
          completedDate: '2026-04-18',
          deliverables: 'Bathymetric survey of 3 ponds; 180 farmer interviews; Catchment GIS map.',
          evidenceUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'M2',
          title: 'Design & Fabrication of Solar Hydro-Buoy and Automated Motorized Sluice',
          status: 'Completed',
          dueDate: '2026-05-15',
          completedDate: '2026-05-12',
          deliverables: 'CAD design approved; IP68 waterproof buoy fabricated; Solar MPPT battery kit assembled.',
          evidenceUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'M3',
          title: 'Laboratory Sensor Calibration & LoRaWAN Long-Range Transceiver Testing',
          status: 'Completed',
          dueDate: '2026-06-05',
          completedDate: '2026-06-03',
          deliverables: '12 km telemetry range verified in hilly forest terrain; 0.5 cm level accuracy.',
          evidenceUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'M4',
          title: 'Field Installation & Community Pilot at Dormba Pond (Torpa)',
          status: 'In-Progress',
          dueDate: '2026-07-30',
          completedDate: null,
          progressPercent: 90,
          deliverables: 'Installation of 2 solar hydro-buoys, automated micro-sluice valve, and VWSC farmer mobile dashboard.',
          evidenceUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'M5',
          title: 'Government Directorate Validation & Water Purity / Level Certification',
          status: 'Pending',
          dueDate: '2026-08-30',
          completedDate: null,
          progressPercent: 0,
          deliverables: 'Joint inspection report by Executive Engineer (Khunti) & South Chotanagpur Commissioner.',
          evidenceUrl: null
        },
        {
          id: 'M6',
          title: 'Scale-out to 14 Panchayats Across Khunti, Karra and Murhu Blocks',
          status: 'Planned',
          dueDate: '2026-11-15',
          completedDate: null,
          progressPercent: 0,
          deliverables: 'State-wide standard operating procedure (SOP); Transfer to Panchayati Raj Department.',
          evidenceUrl: null
        }
      ],
      impactMetrics: [
        { indicator: 'Villagers with Assured Water Access', baseline: '0 in Summer', achieved: '2,400+', target: '4,800' },
        { indicator: 'Rabi Cultivation Land Reclaimed', baseline: '12 Hectares', achieved: '48 Hectares (+300%)', target: '65 Hectares' },
        { indicator: 'Daily Walking Distance Saved for Women', baseline: '3.8 km', achieved: '3.1 km saved', target: '3.8 km' },
        { indicator: 'Water-borne Diarrhea Incidents (PHC data)', baseline: '42 cases/mo', achieved: '4 cases/mo (-90%)', target: '< 2 cases/mo' }
      ]
    }
  },
  {
    id: 'JH-AGR-2088',
    title: 'Post-Harvest Spoilage & Cold-Storage Absence for Minor Forest Produce (Mahua & Tomatoes)',
    titleHi: 'गुमला में महुआ एवं टमाटर के लिए विकेंद्रीकृत सोलर कोल्ड स्टोरेज की कमी',
    primaryDomain: 'Agriculture',
    secondaryDomains: ['Rural Livelihoods', 'Renewable Energy', 'Tribal Welfare'],
    district: 'gumla',
    districtName: 'Gumla',
    block: 'Bishunpur',
    panchayats: ['Bishunpur-Central', 'Narma', 'Banari'],
    villages: ['Bishunpur', 'Narma', 'Gari'],
    reportedDate: '2026-04-02',
    severity: 'High',
    urgency: 'Seasonal Harvest Peak',
    affectedPopulation: 3200,
    reportCount: 11,
    status: 'Proposal Submitted',
    sdgGoals: ['SDG 2: Zero Hunger', 'SDG 12: Responsible Consumption', 'SDG 7: Clean Energy'],
    aiIntelligence: {
      confidence: 0.94,
      rootProblem: 'Lack of decentralized, phase-change-material (PCM) solar cold rooms at cluster level causing 40% distress sale of perishable horticultural produce.',
      symptoms: ['Tomatoes sold at ₹3/kg during peak season', 'Mahua flowers suffer fungal rotting in humid weather'],
      citizenObserved: '“Every year our tomatoes rot on the road or we sell at throwaway prices because there is no cold storage in our 25 km radius.”',
      aiInferredCauses: 'Absence of off-grid micro cold storage with low upfront CapEx + inadequate rural logistics.',
      requiredDisciplines: ['Mechanical & Thermal Engineering', 'Horticultural Biotechnology', 'Solar Energy Systems', 'Agri-economics'],
      constraints: ['Must operate during frequent grid outages (18-hour thermal buffer required)'],
      prioritizationScore: 84,
      prioritizationFactors: {
        affectedPopulation: { score: 24, max: 30, note: '3,200 tribal farmers and gatherers' },
        severityUrgency: { score: 21, max: 25, note: 'Massive income loss during April-May harvest' },
        duplicateReportWeight: { score: 15, max: 20, note: '11 verified submissions from SHGs' },
        sdgGovPriority: { score: 14, max: 15, note: 'Jharkhand State Livelihood Promotion Society (JSLPS) Priority' },
        feasibilityValue: { score: 10, max: 10, note: 'Proven PCM solar refrigeration technology available' }
      }
    },
    reports: [
      {
        id: 'REP-2088-01',
        submittedBy: 'Kailash Oraon (Secretary, Kisan Samiti Bishunpur)',
        role: 'Community Organization',
        date: '2026-04-02',
        village: 'Bishunpur, Gumla',
        phone: '+91 94301 99882',
        narrative: 'Over 50 quintals of organic tomatoes rotted in April because local markets were glutted and cold storage at Gumla town is 45 km away.',
        media: [{ type: 'image', caption: 'Unsold agricultural produce', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' }],
        gps: { lat: 23.3852, lng: 84.3821 },
        verification: 'Verified by Block Agriculture Officer'
      }
    ],
    institutionMatches: [
      { heiId: 'bau_ranchi', name: 'Birsa Agricultural University', matchScore: 96, status: 'Proposal Submitted' },
      { heiId: 'nit_jamshedpur', name: 'NIT Jamshedpur', matchScore: 89, status: 'Interested' }
    ],
    project: {
      projectId: 'PRJ-JH-2026-009',
      title: 'Decentralized Solar-PCM Micro Cold Storage Unit for Tribal Produce Hubs',
      leadInstitution: 'Birsa Agricultural University (Post-Harvest Tech Dept)',
      coInstitutions: ['NIT Jamshedpur (Thermal Eng)'],
      budget: { totalRequested: '₹18,00,000', govtGrantApproved: 'Pending Review', industryCSRContribution: '₹8,00,000 Pledged (Adani Solar)' },
      teamMembers: [
        { name: 'Dr. Anjali Kerketta', role: 'Lead Investigator (BAU Kanke)', avatar: 'AK' },
        { name: 'Dr. Rajesh Kumar', role: 'Solar Thermal Specialist (NIT Jamshedpur)', avatar: 'RK' }
      ],
      milestones: [
        { id: 'M1', title: 'Thermal load profiling for Mahua & Tomato', status: 'Completed', dueDate: '2026-05-10' },
        { id: 'M2', title: 'Fabrication of 5-MT PCM modular insulated cold pod', status: 'In-Progress', dueDate: '2026-08-15' }
      ],
      impactMetrics: [
        { indicator: 'Farmer Net Price Realization', baseline: '₹4/kg (Distress)', achieved: 'Expected ₹14/kg', target: '₹16/kg' },
        { indicator: 'Post-Harvest Loss Reduction', baseline: '38%', achieved: 'Target < 5%', target: '< 5%' }
      ]
    }
  },
  {
    id: 'JH-HLT-3104',
    title: 'High Fluoride & Arsenic Contamination in Drinking Water Tubewells in Daltonganj & Patan',
    titleHi: 'पलामू के डाल्टनगंज एवं पाटन प्रखंड में चापाकलों में फ्लोराइड एवं आर्सेनिक विषाक्तता',
    primaryDomain: 'Healthcare',
    secondaryDomains: ['Water Resources', 'Public Administration', 'Rural Development'],
    district: 'palamu',
    districtName: 'Palamu',
    block: 'Patan',
    panchayats: ['Kishunpur', 'Patan-North', 'Nawadih'],
    villages: ['Kishunpur', 'Ghatman', 'Rampur'],
    reportedDate: '2026-03-22',
    severity: 'Critical',
    urgency: 'High (Severe Health Risk)',
    affectedPopulation: 6500,
    reportCount: 14,
    status: 'Team Formed',
    sdgGoals: ['SDG 3: Good Health & Well-being', 'SDG 6: Clean Water'],
    aiIntelligence: {
      confidence: 0.98,
      rootProblem: 'Natural geological leaching of fluorite and granitic bedrock minerals exceeding 4.5 mg/L (WHO permissible limit: 1.0 mg/L), causing severe dental & skeletal fluorosis among schoolchildren.',
      symptoms: ['Crippling joint pain in adults', 'Mottled yellow/brown enamel in 65% of local school students', 'Early deformity in limb bones'],
      citizenObserved: '“Children in our village have yellow teeth and bent legs. Handpump water tastes sour and causes knee pain.”',
      aiInferredCauses: 'Deep drilling (>250 ft) directly puncturing granitic fluoride veins without community-scale activated alumina or electro-coagulation filtration.',
      requiredDisciplines: ['Chemical Engineering', 'Public Health Diagnostics', 'Geo-hydrology', 'Materials Science'],
      constraints: ['Filter regeneration must not require hazardous chemicals on-site', 'Low recurring cost (< ₹0.05 per liter)'],
      prioritizationScore: 95,
      prioritizationFactors: {
        affectedPopulation: { score: 30, max: 30, note: '6,500 residents with severe permanent health hazard' },
        severityUrgency: { score: 25, max: 25, note: 'Critical public health emergency' },
        duplicateReportWeight: { score: 18, max: 20, note: '14 reports from PHCs and schools' },
        sdgGovPriority: { score: 15, max: 15, note: 'Health & Drinking Water Directorate Apex Priority' },
        feasibilityValue: { score: 7, max: 10, note: 'Requires robust field-scale filtration deployment' }
      }
    },
    reports: [
      {
        id: 'REP-3104-01',
        submittedBy: 'Dr. Suresh Tirkey (Medical Officer, Patan PHC)',
        role: 'Community Health Official',
        date: '2026-03-22',
        village: 'Kishunpur, Palamu',
        phone: '+91 94313 77123',
        narrative: 'Over 80 children examined in school health camp show grade-3 skeletal and dental fluorosis. Water sample fluoride is 4.8 mg/L.',
        media: [{ type: 'image', caption: 'Fluoride testing kit reading 4.8 mg/L', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' }],
        gps: { lat: 24.1284, lng: 84.1802 },
        verification: 'Verified by Chief Medical Officer (Palamu)'
      }
    ],
    institutionMatches: [
      { heiId: 'iit_ism_dhanbad', name: 'IIT (ISM) Dhanbad', matchScore: 97, status: 'Team Formed' },
      { heiId: 'bit_mesra', name: 'BIT Mesra', matchScore: 86, status: 'Co-Investigator' }
    ],
    project: {
      projectId: 'PRJ-JH-2026-012',
      title: 'Zero-Chemical Bio-Composite Fluoride Filtration & Water ATM for Palamu Schools',
      leadInstitution: 'IIT (ISM) Dhanbad (Centre of Excellence in Water Management)',
      coInstitutions: ['RIMS Ranchi (Public Health Cell)'],
      budget: { totalRequested: '₹22,00,000', govtGrantApproved: '₹15,00,000', industryCSRContribution: '₹7,00,000 (CCL CSR)' },
      teamMembers: [
        { name: 'Prof. K. N. Mohanta', role: 'Principal Investigator (IIT ISM)', avatar: 'KM' },
        { name: 'Dr. S. K. Maiti', role: 'Materials & Bio-adsorption Lead (IIT ISM)', avatar: 'SM' }
      ],
      milestones: [
        { id: 'M1', title: 'Comprehensive Fluoride mapping of 45 tubewells in Patan', status: 'Completed', dueDate: '2026-04-15' },
        { id: 'M2', title: 'Deployment of 3 Pilot Bio-Composite Adsorption Columns', status: 'In-Progress', dueDate: '2026-07-10' }
      ],
      impactMetrics: [
        { indicator: 'Fluoride Concentration in Supplied Water', baseline: '4.8 mg/L', achieved: '0.6 mg/L (Safe)', target: '< 0.8 mg/L' },
        { indicator: 'School Children Protected Daily', baseline: '0', achieved: '1,100 Students', target: '3,500' }
      ]
    }
  },
  {
    id: 'JH-EDU-4190',
    title: 'Lack of Offline Digital Science & Math Labs in Tribal Forest Schools of Saranda',
    titleHi: 'सारंडा वन क्षेत्र के जनजातीय विद्यालयों में ऑफलाइन डिजिटल विज्ञान प्रयोगशाला का अभाव',
    primaryDomain: 'Education',
    secondaryDomains: ['Digital Governance', 'Tribal Welfare', 'Energy'],
    district: 'west_singhbhum',
    districtName: 'West Singhbhum',
    block: 'Manoharpur',
    panchayats: ['Chiria', 'Anandpur', 'Salai'],
    villages: ['Chiria', 'Kudlibad', 'Jojogutu'],
    reportedDate: '2026-04-10',
    severity: 'Medium',
    urgency: 'Medium',
    affectedPopulation: 1950,
    reportCount: 8,
    status: 'Validated',
    sdgGoals: ['SDG 4: Quality Education', 'SDG 10: Reduced Inequalities'],
    aiIntelligence: {
      confidence: 0.92,
      rootProblem: 'Zero mobile cellular connectivity and intermittent grid electricity in deep Saranda forest zone preventing tribal high-school students from accessing digital NCERT curricula and experiential STEM simulations.',
      symptoms: ['Low pass percentage in Class 10 Board Science exams (32%)', 'High dropout rate after Class 8 among tribal girls'],
      citizenObserved: '“Our school has no internet and light goes off for 4 days. Children have never seen a digital science model.”',
      aiInferredCauses: 'Digital divide exacerbated by dense forest canopy restricting telecom towers; lack of solar micro-servers.',
      requiredDisciplines: ['Computer Science & Edge Computing', 'Solar Microgrid Engineering', 'Pedagogy & Tribal Linguistics'],
      constraints: ['System must function 100% offline with weekly sync via school bus USB beacon'],
      prioritizationScore: 78,
      prioritizationFactors: {
        affectedPopulation: { score: 20, max: 30, note: '1,950 tribal high school students' },
        severityUrgency: { score: 18, max: 25, note: 'Long-term human capital & educational equity' },
        duplicateReportWeight: { score: 14, max: 20, note: '8 cluster reports from teachers and Gram Sabhas' },
        sdgGovPriority: { score: 14, max: 15, note: 'Jharkhand School Education Literacy Dept' },
        feasibilityValue: { score: 12, max: 10, note: 'High turnaround feasibility with Raspberry Pi + Solar' }
      }
    },
    reports: [
      {
        id: 'REP-4190-01',
        submittedBy: 'Mangal Ho (Headmaster, Utkramit High School Chiria)',
        role: 'School Educator',
        date: '2026-04-10',
        village: 'Chiria, West Singhbhum',
        phone: '+91 94701 33411',
        narrative: 'Students walk 12 km to reach our school. We have tablets donated under CSR, but without electricity or internet they are lying in cupboard.',
        media: [{ type: 'image', caption: 'Classroom with unused tablets due to power failure', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80' }],
        gps: { lat: 22.3110, lng: 85.2831 },
        verification: 'Verified by District Education Officer'
      }
    ],
    institutionMatches: [
      { heiId: 'nit_jamshedpur', name: 'NIT Jamshedpur', matchScore: 92, status: 'Recommended' },
      { heiId: 'ranchi_university', name: 'Ranchi University', matchScore: 84, status: 'Recommended' }
    ]
  },
  {
    id: 'JH-ENE-5021',
    title: 'Invasive Lantana Camara Weed Overgrowth & Rural Fire Hazard Replaced with Bio-Coal Briquettes',
    titleHi: 'हजारीबाग में लेंटाना खरपतवार से वन अग्नि रोकथाम एवं बायो-कोल ब्रिकेट्स निर्माण',
    primaryDomain: 'Environment',
    secondaryDomains: ['Energy', 'Livelihoods', 'Disaster Management'],
    district: 'hazaribagh',
    districtName: 'Hazaribagh',
    block: 'Churchu',
    panchayats: ['Churchu-East', 'Daru', 'Kajra'],
    villages: ['Churchu', 'Kajra', 'Bahuwar'],
    reportedDate: '2026-04-18',
    severity: 'Medium',
    urgency: 'Medium',
    affectedPopulation: 2800,
    reportCount: 9,
    status: 'Prototype',
    sdgGoals: ['SDG 13: Climate Action', 'SDG 15: Life on Land', 'SDG 8: Decent Work'],
    aiIntelligence: {
      confidence: 0.93,
      rootProblem: 'Proliferation of toxic invasive weed Lantana Camara choking native Sal & Mahua regeneration and fueling wild summer forest fires.',
      symptoms: ['Loss of cattle grazing pastures', 'Annual summer forest fires destroying timber'],
      citizenObserved: '“Lantana weed has swallowed our jungle pastures. Forest catches fire quickly and cows fall sick eating it.”',
      aiInferredCauses: 'Absence of mechanized biomass harvesting & low-cost torrefaction carbonization kiln for rural SHGs.',
      requiredDisciplines: ['Chemical & Bio-energy Engineering', 'Forestry & Ecology', 'Rural Entrepreneurship'],
      constraints: ['Portable charring kiln needed for difficult hilly forest terrain'],
      prioritizationScore: 76,
      prioritizationFactors: {
        affectedPopulation: { score: 20, max: 30, note: '2,800 forest dwellers & 12 SHGs' },
        severityUrgency: { score: 18, max: 25, note: 'Wildfire risk & pasture degradation' },
        duplicateReportWeight: { score: 14, max: 20, note: '9 cluster reports from Van Samitis' },
        sdgGovPriority: { score: 13, max: 15, note: 'Forest, Environment & Climate Change Dept' },
        feasibilityValue: { score: 11, max: 10, note: 'High commercial potential for industrial boiler fuel' }
      }
    },
    reports: [],
    institutionMatches: [
      { heiId: 'ranchi_university', name: 'Ranchi University', matchScore: 91, status: 'Active PI' },
      { heiId: 'iit_ism_dhanbad', name: 'IIT (ISM) Dhanbad', matchScore: 85, status: 'Advisor' }
    ],
    project: {
      projectId: 'PRJ-JH-2026-015',
      title: 'Mobile Drum-Pyrolyzer & Biomass Briquette Production from Invasive Forest Weeds',
      leadInstitution: 'Ranchi University (Tribal Livelihood & Forestry Cell)',
      budget: { totalRequested: '₹14,00,000', govtGrantApproved: '₹9,00,000', industryCSRContribution: '₹5,00,000 (CCL CSR)' },
      teamMembers: [
        { name: 'Dr. Sanjay Oraon', role: 'Principal Investigator (RU)', avatar: 'SO' }
      ],
      milestones: [
        { id: 'M1', title: 'Prototype mobile pyrolyzer fabricated', status: 'Completed', dueDate: '2026-05-30' },
        { id: 'M2', title: 'Calorific value testing at CCL laboratory', status: 'Completed', dueDate: '2026-06-25' },
        { id: 'M3', title: 'Churchu Mahila SHG commercial production pilot', status: 'In-Progress', dueDate: '2026-09-10' }
      ],
      impactMetrics: [
        { indicator: 'Lantana Weed Cleared from Forest Land', baseline: '0 Hectares', achieved: '34 Hectares', target: '80 Hectares' },
        { indicator: 'Monthly Income Added per SHG Member', baseline: '₹0', achieved: '₹3,400 / mo', target: '₹4,500 / mo' }
      ]
    }
  }
];

export const GOV_DEPARTMENT_LIST = [
  { id: 'dept_water', name: 'Department of Water Resources & Drinking Water', minister: 'Hon. Minister for Drinking Water & Sanitation', activeChallenges: 18, allocatedProjects: 9, budgetMobilized: '₹4.8 Cr' },
  { id: 'dept_agri', name: 'Department of Agriculture, Animal Husbandry & Co-operative', minister: 'Hon. Minister for Agriculture', activeChallenges: 14, allocatedProjects: 7, budgetMobilized: '₹3.6 Cr' },
  { id: 'dept_health', name: 'Department of Health, Medical Education & Family Welfare', minister: 'Hon. Minister for Health', activeChallenges: 11, allocatedProjects: 5, budgetMobilized: '₹3.1 Cr' },
  { id: 'dept_rural', name: 'Department of Rural Development & Panchayati Raj', minister: 'Hon. Minister for Rural Development', activeChallenges: 22, allocatedProjects: 12, budgetMobilized: '₹6.2 Cr' },
  { id: 'dept_it', name: 'Department of Information Technology & e-Governance', minister: 'Hon. Minister for IT & Innovation', activeChallenges: 9, allocatedProjects: 6, budgetMobilized: '₹2.9 Cr' },
  { id: 'dept_forest', name: 'Department of Forest, Environment & Climate Change', minister: 'Hon. Minister for Forest & Environment', activeChallenges: 12, allocatedProjects: 4, budgetMobilized: '₹2.1 Cr' },
  { id: 'dept_tribal', name: 'Department of Scheduled Tribe, Scheduled Caste & Backward Class Welfare', minister: 'Hon. Minister for Tribal Welfare', activeChallenges: 16, allocatedProjects: 8, budgetMobilized: '₹4.4 Cr' }
];

export const SYSTEM_AUDIT_LOGS = [
  { id: 'LOG-8812', timestamp: '2026-03-18 11:24 AM', officer: 'Sri Manoj Jha, IAS (Secy Water Resources)', action: 'Priority Override & Validation', target: 'JH-WTR-1042', note: 'Elevated to High Priority. Fast-track allocation approved.' },
  { id: 'LOG-8813', timestamp: '2026-03-20 03:45 PM', officer: 'Dr. Amitabh Roy (Director R&D, BIT Mesra)', action: 'Challenge Accepted', target: 'JH-WTR-1042', note: 'Submitted interdisciplinary team charter with BAU.' },
  { id: 'LOG-8814', timestamp: '2026-04-05 10:15 AM', officer: 'Mr. Sourav Roy (Chief CSR, Tata Steel)', action: 'Industry CSR Pledged', target: 'JH-WTR-1042', note: '₹12.5 Lakhs grant + galvanized sluice gate fabrication.' },
  { id: 'LOG-8815', timestamp: '2026-04-18 04:30 PM', officer: 'Executive Engineer (Khunti PHED)', action: 'Milestone 1 Verified', target: 'JH-WTR-1042', note: 'Hydrological field survey & bathymetry data certified.' },
  { id: 'LOG-8816', timestamp: '2026-05-12 02:10 PM', officer: 'AI Problem Intelligence Engine', action: 'Deduplication Cluster Merge', target: 'JH-WTR-1042', note: 'Merged 3 new field reports from Dandradih into cluster #JH-WTR-1042 with 98% semantic confidence.' }
];
