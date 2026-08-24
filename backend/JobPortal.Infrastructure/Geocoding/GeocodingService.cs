using System;
using System.Collections.Concurrent;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Nodes;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;

namespace JobPortal.Infrastructure.Geocoding
{
    public class GeocodingService : IGeocodingService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<GeocodingService> _logger;
        private static readonly ConcurrentDictionary<string, GeoLocation> _cache = new(StringComparer.OrdinalIgnoreCase);

        // Fallback known coordinates for popular cities
        private static readonly ConcurrentDictionary<string, GeoLocation> _knownCities = new(StringComparer.OrdinalIgnoreCase)
        {
            ["delhi"] = new GeoLocation { Latitude = 28.6139, Longitude = 77.2090, City = "Delhi", State = "Delhi", Country = "India", FormattedAddress = "Delhi, India" },
            ["noida"] = new GeoLocation { Latitude = 28.5355, Longitude = 77.3910, City = "Noida", State = "Uttar Pradesh", Country = "India", FormattedAddress = "Noida, UP, India" },
            ["gurgaon"] = new GeoLocation { Latitude = 28.4595, Longitude = 77.0266, City = "Gurgaon", State = "Haryana", Country = "India", FormattedAddress = "Gurgaon, Haryana, India" },
            ["gurugram"] = new GeoLocation { Latitude = 28.4595, Longitude = 77.0266, City = "Gurgaon", State = "Haryana", Country = "India", FormattedAddress = "Gurgaon, Haryana, India" },
            ["mumbai"] = new GeoLocation { Latitude = 19.0760, Longitude = 72.8777, City = "Mumbai", State = "Maharashtra", Country = "India", FormattedAddress = "Mumbai, Maharashtra, India" },
            ["bangalore"] = new GeoLocation { Latitude = 12.9716, Longitude = 77.5946, City = "Bangalore", State = "Karnataka", Country = "India", FormattedAddress = "Bangalore, Karnataka, India" },
            ["bengaluru"] = new GeoLocation { Latitude = 12.9716, Longitude = 77.5946, City = "Bangalore", State = "Karnataka", Country = "India", FormattedAddress = "Bangalore, Karnataka, India" },
            ["hyderabad"] = new GeoLocation { Latitude = 17.3850, Longitude = 78.4867, City = "Hyderabad", State = "Telangana", Country = "India", FormattedAddress = "Hyderabad, Telangana, India" },
            ["pune"] = new GeoLocation { Latitude = 18.5204, Longitude = 73.8567, City = "Pune", State = "Maharashtra", Country = "India", FormattedAddress = "Pune, Maharashtra, India" },
            ["chennai"] = new GeoLocation { Latitude = 13.0827, Longitude = 80.2707, City = "Chennai", State = "Tamil Nadu", Country = "India", FormattedAddress = "Chennai, Tamil Nadu, India" },
            ["kolkata"] = new GeoLocation { Latitude = 22.5726, Longitude = 88.3639, City = "Kolkata", State = "West Bengal", Country = "India", FormattedAddress = "Kolkata, WB, India" },
            ["jaipur"] = new GeoLocation { Latitude = 26.9124, Longitude = 75.7873, City = "Jaipur", State = "Rajasthan", Country = "India", FormattedAddress = "Jaipur, Rajasthan, India" }
        };

        public GeocodingService(HttpClient httpClient, IConfiguration configuration, ILogger<GeocodingService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<GeoLocation?> GeocodeAsync(string address, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(address)) return null;

            string normalizedKey = address.Trim().ToLowerInvariant();

            // 1. Check Cache first
            if (_cache.TryGetValue(normalizedKey, out var cached))
            {
                _logger.LogInformation("Geocoding cache hit for '{Address}'", address);
                return cached;
            }

            // 2. Check Static Known Cities
            foreach (var kvp in _knownCities)
            {
                if (normalizedKey.Contains(kvp.Key))
                {
                    _cache[normalizedKey] = kvp.Value;
                    return kvp.Value;
                }
            }

            // 3. Call Google Geocoding API if key configured
            string? apiKey = _configuration["GoogleMaps:GeocodingApiKey"] ?? _configuration["GoogleMaps:ApiKey"];
            if (!string.IsNullOrEmpty(apiKey) && apiKey != "YOUR_GOOGLE_MAPS_API_KEY")
            {
                try
                {
                    string url = $"https://maps.googleapis.com/maps/api/geocode/json?address={Uri.EscapeDataString(address)}&key={apiKey}";
                    var response = await _httpClient.GetFromJsonAsync<JsonObject>(url, cancellationToken);

                    if (response != null && response["status"]?.ToString() == "OK")
                    {
                        var results = response["results"]?.AsArray();
                        if (results != null && results.Count > 0)
                        {
                            var locationObj = results[0]?["geometry"]?["location"];
                            if (locationObj != null)
                            {
                                double lat = locationObj["lat"]?.GetValue<double>() ?? 0;
                                double lng = locationObj["lng"]?.GetValue<double>() ?? 0;
                                string formatted = results[0]?["formatted_address"]?.ToString() ?? address;

                                var geo = new GeoLocation
                                {
                                    Latitude = lat,
                                    Longitude = lng,
                                    FormattedAddress = formatted
                                };

                                _cache[normalizedKey] = geo;
                                return geo;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error calling Google Geocoding API for address '{Address}'", address);
                }
            }

            return null;
        }
    }
}
