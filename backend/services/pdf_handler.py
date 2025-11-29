"""
PDF document handler
Extracts text and metadata from PDF files
"""
import PyPDF2
import pdfplumber
from typing import Dict, Any, List
from pathlib import Path


class PDFHandler:
    """Handle PDF document processing"""
    
    @staticmethod
    def extract_text_and_metadata(file_path: str) -> Dict[str, Any]:
        """
        Extract text and metadata from PDF file
        
        Args:
            file_path: Path to PDF file
        
        Returns:
            Dictionary with text, metadata, and page information
        """
        result = {
            "text": "",
            "pages": [],
            "metadata": {
                "total_pages": 0,
                "author": None,
                "title": None,
                "subject": None,
                "creator": None,
                "producer": None,
                "creation_date": None
            }
        }
        
        try:
            # Extract text with page numbers using pdfplumber (better text extraction)
            with pdfplumber.open(file_path) as pdf:
                result["metadata"]["total_pages"] = len(pdf.pages)
                
                for page_num, page in enumerate(pdf.pages, start=1):
                    page_text = page.extract_text()
                    if page_text:
                        result["pages"].append({
                            "page_number": page_num,
                            "text": page_text
                        })
                        result["text"] += f"\n\n[Page {page_num}]\n{page_text}"
            
            # Extract metadata using PyPDF2
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                if pdf_reader.metadata:
                    metadata = pdf_reader.metadata
                    result["metadata"]["author"] = metadata.get('/Author')
                    result["metadata"]["title"] = metadata.get('/Title')
                    result["metadata"]["subject"] = metadata.get('/Subject')
                    result["metadata"]["creator"] = metadata.get('/Creator')
                    result["metadata"]["producer"] = metadata.get('/Producer')
                    
                    # Handle creation date
                    creation_date = metadata.get('/CreationDate')
                    if creation_date:
                        result["metadata"]["creation_date"] = str(creation_date)
            
            # Clean up text
            result["text"] = result["text"].strip()
            
            # Filter out None values from metadata (ChromaDB doesn't accept None)
            result["metadata"] = {
                k: v for k, v in result["metadata"].items() 
                if v is not None
            }
            
            return result
        
        except Exception as e:
            raise Exception(f"Error extracting PDF: {str(e)}")
    
    @staticmethod
    def extract_text_simple(file_path: str) -> str:
        """
        Simple text extraction without page tracking
        
        Args:
            file_path: Path to PDF file
        
        Returns:
            Extracted text
        """
        try:
            with pdfplumber.open(file_path) as pdf:
                text = ""
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n\n"
                return text.strip()
        except Exception as e:
            raise Exception(f"Error extracting PDF text: {str(e)}")
    
    @staticmethod
    def get_page_count(file_path: str) -> int:
        """
        Get number of pages in PDF
        
        Args:
            file_path: Path to PDF file
        
        Returns:
            Number of pages
        """
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                return len(pdf_reader.pages)
        except Exception as e:
            raise Exception(f"Error getting page count: {str(e)}")
