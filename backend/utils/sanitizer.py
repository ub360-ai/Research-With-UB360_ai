"""
Data Sanitization Utilities
Cleans and validates user inputs to prevent security issues
"""
import re
import bleach
from pathlib import Path


def sanitize_filename(filename: str) -> str:
    """
    Remove dangerous characters from filename
    Prevents path traversal and other file-based attacks
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename safe for filesystem operations
    """
    # Remove path traversal attempts
    filename = filename.replace('..', '').replace('/', '').replace('\\', '')
    
    # Remove any null bytes
    filename = filename.replace('\x00', '')
    
    # Keep only alphanumeric, dots, hyphens, underscores
    filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
    
    # Ensure filename isn't empty
    if not filename or filename == '.':
        filename = 'unnamed_file'
    
    # Limit length
    if len(filename) > 255:
        # Keep extension
        name, ext = Path(filename).stem, Path(filename).suffix
        filename = name[:255-len(ext)] + ext
    
    return filename


def sanitize_text(text: str, max_length: int = 10000) -> str:
    """
    Sanitize user input text
    Removes HTML tags and excessive whitespace
    
    Args:
        text: User input text
        max_length: Maximum allowed length
        
    Returns:
        Sanitized text
    """
    # Remove HTML tags
    text = bleach.clean(text, tags=[], strip=True)
    
    # Remove excessive whitespace
    text = ' '.join(text.split())
    
    # Limit length
    if len(text) > max_length:
        text = text[:max_length]
    
    return text


def sanitize_path(path: str, base_dir: str) -> str:
    """
    Ensure path is within allowed directory
    Prevents directory traversal attacks
    
    Args:
        path: User-provided path
        base_dir: Base directory that path must be within
        
    Returns:
        Sanitized absolute path
        
    Raises:
        ValueError: If path attempts to escape base directory
    """
    # Resolve to absolute path
    base = Path(base_dir).resolve()
    target = (base / path).resolve()
    
    # Ensure target is within base directory
    try:
        target.relative_to(base)
    except ValueError:
        raise ValueError(f"Path {path} attempts to escape base directory")
    
    return str(target)


def validate_file_extension(filename: str, allowed_extensions: list) -> bool:
    """
    Check if file has an allowed extension
    
    Args:
        filename: Filename to check
        allowed_extensions: List of allowed extensions (e.g., ['.pdf', '.docx'])
        
    Returns:
        True if extension is allowed, False otherwise
    """
    ext = Path(filename).suffix.lower()
    return ext in [e.lower() for e in allowed_extensions]


def sanitize_url(url: str) -> str:
    """
    Basic URL sanitization
    
    Args:
        url: URL to sanitize
        
    Returns:
        Sanitized URL
    """
    # Remove whitespace
    url = url.strip()
    
    # Ensure protocol is present
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # Remove any null bytes or control characters
    url = ''.join(char for char in url if ord(char) >= 32)
    
    return url


def truncate_text(text: str, max_length: int = 1000, suffix: str = '...') -> str:
    """
    Truncate text to maximum length with suffix
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        suffix: Suffix to add if truncated
        
    Returns:
        Truncated text
    """
    if len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)] + suffix
