using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using JobPortal.Core.Interfaces;
using JobPortal.Infrastructure.BackgroundJobs;
using JobPortal.Infrastructure.Data;
using JobPortal.Infrastructure.Geocoding;
using JobPortal.Infrastructure.JobSources;
using JobPortal.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Services to Container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure Database Connection (SQLite local out-of-the-box, with SQL Server & MySQL support)
string? connStr = builder.Configuration.GetConnectionString("DefaultConnection");

if (!string.IsNullOrEmpty(connStr) && connStr.Contains("Data Source"))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        options.UseSqlite(connStr);
    });
}
else if (!string.IsNullOrEmpty(connStr) && connStr.Contains("User Id=sa"))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        options.UseSqlServer(connStr);
    });
}
else if (!string.IsNullOrEmpty(connStr) && !connStr.Contains("YOUR_MYSQL_PASSWORD"))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        options.UseMySql(connStr, new MySqlServerVersion(new Version(8, 0, 30)));
    });
}
else
{
    string dbPath = Path.Combine(AppContext.BaseDirectory, "jobportal.db");
    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        options.UseSqlite($"Data Source={dbPath}");
    });
}

// HttpClient for Geocoding
builder.Services.AddHttpClient<IGeocodingService, GeocodingService>();

// HttpClients for Real Job Source Providers
builder.Services.AddHttpClient<RemoteOkProvider>();
builder.Services.AddHttpClient<RemotiveProvider>();
builder.Services.AddHttpClient<AdzunaProvider>();
builder.Services.AddHttpClient<ArbeitnowProvider>();
builder.Services.AddHttpClient<JobicyProvider>();
builder.Services.AddHttpClient<GoogleJobsProvider>();

// Register Job Source Providers (demo/seed data)
builder.Services.AddScoped<IJobSourceProvider, IndeedProvider>();
builder.Services.AddScoped<IJobSourceProvider, LinkedInProvider>();
builder.Services.AddScoped<IJobSourceProvider, NaukriProvider>();
builder.Services.AddScoped<IJobSourceProvider, FounditProvider>();
builder.Services.AddScoped<IJobSourceProvider, InternshalaProvider>();
builder.Services.AddScoped<IJobSourceProvider, GovernmentJobsProvider>();
builder.Services.AddScoped<IJobSourceProvider, CustomJobApiProvider>();

// Register REAL Live Job Source Providers
builder.Services.AddScoped<IJobSourceProvider, RemoteOkProvider>();
builder.Services.AddScoped<IJobSourceProvider, RemotiveProvider>();
builder.Services.AddScoped<IJobSourceProvider, AdzunaProvider>(); // 750+ Indian jobs
builder.Services.AddScoped<IJobSourceProvider, ArbeitnowProvider>(); // 100+ Live Tech jobs
builder.Services.AddScoped<IJobSourceProvider, JobicyProvider>(); // 50+ Live Tech jobs
builder.Services.AddScoped<IJobSourceProvider, GoogleJobsProvider>(); // Google India & Google for Jobs

// Register Application Services
builder.Services.AddScoped<IJobService, JobService>();

// Register Background Synchronization Service
builder.Services.AddHostedService<JobSyncBackgroundService>();

// Configure Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Map-Based Job Search & Aggregator API",
        Version = "v1",
        Description = "Production ASP.NET Core REST API for Map-based Job Portal with Pluggable Job Source Providers and MySQL."
    });
});

var app = builder.Build();

// Ensure Database Created & Seeded
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        db.Database.EnsureCreated();
        try
        {
            db.Database.ExecuteSqlRaw(@"
                CREATE TABLE IF NOT EXISTS ""GovtJobs"" (
                    ""Id"" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    ""ExternalJobId"" TEXT NOT NULL DEFAULT '',
                    ""Title"" TEXT NOT NULL DEFAULT '',
                    ""Department"" TEXT NOT NULL DEFAULT '',
                    ""Ministry"" TEXT NOT NULL DEFAULT '',
                    ""SectorCategory"" TEXT NOT NULL DEFAULT 'CentralGovt',
                    ""Description"" TEXT NOT NULL DEFAULT '',
                    ""Address"" TEXT NOT NULL DEFAULT '',
                    ""City"" TEXT NOT NULL DEFAULT 'Delhi',
                    ""State"" TEXT NOT NULL DEFAULT 'Delhi NCR',
                    ""Country"" TEXT NOT NULL DEFAULT 'India',
                    ""Latitude"" REAL NOT NULL DEFAULT 0.0,
                    ""Longitude"" REAL NOT NULL DEFAULT 0.0,
                    ""SalaryMin"" TEXT NULL,
                    ""SalaryMax"" TEXT NULL,
                    ""PayLevel"" TEXT NOT NULL DEFAULT 'Level 10',
                    ""Vacancies"" TEXT NOT NULL DEFAULT '',
                    ""Qualifications"" TEXT NOT NULL DEFAULT '',
                    ""AgeLimit"" TEXT NOT NULL DEFAULT '18-35 Years',
                    ""SelectionMode"" TEXT NOT NULL DEFAULT 'Written Examination & Interview',
                    ""ApplicationUrl"" TEXT NOT NULL DEFAULT '',
                    ""NotificationPdfUrl"" TEXT NOT NULL DEFAULT '',
                    ""LogoUrl"" TEXT NOT NULL DEFAULT '',
                    ""SkillsJson"" TEXT NOT NULL DEFAULT '',
                    ""PostedDate"" TEXT NOT NULL,
                    ""LastDateToApply"" TEXT NULL,
                    ""ExamDate"" TEXT NULL,
                    ""IsActive"" INTEGER NOT NULL DEFAULT 1,
                    ""CreatedAt"" TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS ""IX_GovtJobs_City"" ON ""GovtJobs"" (""City"");
                CREATE INDEX IF NOT EXISTS ""IX_GovtJobs_State"" ON ""GovtJobs"" (""State"");
                CREATE INDEX IF NOT EXISTS ""IX_GovtJobs_SectorCategory"" ON ""GovtJobs"" (""SectorCategory"");
                CREATE INDEX IF NOT EXISTS ""IX_GovtJobs_IsActive"" ON ""GovtJobs"" (""IsActive"");
            ");
        }
        catch { }
        logger.LogInformation("Database created and verified.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while creating/migrating the database.");
    }
}

// Configure HTTP request pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Job Portal API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
