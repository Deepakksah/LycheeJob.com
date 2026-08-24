using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;

namespace JobPortal.Infrastructure.JobSources
{
    public class NaukriProvider : IJobSourceProvider
    {
        public string SourceName => "Naukri";

        public Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchRequest request, CancellationToken cancellationToken = default)
        {
            var jobs = new List<JobDto>
            {
                new JobDto
                {
                    ExternalJobId = "naukri-frontend-005",
                    SourceName = SourceName,
                    Title = "Frontend Developer (React / Next.js)",
                    Company = new CompanyDto
                    {
                        Name = "WebCraft Interactive",
                        LogoUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop&auto=format",
                        Website = "https://example.com/webcraft",
                        Industry = "Software & IT"
                    },
                    Description = "Build sleek UI/UX components using React, Next.js, and modern CSS systems. Responsible for responsive layouts and map integrations.",
                    Address = "HITEC City Phase 2",
                    City = "Hyderabad",
                    State = "Telangana",
                    Country = "India",
                    Latitude = 17.4435,
                    Longitude = 78.3772,
                    SalaryMin = 900000,
                    SalaryMax = 1400000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 2,
                    ExperienceMax = 4,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-18),
                    ContactName = "Suresh Reddy",
                    ContactPhone = "+91 91234 56789",
                    ContactEmail = "jobs@webcraft.demo",
                    ApplicationUrl = "https://naukri.com/demo-apply/frontend-hyd",
                    Skills = new List<string> { "React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5" },
                    IsDemoData = true
                },
                new JobDto
                {
                    ExternalJobId = "naukri-qa-006",
                    SourceName = SourceName,
                    Title = "QA Automation Lead",
                    Company = new CompanyDto
                    {
                        Name = "QualityFirst Labs",
                        LogoUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&auto=format",
                        Website = "https://example.com/qafirst",
                        Industry = "Testing & QA"
                    },
                    Description = "Lead automated testing initiatives for web & mobile applications. Experience with Selenium, Playwright, C#, and REST API testing required.",
                    Address = "Viman Nagar",
                    City = "Pune",
                    State = "Maharashtra",
                    Country = "India",
                    Latitude = 18.5679,
                    Longitude = 73.9143,
                    SalaryMin = 1300000,
                    SalaryMax = 1900000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 5,
                    ExperienceMax = 8,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddDays(-2),
                    ApplicationUrl = "https://naukri.com/demo-apply/qa-lead-pune",
                    Skills = new List<string> { "QA Automation", "Selenium", "C#", "Playwright", "REST API" },
                    IsDemoData = true
                }
            };

            return Task.FromResult(jobs.AsEnumerable());
        }
    }
}
