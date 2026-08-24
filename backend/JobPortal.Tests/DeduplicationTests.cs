using Xunit;
using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;
using JobPortal.Infrastructure.Services;

namespace JobPortal.Tests
{
    public class DeduplicationTests
    {
        [Fact]
        public void NormalizeTitle_RemovesSpecialCharactersAndCase()
        {
            string raw = "Senior React Developer - (Remote)";
            string normalized = DuplicateDetector.NormalizeTitle(raw);

            Assert.Equal("seniorreactdeveloperremote", normalized);
        }

        [Fact]
        public void IsDuplicate_IdentifiesSameCompanyTitleAndCity()
        {
            var existing = new Job
            {
                Title = "Senior React Developer",
                City = "Gurgaon",
                Company = new Company { Name = "ABC Technologies" }
            };

            var incoming = new JobDto
            {
                Title = "Senior React Developer",
                City = "Gurgaon",
                Company = new CompanyDto { Name = "ABC Technologies" }
            };

            bool isDup = DuplicateDetector.IsDuplicate(existing, incoming);

            Assert.True(isDup);
        }

        [Fact]
        public void IsDuplicate_IdentifiesExactDescriptionHash()
        {
            string desc = "Looking for an experienced Senior React Developer to join our team.";
            string hash = DuplicateDetector.ComputeDescriptionHash(desc);

            var existing = new Job
            {
                Title = "React Dev",
                City = "Delhi",
                Company = new Company { Name = "XYZ Studio" },
                DescriptionHash = hash
            };

            var incoming = new JobDto
            {
                Title = "Frontend Engineer",
                City = "Noida",
                Company = new CompanyDto { Name = "Different Name" },
                Description = desc
            };

            bool isDup = DuplicateDetector.IsDuplicate(existing, incoming);

            Assert.True(isDup);
        }
    }
}
