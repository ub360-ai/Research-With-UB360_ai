# 🤖 Google Gemini Models Guide

## ✅ Recommended Model: `gemini-2.0-flash`

This is the **latest stable model** with good free tier limits for students.

---

## 📊 Model Comparison

### **gemini-2.0-flash** ✅ (RECOMMENDED)
- **Status:** Latest stable release
- **Free Tier Limits:**
  - 10 requests per minute
  - 1,500 requests per day
  - 4 million tokens per minute
- **Best For:** Students, production apps
- **Speed:** Very fast
- **Quality:** Excellent

### **gemini-1.5-flash** (Alternative)
- **Status:** Previous stable version
- **Free Tier Limits:**
  - 15 requests per minute
  - 1,500 requests per day
  - 1 million tokens per minute
- **Best For:** High-frequency queries
- **Speed:** Very fast
- **Quality:** Excellent

### **gemini-1.5-pro** (Advanced)
- **Status:** More capable model
- **Free Tier Limits:**
  - 2 requests per minute
  - 50 requests per day
- **Best For:** Complex reasoning tasks
- **Speed:** Slower
- **Quality:** Superior

### **gemini-2.0-flash-exp** ❌ (DO NOT USE)
- **Status:** Experimental
- **Free Tier Limits:** 0 (no free tier)
- **Best For:** Nothing (testing only)
- **Note:** Will cause quota errors

---

## 🔧 How to Change Models

### Option 1: Environment Variable (Recommended)
Edit your `.env` file:
```bash
GEMINI_MODEL=gemini-2.0-flash
```

### Option 2: Default in Code
Already set in `config.py`:
```python
GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
```

---

## 🚨 Common Errors

### Error: "429 You exceeded your current quota"
**Cause:** Using experimental model or exceeded rate limits

**Solutions:**
1. Switch to `gemini-2.0-flash` or `gemini-1.5-flash`
2. Wait 1 minute if you hit rate limit
3. Check your API key is valid

### Error: "Model not found"
**Cause:** Typo in model name

**Solution:** Use exact model names:
- ✅ `gemini-2.0-flash`
- ✅ `gemini-1.5-flash`
- ✅ `gemini-1.5-pro`
- ❌ `gemini-2.0-flash-exp` (experimental, no free tier)

---

## 💡 Tips for Students

### For Research Assistant (This Project)
- **Use:** `gemini-2.0-flash` (default)
- **Why:** Best balance of speed, quality, and free tier limits
- **Rate Limit:** 10 requests/minute is plenty for research queries

### If You Need More Requests
- **Use:** `gemini-1.5-flash`
- **Why:** 15 requests/minute (50% more)
- **Trade-off:** Slightly older model

### For Complex Analysis
- **Use:** `gemini-1.5-pro`
- **Why:** More capable reasoning
- **Trade-off:** Only 2 requests/minute

---

## 📈 Free Tier Limits Summary

| Model | RPM | RPD | Tokens/Min |
|-------|-----|-----|------------|
| gemini-2.0-flash | 10 | 1,500 | 4M |
| gemini-1.5-flash | 15 | 1,500 | 1M |
| gemini-1.5-pro | 2 | 50 | 32K |

**RPM** = Requests Per Minute  
**RPD** = Requests Per Day

---

## ✅ Current Configuration

Your backend is now configured to use:
- **Model:** `gemini-2.0-flash`
- **Temperature:** 0.1 (focused, deterministic responses)
- **Free Tier:** ✅ Enabled

---

## 🔄 Restart Required

After changing the model in `.env` or `config.py`:
1. Stop the server: `Ctrl + C`
2. Restart: `python main.py`
3. Verify: Check startup message shows correct model

---

**Last Updated:** Phase 1 - November 2025
