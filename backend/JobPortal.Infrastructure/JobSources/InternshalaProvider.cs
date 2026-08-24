using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;

namespace JobPortal.Infrastructure.JobSources
{
    public class InternshalaProvider : IJobSourceProvider
    {
        public string SourceName => "Internshala";

        public Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchRequest request, CancellationToken cancellationToken = default)
        {
            var jobs = new List<JobDto>
            {
                new JobDto
                {
                    ExternalJobId = "intern-react-008",
                    SourceName = SourceName,
                    Title = "Frontend Development Intern (React / TypeScript)",
                    Company = new CompanyDto
                    {
                        Name = "StartupStudio Digital",
                        LogoUrl = "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop&auto=format",
                        Website = "https://example.com/startupstudio",
                        Industry = "Software Startup"
                    },
                    Description = "Great learning opportunity for freshers! Work directly with senior software architects on Next.js, React, Google Maps API, and UI design.",
                    Address = "MI Road, Near Panch Batti",
                    City = "Jaipur",
                    State = "Rajasthan",
                    Country = "India",
                    Latitude = 26.9157,
                    Longitude = 75.8110,
                    SalaryMin = 240000,
                    SalaryMax = 360000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 0,
                    ExperienceMax = 1,
                    JobType = "Internship",
                    WorkMode = "Remote",
                    PostedDate = DateTime.UtcNow.AddDays(-1),
                    ContactName = "Neha Gupta",
                    ContactPhone = "+91 94140 12345",
                    ContactEmail = "internships@startupstudio.demo",
                    InterviewDate = DateTime.UtcNow.AddDays(2),
                    InterviewStartTime = "02:00 PM",
                    InterviewEndTime = "05:00 PM",
                    InterviewLocation = "Online Video Interview (Google Meet)",
                    InterviewMode = "Online Interview",
                    ApplicationUrl = "https://internshala.com/demo-apply/react-intern-jaipur",
                    Skills = new List<string> { "React", "JavaScript", "HTML", "CSS", "TypeScript" },
                    IsDemoData = true
                }
            };

            return Task.FromResult(jobs.AsEnumerable());
        }
    }
}
