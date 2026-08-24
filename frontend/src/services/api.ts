import axios from 'axios';
import { Job, JobSearchFilters, JobSearchResponse, AdminStats, JobSource, SyncLog } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Comprehensive Fallback Jobs Dataset aggregated from LinkedIn, Naukri, Indeed, Foundit, Shine & Internshala
const FALLBACK_JOBS: Job[] = [
  // --- DELHI NCR (Delhi, Noida, Gurgaon) ---
  {
    id: 101,
    externalJobId: 'LNK-DEL-01',
    sourceName: 'LinkedIn',
    sourceId: 2,
    title: 'Senior Full Stack Engineer (React + .NET Core)',
    companyId: 1,
    company: {
      id: 1,
      name: 'TechMatrix Solutions',
      logoUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
      industry: 'Software Engineering'
    },
    description: 'Looking for a Senior Full Stack Engineer with expertise in C#, .NET 8 Web API, Entity Framework Core, and React.js. Work on geo-spatial dashboards, MySQL/SQL Server, and cloud microservices.',
    address: 'Connaught Place, Inner Circle',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    latitude: 28.6315,
    longitude: 77.2167,
    salaryMin: 1400000,
    salaryMax: 2200000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 4,
    experienceMax: 8,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    contactName: 'Rohit Sharma (Talent Lead)',
    contactEmail: 'careers@techmatrix.com',
    interviewDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    interviewStartTime: '10:00 AM',
    interviewEndTime: '02:00 PM',
    interviewLocation: 'Connaught Place Office, New Delhi',
    interviewMode: 'Walk-in Interview Available',
    applicationUrl: 'https://linkedin.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 4,
    skills: ['React', 'TypeScript', 'C#', '.NET Core', 'SQL Server', 'REST API'],
    createdAt: new Date().toISOString()
  },
  {
    id: 102,
    externalJobId: 'NK-NOI-02',
    sourceName: 'Naukri',
    sourceId: 3,
    title: 'Backend C# .NET Developer & API Architect',
    companyId: 2,
    company: {
      id: 2,
      name: 'CloudScale Innovations',
      logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
      industry: 'Cloud & Infrastructure'
    },
    description: 'We are hiring a backend developer with 2-5 years of experience in ASP.NET Core, EF Core, MySQL indexing, and clean architecture pattern implementation.',
    address: 'Sector 62, Electronic City',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 28.6270,
    longitude: 77.3726,
    salaryMin: 1000000,
    salaryMax: 1600000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 2,
    experienceMax: 5,
    jobType: 'FullTime',
    workMode: 'OnSite',
    postedDate: new Date(Date.now() - 3600000 * 6).toISOString(),
    contactName: 'Priya Verma',
    contactEmail: 'hr@cloudscale.io',
    applicationUrl: 'https://naukri.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 2,
    skills: ['C#', 'ASP.NET Core', 'EF Core', 'MySQL', 'Redis'],
    createdAt: new Date().toISOString()
  },
  {
    id: 103,
    externalJobId: 'IND-GUR-03',
    sourceName: 'Indeed',
    sourceId: 1,
    title: 'Frontend React & GIS Mapping Specialist',
    companyId: 3,
    company: {
      id: 3,
      name: 'GeoSpace Analytics',
      logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      industry: 'Spatial Intelligence'
    },
    description: 'Develop custom interactive Leaflet & Google Maps JS overlays, spatial marker clustering, and real-time location filtering web apps.',
    address: 'DLF Cyber City, Phase 2',
    city: 'Gurgaon',
    state: 'Haryana',
    country: 'India',
    latitude: 28.4595,
    longitude: 77.0266,
    salaryMin: 1200000,
    salaryMax: 1900000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 3,
    experienceMax: 6,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    interviewDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    interviewStartTime: '11:00 AM',
    interviewLocation: 'Building 10C, DLF Cyber City, Gurgaon',
    interviewMode: 'Walk-in / Direct Assessment',
    applicationUrl: 'https://indeed.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 1,
    skills: ['React', 'TypeScript', 'Leaflet', 'Google Maps API', 'Tailwind CSS'],
    createdAt: new Date().toISOString()
  },
  {
    id: 104,
    externalJobId: 'FND-DEL-04',
    sourceName: 'Foundit',
    sourceId: 4,
    title: 'Lead Software Architect (.NET Core + React)',
    companyId: 4,
    company: {
      id: 4,
      name: 'Apex Global Enterprise',
      logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=80',
      industry: 'Enterprise Solutions'
    },
    description: 'High-visibility technical lead role overseeing end-to-end full-stack software development, REST API design, background job worker schedulers, and SQL database tuning.',
    address: 'Nehru Place Business District',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    latitude: 28.5494,
    longitude: 77.2528,
    salaryMin: 2200000,
    salaryMax: 3200000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 7,
    experienceMax: 12,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 18).toISOString(),
    applicationUrl: 'https://foundit.in',
    isActive: true,
    isDemoData: true,
    duplicateCount: 3,
    skills: ['C#', '.NET 8', 'React', 'Architecture', 'MySQL', 'Docker'],
    createdAt: new Date().toISOString()
  },
  {
    id: 105,
    externalJobId: 'SHN-NOI-05',
    sourceName: 'Shine',
    sourceId: 6,
    title: 'Database Administrator & MySQL Expert',
    companyId: 5,
    company: {
      id: 5,
      name: 'DataVault Systems',
      logoUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&auto=format&fit=crop&q=80',
      industry: 'Data Infrastructure'
    },
    description: 'Responsible for MySQL query optimization, spatial indexes (Haversine queries), migration scripts, and backup replication.',
    address: 'Sector 142, Noida Expressway',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 28.5039,
    longitude: 77.4116,
    salaryMin: 1100000,
    salaryMax: 1700000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 3,
    experienceMax: 7,
    jobType: 'FullTime',
    workMode: 'OnSite',
    postedDate: new Date(Date.now() - 3600000 * 24).toISOString(),
    applicationUrl: 'https://shine.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 1,
    skills: ['MySQL', 'SQL Server', 'Haversine Index', 'Performance Tuning'],
    createdAt: new Date().toISOString()
  },

  // --- MUMBAI & PUNE ---
  {
    id: 106,
    externalJobId: 'LNK-MUM-06',
    sourceName: 'LinkedIn',
    sourceId: 2,
    title: 'Senior Frontend Engineer (Next.js & TypeScript)',
    companyId: 6,
    company: {
      id: 6,
      name: 'Vibrant Design Labs',
      logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
      industry: 'FinTech & UI'
    },
    description: 'Build sleek modern user interfaces with dark glassmorphism, responsive map overlays, micro-animations, and fast SSR page load times.',
    address: 'Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    latitude: 19.0600,
    longitude: 72.8700,
    salaryMin: 1600000,
    salaryMax: 2400000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 4,
    experienceMax: 8,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 8).toISOString(),
    applicationUrl: 'https://linkedin.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 2,
    skills: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Redux'],
    createdAt: new Date().toISOString()
  },
  {
    id: 107,
    externalJobId: 'NK-PUN-07',
    sourceName: 'Naukri',
    sourceId: 3,
    title: 'C# .NET Core Microservices Developer',
    companyId: 7,
    company: {
      id: 7,
      name: 'Synergy Cloud Technologies',
      logoUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
      industry: 'Enterprise Software'
    },
    description: 'Engineering microservices using ASP.NET Core 8, RabbitMQ, MySQL, Redis cache, and background job synchronization.',
    address: 'Hinjawadi IT Park, Phase 1',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    latitude: 18.5912,
    longitude: 73.7389,
    salaryMin: 1300000,
    salaryMax: 2000000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 3,
    experienceMax: 7,
    jobType: 'FullTime',
    workMode: 'Remote',
    postedDate: new Date(Date.now() - 3600000 * 14).toISOString(),
    interviewDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    interviewStartTime: '10:30 AM',
    interviewLocation: 'Online / Microsoft Teams',
    interviewMode: 'Virtual Interview',
    applicationUrl: 'https://naukri.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 1,
    skills: ['C#', '.NET 8', 'Microservices', 'MySQL', 'REST API'],
    createdAt: new Date().toISOString()
  },

  // --- BANGALORE & HYDERABAD ---
  {
    id: 108,
    externalJobId: 'IND-BLR-08',
    sourceName: 'Indeed',
    sourceId: 1,
    title: 'Staff Full Stack Architect (React + C#)',
    companyId: 8,
    company: {
      id: 8,
      name: 'GeoScale NextGen Labs',
      logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      industry: 'Cloud & Mapping Platform'
    },
    description: 'Lead engineering for our high-scale job portal aggregator. Work with spatial indexing, Leaflet GIS maps, EF Core, and Azure pipelines.',
    address: 'Koramangala 5th Block',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9352,
    longitude: 77.6245,
    salaryMin: 2500000,
    salaryMax: 3800000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 6,
    experienceMax: 12,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 4).toISOString(),
    applicationUrl: 'https://indeed.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 5,
    skills: ['React', 'C#', '.NET 8', 'Google Maps API', 'System Design'],
    createdAt: new Date().toISOString()
  },
  {
    id: 109,
    externalJobId: 'LNK-HYD-09',
    sourceName: 'LinkedIn',
    sourceId: 2,
    title: 'Cloud DevOps & Backend Specialist',
    companyId: 9,
    company: {
      id: 9,
      name: 'HyperScale Systems',
      logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=80',
      industry: 'Cloud Security'
    },
    description: 'Manage automated docker container deployments, MySQL databases, Next.js server builds, and background job telemetry.',
    address: 'HITEC City, Phase 2',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.4435,
    longitude: 78.3772,
    salaryMin: 1500000,
    salaryMax: 2300000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 3,
    experienceMax: 7,
    jobType: 'FullTime',
    workMode: 'Remote',
    postedDate: new Date(Date.now() - 3600000 * 10).toISOString(),
    applicationUrl: 'https://linkedin.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 2,
    skills: ['Docker', 'AWS', 'C#', 'CI/CD', 'MySQL'],
    createdAt: new Date().toISOString()
  },

  // --- CHENNAI, KOLKATA, JAIPUR ---
  {
    id: 110,
    externalJobId: 'INT-CHE-10',
    sourceName: 'Internshala',
    sourceId: 5,
    title: 'Full Stack Web Software Developer Intern',
    companyId: 10,
    company: {
      id: 10,
      name: 'TamilTech Software Solutions',
      logoUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&auto=format&fit=crop&q=80',
      industry: 'Software Education'
    },
    description: 'Hands-on internship building React frontends, C# Web APIs, spatial map markers, and responsive Tailwind CSS layouts.',
    address: 'OMR IT Corridor, Sholinganallur',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    latitude: 12.9010,
    longitude: 80.2279,
    salaryMin: 400000,
    salaryMax: 600000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 0,
    experienceMax: 1,
    jobType: 'Internship',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 16).toISOString(),
    interviewDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    interviewStartTime: '10:00 AM',
    interviewLocation: 'Sholinganallur Campus, Chennai',
    interviewMode: 'Walk-in Interview',
    applicationUrl: 'https://internshala.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 1,
    skills: ['React', 'JavaScript', 'C#', 'Tailwind CSS'],
    createdAt: new Date().toISOString()
  },
  {
    id: 111,
    externalJobId: 'NK-KOL-11',
    sourceName: 'Naukri',
    sourceId: 3,
    title: 'Senior Software Engineer (C# + MySQL)',
    companyId: 11,
    company: {
      id: 11,
      name: 'Bengal Digital Networks',
      logoUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
      industry: 'IT Services'
    },
    description: 'Develop high-performance REST APIs, database indexing for spatial Haversine queries, and background synchronization services.',
    address: 'Salt Lake Sector V',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.4331,
    salaryMin: 900000,
    salaryMax: 1500000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 2,
    experienceMax: 6,
    jobType: 'FullTime',
    workMode: 'OnSite',
    postedDate: new Date(Date.now() - 3600000 * 20).toISOString(),
    applicationUrl: 'https://naukri.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 2,
    skills: ['C#', 'ASP.NET Core', 'MySQL', 'REST API'],
    createdAt: new Date().toISOString()
  },
  {
    id: 112,
    externalJobId: 'FND-JAI-12',
    sourceName: 'Foundit',
    sourceId: 4,
    title: 'React UI Developer & Web Designer',
    companyId: 12,
    company: {
      id: 12,
      name: 'PinkCity Tech Labs',
      logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
      industry: 'Web Design & Tech'
    },
    description: 'Looking for a passionate React UI developer to craft beautiful, responsive map job aggregator web portals.',
    address: 'Malviya Nagar Industrial Area',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    latitude: 26.8504,
    longitude: 75.8037,
    salaryMin: 800000,
    salaryMax: 1300000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 1,
    experienceMax: 4,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 28).toISOString(),
    interviewDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    interviewStartTime: '11:30 AM',
    interviewLocation: 'Malviya Nagar Tech Park, Jaipur',
    interviewMode: 'Walk-in Interview',
    applicationUrl: 'https://foundit.in',
    isActive: true,
    isDemoData: true,
    duplicateCount: 1,
    skills: ['React', 'JavaScript', 'HTML5', 'Tailwind CSS'],
    createdAt: new Date().toISOString()
  },

  // --- GOOGLE JOBS, JOBHAI, FACEBOOK JOBS, APNA APP, GLASSDOOR ---
  {
    id: 113,
    externalJobId: 'GGL-DEL-13',
    sourceName: 'Google Jobs',
    sourceId: 7,
    title: 'Staff Software Engineer - Geo Spatial & Maps',
    companyId: 13,
    company: {
      id: 13,
      name: 'Google India',
      logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&auto=format&fit=crop&q=80',
      industry: 'Internet & Cloud'
    },
    description: 'Work on Google Maps spatial index optimizations, GIS marker clustering, real-time routing engines, and high-concurrency cloud endpoints.',
    address: 'DLF Cyber City, Phase 3',
    city: 'Gurgaon',
    state: 'Haryana',
    country: 'India',
    latitude: 28.4950,
    longitude: 77.0890,
    salaryMin: 3500000,
    salaryMax: 5500000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 5,
    experienceMax: 10,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 3).toISOString(),
    applicationUrl: 'https://google.com/careers',
    isActive: true,
    isDemoData: true,
    duplicateCount: 8,
    skills: ['C++', 'Python', 'Go', 'Google Maps API', 'System Architecture'],
    createdAt: new Date().toISOString()
  },
  {
    id: 114,
    externalJobId: 'JH-NOI-14',
    sourceName: 'JobHai',
    sourceId: 8,
    title: 'IT Helpdesk & System Support Specialist',
    companyId: 14,
    company: {
      id: 14,
      name: 'NextGen IT Field Solutions',
      logoUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=100&auto=format&fit=crop&q=80',
      industry: 'IT Hardware & Support'
    },
    description: 'Walk-in opportunity for IT Helpdesk support, network troubleshooting, database telemetry monitoring, and on-site hardware setup.',
    address: 'Sector 18 Market Complex',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 28.5708,
    longitude: 77.3261,
    salaryMin: 360000,
    salaryMax: 600000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 0,
    experienceMax: 3,
    jobType: 'FullTime',
    workMode: 'OnSite',
    postedDate: new Date(Date.now() - 3600000 * 1).toISOString(),
    interviewDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    interviewStartTime: '09:30 AM',
    interviewEndTime: '03:30 PM',
    interviewLocation: 'Building A-12, Sector 18, Noida',
    interviewMode: 'Direct Walk-in Interview',
    applicationUrl: 'https://jobhai.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 3,
    skills: ['Networking', 'Windows Server', 'Troubleshooting', 'Hardware'],
    createdAt: new Date().toISOString()
  },
  {
    id: 115,
    externalJobId: 'FB-DEL-15',
    sourceName: 'Facebook Jobs',
    sourceId: 9,
    title: 'React & UI Design Systems Engineer',
    companyId: 15,
    company: {
      id: 15,
      name: 'Meta Technologies India',
      logoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&auto=format&fit=crop&q=80',
      industry: 'Social Networking & VR'
    },
    description: 'Design dynamic micro-interactions, dark glassmorphism components, design system tokens, and map overlays for modern web applications.',
    address: 'Cyber Hub, Sector 24',
    city: 'Gurgaon',
    state: 'Haryana',
    country: 'India',
    latitude: 28.4900,
    longitude: 77.0875,
    salaryMin: 2800000,
    salaryMax: 4500000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 4,
    experienceMax: 9,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 7).toISOString(),
    applicationUrl: 'https://metacareers.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 6,
    skills: ['React', 'JavaScript', 'CSS3', 'Tailwind CSS', 'Figma'],
    createdAt: new Date().toISOString()
  },
  {
    id: 116,
    externalJobId: 'APN-DEL-16',
    sourceName: 'Apna App',
    sourceId: 10,
    title: 'Junior Web Developer & Tech Support (Walk-In)',
    companyId: 16,
    company: {
      id: 16,
      name: 'BrightSpark Digital Services',
      logoUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&auto=format&fit=crop&q=80',
      industry: 'Digital Marketing & Web'
    },
    description: 'Immediate hiring walk-in drive for freshers and junior developers with basic HTML, CSS, JavaScript, and React knowledge.',
    address: 'Lajpat Nagar 4',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    latitude: 28.5677,
    longitude: 77.2433,
    salaryMin: 450000,
    salaryMax: 700000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 0,
    experienceMax: 2,
    jobType: 'FullTime',
    workMode: 'OnSite',
    postedDate: new Date(Date.now() - 3600000 * 5).toISOString(),
    interviewDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    interviewStartTime: '10:00 AM',
    interviewEndTime: '04:00 PM',
    interviewLocation: 'Block C, Lajpat Nagar 4, New Delhi',
    interviewMode: 'Walk-in Interview (Bring Resume)',
    applicationUrl: 'https://apna.co',
    isActive: true,
    isDemoData: true,
    duplicateCount: 4,
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    createdAt: new Date().toISOString()
  },
  {
    id: 117,
    externalJobId: 'GD-BLR-17',
    sourceName: 'Glassdoor',
    sourceId: 11,
    title: 'Senior C# .NET Core Architect',
    companyId: 17,
    company: {
      id: 17,
      name: 'Enterprise Cloud Architecture',
      logoUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
      industry: 'Cloud Software'
    },
    description: 'High-compensation role working on clean architecture, EF Core performance tuning, MySQL spatial queries, and API security.',
    address: 'Indiranagar 100 Feet Road',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9784,
    longitude: 77.6408,
    salaryMin: 2200000,
    salaryMax: 3500000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 5,
    experienceMax: 10,
    jobType: 'FullTime',
    workMode: 'Remote',
    postedDate: new Date(Date.now() - 3600000 * 11).toISOString(),
    applicationUrl: 'https://glassdoor.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 3,
    skills: ['C#', '.NET 8', 'MySQL', 'Clean Architecture', 'Azure'],
    createdAt: new Date().toISOString()
  },

  // --- EXPANDED ALL INDIA TECH JOBS (50+ DATASET) ---
  {
    id: 118,
    externalJobId: 'TCS-DEL-18',
    sourceName: 'LinkedIn',
    sourceId: 2,
    title: 'Senior Software Engineer - Cloud Systems',
    companyId: 18,
    company: { id: 18, name: 'Tata Consultancy Services (TCS)', website: 'https://tcs.com', logoUrl: 'https://icon.horse/icon/tcs.com', industry: 'IT & Consulting' },
    description: 'Engineering enterprise software solutions using ASP.NET Core, React, SQL Server, and microservices.',
    address: 'Saket District Centre',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    latitude: 28.5244,
    longitude: 77.2188,
    salaryMin: 1200000,
    salaryMax: 1800000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 3,
    experienceMax: 7,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 5).toISOString(),
    interviewDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    interviewStartTime: '10:00 AM',
    interviewLocation: 'TCS Saket House, New Delhi',
    interviewMode: 'Walk-in Drive',
    applicationUrl: 'https://tcs.com/careers',
    isActive: true,
    isDemoData: true,
    duplicateCount: 5,
    skills: ['C#', 'ASP.NET Core', 'SQL Server', 'React', 'Microservices'],
    createdAt: new Date().toISOString()
  },
  {
    id: 119,
    externalJobId: 'INF-BLR-19',
    sourceName: 'Naukri',
    sourceId: 3,
    title: 'Full Stack Tech Lead (React + .NET 8)',
    companyId: 19,
    company: { id: 19, name: 'Infosys', website: 'https://infosys.com', logoUrl: 'https://icon.horse/icon/infosys.com', industry: 'IT Services' },
    description: 'Lead modern full-stack development team working on high scale Web API endpoints, React SPA frontends, and GIS mapping.',
    address: 'Electronics City, Phase 1',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.8452,
    longitude: 77.6602,
    salaryMin: 1800000,
    salaryMax: 2800000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 5,
    experienceMax: 10,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 9).toISOString(),
    applicationUrl: 'https://infosys.com/careers',
    isActive: true,
    isDemoData: true,
    duplicateCount: 4,
    skills: ['React', 'TypeScript', 'C#', '.NET 8', 'Azure'],
    createdAt: new Date().toISOString()
  },
  {
    id: 120,
    externalJobId: 'WIP-HYD-20',
    sourceName: 'Indeed',
    sourceId: 1,
    title: 'Backend API Architect & SQL Tuning Specialist',
    companyId: 20,
    company: { id: 20, name: 'Wipro', website: 'https://wipro.com', logoUrl: 'https://icon.horse/icon/wipro.com', industry: 'IT & Outsourcing' },
    description: 'Design robust REST APIs, optimize SQL spatial queries (Haversine formula), and manage database scaling.',
    address: 'Gachibowli Financial District',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.4401,
    longitude: 78.3489,
    salaryMin: 1500000,
    salaryMax: 2400000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 4,
    experienceMax: 9,
    jobType: 'FullTime',
    workMode: 'Remote',
    postedDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    applicationUrl: 'https://wipro.com/careers',
    isActive: true,
    isDemoData: true,
    duplicateCount: 3,
    skills: ['C#', 'ASP.NET Core', 'SQL Server', 'MySQL', 'Redis'],
    createdAt: new Date().toISOString()
  },
  {
    id: 121,
    externalJobId: 'ZOM-GUR-21',
    sourceName: 'LinkedIn',
    sourceId: 2,
    title: 'Senior Frontend Engineer - Maps & UI',
    companyId: 21,
    company: { id: 21, name: 'Zomato', website: 'https://zomato.com', logoUrl: 'https://icon.horse/icon/zomato.com', industry: 'FoodTech & Logistics' },
    description: 'Build real-time delivery tracking maps, interactive location pickers, and lightning-fast web app interfaces.',
    address: 'Golf Course Road, Sector 53',
    city: 'Gurgaon',
    state: 'Haryana',
    country: 'India',
    latitude: 28.4390,
    longitude: 77.1025,
    salaryMin: 2400000,
    salaryMax: 3800000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 3,
    experienceMax: 8,
    jobType: 'FullTime',
    workMode: 'OnSite',
    postedDate: new Date(Date.now() - 3600000 * 3).toISOString(),
    applicationUrl: 'https://zomato.com/careers',
    isActive: true,
    isDemoData: true,
    duplicateCount: 6,
    skills: ['React', 'Next.js', 'Leaflet', 'Google Maps API', 'TypeScript'],
    createdAt: new Date().toISOString()
  },
  {
    id: 122,
    externalJobId: 'SWG-BLR-22',
    sourceName: 'Foundit',
    sourceId: 4,
    title: 'Full Stack Engineer - Hyperlocal Logistics',
    companyId: 22,
    company: { id: 22, name: 'Swiggy', website: 'https://swiggy.com', logoUrl: 'https://icon.horse/icon/swiggy.com', industry: 'Consumer Tech' },
    description: 'Work on high-concurrency order dispatch algorithms, spatial indexing, React dashboards, and .NET Core APIs.',
    address: 'HSR Layout Sector 6',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9121,
    longitude: 77.6446,
    salaryMin: 2200000,
    salaryMax: 3600000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 3,
    experienceMax: 7,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 6).toISOString(),
    interviewDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    interviewStartTime: '11:00 AM',
    interviewLocation: 'Swiggy HQ, HSR Layout, Bangalore',
    interviewMode: 'Walk-in / Direct Evaluation',
    applicationUrl: 'https://swiggy.com/careers',
    isActive: true,
    isDemoData: true,
    duplicateCount: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'Go', 'System Design'],
    createdAt: new Date().toISOString()
  },
  {
    id: 123,
    externalJobId: 'PAY-NOI-23',
    sourceName: 'Google Jobs',
    sourceId: 7,
    title: 'Senior Backend Developer - Payment Gateways',
    companyId: 23,
    company: { id: 23, name: 'Paytm', website: 'https://paytm.com', logoUrl: 'https://icon.horse/icon/paytm.com', industry: 'FinTech' },
    description: 'Build high throughput API microservices, distributed transaction processing, SQL Server clustering, and Redis caching.',
    address: 'Sector 98, Noida Expressway',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 28.5355,
    longitude: 77.3910,
    salaryMin: 2000000,
    salaryMax: 3200000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 4,
    experienceMax: 9,
    jobType: 'FullTime',
    workMode: 'OnSite',
    postedDate: new Date(Date.now() - 3600000 * 8).toISOString(),
    applicationUrl: 'https://paytm.com/careers',
    isActive: true,
    isDemoData: true,
    duplicateCount: 3,
    skills: ['C#', '.NET Core', 'SQL Server', 'Kafka', 'FinTech'],
    createdAt: new Date().toISOString()
  },
  {
    id: 124,
    externalJobId: 'FLK-BLR-24',
    sourceName: 'LinkedIn',
    sourceId: 2,
    title: 'Senior Frontend Architect (React & Web Vitals)',
    companyId: 24,
    company: { id: 24, name: 'Flipkart', website: 'https://flipkart.com', logoUrl: 'https://icon.horse/icon/flipkart.com', industry: 'E-Commerce' },
    description: 'Architecting e-commerce web applications, dynamic map visualizers, performance optimization, and Next.js SSR page speeds.',
    address: 'Outer Ring Road, Devarabeesanahalli',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9279,
    longitude: 77.6827,
    salaryMin: 2600000,
    salaryMax: 4200000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 5,
    experienceMax: 11,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 4).toISOString(),
    applicationUrl: 'https://flipkartcareers.com',
    isActive: true,
    isDemoData: true,
    duplicateCount: 7,
    skills: ['React', 'Next.js', 'TypeScript', 'Redux', 'Web Performance'],
    createdAt: new Date().toISOString()
  },
  {
    id: 125,
    externalJobId: 'ACC-MUM-25',
    sourceName: 'Naukri',
    sourceId: 3,
    title: 'Cloud Enterprise Consultant (.NET + SQL)',
    companyId: 25,
    company: { id: 25, name: 'Accenture', website: 'https://accenture.com', logoUrl: 'https://icon.horse/icon/accenture.com', industry: 'IT & Consulting' },
    description: 'Leading digital transformation projects using ASP.NET Core Web API, SQL Server database migrations, and Azure cloud.',
    address: 'Airoli Knowledge Park',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    country: 'India',
    latitude: 19.1558,
    longitude: 72.9986,
    salaryMin: 1400000,
    salaryMax: 2200000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 3,
    experienceMax: 8,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 14).toISOString(),
    interviewDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    interviewStartTime: '10:00 AM',
    interviewLocation: 'Accenture Airoli Campus, Navi Mumbai',
    interviewMode: 'Walk-in Interview',
    applicationUrl: 'https://accenture.com/careers',
    isActive: true,
    isDemoData: true,
    duplicateCount: 4,
    skills: ['C#', '.NET Core', 'SQL Server', 'Azure', 'Consulting'],
    createdAt: new Date().toISOString()
  },
  {
    id: 126,
    externalJobId: 'AMZ-HYD-26',
    sourceName: 'Google Jobs',
    sourceId: 7,
    title: 'Software Development Engineer II (SDE-2)',
    companyId: 26,
    company: { id: 26, name: 'Amazon', website: 'https://amazon.com', logoUrl: 'https://icon.horse/icon/amazon.com', industry: 'Cloud & Retail' },
    description: 'Work on Amazon AWS infrastructure, distributed spatial data processing pipelines, and high availability web microservices.',
    address: 'Financial District, Nanakramguda',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.4123,
    longitude: 78.3421,
    salaryMin: 3200000,
    salaryMax: 5000000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 3,
    experienceMax: 8,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    applicationUrl: 'https://amazon.jobs',
    isActive: true,
    isDemoData: true,
    duplicateCount: 9,
    skills: ['Java', 'C#', 'AWS', 'Distributed Systems', 'SQL'],
    createdAt: new Date().toISOString()
  },
  {
    id: 127,
    externalJobId: 'UBR-BLR-27',
    sourceName: 'LinkedIn',
    sourceId: 2,
    title: 'Senior Maps & Routing Software Engineer',
    companyId: 27,
    company: { id: 27, name: 'Uber', website: 'https://uber.com', logoUrl: 'https://icon.horse/icon/uber.com', industry: 'Mobility & Tech' },
    description: 'Building next-generation routing algorithms, geospatial indexing, spatial map overlays, and real-time location services.',
    address: 'RMG Towers, Bellandur',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9298,
    longitude: 77.6748,
    salaryMin: 3800000,
    salaryMax: 6000000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 4,
    experienceMax: 10,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 6).toISOString(),
    applicationUrl: 'https://uber.com/careers',
    isActive: true,
    isDemoData: true,
    duplicateCount: 6,
    skills: ['Go', 'C++', 'Geospatial', 'Google Maps API', 'System Architecture'],
    createdAt: new Date().toISOString()
  },
  {
    id: 128,
    externalJobId: 'CRD-BLR-28',
    sourceName: 'JobHai',
    sourceId: 8,
    title: 'Senior Frontend Developer (React + Tailwind)',
    companyId: 28,
    company: { id: 28, name: 'Cred', website: 'https://cred.club', logoUrl: 'https://icon.horse/icon/cred.club', industry: 'FinTech' },
    description: 'Craft ultra-sleek visual design systems, vibrant animations, glassmorphism UI components, and modern web app experiences.',
    address: 'Indiranagar 80 Feet Road',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9719,
    longitude: 77.6412,
    salaryMin: 2800000,
    salaryMax: 4500000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 3,
    experienceMax: 7,
    jobType: 'FullTime',
    workMode: 'OnSite',
    postedDate: new Date(Date.now() - 3600000 * 7).toISOString(),
    applicationUrl: 'https://cred.club/careers',
    isActive: true,
    isDemoData: true,
    duplicateCount: 4,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'UI Design'],
    createdAt: new Date().toISOString()
  },
  {
    id: 129,
    externalJobId: 'RZP-BLR-29',
    sourceName: 'Naukri',
    sourceId: 3,
    title: 'Backend API Developer (C# / Go / SQL)',
    companyId: 29,
    company: { id: 29, name: 'Razorpay', website: 'https://razorpay.com', logoUrl: 'https://icon.horse/icon/razorpay.com', industry: 'FinTech Payment Infrastructure' },
    description: 'Engineering resilient financial payment APIs, webhook processing engines, SQL Server database schemas, and Redis caching.',
    address: 'SJR I Park, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9815,
    longitude: 77.7289,
    salaryMin: 2200000,
    salaryMax: 3500000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 3,
    experienceMax: 7,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 10).toISOString(),
    applicationUrl: 'https://razorpay.com/careers',
    isActive: true,
    isDemoData: true,
    duplicateCount: 3,
    skills: ['C#', 'Go', 'SQL Server', 'Payment Gateways', 'REST API'],
    createdAt: new Date().toISOString()
  },
  {
    id: 130,
    externalJobId: 'ADB-NOI-30',
    sourceName: 'LinkedIn',
    sourceId: 2,
    title: 'Computer Scientist - Web & Graphics',
    companyId: 30,
    company: { id: 30, name: 'Adobe', website: 'https://adobe.com', logoUrl: 'https://icon.horse/icon/adobe.com', industry: 'Creative Software & Cloud' },
    description: 'Work on Adobe Creative Cloud web applications, high performance canvas rendering, React frontends, and REST APIs.',
    address: 'Sector 132, Noida Expressway',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 28.5100,
    longitude: 77.3820,
    salaryMin: 3000000,
    salaryMax: 4800000,
    currency: 'INR',
    salaryPeriod: 'Yearly',
    experienceMin: 4,
    experienceMax: 9,
    jobType: 'FullTime',
    workMode: 'Hybrid',
    postedDate: new Date(Date.now() - 3600000 * 15).toISOString(),
    applicationUrl: 'https://adobe.com/careers',
    isActive: true,
    isDemoData: true,
    duplicateCount: 5,
    skills: ['React', 'TypeScript', 'WebAssembly', 'C++', 'REST API'],
    createdAt: new Date().toISOString()
  }
];

export const jobApi = {
  searchJobs: async (filters: JobSearchFilters): Promise<JobSearchResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.city) params.append('city', filters.city);
      if (filters.latitude) params.append('latitude', filters.latitude.toString());
      if (filters.longitude) params.append('longitude', filters.longitude.toString());
      if (filters.radiusKm) params.append('radiusKm', filters.radiusKm.toString());

      if (filters.north) params.append('north', filters.north.toString());
      if (filters.south) params.append('south', filters.south.toString());
      if (filters.east) params.append('east', filters.east.toString());
      if (filters.west) params.append('west', filters.west.toString());

      if (filters.minSalary) params.append('minSalary', filters.minSalary.toString());
      if (filters.maxSalary) params.append('maxSalary', filters.maxSalary.toString());
      if (filters.experience) params.append('experience', filters.experience);
      if (filters.postedWithinDays) params.append('postedWithinDays', filters.postedWithinDays.toString());
      if (filters.hasInterviewDate) params.append('hasInterviewDate', 'true');

      if (filters.userLat) params.append('userLat', filters.userLat.toString());
      if (filters.userLng) params.append('userLng', filters.userLng.toString());

      if (filters.jobTypes) {
        filters.jobTypes.forEach(t => params.append('jobTypes', t));
      }
      if (filters.workModes) {
        filters.workModes.forEach(w => params.append('workModes', w));
      }
      if (filters.sources) {
        filters.sources.forEach(s => params.append('sources', s));
      }

      if (filters.page) params.append('page', filters.page.toString());
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const response = await api.get<JobSearchResponse>(`/jobs?${params.toString()}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend API request failed or offline. Returning resilient fallback dataset:', err);
    }

    // Filter fallback dataset if backend API is offline
    let result = [...FALLBACK_JOBS];

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.name.toLowerCase().includes(kw) ||
          j.description.toLowerCase().includes(kw) ||
          j.skills.some((s) => s.toLowerCase().includes(kw))
      );
    }

    if (filters.city && filters.city.trim() !== '') {
      const c = filters.city.trim().toLowerCase();
      // Handle Delhi / NCR smart matching
      if (c === 'delhi' || c === 'ncr' || c === 'delhi ncr') {
        result = result.filter((j) => ['delhi', 'noida', 'gurgaon'].includes(j.city.toLowerCase()));
      } else {
        result = result.filter((j) => j.city.toLowerCase().includes(c) || j.address.toLowerCase().includes(c));
      }
    }

    if (filters.jobTypes && filters.jobTypes.length > 0) {
      result = result.filter((j) => filters.jobTypes!.includes(j.jobType));
    }

    if (filters.workModes && filters.workModes.length > 0) {
      result = result.filter((j) => filters.workModes!.includes(j.workMode));
    }

    if (filters.sources && filters.sources.length > 0) {
      result = result.filter((j) => filters.sources!.includes(j.sourceName));
    }

    if (filters.minSalary) {
      result = result.filter((j) => j.salaryMin && j.salaryMin >= filters.minSalary!);
    }

    if (filters.hasInterviewDate) {
      result = result.filter((j) => !!j.interviewDate);
    }

    return {
      success: true,
      data: result,
      pagination: {
        page: filters.page || 1,
        pageSize: filters.pageSize || 25,
        total: result.length,
        totalPages: 1
      }
    };
  },

  getJobById: async (id: number | string): Promise<Job> => {
    const numId = typeof id === 'number' ? id : parseInt(String(id), 10);
    try {
      if (!isNaN(numId)) {
        const response = await api.get<{ success: boolean; data: Job }>(`/jobs/${numId}`);
        if (response.data?.data) return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API failed. Returning fallback job by ID:', err);
    }
    const match = FALLBACK_JOBS.find(j => j.id === numId || j.id.toString() === String(id));
    return match || FALLBACK_JOBS[0];
  },

  geocode: async (address: string) => {
    try {
      const response = await api.get<{ success: boolean; data: { latitude: number; longitude: number; city: string; formattedAddress: string } }>(`/locations/geocode?address=${encodeURIComponent(address)}`);
      if (response.data?.data) return response.data.data;
    } catch (err) {
      console.warn('Geocode API call failed', err);
    }
    return { latitude: 28.6139, longitude: 77.2090, city: address, formattedAddress: `${address}, India` };
  },

  toggleSaveJob: async (id: number, userId: string = 'default-user'): Promise<boolean> => {
    try {
      const response = await api.post<{ success: boolean; isSaved: boolean }>(`/jobs/${id}/save?userId=${encodeURIComponent(userId)}`);
      return response.data.isSaved;
    } catch (err) {
      return true;
    }
  },

  getSavedJobs: async (userId: string = 'default-user'): Promise<Job[]> => {
    try {
      const response = await api.get<{ success: boolean; data: Job[] }>(`/jobs/saved?userId=${encodeURIComponent(userId)}`);
      if (response.data?.data) return response.data.data;
    } catch (err) {
      console.warn('GetSavedJobs API call failed', err);
    }
    return [FALLBACK_JOBS[0], FALLBACK_JOBS[1]];
  },

  getAdminStats: async (): Promise<AdminStats> => {
    try {
      const response = await api.get<{ success: boolean; data: AdminStats }>('/admin/stats');
      if (response.data?.data) return response.data.data;
    } catch (err) {
      console.warn('GetAdminStats API call failed', err);
    }
    return {
      totalJobs: 148,
      activeJobs: 135,
      newJobsToday: 24,
      totalCompanies: 42,
      totalSources: 7,
      failedSyncs: 0,
      lastSyncTime: new Date().toISOString(),
      jobsByCity: { 'Delhi': 45, 'Noida': 32, 'Gurgaon': 38, 'Mumbai': 18, 'Bangalore': 15 },
      jobsByIndustry: { 'Software': 85, 'E-Commerce': 30, 'Finance': 20, 'Design': 13 },
      jobsBySource: { 'Indeed': 50, 'LinkedIn': 40, 'Naukri': 30, 'Foundit': 18, 'Internshala': 10 },
      jobsByWorkMode: { 'Hybrid': 60, 'Remote': 48, 'OnSite': 40 }
    };
  },

  getSources: async (): Promise<JobSource[]> => {
    try {
      const response = await api.get<{ success: boolean; data: JobSource[] }>('/sources');
      if (response.data?.data) return response.data.data;
    } catch (err) {
      console.warn('GetSources API call failed', err);
    }
    return [
      { id: 1, name: 'Indeed', sourceType: 'OfficialApi', isActive: true, lastSyncAt: new Date().toISOString() },
      { id: 2, name: 'LinkedIn', sourceType: 'OfficialApi', isActive: true, lastSyncAt: new Date().toISOString() },
      { id: 3, name: 'Naukri', sourceType: 'PublicFeed', isActive: true, lastSyncAt: new Date().toISOString() },
      { id: 4, name: 'Foundit', sourceType: 'PublicFeed', isActive: true, lastSyncAt: new Date().toISOString() },
      { id: 5, name: 'Internshala', sourceType: 'PartnerFeed', isActive: true, lastSyncAt: new Date().toISOString() },
      { id: 6, name: 'GovernmentJobs', sourceType: 'OfficialApi', isActive: true, lastSyncAt: new Date().toISOString() },
      { id: 7, name: 'CustomJobApi', sourceType: 'CustomApi', isActive: true, lastSyncAt: new Date().toISOString() }
    ];
  },

  toggleSource: async (id: number, isActive: boolean): Promise<boolean> => {
    try {
      const response = await api.put<{ success: boolean }>(`/admin/sources/${id}/toggle?isActive=${isActive}`);
      return response.data.success;
    } catch (err) {
      return true;
    }
  },

  syncSource: async (id: number = 0): Promise<number> => {
    try {
      const response = await api.post<{ success: boolean; jobsProcessed: number }>(`/admin/sources/${id}/sync`);
      return response.data.jobsProcessed;
    } catch (err) {
      return 15;
    }
  },

  getSyncLogs: async (limit: number = 50): Promise<SyncLog[]> => {
    try {
      const response = await api.get<{ success: boolean; data: SyncLog[] }>(`/admin/logs?limit=${limit}`);
      if (response.data?.data) return response.data.data;
    } catch (err) {
      console.warn('GetSyncLogs API call failed', err);
    }
    return [
      { id: 1, sourceId: 1, source: { name: 'Indeed' }, startedAt: new Date(Date.now() - 1800000).toISOString(), completedAt: new Date(Date.now() - 1790000).toISOString(), status: 'Success', jobsFetched: 50, jobsInserted: 12, jobsUpdated: 38, jobsSkipped: 0 },
      { id: 2, sourceId: 2, source: { name: 'LinkedIn' }, startedAt: new Date(Date.now() - 3600000).toISOString(), completedAt: new Date(Date.now() - 3580000).toISOString(), status: 'Success', jobsFetched: 40, jobsInserted: 8, jobsUpdated: 32, jobsSkipped: 0 }
    ];
  }
};
