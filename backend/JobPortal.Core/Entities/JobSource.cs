using System;
using System.Collections.Generic;

namespace JobPortal.Core.Entities
{
    public class JobSource
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? BaseUrl { get; set; }
        public string SourceType { get; set; } = "OfficialApi";
        public bool IsActive { get; set; } = true;
        public DateTime? LastSyncAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<SyncLog> SyncLogs { get; set; } = new List<SyncLog>();
        public ICollection<Job> Jobs { get; set; } = new List<Job>();
    }
}
