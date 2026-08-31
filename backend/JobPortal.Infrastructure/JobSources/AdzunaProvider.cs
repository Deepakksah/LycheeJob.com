using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace JobPortal.Infrastructure.JobSources
{
    /// <summary>
    /// Adzuna India Job Provider
    /// Free API: https://developer.adzuna.com/
    /// Covers 1M+ real Indian jobs from LinkedIn, Indeed, Naukri, Glassdoor, etc.
    /// Config: Adzuna:AppId and Adzuna:AppKey in appsettings.json
    /// </summary>
    public class AdzunaProvider : IJobSourceProvider
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;
        private readonly ILogger<AdzunaProvider> _logger;

        public string SourceName => "Adzuna";

        // Major & Emerging Indian tech cities to scan jobs from
        private static readonly string[] CITIES = {
            "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
            "Pune", "Gurgaon", "Noida", "Kolkata", "Ahmedabad",
            "Jaipur", "Chandigarh", "Indore", "Kochi", "Lucknow",
            "Surat", "Coimbatore", "Bhopal", "Nagpur", "Dehradun",
            "Visakhapatnam", "Patna", "Vadodara", "Bhubaneswar", "Mysore",
            "Thiruvananthapuram", "Guwahati", "Ranchi", "Varanasi", "Ludhiana"
        };

        // City coordinates for map placement
        private static readonly Dictionary<string, (double lat, double lng)> CITY_COORDS = new()
        {
            ["Delhi"]              = (28.6139, 77.2090),
            ["Mumbai"]             = (19.0760, 72.8777),
            ["Bangalore"]          = (12.9716, 77.5946),
            ["Hyderabad"]          = (17.3850, 78.4867),
            ["Chennai"]            = (13.0827, 80.2707),
            ["Pune"]               = (18.5204, 73.8567),
            ["Gurgaon"]            = (28.4595, 77.0266),
            ["Noida"]              = (28.5355, 77.3910),
            ["Kolkata"]            = (22.5726, 88.3639),
            ["Ahmedabad"]          = (23.0225, 72.5714),
            ["Jaipur"]             = (26.9124, 75.7873),
            ["Chandigarh"]         = (30.7333, 76.7794),
            ["Indore"]             = (22.7196, 75.8577),
            ["Kochi"]              = (9.9312, 76.2673),
            ["Lucknow"]            = (26.8467, 80.9462),
            ["Surat"]              = (21.1702, 72.8311),
            ["Coimbatore"]         = (11.0168, 76.9558),
            ["Bhopal"]             = (23.2599, 77.4126),
            ["Nagpur"]             = (21.1458, 79.0882),
            ["Dehradun"]           = (30.3165, 78.0322),
            ["Visakhapatnam"]      = (17.6868, 83.2185),
            ["Patna"]              = (25.5941, 85.1376),
            ["Vadodara"]           = (22.3072, 73.1812),
            ["Bhubaneswar"]        = (20.2961, 85.8245),
            ["Mysore"]             = (12.2958, 76.6394),
            ["Thiruvananthapuram"] = (8.5241, 76.9366),
            ["Guwahati"]           = (26.1445, 91.7362),
            ["Ranchi"]             = (23.3441, 85.3096),
            ["Varanasi"]           = (25.3176, 82.9739),
            ["Ludhiana"]           = (30.9010, 75.8573)
        };

        public AdzunaProvider(HttpClient http, IConfiguration config, ILogger<AdzunaProvider> logger)
        {
            _http = http;
            _config = config;
            _logger = logger;
        }

        public async Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchRequest request, CancellationToken cancellationToken = default)
        {
            var appId = _config["Adzuna:AppId"];
            var appKey = _config["Adzuna:AppKey"];

            if (string.IsNullOrEmpty(appId) || string.IsNullOrEmpty(appKey) ||
                appId == "YOUR_ADZUNA_APP_ID" || appKey == "YOUR_ADZUNA_APP_KEY")
            {
                _logger.LogWarning("Adzuna: AppId/AppKey not configured. Skipping.");
                return Enumerable.Empty<JobDto>();
            }

            var jobs = new List<JobDto>();
            var seenIds = new HashSet<string>();

            // Fetch jobs for each major city
            foreach (var city in CITIES)
            {
                try
                {
                    // Fetch up to 50 jobs per city (page 1)
                    var url = $"https://api.adzuna.com/v1/api/jobs/in/search/1" +
                              $"?app_id={appId}&app_key={appKey}" +
                              $"&results_per_page=50" +
                              $"&where={Uri.EscapeDataString(city)}" +
                              $"&sort_by=date" +
                              $"&content-type=application/json";

                    _http.DefaultRequestHeaders.Clear();
                    _http.DefaultRequestHeaders.Add("User-Agent", "LycheeJob/1.0");

                    var response = await _http.GetAsync(url, cancellationToken);
                    if (!response.IsSuccessStatusCode)
                    {
                        _logger.LogWarning("Adzuna {City}: HTTP {Status}", city, response.StatusCode);
                        continue;
                    }

                    var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken);
                    var json = System.Text.Encoding.UTF8.GetString(bytes);
                    using var doc = JsonDocument.Parse(json);

                    if (!doc.RootElement.TryGetProperty("results", out var results)) continue;

                    var coords = CITY_COORDS.TryGetValue(city, out var c) ? c : (28.6139, 77.2090);

                    foreach (var elem in results.EnumerateArray())
                    {
                        try
                        {
                            var id = elem.TryGetProperty("id", out var idP) ? idP.GetString() ?? "" : "";
                            if (seenIds.Contains(id)) continue;
                            seenIds.Add(id);

                            var title = elem.TryGetProperty("title", out var t) ? t.GetString() ?? "" : "";
                            var desc = elem.TryGetProperty("description", out var d) ? d.GetString() ?? "" : "";
                            var redirectUrl = elem.TryGetProperty("redirect_url", out var ru) ? ru.GetString() ?? "" : "";
                            var created = elem.TryGetProperty("created", out var cr) ? cr.GetString() : null;

                            // Company
                            string companyName = "Company";
                            string? companyLogo = null;
                            if (elem.TryGetProperty("company", out var comp))
                            {
                                companyName = comp.TryGetProperty("display_name", out var cn) ? cn.GetString() ?? "Company" : "Company";
                            }

                            // Location
                            double lat = coords.Item1 + (new Random(id.GetHashCode()).NextDouble() - 0.5) * 0.3;
                            double lng = coords.Item2 + (new Random(id.GetHashCode() + 1).NextDouble() - 0.5) * 0.3;
                            string locationStr = city;
                            if (elem.TryGetProperty("location", out var loc) &&
                                loc.TryGetProperty("display_name", out var locName))
                            {
                                locationStr = locName.GetString() ?? city;
                            }

                            // Salary
                            long? salMin = null, salMax = null;
                            if (elem.TryGetProperty("salary_min", out var sMin) && sMin.ValueKind == JsonValueKind.Number)
                                salMin = (long)(sMin.GetDouble() * 100); // Convert to INR paise if needed
                            if (elem.TryGetProperty("salary_max", out var sMax) && sMax.ValueKind == JsonValueKind.Number)
                                salMax = (long)(sMax.GetDouble() * 100);

                            // Category
                            string industry = "Technology";
                            if (elem.TryGetProperty("category", out var cat) &&
                                cat.TryGetProperty("label", out var catLabel))
                            {
                                industry = catLabel.GetString() ?? "Technology";
                            }

                            // Contract type
                            string jobType = "FullTime";
                            if (elem.TryGetProperty("contract_type", out var ct))
                            {
                                var ctStr = ct.GetString() ?? "";
                                jobType = ctStr.Contains("part", StringComparison.OrdinalIgnoreCase) ? "PartTime" :
                                          ctStr.Contains("contract", StringComparison.OrdinalIgnoreCase) ? "Contract" : "FullTime";
                            }

                            DateTime postedDate = DateTime.UtcNow.AddDays(-1);
                            if (!string.IsNullOrEmpty(created) && DateTime.TryParse(created, out var pd))
                                postedDate = pd;

                            if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(companyName)) continue;

                            jobs.Add(new JobDto
                            {
                                ExternalJobId = $"adz-{id}",
                                SourceName = SourceName,
                                Title = title,
                                Company = new CompanyDto
                                {
                                    Name = companyName,
                                    LogoUrl = companyLogo,
                                    Industry = industry
                                },
                                Description = desc.Length > 2000 ? desc.Substring(0, 2000) + "..." : desc,
                                Address = locationStr,
                                City = city,
                                State = GetStateForCity(city),
                                Country = "India",
                                Latitude = lat,
                                Longitude = lng,
                                SalaryMin = salMin,
                                SalaryMax = salMax,
                                Currency = "INR",
                                SalaryPeriod = "Yearly",
                                JobType = jobType,
                                WorkMode = "OnSite",
                                PostedDate = postedDate,
                                ApplicationUrl = redirectUrl,
                                Skills = new List<string>(),
                                IsDemoData = false
                            });
                        }
                        catch { /* skip malformed */ }
                    }

                    _logger.LogInformation("Adzuna {City}: {Count} jobs fetched", city, jobs.Count);

                    // Small delay to respect rate limits
                    await Task.Delay(200, cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Adzuna failed for city: {City}", city);
                }
            }

            _logger.LogInformation("Adzuna TOTAL: {Count} jobs across all cities", jobs.Count);
            return jobs;
        }

        private static string GetStateForCity(string city) => city switch
        {
            "Delhi" or "Gurgaon" or "Noida" => "Delhi NCR",
            "Mumbai" or "Pune" or "Navi Mumbai" => "Maharashtra",
            "Bangalore" => "Karnataka",
            "Hyderabad" => "Telangana",
            "Chennai" => "Tamil Nadu",
            "Kolkata" => "West Bengal",
            "Ahmedabad" => "Gujarat",
            "Jaipur" => "Rajasthan",
            "Chandigarh" => "Punjab",
            "Indore" => "Madhya Pradesh",
            "Kochi" => "Kerala",
            "Lucknow" => "Uttar Pradesh",
            _ => "India"
        };
    }
}
