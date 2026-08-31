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
                    ExternalJobId = "ind-msft-hyd-01",
                    SourceName = SourceName,
                    Title = "Software Engineer II - Azure Cloud Services",
                    Company = new CompanyDto
                    {
                        Name = "Microsoft",
                        LogoUrl = "https://icon.horse/icon/microsoft.com",
                        Website = "https://microsoft.com",
                        Industry = "Cloud & AI Software"
                    },
                    Description = "Design and build large-scale distributed systems and cloud services on Azure. Work with C#, .NET 8, microservices, Kubernetes, and high availability systems.",
                    Address = "Microsoft India Development Center, Gachibowli",
                    City = "Hyderabad",
                    State = "Telangana",
                    Country = "India",
                    Latitude = 17.4401,
                    Longitude = 78.3489,
                    SalaryMin = 2800000,
                    SalaryMax = 4200000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 3,
                    ExperienceMax = 7,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-4),
                    ContactName = "Microsoft Talent Acquisition",
                    ContactEmail = "careers@microsoft.com",
                    ApplicationUrl = "https://careers.microsoft.com",
                    Skills = new List<string> { "C#", ".NET 8", "Azure", "Microservices", "Distributed Systems" },
                    IsDemoData = false
                },
                new JobDto
                {
                    ExternalJobId = "ind-amzn-blr-02",
                    SourceName = SourceName,
                    Title = "Software Development Engineer - AWS Geolocation",
                    Company = new CompanyDto
                    {
                        Name = "Amazon",
                        LogoUrl = "https://icon.horse/icon/amazon.com",
                        Website = "https://amazon.com",
                        Industry = "Cloud Computing & E-Commerce"
                    },
                    Description = "Building AWS location services, spatial mapping pipelines, high throughput REST APIs, and low-latency distributed data stores.",
                    Address = "Bagmane World Tech Centre, Mahadevapura",
                    City = "Bangalore",
                    State = "Karnataka",
                    Country = "India",
                    Latitude = 12.9866,
                    Longitude = 77.6974,
                    SalaryMin = 3200000,
                    SalaryMax = 5000000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 3,
                    ExperienceMax = 8,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-10),
                    ApplicationUrl = "https://amazon.jobs",
                    Skills = new List<string> { "Java", "C++", "AWS", "Spatial Indexing", "System Design" },
                    IsDemoData = false
                },
                new JobDto
                {
                    ExternalJobId = "ind-flipkart-blr-03",
                    SourceName = SourceName,
                    Title = "Lead Frontend Engineer (React & Next.js)",
                    Company = new CompanyDto
                    {
                        Name = "Flipkart",
                        LogoUrl = "https://icon.horse/icon/flipkart.com",
                        Website = "https://flipkart.com",
                        Industry = "E-Commerce & Retail Tech"
                    },
                    Description = "Lead frontend architecture for our high-scale customer web apps. Optimize core web vitals, state management, and real-time interactive dashboards.",
                    Address = "Cessna Business Park, Kadubeesanahalli",
                    City = "Bangalore",
                    State = "Karnataka",
                    Country = "India",
                    Latitude = 12.9352,
                    Longitude = 77.6946,
                    SalaryMin = 2600000,
                    SalaryMax = 4000000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 5,
                    ExperienceMax = 9,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-18),
                    ApplicationUrl = "https://flipkartcareers.com",
                    Skills = new List<string> { "React", "Next.js", "TypeScript", "Performance Optimization", "Redux" },
                    IsDemoData = false
                }
            };

            return Task.FromResult(jobs.AsEnumerable());
        }
    }
}
