using System.Collections.Generic;

namespace JobPortal.Core.DTOs
{
    public class JobSearchResponse
    {
        public bool Success { get; set; } = true;
        public string? Message { get; set; }
        public List<JobDto> Data { get; set; } = new List<JobDto>();
        public PaginationMetadata Pagination { get; set; } = new PaginationMetadata();
    }

    public class PaginationMetadata
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public int Total { get; set; }
        public int TotalPages { get; set; }
    }
}
