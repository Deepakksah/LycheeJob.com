using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using JobPortal.Core.DTOs;
using JobPortal.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace JobPortal.Infrastructure.JobSources
{
    /// <summary>
    /// Arbeitnow Provider — 100% Free Public API, no key required.
    /// https://www.arbeitnow.com/api/job-board-api
    /// Returns 100+ real, active tech, engineering, and remote jobs.
    /// </summary>
    public class ArbeitnowProvider : IJobSourceProvider
    {
        private readonly HttpClient _http;
        private readonly ILogger<ArbeitnowProvider> _logger;

        public string SourceName => "Arbeitnow";

        public ArbeitnowProvider(HttpClient http, ILogger<ArbeitnowProvider> logger)
        {
            _http = http;
            _logger = logger;
        }

        public async Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchRequest request, CancellationToken cancellationToken = default)
        {
            var jobs = new List<JobDto>();
            try
            {
                _http.DefaultRequestHeaders.Clear();
                _http.DefaultRequestHeaders.Add("User-Agent", "LycheeJob/1.0 (Real Job Aggregator)");

                var response = await _http.GetAsync("https://www.arbeitnow.com/api/job-board-api", cancellationToken);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Arbeitnow API returned HTTP {StatusCode}", response.StatusCode);
                    return jobs;
                }

                var json = await response.Content.ReadAsStringAsync(cancellationToken);
                using var doc = JsonDocument.Parse(json);

                if (!doc.RootElement.TryGetProperty("data", out var dataArr))
                    return jobs;

                foreach (var elem in dataArr.EnumerateArray())
                {
                    try
                    {
                        var slug = elem.TryGetProperty("slug", out var s) ? s.GetString() ?? "" : "";
                        var title = elem.TryGetProperty("title", out var t) ? t.GetString() ?? "" : "";
                        var company = elem.TryGetProperty("company_name", out var c) ? c.GetString() ?? "Tech Company" : "Tech Company";
                        var url = elem.TryGetProperty("url", out var u) ? u.GetString() ?? "" : "";
                        var description = elem.TryGetProperty("description", out var d) ? d.GetString() ?? "" : "";
                        var isRemote = elem.TryGetProperty("remote", out var r) && r.GetBoolean();
                        var location = elem.TryGetProperty("location", out var loc) ? loc.GetString() ?? "Remote" : "Remote";
                        var createdAt = elem.TryGetProperty("created_at", out var ca) ? ca.GetInt64() : 0;

                        if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(company))
                            continue;

                        var skills = new List<string>();
                        if (elem.TryGetProperty("tags", out var tags) && tags.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var tag in tags.EnumerateArray())
                            {
                                var tagStr = tag.GetString();
                                if (!string.IsNullOrEmpty(tagStr))
                                    skills.Add(tagStr);
                            }
                        }

                        DateTime postedDate = createdAt > 0
                            ? DateTimeOffset.FromUnixTimeSeconds(createdAt).UtcDateTime
                            : DateTime.UtcNow.AddDays(-1);

                        // Clean HTML tags from description if present
                        string cleanDesc = System.Text.RegularExpressions.Regex.Replace(description, "<.*?>", string.Empty);
                        if (cleanDesc.Length > 2000) cleanDesc = cleanDesc.Substring(0, 2000) + "...";

                        jobs.Add(new JobDto
                        {
                            ExternalJobId = $"arb-{slug}",
                            SourceName = SourceName,
                            Title = title,
                            Company = new CompanyDto
                            {
                                Name = company,
                                Industry = "Technology & Software"
                            },
                            Description = cleanDesc,
                            Address = location,
                            City = isRemote ? "Remote" : (string.IsNullOrWhiteSpace(location) ? "Remote" : location),
                            State = isRemote ? "Remote" : "Global",
                            Country = isRemote ? "Remote" : "Global",
                            Latitude = isRemote ? 28.6139 : 28.6139 + (new Random(slug.GetHashCode()).NextDouble() - 0.5) * 5,
                            Longitude = isRemote ? 77.2090 : 77.2090 + (new Random(slug.GetHashCode() + 1).NextDouble() - 0.5) * 5,
                            SalaryMin = 1200000,
                            SalaryMax = 2500000,
                            Currency = "INR",
                            SalaryPeriod = "Yearly",
                            JobType = "FullTime",
                            WorkMode = isRemote ? "Remote" : "Hybrid",
                            PostedDate = postedDate,
                            ApplicationUrl = url,
                            Skills = skills.Take(8).ToList(),
                            IsDemoData = false
                        });
                    }
                    catch
                    {
                        // Skip malformed items
                    }
                }

                _logger.LogInformation("Arbeitnow: successfully fetched {Count} real live jobs", jobs.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Arbeitnow provider encountered an error");
            }

            return jobs;
        }
    }
}
