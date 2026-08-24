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
                    ExternalJobId = "li-fullstack-003",
                    SourceName = SourceName,
                    Title = "Full Stack Engineer (React + C#)",
                    Company = new CompanyDto
                    {
                        Name = "InnoTech Innovations",
                        LogoUrl = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&auto=format",
                        Website = "https://example.com/innotech",
                        Industry = "FinTech"
                    },
                    Description = "We are seeking a Full Stack Engineer proficient in Next.js/React frontend and ASP.NET Core Web API backend. Experience with cloud deployments, Docker, and MySQL is preferred.",
                    Address = "Connaught Place, Inner Circle",
                    City = "Delhi",
                    State = "Delhi",
                    Country = "India",
                    Latitude = 28.6315,
                    Longitude = 77.2167,
                    SalaryMin = 1400000,
                    SalaryMax = 2200000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 3,
                    ExperienceMax = 6,
                    JobType = "FullTime",
                    WorkMode = "Hybrid",
                    PostedDate = DateTime.UtcNow.AddDays(-1),
                    ContactName = "Amit Kapoor (Recruiter)",
                    ContactPhone = "+91 99887 76655",
                    ContactEmail = "careers@innotech.demo",
                    InterviewDate = DateTime.UtcNow.AddDays(4),
                    InterviewStartTime = "11:00 AM",
                    InterviewEndTime = "03:00 PM",
                    InterviewLocation = "Regus Plaza, Connaught Place, New Delhi",
                    InterviewMode = "Walk-in",
                    ApplicationUrl = "https://linkedin.com/demo-apply/fullstack-delhi",
                    Skills = new List<string> { "React", "Next.js", "C#", "ASP.NET Core", "MySQL", "Tailwind CSS" },
                    IsDemoData = true
                },
                new JobDto
                {
                    ExternalJobId = "li-data-004",
                    SourceName = SourceName,
                    Title = "Data Analyst & Business Intelligence",
                    Company = new CompanyDto
                    {
                        Name = "Analytics Global",
                        LogoUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop&auto=format",
                        Website = "https://example.com/analytics-global",
                        Industry = "Data Analytics"
                    },
                    Description = "Analyze business metrics, design SQL dashboards, write automated Python pipelines, and provide executive insights. MySQL and PowerBI proficiency required.",
                    Address = "Whitefield Main Road",
                    City = "Bangalore",
                    State = "Karnataka",
                    Country = "India",
                    Latitude = 12.9698,
                    Longitude = 77.7499,
                    SalaryMin = 1000000,
                    SalaryMax = 1500000,
                    SalaryPeriod = "LPA",
                    ExperienceMin = 2,
                    ExperienceMax = 5,
                    JobType = "FullTime",
                    WorkMode = "Remote",
                    PostedDate = DateTime.UtcNow.AddHours(-6),
                    ApplicationUrl = "https://linkedin.com/demo-apply/data-analyst-blr",
                    Skills = new List<string> { "SQL", "MySQL", "Python", "PowerBI", "Data Analysis" },
                    IsDemoData = true
                }
            };

            return Task.FromResult(jobs.AsEnumerable());
        }
    }
}
