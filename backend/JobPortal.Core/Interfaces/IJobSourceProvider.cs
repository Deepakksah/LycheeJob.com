using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using JobPortal.Core.DTOs;

namespace JobPortal.Core.Interfaces
{
    public interface IJobSourceProvider
    {
        string SourceName { get; }
        Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchRequest request, CancellationToken cancellationToken = default);
    }
}
