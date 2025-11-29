"""
Web scraper for extracting content from URLs
"""
import requests
from bs4 import BeautifulSoup
from typing import Dict, Any
from urllib.parse import urlparse
import re


class WebScraper:
    """Handle web page scraping"""
    
    @staticmethod
    def scrape_url(url: str, timeout: int = 10) -> Dict[str, Any]:
        """
        Scrape content from a URL
        
        Args:
            url: URL to scrape
            timeout: Request timeout in seconds
        
        Returns:
            Dictionary with text and metadata
        """
        result = {
            "text": "",
            "metadata": {
                "url": url,
                "title": None,
                "description": None,
                "author": None,
                "published_date": None,
                "domain": None,
                "word_count": 0
            }
        }
        
        try:
            # Make request
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.content, 'lxml')
            
            # Extract domain
            parsed_url = urlparse(url)
            result["metadata"]["domain"] = parsed_url.netloc
            
            # Extract title
            title_tag = soup.find('title')
            if title_tag:
                result["metadata"]["title"] = title_tag.get_text().strip()
            
            # Extract meta description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc and meta_desc.get('content'):
                result["metadata"]["description"] = meta_desc.get('content').strip()
            
            # Extract author
            meta_author = soup.find('meta', attrs={'name': 'author'})
            if meta_author and meta_author.get('content'):
                result["metadata"]["author"] = meta_author.get('content').strip()
            
            # Extract published date (various formats)
            date_selectors = [
                ('meta', {'property': 'article:published_time'}),
                ('meta', {'name': 'publish-date'}),
                ('meta', {'name': 'date'}),
                ('time', {'class': 'published'})
            ]
            
            for tag_name, attrs in date_selectors:
                date_tag = soup.find(tag_name, attrs=attrs)
                if date_tag:
                    if tag_name == 'meta':
                        result["metadata"]["published_date"] = date_tag.get('content', '').strip()
                    else:
                        result["metadata"]["published_date"] = date_tag.get_text().strip()
                    break
            
            # Remove unwanted elements
            for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
                element.decompose()
            
            # Extract main content
            # Try to find main content area
            main_content = (
                soup.find('article') or
                soup.find('main') or
                soup.find('div', class_=re.compile(r'content|article|post|entry', re.I)) or
                soup.find('body')
            )
            
            if main_content:
                # Extract text from paragraphs
                paragraphs = main_content.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'])
                text_parts = []
                
                for para in paragraphs:
                    text = para.get_text().strip()
                    if text and len(text) > 20:  # Filter out very short text
                        text_parts.append(text)
                
                result["text"] = "\n\n".join(text_parts)
            else:
                # Fallback: get all text
                result["text"] = soup.get_text(separator='\n', strip=True)
            
            # Clean up text
            result["text"] = WebScraper._clean_text(result["text"])
            
            # Calculate word count
            result["metadata"]["word_count"] = len(result["text"].split())
            
            # Filter out None values from metadata (ChromaDB doesn't accept None)
            result["metadata"] = {
                k: v for k, v in result["metadata"].items() 
                if v is not None
            }
            
            return result
        
        except requests.exceptions.Timeout:
            raise Exception(f"Request timeout: {url}")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error fetching URL: {str(e)}")
        except Exception as e:
            raise Exception(f"Error scraping URL: {str(e)}")
    
    @staticmethod
    def _clean_text(text: str) -> str:
        """
        Clean extracted text
        
        Args:
            text: Raw text
        
        Returns:
            Cleaned text
        """
        # Remove excessive whitespace
        text = re.sub(r'\n\s*\n', '\n\n', text)
        text = re.sub(r' +', ' ', text)
        
        # Remove very short lines (likely navigation/UI elements)
        lines = text.split('\n')
        cleaned_lines = [line for line in lines if len(line.strip()) > 3]
        
        return '\n'.join(cleaned_lines).strip()
    
    @staticmethod
    def is_valid_url(url: str) -> bool:
        """
        Check if URL is valid
        
        Args:
            url: URL to validate
        
        Returns:
            True if valid, False otherwise
        """
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False
