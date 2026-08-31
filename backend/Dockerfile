# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["JobPortal.Api/JobPortal.Api.csproj", "JobPortal.Api/"]
COPY ["JobPortal.Core/JobPortal.Core.csproj", "JobPortal.Core/"]
COPY ["JobPortal.Infrastructure/JobPortal.Infrastructure.csproj", "JobPortal.Infrastructure/"]

RUN dotnet restore "JobPortal.Api/JobPortal.Api.csproj"

# Copy remaining source files and publish
COPY . .
WORKDIR "/src/JobPortal.Api"
RUN dotnet publish "JobPortal.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port (Railway automatically sets PORT env var)
ENV ASPNETCORE_HTTP_PORTS=8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

ENTRYPOINT ["dotnet", "JobPortal.Api.dll"]
