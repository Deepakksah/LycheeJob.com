export interface Company {
  id: number;
  name: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  industry?: string;
}

export interface Job {
  id: number;
  externalJobId: string;
  sourceName: string;
  sourceId: number;
  title: string;
  companyId: number;
  company: Company;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  salaryPeriod: string;
  experienceMin?: number;
  experienceMax?: number;
  jobType: 'FullTime' | 'PartTime' | 'Contract' | 'Internship' | 'Freelance' | string;
  workMode: 'Remote' | 'Hybrid' | 'OnSite' | string;
  postedDate: string;
  expiryDate?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  interviewDate?: string;
  interviewStartTime?: string;
  interviewEndTime?: string;
  interviewLocation?: string;
  interviewMode?: string;
  interviewNotes?: string;
  applicationUrl: string;
  originalUrl?: string;
  isActive: boolean;
  isDemoData: boolean;
  duplicateCount: number;
  distanceKm?: number;
  skills: string[];
  createdAt: string;
}

export interface JobSearchFilters {
  keyword?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  north?: number;
  south?: number;
  east?: number;
  west?: number;
  minSalary?: number;
  maxSalary?: number;
  experience?: string;
  jobTypes?: string[];
  workModes?: string[];
  sources?: string[];
  postedWithinDays?: number;
  hasInterviewDate?: boolean;
  userLat?: number;
  userLng?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface JobSearchResponse {
  success: boolean;
  message?: string;
  data: Job[];
  pagination: Pagination;
}

export interface AdminStats {
  totalJobs: number;
  activeJobs: number;
  newJobsToday: number;
  totalCompanies: number;
  totalSources: number;
  failedSyncs: number;
  lastSyncTime?: string;
  jobsByCity: Record<string, number>;
  jobsByIndustry: Record<string, number>;
  jobsBySource: Record<string, number>;
  jobsByWorkMode: Record<string, number>;
}

export interface SyncLog {
  id: number;
  sourceId: number;
  source?: { name: string };
  startedAt: string;
  completedAt?: string;
  status: string;
  jobsFetched: number;
  jobsInserted: number;
  jobsUpdated: number;
  jobsSkipped: number;
  errorMessage?: string;
}

export interface JobSource {
  id: number;
  name: string;
  baseUrl?: string;
  sourceType: string;
  isActive: boolean;
  lastSyncAt?: string;
}
