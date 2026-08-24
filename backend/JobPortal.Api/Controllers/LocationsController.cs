using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using JobPortal.Core.Interfaces;

namespace JobPortal.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly IGeocodingService _geocodingService;

        public LocationsController(IGeocodingService geocodingService)
        {
            _geocodingService = geocodingService;
        }

        /// <summary>
        /// Geocode a city or address string to Latitude and Longitude.
        /// </summary>
        [HttpGet("geocode")]
        public async Task<IActionResult> Geocode([FromQuery] string address, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(address))
            {
                return BadRequest(new { success = false, message = "Address query parameter is required" });
            }

            var location = await _geocodingService.GeocodeAsync(address, cancellationToken);
            if (location == null)
            {
                return NotFound(new { success = false, message = "Location could not be geocoded" });
            }

            return Ok(new { success = true, data = location });
        }
    }
}
