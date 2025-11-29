"""
Pydantic models for API requests and responses
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class QueryType(str, Enum):
    """Types of queries supported"""
    ANSWER = "answer"
    SUMMARIZE = "summarize"
    COMPARE = "compare"
    EXTRACT = "extract"
    TIMELINE = "timeline"


class DocumentType(str, Enum):
    """Supported document types"""
    PDF = "pdf"
    DOCX = "docx"
    TXT = "txt"
    MD = "md"
    URL = "url"


# ============= Request Models =============

class QueryRequest(BaseModel):
    """Request model for querying the RAG system"""
    question: str = Field(..., min_length=1, max_length=1000, description="User's question")
    query_type: QueryType = Field(default=QueryType.ANSWER, description="Type of query")
    n_results: int = Field(default=5, ge=1, le=20, description="Number of context chunks to retrieve")
    document_ids: Optional[List[str]] = Field(default=None, description="Filter by specific document IDs")
    conversation_history: List[Dict[str, str]] = Field(default=[], description="Previous conversation messages for context")
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "What is machine learning?",
                "query_type": "answer",
                "n_results": 5,
                "conversation_history": [
                    {"role": "user", "content": "Tell me about AI"},
                    {"role": "assistant", "content": "AI is artificial intelligence..."}
                ]
            }
        }



class DocumentUploadResponse(BaseModel):
    """Response model for document upload"""
    success: bool
    message: str
    document_id: str
    filename: str
    document_type: DocumentType
    metadata: Dict[str, Any]


# ============= Response Models =============

class Citation(BaseModel):
    """Citation information for a source"""
    document_id: str
    document_name: str
    chunk_id: str
    page_number: Optional[int] = None
    relevance_score: float
    text_snippet: str


class QueryResponse(BaseModel):
    """Response model for query results"""
    success: bool
    answer: str
    citations: List[Citation]
    query_type: QueryType
    processing_time: float
    metadata: Optional[Dict[str, Any]] = None


class DocumentInfo(BaseModel):
    """Document information"""
    document_id: str
    filename: str
    document_type: DocumentType
    upload_date: datetime
    file_size: int
    num_chunks: int
    metadata: Dict[str, Any]


class DocumentListResponse(BaseModel):
    """Response model for listing documents"""
    success: bool
    documents: List[DocumentInfo]
    total_count: int


class DeleteDocumentResponse(BaseModel):
    """Response model for document deletion"""
    success: bool
    message: str
    document_id: str


class HealthResponse(BaseModel):
    """Health check response"""
    success: bool
    status: str
    version: str
    gemini_configured: bool
    database_status: str
    timestamp: datetime


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str
    detail: Optional[str] = None
    status_code: int
