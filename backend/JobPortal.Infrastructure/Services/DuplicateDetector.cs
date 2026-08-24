using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using JobPortal.Core.DTOs;
using JobPortal.Core.Entities;

namespace JobPortal.Infrastructure.Services
{
    public static class DuplicateDetector
    {
        public static string ComputeDescriptionHash(string description)
        {
            if (string.IsNullOrWhiteSpace(description)) return string.Empty;
            string clean = Regex.Replace(description.ToLowerInvariant(), @"\s+", " ").Trim();
            using var sha256 = SHA256.Create();
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(clean));
            return Convert.ToBase64String(bytes);
        }

        public static string NormalizeTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title)) return string.Empty;
            return Regex.Replace(title.ToLowerInvariant(), @"[^a-z0-9]", "");
        }

        public static bool IsDuplicate(Job existingJob, JobDto incoming)
        {
            // 1. Same External Job ID and Source
            if (!string.IsNullOrEmpty(incoming.ExternalJobId) &&
                existingJob.ExternalJobId == incoming.ExternalJobId &&
                existingJob.Source.Name.Equals(incoming.SourceName, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            // 2. Same Title, Company, City
            string existingNormTitle = NormalizeTitle(existingJob.Title);
            string incomingNormTitle = NormalizeTitle(incoming.Title);

            string existingCompany = (existingJob.Company?.Name ?? "").ToLowerInvariant().Trim();
            string incomingCompany = (incoming.Company?.Name ?? "").ToLowerInvariant().Trim();

            string existingCity = (existingJob.City ?? "").ToLowerInvariant().Trim();
            string incomingCity = (incoming.City ?? "").ToLowerInvariant().Trim();

            if (existingNormTitle == incomingNormTitle &&
                existingCompany == incomingCompany &&
                existingCity == incomingCity)
            {
                return true;
            }

            // 3. Exact Description Hash Match
            if (!string.IsNullOrEmpty(existingJob.DescriptionHash))
            {
                string incomingHash = ComputeDescriptionHash(incoming.Description);
                if (existingJob.DescriptionHash == incomingHash)
                {
                    return true;
                }
            }

            return false;
        }
    }
}
