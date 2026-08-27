# 🚀 LycheeJob.com - Deployment Guide (Vercel + Railway)

## Overview
- **Frontend**: Next.js 14 → **Vercel** (Free tier included)
- **Backend**: ASP.NET Core 8 → **Railway** (Free tier: $5/month credit)
- **Database**: MySQL 8.0 → **Railway** (Shared free database)

---

## 📋 PART 1: Railway Backend Deployment

### Step 1: Create Railway Account
1. Go to **https://railway.app**
2. Sign up with **GitHub** (easier authentication)
3. Create a new **Team** (free tier available)

### Step 2: Add Database (MySQL)
1. In Railway Dashboard → **New Project** → **Add Service** → **Database** → **MySQL**
2. Railway will provide:
   ```
   DATABASE_URL = mysql://user:pass@host:3306/railway
   ```
   - Save this for later

### Step 3: Deploy Backend
1. **New Project** → **Deploy from GitHub repo**
2. Select **Deepakksah/LycheeJob.com**
3. Select **Deploy from Github**
4. Choose branch: **main**
5. Railway auto-detects the Dockerfile ✅

### Step 4: Set Environment Variables
In Railway **Variables** tab:

```env
# Database Connection (from Railway MySQL service)
DATABASE_URL=mysql://user:password@host:3306/railway

# Database using connection string format
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
PORT=8080

# Optional - Add your API keys
GoogleMaps__ApiKey=YOUR_GOOGLE_MAPS_API_KEY
Adzuna__AppId=4408147e
Adzuna__AppKey=e892f12d56c66dd08a67f8db9c55f902
```

### Step 5: Verify Backend Deployment
- Go to **Railway Dashboard** → **Deployments**
- Wait for build to complete (3-5 minutes)
- Railway gives you a URL: `https://your-app-prod.up.railway.app`
- Test API: Visit `https://your-app-prod.up.railway.app/swagger`

✅ **Backend is LIVE!**

---

## 🎨 PART 2: Vercel Frontend Deployment

### Step 1: Create Vercel Account
1. Go to **https://vercel.com**
2. Sign up with **GitHub**

### Step 2: Import Project
1. **Add New Project** → **Import Git Repository**
2. Select **Deepakksah/LycheeJob.com**
3. Vercel auto-detects Next.js ✅

### Step 3: Configure Build Settings
In **Project Settings**:
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Step 4: Set Environment Variables
In **Environment Variables** tab:

```env
NEXT_PUBLIC_API_URL=https://your-app-prod.up.railway.app/api
```

**IMPORTANT**: Replace `your-app-prod` with your actual Railway URL!

### Step 5: Deploy
1. Click **Deploy** button
2. Wait for build (2-3 minutes)
3. Vercel gives you: `https://your-app.vercel.app`

✅ **Frontend is LIVE!**

---

## 🔗 Connect Frontend ↔ Backend

### Update Frontend API Client
Edit `frontend/src/services/api.ts` (or your API service file):

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

✅ Already configured in `next.config.js` & `vercel.json`

---

## 📡 Update Backend for Production CORS

The `Program.cs` already has:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

For more restrictive CORS (recommended):
```csharp
options.AddPolicy("AllowFrontend", policy =>
{
    policy
        .WithOrigins("https://your-app.vercel.app")
        .AllowAnyHeader()
        .AllowAnyMethod();
});
```

Then use: `app.UseCors("AllowFrontend");`

---

## 🗄️ Database Migration (MySQL on Railway)

### Option 1: Automatic (EF Core)
Railway will auto-run migrations if you have them in your code.

### Option 2: Manual SSH
```bash
# SSH into Railway container
railway run bash

# Run migrations
dotnet ef database update
```

---

## ✅ Deployment Checklist

- [ ] Railway MySQL database created
- [ ] Railway backend deployed successfully
- [ ] Backend Swagger accessible: `https://your-app-prod.up.railway.app/swagger`
- [ ] Vercel account created
- [ ] Frontend imported and deployed
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] Frontend loads without API errors
- [ ] Can search jobs from the map
- [ ] API calls succeed (check browser DevTools)

---

## 🔧 Troubleshooting

### Backend won't build
- Check Dockerfile syntax
- Ensure all `.csproj` paths are correct
- View Railway build logs for errors

### Frontend shows "API connection failed"
- Verify `NEXT_PUBLIC_API_URL` in Vercel Settings
- Check that Railway backend is running
- Test backend URL directly in browser

### Database connection errors
- Verify `DATABASE_URL` environment variable
- Ensure MySQL service is running in Railway
- Check credentials are correct

### CORS errors in browser
- Backend CORS policy may be too restrictive
- Check `Program.cs` CORS configuration
- Ensure frontend URL is whitelisted

---

## 🌐 Live URLs After Deployment

| Service | URL |
|---------|-----|
| **Frontend** | `https://your-app.vercel.app` |
| **Backend API** | `https://your-app-prod.up.railway.app` |
| **Swagger Docs** | `https://your-app-prod.up.railway.app/swagger` |

---

## 📚 Useful Links

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deploy**: https://nextjs.org/learn/basics/deploying-nextjs-app
- **.NET on Railway**: https://docs.railway.app/guides/deployments/dotnet

---

## 🚀 Next Steps

1. ✅ Deployment files are now in your repo
2. Follow PART 1 & 2 above to deploy
3. Share your live URLs with the world! 🌍
4. Monitor Railway & Vercel dashboards for logs/errors
5. Set up GitHub Actions for auto-deployment (optional)

---

**Questions?** Check Railway/Vercel documentation or GitHub issues.