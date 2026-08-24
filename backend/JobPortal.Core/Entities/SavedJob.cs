using System;

namespace JobPortal.Core.Entities
{
    public class SavedJob
    {
        public int Id { get; set; }
        public string UserId { get; set; } = "default-user";
        public long JobId { get; set; }
        public Job Job { get; set; } = null!;
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    }
}
