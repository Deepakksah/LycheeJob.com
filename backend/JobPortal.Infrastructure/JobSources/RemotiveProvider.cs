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
    /// Remotive Provider — completely free, no API key needed.
    /// https://remotive.com/api/remote-jobs
    /// Returns 100-500 real remote tech jobs with categories.
    /// </summary>
    public class RemotiveProvider : IJobSourceProvider
    {
        private readonly HttpClient _http;
        private readonly ILogger<RemotiveProvider> _logger;

        public string SourceName => "Remotive";

        public RemotiveProvider(HttpClient http, ILogger<RemotiveProvider> logger)
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
                _http.DefaultRequestHeaders.Add("User-Agent", "LycheeJob/1.0");

                // Fetch software dev + devops + product categories
                var categories = new[] { "software-dev", "devops-sysadmin", "product", "data", "design", "finance-legal" };
                foreach (var cat in categories)
                {
                    try
                    {
                        var response = await _http.GetAsync($"https://remotive.com/api/remote-jobs?category={cat}&limit=50", cancellationToken);
                        if (!response.IsSuccessStatusCode) continue;

                        var json = await response.Content.ReadAsStringAsync(cancellationToken);
                        using var doc = JsonDocument.Parse(json);

                        if (!doc.RootElement.TryGetProperty("jobs", out var jobsArr)) continue;

                        foreach (var elem in jobsArr.EnumerateArray())
                        {
                            try
                            {
                                var id = elem.TryGetProperty("id", out var idP) ? idP.GetInt32().ToString() : "";
                                var title = elem.TryGetProperty("title", out var t) ? t.GetString() ?? "" : "";
                                var companyName = elem.TryGetProperty("company_name", out var cn) ? cn.GetString() ?? "" : "";
                                var companyLogo = elem.TryGetProperty("company_logo", out var cl) ? cl.GetString() : null;
                                var description = elem.TryGetProperty("description", out var d) ? d.GetString() ?? "" : "";
                                var url = elem.TryGetProperty("url", out var u) ? u.GetString() ?? "" : "";
                                var jobType = elem.TryGetProperty("job_type", out var jt) ? jt.GetString() ?? "FullTime" : "FullTime";
                                var salary = elem.TryGetProperty("salary", out var s) ? s.GetString() : null;
                                var dateStr = elem.TryGetProperty("publication_date", out var pd) ? pd.GetString() : null;
                                var tagsStr = elem.TryGetProperty("tags", out var tags) ? tags.GetString() ?? "" : "";

                                if (string.IsNullOrEmpty(title) || string.IsNullOrEmpty(companyName)) continue;
                                if (jobs.Any(j => j.ExternalJobId == $"rem-{id}")) continue;

                                DateTime postedDate = DateTime.UtcNow.AddDays(-2);
                                if (!string.IsNullOrEmpty(dateStr) && DateTime.TryParse(dateStr, out var parsedDate))
                                    postedDate = parsedDate;

                                var skills = tagsStr.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                    .Select(s => s.Trim()).Take(6).ToList();

                                // Parse salary range
                                long? salaryMin = null, salaryMax = null;
                                if (!string.IsNullOrEmpty(salary))
                                {
                                    var nums = System.Text.RegularExpressions.Regex.Matches(salary, @"\d+");
                                    if (nums.Count >= 2) { salaryMin = long.Parse(nums[0].Value) * 100000; salaryMax = long.Parse(nums[1].Value) * 100000; }
                                    else if (nums.Count == 1) { salaryMin = long.Parse(nums[0].Value) * 100000; }
                                }

                                jobs.Add(new JobDto
                                {
                                    ExternalJobId = $"rem-{id}",
                                    SourceName = SourceName,
                                    Title = title,
                                    Company = new CompanyDto
                                    {
                                        Name = companyName,
                                        LogoUrl = companyLogo,
                                        Industry = MapCategoryToIndustry(cat)
                                    },
                                    Description = description.Length > 2000 ? description.Substring(0, 2000) + "..." : description,
                                    City = "Remote",
                                    State = "India",
                                    Country = "India",
                                    Latitude = 20.5937 + (new Random(id.GetHashCode()).NextDouble() - 0.5) * 10,
                                    Longitude = 78.9629 + (new Random(id.GetHashCode() + 1).NextDouble() - 0.5) * 10,
                                    SalaryMin = salaryMin,
                                    SalaryMax = salaryMax,
                                    Currency = "INR",
                                    SalaryPeriod = "Yearly",
                                    JobType = "FullTime",
                                    WorkMode = "Remote",
                                    PostedDate = postedDate,
                                    ApplicationUrl = url,
                                    Skills = skills,
                                    IsDemoData = false
                                });
                            }
                            catch { /* skip malformed entry */ }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Remotive category {Cat} failed", cat);
                    }
                }

                _logger.LogInformation("Remotive: fetched {Count} jobs", jobs.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Remotive provider failed");
            }

            return jobs;
        }

        private static string MapCategoryToIndustry(string cat) => cat switch
        {
            "software-dev" => "Software Engineering",
            "devops-sysadmin" => "DevOps & Cloud",
            "product" => "Product Management",
            "data" => "Data & Analytics",
            "design" => "UI/UX Design",
            "finance-legal" => "Finance & Legal",
            _ => "Technology"
        };
    }
}
