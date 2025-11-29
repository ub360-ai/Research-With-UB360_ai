"""
Configuration management for Research With UB360.ai
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    """Application settings"""
    
    # Application Info
    APP_NAME: str = "Research With UB360.ai"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "AI-Powered Research Assistant for Students"
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"]
    
    # Google Gemini API
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    GEMINI_TEMPERATURE: float = float(os.getenv("GEMINI_TEMPERATURE", "0.1"))
    
    # Vector Database
    CHROMA_PERSIST_DIR: str = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
    CHROMA_COLLECTION_NAME: str = os.getenv("CHROMA_COLLECTION_NAME", "research_documents")
    
    # Embedding Model
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    
    # Document Processing
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "50"))
    ALLOWED_EXTENSIONS: list = [".pdf", ".docx", ".txt", ".md"]
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "1000"))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "200"))
    
    # Upload Directory
    UPLOAD_DIR: Path = Path(os.getenv("UPLOAD_DIR", "./uploads"))
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    
    # Search Configuration
    DEFAULT_SEARCH_RESULTS: int = int(os.getenv("DEFAULT_SEARCH_RESULTS", "5"))
    MAX_SEARCH_RESULTS: int = int(os.getenv("MAX_SEARCH_RESULTS", "20"))
    
    # UB360.ai Branding
    BRAND_NAME: str = "UB360.ai"
    BRAND_HANDLE: str = "@ub360_ai"
    BRAND_PLATFORM: str = "X (Twitter)"
    BRAND_MESSAGE: str = "Follow @ub360_ai on X for AI, ML, Crypto, and Blockchain insights"
    BRAND_TAGLINE: str = "Research with UB360.ai | Free Forever"
    BRAND_WATERMARK: str = "Follow @ub360_ai on X"
    BRAND_FILENAME_SUFFIX: str = "..Follow ub360_ai on x"
    
    def __init__(self):
        """Initialize settings and create necessary directories"""
        self.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        Path(self.CHROMA_PERSIST_DIR).mkdir(parents=True, exist_ok=True)
    
    def validate(self) -> bool:
        """Validate critical settings"""
        if not self.GOOGLE_API_KEY:
            raise ValueError(
                "GOOGLE_API_KEY is required. Please set it in your .env file.\n"
                "Get your free API key at: https://aistudio.google.com/"
            )
        return True


# Global settings instance
settings = Settings()
