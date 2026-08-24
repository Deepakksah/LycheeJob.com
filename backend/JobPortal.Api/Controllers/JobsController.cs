using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;

namespace JobPortal.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _jobService;

        public JobsController(IJobService jobService)
        {
            _jobService = jobService;
        }

        /// <summary>
        /// Search jobs with filters, location/map bounds, spatial radius, sorting, and server-side pagination.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] JobSearchRequest request, CancellationToken cancellationToken)
        {
            var result = await _jobService.SearchJobsAsync(request, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Get detailed job information by ID.
        /// </summary>
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken)
        {
            var job = await _jobService.GetJobByIdAsync(id, cancellationToken);
            if (job == null)
            {
                return NotFound(new { success = false, message = "Job not found" });
            }
            return Ok(new { success = true, data = job });
        }

        /// <summary>
        /// Bookmark/Save or Unsave a job for the current user.
        /// </summary>
        [HttpPost("{id:long}/save")]
        public async Task<IActionResult> SaveJob(long id, [FromQuery] string userId = "default-user", CancellationToken cancellationToken = default)
        {
            bool isSaved = await _jobService.SaveJobAsync(userId, id, cancellationToken);
            return Ok(new { success = true, isSaved, message = isSaved ? "Job saved to bookmarks" : "Job removed from bookmarks" });
        }

        /// <summary>
        /// Get saved jobs for a user.
        /// </summary>
        [HttpGet("saved")]
        public async Task<IActionResult> GetSavedJobs([FromQuery] string userId = "default-user", CancellationToken cancellationToken = default)
        {
            var jobs = await _jobService.GetSavedJobsAsync(userId, cancellationToken);
            return Ok(new { success = true, data = jobs });
        }
    }
}
