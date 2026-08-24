using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;

namespace JobPortal.Infrastructure.JobSources
{
    public class IndeedProvider : IJobSourceProvider
    {
        public string SourceName => "Indeed";

        public Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchRequest request, CancellationToken cancellationToken = default)
        {
            var jobs = new List<JobDto>
            {
                new JobDto
                {
                    ExternalJobId = "ind-react-001",
                    SourceName = SourceName,
                    Title = "Senior React Developer",
                    Company = new CompanyDto
                    {
                        Name = "ABC Technologies",
                        LogoUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&auto=format",
                        Website = "https://example.com/abc",
                        Industry = "Information Technology"
                    },
                    Description = "Looking for an experienced Senior React Developer to join our frontend architecture team. Must be skilled in React, TypeScript, Redux Toolkit, and performance optimization.",
                    Address = "Cyber City, DLF Phase 2",
                    City = "Gurgaon",
                    State = "Haryana",
                    Country = "India",
                    Latitude = 28.4950,
                    Longitude = 77.0895,
                    SalaryMin = 1200000,
                    SalaryMax = 1800000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 4,
                    ExperienceMax = 7,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-3),
                    ContactName = "Rohit Verma (HR)",
                    ContactPhone = "+91 98765 43210",
                    ContactEmail = "careers@abctechnologies.demo",
                    InterviewDate = DateTime.UtcNow.AddDays(3),
                    InterviewStartTime = "10:00 AM",
                    InterviewEndTime = "02:00 PM",
                    InterviewLocation = "Building 10B, Cyber City, Gurgaon",
                    InterviewMode = "Walk-in",
                    InterviewNotes = "Bring 2 copies of resume and official ID proof.",
                    ApplicationUrl = "https://indeed.com/demo-apply/react-dev-gurgaon",
                    Skills = new List<string> { "React", "TypeScript", "Redux", "Tailwind CSS", "REST API" },
                    IsDemoData = true
                },
                new JobDto
                {
                    ExternalJobId = "ind-csharp-002",
                    SourceName = SourceName,
                    Title = "ASP.NET Core / C# Tech Lead",
                    Company = new CompanyDto
                    {
                        Name = "Microsoft Partner Solutions",
                        LogoUrl = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop&auto=format",
                        Website = "https://example.com/ms-solutions",
                        Industry = "Software Solutions"
                    },
                    Description = "Seeking a C# / ASP.NET Core Tech Lead to build high throughput REST APIs, microservices, Entity Framework Core query optimization, and MySQL/SQL Server spatial capabilities.",
                    Address = "Sector 62, Electronic City",
                    City = "Noida",
                    State = "Uttar Pradesh",
                    Country = "India",
                    Latitude = 28.6280,
                    Longitude = 77.3649,
                    SalaryMin = 1800000,
                    SalaryMax = 2600000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 6,
                    ExperienceMax = 10,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddHours(-12),
                    ContactName = "Pooja Sharma (Talent Acquisition)",
                    ContactEmail = "tech-jobs@partner-solutions.demo",
                    ApplicationUrl = "https://indeed.com/demo-apply/csharp-lead-noida",
                    Skills = new List<string> { "C#", "ASP.NET Core", "EF Core", "MySQL", "Docker", "Microservices" },
                    IsDemoData = true
                }
            };

            return Task.FromResult(jobs.AsEnumerable());
        }
    }
}
