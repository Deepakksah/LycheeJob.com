namespace JobPortal.Core.DTOs
{
    public class JobSearchRequest
    {
        public string? Keyword { get; set; }
        public string? City { get; set; }
        public string[]? Cities { get; set; }
        public string? State { get; set; }
        public string[]? States { get; set; }

        // Geolocation / Spatial search
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public double? RadiusKm { get; set; }

        // Map viewport bounds
        public double? North { get; set; }
        public double? South { get; set; }
        public double? East { get; set; }
        public double? West { get; set; }

        // Filters
        public decimal? MinSalary { get; set; }
        public decimal? MaxSalary { get; set; }

        public string? Experience { get; set; } // e.g. "0-1", "1-3", "3-5", "5-10", "10+"
        public int? MinExperience { get; set; }
        public int? MaxExperience { get; set; }

        public string[]? JobTypes { get; set; } // FullTime, PartTime, Contract, Internship, Freelance
        public string[]? WorkModes { get; set; } // Remote, Hybrid, OnSite
        public string[]? Sources { get; set; }
        public string? Industry { get; set; }

        public int? PostedWithinDays { get; set; } // 1, 3, 7, 30
        public bool? HasInterviewDate { get; set; }

        // User coordinates for distance calculations
        public double? UserLat { get; set; }
        public double? UserLng { get; set; }

        // Pagination & Sorting
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string SortBy { get; set; } = "relevance"; // relevance, newest, oldest, salary_high, salary_low, distance, company
    }
}
