/**
 * Master Reference Catalogs for SIH 2026 Innovation Ecosystem
 * Served dynamically by backend REST APIs:
 * - Universities & HEI Centers of Excellence
 * - Industry & CSR Grant Partners
 * - Government State Departments & 24 Jharkhand Districts
 */

export const MASTER_HEI_CATALOG = [
  {
    institutionId: 'bit_mesra',
    name: 'Birla Institute of Technology (BIT) Mesra',
    shortName: 'BIT Mesra',
    nirfRank: 48,
    location: { district: 'Ranchi', state: 'Jharkhand', lat: 23.4123, lng: 85.4399 },
    academicDisciplines: ['Civil & Environmental Engineering', 'IoT & Embedded Systems', 'Biotechnology', 'Remote Sensing & GIS', 'Computer Science & AI', 'Mechanical Engineering'],
    researchCenters: [
      { name: 'Centre of Excellence in Water Technologies & Hydro-Informatics', focus: 'Fluoride Adsorption, IoT Water Quality Sensors, Smart Sluice Automation' },
      { name: 'Tribal Technology Innovation & Rural Livelihood Cell', focus: 'Low-cost solar processing for Mahua, Lac & Minor Forest Produce' }
    ],
    incubationFacilities: ['BIT-TBI Incubation Center (DST Supported)', 'Makerspace IoT Hardware Lab', 'Biotech Rapid Prototyping Facility'],
    facultySpecializations: [
      { name: 'Dr. Amitava Roy', department: 'Civil & Environmental Engineering', designation: 'Professor & Head', expertise: ['Water Quality Modelling', 'Heavy Metal & Fluoride Remediation', 'IoT Hydro-Telemetry'], activeProjects: 3 },
      { name: 'Dr. Priya Sengupta', department: 'Bio-Engineering & Biotechnology', designation: 'Associate Professor', expertise: ['Bio-Sensors', 'Tribal Nutrition', 'Phyto-Remediation'], activeProjects: 2 }
    ]
  },
  {
    institutionId: 'iit_ism_dhanbad',
    name: 'Indian Institute of Technology (ISM) Dhanbad',
    shortName: 'IIT (ISM) Dhanbad',
    nirfRank: 17,
    location: { district: 'Dhanbad', state: 'Jharkhand', lat: 23.8144, lng: 86.4412 },
    academicDisciplines: ['Mining & Geo-Engineering', 'Environmental Science', 'Electronics Engineering', 'Applied Geophysics', 'Clean Energy Technologies'],
    researchCenters: [
      { name: 'Centre of Mining Fire & Hazard Mitigation Technologies', focus: 'Thermal InSAR satellite surveillance, IoT underground gas & temperature tomography' },
      { name: 'Sustainable Mineral & Geo-Resource Hub', focus: 'Circular economy fly-ash and slag utilization in road construction' }
    ],
    incubationFacilities: ['IIT ISM Technology Innovation Hub (TEXMiN)', 'Centre for Innovation, Incubation & Entrepreneurship (CIIE)'],
    facultySpecializations: [
      { name: 'Prof. Rajesh K. Sinha', department: 'Mining Engineering', designation: 'Professor', expertise: ['Underground Coal Fire Dynamics', 'Thermal Infrared Sensor Arrays', 'Mine Safety'], activeProjects: 4 }
    ]
  },
  {
    institutionId: 'bau_ranchi',
    name: 'Birsa Agricultural University (BAU) Kanke',
    shortName: 'BAU Ranchi',
    nirfRank: 92,
    location: { district: 'Ranchi', state: 'Jharkhand', lat: 23.4357, lng: 85.3211 },
    academicDisciplines: ['Agronomy & Crop Sciences', 'Forestry & Agro-Forestry', 'Soil Science & Agricultural Chemistry', 'Plant Pathology & Pest Forensics'],
    researchCenters: [
      { name: 'Centre of Tribal Crop Resilience & Lac Culture', focus: 'Drought-tolerant finger millet, lac insect pest forensics, micro-irrigation' }
    ],
    incubationFacilities: ['BAU Agribusiness Incubator (R-ABI)', 'Seed Testing & Soil Chemistry Lab'],
    facultySpecializations: [
      { name: 'Dr. Sunita Murmu', department: 'Plant Pathology & Agronomy', designation: 'Associate Professor', expertise: ['Lac Production Optimization', 'Soil Nutrient Profiling', 'Tribal Agro-Ecosystems'], activeProjects: 3 }
    ]
  },
  {
    institutionId: 'nit_jamshedpur',
    name: 'National Institute of Technology (NIT) Jamshedpur',
    shortName: 'NIT Jamshedpur',
    nirfRank: 86,
    location: { district: 'East Singhbhum', state: 'Jharkhand', lat: 22.7758, lng: 86.1437 },
    academicDisciplines: ['Metallurgical & Materials Engineering', 'Mechanical & Thermal Systems', 'Electrical & Renewable Microgrids', 'Production Engineering'],
    researchCenters: [
      { name: 'Appropriate Rural Machinery & Industrial Metallurgy Lab', focus: 'Solar biomass hybrid cold storage, mechanized lac peeling, microgrid DC converters' }
    ],
    incubationFacilities: ['NIT Incubation and Innovation Centre (NIIC)', 'Advanced Metal Fab & Prototyping Workshop'],
    facultySpecializations: [
      { name: 'Dr. Vivek Pandey', department: 'Mechanical & Materials Engineering', designation: 'Associate Professor', expertise: ['Low-Cost Agricultural Machinery', 'Solar Thermal Systems'], activeProjects: 2 }
    ]
  },
  {
    institutionId: 'rims_ranchi',
    name: 'Rajendra Institute of Medical Sciences (RIMS) Ranchi',
    shortName: 'RIMS Ranchi',
    nirfRank: 65,
    location: { district: 'Ranchi', state: 'Jharkhand', lat: 23.3855, lng: 85.3562 },
    academicDisciplines: ['Community Medicine', 'Tele-Medicine & Digital Health', 'Pathology & Point-of-Care Diagnostics', 'Pediatrics & Maternal Health'],
    researchCenters: [
      { name: 'Centre for Tribal Health, Sickle Cell & Anemia Forensics', focus: 'Paper microfluidic blood test strips, drone emergency medical courier routing' }
    ],
    incubationFacilities: ['RIMS MedTech Innovation Hub', 'Molecular Diagnostic Laboratory'],
    facultySpecializations: [
      { name: 'Dr. Sanjay Kumar', department: 'Community Medicine', designation: 'Professor', expertise: ['Tribal Public Health', 'Mobile Health & Tele-Diagnostics', 'Epidemiology'], activeProjects: 2 }
    ]
  }
];

export const MASTER_INDUSTRY_CATALOG = [
  {
    partnerId: 'tata_steel_foundation',
    name: 'Tata Steel Foundation',
    type: 'Corporate CSR Foundation',
    csrAnnualBudgetInr: 1250000000,
    focusDomains: ['Water Resources', 'Agriculture', 'Healthcare', 'Rural Livelihoods', 'Education'],
    targetDistricts: ['Khunti', 'East Singhbhum', 'West Singhbhum', 'Saraikela Kharsawan', 'Ramgarh'],
    activeGrantCommitments: '₹14.2 Crore',
    supportedProjectsCount: 18,
    contactPerson: { name: 'Saurav Roy', designation: 'Chief - Corporate Social Responsibility', email: 'csr@tatasteel.com' }
  },
  {
    partnerId: 'coal_india_csr',
    name: 'Coal India Limited (CIL) / BCCL / CCL CSR Division',
    type: 'PSU CSR Division',
    csrAnnualBudgetInr: 2100000000,
    focusDomains: ['Environment', 'Energy', 'Urban Development', 'Healthcare', 'Water Resources'],
    targetDistricts: ['Dhanbad', 'Bokaro', 'Ranchi', 'Ramgarh', 'Hazaribagh', 'Chatra'],
    activeGrantCommitments: '₹22.5 Crore',
    supportedProjectsCount: 24,
    contactPerson: { name: 'B. K. Tripathy', designation: 'General Manager (CSR & Sustainability)', email: 'csr@coalindia.in' }
  },
  {
    partnerId: 'sail_csr',
    name: 'Steel Authority of India Limited (SAIL) - Bokaro & Rungta Division',
    type: 'PSU CSR Division',
    csrAnnualBudgetInr: 850000000,
    focusDomains: ['Education', 'Accessibility', 'Urban Development', 'Rural Livelihoods'],
    targetDistricts: ['Bokaro', 'West Singhbhum', 'Ranchi'],
    activeGrantCommitments: '₹8.4 Crore',
    supportedProjectsCount: 11,
    contactPerson: { name: 'Meena Hembrom', designation: 'DGM (CSR)', email: 'csr@sail-bokaro.com' }
  },
  {
    partnerId: 'jspl_csr',
    name: 'Jindal Steel & Power Foundation (JSPL CSR)',
    type: 'Corporate CSR Foundation',
    csrAnnualBudgetInr: 620000000,
    focusDomains: ['Agriculture', 'Water Resources', 'Women Empowerment', 'Renewable Energy'],
    targetDistricts: ['Godda', 'Dumka', 'Ranchi', 'East Singhbhum'],
    activeGrantCommitments: '₹6.1 Crore',
    supportedProjectsCount: 8,
    contactPerson: { name: 'Alok Kumar', designation: 'Head - CSR Jharkhand', email: 'csr@jindalsteel.com' }
  }
];

export const MASTER_DEPARTMENTS_CATALOG = [
  { id: 'dept_drinking_water', name: 'Department of Drinking Water & Sanitation', minister: 'Hon. Minister for Drinking Water', activeChallenges: 14, allocatedProjects: 9, budgetMobilized: '₹6.4 Cr' },
  { id: 'dept_agriculture', name: 'Department of Agriculture, Animal Husbandry & Co-operative', minister: 'Hon. Minister for Agriculture', activeChallenges: 18, allocatedProjects: 12, budgetMobilized: '₹8.2 Cr' },
  { id: 'dept_health', name: 'Department of Health, Medical Education & Family Welfare', minister: 'Hon. Minister for Health', activeChallenges: 11, allocatedProjects: 5, budgetMobilized: '₹3.1 Cr' },
  { id: 'dept_mines_env', name: 'Department of Mines, Geology & Environment', minister: 'Hon. Chief Minister (In-Charge)', activeChallenges: 16, allocatedProjects: 8, budgetMobilized: '₹14.8 Cr' },
  { id: 'dept_energy', name: 'Department of Energy & JREDA', minister: 'Hon. Minister for Energy', activeChallenges: 9, allocatedProjects: 6, budgetMobilized: '₹4.5 Cr' },
  { id: 'dept_urban_dev', name: 'Department of Urban Development & Housing (UDHD)', minister: 'Hon. Minister for Urban Development', activeChallenges: 13, allocatedProjects: 7, budgetMobilized: '₹5.6 Cr' }
];

export const MASTER_DISTRICTS_CATALOG = [
  { id: 'ranchi', name: 'Ranchi', nameHi: 'राँची', lat: 23.3441, lng: 85.3096, blocks: ['Sadar', 'Kanke', 'Namkum', 'Ratu', 'Ormanjhi', 'Burmu', 'Bero', 'Itki', 'Lapung'], totalProblems: 18, activeProjects: 9 },
  { id: 'khunti', name: 'Khunti', nameHi: 'खूँटी', lat: 23.0841, lng: 85.2514, blocks: ['Torpa', 'Khunti', 'Murhu', 'Rania', 'Karra', 'Arki'], totalProblems: 22, activeProjects: 14 },
  { id: 'dhanbad', name: 'Dhanbad', nameHi: 'धनबाद', lat: 23.7957, lng: 86.4304, blocks: ['Jharia', 'Dhanbad', 'Govindpur', 'Nirsa', 'Baliapur', 'Tundi', 'Topchanchi'], totalProblems: 26, activeProjects: 11 },
  { id: 'east_singhbhum', name: 'East Singhbhum', nameHi: 'पूर्वी सिंहभूम', lat: 22.8046, lng: 86.2029, blocks: ['Jamshedpur', 'Ghatshila', 'Baharagora', 'Potka', 'Patamda', 'Musabani'], totalProblems: 19, activeProjects: 8 },
  { id: 'west_singhbhum', name: 'West Singhbhum', nameHi: 'पश्चिमी सिंहभूम', lat: 22.5656, lng: 85.8111, blocks: ['Chaibasa', 'Chakradharpur', 'Manoharpur', 'Jagannathpur', 'Noamundi'], totalProblems: 15, activeProjects: 7 },
  { id: 'bokaro', name: 'Bokaro', nameHi: 'बोकारो', lat: 23.6693, lng: 86.1511, blocks: ['Chas', 'Bermo', 'Gomia', 'Jaridih', 'Petarwar', 'Chandankiyari', 'Kasmar'], totalProblems: 14, activeProjects: 6 },
  { id: 'hazaribagh', name: 'Hazaribagh', nameHi: 'हजारीबाग', lat: 23.9967, lng: 85.3688, blocks: ['Sadar', 'Barhi', 'Barkagaon', 'Chauparan', 'Ichak', 'Katkamsandi', 'Padma'], totalProblems: 12, activeProjects: 5 },
  { id: 'palamu', name: 'Palamu', nameHi: 'पलामू', lat: 24.0378, lng: 84.0682, blocks: ['Medininagar', 'Patan', 'Satbarwa', 'Chainpur', 'Lesliganj', 'Chattarpur', 'Hussainabad'], totalProblems: 21, activeProjects: 9 },
  { id: 'latehar', name: 'Latehar', nameHi: 'लातेहार', lat: 23.7431, lng: 84.4983, blocks: ['Latehar', 'Mahuadanr', 'Chandwa', 'Balumath', 'Barwadih', 'Garu', 'Herhanj'], totalProblems: 16, activeProjects: 7 },
  { id: 'deoghar', name: 'Deoghar', nameHi: 'देवघर', lat: 24.4826, lng: 86.7028, blocks: ['Deoghar', 'Madhupur', 'Sarath', 'Karon', 'Devipur', 'Mohanpur', 'Palojori'], totalProblems: 13, activeProjects: 4 },
  { id: 'dumka', name: 'Dumka', nameHi: 'दुमका', lat: 24.2694, lng: 87.2471, blocks: ['Dumka', 'Jama', 'Jarmundi', 'Kathikund', 'Ranishwar', 'Shikaripara', 'Masalia'], totalProblems: 17, activeProjects: 6 }
];
