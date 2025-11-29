# 🎓 Research With UB360.ai - Backend

**AI-Powered Research Assistant for Students**

A complete RAG (Retrieval-Augmented Generation) backend system that helps students with research by allowing them to upload documents and ask questions about their content.

---

## ✨ Features

### Phase 1 ✅ (Complete)
- ✅ **Google Gemini Integration** - Free AI model for students
- ✅ **Document Upload** - TXT and MD files
- ✅ **Vector Search** - Semantic search using ChromaDB
- ✅ **Multiple Query Types**:
  - Standard Q&A with citations
  - Document summarization
  - Multi-source comparison
  - Key points extraction
  - Timeline extraction
- ✅ **Citation Tracking** - Know which document answers came from
- ✅ **RESTful API** - FastAPI with auto-generated docs
- ✅ **Query History** - Track recent queries

### Phase 2 ✅ (Complete)
- ✅ **PDF Support** - Full text extraction with page numbers
- ✅ **DOCX Support** - Word document processing
- ✅ **Web URL Support** - Scrape content from web pages
- ✅ **Rich Metadata** - Authors, titles, dates, page counts
- ✅ **Page Number Citations** - PDFs include page references
- ✅ **Enhanced Extraction** - Smart content extraction

### Phase 3 ✅ (Complete)
- ✅ **PDF Report Export** - Professional research reports
- ✅ **DOCX Export** - Editable Word documents
- ✅ **Bibliography Generator** - APA, MLA, Chicago styles
- ✅ **Research Summaries** - AI-generated with sources
- ✅ **Query History Export** - JSON and TXT formats
- ✅ **File Management** - List and download exports

---

## 🚀 Quick Start

### 1. Get Google Gemini API Key (Free)
Visit: https://aistudio.google.com/

### 2. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure
```bash
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

### 4. Run
```bash
python main.py
```

### 5. Test
Open: http://localhost:8000/docs

**Full setup guide:** [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)

---

## 📁 Project Structure

```
backend/
├── main.py                    # FastAPI application
├── config.py                  # Configuration management
├── requirements.txt           # Dependencies
├── .env.example              # Environment template
│
├── api/                      # API Layer
│   ├── models.py            # Pydantic models
│   └── v1/
│       ├── health.py        # Health check
│       ├── documents.py     # Document management
│       └── queries.py       # Query endpoints
│
├── services/                 # Business Logic
│   └── document_manager.py  # Document processing
│
├── rag/                      # RAG Engine
│   ├── rag_engine.py        # Main RAG logic
│   └── prompts.py           # Prompt templates
│
├── database/                 # Data Layer
│   └── vector_store.py      # ChromaDB wrapper
│
└── docs/                     # Documentation
    ├── SETUP_GUIDE.md       # Setup instructions
    └── API_DOCUMENTATION.md # API reference
```

---

## 🔌 API Endpoints

### Documents
- `POST /api/v1/documents/upload` - Upload document
- `GET /api/v1/documents` - List documents
- `GET /api/v1/documents/{id}` - Get document
- `DELETE /api/v1/documents/{id}` - Delete document

### Queries
- `POST /api/v1/query` - Ask questions
- `GET /api/v1/query/history` - Query history

### Health
- `GET /api/v1/health` - System health

**Full API docs:** [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---

## 💡 Query Types

### 1. Answer
Get specific answers with citations
```json
{
  "question": "What is machine learning?",
  "query_type": "answer"
}
```

### 2. Summarize
Generate document summaries
```json
{
  "question": "Summarize the key findings",
  "query_type": "summarize",
  "n_results": 10
}
```

### 3. Compare
Compare multiple sources
```json
{
  "question": "Compare the methodologies",
  "query_type": "compare"
}
```

### 4. Extract
Extract key points
```json
{
  "question": "Extract main concepts",
  "query_type": "extract"
}
```

### 5. Timeline
Get chronological information
```json
{
  "question": "Timeline of developments",
  "query_type": "timeline"
}
```

---

## 🛠️ Technology Stack

- **Framework:** FastAPI
- **LLM:** Google Gemini (free tier)
- **Vector DB:** ChromaDB
- **Embeddings:** SentenceTransformers
- **Text Processing:** LangChain

---

## 📚 Documentation

- **[Setup Guide](docs/SETUP_GUIDE.md)** - Installation and configuration
- **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete API reference

---

## 🗺️ Roadmap

### Phase 1: Core Backend ✅ (Current)
- [x] FastAPI setup
- [x] Google Gemini integration
- [x] Vector database
- [x] Basic document upload (TXT, MD)
- [x] Multiple query types
- [x] Citation tracking

### Phase 2: Document Processing (Next)
- [ ] PDF text extraction
- [ ] DOCX text extraction
- [ ] Web URL scraping
- [ ] Metadata extraction (authors, dates, etc.)
- [ ] Page number tracking

### Phase 3: Enhanced RAG
- [ ] Advanced chunking strategies
- [ ] Hybrid search (semantic + keyword)
- [ ] Document filtering
- [ ] Search analytics

### Phase 4: Export & Reports
- [ ] PDF report generation
- [ ] DOCX export
- [ ] Bibliography (APA, MLA, Chicago)
- [ ] Chat history export

### Phase 5: Frontend
- [ ] Web interface
- [ ] Drag-and-drop upload
- [ ] Chat interface
- [ ] Document management UI

---

## 🎯 Use Cases

### For Students
- 📖 **Literature Review** - Summarize and compare research papers
- 📝 **Study Notes** - Extract key points from textbooks
- 🔍 **Research Questions** - Get answers from uploaded materials
- 📊 **Paper Writing** - Generate summaries with citations

### For Researchers
- 📚 **Paper Analysis** - Compare methodologies across papers
- ⏱️ **Timeline Tracking** - Understand research progression
- 🎓 **Knowledge Management** - Organize research materials

---

## 🔒 Privacy & Security

- ✅ **No authentication required** (Phase 1)
- ✅ **Students use their own Gemini API keys**
- ✅ **Local document storage**
- ✅ **No data sharing**
- ✅ **Documents stored locally in ChromaDB**

---

## 🐛 Troubleshooting

### "GOOGLE_API_KEY is required"
- Create `.env` file from `.env.example`
- Add your Gemini API key
- Restart the server

### "Port 8000 already in use"
- Change port in `main.py`
- Or stop the other application

### Slow first run
- First run downloads embedding models (~500MB)
- Subsequent runs are much faster

**More help:** [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)

---

## 📄 License

This project is licensed for educational use.

---

## 🤝 Contributing

This is a student learning project. Contributions welcome!

---

## 📧 Support

For issues or questions:
1. Check documentation
2. Review error messages
3. Verify API key configuration

---

**Built with ❤️ for students by UB360.ai**
