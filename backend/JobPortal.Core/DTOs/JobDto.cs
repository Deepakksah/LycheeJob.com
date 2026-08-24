using System;
using System.Collections.Generic;

namespace JobPortal.Core.DTOs
{
    public class JobDto
    {
        public long Id { get; set; }
        public string ExternalJobId { get; set; } = string.Empty;
        public string SourceName { get; set; } = string.Empty;
        public int SourceId { get; set; }

        public string Title { get; set; } = string.Empty;

        public int CompanyId { get; set; }
        public CompanyDto Company { get; set; } = new CompanyDto();

        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = "India";
        public string? PostalCode { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string Currency { get; set; } = "INR";
        public string SalaryPeriod { get; set; } = "LPA";

        public int? ExperienceMin { get; set; }
        public int? ExperienceMax { get; set; }

        public string JobType { get; set; } = "FullTime";
        public string WorkMode { get; set; } = "Hybrid";

        public DateTime PostedDate { get; set; }
        public DateTime? ExpiryDate { get; set; }

        public string? ContactName { get; set; }
        public string? ContactPhone { get; set; }
        public string? ContactEmail { get; set; }

        public DateTime? InterviewDate { get; set; }
        public string? InterviewStartTime { get; set; }
        public string? InterviewEndTime { get; set; }
        public string? InterviewLocation { get; set; }
        public string? InterviewMode { get; set; }
        public string? InterviewNotes { get; set; }

        public string ApplicationUrl { get; set; } = string.Empty;
        public string? OriginalUrl { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsDemoData { get; set; } = true;
        public int DuplicateCount { get; set; } = 1;
        public double? DistanceKm { get; set; }

        public List<string> Skills { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; }
    }
}
