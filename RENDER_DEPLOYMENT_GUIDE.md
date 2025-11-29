# 🚀 Render Deployment Guide - Research Assistant

## Privacy-First Research Tool - $0 Budget Deployment

---

## Prerequisites

✅ GitHub account
✅ Render.com account (free)
✅ Google API Key (Gemini)
✅ Project pushed to GitHub

---

## Quick Start (5 Steps)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment with privacy features"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `research-assistant-api`
   - **Region:** Oregon (Free)
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && gunicorn main:app --bind 0.0.0.0:$PORT --workers 1 --worker-class uvicorn.workers.UvicornWorker --timeout 120`
   - **Plan:** Free

4. Add Environment Variables:
   ```
   GOOGLE_API_KEY = your_google_api_key_here
   GEMINI_MODEL = gemini-1.5-flash
   GEMINI_TEMPERATURE = 0.7
   EMBEDDING_MODEL = all-MiniLM-L6-v2
   CORS_ORIGINS = https://research-assistant-frontend.onrender.com,http://localhost:5173
   BRAND_NAME = UB360.ai
   BRAND_HANDLE = @ub360_ai
   BRAND_TAGLINE = Your AI Research Assistant
   BRAND_MESSAGE = Follow @ub360_ai for more AI tools
   BRAND_WATERMARK = Powered by UB360.ai
   BRAND_PLATFORM = X (Twitter)
   BRAND_FILENAME_SUFFIX = _UB360ai
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (~5-10 minutes)
7. Copy the service URL (e.g., `https://research-assistant-api.onrender.com`)

### Step 4: Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect same GitHub repository
3. Configure:
   - **Name:** `research-assistant-frontend`
   - **Branch:** `main`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`

4. Add Environment Variable:
   ```
   VITE_API_URL = https://research-assistant-api.onrender.com/api/v1
   ```
   (Replace with your actual backend URL from Step 3)

5. Click **"Create Static Site"**
6. Wait for deployment (~5-10 minutes)

### Step 5: Test Your Deployment

1. Visit your frontend URL (e.g., `https://research-assistant-frontend.onrender.com`)
2. Upload a test document
3. Ask a question
4. Export chat history
5. ✅ Success!

---

## Important Notes

### 🔒 Privacy Features

- **Auto-Delete:** Documents and chats deleted after 48 hours
- **No Tracking:** No analytics or user tracking
- **Local Processing:** All data stays on Render servers
- **Export First:** Users should export important conversations

### ⚡ Free Tier Limitations

- **Cold Starts:** Services sleep after 15 minutes of inactivity
  - First request after sleep takes ~30 seconds
  - Subsequent requests are fast
- **750 Hours/Month:** Enough for 24/7 operation
- **512MB RAM:** Sufficient for most documents
- **No Persistent Disk:** Data cleared on restart (by design for privacy)

### 🔧 Troubleshooting

**Backend won't start:**
- Check environment variables are set correctly
- Verify GOOGLE_API_KEY is valid
- Check build logs for errors

**Frontend can't connect to backend:**
- Verify VITE_API_URL matches backend URL
- Check CORS_ORIGINS includes frontend URL
- Wait for backend to wake up (cold start)

**Documents not uploading:**
- Check file size (<50MB)
- Verify file type (PDF, DOCX, TXT, MD)
- Check backend logs

---

## Monitoring

### Check Service Status

1. Go to Render Dashboard
2. Click on service name
3. View:
   - **Logs:** Real-time application logs
   - **Metrics:** CPU, Memory usage
   - **Events:** Deployment history

### View Cleanup Logs

Backend logs will show:
```
✅ Data cleanup scheduler started (runs every 6 hours)
🔒 Privacy: Data deleted after 48 hours
🗑️  Deleted old document: example.pdf
✅ Cleanup completed at 2025-01-29 12:00:00
```

---

## Updating Your Deployment

### Update Code

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render will automatically redeploy both services!

### Update Environment Variables

1. Go to service in Render Dashboard
2. Click **"Environment"**
3. Update variables
4. Click **"Save Changes"**
5. Service will restart automatically

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Backend Web Service | $0 (Free tier) |
| Frontend Static Site | $0 (Free tier) |
| **Total** | **$0/month** |

---

## Next Steps

1. ✅ Share with students/researchers
2. ✅ Monitor usage and performance
3. ✅ Collect feedback
4. ✅ Consider upgrading if needed

---

## Support

**Issues?**
- Check Render logs
- Review environment variables
- Test locally first

**Need Help?**
- Render Docs: https://render.com/docs
- Community: https://community.render.com

---

**Your privacy-first research assistant is now live!** 🎉

Students can now:
- Upload documents securely
- Chat with AI about their research
- Export conversations
- Rest assured their data is private (auto-deleted after 48h)
