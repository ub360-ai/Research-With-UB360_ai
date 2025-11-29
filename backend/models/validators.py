"""
Input Validation Models
Ensures all user inputs are properly validated and sanitized
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
import re


class DocumentUpload(BaseModel):
    """Validation for document uploads"""
    filename: str = Field(..., max_length=255, description="Document filename")
    content_type: str = Field(..., description="MIME type of the document")
    size: int = Field(..., le=50*1024*1024, description="File size in bytes (max 50MB)")
    
    @validator('filename')
    def validate_filename(cls, v):
        """Ensure filename is safe"""
        # Remove path traversal attempts
        if '..' in v or '/' in v or '\\' in v:
            raise ValueError('Filename contains invalid characters')
        
        # Check for valid extension
        valid_extensions = ['.pdf', '.docx', '.txt', '.md']
        if not any(v.lower().endswith(ext) for ext in valid_extensions):
            raise ValueError(f'File extension must be one of: {", ".join(valid_extensions)}')
        
        return v
    
    @validator('content_type')
    def validate_content_type(cls, v):
        """Ensure content type is allowed"""
        allowed = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/markdown'
        ]
        if v not in allowed:
            raise ValueError(f'Content type {v} not allowed')
        return v


class URLUpload(BaseModel):
    """Validation for URL scraping"""
    url: str = Field(..., max_length=2048, description="URL to scrape")
    
    @validator('url')
    def validate_url(cls, v):
        """Ensure URL is valid and safe"""
        # Basic URL validation
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain
            r'localhost|'  # localhost
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # or IP
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        if not url_pattern.match(v):
            raise ValueError('Invalid URL format')
        
        # Block localhost/internal IPs in production
        blocked_domains = ['localhost', '127.0.0.1', '0.0.0.0', '192.168.', '10.', '172.16.']
        if any(domain in v.lower() for domain in blocked_domains):
            raise ValueError('Cannot scrape internal/localhost URLs')
        
        return v


class ChatMessage(BaseModel):
    """Validation for chat messages"""
    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="User message"
    )
    conversation_id: Optional[str] = Field(
        None,
        max_length=100,
        description="Optional conversation ID"
    )
    
    @validator('message')
    def validate_message(cls, v):
        """Sanitize message content"""
        # Remove excessive whitespace
        v = ' '.join(v.split())
        
        # Ensure not empty after cleaning
        if not v.strip():
            raise ValueError('Message cannot be empty')
        
        return v


class ExportRequest(BaseModel):
    """Validation for export requests"""
    format: str = Field(..., description="Export format")
    conversation_id: Optional[str] = Field(None, max_length=100)
    
    @validator('format')
    def validate_format(cls, v):
        """Ensure export format is valid"""
        allowed_formats = ['pdf', 'docx', 'json']
        if v.lower() not in allowed_formats:
            raise ValueError(f'Format must be one of: {", ".join(allowed_formats)}')
        return v.lower()


class HealthCheckResponse(BaseModel):
    """Health check response model"""
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    timestamp: str = Field(..., description="Current timestamp")
    services: dict = Field(..., description="Status of dependent services")
