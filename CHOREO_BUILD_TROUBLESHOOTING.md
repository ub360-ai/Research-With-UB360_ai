# 🔧 Choreo Build Troubleshooting Guide

## Frontend Build Failed - Solutions

### Understanding the Stack

**What we're using:**
- **Frontend Framework:** React (JavaScript library)
- **Build Tool:** Vite (uses Node.js)
- **Deployment:** Static files (HTML, CSS, JS)

**Build Process:**
```
React Code → Vite Build (Node.js) → Static Files → Choreo Hosting
```

---

## Common Build Failures & Fixes

### Issue 1: Component Path Not Found

**Error:** "Could not find package.json"

**Solution:**
When creating the Web Application in Choreo:

1. **Repository:** Select your repo
2. **Branch:** `main`
3. **Component Path:** `frontend` (NOT `./frontend` or `/frontend`)
4. **Buildpack:** Select "React" or "Node.js"

---

### Issue 2: Build Command Not Found

**Error:** "npm: command not found" or "build script not found"

**Solution:**

Check your `frontend/package.json` has:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

In Choreo, use:
- **Build Command:** `npm run build` (or leave empty for auto-detect)
- **Install Command:** `npm install` (or leave empty)

---

### Issue 3: Node Version Mismatch

**Error:** "Unsupported Node.js version"

**Solution:**

Add to `frontend/package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

In Choreo:
- **Node Version:** Select "18" or "18.x"

---

### Issue 4: Build Directory Not Found

**Error:** "Output directory 'dist' not found"

**Solution:**

Verify `frontend/vite.config.js`:
```javascript
export default defineConfig({
  build: {
    outDir: 'dist',  // Must match Choreo output path
  }
})
```

In Choreo:
- **Output Path:** `dist` (NOT `build` or `dist/`)

---

### Issue 5: Environment Variables Not Set

**Error:** Build succeeds but app doesn't work

**Solution:**

In Choreo Console → Component → **Configs & Secrets**:

**Required:**
```
VITE_API_URL=https://your-backend-url.choreoapis.dev/api/v1
```

**Optional:**
```
VITE_APP_NAME=Research with UB360.ai
VITE_BRAND_NAME=UB360.ai
```

**Important:** All Vite env vars MUST start with `VITE_`!

---

## Step-by-Step: Create Frontend Component Correctly

### Method 1: Using Choreo Console (Recommended)

1. **Go to your project in Choreo**

2. **Click "Create" → "Web Application"**

3. **Fill in details:**
   ```
   Name: research-assistant-frontend
   Description: React frontend for research assistant
   ```

4. **Click "Next"**

5. **Connect Repository:**
   ```
   GitHub Organization: [Your username]
   Repository: Research_With_UB360_ai_webapp
   Branch: main
   ```

6. **Build Configuration:**
   ```
   Buildpack: React (or Node.js)
   Component Directory: frontend
   Node Version: 18
   Build Command: (leave empty - auto-detect)
   Output Directory: dist
   ```

7. **Click "Create"**

8. **Set Environment Variables** (in Configs & Secrets):
   ```
   VITE_API_URL = https://[your-backend].choreoapis.dev/api/v1
   ```

9. **Click "Deploy"**

---

### Method 2: Simplified Configuration

If the above doesn't work, try this minimal setup:

**Delete `.choreo/component-frontend.yaml`** and let Choreo auto-detect everything.

Choreo will automatically:
- Detect `package.json`
- Find `npm run build` script
- Use `dist` as output (from vite.config.js)
- Set Node.js 18

---

## Debugging Build Logs

### Where to find logs:

1. Go to your component in Choreo
2. Click on the failed build
3. Click "View Logs"
4. Look for errors

### Common log errors:

**Error:** `ENOENT: no such file or directory, open 'package.json'`
- **Fix:** Wrong component path. Use `frontend` not root.

**Error:** `Module not found: Error: Can't resolve 'axios'`
- **Fix:** Dependencies not installed. Choreo should auto-run `npm install`.

**Error:** `vite: command not found`
- **Fix:** Vite not in dependencies. Check `package.json`.

**Error:** `VITE_API_URL is not defined`
- **Fix:** Set environment variable in Choreo console.

---

## Alternative: Manual Build Test

Test the build locally first:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Check if dist folder was created
ls dist

# Should see:
# - index.html
# - assets/
# - vite.svg
```

If local build works, the issue is Choreo configuration.

---

## Quick Fix Checklist

- [ ] Component path is `frontend` (not `./frontend`)
- [ ] Buildpack is "React" or "Node.js"
- [ ] Node version is 18
- [ ] `package.json` exists in `frontend/` directory
- [ ] `package.json` has `"build": "vite build"` script
- [ ] `vite.config.js` has `outDir: 'dist'`
- [ ] Output path in Choreo is `dist`
- [ ] Environment variables are set (especially `VITE_API_URL`)
- [ ] Repository is pushed to GitHub
- [ ] Branch is `main` (or your default branch)

---

## Still Not Working?

### Option 1: Use Simplified Config

Remove all custom configuration and let Choreo auto-detect:

1. Delete `.choreo/component-frontend.yaml`
2. In Choreo, just specify:
   - Component Directory: `frontend`
   - Buildpack: React
3. Let Choreo handle the rest

### Option 2: Check Choreo Documentation

Visit: https://wso2.com/choreo/docs/

Look for:
- "Deploy React Application"
- "Deploy Vite Application"
- "Troubleshooting Build Failures"

### Option 3: Contact Me

Share the exact error message from Choreo build logs, and I'll help debug!

---

## What to Share for Debugging

If you need help, provide:

1. **Error message** from Choreo build logs
2. **Component configuration** (screenshot of Choreo settings)
3. **Directory structure:**
   ```bash
   ls -la frontend/
   ```
4. **package.json** contents:
   ```bash
   cat frontend/package.json
   ```

---

**Remember:** React is the framework, Node.js is just the build tool. The final output is static HTML/CSS/JS files that Choreo hosts! 🚀
