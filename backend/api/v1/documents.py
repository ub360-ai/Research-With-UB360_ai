"""
Document management endpoints with rename and download support
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from typing import List

from api.models import (
    DocumentUploadResponse,
    DocumentListResponse,
    DeleteDocumentResponse,
    DocumentInfo,
    DocumentType
)
from services.document_manager import DocumentManager
from config import settings

router = APIRouter()
doc_manager = DocumentManager()


@router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a document for processing
    
    Args:
        file: Uploaded file (PDF, DOCX, TXT, MD)
    
    Returns:
        DocumentUploadResponse: Upload confirmation with document ID
    """
    # Validate file extension
    file_ext = f".{file.filename.split('.')[-1].lower()}"
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not supported. Allowed: {settings.ALLOWED_EXTENSIONS}"
        )
    
    # Validate file size
    contents = await file.read()
    file_size_mb = len(contents) / (1024 * 1024)
    if file_size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({file_size_mb:.2f}MB). Max size: {settings.MAX_FILE_SIZE_MB}MB"
        )
    
    # Reset file pointer
    await file.seek(0)
    
    try:
        # Process document
        result = await doc_manager.process_and_store(file, contents)
        
        return DocumentUploadResponse(
            success=True,
            message="Document uploaded and processed successfully",
            document_id=result["document_id"],
            filename=result["filename"],
            document_type=DocumentType(result["document_type"]),
            metadata=result["metadata"]
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing document: {str(e)}"
        )


@router.post("/documents/upload-url", response_model=DocumentUploadResponse)
async def upload_url(url: str):
    """
    Upload a URL for processing
    
    Args:
        url: URL to scrape and process
    
    Returns:
        DocumentUploadResponse: Upload confirmation with document ID
    """
    try:
        # Process URL
        result = await doc_manager.process_url(url)
        
        return DocumentUploadResponse(
            success=True,
            message="URL content scraped and processed successfully",
            document_id=result["document_id"],
            filename=result["filename"],
            document_type=DocumentType.URL,
            metadata=result["metadata"]
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing URL: {str(e)}"
        )


@router.get("/documents", response_model=DocumentListResponse)
async def list_documents():
    """
    List all uploaded documents
    
    Returns:
        DocumentListResponse: List of all documents with metadata
    """
    try:
        documents = await doc_manager.list_documents()
        
        document_infos = [
            DocumentInfo(
                document_id=doc["document_id"],
                filename=doc["filename"],
                document_type=DocumentType(doc["document_type"]),
                upload_date=doc["upload_date"],
                file_size=doc["file_size"],
                num_chunks=doc["num_chunks"],
                metadata=doc["metadata"]
            )
            for doc in documents
        ]
        
        return DocumentListResponse(
            success=True,
            documents=document_infos,
            total_count=len(document_infos)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error listing documents: {str(e)}"
        )


@router.delete("/documents/{document_id}", response_model=DeleteDocumentResponse)
async def delete_document(document_id: str):
    """
    Delete a document and its associated chunks
    
    Args:
        document_id: ID of the document to delete
    
    Returns:
        DeleteDocumentResponse: Deletion confirmation
    """
    try:
        result = await doc_manager.delete_document(document_id)
        
        if not result["success"]:
            raise HTTPException(
                status_code=404,
                detail=f"Document {document_id} not found"
            )
        
        return DeleteDocumentResponse(
            success=True,
            message=f"Document deleted successfully",
            document_id=document_id
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting document: {str(e)}"
        )


@router.get("/documents/{document_id}", response_model=DocumentInfo)
async def get_document(document_id: str):
    """
    Get information about a specific document
    
    Args:
        document_id: ID of the document
    
    Returns:
        DocumentInfo: Document information
    """
    try:
        doc = await doc_manager.get_document(document_id)
        
        if not doc:
            raise HTTPException(
                status_code=404,
                detail=f"Document {document_id} not found"
            )
        
        return DocumentInfo(
            document_id=doc["document_id"],
            filename=doc["filename"],
            document_type=DocumentType(doc["document_type"]),
            upload_date=doc["upload_date"],
            file_size=doc["file_size"],
            num_chunks=doc["num_chunks"],
            metadata=doc["metadata"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving document: {str(e)}"
        )


@router.patch("/documents/{document_id}/rename")
async def rename_document(document_id: str, new_name: str):
    """
    Rename a document
    
    Args:
        document_id: ID of the document
        new_name: New filename
    
    Returns:
        Success status and updated information
    """
    try:
        result = await doc_manager.rename_document(document_id, new_name)
        
        if not result["success"]:
            raise HTTPException(
                status_code=404,
                detail=result["message"]
            )
        
        return {
            "success": True,
            "message": result["message"],
            "document_id": document_id,
            "old_name": result["old_name"],
            "new_name": result["new_name"]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error renaming document: {str(e)}"
        )


@router.get("/documents/{document_id}/download")
async def download_document(document_id: str, watermark: bool = True):
    """
    Download a document with UB360.ai watermark
    
    Args:
        document_id: ID of the document
        watermark: Whether to add watermark (default: True)
    
    Returns:
        File download with UB360.ai branding
        Filename format: "{name}..Follow ub360_ai on x.{ext}"
    """
    try:
        # Get document file with watermark
        file_info = await doc_manager.get_document_for_download(
            document_id,
            add_watermark=watermark
        )
        
        # Create file response
        response = FileResponse(
            path=file_info["file_path"],
            filename=file_info["filename"],
            media_type='application/octet-stream'
        )
        
        return response
    
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error downloading document: {str(e)}"
        )
