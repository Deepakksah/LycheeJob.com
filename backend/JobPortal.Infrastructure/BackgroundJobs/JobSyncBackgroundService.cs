using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using JobPortal.Core.Interfaces;

namespace JobPortal.Infrastructure.BackgroundJobs
{
    public class JobSyncBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _configuration;
        private readonly ILogger<JobSyncBackgroundService> _logger;

        public JobSyncBackgroundService(
            IServiceProvider serviceProvider,
            IConfiguration configuration,
            ILogger<JobSyncBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _configuration = configuration;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("JobSyncBackgroundService starting.");

            // Read sync interval from configuration (default to 30 minutes)
            string? intervalStr = _configuration["BackgroundSync:IntervalMinutes"];
            int intervalMinutes = int.TryParse(intervalStr, out var val) ? val : 30;
            var delay = TimeSpan.FromMinutes(Math.Max(5, intervalMinutes));

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Scheduled Job Source Sync starting at: {Time}", DateTimeOffset.Now);

                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var jobService = scope.ServiceProvider.GetRequiredService<IJobService>();
                        int count = await jobService.SyncJobsFromAllSourcesAsync(stoppingToken);
                        _logger.LogInformation("Scheduled sync completed. Inserted/updated {Count} job listings.", count);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred during scheduled job synchronization.");
                }

                await Task.Delay(delay, stoppingToken);
            }
        }
    }
}
