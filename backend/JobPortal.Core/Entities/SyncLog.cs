using System;

namespace JobPortal.Core.Entities
{
    public class SyncLog
    {
        public int Id { get; set; }
        public int SourceId { get; set; }
        public JobSource Source { get; set; } = null!;

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
        public string Status { get; set; } = "Success"; // Success, Failed, Partial
        public int JobsFetched { get; set; }
        public int JobsInserted { get; set; }
        public int JobsUpdated { get; set; }
        public int JobsSkipped { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
