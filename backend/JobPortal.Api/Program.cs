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
builder.Services.AddControllers();

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

// Configure Database Connection (MySQL with SQLite local fallback)
string? mySqlConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrEmpty(mySqlConnectionString) && !mySqlConnectionString.Contains("YOUR_MYSQL_PASSWORD"))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        options.UseMySql(mySqlConnectionString, ServerVersion.AutoDetect(mySqlConnectionString));
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

// Register Job Source Providers
builder.Services.AddScoped<IJobSourceProvider, IndeedProvider>();
builder.Services.AddScoped<IJobSourceProvider, LinkedInProvider>();
builder.Services.AddScoped<IJobSourceProvider, NaukriProvider>();
builder.Services.AddScoped<IJobSourceProvider, FounditProvider>();
builder.Services.AddScoped<IJobSourceProvider, InternshalaProvider>();
builder.Services.AddScoped<IJobSourceProvider, GovernmentJobsProvider>();
builder.Services.AddScoped<IJobSourceProvider, CustomJobApiProvider>();

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
