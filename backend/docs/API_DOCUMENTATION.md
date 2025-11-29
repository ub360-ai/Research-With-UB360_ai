# 📖 API Documentation - Research With UB360.ai

## Base URL
```
http://localhost:8000
```

## Interactive Documentation
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## Authentication
**Phase 1:** No authentication required  
**Future:** Students will use their own Gemini API keys

---

## Endpoints

### 🏥 Health Check

#### GET `/api/v1/health`
Check system health and configuration status.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "version": "1.0.0",
  "gemini_configured": true,
  "database_status": "ready",
  "timestamp": "2025-11-25T10:00:00"
}
```

---

### 📄 Document Management

#### POST `/api/v1/documents/upload`
Upload a research document.

**Request:**
- Content-Type: `multipart/form-data`
- Body: File upload

**Supported Formats:**
- `.pdf` - PDF documents
- `.docx` - Word documents
- `.txt` - Plain text
- `.md` - Markdown files

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded and processed successfully",
  "document_id": "uuid-here",
  "filename": "research_paper.pdf",
  "document_type": "pdf",
  "metadata": {
    "upload_date": "2025-11-25T10:00:00",
    "file_size": 1024000,
    "num_chunks": 25
  }
}
```

---

#### GET `/api/v1/documents`
List all uploaded documents.

**Response:**
```json
{
  "success": true,
  "documents": [
    {
      "document_id": "uuid-1",
      "filename": "paper1.pdf",
      "document_type": "pdf",
      "upload_date": "2025-11-25T10:00:00",
      "file_size": 1024000,
      "num_chunks": 25,
      "metadata": {}
    }
  ],
  "total_count": 1
}
```

---

#### GET `/api/v1/documents/{document_id}`
Get information about a specific document.

**Parameters:**
- `document_id` (path) - Document UUID

**Response:**
```json
{
  "document_id": "uuid-1",
  "filename": "paper1.pdf",
  "document_type": "pdf",
  "upload_date": "2025-11-25T10:00:00",
  "file_size": 1024000,
  "num_chunks": 25,
  "metadata": {}
}
```

---

#### DELETE `/api/v1/documents/{document_id}`
Delete a document and all its chunks.

**Parameters:**
- `document_id` (path) - Document UUID

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully",
  "document_id": "uuid-1"
}
```

---

### 🔍 Query System

#### POST `/api/v1/query`
Query the RAG system with different query types.

**Request Body:**
```json
{
  "question": "What is machine learning?",
  "query_type": "answer",
  "n_results": 5,
  "document_ids": ["uuid-1", "uuid-2"]
}
```

**Parameters:**
- `question` (required) - Your question or query
- `query_type` (optional) - Type of query (default: "answer")
  - `answer` - Standard Q&A
  - `summarize` - Summarize documents
  - `compare` - Compare multiple sources
  - `extract` - Extract key points
  - `timeline` - Extract chronological information
- `n_results` (optional) - Number of context chunks (1-20, default: 5)
- `document_ids` (optional) - Filter by specific documents

**Response:**
```json
{
  "success": true,
  "answer": "Machine learning is a subset of artificial intelligence...",
  "citations": [
    {
      "document_id": "uuid-1",
      "document_name": "ai_paper.pdf",
      "chunk_id": "uuid-1_chunk_5",
      "page_number": 3,
      "relevance_score": 0.92,
      "text_snippet": "Machine learning is defined as..."
    }
  ],
  "query_type": "answer",
  "processing_time": 1.23,
  "metadata": {
    "context_found": true,
    "num_sources": 3
  }
}
```

---

#### GET `/api/v1/query/history`
Get recent query history.

**Parameters:**
- `limit` (query) - Number of queries to return (default: 10)

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "timestamp": "2025-11-25T10:00:00",
      "query": "What is machine learning?",
      "query_type": "answer",
      "answer": "Machine learning is..."
    }
  ],
  "count": 1
}
```

---

## Query Types Explained

### 1. Answer (`answer`)
Standard question-answering with citations.

**Example:**
```json
{
  "question": "What are the main types of machine learning?",
  "query_type": "answer"
}
```

**Use Case:** Get specific answers to research questions.

---

### 2. Summarize (`summarize`)
Generate comprehensive summaries of documents.

**Example:**
```json
{
  "question": "Summarize the key findings about climate change",
  "query_type": "summarize",
  "n_results": 10
}
```

**Use Case:** Create literature review summaries.

---

### 3. Compare (`compare`)
Compare information across multiple sources.

**Example:**
```json
{
  "question": "Compare the approaches to neural networks in these papers",
  "query_type": "compare",
  "n_results": 10
}
```

**Use Case:** Identify similarities and differences between sources.

---

### 4. Extract (`extract`)
Extract key points and important information.

**Example:**
```json
{
  "question": "Extract key points about quantum computing",
  "query_type": "extract",
  "n_results": 10
}
```

**Use Case:** Create bullet-point summaries and study notes.

---

### 5. Timeline (`timeline`)
Extract chronological or sequential information.

**Example:**
```json
{
  "question": "Timeline of AI development",
  "query_type": "timeline",
  "n_results": 10
}
```

**Use Case:** Understand historical progression or sequential events.

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "detail": "Detailed error information",
  "status_code": 400
}
```

### Common Error Codes

- `400` - Bad Request (invalid input)
- `404` - Not Found (document doesn't exist)
- `500` - Internal Server Error

---

## Rate Limits

**Default:** 60 requests per minute

Exceeding rate limits will return:
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "status_code": 429
}
```

---

## Best Practices

### 1. Document Upload
- Upload documents in batches
- Use descriptive filenames
- Keep files under 50MB

### 2. Querying
- Start with `n_results=5` and adjust as needed
- Use specific questions for better answers
- Try different query types for different needs

### 3. Citation Management
- Always check citations for accuracy
- Use relevance scores to filter results
- Cross-reference multiple sources

---

## Example Workflows

### Workflow 1: Research Paper Analysis
```
1. Upload research papers
   POST /api/v1/documents/upload

2. Get summary of all papers
   POST /api/v1/query
   {
     "question": "Summarize the main findings",
     "query_type": "summarize",
     "n_results": 10
   }

3. Extract key points
   POST /api/v1/query
   {
     "question": "Extract key methodologies",
     "query_type": "extract"
   }
```

### Workflow 2: Literature Review
```
1. Upload multiple papers on same topic

2. Compare approaches
   POST /api/v1/query
   {
     "question": "Compare the methodologies",
     "query_type": "compare"
   }

3. Get timeline of developments
   POST /api/v1/query
   {
     "question": "Timeline of research developments",
     "query_type": "timeline"
   }
```

---

## Testing with cURL

### Upload Document
```bash
curl -X POST "http://localhost:8000/api/v1/documents/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@research_paper.pdf"
```

### Query
```bash
curl -X POST "http://localhost:8000/api/v1/query" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is machine learning?",
    "query_type": "answer",
    "n_results": 5
  }'
```

---

## Next Steps

- **Phase 2:** Multi-format document processing (PDF, DOCX)
- **Phase 3:** Advanced search and filtering
- **Phase 4:** Export and bibliography generation
- **Frontend:** Web interface for easy interaction

---

**For more help, see:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
