# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder
WORKDIR /src

# Copy project files
COPY ["backend/JobPortal.Api/JobPortal.Api.csproj", "JobPortal.Api/"]
COPY ["backend/JobPortal.Core/JobPortal.Core.csproj", "JobPortal.Core/"]
COPY ["backend/JobPortal.Infrastructure/JobPortal.Infrastructure.csproj", "JobPortal.Infrastructure/"]
COPY ["backend/JobPortal.Tests/JobPortal.Tests.csproj", "JobPortal.Tests/"]

# Restore dependencies
RUN dotnet restore "JobPortal.Api/JobPortal.Api.csproj"

# Copy source code
COPY . .

# Build application
RUN dotnet build "backend/JobPortal.Api/JobPortal.Api.csproj" -c Release -o /app/build

# Publish stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS publish
WORKDIR /src
COPY --from=builder /app/build .
RUN dotnet publish "JobPortal.Api/JobPortal.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port
EXPOSE 8080

# Set environment variables for production
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "JobPortal.Api.dll"]