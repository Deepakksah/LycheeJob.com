using System;

namespace JobPortal.Core.Entities
{
    public class GovtJob
    {
        public int Id { get; set; }
        public string ExternalJobId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Ministry { get; set; } = string.Empty;
        public string SectorCategory { get; set; } = "CentralGovt"; // Defense, Banking, PSU, Railways, Civil, DelhiGovt, Teaching, Medical, Informatics, StatePSC
        
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = "Delhi";
        public string State { get; set; } = "Delhi NCR";
        public string Country { get; set; } = "India";
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string PayLevel { get; set; } = "Level 10"; // 7th CPC Level
        public string Vacancies { get; set; } = string.Empty;
        public string Qualifications { get; set; } = string.Empty;
        public string AgeLimit { get; set; } = "18-35 Years";
        public string SelectionMode { get; set; } = "Written Examination & Interview";

        public string ApplicationUrl { get; set; } = string.Empty;
        public string NotificationPdfUrl { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
        public string SkillsJson { get; set; } = string.Empty;

        public DateTime PostedDate { get; set; } = DateTime.UtcNow;
        public DateTime? LastDateToApply { get; set; }
        public DateTime? ExamDate { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
