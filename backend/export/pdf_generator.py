"""
PDF report generator using ReportLab
"""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime
from typing import List, Dict, Any
from pathlib import Path
import io


class PDFGenerator:
    """Generate PDF reports for research findings"""
    
    @staticmethod
    def generate_research_report(
        title: str,
        queries: List[Dict[str, Any]],
        output_path: str = None
    ) -> bytes:
        """
        Generate a research report PDF
        
        Args:
            title: Report title
            queries: List of query results with answers and citations
            output_path: Optional file path to save PDF
        
        Returns:
            PDF content as bytes
        """
        # Create PDF buffer or file
        if output_path:
            pdf_buffer = output_path
        else:
            pdf_buffer = io.BytesIO()
        
        # Create document
        doc = SimpleDocTemplate(
            pdf_buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )
        
        # Container for the 'Flowable' objects
        elements = []
        
        # Define styles
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        )
        
        question_style = ParagraphStyle(
            'QuestionStyle',
            parent=styles['Heading3'],
            fontSize=12,
            textColor=colors.HexColor('#34495e'),
            spaceAfter=8,
            spaceBefore=16,
            fontName='Helvetica-Bold'
        )
        
        answer_style = ParagraphStyle(
            'AnswerStyle',
            parent=styles['BodyText'],
            fontSize=11,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=12,
            alignment=TA_JUSTIFY,
            leading=14
        )
        
        citation_style = ParagraphStyle(
            'CitationStyle',
            parent=styles['BodyText'],
            fontSize=9,
            textColor=colors.HexColor('#7f8c8d'),
            leftIndent=20,
            spaceAfter=6,
            leading=11
        )
        
        # Add title
        elements.append(Paragraph(title, title_style))
        elements.append(Spacer(1, 12))
        
        # Add metadata
        metadata_text = f"Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"
        elements.append(Paragraph(metadata_text, styles['Normal']))
        elements.append(Spacer(1, 12))
        
        # Add horizontal line
        elements.append(Spacer(1, 12))
        
        # Add queries and answers
        for idx, query_data in enumerate(queries, 1):
            # Question
            question_text = f"<b>Q{idx}:</b> {query_data.get('question', 'N/A')}"
            elements.append(Paragraph(question_text, question_style))
            
            # Answer
            answer_text = query_data.get('answer', 'No answer provided')
            elements.append(Paragraph(answer_text, answer_style))
            elements.append(Spacer(1, 8))
            
            # Citations
            citations = query_data.get('citations', [])
            if citations:
                elements.append(Paragraph("<b>Sources:</b>", citation_style))
                for cite_idx, citation in enumerate(citations[:5], 1):  # Limit to top 5
                    doc_name = citation.get('document_name', 'Unknown')
                    page_num = citation.get('page_number')
                    score = citation.get('relevance_score', 0)
                    
                    cite_text = f"{cite_idx}. {doc_name}"
                    if page_num:
                        cite_text += f" (Page {page_num})"
                    cite_text += f" - Relevance: {score:.2%}"
                    
                    elements.append(Paragraph(cite_text, citation_style))
            
            elements.append(Spacer(1, 20))
        
        # Build PDF
        doc.build(elements)
        
        # Return bytes if using BytesIO
        if isinstance(pdf_buffer, io.BytesIO):
            return pdf_buffer.getvalue()
        return None
    
    @staticmethod
    def generate_bibliography(
        documents: List[Dict[str, Any]],
        style: str = "APA",
        output_path: str = None
    ) -> bytes:
        """
        Generate a bibliography PDF
        
        Args:
            documents: List of document metadata
            style: Citation style (APA, MLA, Chicago)
            output_path: Optional file path to save PDF
        
        Returns:
            PDF content as bytes
        """
        # Create PDF buffer or file
        if output_path:
            pdf_buffer = output_path
        else:
            pdf_buffer = io.BytesIO()
        
        # Create document
        doc = SimpleDocTemplate(
            pdf_buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )
        
        elements = []
        styles = getSampleStyleSheet()
        
        # Title
        title_style = ParagraphStyle(
            'BibTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=20,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        elements.append(Paragraph(f"Bibliography ({style} Style)", title_style))
        elements.append(Spacer(1, 20))
        
        # Bibliography entries
        entry_style = ParagraphStyle(
            'BibEntry',
            parent=styles['BodyText'],
            fontSize=11,
            textColor=colors.HexColor('#2c3e50'),
            leftIndent=36,
            firstLineIndent=-36,
            spaceAfter=12,
            leading=14
        )
        
        # Sort documents alphabetically by filename
        sorted_docs = sorted(documents, key=lambda x: x.get('filename', ''))
        
        for doc in sorted_docs:
            citation_text = PDFGenerator._format_citation(doc, style)
            elements.append(Paragraph(citation_text, entry_style))
        
        # Build PDF
        doc.build(elements)
        
        # Return bytes if using BytesIO
        if isinstance(pdf_buffer, io.BytesIO):
            return pdf_buffer.getvalue()
        return None
    
    @staticmethod
    def _format_citation(doc: Dict[str, Any], style: str) -> str:
        """
        Format a single citation
        
        Args:
            doc: Document metadata
            style: Citation style
        
        Returns:
            Formatted citation string
        """
        metadata = doc.get('metadata', {})
        filename = doc.get('filename', 'Unknown')
        doc_type = doc.get('document_type', 'unknown')
        
        # Extract common fields
        author = metadata.get('author', 'Unknown Author')
        title = metadata.get('title', filename)
        year = 'n.d.'
        
        # Try to extract year from dates
        if 'creation_date' in metadata:
            try:
                year = metadata['creation_date'][:4]
            except:
                pass
        elif 'created' in metadata:
            try:
                year = metadata['created'][:4]
            except:
                pass
        
        # Format based on style
        if style.upper() == "APA":
            # APA: Author. (Year). Title.
            citation = f"{author}. ({year}). <i>{title}</i>."
            if doc_type == "url":
                url = metadata.get('url', '')
                citation += f" Retrieved from {url}"
        
        elif style.upper() == "MLA":
            # MLA: Author. "Title." Year.
            citation = f"{author}. \"{title}.\" {year}."
        
        elif style.upper() == "CHICAGO":
            # Chicago: Author. Title. Year.
            citation = f"{author}. <i>{title}</i>. {year}."
        
        else:
            # Default format
            citation = f"{author}. {title}. {year}."
        
        return citation
