using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;

namespace JobPortal.Infrastructure.JobSources
{
    public class CustomJobApiProvider : IJobSourceProvider
    {
        public string SourceName => "CustomJobApi";

        public Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchRequest request, CancellationToken cancellationToken = default)
        {
            var jobs = new List<JobDto>
            {
                new JobDto
                {
                    ExternalJobId = "custom-api-010",
                    SourceName = SourceName,
                    Title = "Senior Database Administrator (MySQL & Spatial)",
                    Company = new CompanyDto
                    {
                        Name = "DataSphere Enterprise Solutions",
                        LogoUrl = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop&auto=format",
                        Website = "https://example.com/datasphere",
                        Industry = "Database Systems"
                    },
                    Description = "Manage high-availability MySQL database clusters, write spatial index queries, optimize Entity Framework Core query executions, and maintain data replication pipelines.",
                    Address = "Salt Lake Sector V",
                    City = "Kolkata",
                    State = "West Bengal",
                    Country = "India",
                    Latitude = 22.5726,
                    Longitude = 88.4311,
                    SalaryMin = 1500000,
                    SalaryMax = 2200000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 5,
                    ExperienceMax = 9,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-8),
                    ContactName = "Subhashish Roy (DB Architect)",
                    ContactEmail = "careers@datasphere.demo",
                    ApplicationUrl = "https://customjobapi.demo/jobs/dba-kolkata",
                    Skills = new List<string> { "MySQL", "Database Administration", "Spatial Queries", "SQL", "Performance Tuning" },
                    IsDemoData = true
                },
                new JobDto
                {
                    ExternalJobId = "custom-api-011",
                    SourceName = SourceName,
                    Title = "Senior React Developer",
                    Company = new CompanyDto
                    {
                        Name = "ABC Technologies",
                        LogoUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&auto=format",
                        Website = "https://example.com/abc",
                        Industry = "Information Technology"
                    },
                    Description = "Senior React Developer position for building interactive dashboards and spatial Google Maps interfaces. (Aggregated duplicate source verification example).",
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
                    PostedDate = DateTime.UtcNow.AddHours(-1),
                    ApplicationUrl = "https://customjobapi.demo/jobs/abc-react-gurgaon",
                    Skills = new List<string> { "React", "TypeScript", "Redux", "Maps API" },
                    IsDemoData = true
                }
            };

            return Task.FromResult(jobs.AsEnumerable());
        }
    }
}
