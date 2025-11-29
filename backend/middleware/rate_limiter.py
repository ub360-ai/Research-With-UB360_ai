"""
Rate Limiting Middleware for API Protection
Prevents abuse and ensures fair usage
"""
from fastapi import Request, HTTPException
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Dict, List
import asyncio


class RateLimiter:
    """
    Rate limiter to prevent API abuse
    Tracks requests per IP address
    """
    
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, List[datetime]] = defaultdict(list)
        self._cleanup_task = None
    
    async def __call__(self, request: Request):
        """Check if request should be rate limited"""
        # Get client IP
        client_ip = request.client.host
        
        # Get current time
        now = datetime.now()
        
        # Clean old requests (older than 1 minute)
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if now - req_time < timedelta(minutes=1)
        ]
        
        # Check if limit exceeded
        if len(self.requests[client_ip]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Rate limit exceeded",
                    "message": f"Maximum {self.requests_per_minute} requests per minute allowed",
                    "retry_after": 60
                }
            )
        
        # Add current request
        self.requests[client_ip].append(now)
    
    async def cleanup_old_entries(self):
        """Periodically clean up old entries to prevent memory bloat"""
        while True:
            await asyncio.sleep(300)  # Clean every 5 minutes
            now = datetime.now()
            
            # Remove IPs with no recent requests
            ips_to_remove = []
            for ip, requests in self.requests.items():
                # Keep only requests from last minute
                recent_requests = [
                    req_time for req_time in requests
                    if now - req_time < timedelta(minutes=1)
                ]
                
                if not recent_requests:
                    ips_to_remove.append(ip)
                else:
                    self.requests[ip] = recent_requests
            
            # Remove empty IPs
            for ip in ips_to_remove:
                del self.requests[ip]


# Global rate limiter instance
rate_limiter = RateLimiter(requests_per_minute=60)
