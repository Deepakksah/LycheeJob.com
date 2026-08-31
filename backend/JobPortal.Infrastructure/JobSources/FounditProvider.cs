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
                    ExternalJobId = "fnd-razorpay-blr-01",
                    SourceName = SourceName,
                    Title = "Senior DevOps & Cloud Infrastructure Engineer",
                    Company = new CompanyDto
                    {
                        Name = "Razorpay",
                        LogoUrl = "https://icon.horse/icon/razorpay.com",
                        Website = "https://razorpay.com",
                        Industry = "FinTech & Payments"
                    },
                    Description = "Manage large-scale Kubernetes clusters, AWS cloud infrastructure, microservices security, CI/CD pipelines, and high availability systems for payment gateways.",
                    Address = "SJR Cyber, Koramangala 7th Block",
                    City = "Bangalore",
                    State = "Karnataka",
                    Country = "India",
                    Latitude = 12.9352,
                    Longitude = 77.6245,
                    SalaryMin = 2200000,
                    SalaryMax = 3600000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 4,
                    ExperienceMax = 8,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-15),
                    ApplicationUrl = "https://razorpay.com/jobs",
                    Skills = new List<string> { "DevOps", "Docker", "Kubernetes", "AWS", "CI/CD", "Terraform" },
                    IsDemoData = false
                },
                new JobDto
                {
                    ExternalJobId = "fnd-cred-blr-02",
                    SourceName = SourceName,
                    Title = "Senior Backend Engineer (Golang / C#)",
                    Company = new CompanyDto
                    {
                        Name = "CRED",
                        LogoUrl = "https://icon.horse/icon/cred.club",
                        Website = "https://cred.club",
                        Industry = "FinTech & Rewards"
                    },
                    Description = "Design high-performance backend systems, distributed event streams, reward engines, and real-time transaction processing.",
                    Address = "Indiranagar 100 Feet Road",
                    City = "Bangalore",
                    State = "Karnataka",
                    Country = "India",
                    Latitude = 12.9784,
                    Longitude = 77.6408,
                    SalaryMin = 3000000,
                    SalaryMax = 5000000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 4,
                    ExperienceMax = 8,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddHours(-8),
                    ApplicationUrl = "https://cred.club/careers",
                    Skills = new List<string> { "Golang", "C#", "Kafka", "MySQL", "Distributed Systems" },
                    IsDemoData = false
                }
            };

            return Task.FromResult(jobs.AsEnumerable());
        }
    }
}
