# 🔧 Choreo Connection Fix - Deployment Instructions

## ✅ Changes Made

### 1. Updated Environment Configuration
**File:** `frontend/.env.production`
- Changed API URL to Choreo connection path
- **New value:** `/choreo-apis/default/research-assistant-api/v1/api/v1`

### 2. Updated Vite Configuration
**File:** `frontend/vite.config.js`
- Added proxy for Choreo path in development
- Proxies `/choreo-apis/...` → `http://localhost:8000/api/v1/...`

---

## 📋 Deployment Steps

### Step 1: Commit and Push Changes

```bash
# Navigate to project root
cd c:\Programming\Agentic-AI_Scrash_Course\Research_With_UB360.ai\Research_With_UB360_ai_webapp

# Check changes
git status

# Add all changes
git add .

# Commit
git commit -m "Fix Choreo connection - use relative path"

# Push to GitHub
git push origin main
```

### Step 2: Update Environment Variable in Choreo

1. **Go to Choreo Console**
2. **Navigate to:** Frontend Component → **Configs & Secrets**
3. **Update or Add:**
   ```
   Name: VITE_API_URL
   Value: /choreo-apis/default/research-assistant-api/v1/api/v1
   ```
4. **Click Save**

**Important:** Make sure there's NO `https://` or domain name - just the path!

### Step 3: Redeploy Frontend

1. In Choreo Console, go to **Frontend Component**
2. Click **Deploy** button
3. Select **Development** environment
4. Wait for build to complete (~3-5 minutes)

---

## 🧪 Testing

### Test 1: Health Check

Once deployed, open browser console (F12) and run:

```javascript
fetch('/choreo-apis/default/research-assistant-api/v1/api/v1/health')
  .then(r => r.json())
  .then(data => console.log('Health check:', data))
  .catch(err => console.error('Error:', err))
```

**Expected Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "services": {
    "vector_store": "operational",
    "llm": "operational"
  }
}
```

### Test 2: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Try uploading a document
4. Look for requests to `/choreo-apis/...`
5. Should see **Status: 200 OK**

### Test 3: Full Functionality

- [ ] Upload a document (PDF/DOCX)
- [ ] Ask a question in chat
- [ ] Get AI response
- [ ] Export conversation
- [ ] Download export file

---

## 🔍 Troubleshooting

### Issue: Still getting 404 errors

**Check:**
1. Environment variable in Choreo is set correctly
2. No typos in the path
3. Backend is running (check backend component status)

**Verify path format:**
```
✅ Correct: /choreo-apis/default/research-assistant-api/v1/api/v1
❌ Wrong: https://xxx.choreoapis.dev/api/v1
❌ Wrong: /choreo-apis/research-assistant-api/v1
```

### Issue: CORS errors

**This means you're using absolute URL instead of relative path.**

**Fix:**
- In Choreo, set `VITE_API_URL` to the relative path (no `https://`)
- Redeploy frontend

### Issue: Connection works but endpoints fail

**Check backend routes:**
1. Go to Backend Component in Choreo
2. Check logs for errors
3. Verify all endpoints use `/api/v1` prefix

### Issue: Works in Choreo but not locally

**For local development:**
1. Make sure backend is running on `http://localhost:8000`
2. The vite proxy will handle the `/choreo-apis` path
3. Or use `.env.local` with: `VITE_API_URL=http://localhost:8000/api/v1`

---

## ✅ Success Checklist

After deployment, verify:

- [ ] No errors in browser console
- [ ] Network tab shows requests to `/choreo-apis/...`
- [ ] Health check returns 200 OK
- [ ] Document upload works
- [ ] Chat functionality works
- [ ] Export works
- [ ] All features functional

---

## 📝 Summary

**What changed:**
- API URL now uses Choreo's internal connection path
- Development proxy configured for local testing
- No more CORS issues!

**The connection flow:**
```
Frontend (Browser)
    ↓ /choreo-apis/default/research-assistant-api/v1/api/v1/...
Choreo Infrastructure (routes internally)
    ↓
Backend Component
    ↓ /api/v1/...
Your FastAPI Application
```

**Next:** Deploy and test! 🚀
