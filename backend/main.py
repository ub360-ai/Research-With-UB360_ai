"""
Research With UB360.ai - Main FastAPI Application
AI-Powered Research Assistant for Students
Privacy-First: Data automatically deleted after 48 hours
Optimized for Choreo Deployment
"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from datetime import datetime

from config import settings
from api.v1 import documents, queries, health, export
from services.cleanup_scheduler import DataCleanupScheduler
from middleware.rate_limiter import rate_limiter

# Initialize cleanup scheduler
cleanup_scheduler = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    global cleanup_scheduler
    
    # Startup
    print("=" * 60)
    print(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    print("=" * 60)
    
    # Validate configuration
    try:
        settings.validate()
        print("✅ Configuration validated")
        print(f"✅ Using Gemini model: {settings.GEMINI_MODEL}")
        print(f"✅ Embedding model: {settings.EMBEDDING_MODEL}")
        print(f"✅ Upload directory: {settings.UPLOAD_DIR}")
        print(f"✅ ChromaDB directory: {settings.CHROMA_PERSIST_DIR}")
    except ValueError as e:
        print(f"❌ Configuration error: {e}")
        raise
    
    # Start cleanup scheduler for privacy
    cleanup_scheduler = DataCleanupScheduler()
    cleanup_scheduler.start()
    
    print("=" * 60)
    print("📚 Research With UB360.ai is ready!")
    print(f"📖 API Documentation: http://localhost:8000/docs")
    print("=" * 60)
    
    yield
    
    # Shutdown
    print("\n👋 Shutting down Research With UB360.ai...")
    if cleanup_scheduler:
        cleanup_scheduler.stop()


# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware - Choreo Compatible
allowed_origins = settings.CORS_ORIGINS.copy()

# Add Choreo domains if in production
if os.getenv("CHOREO_ENV") == "production":
    allowed_origins.extend([
        "https://*.choreoapis.dev",
        "https://*.choreo.dev",
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to all responses"""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Rate Limiting Middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Apply rate limiting to all requests"""
    # Skip rate limiting for health checks
    if request.url.path == "/api/v1/health":
        return await call_next(request)
    
    # Apply rate limiting
    await rate_limiter(request)
    return await call_next(request)


# Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc),
            "status_code": 500
        }
    )


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "success": True,
        "message": f"Welcome to {settings.APP_NAME}!",
        "version": settings.APP_VERSION,
        "description": settings.APP_DESCRIPTION,
        "docs": "/docs",
        "health": "/api/v1/health"
    }


# Include routers
app.include_router(health.router, prefix=settings.API_V1_PREFIX, tags=["Health"])
app.include_router(documents.router, prefix=settings.API_V1_PREFIX, tags=["Documents"])
app.include_router(queries.router, prefix=settings.API_V1_PREFIX, tags=["Queries"])
app.include_router(export.router, prefix=settings.API_V1_PREFIX, tags=["Export"])


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
