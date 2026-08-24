using Microsoft.EntityFrameworkCore;
using JobPortal.Core.Entities;

namespace JobPortal.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Job> Jobs => Set<Job>();
        public DbSet<Company> Companies => Set<Company>();
        public DbSet<JobSource> JobSources => Set<JobSource>();
        public DbSet<Skill> Skills => Set<Skill>();
        public DbSet<JobSkill> JobSkills => Set<JobSkill>();
        public DbSet<SyncLog> SyncLogs => Set<SyncLog>();
        public DbSet<SavedJob> SavedJobs => Set<SavedJob>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // JobSkill Many-to-Many Key
            modelBuilder.Entity<JobSkill>()
                .HasKey(js => new { js.JobId, js.SkillId });

            modelBuilder.Entity<JobSkill>()
                .HasOne(js => js.Job)
                .WithMany(j => j.JobSkills)
                .HasForeignKey(js => js.JobId);

            modelBuilder.Entity<JobSkill>()
                .HasOne(js => js.Skill)
                .WithMany(s => s.JobSkills)
                .HasForeignKey(js => js.SkillId);

            // Indexes for performance
            modelBuilder.Entity<Job>()
                .HasIndex(j => j.City);

            modelBuilder.Entity<Job>()
                .HasIndex(j => j.Latitude);

            modelBuilder.Entity<Job>()
                .HasIndex(j => j.Longitude);

            modelBuilder.Entity<Job>()
                .HasIndex(j => j.PostedDate);

            modelBuilder.Entity<Job>()
                .HasIndex(j => j.CompanyId);

            modelBuilder.Entity<Job>()
                .HasIndex(j => j.SourceId);

            modelBuilder.Entity<Job>()
                .HasIndex(j => j.IsActive);

            modelBuilder.Entity<Job>()
                .HasIndex(j => j.DescriptionHash);

            modelBuilder.Entity<Job>()
                .Property(j => j.SalaryMin)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Job>()
                .Property(j => j.SalaryMax)
                .HasPrecision(18, 2);
        }
    }
}
