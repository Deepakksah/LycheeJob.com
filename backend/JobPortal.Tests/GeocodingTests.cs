using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;
using JobPortal.Infrastructure.Geocoding;

namespace JobPortal.Tests
{
    public class GeocodingTests
    {
        [Theory]
        [InlineData("Delhi", 28.6139, 77.2090)]
        [InlineData("Noida", 28.5355, 77.3910)]
        [InlineData("Bangalore", 12.9716, 77.5946)]
        public async Task GeocodeAsync_ResolvesKnownIndianCities(string city, double expectedLat, double expectedLng)
        {
            var config = new ConfigurationBuilder().Build();
            var service = new GeocodingService(new HttpClient(), config, NullLogger<GeocodingService>.Instance);

            var geo = await service.GeocodeAsync(city);

            Assert.NotNull(geo);
            Assert.Equal(expectedLat, geo!.Latitude, precision: 3);
            Assert.Equal(expectedLng, geo.Longitude, precision: 3);
        }
    }
}
