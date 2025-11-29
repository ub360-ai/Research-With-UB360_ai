"""
Export manager for handling all export operations
"""
from typing import List, Dict, Any, Optional
from pathlib import Path
from datetime import datetime
import json

from export.pdf_generator import PDFGenerator
from export.docx_generator import DOCXGenerator


class ExportManager:
    """Manage export operations for research data"""
    
    def __init__(self, export_dir: str = "./exports"):
        """
        Initialize export manager
        
        Args:
            export_dir: Directory to store exported files
        """
        self.export_dir = Path(export_dir)
        self.export_dir.mkdir(parents=True, exist_ok=True)
    
    async def export_research_report(
        self,
        title: str,
        queries: List[Dict[str, Any]],
        format: str = "pdf"
    ) -> Dict[str, Any]:
        """
        Export research report
        
        Args:
            title: Report title
            queries: List of query results
            format: Export format (pdf, docx)
        
        Returns:
            Dictionary with file path and metadata
        """
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_title = safe_title.replace(' ', '_')[:50]
        
        if format.lower() == "pdf":
            filename = f"{safe_title}_{timestamp}.pdf"
            file_path = self.export_dir / filename
            
            # Generate PDF
            pdf_bytes = PDFGenerator.generate_research_report(
                title=title,
                queries=queries,
                output_path=str(file_path)
            )
            
            return {
                "success": True,
                "format": "pdf",
                "filename": filename,
                "file_path": str(file_path),
                "file_size": file_path.stat().st_size,
                "num_queries": len(queries)
            }
        
        elif format.lower() == "docx":
            filename = f"{safe_title}_{timestamp}.docx"
            file_path = self.export_dir / filename
            
            # Generate DOCX
            docx_bytes = DOCXGenerator.generate_research_report(
                title=title,
                queries=queries,
                output_path=str(file_path)
            )
            
            return {
                "success": True,
                "format": "docx",
                "filename": filename,
                "file_path": str(file_path),
                "file_size": file_path.stat().st_size,
                "num_queries": len(queries)
            }
        
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    async def export_bibliography(
        self,
        documents: List[Dict[str, Any]],
        style: str = "APA",
        format: str = "pdf"
    ) -> Dict[str, Any]:
        """
        Export bibliography
        
        Args:
            documents: List of document metadata
            style: Citation style (APA, MLA, Chicago)
            format: Export format (pdf, docx)
        
        Returns:
            Dictionary with file path and metadata
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if format.lower() == "pdf":
            filename = f"bibliography_{style}_{timestamp}.pdf"
            file_path = self.export_dir / filename
            
            PDFGenerator.generate_bibliography(
                documents=documents,
                style=style,
                output_path=str(file_path)
            )
            
            return {
                "success": True,
                "format": "pdf",
                "style": style,
                "filename": filename,
                "file_path": str(file_path),
                "file_size": file_path.stat().st_size,
                "num_documents": len(documents)
            }
        
        elif format.lower() == "docx":
            filename = f"bibliography_{style}_{timestamp}.docx"
            file_path = self.export_dir / filename
            
            DOCXGenerator.generate_bibliography(
                documents=documents,
                style=style,
                output_path=str(file_path)
            )
            
            return {
                "success": True,
                "format": "docx",
                "style": style,
                "filename": filename,
                "file_path": str(file_path),
                "file_size": file_path.stat().st_size,
                "num_documents": len(documents)
            }
        
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    async def export_query_history(
        self,
        queries: List[Dict[str, Any]],
        format: str = "json"
    ) -> Dict[str, Any]:
        """
        Export query history
        
        Args:
            queries: List of queries
            format: Export format (json, txt)
        
        Returns:
            Dictionary with file path and metadata
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if format.lower() == "json":
            filename = f"query_history_{timestamp}.json"
            file_path = self.export_dir / filename
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(queries, f, indent=2, default=str)
            
            return {
                "success": True,
                "format": "json",
                "filename": filename,
                "file_path": str(file_path),
                "file_size": file_path.stat().st_size,
                "num_queries": len(queries)
            }
        
        elif format.lower() == "txt":
            filename = f"query_history_{timestamp}.txt"
            file_path = self.export_dir / filename
            
            with open(file_path, 'w', encoding='utf-8') as f:
                for idx, query in enumerate(queries, 1):
                    f.write(f"Query {idx}\n")
                    f.write(f"Question: {query.get('query', 'N/A')}\n")
                    f.write(f"Type: {query.get('query_type', 'N/A')}\n")
                    f.write(f"Answer: {query.get('answer', 'N/A')}\n")
                    f.write(f"Timestamp: {query.get('timestamp', 'N/A')}\n")
                    f.write("\n" + "="*80 + "\n\n")
            
            return {
                "success": True,
                "format": "txt",
                "filename": filename,
                "file_path": str(file_path),
                "file_size": file_path.stat().st_size,
                "num_queries": len(queries)
            }
        
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    async def export_summary(
        self,
        title: str,
        summary_text: str,
        sources: List[Dict[str, Any]],
        format: str = "docx"
    ) -> Dict[str, Any]:
        """
        Export research summary
        
        Args:
            title: Summary title
            summary_text: Summary content
            sources: List of source documents
            format: Export format (docx, pdf, txt)
        
        Returns:
            Dictionary with file path and metadata
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_title = safe_title.replace(' ', '_')[:50]
        
        if format.lower() == "docx":
            filename = f"summary_{safe_title}_{timestamp}.docx"
            file_path = self.export_dir / filename
            
            DOCXGenerator.generate_summary(
                title=title,
                summary_text=summary_text,
                sources=sources,
                output_path=str(file_path)
            )
            
            return {
                "success": True,
                "format": "docx",
                "filename": filename,
                "file_path": str(file_path),
                "file_size": file_path.stat().st_size
            }
        
        elif format.lower() == "txt":
            filename = f"summary_{safe_title}_{timestamp}.txt"
            file_path = self.export_dir / filename
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(f"{title}\n")
                f.write(f"{'='*len(title)}\n\n")
                f.write(f"Generated: {datetime.now().strftime('%B %d, %Y')}\n\n")
                f.write(summary_text)
                f.write("\n\n")
                f.write("Sources:\n")
                f.write("-"*40 + "\n")
                for idx, source in enumerate(sources, 1):
                    f.write(f"{idx}. {source.get('document_name', 'Unknown')}\n")
            
            return {
                "success": True,
                "format": "txt",
                "filename": filename,
                "file_path": str(file_path),
                "file_size": file_path.stat().st_size
            }
        
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    def list_exports(self) -> List[Dict[str, Any]]:
        """
        List all exported files
        
        Returns:
            List of export metadata
        """
        exports = []
        for file_path in self.export_dir.iterdir():
            if file_path.is_file():
                exports.append({
                    "filename": file_path.name,
                    "file_path": str(file_path),
                    "file_size": file_path.stat().st_size,
                    "created": datetime.fromtimestamp(file_path.stat().st_ctime).isoformat(),
                    "format": file_path.suffix[1:]  # Remove the dot
                })
        
        # Sort by creation date (newest first)
        exports.sort(key=lambda x: x["created"], reverse=True)
        return exports
