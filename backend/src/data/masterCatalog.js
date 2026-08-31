/**
 * Master Reference Catalogs for SIH 2026 Innovation Ecosystem
 * Served dynamically by backend REST APIs:
 * - Universities & HEI Centers of Excellence
 * - Industry & CSR Grant Partners
 * - Government State Departments & 24 Jharkhand Districts
 */

export const MASTER_HEI_CATALOG = [
  {
    name: 'Birla Institute of Technology (BIT) Mesra',
    type: 'Deemed University & Tech Hub',
    location: { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' },
    availableDomains: ['Water Resources', 'Agriculture', 'Energy', 'Urban Development', 'Others'],
    contactEmail: 'innovation@bitmesra.ac.in'
  },
  {
    name: 'Indian Institute of Technology (ISM) Dhanbad',
    type: 'Institute of National Importance',
    location: { city: 'Dhanbad', district: 'Dhanbad', state: 'Jharkhand' },
    availableDomains: ['Energy', 'Environment', 'Water Resources', 'Others'],
    contactEmail: 'rd@iitism.ac.in'
  },
  {
    name: 'Birsa Agricultural University (BAU) Kanke',
    type: 'Agricultural University',
    location: { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' },
    availableDomains: ['Agriculture', 'Rural Livelihoods', 'Environment', 'Others'],
    contactEmail: 'innovation@bauranchi.org'
  },
  {
    name: 'National Institute of Technology (NIT) Jamshedpur',
    type: 'Institute of National Importance',
    location: { city: 'Jamshedpur', district: 'East Singhbhum', state: 'Jharkhand' },
    availableDomains: ['Energy', 'Urban Development', 'Accessibility', 'Others'],
    contactEmail: 'tbi@nitjsr.ac.in'
  },
  {
    name: 'Rajendra Institute of Medical Sciences (RIMS) Ranchi',
    type: 'Medical Institution',
    location: { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' },
    availableDomains: ['Healthcare', 'Accessibility', 'Public Administration', 'Others'],
    contactEmail: 'telehealth@rimsranchi.ac.in'
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
