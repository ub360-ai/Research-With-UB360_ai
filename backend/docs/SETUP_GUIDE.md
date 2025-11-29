# 🚀 Setup Guide - Research With UB360.ai

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Google account (for Gemini API)

---

## Step 1: Get Your Free Google Gemini API Key

### 1.1 Visit Google AI Studio
Go to: **https://aistudio.google.com/**

### 1.2 Sign In
- Click "Sign in" in the top right
- Use your Google account (student email or personal Gmail)

### 1.3 Get API Key
1. Click **"Get API Key"** button
2. Click **"Create API key in new project"** (or select existing project)
3. **Copy your API key** - you'll need this!

### 1.4 Free Tier Limits
Google Gemini offers a generous free tier:
- ✅ **60 requests per minute**
- ✅ **1,500 requests per day**
- ✅ **Perfect for student research!**
- ✅ **No credit card required**

---

## Step 2: Install Dependencies

### 2.1 Navigate to Backend Directory
```bash
cd backend
```

### 2.2 Create Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2.3 Install Requirements
```bash
pip install -r requirements.txt
```

**Note:** This may take 5-10 minutes as it downloads ML models.

---

## Step 3: Configure Your API Key

### 3.1 Copy Environment Template
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

### 3.2 Edit .env File
Open `.env` in any text editor and add your API key:

```env
GOOGLE_API_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with the API key you copied from Google AI Studio.

---

## Step 4: Run the Backend

### 4.1 Start the Server
```bash
python main.py
```

### 4.2 Verify It's Running
You should see:
```
🚀 Starting Research With UB360.ai v1.0.0
✅ Configuration validated
✅ Using Gemini model: gemini-2.0-flash-exp
✅ Embedding model: sentence-transformers/all-MiniLM-L6-v2
📚 Research With UB360.ai is ready!
📖 API Documentation: http://localhost:8000/docs
```

### 4.3 Test the API
Open your browser and go to:
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/api/v1/health

---

## Step 5: Test Your Setup

### 5.1 Using the Interactive API Docs

1. Go to http://localhost:8000/docs
2. Click on **GET /api/v1/health**
3. Click **"Try it out"**
4. Click **"Execute"**

You should see:
```json
{
  "success": true,
  "status": "healthy",
  "version": "1.0.0",
  "gemini_configured": true,
  "database_status": "ready"
}
```

### 5.2 Upload a Test Document

1. In the API docs, find **POST /api/v1/documents/upload**
2. Click **"Try it out"**
3. Click **"Choose File"** and select a `.txt` file
4. Click **"Execute"**

### 5.3 Query Your Document

1. Find **POST /api/v1/query**
2. Click **"Try it out"**
3. Enter a question in the request body:
```json
{
  "question": "What is this document about?",
  "query_type": "answer",
  "n_results": 5
}
```
4. Click **"Execute"**

---

## Troubleshooting

### Error: "GOOGLE_API_KEY is required"
- Make sure you created the `.env` file
- Check that you added your API key correctly
- Restart the server after adding the API key

### Error: "No module named 'fastapi'"
- Make sure you activated your virtual environment
- Run `pip install -r requirements.txt` again

### Error: Port 8000 already in use
- Another application is using port 8000
- Stop the other application or change the port in `main.py`

### Slow First Run
- The first time you run, it downloads embedding models (~500MB)
- This is normal and only happens once
- Subsequent runs will be much faster

---

## Next Steps

✅ **Backend is ready!**

Now you can:
1. Upload research documents (PDF, DOCX, TXT, MD)
2. Ask questions about your documents
3. Get summaries and comparisons
4. Extract key points
5. Build a frontend (Phase 2+)

---

## API Endpoints

### Documents
- `POST /api/v1/documents/upload` - Upload a document
- `GET /api/v1/documents` - List all documents
- `GET /api/v1/documents/{id}` - Get document info
- `DELETE /api/v1/documents/{id}` - Delete a document

### Queries
- `POST /api/v1/query` - Ask questions
  - Query types: `answer`, `summarize`, `compare`, `extract`, `timeline`
- `GET /api/v1/query/history` - Get query history

### Health
- `GET /api/v1/health` - Check system health

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the error messages in the terminal
3. Verify your API key is correct
4. Make sure all dependencies are installed

---

**Happy Researching! 🎓📚**
