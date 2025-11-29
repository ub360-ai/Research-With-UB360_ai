"""
Health check endpoint
"""
from fastapi import APIRouter
from datetime import datetime
from config import settings
from api.models import HealthResponse
import os

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    
    Returns:
        HealthResponse: System health status
    """
    # Check if Gemini API key is configured
    gemini_configured = bool(settings.GOOGLE_API_KEY)
    
    # Check database directory
    db_exists = os.path.exists(settings.CHROMA_PERSIST_DIR)
    database_status = "ready" if db_exists else "not_initialized"
    
    # Overall status
    status = "healthy" if gemini_configured and db_exists else "degraded"
    
    return HealthResponse(
        success=True,
        status=status,
        version=settings.APP_VERSION,
        gemini_configured=gemini_configured,
        database_status=database_status,
        timestamp=datetime.now()
    )
