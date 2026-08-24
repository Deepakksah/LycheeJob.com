using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using JobPortal.Core.Interfaces;

namespace JobPortal.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IJobService _jobService;

        public AdminController(IJobService jobService)
        {
            _jobService = jobService;
        }

        /// <summary>
        /// Get admin analytics and job aggregation metrics.
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats(CancellationToken cancellationToken)
        {
            var stats = await _jobService.GetAdminStatsAsync(cancellationToken);
            return Ok(new { success = true, data = stats });
        }

        /// <summary>
        /// Toggle job source enabled/disabled status.
        /// </summary>
        [HttpPut("sources/{id:int}/toggle")]
        public async Task<IActionResult> ToggleSource(int id, [FromQuery] bool isActive, CancellationToken cancellationToken)
        {
            bool updated = await _jobService.ToggleSourceStatusAsync(id, isActive, cancellationToken);
            if (!updated)
            {
                return NotFound(new { success = false, message = "Job source not found" });
            }
            return Ok(new { success = true, message = $"Job source status updated to {(isActive ? "active" : "disabled")}" });
        }

        /// <summary>
        /// Manually trigger background sync for all or a specific source.
        /// </summary>
        [HttpPost("sources/{id:int}/sync")]
        public async Task<IActionResult> SyncSource(int id, CancellationToken cancellationToken)
        {
            int count = id == 0 ? await _jobService.SyncJobsFromAllSourcesAsync(cancellationToken) : await _jobService.SyncSourceAsync(id, cancellationToken);
            return Ok(new { success = true, message = $"Synchronization completed. Processed {count} jobs.", jobsProcessed = count });
        }

        /// <summary>
        /// View background synchronization logs.
        /// </summary>
        [HttpGet("logs")]
        public async Task<IActionResult> GetSyncLogs([FromQuery] int limit = 50, CancellationToken cancellationToken = default)
        {
            var logs = await _jobService.GetSyncLogsAsync(limit, cancellationToken);
            return Ok(new { success = true, data = logs });
        }
    }
}
