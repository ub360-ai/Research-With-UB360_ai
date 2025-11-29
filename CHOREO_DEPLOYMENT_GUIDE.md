# 🚀 Choreo Deployment Guide - Research Assistant

Complete step-by-step guide to deploy Research Assistant to Choreo platform.

---

## Prerequisites

- [x] GitHub account
- [x] Choreo account (sign up at https://console.choreo.dev)
- [x] Google Gemini API key
- [x] Code pushed to GitHub repository

---

## Phase 4: Choreo Deployment

### Step 1: Prepare GitHub Repository

```bash
# 1. Ensure all changes are committed
git status

# 2. Add all files
git add .

# 3. Commit
git commit -m "Prepare for Choreo deployment - Phases 2 & 3 complete"

# 4. Push to GitHub
git push origin main
```

**Verify:** Check GitHub to ensure all files are pushed.

---

### Step 2: Create Choreo Account

1. Go to https://console.choreo.dev
2. Click **"Sign Up"** or **"Sign In"**
3. Choose **"Sign in with GitHub"**
4. Authorize Choreo to access your GitHub account
5. Complete profile setup

---

### Step 3: Create Organization & Project

1. **Create Organization:**
   - Click **"Create Organization"**
   - Name: `UB360-Research` (or your preference)
   - Click **"Create"**

2. **Create Project:**
   - Click **"Create Project"**
   - Name: `Research Assistant`
   - Description: `Privacy-first AI research assistant for students`
   - Click **"Create"**

---

### Step 4: Deploy Backend Service

#### 4.1 Create Service Component

1. In your project, click **"Create"** → **"Service"**
2. **Component Details:**
   - Name: `research-assistant-api`
   - Description: `FastAPI backend with RAG engine`
3. Click **"Next"**

#### 4.2 Connect GitHub Repository

1. **Authorize GitHub** (if not already done)
2. **Select Repository:**
   - Organization: Your GitHub username
   - Repository: `Research_With_UB360_ai_webapp`
   - Branch: `main`
3. **Component Path:**
   - Buildpack: `Dockerfile`
   - Dockerfile Path: `backend/Dockerfile`
   - Docker Context: `backend`
4. Click **"Create"**

#### 4.3 Configure Build

Choreo will auto-detect the Dockerfile. Verify:
- **Port:** 8080
- **Health Check:** `/api/v1/health`

#### 4.4 Set Environment Variables

Go to **"Configs & Secrets"** → **"Secrets"**:

| Name | Value | Type |
|------|-------|------|
| `GOOGLE_API_KEY` | `your_api_key_here` | Secret |
| `GEMINI_MODEL` | `gemini-2.0-flash` | Config |
| `GEMINI_TEMPERATURE` | `0.7` | Config |
| `EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | Config |
| `FRONTEND_URL` | *(leave empty for now)* | Config |
| `CHOREO_ENV` | `production` | Config |
| `BRAND_NAME` | `UB360.ai` | Config |
| `BRAND_HANDLE` | `@ub360_ai` | Config |
| `MAX_FILE_SIZE_MB` | `50` | Config |

#### 4.5 Deploy Backend

1. Click **"Deploy"**
2. Select **"Development"** environment
3. Wait for build (~5-10 minutes)
4. **Note the generated URL** (e.g., `https://research-assistant-api-xxx.choreoapis.dev`)

#### 4.6 Test Backend

```bash
# Test health check
curl https://your-backend-url.choreoapis.dev/api/v1/health

# Expected response:
{
  "status": "healthy",
  "version": "1.0.0",
  "services": {
    "vector_store": "operational",
    "llm": "operational"
  }
}
```

---

### Step 5: Deploy Frontend Web Application

#### 5.1 Create Web Application Component

1. In your project, click **"Create"** → **"Web Application"**
2. **Component Details:**
   - Name: `research-assistant-frontend`
   - Description: `React frontend for research assistant`
3. Click **"Next"**

#### 5.2 Connect GitHub Repository

1. **Select Repository:**
   - Repository: `Research_With_UB360_ai_webapp`
   - Branch: `main`
2. **Component Path:**
   - Buildpack: `Node.js`
   - Build Path: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node Version: `18`
3. Click **"Create"**

#### 5.3 Set Environment Variables

Go to **"Configs & Secrets"** → **"Config"**:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend-url.choreoapis.dev/api/v1` |
| `VITE_APP_NAME` | `Research with UB360.ai` |
| `VITE_APP_VERSION` | `1.0.0` |
| `VITE_BRAND_NAME` | `UB360.ai` |
| `VITE_BRAND_HANDLE` | `@ub360_ai` |
| `VITE_ENABLE_ANALYTICS` | `false` |
| `VITE_ENABLE_DEBUG` | `false` |

**Important:** Replace `your-backend-url` with the actual backend URL from Step 4.5!

#### 5.4 Deploy Frontend

1. Click **"Deploy"**
2. Select **"Development"** environment
3. Wait for build (~3-5 minutes)
4. **Note the generated URL** (e.g., `https://research-assistant-frontend-xxx.choreoapis.dev`)

---

### Step 6: Update Backend CORS

1. Go back to **Backend Component**
2. Navigate to **"Configs & Secrets"**
3. Update `FRONTEND_URL`:
   - Value: `https://your-frontend-url.choreoapis.dev`
4. Click **"Save"**
5. **Redeploy** the backend

---

### Step 7: Test Complete Application

1. **Open Frontend URL** in browser
2. **Test Document Upload:**
   - Upload a PDF or DOCX file
   - Verify upload success
3. **Test Chat:**
   - Ask a question about the document
   - Verify AI response
4. **Test Export:**
   - Export conversation as PDF
   - Verify download works

---

## Troubleshooting

### Backend Build Fails

**Issue:** Docker build timeout or memory error

**Solution:**
```yaml
# Update .choreo/component.yaml
resources:
  requests:
    memory: "4Gi"  # Increase from 2Gi
```

### Frontend Build Fails

**Issue:** npm install timeout

**Solution:**
```bash
# Add to package.json
"engines": {
  "node": "18.x",
  "npm": "9.x"
}
```

### CORS Errors

**Issue:** Frontend can't connect to backend

**Solution:**
1. Verify `FRONTEND_URL` in backend config
2. Check backend logs for CORS errors
3. Ensure both components are deployed

### Rate Limiting Issues

**Issue:** Getting 429 errors

**Solution:**
- Wait 60 seconds between requests
- Check rate limiter configuration
- Increase limit if needed (in `rate_limiter.py`)

---

## Monitoring & Logs

### View Logs

1. Go to component
2. Click **"Observability"** → **"Logs"**
3. Filter by time range
4. Search for errors

### View Metrics

1. Click **"Observability"** → **"Metrics"**
2. Monitor:
   - CPU usage
   - Memory usage
   - Request count
   - Error rate

### Set Up Alerts

1. Click **"Observability"** → **"Alerts"**
2. Create alert for:
   - High error rate (>5%)
   - High memory usage (>80%)
   - Service downtime

---

## Production Deployment

Once tested in Development:

1. Go to component
2. Click **"Promote"**
3. Select **"Production"** environment
4. Review changes
5. Click **"Promote"**
6. Update DNS/domain (if using custom domain)

---

## Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads successfully
- [ ] Document upload works
- [ ] Chat functionality works
- [ ] Export features work
- [ ] Privacy notice displays
- [ ] Data cleanup scheduler running
- [ ] Logs show no errors
- [ ] Metrics look healthy
- [ ] Alerts configured

---

## Success! 🎉

Your Research Assistant is now live on Choreo!

**URLs:**
- Backend: `https://your-backend.choreoapis.dev`
- Frontend: `https://your-frontend.choreoapis.dev`

**Features:**
- ✅ 100GB storage
- ✅ 16GB RAM
- ✅ Auto-scaling
- ✅ HTTPS by default
- ✅ $0 monthly cost

**Share with the world!** 🚀
