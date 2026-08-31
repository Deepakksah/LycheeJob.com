using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobPortal.Core.Entities;
using JobPortal.Infrastructure.Data;

namespace JobPortal.Api.Controllers
{
    [ApiController]
    [Route("api/govt-jobs")]
    public class GovtJobsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GovtJobsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all government & Sarkari jobs from dedicated GovtJobs database table.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetGovtJobs(
            [FromQuery] string? category,
            [FromQuery] string? keyword,
            [FromQuery] string? state,
            [FromQuery] string? city,
            CancellationToken cancellationToken)
        {
            await EnsureSeededAsync(cancellationToken);

            var query = _context.GovtJobs.AsNoTracking().Where(g => g.IsActive);

            if (!string.IsNullOrWhiteSpace(category) && !category.Equals("all", StringComparison.OrdinalIgnoreCase))
            {
                string cat = category.ToLower();
                query = query.Where(g => g.SectorCategory.ToLower().Contains(cat) || g.Department.ToLower().Contains(cat));
            }

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                string kw = keyword.ToLower().Trim();
                query = query.Where(g => 
                    g.Title.ToLower().Contains(kw) || 
                    g.Department.ToLower().Contains(kw) || 
                    g.Ministry.ToLower().Contains(kw) ||
                    g.City.ToLower().Contains(kw) ||
                    g.Qualifications.ToLower().Contains(kw));
            }

            if (!string.IsNullOrWhiteSpace(state))
            {
                string st = state.ToLower().Trim();
                query = query.Where(g => g.State.ToLower().Contains(st));
            }

            if (!string.IsNullOrWhiteSpace(city))
            {
                string c = city.ToLower().Trim();
                query = query.Where(g => g.City.ToLower().Contains(c));
            }

            var jobs = await query.OrderByDescending(g => g.PostedDate).ToListAsync(cancellationToken);

            return Ok(new
            {
                success = true,
                total = jobs.Count,
                data = jobs
            });
        }

        /// <summary>
        /// Get government job by ID.
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var job = await _context.GovtJobs.FindAsync(new object[] { id }, cancellationToken);
            if (job == null)
            {
                return NotFound(new { success = false, message = "Government job not found" });
            }
            return Ok(new { success = true, data = job });
        }

        /// <summary>
        /// Get Govt vs Private table statistics.
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats(CancellationToken cancellationToken)
        {
            int govtCount = await _context.GovtJobs.CountAsync(cancellationToken);
            int privateCount = await _context.Jobs.CountAsync(cancellationToken);

            return Ok(new
            {
                success = true,
                totalGovtJobs = govtCount,
                totalPrivateJobs = privateCount,
                totalAllJobs = govtCount + privateCount
            });
        }

        private async Task EnsureSeededAsync(CancellationToken cancellationToken)
        {
            if (await _context.GovtJobs.AnyAsync(cancellationToken)) return;

            var list = new List<GovtJob>
            {
                new GovtJob
                {
                    ExternalJobId = "GOV-ISRO-SC-2025",
                    Title = "Scientist / Engineer ‘SC’ (Computer Science & AI/ML)",
                    Department = "Indian Space Research Organisation (ISRO)",
                    Ministry = "Department of Space, Govt of India",
                    SectorCategory = "Defense",
                    Description = "Recruitment of Scientist/Engineer ‘SC’ in Level 10 of Pay Matrix (7th CPC: ₹56,100 - ₹1,77,500). Work on satellite telemetry, mission control systems, remote sensing data processing, and launch vehicle onboard guidance computers.",
                    Address = "ISRO HQ, Antariksh Bhavan, New BEL Road",
                    City = "Bangalore",
                    State = "Karnataka",
                    Country = "India",
                    Latitude = 13.0334,
                    Longitude = 77.5640,
                    SalaryMin = 850000,
                    SalaryMax = 1650000,
                    PayLevel = "Level 10 (₹56,100 - ₹1,77,500)",
                    Vacancies = "140 Posts",
                    Qualifications = "B.Tech CSE/IT, First Class (65% or CGPA 6.84)",
                    AgeLimit = "18 - 30 Years",
                    SelectionMode = "Written Exam + In-Depth Technical Interview",
                    ApplicationUrl = "https://isro.gov.in/careers",
                    NotificationPdfUrl = "https://www.isro.gov.in/media_isro/pdf/recruitment/Advt_Scientist_SC_2025.pdf",
                    LogoUrl = "https://icon.horse/icon/isro.gov.in",
                    SkillsJson = "B.Tech CSE, C++, Python, RTOS, GATE Qualified",
                    PostedDate = DateTime.UtcNow.AddDays(-1),
                    LastDateToApply = DateTime.UtcNow.AddDays(25),
                    IsActive = true
                },
                new GovtJob
                {
                    ExternalJobId = "GOV-DRDO-RAC-147",
                    Title = "Scientist ‘B’ Recruitment (RAC Advt. 147)",
                    Department = "Defence Research & Development Organisation (DRDO)",
                    Ministry = "Ministry of Defence",
                    SectorCategory = "Defense",
                    Description = "Ministry of Defence inviting applications for Scientist ‘B’ through GATE score. Pay Level 10 (₹56,100 basic + DA + HRA + Special allowances). Work on radar signal processing, cyber warfare systems, and autonomous defense robotics.",
                    Address = "DRDO Bhawan, Rajaji Marg, Central Secretariat",
                    City = "Delhi",
                    State = "Delhi NCR",
                    Country = "India",
                    Latitude = 28.6143,
                    Longitude = 77.2088,
                    SalaryMin = 900000,
                    SalaryMax = 1700000,
                    PayLevel = "Level 10 (₹56,100 - ₹1,77,500)",
                    Vacancies = "220 Posts",
                    Qualifications = "B.Tech/BE in Electronics / CS / Mechanical with Valid GATE Score",
                    AgeLimit = "21 - 28 Years",
                    SelectionMode = "GATE Score + Personal Interview",
                    ApplicationUrl = "https://rac.gov.in",
                    NotificationPdfUrl = "https://rac.gov.in/download/advt_147_scientist_b.pdf",
                    LogoUrl = "https://icon.horse/icon/drdo.gov.in",
                    SkillsJson = "GATE 2024/2025, Radar Signal, Cyber Defence, C/C++",
                    PostedDate = DateTime.UtcNow.AddDays(-2),
                    LastDateToApply = DateTime.UtcNow.AddDays(20),
                    IsActive = true
                },
                new GovtJob
                {
                    ExternalJobId = "GOV-DSSSB-5499",
                    Title = "Delhi Subordinate Services Selection Board (DSSSB - 5,499 Vacancies)",
                    Department = "Delhi Subordinate Services Selection Board (DSSSB / GNCTD)",
                    Ministry = "Government of NCT of Delhi",
                    SectorCategory = "DelhiGovt",
                    Description = "Government of NCT of Delhi mega recruitment for 5,499 positions: TGT/PGT Teachers, Special Educators, Junior Judicial Assistants, Lower Division Clerks (LDC), Nursing Officers, Pharmacists, and MCD staff across Delhi.",
                    Address = "FC-18, Institutional Area, Karkardooma",
                    City = "Delhi",
                    State = "Delhi NCR",
                    Country = "India",
                    Latitude = 28.6517,
                    Longitude = 77.3023,
                    SalaryMin = 400000,
                    SalaryMax = 1450000,
                    PayLevel = "Level 2 to Level 8",
                    Vacancies = "5,499 Posts",
                    Qualifications = "10th / 12th / Graduation / B.Ed / D.El.Ed / GNM",
                    AgeLimit = "18 - 32 Years",
                    SelectionMode = "Tier-1 + Tier-2 Online CBT Examination",
                    ApplicationUrl = "https://dsssbonline.nic.in",
                    NotificationPdfUrl = "https://dsssb.delhi.gov.in/sites/default/files/DSSSB/circulars-orders/Advt_Combined_Exam_2025.pdf",
                    LogoUrl = "https://icon.horse/icon/dsssb.delhi.gov.in",
                    SkillsJson = "Teaching, Clerical, Nursing, Delhi Govt Benefits",
                    PostedDate = DateTime.UtcNow.AddDays(-3),
                    LastDateToApply = DateTime.UtcNow.AddDays(25),
                    IsActive = true
                },
                new GovtJob
                {
                    ExternalJobId = "GOV-DTL-65",
                    Title = "Assistant Manager Trainee (Electrical, IT, Civil, Electronics - 65 Posts)",
                    Department = "Delhi Transco Limited (DTL - Delhi Govt Power PSU)",
                    Ministry = "Department of Power, GNCTD",
                    SectorCategory = "DelhiGovt",
                    Description = "Delhi Transco Limited hiring 65 Assistant Manager Trainees through GATE score. Pay scale ₹56,100 - ₹1,77,500 (Level 10 Pay Matrix + DA + HRA + Medical + Delhi Govt Pension/Superannuation).",
                    Address = "Shakti Sadan, Kotla Road",
                    City = "Delhi",
                    State = "Delhi NCR",
                    Country = "India",
                    Latitude = 28.6328,
                    Longitude = 77.2405,
                    SalaryMin = 850000,
                    SalaryMax = 1550000,
                    PayLevel = "Level 10 (₹56,100 - ₹1,77,500)",
                    Vacancies = "65 Posts",
                    Qualifications = "B.Tech Electrical / IT / Civil / ECE with GATE Score",
                    AgeLimit = "20 - 30 Years",
                    SelectionMode = "GATE Score + Personal Interview",
                    ApplicationUrl = "https://dtl.gov.in/career",
                    NotificationPdfUrl = "https://dtl.gov.in/writereaddata/career/Advt_AM_Trainee_2025.pdf",
                    LogoUrl = "https://icon.horse/icon/dtl.gov.in",
                    SkillsJson = "Electrical Grid, SCADA, Power Transmission, Level 10",
                    PostedDate = DateTime.UtcNow.AddDays(-2),
                    LastDateToApply = DateTime.UtcNow.AddDays(21),
                    IsActive = true
                },
                new GovtJob
                {
                    ExternalJobId = "GOV-SBI-PO-2000",
                    Title = "Probationary Officer (SBI PO) & Specialist IT Officer",
                    Department = "State Bank of India (SBI)",
                    Ministry = "Department of Financial Services, Ministry of Finance",
                    SectorCategory = "Banking",
                    Description = "SBI recruiting 2,000+ Probationary Officers. Basic pay ₹41,960 with 4 advance increments (Total initial gross approx ₹82,000/mo + Lease accommodation + Medical benefits).",
                    Address = "State Bank Bhavan, Madame Cama Road, Nariman Point",
                    City = "Mumbai",
                    State = "Maharashtra",
                    Country = "India",
                    Latitude = 18.9272,
                    Longitude = 72.8228,
                    SalaryMin = 980000,
                    SalaryMax = 1450000,
                    PayLevel = "Junior Management Grade Scale I (JMGS-I)",
                    Vacancies = "2,000 Posts",
                    Qualifications = "Graduation in Any Discipline from a Recognised University",
                    AgeLimit = "21 - 30 Years",
                    SelectionMode = "Prelims + Mains + Group Discussion + Interview",
                    ApplicationUrl = "https://sbi.co.in/web/careers",
                    NotificationPdfUrl = "https://sbi.co.in/documents/careers/CRPD_PO_2025_Notification.pdf",
                    LogoUrl = "https://icon.horse/icon/sbi.co.in",
                    SkillsJson = "Banking, Quantitative Aptitude, Reasoning, English, General Awareness",
                    PostedDate = DateTime.UtcNow.AddDays(-1),
                    LastDateToApply = DateTime.UtcNow.AddDays(18),
                    IsActive = true
                },
                new GovtJob
                {
                    ExternalJobId = "GOV-RRB-NTPC-11558",
                    Title = "Non-Technical Popular Categories (RRB NTPC - 11,558 Posts)",
                    Department = "Railway Recruitment Control Board (RRB / Indian Railways)",
                    Ministry = "Ministry of Railways",
                    SectorCategory = "Railways",
                    Description = "Indian Railways mega recruitment for 11,558 positions: Station Master, Goods Train Manager, Chief Commercial cum Ticket Supervisor, Junior Accounts Assistant, and Senior Clerk cum Typist across 21 RRB zones.",
                    Address = "Rail Bhavan, Raisina Road",
                    City = "Delhi",
                    State = "Delhi NCR",
                    Country = "India",
                    Latitude = 28.6186,
                    Longitude = 77.2144,
                    SalaryMin = 400000,
                    SalaryMax = 900000,
                    PayLevel = "Level 2 to Level 6",
                    Vacancies = "11,558 Posts",
                    Qualifications = "Graduate / 12th Pass in Any Stream",
                    AgeLimit = "18 - 33 Years",
                    SelectionMode = "CBT-1 + CBT-2 + CBAT / Typing Skill Test",
                    ApplicationUrl = "https://rrbcdg.gov.in",
                    NotificationPdfUrl = "https://www.rrbcdg.gov.in/CEN_05_2024_NTPC_Notice.pdf",
                    LogoUrl = "https://icon.horse/icon/indianrailways.gov.in",
                    SkillsJson = "Railway Pass, Station Master, Ticket Examiner, Level 6",
                    PostedDate = DateTime.UtcNow.AddDays(-2),
                    LastDateToApply = DateTime.UtcNow.AddDays(30),
                    IsActive = true
                },
                new GovtJob
                {
                    ExternalJobId = "GOV-ONGC-GT-2025",
                    Title = "Graduate Executive Trainee (E-1 Level through GATE)",
                    Department = "Oil and Natural Gas Corporation (ONGC - Maharatna)",
                    Ministry = "Ministry of Petroleum and Natural Gas",
                    SectorCategory = "PSU",
                    Description = "Maharatna PSU career in ONGC. E-1 Grade pay scale ₹60,000 - ₹1,80,000 (Annual CTC approx ₹21.0 LPA with performance allowances, superannuation, and housing).",
                    Address = "Tel Bhavan, Kaulagarh Road",
                    City = "Dehradun",
                    State = "Uttarakhand",
                    Country = "India",
                    Latitude = 30.3340,
                    Longitude = 78.0380,
                    SalaryMin = 1800000,
                    SalaryMax = 2400000,
                    PayLevel = "E-1 Grade (₹60,000 - ₹1,80,000)",
                    Vacancies = "350 Posts",
                    Qualifications = "B.Tech Mechanical / Electrical / CS / Petroleum Engineering with GATE",
                    AgeLimit = "21 - 28 Years",
                    SelectionMode = "GATE Score + Personal Interview",
                    ApplicationUrl = "https://ongcindia.com/careers",
                    NotificationPdfUrl = "https://ongcindia.com/pdf/Advt_GT_2025.pdf",
                    LogoUrl = "https://icon.horse/icon/ongcindia.com",
                    SkillsJson = "Petroleum, GATE Qualified, E-1 Executive, Maharatna",
                    PostedDate = DateTime.UtcNow.AddDays(-3),
                    LastDateToApply = DateTime.UtcNow.AddDays(16),
                    IsActive = true
                },
                new GovtJob
                {
                    ExternalJobId = "GOV-SSC-CGL-17727",
                    Title = "Combined Graduate Level Examination (SSC CGL - 17,727 Posts)",
                    Department = "Staff Selection Commission (SSC / DoPT)",
                    Ministry = "Ministry of Personnel, Public Grievances and Pensions",
                    SectorCategory = "Civil",
                    Description = "Direct recruitment for 17,727 Group B & Group C posts including Assistant Section Officer (CSS/MEA), Income Tax Inspector, Central Excise Inspector, Assistant Audit Officer (CAG), and Sub-Inspector (CBI). Level 4 to Level 8 Pay Matrix.",
                    Address = "CGO Complex, Lodhi Road",
                    City = "Delhi",
                    State = "Delhi NCR",
                    Country = "India",
                    Latitude = 28.5892,
                    Longitude = 77.2346,
                    SalaryMin = 450000,
                    SalaryMax = 1450000,
                    PayLevel = "Level 4 to Level 8",
                    Vacancies = "17,727 Posts",
                    Qualifications = "Bachelor Degree in Any Discipline from a Recognised University",
                    AgeLimit = "18 - 32 Years",
                    SelectionMode = "Tier-1 + Tier-2 Online CBT Examination",
                    ApplicationUrl = "https://ssc.gov.in",
                    NotificationPdfUrl = "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoard/Notice_CGL_2024.pdf",
                    LogoUrl = "https://icon.horse/icon/ssc.gov.in",
                    SkillsJson = "Income Tax Inspector, ASO, Excise Inspector, Central Govt",
                    PostedDate = DateTime.UtcNow.AddDays(-2),
                    LastDateToApply = DateTime.UtcNow.AddDays(25),
                    IsActive = true
                },
                new GovtJob
                {
                    ExternalJobId = "GOV-BPSC-TRE-87000",
                    Title = "School Teacher Recruitment Examination (BPSC TRE 4.0 - 87,000+ Posts)",
                    Department = "Bihar Public Service Commission (BPSC)",
                    Ministry = "Education Department, Govt of Bihar",
                    SectorCategory = "Teaching",
                    Description = "Government of Bihar mega recruitment for 87,000+ Primary (Class 1-5), Middle (Class 6-8), Secondary (Class 9-10), and Higher Secondary (Class 11-12) School Teachers. State Govt Pay Scale + DA + HRA.",
                    Address = "15, Jawaharlal Nehru Marg, Bailey Road",
                    City = "Patna",
                    State = "Bihar",
                    Country = "India",
                    Latitude = 25.6120,
                    Longitude = 85.1240,
                    SalaryMin = 450000,
                    SalaryMax = 850000,
                    PayLevel = "State Teacher Pay Scale (₹25,000 - ₹35,000 Basic + DA + HRA)",
                    Vacancies = "87,000+ Posts",
                    Qualifications = "Graduation / Post-Graduation with B.Ed / D.El.Ed & CTET / STET",
                    AgeLimit = "18 - 37 Years (Relaxations Applicable)",
                    SelectionMode = "Written Competitive Examination (MCQ)",
                    ApplicationUrl = "https://onlinebpsc.bihar.gov.in",
                    NotificationPdfUrl = "https://bpsc.bih.nic.in/Advt/NB-2024-TRE-04.pdf",
                    LogoUrl = "https://icon.horse/icon/bpsc.bih.nic.in",
                    SkillsJson = "B.Ed, CTET, STET, Teaching, Bihar State Govt",
                    PostedDate = DateTime.UtcNow.AddDays(-2),
                    LastDateToApply = DateTime.UtcNow.AddDays(25),
                    IsActive = true
                },
                new GovtJob
                {
                    ExternalJobId = "GOV-AIIMS-NORCET-5000",
                    Title = "Nursing Officer Recruitment Common Eligibility Test (AIIMS NORCET - 5,000+ Posts)",
                    Department = "All India Institute of Medical Sciences (AIIMS New Delhi)",
                    Ministry = "Ministry of Health and Family Welfare",
                    SectorCategory = "Medical",
                    Description = "Recruitment for 5,000+ Nursing Officers (Group B) across AIIMS New Delhi, Bhopal, Bhubaneswar, Jodhpur, Patna, Raipur, Rishikesh, and other Central Govt Hospitals. Level 7 Pay Matrix (₹44,900 - ₹1,42,400 + Allowances).",
                    Address = "Ansari Nagar East, Gautam Nagar",
                    City = "Delhi",
                    State = "Delhi NCR",
                    Country = "India",
                    Latitude = 28.5672,
                    Longitude = 77.2100,
                    SalaryMin = 650000,
                    SalaryMax = 1250000,
                    PayLevel = "Level 7 (₹44,900 - ₹1,42,400)",
                    Vacancies = "5,000+ Posts",
                    Qualifications = "B.Sc (Hons.) Nursing / B.Sc Nursing / GNM with 2 Years Experience",
                    AgeLimit = "18 - 30 Years",
                    SelectionMode = "Stage-1 Prelims + Stage-2 Mains Online CBT",
                    ApplicationUrl = "https://aiimsexams.ac.in",
                    NotificationPdfUrl = "https://aiimsexams.ac.in/pdf/Notice_NORCET_07_2024.pdf",
                    LogoUrl = "https://icon.horse/icon/aiims.edu",
                    SkillsJson = "Nursing, AIIMS, Healthcare, Level 7 Matrix",
                    PostedDate = DateTime.UtcNow.AddDays(-1),
                    LastDateToApply = DateTime.UtcNow.AddDays(20),
                    IsActive = true
                }
            };

            await _context.GovtJobs.AddRangeAsync(list, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
