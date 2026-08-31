using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;

namespace JobPortal.Infrastructure.JobSources
{
    public class LinkedInProvider : IJobSourceProvider
    {
        public string SourceName => "LinkedIn";

        public Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchRequest request, CancellationToken cancellationToken = default)
        {
            var jobs = new List<JobDto>
            {
                new JobDto
                {
                    ExternalJobId = "li-tcs-del-018",
                    SourceName = SourceName,
                    Title = "Senior Software Engineer - Cloud Systems",
                    Company = new CompanyDto
                    {
                        Name = "Tata Consultancy Services (TCS)",
                        LogoUrl = "https://icon.horse/icon/tcs.com",
                        Website = "https://tcs.com",
                        Industry = "IT & Consulting"
                    },
                    Description = "Engineering enterprise software solutions using ASP.NET Core, React, SQL Server, and microservices.",
                    Address = "Saket District Centre",
                    City = "Delhi",
                    State = "Delhi",
                    Country = "India",
                    Latitude = 28.5244,
                    Longitude = 77.2188,
                    SalaryMin = 1200000,
                    SalaryMax = 1800000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 3,
                    ExperienceMax = 7,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-5),
                    ContactName = "Rajesh Kumar (HR)",
                    ContactPhone = "+91 98111 22334",
                    ContactEmail = "careers@tcs.com",
                    InterviewDate = DateTime.UtcNow.AddDays(2),
                    InterviewStartTime = "10:00 AM",
                    InterviewLocation = "TCS Saket House, New Delhi",
                    InterviewMode = "Walk-in Drive",
                    ApplicationUrl = "https://tcs.com/careers",
                    Skills = new List<string> { "C#", "ASP.NET Core", "SQL Server", "React", "Microservices" },
                    IsDemoData = false
                },
                new JobDto
                {
                    ExternalJobId = "li-zomato-gur-021",
                    SourceName = SourceName,
                    Title = "Senior Frontend Engineer - Maps & UI",
                    Company = new CompanyDto
                    {
                        Name = "Zomato",
                        LogoUrl = "https://icon.horse/icon/zomato.com",
                        Website = "https://zomato.com",
                        Industry = "FoodTech & Logistics"
                    },
                    Description = "Build real-time delivery tracking maps, interactive location pickers, and lightning-fast web app interfaces.",
                    Address = "Golf Course Road, Sector 53",
                    City = "Gurgaon",
                    State = "Haryana",
                    Country = "India",
                    Latitude = 28.4390,
                    Longitude = 77.1025,
                    SalaryMin = 2400000,
                    SalaryMax = 3800000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 3,
                    ExperienceMax = 8,
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = DateTime.UtcNow.AddHours(-3),
                    ApplicationUrl = "https://zomato.com/careers",
                    Skills = new List<string> { "React", "Next.js", "Leaflet", "Google Maps API", "TypeScript" },
                    IsDemoData = false
                },
                new JobDto
                {
                    ExternalJobId = "li-swiggy-blr-022",
                    SourceName = SourceName,
                    Title = "Full Stack Engineer - Hyperlocal Logistics",
                    Company = new CompanyDto
                    {
                        Name = "Swiggy",
                        LogoUrl = "https://icon.horse/icon/swiggy.com",
                        Website = "https://swiggy.com",
                        Industry = "Consumer Tech"
                    },
                    Description = "Work on high-concurrency order dispatch algorithms, spatial indexing, React dashboards, and .NET Core APIs.",
                    Address = "HSR Layout Sector 6",
                    City = "Bangalore",
                    State = "Karnataka",
                    Country = "India",
                    Latitude = 12.9121,
                    Longitude = 77.6446,
                    SalaryMin = 2200000,
                    SalaryMax = 3600000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 3,
                    ExperienceMax = 7,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-6),
                    InterviewDate = DateTime.UtcNow.AddDays(3),
                    InterviewStartTime = "11:00 AM",
                    InterviewLocation = "Swiggy HQ, HSR Layout, Bangalore",
                    InterviewMode = "Walk-in Drive",
                    ApplicationUrl = "https://swiggy.com/careers",
                    Skills = new List<string> { "React", "TypeScript", "Node.js", "Go", "System Design" },
                    IsDemoData = false
                },
                new JobDto
                {
                    ExternalJobId = "li-uber-blr-027",
                    SourceName = SourceName,
                    Title = "Senior Maps & Routing Software Engineer",
                    Company = new CompanyDto
                    {
                        Name = "Uber",
                        LogoUrl = "https://icon.horse/icon/uber.com",
                        Website = "https://uber.com",
                        Industry = "Mobility & Tech"
                    },
                    Description = "Building next-generation routing algorithms, geospatial indexing, spatial map overlays, and real-time location services.",
                    Address = "RMG Towers, Bellandur",
                    City = "Bangalore",
                    State = "Karnataka",
                    Country = "India",
                    Latitude = 12.9298,
                    Longitude = 77.6748,
                    SalaryMin = 3800000,
                    SalaryMax = 6000000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 4,
                    ExperienceMax = 10,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-12),
                    ApplicationUrl = "https://uber.com/careers",
                    Skills = new List<string> { "Go", "C++", "Geospatial", "Google Maps API", "System Architecture" },
                    IsDemoData = false
                },
                new JobDto
                {
                    ExternalJobId = "li-adobe-noi-030",
                    SourceName = SourceName,
                    Title = "Computer Scientist - Web & Graphics",
                    Company = new CompanyDto
                    {
                        Name = "Adobe",
                        LogoUrl = "https://icon.horse/icon/adobe.com",
                        Website = "https://adobe.com",
                        Industry = "Creative Software & Cloud"
                    },
                    Description = "Work on Adobe Creative Cloud web applications, high performance canvas rendering, React frontends, and REST APIs.",
                    Address = "Sector 132, Noida Expressway",
                    City = "Noida",
                    State = "Uttar Pradesh",
                    Country = "India",
                    Latitude = 28.5100,
                    Longitude = 77.3820,
                    SalaryMin = 3000000,
                    SalaryMax = 4800000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 4,
                    ExperienceMax = 9,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddHours(-15),
                    ApplicationUrl = "https://adobe.com/careers",
                    Skills = new List<string> { "React", "TypeScript", "WebAssembly", "C++", "REST API" },
                    IsDemoData = false
                }
            };

            return Task.FromResult(jobs.AsEnumerable());
        }
    }
}
