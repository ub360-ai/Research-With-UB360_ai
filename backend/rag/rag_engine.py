"""
RAG Engine with Google Gemini integration
"""
from typing import Dict, Any, List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import json
from datetime import datetime

from config import settings
from database.vector_store import VectorStore
from rag.prompts import PromptTemplates


class RAGEngine:
    """RAG Engine using Google Gemini"""
    
    def __init__(self):
        """Initialize RAG engine with Gemini"""
        # Initialize Gemini LLM
        print(f"🤖 Initializing Google Gemini: {settings.GEMINI_MODEL}")
        self.llm = ChatGoogleGenerativeAI(
            google_api_key=settings.GOOGLE_API_KEY,
            model=settings.GEMINI_MODEL,
            temperature=settings.GEMINI_TEMPERATURE
        )
        
        # Initialize vector store
        self.vector_store = VectorStore()
        
        # Initialize prompt templates
        self.prompts = PromptTemplates()
        
        # Query history (in-memory for Phase 1)
        self.query_history = []
        
        print("✅ RAG Engine initialized with Google Gemini")
    
    def _format_citations(self, search_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Format search results into citations
        
        Args:
            search_results: Raw search results from vector store
        
        Returns:
            Formatted citations
        """
        citations = []
        for result in search_results:
            metadata = result["metadata"]
            citations.append({
                "document_id": result["document_id"],
                "document_name": metadata.get("filename", "Unknown"),
                "chunk_id": result["chunk_id"],
                "page_number": metadata.get("page_number"),
                "relevance_score": result["similarity_score"],
                "text_snippet": result["chunk_text"][:200] + "..." if len(result["chunk_text"]) > 200 else result["chunk_text"]
            })
        return citations
    
    def _save_to_history(self, query: str, query_type: str, answer: str):
        """Save query to history"""
        self.query_history.append({
            "timestamp": datetime.now().isoformat(),
            "query": query,
            "query_type": query_type,
            "answer": answer[:200] + "..." if len(answer) > 200 else answer
        })
        # Keep only last 100 queries
        if len(self.query_history) > 100:
            self.query_history = self.query_history[-100:]
    
    async def answer_question(
        self,
        question: str,
        n_results: int = 5,
        document_ids: Optional[List[str]] = None,
        conversation_history: List[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Answer a question using RAG or general knowledge (Professor UB360 mode)
        
        Args:
            question: User's question
            n_results: Number of context chunks to retrieve
            document_ids: Optional filter by document IDs
            conversation_history: Previous conversation messages for context
        
        Returns:
            Answer with citations (if documents available)
        """
        # Format conversation history
        if conversation_history is None:
            conversation_history = []
        history_text = self.prompts.format_conversation_history(conversation_history)
        
        # Search for relevant context
        search_results = await self.vector_store.search(
            query=question,
            n_results=n_results,
            document_ids=document_ids
        )
        
        # If no documents, use general knowledge (Professor mode)
        if not search_results:
            print("📚 No documents found - Professor UB360 using general knowledge")
            prompt_template = ChatPromptTemplate.from_template(self.prompts.GENERAL_CHAT_TEMPLATE)
            chain = prompt_template | self.llm | StrOutputParser()
            
            answer = chain.invoke({
                "question": question,
                "conversation_history": history_text
            })
            
            self._save_to_history(question, "answer", answer)
            
            return {
                "answer": answer,
                "citations": [],
                "metadata": {
                    "context_found": False,
                    "mode": "general_knowledge",
                    "professor_mode": True,
                    "used_conversation_history": len(conversation_history) > 0
                }
            }
        
        # With documents - use RAG with Professor persona
        context = "\n\n".join([
            f"[Source: {r['metadata'].get('filename', 'Unknown')}]\n{r['chunk_text']}"
            for r in search_results
        ])
        
        # Create prompt with Professor UB360 persona and conversation history
        prompt_template = ChatPromptTemplate.from_template(self.prompts.ANSWER_TEMPLATE)
        chain = prompt_template | self.llm | StrOutputParser()
        
        # Generate answer with conversation context
        answer = chain.invoke({
            "context": context,
            "question": question,
            "conversation_history": history_text
        })
        
        # Format citations
        citations = self._format_citations(search_results)
        
        # Save to history
        self._save_to_history(question, "answer", answer)
        
        return {
            "answer": answer,
            "citations": citations,
            "metadata": {
                "context_found": True,
                "num_sources": len(search_results),
                "professor_mode": True,
                "used_conversation_history": len(conversation_history) > 0
            }
        }

    
    async def summarize_documents(
        self,
        query: str,
        n_results: int = 10,
        document_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Summarize documents related to a query
        
        Args:
            query: Topic or query to summarize
            n_results: Number of chunks to include
            document_ids: Optional filter by document IDs
        
        Returns:
            Summary with citations
        """
        # Search for relevant content
        search_results = await self.vector_store.search(
            query=query,
            n_results=n_results,
            document_ids=document_ids
        )
        
        if not search_results:
            return {
                "answer": "No documents found to summarize.",
                "citations": [],
                "metadata": {"context_found": False}
            }
        
        # Combine context
        context = "\n\n".join([r['chunk_text'] for r in search_results])
        
        # Create prompt
        prompt_template = ChatPromptTemplate.from_template(self.prompts.SUMMARIZE_TEMPLATE)
        chain = prompt_template | self.llm | StrOutputParser()
        
        # Generate summary
        summary = chain.invoke({
            "context": context,
            "topic": query
        })
        
        # Format citations
        citations = self._format_citations(search_results)
        
        # Save to history
        self._save_to_history(query, "summarize", summary)
        
        return {
            "answer": summary,
            "citations": citations,
            "metadata": {
                "context_found": True,
                "num_sources": len(search_results)
            }
        }
    
    async def compare_documents(
        self,
        query: str,
        n_results: int = 10,
        document_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Compare information across documents
        
        Args:
            query: Comparison query
            n_results: Number of chunks to include
            document_ids: Optional filter by document IDs
        
        Returns:
            Comparison with citations
        """
        search_results = await self.vector_store.search(
            query=query,
            n_results=n_results,
            document_ids=document_ids
        )
        
        if not search_results:
            return {
                "answer": "No documents found to compare.",
                "citations": [],
                "metadata": {"context_found": False}
            }
        
        # Group by document
        docs_context = {}
        for result in search_results:
            doc_name = result['metadata'].get('filename', 'Unknown')
            if doc_name not in docs_context:
                docs_context[doc_name] = []
            docs_context[doc_name].append(result['chunk_text'])
        
        # Format context
        context = "\n\n".join([
            f"Document: {doc_name}\n{' '.join(chunks)}"
            for doc_name, chunks in docs_context.items()
        ])
        
        # Create prompt
        prompt_template = ChatPromptTemplate.from_template(self.prompts.COMPARE_TEMPLATE)
        chain = prompt_template | self.llm | StrOutputParser()
        
        # Generate comparison
        comparison = chain.invoke({
            "context": context,
            "query": query
        })
        
        citations = self._format_citations(search_results)
        self._save_to_history(query, "compare", comparison)
        
        return {
            "answer": comparison,
            "citations": citations,
            "metadata": {
                "context_found": True,
                "num_documents": len(docs_context)
            }
        }
    
    async def extract_key_points(
        self,
        query: str,
        n_results: int = 10,
        document_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Extract key points from documents
        
        Args:
            query: Topic for key points
            n_results: Number of chunks to include
            document_ids: Optional filter by document IDs
        
        Returns:
            Key points with citations
        """
        search_results = await self.vector_store.search(
            query=query,
            n_results=n_results,
            document_ids=document_ids
        )
        
        if not search_results:
            return {
                "answer": "No documents found.",
                "citations": [],
                "metadata": {"context_found": False}
            }
        
        context = "\n\n".join([r['chunk_text'] for r in search_results])
        
        prompt_template = ChatPromptTemplate.from_template(self.prompts.EXTRACT_TEMPLATE)
        chain = prompt_template | self.llm | StrOutputParser()
        
        key_points = chain.invoke({
            "context": context,
            "topic": query
        })
        
        citations = self._format_citations(search_results)
        self._save_to_history(query, "extract", key_points)
        
        return {
            "answer": key_points,
            "citations": citations,
            "metadata": {"context_found": True}
        }
    
    async def extract_timeline(
        self,
        query: str,
        n_results: int = 10,
        document_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Extract timeline/chronological information
        
        Args:
            query: Topic for timeline
            n_results: Number of chunks to include
            document_ids: Optional filter by document IDs
        
        Returns:
            Timeline with citations
        """
        search_results = await self.vector_store.search(
            query=query,
            n_results=n_results,
            document_ids=document_ids
        )
        
        if not search_results:
            return {
                "answer": "No documents found.",
                "citations": [],
                "metadata": {"context_found": False}
            }
        
        context = "\n\n".join([r['chunk_text'] for r in search_results])
        
        prompt_template = ChatPromptTemplate.from_template(self.prompts.TIMELINE_TEMPLATE)
        chain = prompt_template | self.llm | StrOutputParser()
        
        timeline = chain.invoke({
            "context": context,
            "topic": query
        })
        
        citations = self._format_citations(search_results)
        self._save_to_history(query, "timeline", timeline)
        
        return {
            "answer": timeline,
            "citations": citations,
            "metadata": {"context_found": True}
        }
    
    async def get_query_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent query history
        
        Args:
            limit: Number of queries to return
        
        Returns:
            List of recent queries
        """
        return self.query_history[-limit:]
