# 🔧 Choreo File Mount Configuration - Deployment Guide

## ✅ Changes Made

### 1. Created Config File
**File:** `frontend/public/config.js`
```javascript
window.configs = {
  VITE_API_URL: "/choreo-apis/default/research-assistant-api/v1/api/v1"
}
```

### 2. Updated HTML to Load Config
**File:** `frontend/index.html`
- Added `<script src="/config.js"></script>` before React app

### 3. Updated API Client
**File:** `frontend/src/api/client.js`
- Reads from `window.configs` (Choreo File Mount)
- Falls back to environment variables
- Falls back to localhost for development

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
git commit -m "Add Choreo File Mount configuration"

# Push to GitHub
git push origin main
```

### Step 2: Configure File Mount in Choreo

1. **Go to Choreo Console**
2. **Navigate to:** Frontend Component → **Configs & Secrets**
3. **Click on "File Mount" tab** (as shown in your screenshot)
4. **Add File Mount:**
   ```
   Configuration File Name: /config.js
   ```
5. **In the content area, paste:**
   ```javascript
   window.configs = {
     VITE_API_URL: "/choreo-apis/default/research-assistant-api/v1/api/v1"
   }
   ```
6. **Click Save**

**Important:** The path must be `/config.js` (with leading slash)

### Step 3: Redeploy Frontend

1. In Choreo Console, go to **Frontend Component**
2. Click **Deploy** button
3. Select **Development** environment
4. Wait for build to complete (~3-5 minutes)

---

## 🧪 Testing

### Test 1: Check Config Loaded

Once deployed, open browser console (F12) and run:

```javascript
console.log('Config:', window.configs)
```

**Expected Output:**
```javascript
{
  VITE_API_URL: "/choreo-apis/default/research-assistant-api/v1/api/v1"
}
```

### Test 2: Health Check

```javascript
fetch('/choreo-apis/default/research-assistant-api/v1/api/v1/health')
  .then(r => r.json())
  .then(data => console.log('Health:', data))
```

**Expected Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### Test 3: Full Functionality

- [ ] Upload a document
- [ ] Ask a question
- [ ] Get AI response
- [ ] Export conversation

---

## 🔍 Troubleshooting

### Issue: window.configs is undefined

**Cause:** File Mount not configured or wrong path

**Fix:**
1. Check File Mount path is `/config.js` (not `config.js`)
2. Verify content is valid JavaScript
3. Redeploy frontend

### Issue: Still getting 404 errors

**Check:**
1. Browser console shows correct API URL
2. Network tab shows requests to `/choreo-apis/...`
3. Backend component is running

### Issue: Config not updating

**Fix:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check File Mount content in Choreo

---

## 📝 File Mount Content Template

Copy this exactly into Choreo File Mount:

```javascript
window.configs = {
  VITE_API_URL: "/choreo-apis/default/research-assistant-api/v1/api/v1"
}
```

**Notes:**
- Must be valid JavaScript
- Must set `window.configs` object
- Path must match your connection URL
- No trailing slash on URL

---

## ✅ Success Checklist

- [ ] `config.js` created in `frontend/public/`
- [ ] `index.html` loads config.js
- [ ] `client.js` reads from window.configs
- [ ] Code committed and pushed
- [ ] File Mount configured in Choreo
- [ ] Frontend redeployed
- [ ] `window.configs` shows in browser console
- [ ] Health check works
- [ ] All features functional

---

**Next:** Deploy and test! 🚀
