using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;
using JobPortal.Core.Interfaces;
using JobPortal.Infrastructure.Data;

namespace JobPortal.Infrastructure.Services
{
    public class JobService : IJobService
    {
        private readonly AppDbContext _db;
        private readonly IEnumerable<IJobSourceProvider> _sourceProviders;
        private readonly IGeocodingService _geocodingService;
        private readonly ILogger<JobService> _logger;

        public JobService(
            AppDbContext db,
            IEnumerable<IJobSourceProvider> sourceProviders,
            IGeocodingService geocodingService,
            ILogger<JobService> logger)
        {
            _db = db;
            _sourceProviders = sourceProviders;
            _geocodingService = geocodingService;
            _logger = logger;
        }

        public async Task<JobSearchResponse> SearchJobsAsync(JobSearchRequest request, CancellationToken cancellationToken = default)
        {
            // Ensure DB has data
            if (!await _db.Jobs.AnyAsync(cancellationToken))
            {
                await SyncJobsFromAllSourcesAsync(cancellationToken);
            }

            var query = _db.Jobs
                .Include(j => j.Company)
                .Include(j => j.Source)
                .Include(j => j.JobSkills).ThenInclude(js => js.Skill)
                .Where(j => j.IsActive);

            // 1. Keyword search (title, description, company, skill)
            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                string kw = request.Keyword.Trim().ToLower();
                query = query.Where(j =>
                    j.Title.ToLower().Contains(kw) ||
                    j.Description.ToLower().Contains(kw) ||
                    j.Company.Name.ToLower().Contains(kw) ||
                    j.JobSkills.Any(js => js.Skill.Name.ToLower().Contains(kw))
                );
            }

            // 2. City & Multi-City Search
            if (request.Cities != null && request.Cities.Length > 0)
            {
                var cityList = request.Cities.Where(c => !string.IsNullOrWhiteSpace(c)).Select(c => c.Trim().ToLower()).ToList();
                if (cityList.Any())
                {
                    query = query.Where(j => cityList.Contains(j.City.ToLower()));
                }
            }
            else if (!string.IsNullOrWhiteSpace(request.City))
            {
                string c = request.City.Trim().ToLower();
                query = query.Where(j => j.City.ToLower().Contains(c) || j.Address.ToLower().Contains(c));
            }

            // 2.1 State & Multi-State Search
            if (request.States != null && request.States.Length > 0)
            {
                var stateList = request.States.Where(s => !string.IsNullOrWhiteSpace(s)).Select(s => s.Trim().ToLower()).ToList();
                if (stateList.Any())
                {
                    query = query.Where(j => stateList.Contains(j.State.ToLower()));
                }
            }
            else if (!string.IsNullOrWhiteSpace(request.State))
            {
                string s = request.State.Trim().ToLower();
                query = query.Where(j => j.State.ToLower().Contains(s));
            }

            // 3. Map Viewport Bounds Search (North, South, East, West)
            if (request.North.HasValue && request.South.HasValue && request.East.HasValue && request.West.HasValue)
            {
                query = query.Where(j =>
                    j.Latitude.HasValue && j.Longitude.HasValue &&
                    j.Latitude >= request.South.Value && j.Latitude <= request.North.Value &&
                    j.Longitude >= request.West.Value && j.Longitude <= request.East.Value);
            }
            // 4. Radius Search around Lat/Lng
            else if (request.Latitude.HasValue && request.Longitude.HasValue && request.RadiusKm.HasValue && request.RadiusKm.Value > 0)
            {
                double centerLat = request.Latitude.Value;
                double centerLng = request.Longitude.Value;
                double radiusKm = request.RadiusKm.Value;

                // Rough bounding box bounding first for performance
                double latDelta = radiusKm / 111.0;
                double lngDelta = radiusKm / (111.0 * Math.Cos(centerLat * Math.PI / 180.0));

                query = query.Where(j =>
                    j.Latitude.HasValue && j.Longitude.HasValue &&
                    j.Latitude >= centerLat - latDelta && j.Latitude <= centerLat + latDelta &&
                    j.Longitude >= centerLng - lngDelta && j.Longitude <= centerLng + lngDelta);
            }

            // 5. Salary Filter
            if (request.MinSalary.HasValue)
            {
                query = query.Where(j => j.SalaryMax == null || j.SalaryMax >= request.MinSalary.Value);
            }
            if (request.MaxSalary.HasValue)
            {
                query = query.Where(j => j.SalaryMin == null || j.SalaryMin <= request.MaxSalary.Value);
            }

            // 6. Experience Filter
            if (!string.IsNullOrWhiteSpace(request.Experience))
            {
                switch (request.Experience)
                {
                    case "0-1":
                        query = query.Where(j => j.ExperienceMin <= 1);
                        break;
                    case "1-3":
                        query = query.Where(j => j.ExperienceMin <= 3 && j.ExperienceMax >= 1);
                        break;
                    case "3-5":
                        query = query.Where(j => j.ExperienceMin <= 5 && j.ExperienceMax >= 3);
                        break;
                    case "5-10":
                        query = query.Where(j => j.ExperienceMin <= 10 && j.ExperienceMax >= 5);
                        break;
                    case "10+":
                        query = query.Where(j => j.ExperienceMax >= 10 || j.ExperienceMin >= 10);
                        break;
                }
            }

            // 7. Job Types
            if (request.JobTypes != null && request.JobTypes.Length > 0)
            {
                var types = request.JobTypes.Select(t => t.ToLower()).ToList();
                query = query.Where(j => types.Contains(j.JobType.ToLower()));
            }

            // 8. Work Modes
            if (request.WorkModes != null && request.WorkModes.Length > 0)
            {
                var modes = request.WorkModes.Select(m => m.ToLower()).ToList();
                query = query.Where(j => modes.Contains(j.WorkMode.ToLower()));
            }

            // 9. Sources
            if (request.Sources != null && request.Sources.Length > 0)
            {
                var srcList = request.Sources.Select(s => s.ToLower()).ToList();
                query = query.Where(j => srcList.Contains(j.Source.Name.ToLower()));
            }

            // 10. Date Posted
            if (request.PostedWithinDays.HasValue && request.PostedWithinDays.Value > 0)
            {
                var cutoff = DateTime.UtcNow.AddDays(-request.PostedWithinDays.Value);
                query = query.Where(j => j.PostedDate >= cutoff);
            }

            // 11. Interview Availability
            if (request.HasInterviewDate.HasValue && request.HasInterviewDate.Value)
            {
                query = query.Where(j => j.InterviewDate.HasValue);
            }

            int totalCount = await query.CountAsync(cancellationToken);

            // Sorting
            query = request.SortBy?.ToLower() switch
            {
                "newest" => query.OrderByDescending(j => j.PostedDate),
                "oldest" => query.OrderBy(j => j.PostedDate),
                "salary_high" => query.OrderByDescending(j => j.SalaryMax ?? j.SalaryMin ?? 0),
                "salary_low" => query.OrderBy(j => j.SalaryMin ?? j.SalaryMax ?? 0),
                "company" => query.OrderBy(j => j.Company.Name),
                _ => query.OrderByDescending(j => j.PostedDate)
            };

            // Server-side Pagination
            int page = Math.Max(1, request.Page);
            int pageSize = Math.Clamp(request.PageSize, 1, 100);

            var jobs = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            var dtos = jobs.Select(j => MapToDto(j, request.UserLat, request.UserLng)).ToList();

            if (request.SortBy?.ToLower() == "distance" && request.UserLat.HasValue && request.UserLng.HasValue)
            {
                dtos = dtos.OrderBy(d => d.DistanceKm ?? double.MaxValue).ToList();
            }

            return new JobSearchResponse
            {
                Success = true,
                Data = dtos,
                Pagination = new PaginationMetadata
                {
                    Page = page,
                    PageSize = pageSize,
                    Total = totalCount,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                }
            };
        }

        public async Task<JobDto?> GetJobByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            var job = await _db.Jobs
                .Include(j => j.Company)
                .Include(j => j.Source)
                .Include(j => j.JobSkills).ThenInclude(js => js.Skill)
                .FirstOrDefaultAsync(j => j.Id == id, cancellationToken);

            if (job != null) return MapToDto(job);

            var govtJob = await _db.GovtJobs.FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
            if (govtJob != null)
            {
                return new JobDto
                {
                    Id = govtJob.Id,
                    ExternalJobId = govtJob.ExternalJobId,
                    SourceId = 99,
                    SourceName = "GovernmentJobs",
                    Title = govtJob.Title,
                    CompanyId = govtJob.Id,
                    Company = new CompanyDto
                    {
                        Id = govtJob.Id,
                        Name = govtJob.Department,
                        LogoUrl = govtJob.LogoUrl,
                        Website = govtJob.ApplicationUrl,
                        Industry = govtJob.SectorCategory
                    },
                    Description = govtJob.Description,
                    Address = govtJob.Address,
                    City = govtJob.City,
                    State = govtJob.State,
                    Country = govtJob.Country,
                    Latitude = govtJob.Latitude,
                    Longitude = govtJob.Longitude,
                    SalaryMin = govtJob.SalaryMin,
                    SalaryMax = govtJob.SalaryMax,
                    Currency = "INR",
                    SalaryPeriod = "Yearly",
                    JobType = "FullTime",
                    WorkMode = "OnSite",
                    PostedDate = govtJob.PostedDate,
                    ExpiryDate = govtJob.LastDateToApply,
                    InterviewDate = govtJob.ExamDate,
                    InterviewMode = govtJob.SelectionMode,
                    ApplicationUrl = govtJob.ApplicationUrl,
                    OriginalUrl = govtJob.NotificationPdfUrl,
                    Skills = string.IsNullOrEmpty(govtJob.Qualifications) ? new List<string>() : govtJob.Qualifications.Split(',').Select(s => s.Trim()).ToList(),
                    CreatedAt = govtJob.CreatedAt
                };
            }

            return null;
        }

        public async Task<int> SyncJobsFromAllSourcesAsync(CancellationToken cancellationToken = default)
        {
            int totalInserted = 0;
            var activeSources = await _db.JobSources.Where(s => s.IsActive).ToListAsync(cancellationToken);

            if (!activeSources.Any())
            {
                // Ensure default job sources exist in DB
                var sources = new[]
                {
                    new JobSource { Name = "Indeed", SourceType = "OfficialApi", IsActive = true },
                    new JobSource { Name = "LinkedIn", SourceType = "OfficialApi", IsActive = true },
                    new JobSource { Name = "Naukri", SourceType = "PublicFeed", IsActive = true },
                    new JobSource { Name = "Foundit", SourceType = "PublicFeed", IsActive = true },
                    new JobSource { Name = "Internshala", SourceType = "PartnerFeed", IsActive = true },
                    new JobSource { Name = "GovernmentJobs", SourceType = "OfficialApi", IsActive = true },
                    new JobSource { Name = "CustomJobApi", SourceType = "CustomApi", IsActive = true },
                    new JobSource { Name = "Adzuna", SourceType = "OfficialApi", IsActive = true },
                    new JobSource { Name = "RemoteOK", SourceType = "PublicFeed", IsActive = true },
                    new JobSource { Name = "Remotive", SourceType = "PublicFeed", IsActive = true },
                    new JobSource { Name = "Arbeitnow", SourceType = "PublicFeed", IsActive = true },
                    new JobSource { Name = "Jobicy", SourceType = "PublicFeed", IsActive = true },
                    new JobSource { Name = "Google Jobs", SourceType = "OfficialApi", IsActive = true },
                };

                await _db.JobSources.AddRangeAsync(sources, cancellationToken);
                await _db.SaveChangesAsync(cancellationToken);
                activeSources = await _db.JobSources.ToListAsync(cancellationToken);
            }
            else
            {
                // Ensure any newly added providers are inserted into DB
                foreach (var provider in _sourceProviders)
                {
                    if (!activeSources.Any(s => s.Name.Equals(provider.SourceName, StringComparison.OrdinalIgnoreCase)))
                    {
                        var newSource = new JobSource { Name = provider.SourceName, SourceType = "PublicFeed", IsActive = true };
                        await _db.JobSources.AddAsync(newSource, cancellationToken);
                        await _db.SaveChangesAsync(cancellationToken);
                        activeSources.Add(newSource);
                    }
                }
            }

            foreach (var provider in _sourceProviders)
            {
                var dbSource = activeSources.FirstOrDefault(s => s.Name.Equals(provider.SourceName, StringComparison.OrdinalIgnoreCase));
                if (dbSource == null || !dbSource.IsActive) continue;

                var syncLog = new SyncLog
                {
                    SourceId = dbSource.Id,
                    StartedAt = DateTime.UtcNow,
                    Status = "InProgress"
                };
                await _db.SyncLogs.AddAsync(syncLog, cancellationToken);
                await _db.SaveChangesAsync(cancellationToken);

                try
                {
                    var fetchedJobs = (await provider.SearchJobsAsync(new JobSearchRequest(), cancellationToken)).ToList();
                    syncLog.JobsFetched = fetchedJobs.Count;

                    int inserted = 0;
                    int updated = 0;
                    int skipped = 0;

                    var existingJobs = await _db.Jobs
                        .Include(j => j.Company)
                        .Include(j => j.Source)
                        .ToListAsync(cancellationToken);

                    foreach (var dto in fetchedJobs)
                    {
                        var dup = existingJobs.FirstOrDefault(e => DuplicateDetector.IsDuplicate(e, dto));
                        if (dup != null)
                        {
                            dup.DuplicateCount++;
                            dup.UpdatedAt = DateTime.UtcNow;
                            updated++;
                        }
                        else
                        {
                            // Resolve or Create Company
                            var company = await _db.Companies.FirstOrDefaultAsync(c => c.Name == dto.Company.Name, cancellationToken);
                            if (company == null)
                            {
                                company = new Company
                                {
                                    Name = dto.Company.Name,
                                    LogoUrl = dto.Company.LogoUrl,
                                    Website = dto.Company.Website,
                                    Industry = dto.Company.Industry
                                };
                                await _db.Companies.AddAsync(company, cancellationToken);
                                await _db.SaveChangesAsync(cancellationToken);
                            }

                            // Geocode if missing lat/lng
                            if (!dto.Latitude.HasValue || !dto.Longitude.HasValue)
                            {
                                var geo = await _geocodingService.GeocodeAsync(string.IsNullOrEmpty(dto.Address) ? dto.City : dto.Address, cancellationToken);
                                if (geo != null)
                                {
                                    dto.Latitude = geo.Latitude;
                                    dto.Longitude = geo.Longitude;
                                }
                            }

                            var jobEntity = new Job
                            {
                                ExternalJobId = dto.ExternalJobId,
                                SourceId = dbSource.Id,
                                Title = dto.Title,
                                CompanyId = company.Id,
                                Description = dto.Description,
                                Address = dto.Address,
                                City = dto.City,
                                State = dto.State,
                                Country = dto.Country,
                                PostalCode = dto.PostalCode,
                                Latitude = dto.Latitude,
                                Longitude = dto.Longitude,
                                SalaryMin = dto.SalaryMin,
                                SalaryMax = dto.SalaryMax,
                                Currency = dto.Currency,
                                SalaryPeriod = dto.SalaryPeriod,
                                ExperienceMin = dto.ExperienceMin,
                                ExperienceMax = dto.ExperienceMax,
                                JobType = dto.JobType,
                                WorkMode = dto.WorkMode,
                                PostedDate = dto.PostedDate,
                                ContactName = dto.ContactName,
                                ContactPhone = dto.ContactPhone,
                                ContactEmail = dto.ContactEmail,
                                InterviewDate = dto.InterviewDate,
                                InterviewStartTime = dto.InterviewStartTime,
                                InterviewEndTime = dto.InterviewEndTime,
                                InterviewLocation = dto.InterviewLocation,
                                InterviewMode = dto.InterviewMode,
                                InterviewNotes = dto.InterviewNotes,
                                ApplicationUrl = dto.ApplicationUrl,
                                OriginalUrl = dto.OriginalUrl ?? dto.ApplicationUrl,
                                IsActive = true,
                                IsDemoData = dto.IsDemoData,
                                DescriptionHash = DuplicateDetector.ComputeDescriptionHash(dto.Description),
                                DuplicateCount = 1,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow
                            };

                            await _db.Jobs.AddAsync(jobEntity, cancellationToken);
                            await _db.SaveChangesAsync(cancellationToken);

                            // Associate Skills
                            if (dto.Skills != null)
                            {
                                foreach (var skillName in dto.Skills)
                                {
                                    var skill = await _db.Skills.FirstOrDefaultAsync(s => s.Name == skillName, cancellationToken);
                                    if (skill == null)
                                    {
                                        skill = new Skill { Name = skillName };
                                        await _db.Skills.AddAsync(skill, cancellationToken);
                                        await _db.SaveChangesAsync(cancellationToken);
                                    }
                                    await _db.JobSkills.AddAsync(new JobSkill { JobId = jobEntity.Id, SkillId = skill.Id }, cancellationToken);
                                }
                                await _db.SaveChangesAsync(cancellationToken);
                            }

                            existingJobs.Add(jobEntity);
                            inserted++;
                        }
                    }

                    syncLog.JobsInserted = inserted;
                    syncLog.JobsUpdated = updated;
                    syncLog.JobsSkipped = skipped;
                    syncLog.Status = "Success";
                    syncLog.CompletedAt = DateTime.UtcNow;

                    dbSource.LastSyncAt = DateTime.UtcNow;
                    totalInserted += inserted;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed sync for source {SourceName}", provider.SourceName);
                    syncLog.Status = "Failed";
                    syncLog.ErrorMessage = ex.Message;
                    syncLog.CompletedAt = DateTime.UtcNow;
                }

                await _db.SaveChangesAsync(cancellationToken);
            }

            return totalInserted;
        }

        public async Task<int> SyncSourceAsync(int sourceId, CancellationToken cancellationToken = default)
        {
            var source = await _db.JobSources.FindAsync(new object[] { sourceId }, cancellationToken);
            if (source == null) return 0;

            var provider = _sourceProviders.FirstOrDefault(p => p.SourceName.Equals(source.Name, StringComparison.OrdinalIgnoreCase));
            if (provider == null) return 0;

            return await SyncJobsFromAllSourcesAsync(cancellationToken);
        }

        public async Task<AdminDashboardStatsDto> GetAdminStatsAsync(CancellationToken cancellationToken = default)
        {
            int totalJobs = await _db.Jobs.CountAsync(cancellationToken);
            int activeJobs = await _db.Jobs.CountAsync(j => j.IsActive, cancellationToken);
            int newToday = await _db.Jobs.CountAsync(j => j.CreatedAt >= DateTime.UtcNow.Date, cancellationToken);
            int totalCompanies = await _db.Companies.CountAsync(cancellationToken);
            int totalSources = await _db.JobSources.CountAsync(cancellationToken);
            int failedSyncs = await _db.SyncLogs.CountAsync(s => s.Status == "Failed", cancellationToken);
            var lastSync = await _db.SyncLogs.MaxAsync(s => (DateTime?)s.CompletedAt, cancellationToken);

            var jobsByCity = await _db.Jobs.Where(j => j.IsActive)
                .GroupBy(j => j.City)
                .Select(g => new { City = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => string.IsNullOrEmpty(x.City) ? "Unknown" : x.City, x => x.Count, cancellationToken);

            var jobsByIndustry = await _db.Jobs.Where(j => j.IsActive)
                .GroupBy(j => j.Company.Industry ?? "Other")
                .Select(g => new { Industry = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Industry, x => x.Count, cancellationToken);

            var jobsBySource = await _db.Jobs.Where(j => j.IsActive)
                .GroupBy(j => j.Source.Name)
                .Select(g => new { Source = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Source, x => x.Count, cancellationToken);

            var jobsByWorkMode = await _db.Jobs.Where(j => j.IsActive)
                .GroupBy(j => j.WorkMode)
                .Select(g => new { Mode = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Mode, x => x.Count, cancellationToken);

            return new AdminDashboardStatsDto
            {
                TotalJobs = totalJobs,
                ActiveJobs = activeJobs,
                NewJobsToday = newToday,
                TotalCompanies = totalCompanies,
                TotalSources = totalSources,
                FailedSyncs = failedSyncs,
                LastSyncTime = lastSync,
                JobsByCity = jobsByCity,
                JobsByIndustry = jobsByIndustry,
                JobsBySource = jobsBySource,
                JobsByWorkMode = jobsByWorkMode
            };
        }

        public async Task<List<JobSource>> GetJobSourcesAsync(CancellationToken cancellationToken = default)
        {
            return await _db.JobSources.Include(s => s.SyncLogs).ToListAsync(cancellationToken);
        }

        public async Task<bool> ToggleSourceStatusAsync(int sourceId, bool isActive, CancellationToken cancellationToken = default)
        {
            var source = await _db.JobSources.FindAsync(new object[] { sourceId }, cancellationToken);
            if (source == null) return false;

            source.IsActive = isActive;
            await _db.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<List<SyncLog>> GetSyncLogsAsync(int limit = 50, CancellationToken cancellationToken = default)
        {
            return await _db.SyncLogs
                .Include(l => l.Source)
                .OrderByDescending(l => l.StartedAt)
                .Take(limit)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> SaveJobAsync(string userId, long jobId, CancellationToken cancellationToken = default)
        {
            var existing = await _db.SavedJobs.FirstOrDefaultAsync(s => s.UserId == userId && s.JobId == jobId, cancellationToken);
            if (existing != null)
            {
                _db.SavedJobs.Remove(existing);
                await _db.SaveChangesAsync(cancellationToken);
                return false; // Unsaved
            }

            await _db.SavedJobs.AddAsync(new SavedJob { UserId = userId, JobId = jobId }, cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);
            return true; // Saved
        }

        public async Task<List<JobDto>> GetSavedJobsAsync(string userId, CancellationToken cancellationToken = default)
        {
            var saved = await _db.SavedJobs
                .Include(s => s.Job).ThenInclude(j => j.Company)
                .Include(s => s.Job).ThenInclude(j => j.Source)
                .Include(s => s.Job).ThenInclude(j => j.JobSkills).ThenInclude(js => js.Skill)
                .Where(s => s.UserId == userId)
                .Select(s => s.Job)
                .ToListAsync(cancellationToken);

            return saved.Select(j => MapToDto(j)).ToList();
        }

        private static JobDto MapToDto(Job j, double? userLat = null, double? userLng = null)
        {
            double? distance = null;
            if (userLat.HasValue && userLng.HasValue && j.Latitude.HasValue && j.Longitude.HasValue)
            {
                distance = CalculateHaversineDistance(userLat.Value, userLng.Value, j.Latitude.Value, j.Longitude.Value);
            }

            return new JobDto
            {
                Id = j.Id,
                ExternalJobId = j.ExternalJobId,
                SourceId = j.SourceId,
                SourceName = j.Source?.Name ?? "Unknown",
                Title = j.Title,
                CompanyId = j.CompanyId,
                Company = new CompanyDto
                {
                    Id = j.Company?.Id ?? 0,
                    Name = j.Company?.Name ?? "Unknown",
                    LogoUrl = j.Company?.LogoUrl,
                    Website = j.Company?.Website,
                    Industry = j.Company?.Industry,
                    Description = j.Company?.Description
                },
                Description = j.Description,
                Address = j.Address,
                City = j.City,
                State = j.State,
                Country = j.Country,
                PostalCode = j.PostalCode,
                Latitude = j.Latitude,
                Longitude = j.Longitude,
                SalaryMin = j.SalaryMin,
                SalaryMax = j.SalaryMax,
                Currency = j.Currency,
                SalaryPeriod = j.SalaryPeriod,
                ExperienceMin = j.ExperienceMin,
                ExperienceMax = j.ExperienceMax,
                JobType = j.JobType,
                WorkMode = j.WorkMode,
                PostedDate = j.PostedDate,
                ExpiryDate = j.ExpiryDate,
                ContactName = j.ContactName,
                ContactPhone = j.ContactPhone,
                ContactEmail = j.ContactEmail,
                InterviewDate = j.InterviewDate,
                InterviewStartTime = j.InterviewStartTime,
                InterviewEndTime = j.InterviewEndTime,
                InterviewLocation = j.InterviewLocation,
                InterviewMode = j.InterviewMode,
                InterviewNotes = j.InterviewNotes,
                ApplicationUrl = j.ApplicationUrl,
                OriginalUrl = j.OriginalUrl,
                IsActive = j.IsActive,
                IsDemoData = j.IsDemoData,
                DuplicateCount = j.DuplicateCount,
                DistanceKm = distance.HasValue ? Math.Round(distance.Value, 1) : null,
                Skills = j.JobSkills?.Select(js => js.Skill.Name).ToList() ?? new List<string>(),
                CreatedAt = j.CreatedAt
            };
        }

        private static double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var R = 6371; // Radius of the Earth in km
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private static double ToRadians(double deg) => deg * (Math.PI / 180.0);
    }
}
