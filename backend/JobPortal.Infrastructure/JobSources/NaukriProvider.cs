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
                    ExternalJobId = "nk-google-gur-01",
                    SourceName = SourceName,
                    Title = "Software Engineer III - Google Cloud & Maps",
                    Company = new CompanyDto
                    {
                        Name = "Google India",
                        LogoUrl = "https://icon.horse/icon/google.com",
                        Website = "https://google.com",
                        Industry = "Internet & Cloud Services"
                    },
                    Description = "Work on Google Maps spatial routing engine, high-concurrency APIs, location-based services, and modern interactive web rendering.",
                    Address = "Signature Tower, Sector 30",
                    City = "Gurgaon",
                    State = "Haryana",
                    Country = "India",
                    Latitude = 28.4680,
                    Longitude = 77.0535,
                    SalaryMin = 3600000,
                    SalaryMax = 5800000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 4,
                    ExperienceMax = 9,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-6),
                    ApplicationUrl = "https://careers.google.com",
                    Skills = new List<string> { "Go", "C++", "Python", "Google Maps API", "Distributed Systems" },
                    IsDemoData = false
                },
                new JobDto
                {
                    ExternalJobId = "nk-phonepe-blr-02",
                    SourceName = SourceName,
                    Title = "Backend Architect (FinTech Microservices)",
                    Company = new CompanyDto
                    {
                        Name = "PhonePe",
                        LogoUrl = "https://icon.horse/icon/phonepe.com",
                        Website = "https://phonepe.com",
                        Industry = "FinTech & Payments"
                    },
                    Description = "Architect ultra-low latency payment switch processing millions of transactions per second. Experience in C#, Java, distributed databases, and high availability systems required.",
                    Address = "Bellandur Outer Ring Road",
                    City = "Bangalore",
                    State = "Karnataka",
                    Country = "India",
                    Latitude = 12.9298,
                    Longitude = 77.6748,
                    SalaryMin = 3000000,
                    SalaryMax = 4800000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 5,
                    ExperienceMax = 10,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddHours(-14),
                    InterviewDate = DateTime.UtcNow.AddDays(3),
                    InterviewStartTime = "10:30 AM",
                    InterviewLocation = "PhonePe Office, Bellandur, Bangalore",
                    InterviewMode = "Walk-in Interview Drive",
                    ApplicationUrl = "https://phonepe.com/careers",
                    Skills = new List<string> { "C#", "Java", "Kafka", "Redis", "Microservices" },
                    IsDemoData = false
                }
            };

            return Task.FromResult(jobs.AsEnumerable());
        }
    }
}
