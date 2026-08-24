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
                new JobDto
                {
                    ExternalJobId = "gov-nic-009",
                    SourceName = SourceName,
                    Title = "Scientific Officer / Software Engineer (C# & DB)",
                    Company = new CompanyDto
                    {
                        Name = "National Informatics Centre (NIC)",
                        LogoUrl = "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=100&h=100&fit=crop&auto=format",
                        Website = "https://example.com/nic-gov",
                        Industry = "Government Sector"
                    },
                    Description = "Official Recruitment Notification for Scientific Officers in National Informatics Centre. Responsible for e-Governance platforms, web API security, and MySQL database administration.",
                    Address = "CGO Complex, Lodhi Road",
                    City = "Delhi",
                    State = "Delhi",
                    Country = "India",
                    Latitude = 28.5892,
                    Longitude = 77.2343,
                    SalaryMin = 800000,
                    SalaryMax = 1400000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 1,
                    ExperienceMax = 5,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddDays(-3),
                    ContactName = "NIC Recruitment Cell",
                    ContactPhone = "+91 11 2430 5000",
                    ContactEmail = "recruitment@nic-gov.demo",
                    InterviewDate = DateTime.UtcNow.AddDays(10),
                    InterviewStartTime = "09:30 AM",
                    InterviewEndTime = "04:00 PM",
                    InterviewLocation = "Hall B, CGO Complex, Lodhi Road, New Delhi",
                    InterviewMode = "Walk-in",
                    InterviewNotes = "Government gazetted officer verification required for documents.",
                    ApplicationUrl = "https://govjobs.demo/apply/nic-scientific-officer",
                    Skills = new List<string> { "C#", "SQL", "MySQL", "Web API", "Network Security" },
                    IsDemoData = true
                }
            };

            return Task.FromResult(jobs.AsEnumerable());
        }
    }
}
