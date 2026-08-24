using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;

namespace JobPortal.Core.Interfaces
{
    public interface IJobService
    {
        Task<JobSearchResponse> SearchJobsAsync(JobSearchRequest request, CancellationToken cancellationToken = default);
        Task<JobDto?> GetJobByIdAsync(long id, CancellationToken cancellationToken = default);
        Task<int> SyncJobsFromAllSourcesAsync(CancellationToken cancellationToken = default);
        Task<int> SyncSourceAsync(int sourceId, CancellationToken cancellationToken = default);
        Task<AdminDashboardStatsDto> GetAdminStatsAsync(CancellationToken cancellationToken = default);
        Task<List<JobSource>> GetJobSourcesAsync(CancellationToken cancellationToken = default);
        Task<bool> ToggleSourceStatusAsync(int sourceId, bool isActive, CancellationToken cancellationToken = default);
        Task<List<SyncLog>> GetSyncLogsAsync(int limit = 50, CancellationToken cancellationToken = default);
        Task<bool> SaveJobAsync(string userId, long jobId, CancellationToken cancellationToken = default);
        Task<List<JobDto>> GetSavedJobsAsync(string userId, CancellationToken cancellationToken = default);
    }
}
