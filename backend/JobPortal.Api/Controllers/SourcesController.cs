using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using JobPortal.Core.Interfaces;

namespace JobPortal.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SourcesController : ControllerBase
    {
        private readonly IJobService _jobService;

        public SourcesController(IJobService jobService)
        {
            _jobService = jobService;
        }

        /// <summary>
        /// Get active job sources.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetSources(CancellationToken cancellationToken)
        {
            var sources = await _jobService.GetJobSourcesAsync(cancellationToken);
            return Ok(new { success = true, data = sources });
        }
    }
}
