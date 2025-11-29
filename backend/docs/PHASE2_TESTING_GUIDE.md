# 🧪 Phase 2 Testing Guide

## Quick Test: All Document Types

### **Prerequisites**
- Backend running: `python main.py`
- API docs open: http://localhost:8000/docs

---

## Test 1: PDF Upload ✅

### **Using API Docs (Swagger)**
1. Go to http://localhost:8000/docs
2. Find **POST /api/v1/documents/upload**
3. Click "Try it out"
4. Upload a PDF file
5. Click "Execute"

### **Expected Response:**
```json
{
  "success": true,
  "message": "Document uploaded and processed successfully",
  "document_id": "uuid-here",
  "filename": "paper.pdf",
  "document_type": "pdf",
  "metadata": {
    "total_pages": 10,
    "author": "John Doe",
    "title": "Research Paper",
    "creation_date": "2024-01-01"
  }
}
```

### **Verify:**
- ✅ `total_pages` is correct
- ✅ Metadata extracted (author, title)
- ✅ No errors

---

## Test 2: DOCX Upload ✅

### **Steps:**
1. Upload a `.docx` file
2. Check response

### **Expected Response:**
```json
{
  "success": true,
  "document_type": "docx",
  "metadata": {
    "total_paragraphs": 25,
    "author": "Jane Smith",
    "title": "Thesis",
    "created": "2024-01-01T00:00:00",
    "modified": "2024-01-15T00:00:00"
  }
}
```

### **Verify:**
- ✅ Text extracted
- ✅ Metadata present
- ✅ Paragraph count accurate

---

## Test 3: URL Upload ✅

### **Steps:**
1. Find **POST /api/v1/documents/upload-url**
2. Click "Try it out"
3. Enter URL: `https://en.wikipedia.org/wiki/Machine_learning`
4. Click "Execute"

### **Expected Response:**
```json
{
  "success": true,
  "document_type": "url",
  "filename": "en.wikipedia.org_abc123.txt",
  "metadata": {
    "url": "https://en.wikipedia.org/wiki/Machine_learning",
    "title": "Machine learning - Wikipedia",
    "domain": "en.wikipedia.org",
    "word_count": 5000
  }
}
```

### **Verify:**
- ✅ Content scraped
- ✅ Title extracted
- ✅ Word count > 0
- ✅ No HTML tags in text

---

## Test 4: Query with Page Numbers ✅

### **Steps:**
1. Upload a PDF (from Test 1)
2. Go to **POST /api/v1/query**
3. Enter query:
```json
{
  "question": "What is the main topic?",
  "query_type": "answer",
  "n_results": 5
}
```
4. Click "Execute"

### **Expected Response:**
```json
{
  "success": true,
  "answer": "The main topic is...",
  "citations": [
    {
      "document_name": "paper.pdf",
      "page_number": 3,
      "relevance_score": 0.92,
      "text_snippet": "..."
    }
  ]
}
```

### **Verify:**
- ✅ `page_number` is present
- ✅ Page number is reasonable (1-total_pages)
- ✅ Answer uses the content

---

## Test 5: List Documents ✅

### **Steps:**
1. Go to **GET /api/v1/documents**
2. Click "Try it out"
3. Click "Execute"

### **Expected Response:**
```json
{
  "success": true,
  "documents": [
    {
      "document_id": "...",
      "filename": "paper.pdf",
      "document_type": "pdf",
      "upload_date": "2024-01-01T00:00:00",
      "file_size": 1024000,
      "num_chunks": 25,
      "metadata": {
        "total_pages": 10,
        "author": "John Doe"
      }
    },
    {
      "document_type": "url",
      "metadata": {
        "url": "https://...",
        "domain": "example.com"
      }
    }
  ],
  "total_count": 2
}
```

### **Verify:**
- ✅ All uploaded documents listed
- ✅ Different document types shown
- ✅ Metadata varies by type

---

## Test 6: Summarize Multiple Documents ✅

### **Steps:**
1. Upload 2-3 documents (mix of PDF, DOCX, URL)
2. Query with summarize:
```json
{
  "question": "Summarize all documents about machine learning",
  "query_type": "summarize",
  "n_results": 10
}
```

### **Expected:**
- ✅ Summary combines info from all documents
- ✅ Citations from different sources
- ✅ Page numbers for PDFs

---

## Test 7: Compare Sources ✅

### **Steps:**
1. Upload 2+ documents on similar topics
2. Query with compare:
```json
{
  "question": "Compare the approaches in these documents",
  "query_type": "compare",
  "n_results": 10
}
```

### **Expected:**
- ✅ Identifies similarities
- ✅ Points out differences
- ✅ Cites specific documents

---

## 🐛 Common Issues & Solutions

### **Issue: "Error extracting PDF"**
**Cause:** Corrupted or encrypted PDF  
**Solution:** Try a different PDF or decrypt it

### **Issue: "URL timeout"**
**Cause:** Website slow or blocking  
**Solution:** Try a different URL or increase timeout

### **Issue: "No page numbers in citations"**
**Cause:** Document is not PDF  
**Solution:** Only PDFs have page numbers (expected)

### **Issue: "Empty text extracted"**
**Cause:** PDF is image-based (scanned)  
**Solution:** Use OCR-enabled PDF or different document

---

## ✅ Success Checklist

After testing, you should have:

- [ ] Uploaded at least one PDF
- [ ] Uploaded at least one DOCX
- [ ] Uploaded at least one URL
- [ ] Queried documents successfully
- [ ] Seen page numbers in PDF citations
- [ ] Verified metadata extraction
- [ ] Listed all documents
- [ ] Tried different query types

---

## 📊 Test Results Template

```
Test Date: ___________
Tester: ___________

PDF Upload:        ✅ / ❌
DOCX Upload:       ✅ / ❌
URL Upload:        ✅ / ❌
Page Numbers:      ✅ / ❌
Metadata:          ✅ / ❌
Query (Answer):    ✅ / ❌
Query (Summarize): ✅ / ❌
Query (Compare):   ✅ / ❌

Issues Found:
_______________________
_______________________

Notes:
_______________________
_______________________
```

---

## 🎯 Next Steps

After successful testing:
1. ✅ Phase 2 is working!
2. 📝 Document any issues
3. 🚀 Ready for Phase 3 or frontend development

---

**Happy Testing! 🧪**
