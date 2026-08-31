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

        // Fallback known coordinates for popular cities & IT corridors
        private static readonly ConcurrentDictionary<string, GeoLocation> _knownCities = new(StringComparer.OrdinalIgnoreCase)
        {
            ["delhi"] = new GeoLocation { Latitude = 28.6139, Longitude = 77.2090, City = "Delhi", State = "Delhi", Country = "India", FormattedAddress = "Delhi, India" },
            ["connaught place"] = new GeoLocation { Latitude = 28.6315, Longitude = 77.2167, City = "Delhi", State = "Delhi", Country = "India", FormattedAddress = "Connaught Place, New Delhi, India" },
            ["saket"] = new GeoLocation { Latitude = 28.5244, Longitude = 77.2188, City = "Delhi", State = "Delhi", Country = "India", FormattedAddress = "Saket, New Delhi, India" },
            ["noida"] = new GeoLocation { Latitude = 28.5355, Longitude = 77.3910, City = "Noida", State = "Uttar Pradesh", Country = "India", FormattedAddress = "Noida, UP, India" },
            ["sector 62"] = new GeoLocation { Latitude = 28.6270, Longitude = 77.3726, City = "Noida", State = "Uttar Pradesh", Country = "India", FormattedAddress = "Sector 62, Noida, India" },
            ["gurgaon"] = new GeoLocation { Latitude = 28.4595, Longitude = 77.0266, City = "Gurgaon", State = "Haryana", Country = "India", FormattedAddress = "Gurgaon, Haryana, India" },
            ["gurugram"] = new GeoLocation { Latitude = 28.4595, Longitude = 77.0266, City = "Gurgaon", State = "Haryana", Country = "India", FormattedAddress = "Gurgaon, Haryana, India" },
            ["cyber city"] = new GeoLocation { Latitude = 28.4950, Longitude = 77.0890, City = "Gurgaon", State = "Haryana", Country = "India", FormattedAddress = "DLF Cyber City, Gurgaon, India" },
            ["mumbai"] = new GeoLocation { Latitude = 19.0760, Longitude = 72.8777, City = "Mumbai", State = "Maharashtra", Country = "India", FormattedAddress = "Mumbai, Maharashtra, India" },
            ["bkc"] = new GeoLocation { Latitude = 19.0600, Longitude = 72.8700, City = "Mumbai", State = "Maharashtra", Country = "India", FormattedAddress = "Bandra Kurla Complex, Mumbai, India" },
            ["bangalore"] = new GeoLocation { Latitude = 12.9716, Longitude = 77.5946, City = "Bangalore", State = "Karnataka", Country = "India", FormattedAddress = "Bangalore, Karnataka, India" },
            ["bengaluru"] = new GeoLocation { Latitude = 12.9716, Longitude = 77.5946, City = "Bangalore", State = "Karnataka", Country = "India", FormattedAddress = "Bangalore, Karnataka, India" },
            ["whitefield"] = new GeoLocation { Latitude = 12.9698, Longitude = 77.7499, City = "Bangalore", State = "Karnataka", Country = "India", FormattedAddress = "Whitefield, Bangalore, India" },
            ["electronic city"] = new GeoLocation { Latitude = 12.8452, Longitude = 77.6602, City = "Bangalore", State = "Karnataka", Country = "India", FormattedAddress = "Electronic City, Bangalore, India" },
            ["koramangala"] = new GeoLocation { Latitude = 12.9352, Longitude = 77.6245, City = "Bangalore", State = "Karnataka", Country = "India", FormattedAddress = "Koramangala, Bangalore, India" },
            ["hsr layout"] = new GeoLocation { Latitude = 12.9121, Longitude = 77.6446, City = "Bangalore", State = "Karnataka", Country = "India", FormattedAddress = "HSR Layout, Bangalore, India" },
            ["bellandur"] = new GeoLocation { Latitude = 12.9298, Longitude = 77.6748, City = "Bangalore", State = "Karnataka", Country = "India", FormattedAddress = "Bellandur, Bangalore, India" },
            ["hyderabad"] = new GeoLocation { Latitude = 17.3850, Longitude = 78.4867, City = "Hyderabad", State = "Telangana", Country = "India", FormattedAddress = "Hyderabad, Telangana, India" },
            ["hitec city"] = new GeoLocation { Latitude = 17.4435, Longitude = 78.3772, City = "Hyderabad", State = "Telangana", Country = "India", FormattedAddress = "HITEC City, Hyderabad, India" },
            ["gachibowli"] = new GeoLocation { Latitude = 17.4401, Longitude = 78.3489, City = "Hyderabad", State = "Telangana", Country = "India", FormattedAddress = "Gachibowli, Hyderabad, India" },
            ["pune"] = new GeoLocation { Latitude = 18.5204, Longitude = 73.8567, City = "Pune", State = "Maharashtra", Country = "India", FormattedAddress = "Pune, Maharashtra, India" },
            ["hinjawadi"] = new GeoLocation { Latitude = 18.5912, Longitude = 73.7389, City = "Pune", State = "Maharashtra", Country = "India", FormattedAddress = "Hinjawadi IT Park, Pune, India" },
            ["chennai"] = new GeoLocation { Latitude = 13.0827, Longitude = 80.2707, City = "Chennai", State = "Tamil Nadu", Country = "India", FormattedAddress = "Chennai, Tamil Nadu, India" },
            ["omr"] = new GeoLocation { Latitude = 12.9010, Longitude = 80.2279, City = "Chennai", State = "Tamil Nadu", Country = "India", FormattedAddress = "OMR IT Corridor, Chennai, India" },
            ["kolkata"] = new GeoLocation { Latitude = 22.5726, Longitude = 88.3639, City = "Kolkata", State = "West Bengal", Country = "India", FormattedAddress = "Kolkata, WB, India" },
            ["salt lake"] = new GeoLocation { Latitude = 22.5726, Longitude = 88.4331, City = "Kolkata", State = "West Bengal", Country = "India", FormattedAddress = "Salt Lake Sector V, Kolkata, India" },
            ["jaipur"] = new GeoLocation { Latitude = 26.9124, Longitude = 75.7873, City = "Jaipur", State = "Rajasthan", Country = "India", FormattedAddress = "Jaipur, Rajasthan, India" },
            ["ahmedabad"] = new GeoLocation { Latitude = 23.0225, Longitude = 72.5714, City = "Ahmedabad", State = "Gujarat", Country = "India", FormattedAddress = "Ahmedabad, Gujarat, India" },
            ["chandigarh"] = new GeoLocation { Latitude = 30.7333, Longitude = 76.7794, City = "Chandigarh", State = "Punjab", Country = "India", FormattedAddress = "Chandigarh, India" },
            ["indore"] = new GeoLocation { Latitude = 22.7196, Longitude = 75.8577, City = "Indore", State = "Madhya Pradesh", Country = "India", FormattedAddress = "Indore, MP, India" },
            ["kochi"] = new GeoLocation { Latitude = 9.9312, Longitude = 76.2673, City = "Kochi", State = "Kerala", Country = "India", FormattedAddress = "Kochi, Kerala, India" },
            ["lucknow"] = new GeoLocation { Latitude = 26.8467, Longitude = 80.9462, City = "Lucknow", State = "Uttar Pradesh", Country = "India", FormattedAddress = "Lucknow, UP, India" },
            ["surat"] = new GeoLocation { Latitude = 21.1702, Longitude = 72.8311, City = "Surat", State = "Gujarat", Country = "India", FormattedAddress = "Surat, Gujarat, India" },
            ["coimbatore"] = new GeoLocation { Latitude = 11.0168, Longitude = 76.9558, City = "Coimbatore", State = "Tamil Nadu", Country = "India", FormattedAddress = "Coimbatore, Tamil Nadu, India" },
            ["bhopal"] = new GeoLocation { Latitude = 23.2599, Longitude = 77.4126, City = "Bhopal", State = "Madhya Pradesh", Country = "India", FormattedAddress = "Bhopal, MP, India" },
            ["nagpur"] = new GeoLocation { Latitude = 21.1458, Longitude = 79.0882, City = "Nagpur", State = "Maharashtra", Country = "India", FormattedAddress = "Nagpur, Maharashtra, India" },
            ["dehradun"] = new GeoLocation { Latitude = 30.3165, Longitude = 78.0322, City = "Dehradun", State = "Uttarakhand", Country = "India", FormattedAddress = "Dehradun, Uttarakhand, India" },
            ["visakhapatnam"] = new GeoLocation { Latitude = 17.6868, Longitude = 83.2185, City = "Visakhapatnam", State = "Andhra Pradesh", Country = "India", FormattedAddress = "Visakhapatnam, AP, India" },
            ["vizag"] = new GeoLocation { Latitude = 17.6868, Longitude = 83.2185, City = "Visakhapatnam", State = "Andhra Pradesh", Country = "India", FormattedAddress = "Visakhapatnam, AP, India" },
            ["patna"] = new GeoLocation { Latitude = 25.5941, Longitude = 85.1376, City = "Patna", State = "Bihar", Country = "India", FormattedAddress = "Patna, Bihar, India" },
            ["vadodara"] = new GeoLocation { Latitude = 22.3072, Longitude = 73.1812, City = "Vadodara", State = "Gujarat", Country = "India", FormattedAddress = "Vadodara, Gujarat, India" },
            ["bhubaneswar"] = new GeoLocation { Latitude = 20.2961, Longitude = 85.8245, City = "Bhubaneswar", State = "Odisha", Country = "India", FormattedAddress = "Bhubaneswar, Odisha, India" },
            ["mysore"] = new GeoLocation { Latitude = 12.2958, Longitude = 76.6394, City = "Mysore", State = "Karnataka", Country = "India", FormattedAddress = "Mysore, Karnataka, India" },
            ["mysuru"] = new GeoLocation { Latitude = 12.2958, Longitude = 76.6394, City = "Mysore", State = "Karnataka", Country = "India", FormattedAddress = "Mysore, Karnataka, India" },
            ["thiruvananthapuram"] = new GeoLocation { Latitude = 8.5241, Longitude = 76.9366, City = "Thiruvananthapuram", State = "Kerala", Country = "India", FormattedAddress = "Thiruvananthapuram, Kerala, India" },
            ["trivandrum"] = new GeoLocation { Latitude = 8.5241, Longitude = 76.9366, City = "Thiruvananthapuram", State = "Kerala", Country = "India", FormattedAddress = "Thiruvananthapuram, Kerala, India" },
            ["guwahati"] = new GeoLocation { Latitude = 26.1445, Longitude = 91.7362, City = "Guwahati", State = "Assam", Country = "India", FormattedAddress = "Guwahati, Assam, India" },
            ["ranchi"] = new GeoLocation { Latitude = 23.3441, Longitude = 85.3096, City = "Ranchi", State = "Jharkhand", Country = "India", FormattedAddress = "Ranchi, Jharkhand, India" },
            ["varanasi"] = new GeoLocation { Latitude = 25.3176, Longitude = 82.9739, City = "Varanasi", State = "Uttar Pradesh", Country = "India", FormattedAddress = "Varanasi, UP, India" },
            ["ludhiana"] = new GeoLocation { Latitude = 30.9010, Longitude = 75.8573, City = "Ludhiana", State = "Punjab", Country = "India", FormattedAddress = "Ludhiana, Punjab, India" },
            ["mohali"] = new GeoLocation { Latitude = 30.7046, Longitude = 76.7179, City = "Mohali", State = "Punjab", Country = "India", FormattedAddress = "Mohali, Punjab, India" },
            ["faridabad"] = new GeoLocation { Latitude = 28.4089, Longitude = 77.3178, City = "Faridabad", State = "Haryana", Country = "India", FormattedAddress = "Faridabad, Haryana, India" },
            ["ghaziabad"] = new GeoLocation { Latitude = 28.6692, Longitude = 77.4538, City = "Ghaziabad", State = "Uttar Pradesh", Country = "India", FormattedAddress = "Ghaziabad, UP, India" },
            ["kanpur"] = new GeoLocation { Latitude = 26.4499, Longitude = 80.3319, City = "Kanpur", State = "Uttar Pradesh", Country = "India", FormattedAddress = "Kanpur, UP, India" },
            ["remote"] = new GeoLocation { Latitude = 28.6139, Longitude = 77.2090, City = "Remote", State = "Remote", Country = "India", FormattedAddress = "Remote / Work From Home" }
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
