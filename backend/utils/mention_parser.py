"""
Document Mention Parser
Allows users to mention specific documents using @documentname syntax
"""
import re
from typing import Dict, List, Optional
from difflib import get_close_matches


class MentionParser:
    """Parse @mentions from user queries"""
    
    @staticmethod
    def parse_mentions(
        query: str,
        available_documents: List[Dict[str, str]]
    ) -> Dict[str, any]:
        """
        Parse @mentions from query and match to actual documents
        
        Args:
            query: User's query with potential @mentions
            available_documents: List of dicts with 'id' and 'name' keys
        
        Returns:
            {
                'clean_query': str (query without @mentions),
                'mentioned_docs': List[str] (document IDs),
                'mentioned_names': List[str] (document names),
                'has_mentions': bool
            }
        
        Examples:
            "@research_paper what is the main conclusion?"
            "@paper1 @paper2 compare these documents"
            "explain AI using @ml_book"
        """
        # Find all @mentions in the query
        mention_pattern = r'@(\w+)'
        raw_mentions = re.findall(mention_pattern, query)
        
        if not raw_mentions:
            return {
                'clean_query': query,
                'mentioned_docs': [],
                'mentioned_names': [],
                'has_mentions': False
            }
        
        # Get all document names for matching
        doc_names = [doc['name'] for doc in available_documents]
        doc_map = {doc['name']: doc['id'] for doc in available_documents}
        
        matched_docs = []
        matched_names = []
        
        for mention in raw_mentions:
            # Try exact match first (case-insensitive)
            exact_match = None
            for doc_name in doc_names:
                if mention.lower() == doc_name.lower().replace(' ', '_').replace('.', '_'):
                    exact_match = doc_name
                    break
            
            if exact_match:
                matched_docs.append(doc_map[exact_match])
                matched_names.append(exact_match)
            else:
                # Try fuzzy matching
                # Convert mention to searchable format
                search_term = mention.replace('_', ' ')
                close_matches = get_close_matches(
                    search_term.lower(),
                    [name.lower() for name in doc_names],
                    n=1,
                    cutoff=0.6
                )
                
                if close_matches:
                    # Find original case name
                    for doc_name in doc_names:
                        if doc_name.lower() == close_matches[0]:
                            matched_docs.append(doc_map[doc_name])
                            matched_names.append(doc_name)
                            break
        
        # Remove @mentions from query
        clean_query = re.sub(mention_pattern, '', query).strip()
        # Clean up extra spaces
        clean_query = re.sub(r'\s+', ' ', clean_query)
        
        return {
            'clean_query': clean_query,
            'mentioned_docs': list(set(matched_docs)),  # Remove duplicates
            'mentioned_names': list(set(matched_names)),
            'has_mentions': len(matched_docs) > 0
        }
    
    @staticmethod
    def get_mention_suggestions(
        partial_mention: str,
        available_documents: List[Dict[str, str]],
        limit: int = 5
    ) -> List[str]:
        """
        Get autocomplete suggestions for partial @mention
        
        Args:
            partial_mention: Partial document name (e.g., "res" for "research_paper")
            available_documents: List of available documents
            limit: Maximum suggestions to return
        
        Returns:
            List of suggested document names
        """
        if not partial_mention:
            return []
        
        doc_names = [doc['name'] for doc in available_documents]
        
        # Find names that start with the partial mention
        suggestions = [
            name for name in doc_names
            if name.lower().startswith(partial_mention.lower())
        ]
        
        # If no exact prefix matches, try fuzzy matching
        if not suggestions:
            suggestions = get_close_matches(
                partial_mention.lower(),
                [name.lower() for name in doc_names],
                n=limit,
                cutoff=0.4
            )
            # Convert back to original case
            suggestions = [
                name for name in doc_names
                if name.lower() in suggestions
            ]
        
        return suggestions[:limit]
    
    @staticmethod
    def format_mention_name(document_name: str) -> str:
        """
        Format document name for @mention usage
        
        Args:
            document_name: Original document name
        
        Returns:
            Formatted name for @mention (e.g., "My Document.pdf" -> "my_document")
        """
        # Remove extension
        name = document_name.rsplit('.', 1)[0] if '.' in document_name else document_name
        # Replace spaces and special chars with underscore
        name = re.sub(r'[^\w]+', '_', name)
        # Convert to lowercase
        name = name.lower()
        # Remove trailing underscores
        name = name.strip('_')
        return name
