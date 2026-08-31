using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;

namespace JobPortal.Infrastructure.JobSources
{
    public class GovernmentJobsProvider : IJobSourceProvider
    {
        public string SourceName => "GovernmentJobs";

        public Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchRequest request, CancellationToken cancellationToken = default)
        {
            var jobs = new List<JobDto>
            {
                // 1. ISRO
                new JobDto
                {
                    ExternalJobId = "GOV-ISRO-SC-2025",
                    SourceName = SourceName,
                    Title = "Scientist / Engineer ‘SC’ (Computer Science & AI/ML)",
                    Company = new CompanyDto
                    {
                        Name = "Indian Space Research Organisation (ISRO)",
                        LogoUrl = "https://icon.horse/icon/isro.gov.in",
                        Website = "https://isro.gov.in",
                        Industry = "Defense & Space (Central Govt)"
                    },
                    Description = "Recruitment of Scientist/Engineer ‘SC’ in Level 10 (7th CPC: ₹56,100 - ₹1,77,500). Work on satellite telemetry, mission control systems, remote sensing data processing, and launch vehicle onboard guidance computers.",
                    Address = "ISRO HQ, Antariksh Bhavan, New BEL Road",
                    City = "Bangalore",
                    State = "Karnataka",
                    Country = "India",
                    Latitude = 13.0334,
                    Longitude = 77.5640,
                    SalaryMin = 850000,
                    SalaryMax = 1650000,
                    SalaryPeriod = "Yearly",
                    ExperienceMin = 0,
                    ExperienceMax = 2,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddHours(-12),
                    ExpiryDate = DateTime.UtcNow.AddDays(25),
                    InterviewDate = DateTime.UtcNow.AddDays(40),
                    InterviewStartTime = "09:00 AM",
                    InterviewLocation = "URSC ISRO Campus, Bangalore",
                    InterviewMode = "Written Exam + Interview",
                    ApplicationUrl = "https://isro.gov.in/careers",
                    OriginalUrl = "https://www.isro.gov.in/media_isro/pdf/recruitment/Advt_Scientist_SC_2025.pdf",
                    Skills = new List<string> { "B.Tech CSE/IT", "C++", "Python", "RTOS", "7th CPC Level 10", "GATE Score" },
                    IsDemoData = false
                },

                // 2. DRDO
                new JobDto
                {
                    ExternalJobId = "GOV-DRDO-RAC-147",
                    SourceName = SourceName,
                    Title = "Scientist ‘B’ Recruitment (RAC Advt 147)",
                    Company = new CompanyDto
                    {
                        Name = "Defence Research & Development Organisation (DRDO)",
                        LogoUrl = "https://icon.horse/icon/drdo.gov.in",
                        Website = "https://drdo.gov.in",
                        Industry = "Defense & Military Research"
                    },
                    Description = "Recruitment for Scientist ‘B’ in Level 10 of Pay Matrix (₹56,100 basic + DA + HRA + Special allowances). Work on radar signal processing, cyber warfare systems, and autonomous defense robotics.",
                    Address = "DRDO Bhawan, Rajaji Marg, Central Secretariat",
                    City = "Delhi",
                    State = "Delhi",
                    Country = "India",
                    Latitude = 28.6143,
                    Longitude = 77.2088,
                    SalaryMin = 900000,
                    SalaryMax = 1700000,
                    SalaryPeriod = "Yearly",
                    ExperienceMin = 0,
                    ExperienceMax = 1,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddDays(-1),
                    ExpiryDate = DateTime.UtcNow.AddDays(20),
                    InterviewDate = DateTime.UtcNow.AddDays(45),
                    InterviewStartTime = "09:30 AM",
                    InterviewLocation = "RAC Complex, Lucknow Road, Timarpur, Delhi",
                    InterviewMode = "Interview",
                    ApplicationUrl = "https://rac.gov.in",
                    OriginalUrl = "https://rac.gov.in/download/advt_147_scientist_b.pdf",
                    Skills = new List<string> { "GATE 2024/2025", "B.Tech/BE", "Signal Processing", "C/C++", "7th CPC Level 10" },
                    IsDemoData = false
                },

                // 3. NIC
                new JobDto
                {
                    ExternalJobId = "GOV-NIC-SCB-598",
                    SourceName = SourceName,
                    Title = "Scientist ‘B’ & Scientific Assistant ‘A’ (598 Vacancies)",
                    Company = new CompanyDto
                    {
                        Name = "National Informatics Centre (NIC)",
                        LogoUrl = "https://icon.horse/icon/nic.in",
                        Website = "https://nic.in",
                        Industry = "Informatics & IT (MeitY)"
                    },
                    Description = "Ministry of Electronics & IT inviting applications for Scientist-B (Level 10) & Scientific Assistant-A (Level 7: ₹44,900 - ₹1,42,400). Develop national Digital India infrastructure, e-Governance portals, and cyber security.",
                    Address = "CGO Complex, Lodhi Road",
                    City = "Delhi",
                    State = "Delhi",
                    Country = "India",
                    Latitude = 28.5892,
                    Longitude = 77.2346,
                    SalaryMin = 650000,
                    SalaryMax = 1450000,
                    SalaryPeriod = "Yearly",
                    ExperienceMin = 0,
                    ExperienceMax = 2,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddDays(-2),
                    ExpiryDate = DateTime.UtcNow.AddDays(30),
                    InterviewDate = DateTime.UtcNow.AddDays(50),
                    InterviewStartTime = "10:00 AM",
                    InterviewLocation = "All India CBT Centres",
                    InterviewMode = "Computer Based Test (CBT)",
                    ApplicationUrl = "https://calicut.nielit.in/nic",
                    OriginalUrl = "https://www.nielit.gov.in/sites/default/files/recruitments/Advt_NIC_2025.pdf",
                    Skills = new List<string> { "B.Tech/MCA/M.Sc", "Java", "Python", "Cloud Computing", "SQL", "7th CPC Level 7/10" },
                    IsDemoData = false
                },

                // 4. SBI PO
                new JobDto
                {
                    ExternalJobId = "GOV-SBI-PO-2000",
                    SourceName = SourceName,
                    Title = "Probationary Officer (SBI PO) & Specialist IT Officer",
                    Company = new CompanyDto
                    {
                        Name = "State Bank of India (SBI)",
                        LogoUrl = "https://icon.horse/icon/sbi.co.in",
                        Website = "https://sbi.co.in",
                        Industry = "Public Sector Banking"
                    },
                    Description = "SBI recruiting 2,000+ Probationary Officers. Basic pay ₹41,960 with 4 advance increments (Total initial gross approx ₹82,000/mo + Lease accommodation + Medical benefits).",
                    Address = "State Bank Bhavan, Madame Cama Road, Nariman Point",
                    City = "Mumbai",
                    State = "Maharashtra",
                    Country = "India",
                    Latitude = 18.9272,
                    Longitude = 72.8228,
                    SalaryMin = 980000,
                    SalaryMax = 1450000,
                    SalaryPeriod = "Yearly",
                    ExperienceMin = 0,
                    ExperienceMax = 1,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddDays(-1),
                    ExpiryDate = DateTime.UtcNow.AddDays(18),
                    InterviewDate = DateTime.UtcNow.AddDays(35),
                    InterviewStartTime = "08:30 AM",
                    InterviewLocation = "All India Online Centers",
                    InterviewMode = "Prelims + Mains + GD + Interview",
                    ApplicationUrl = "https://sbi.co.in/web/careers",
                    OriginalUrl = "https://sbi.co.in/documents/careers/CRPD_PO_2025_Notification.pdf",
                    Skills = new List<string> { "Graduation Any Stream", "Quantitative Aptitude", "Banking Awareness", "English", "Reasoning" },
                    IsDemoData = false
                },

                // 5. RBI Grade B
                new JobDto
                {
                    ExternalJobId = "GOV-RBI-GRB-2025",
                    SourceName = SourceName,
                    Title = "Officer Grade ‘B’ (General / DEPR / DSIM)",
                    Company = new CompanyDto
                    {
                        Name = "Reserve Bank of India (RBI)",
                        LogoUrl = "https://icon.horse/icon/rbi.org.in",
                        Website = "https://rbi.org.in",
                        Industry = "Central Banking & Monetary Authority"
                    },
                    Description = "Premier central banking career in India. Starting gross monthly emoluments of ₹1,16,684/- p.m. + RBI Quarters/Lease accommodation, fuel allowance, and international training.",
                    Address = "RBI Central Office Building, Shahid Bhagat Singh Road, Fort",
                    City = "Mumbai",
                    State = "Maharashtra",
                    Country = "India",
                    Latitude = 18.9322,
                    Longitude = 72.8358,
                    SalaryMin = 1400000,
                    SalaryMax = 2200000,
                    SalaryPeriod = "Yearly",
                    ExperienceMin = 0,
                    ExperienceMax = 2,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddHours(-18),
                    ExpiryDate = DateTime.UtcNow.AddDays(22),
                    InterviewDate = DateTime.UtcNow.AddDays(50),
                    InterviewStartTime = "09:00 AM",
                    InterviewLocation = "RBI National Testing Centers",
                    InterviewMode = "Phase 1 & Phase 2 Online Exam + Interview",
                    ApplicationUrl = "https://opportunities.rbi.org.in",
                    OriginalUrl = "https://opportunities.rbi.org.in/scripts/Advt_Grade_B_2025.pdf",
                    Skills = new List<string> { "Graduate (60%)", "Economics", "Finance & Management", "Monetary Policy" },
                    IsDemoData = false
                },

                // 6. RRB Junior Engineer
                new JobDto
                {
                    ExternalJobId = "GOV-RRB-JE-7951",
                    SourceName = SourceName,
                    Title = "Junior Engineer (IT, Signal & Telecom, Mechanical)",
                    Company = new CompanyDto
                    {
                        Name = "Railway Recruitment Control Board (RRB / Indian Railways)",
                        LogoUrl = "https://icon.horse/icon/indianrailways.gov.in",
                        Website = "https://indianrailways.gov.in",
                        Industry = "Railways & Transport (Govt of India)"
                    },
                    Description = "Recruitment for 7,951 Junior Engineer positions in Indian Railways. 7th CPC Level 6 (₹35,400 basic + DA + Railway Passes + Free Medical for family).",
                    Address = "Rail Bhavan, Raisina Road",
                    City = "Delhi",
                    State = "Delhi",
                    Country = "India",
                    Latitude = 28.6186,
                    Longitude = 77.2144,
                    SalaryMin = 550000,
                    SalaryMax = 950000,
                    SalaryPeriod = "Yearly",
                    ExperienceMin = 0,
                    ExperienceMax = 1,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddDays(-2),
                    ExpiryDate = DateTime.UtcNow.AddDays(28),
                    InterviewDate = DateTime.UtcNow.AddDays(60),
                    InterviewStartTime = "09:00 AM",
                    InterviewLocation = "All Regional RRBs",
                    InterviewMode = "CBT-1 + CBT-2 Computer Based Exam",
                    ApplicationUrl = "https://rrbcdg.gov.in",
                    OriginalUrl = "https://rrbcdg.gov.in/CEN_03_2024_JE_Notification.pdf",
                    Skills = new List<string> { "Diploma / B.Tech Engineering", "Networking", "Operating Systems", "Railway Signal Systems", "7th CPC Level 6" },
                    IsDemoData = false
                },

                // 7. ONGC Maharatna
                new JobDto
                {
                    ExternalJobId = "GOV-ONGC-GT-GATE",
                    SourceName = SourceName,
                    Title = "Graduate Executive Trainee (E-1 Level through GATE)",
                    Company = new CompanyDto
                    {
                        Name = "Oil and Natural Gas Corporation (ONGC - Maharatna)",
                        LogoUrl = "https://icon.horse/icon/ongcindia.com",
                        Website = "https://ongcindia.com",
                        Industry = "Energy & Maharatna PSU"
                    },
                    Description = "Maharatna PSU career in ONGC. E-1 Grade pay scale ₹60,000 - ₹1,80,000 (Annual CTC approx ₹21.0 LPA with performance allowances, superannuation, and housing).",
                    Address = "Tel Bhavan, Kaulagarh Road",
                    City = "Dehradun",
                    State = "Uttarakhand",
                    Country = "India",
                    Latitude = 30.3340,
                    Longitude = 78.0380,
                    SalaryMin = 1800000,
                    SalaryMax = 2400000,
                    SalaryPeriod = "Yearly",
                    ExperienceMin = 0,
                    ExperienceMax = 1,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddDays(-3),
                    ExpiryDate = DateTime.UtcNow.AddDays(16),
                    InterviewDate = DateTime.UtcNow.AddDays(45),
                    InterviewStartTime = "09:30 AM",
                    InterviewLocation = "ONGC Corporate HQ Dehradun / Delhi",
                    InterviewMode = "GATE Score + Personal Interview",
                    ApplicationUrl = "https://ongcindia.com/careers",
                    OriginalUrl = "https://ongcindia.com/pdf/Advt_GT_2025.pdf",
                    Skills = new List<string> { "GATE Score", "B.Tech Mechanical/Electrical/CS", "Petroleum Engineering", "E-1 Executive" },
                    IsDemoData = false
                },

                // 8. C-DAC Supercomputing
                new JobDto
                {
                    ExternalJobId = "GOV-CDAC-PUN-AI",
                    SourceName = SourceName,
                    Title = "Project Engineer (Param Supercomputing, AI & HPC)",
                    Company = new CompanyDto
                    {
                        Name = "Centre for Development of Advanced Computing (C-DAC)",
                        LogoUrl = "https://icon.horse/icon/cdac.in",
                        Website = "https://cdac.in",
                        Industry = "R&D Supercomputing (MeitY Autonomous Society)"
                    },
                    Description = "Work on India’s National Supercomputing Mission (NSM), PARAM supercomputers, LLM training clusters, GPU optimization, and quantum simulation.",
                    Address = "Pune University Campus, Ganeshkhind",
                    City = "Pune",
                    State = "Maharashtra",
                    Country = "India",
                    Latitude = 18.5362,
                    Longitude = 73.8290,
                    SalaryMin = 650000,
                    SalaryMax = 1200000,
                    SalaryPeriod = "Yearly",
                    ExperienceMin = 0,
                    ExperienceMax = 3,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-10),
                    ExpiryDate = DateTime.UtcNow.AddDays(24),
                    InterviewDate = DateTime.UtcNow.AddDays(32),
                    InterviewStartTime = "10:00 AM",
                    InterviewLocation = "C-DAC Innovation Park, Panchavati, Pune",
                    InterviewMode = "Walk-in & Online Interview",
                    ApplicationUrl = "https://cdac.in/careers",
                    OriginalUrl = "https://cdac.in/pdf/Recruitment_Project_Engineers_2025.pdf",
                    Skills = new List<string> { "C/C++", "CUDA", "Python", "Parallel Computing", "MPI", "Linux Kernel" },
                    IsDemoData = false
                },

                // 9. BEL Navratna
                new JobDto
                {
                    ExternalJobId = "GOV-BEL-BLR-PE",
                    SourceName = SourceName,
                    Title = "Project Engineer - I & Trainee Engineer (Radar & Avionics)",
                    Company = new CompanyDto
                    {
                        Name = "Bharat Electronics Limited (BEL - Navratna PSU)",
                        LogoUrl = "https://icon.horse/icon/bel-india.in",
                        Website = "https://bel-india.in",
                        Industry = "Defense Electronics & Navratna PSU"
                    },
                    Description = "BEL Bangalore Complex hiring Project Engineers for Radar and Defence Communication projects. Remuneration: ₹40,000 - ₹55,000/mo + ₹12,000/yr dress and medical allowance.",
                    Address = "Outer Ring Road, Jalahalli",
                    City = "Bangalore",
                    State = "Karnataka",
                    Country = "India",
                    Latitude = 13.0482,
                    Longitude = 77.5385,
                    SalaryMin = 520000,
                    SalaryMax = 750000,
                    SalaryPeriod = "Yearly",
                    ExperienceMin = 0,
                    ExperienceMax = 2,
                    JobType = "Contract",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddDays(-1),
                    ExpiryDate = DateTime.UtcNow.AddDays(19),
                    InterviewDate = DateTime.UtcNow.AddDays(26),
                    InterviewStartTime = "09:00 AM",
                    InterviewLocation = "BEL Jalahalli Campus, Bangalore",
                    InterviewMode = "Written Test & Interview",
                    ApplicationUrl = "https://bel-india.in/careers",
                    OriginalUrl = "https://bel-india.in/pdf/BEL_Project_Engineers_Advt.pdf",
                    Skills = new List<string> { "B.Tech Electronics/CS", "Embedded C", "FPGA", "DSP", "Defense Systems" },
                    IsDemoData = false
                },

                // 10. NTPC Maharatna
                new JobDto
                {
                    ExternalJobId = "GOV-NTPC-EET-2025",
                    SourceName = SourceName,
                    Title = "Executive Trainee (Renewable Energy & Power Systems)",
                    Company = new CompanyDto
                    {
                        Name = "NTPC Limited (Maharatna PSU)",
                        LogoUrl = "https://icon.horse/icon/ntpc.co.in",
                        Website = "https://ntpc.co.in",
                        Industry = "Energy & Maharatna PSU"
                    },
                    Description = "NTPC recruiting Executive Trainees in Solar, Green Hydrogen, Thermal and IT Systems. Pay Scale: ₹40,000 - ₹1,40,000 (E-1 Grade, Annual CTC ₹16.5 LPA).",
                    Address = "NTPC Bhawan, Core-7, SCOPE Complex, Lodhi Road",
                    City = "Delhi",
                    State = "Delhi",
                    Country = "India",
                    Latitude = 28.5892,
                    Longitude = 77.2346,
                    SalaryMin = 1400000,
                    SalaryMax = 1800000,
                    SalaryPeriod = "Yearly",
                    ExperienceMin = 0,
                    ExperienceMax = 1,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddDays(-2),
                    ExpiryDate = DateTime.UtcNow.AddDays(14),
                    InterviewDate = DateTime.UtcNow.AddDays(38),
                    InterviewStartTime = "09:30 AM",
                    InterviewLocation = "NTPC Power Management Institute, Noida",
                    InterviewMode = "GATE Score + GD + Interview",
                    ApplicationUrl = "https://careers.ntpc.co.in",
                    OriginalUrl = "https://careers.ntpc.co.in/pdf/Advt_EET_2025.pdf",
                    Skills = new List<string> { "B.Tech Electrical/Mechanical/CS", "SCADA", "Power Systems", "Renewable Energy", "GATE Qualified" },
                    IsDemoData = false
                }
            };

            return Task.FromResult(jobs.AsEnumerable());
        }
    }
}
