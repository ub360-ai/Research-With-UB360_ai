# ✅ Pre-Deployment Checklist

Before pushing to GitHub and deploying to Render, verify the following:

---

## 🔐 Security Check

- [ ] No `.env` files in repository
- [ ] No API keys in code
- [ ] No passwords or secrets committed
- [ ] `.gitignore` files in place (root, backend, frontend)
- [ ] `.env.example` files created (not actual `.env`)

**Verify:**
```bash
# Check for .env files
git status | grep .env

# Should only show .env.example files, NOT .env
```

---

## 📁 File Structure

- [ ] `backend/.gitignore` exists
- [ ] `frontend/.gitignore` exists
- [ ] Root `.gitignore` exists
- [ ] `backend/.env.example` exists
- [ ] `frontend/.env.example` exists
- [ ] `render.yaml` exists
- [ ] `README.md` updated
- [ ] `RENDER_DEPLOYMENT_GUIDE.md` exists

---

## 🧹 Clean Up

- [ ] No `data/` folder in git
- [ ] No `uploads/` folder in git
- [ ] No `node_modules/` in git
- [ ] No `__pycache__/` in git
- [ ] No `venv/` or `env/` in git
- [ ] No `dist/` or `build/` in git

**Clean up:**
```bash
# Remove cached files if needed
git rm -r --cached data/
git rm -r --cached node_modules/
git rm -r --cached __pycache__/
git rm -r --cached venv/
```

---

## 🔧 Configuration

### Backend
- [ ] `requirements.txt` includes all dependencies
- [ ] `gunicorn` and `apscheduler` in requirements
- [ ] `cleanup_scheduler.py` exists
- [ ] `main.py` imports cleanup scheduler
- [ ] CORS configured for production

### Frontend
- [ ] `client.js` uses `import.meta.env.VITE_API_URL`
- [ ] Timeout increased to 60000ms
- [ ] `PrivacyNotice.jsx` component exists
- [ ] Privacy notice added to Documents page

---

## 📝 Documentation

- [ ] README.md has deployment instructions
- [ ] RENDER_DEPLOYMENT_GUIDE.md is complete
- [ ] Environment variables documented
- [ ] Privacy policy mentioned

---

## 🧪 Local Testing

Before deploying, test locally:

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
# Should start without errors
# Visit http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Should start without errors
# Visit http://localhost:5173
```

### Integration
- [ ] Upload a document
- [ ] Ask a question
- [ ] Export chat history
- [ ] Check privacy notice displays
- [ ] Verify all features work

---

## 🚀 Ready for GitHub

Once all checks pass:

```bash
# Stage all changes
git add .

# Commit
git commit -m "Prepare for Render deployment with privacy features"

# Push to GitHub
git push origin main
```

---

## 🎯 Next Steps

After pushing to GitHub:
1. Go to render.com
2. Follow RENDER_DEPLOYMENT_GUIDE.md
3. Deploy backend first
4. Deploy frontend second
5. Test live deployment

---

## ⚠️ Common Issues

**Issue:** `.env` file committed
**Fix:** 
```bash
git rm --cached backend/.env
git rm --cached frontend/.env
git commit -m "Remove .env files"
```

**Issue:** Large files in git
**Fix:**
```bash
git rm --cached large_file.pdf
git commit -m "Remove large files"
```

**Issue:** node_modules committed
**Fix:**
```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules"
```

---

**All checks passed?** ✅ You're ready to deploy!
