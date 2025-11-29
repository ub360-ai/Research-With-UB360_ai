"""
Document management service
Handles document upload, storage, and metadata tracking
"""
import uuid
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastapi import UploadFile

from config import settings
from database.vector_store import VectorStore
from services.pdf_handler import PDFHandler
from services.docx_handler import DOCXHandler
from services.web_scraper import WebScraper


class DocumentManager:
    """Manages document uploads and metadata"""
    
    def __init__(self):
        self.upload_dir = settings.UPLOAD_DIR
        self.metadata_file = self.upload_dir / "documents_metadata.json"
        self.vector_store = VectorStore()
        self._load_metadata()
    
    def _load_metadata(self):
        """Load document metadata from file"""
        if self.metadata_file.exists():
            with open(self.metadata_file, 'r', encoding='utf-8') as f:
                self.documents_metadata = json.load(f)
        else:
            self.documents_metadata = {}
    
    def _save_metadata(self):
        """Save document metadata to file"""
        with open(self.metadata_file, 'w', encoding='utf-8') as f:
            json.dump(self.documents_metadata, f, indent=2, default=str)
    
    async def process_and_store(
        self,
        file: UploadFile,
        contents: bytes
    ) -> Dict[str, Any]:
        """
        Process uploaded document and store in vector database
        
        Args:
            file: Uploaded file object
            contents: File contents as bytes
        
        Returns:
            Dictionary with document information
        """
        # Generate unique document ID
        document_id = str(uuid.uuid4())
        
        # Determine document type
        file_ext = f".{file.filename.split('.')[-1].lower()}"
        doc_type_map = {
            ".pdf": "pdf",
            ".docx": "docx",
            ".txt": "txt",
            ".md": "md"
        }
        document_type = doc_type_map.get(file_ext, "txt")
        
        # Save file to upload directory
        file_path = self.upload_dir / f"{document_id}_{file.filename}"
        with open(file_path, 'wb') as f:
            f.write(contents)
        
        # Extract text and metadata based on document type
        extracted_data = await self._extract_content(file_path, document_type)
        
        # Store in vector database with page tracking
        num_chunks = await self.vector_store.add_document(
            document_id=document_id,
            text=extracted_data["text"],
            metadata={
                "filename": file.filename,
                "document_type": document_type,
                "upload_date": datetime.now().isoformat(),
                "file_size": len(contents),
                **extracted_data["metadata"]
            },
            pages=extracted_data.get("pages", [])
        )
        
        # Save metadata
        self.documents_metadata[document_id] = {
            "document_id": document_id,
            "filename": file.filename,
            "document_type": document_type,
            "upload_date": datetime.now().isoformat(),
            "file_size": len(contents),
            "file_path": str(file_path),
            "num_chunks": num_chunks,
            "metadata": {
                "original_filename": file.filename,
                "content_type": file.content_type,
                **extracted_data["metadata"]
            }
        }
        self._save_metadata()
        
        return self.documents_metadata[document_id]
    
    async def _extract_content(self, file_path: Path, document_type: str) -> Dict[str, Any]:
        """
        Extract content from document based on type
        
        Args:
            file_path: Path to document
            document_type: Type of document (pdf, docx, txt, md)
        
        Returns:
            Dictionary with text, metadata, and optional pages
        """
        try:
            if document_type == "pdf":
                # Extract PDF with page tracking
                result = PDFHandler.extract_text_and_metadata(str(file_path))
                return {
                    "text": result["text"],
                    "pages": result["pages"],
                    "metadata": result["metadata"]
                }
            
            elif document_type == "docx":
                # Extract DOCX
                result = DOCXHandler.extract_text_and_metadata(str(file_path))
                return {
                    "text": result["text"],
                    "metadata": result["metadata"]
                }
            
            elif document_type in ["txt", "md"]:
                # Extract plain text
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    text = f.read()
                return {
                    "text": text,
                    "metadata": {
                        "word_count": len(text.split()),
                        "char_count": len(text)
                    }
                }
            
            else:
                # Fallback
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    text = f.read()
                return {
                    "text": text,
                    "metadata": {}
                }
        
        except Exception as e:
            raise Exception(f"Error extracting content from {document_type}: {str(e)}")
    
    async def process_url(self, url: str) -> Dict[str, Any]:
        """
        Process a URL and store its content
        
        Args:
            url: URL to process
        
        Returns:
            Dictionary with document information
        """
        # Validate URL
        if not WebScraper.is_valid_url(url):
            raise ValueError(f"Invalid URL: {url}")
        
        # Generate unique document ID
        document_id = str(uuid.uuid4())
        
        # Scrape URL
        scraped_data = WebScraper.scrape_url(url)
        
        # Create a filename from URL
        from urllib.parse import urlparse
        parsed = urlparse(url)
        filename = f"{parsed.netloc}_{document_id[:8]}.txt"
        
        # Save scraped content
        file_path = self.upload_dir / f"{document_id}_{filename}"
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(scraped_data["text"])
        
        # Store in vector database
        num_chunks = await self.vector_store.add_document(
            document_id=document_id,
            text=scraped_data["text"],
            metadata={
                "filename": filename,
                "document_type": "url",
                "upload_date": datetime.now().isoformat(),
                "file_size": len(scraped_data["text"].encode()),
                **scraped_data["metadata"]
            }
        )
        
        # Save metadata
        self.documents_metadata[document_id] = {
            "document_id": document_id,
            "filename": filename,
            "document_type": "url",
            "upload_date": datetime.now().isoformat(),
            "file_size": len(scraped_data["text"].encode()),
            "file_path": str(file_path),
            "num_chunks": num_chunks,
            "metadata": scraped_data["metadata"]
        }
        self._save_metadata()
        
        return self.documents_metadata[document_id]
    
    async def list_documents(self) -> List[Dict[str, Any]]:
        """
        List all uploaded documents
        
        Returns:
            List of document metadata
        """
        documents = []
        for doc_id, metadata in self.documents_metadata.items():
            # Convert upload_date string back to datetime
            metadata_copy = metadata.copy()
            if isinstance(metadata_copy["upload_date"], str):
                metadata_copy["upload_date"] = datetime.fromisoformat(metadata_copy["upload_date"])
            documents.append(metadata_copy)
        
        # Sort by upload date (newest first)
        documents.sort(key=lambda x: x["upload_date"], reverse=True)
        return documents
    
    async def get_document(self, document_id: str) -> Optional[Dict[str, Any]]:
        """
        Get document metadata by ID
        
        Args:
            document_id: Document ID
        
        Returns:
            Document metadata or None if not found
        """
        metadata = self.documents_metadata.get(document_id)
        if metadata:
            metadata_copy = metadata.copy()
            if isinstance(metadata_copy["upload_date"], str):
                metadata_copy["upload_date"] = datetime.fromisoformat(metadata_copy["upload_date"])
            return metadata_copy
        return None
    
    async def delete_document(self, document_id: str) -> Dict[str, Any]:
        """
        Delete document and its chunks from vector database
        
        Args:
            document_id: Document ID to delete
        
        Returns:
            Success status
        """
        if document_id not in self.documents_metadata:
            return {"success": False, "message": "Document not found"}
        
        # Delete from vector database
        await self.vector_store.delete_document(document_id)
        
        # Delete physical file
        metadata = self.documents_metadata[document_id]
        file_path = Path(metadata["file_path"])
        if file_path.exists():
            file_path.unlink()
        
        # Remove from metadata
        del self.documents_metadata[document_id]
        self._save_metadata()
        
        return {"success": True, "message": "Document deleted successfully"}
    
    async def get_all_document_names(self) -> List[Dict[str, str]]:
        """
        Get all document names and IDs for @mention support
        
        Returns:
            List of dicts with 'id' and 'name' keys
        """
        return [
            {
                "id": doc_id,
                "name": metadata["filename"]
            }
            for doc_id, metadata in self.documents_metadata.items()
        ]
    
    def get_document_id_by_name(self, filename: str) -> Optional[str]:
        """
        Get document ID by filename
        
        Args:
            filename: Document filename
        
        Returns:
            Document ID or None if not found
        """
        for doc_id, metadata in self.documents_metadata.items():
            if metadata["filename"] == filename:
                return doc_id
        return None
    
    async def rename_document(self, document_id: str, new_name: str) -> Dict[str, Any]:
        """
        Rename a document
        
        Args:
            document_id: Document ID
            new_name: New filename
        
        Returns:
            Success status and updated metadata
        """
        if document_id not in self.documents_metadata:
            return {"success": False, "message": "Document not found"}
        
        # Update metadata
        old_name = self.documents_metadata[document_id]["filename"]
        self.documents_metadata[document_id]["filename"] = new_name
        self.documents_metadata[document_id]["metadata"]["original_filename"] = new_name
        
        # Update file path (rename physical file)
        old_path = Path(self.documents_metadata[document_id]["file_path"])
        new_path = old_path.parent / f"{document_id}_{new_name}"
        
        if old_path.exists():
            old_path.rename(new_path)
            self.documents_metadata[document_id]["file_path"] = str(new_path)
        
        self._save_metadata()
        
        return {
            "success": True,
            "message": "Document renamed successfully",
            "old_name": old_name,
            "new_name": new_name
        }
    
    async def get_document_for_download(
        self,
        document_id: str,
        add_watermark: bool = True
    ) -> Dict[str, Any]:
        """
        Get document file for download with optional watermark
        
        Args:
            document_id: Document ID
            add_watermark: Whether to add UB360.ai watermark
        
        Returns:
            Dict with file_path and filename
        """
        if document_id not in self.documents_metadata:
            raise ValueError("Document not found")
        
        metadata = self.documents_metadata[document_id]
        original_path = Path(metadata["file_path"])
        
        if not original_path.exists():
            raise FileNotFoundError(f"Document file not found: {original_path}")
        
        # Add watermark if requested
        if add_watermark:
            from services.watermark_service import WatermarkService
            
            # Create watermarked version
            watermarked_path = original_path.parent / f"temp_watermarked_{original_path.name}"
            watermarked_file = WatermarkService.add_watermark(
                str(original_path),
                str(watermarked_path)
            )
            
            # Format filename with UB360.ai branding
            branded_filename = WatermarkService.format_download_filename(
                metadata["filename"]
            )
            
            return {
                "file_path": watermarked_file,
                "filename": branded_filename,
                "is_temp": True  # Indicates file should be deleted after download
            }
        else:
            return {
                "file_path": str(original_path),
                "filename": metadata["filename"],
                "is_temp": False
            }

