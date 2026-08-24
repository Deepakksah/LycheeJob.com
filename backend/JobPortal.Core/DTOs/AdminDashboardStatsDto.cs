using System.Collections.Generic;

namespace JobPortal.Core.DTOs
{
    public class AdminDashboardStatsDto
    {
        public int TotalJobs { get; set; }
        public int ActiveJobs { get; set; }
        public int NewJobsToday { get; set; }
        public int TotalCompanies { get; set; }
        public int TotalSources { get; set; }
        public int FailedSyncs { get; set; }
        public System.DateTime? LastSyncTime { get; set; }

        public Dictionary<string, int> JobsByCity { get; set; } = new();
        public Dictionary<string, int> JobsByIndustry { get; set; } = new();
        public Dictionary<string, int> JobsBySource { get; set; } = new();
        public Dictionary<string, int> JobsByWorkMode { get; set; } = new();
    }
}
