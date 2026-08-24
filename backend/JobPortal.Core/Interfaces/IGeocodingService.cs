using System.Threading;
using System.Threading.Tasks;
using JobPortal.Core.DTOs;

namespace JobPortal.Core.Interfaces
{
    public interface IGeocodingService
    {
        Task<GeoLocation?> GeocodeAsync(string address, CancellationToken cancellationToken = default);
    }
}
