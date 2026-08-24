using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;

namespace JobPortal.Infrastructure.JobSources
{
    public class FounditProvider : IJobSourceProvider
    {
        public string SourceName => "Foundit";

        public Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchRequest request, CancellationToken cancellationToken = default)
        {
            var jobs = new List<JobDto>
            {
                new JobDto
                {
                    ExternalJobId = "foundit-devops-007",
                    SourceName = SourceName,
                    Title = "DevOps & Cloud Infrastructure Engineer",
                    Company = new CompanyDto
                    {
                        Name = "CloudScale Tech",
                        LogoUrl = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop&auto=format",
                        Website = "https://example.com/cloudscale",
                        Industry = "Cloud Infrastructure"
                    },
                    Description = "Manage Kubernetes clusters, AWS/Azure pipelines, Docker containers, CI/CD automation, and Nginx reverse proxies.",
                    Address = "Bandra Kurla Complex (BKC)",
                    City = "Mumbai",
                    State = "Maharashtra",
                    Country = "India",
                    Latitude = 19.0657,
                    Longitude = 72.8687,
                    SalaryMin = 1600000,
                    SalaryMax = 2400000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 4,
                    ExperienceMax = 8,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-15),
                    ContactName = "Vikram Malhotra",
                    ContactEmail = "hr@cloudscale.demo",
                    ApplicationUrl = "https://foundit.com/demo-apply/devops-mumbai",
                    Skills = new List<string> { "DevOps", "Docker", "Kubernetes", "AWS", "CI/CD" },
                    IsDemoData = true
                }
            };

            return Task.FromResult(jobs.AsEnumerable());
        }
    }
}
