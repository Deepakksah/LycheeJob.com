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
    /// RemoteOK Provider — completely free, no API key needed.
    /// https://remoteok.com/api
    /// Returns 100-300 real remote tech jobs.
    /// </summary>
    public class RemoteOkProvider : IJobSourceProvider
    {
        private readonly HttpClient _http;
        private readonly ILogger<RemoteOkProvider> _logger;

        public string SourceName => "RemoteOK";

        public RemoteOkProvider(HttpClient http, ILogger<RemoteOkProvider> logger)
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
                _http.DefaultRequestHeaders.Add("User-Agent", "LycheeJob/1.0 (job aggregator)");

                var response = await _http.GetAsync("https://remoteok.com/api", cancellationToken);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("RemoteOK API returned {StatusCode}", response.StatusCode);
                    return GetFallbackJobs();
                }

                var json = await response.Content.ReadAsStringAsync(cancellationToken);
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                // First element is a metadata object, skip it
                int skipped = 0;
                foreach (var elem in root.EnumerateArray())
                {
                    if (skipped++ == 0) continue; // skip metadata
                    try
                    {
                        var id = elem.TryGetProperty("id", out var idProp) ? idProp.GetString() ?? "" : "";
                        var title = elem.TryGetProperty("position", out var pos) ? pos.GetString() ?? "Software Engineer" : "Software Engineer";
                        var company = elem.TryGetProperty("company", out var comp) ? comp.GetString() ?? "Company" : "Company";
                        var companyLogo = elem.TryGetProperty("company_logo", out var logo) ? logo.GetString() : null;
                        var url = elem.TryGetProperty("url", out var u) ? u.GetString() ?? "" : "";
                        var description = elem.TryGetProperty("description", out var desc) ? desc.GetString() ?? "" : "";
                        var tagsArr = elem.TryGetProperty("tags", out var tags) ? tags : default;
                        var dateStr = elem.TryGetProperty("date", out var d) ? d.GetString() : null;
                        var salary = elem.TryGetProperty("salary", out var s) ? s.GetString() : null;

                        var skills = new List<string>();
                        if (tagsArr.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var tag in tagsArr.EnumerateArray())
                                if (tag.GetString() is string t && !string.IsNullOrEmpty(t))
                                    skills.Add(t);
                        }

                        DateTime postedDate = DateTime.UtcNow.AddDays(-1);
                        if (!string.IsNullOrEmpty(dateStr) && DateTime.TryParse(dateStr, out var pd))
                            postedDate = pd;

                        jobs.Add(new JobDto
                        {
                            ExternalJobId = $"rok-{id}",
                            SourceName = SourceName,
                            Title = title,
                            Company = new CompanyDto
                            {
                                Name = company,
                                LogoUrl = companyLogo,
                                Industry = "Technology"
                            },
                            Description = string.IsNullOrEmpty(description) ? $"{title} position at {company}. Remote opportunity." : description.Length > 2000 ? description.Substring(0, 2000) : description,
                            City = "Remote",
                            State = "India",
                            Country = "India",
                            Latitude = 28.6139,
                            Longitude = 77.2090,
                            JobType = "FullTime",
                            WorkMode = "Remote",
                            PostedDate = postedDate,
                            ApplicationUrl = url,
                            Skills = skills.Take(8).ToList(),
                            IsDemoData = false
                        });
                    }
                    catch { /* skip malformed entry */ }
                }

                _logger.LogInformation("RemoteOK: fetched {Count} jobs", jobs.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "RemoteOK fetch failed, using fallback");
                return GetFallbackJobs();
            }

            return jobs.Count > 0 ? jobs : GetFallbackJobs();
        }

        private static IEnumerable<JobDto> GetFallbackJobs() => new List<JobDto>
        {
            new JobDto { ExternalJobId = "rok-fb-1", SourceName = "RemoteOK", Title = "Remote Full Stack Developer", Company = new CompanyDto { Name = "GlobalTech Inc", Industry = "Software" }, Description = "Remote full-stack development role with React and Node.js.", City = "Remote", Country = "India", Latitude = 28.6139, Longitude = 77.2090, JobType = "FullTime", WorkMode = "Remote", PostedDate = DateTime.UtcNow.AddDays(-1), ApplicationUrl = "https://remoteok.com", Skills = new List<string> { "React", "Node.js", "TypeScript" }, IsDemoData = true }
        };
    }
}
