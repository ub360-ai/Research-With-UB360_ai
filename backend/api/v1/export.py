"""
Export API endpoints - Chat History Only
Redesigned for Phase 4: Professional chat history exports with UB360.ai branding
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from export.chat_exporter import ChatExporter

router = APIRouter()


class Message(BaseModel):
    """Message model for export"""
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: Optional[str] = None


class ConversationExportRequest(BaseModel):
    """Request model for single conversation export"""
    title: str
    messages: List[Message]
    format: str = 'pdf'  # 'pdf', 'docx', or 'json'


class MultiConversationExportRequest(BaseModel):
    """Request model for multiple conversation exports"""
    conversations: List[Dict[str, Any]]  # List of {title, messages}
    format: str = 'pdf'


@router.post("/export/conversation")
async def export_conversation(request: ConversationExportRequest):
    """
    Export a single conversation as PDF, DOCX, or JSON
    
    Args:
        request: Conversation data with title, messages, and format
    
    Returns:
        File download with UB360.ai branding
        Filename format: "{title}..Follow ub360_ai on x.{format}"
    
    Examples:
        PDF: Professional report with watermarks
        DOCX: Editable document with headers/footers
        JSON: Structured data with metadata
    """
    try:
        # Validate format
        if request.format not in ['pdf', 'docx', 'json']:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid format: {request.format}. Use 'pdf', 'docx', or 'json'"
            )
        
        # Convert messages to dict
        messages_dict = [msg.dict() for msg in request.messages]
        
        # Export conversation
        file_bytes = ChatExporter.export_conversation(
            conversation_title=request.title,
            messages=messages_dict,
            format=request.format
        )
        
        # Format filename with UB360.ai branding
        filename = ChatExporter.format_export_filename(request.title, request.format)
        
        # Determine media type
        media_types = {
            'pdf': 'application/pdf',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'json': 'application/json'
        }
        
        return Response(
            content=file_bytes,
            media_type=media_types[request.format],
            headers={
                'Content-Disposition': f'attachment; filename="{filename}"'
            }
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error exporting conversation: {str(e)}"
        )


@router.post("/export/conversations/batch")
async def export_multiple_conversations(request: MultiConversationExportRequest):
    """
    Export multiple conversations as separate files (returns zip)
    
    Args:
        request: List of conversations with format
    
    Returns:
        ZIP file containing all exported conversations
        Each file branded with UB360.ai
    
    Note: This endpoint returns a ZIP file containing multiple exports
    """
    import zipfile
    from io import BytesIO
    
    try:
        # Validate format
        if request.format not in ['pdf', 'docx', 'json']:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid format: {request.format}"
            )
        
        # Create ZIP file in memory
        zip_buffer = BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for conv in request.conversations:
                title = conv.get('title', 'Untitled Conversation')
                messages = conv.get('messages', [])
                
                # Export conversation
                file_bytes = ChatExporter.export_conversation(
                    conversation_title=title,
                    messages=messages,
                    format=request.format
                )
                
                # Format filename
                filename = ChatExporter.format_export_filename(title, request.format)
                
                # Add to ZIP
                zip_file.writestr(filename, file_bytes)
        
        zip_buffer.seek(0)
        
        return Response(
            content=zip_buffer.getvalue(),
            media_type='application/zip',
            headers={
                'Content-Disposition': f'attachment; filename="chat_histories..Follow ub360_ai on x.zip"'
            }
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error exporting conversations: {str(e)}"
        )


@router.get("/export/formats")
async def get_export_formats():
    """
    Get available export formats and their descriptions
    
    Returns:
        List of supported formats with details
    """
    return {
        "success": True,
        "formats": [
            {
                "format": "pdf",
                "name": "PDF Document",
                "description": "Professional PDF with UB360.ai watermarks and branding",
                "features": [
                    "Diagonal watermarks",
                    "Header and footer branding",
                    "Color-coded messages",
                    "Professional layout"
                ]
            },
            {
                "format": "docx",
                "name": "Word Document",
                "description": "Editable DOCX with headers and footers",
                "features": [
                    "Header with UB360.ai branding",
                    "Footer with promotion",
                    "Editable content",
                    "Professional formatting"
                ]
            },
            {
                "format": "json",
                "name": "JSON Data",
                "description": "Structured data with metadata",
                "features": [
                    "Complete message history",
                    "Timestamps",
                    "UB360.ai metadata",
                    "Easy to parse"
                ]
            }
        ],
        "branding": {
            "filename_format": "{title}..Follow ub360_ai on x.{format}",
            "watermark": "Follow @ub360_ai on X",
            "tagline": "Research with UB360.ai | Free Forever"
        }
    }
