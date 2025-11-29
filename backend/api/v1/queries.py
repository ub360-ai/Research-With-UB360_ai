"""
Query endpoints for RAG system with @mention support
"""
from fastapi import APIRouter, HTTPException
import time

from api.models import QueryRequest, QueryResponse, Citation, QueryType
from rag.rag_engine import RAGEngine
from services.document_manager import DocumentManager
from utils.mention_parser import MentionParser

router = APIRouter()
rag_engine = RAGEngine()
doc_manager = DocumentManager()


@router.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """
    Query the RAG system with a question (supports @mentions)
    
    Args:
        request: Query request with question and parameters
    
    Returns:
        QueryResponse: Answer with citations and metadata
    
    Examples:
        "@research_paper what is the main conclusion?"
        "@doc1 @doc2 compare these documents"
        "explain AI using @ml_book"
    """
    start_time = time.time()
    
    try:
        # Parse @mentions from the question
        available_docs = await doc_manager.get_all_document_names()
        parsed = MentionParser.parse_mentions(request.question, available_docs)
        
        # Use clean query (without @mentions)
        clean_question = parsed['clean_query']
        
        # If mentions found, use those document IDs
        # Otherwise, use document_ids from request (if provided)
        document_ids = None
        if parsed['has_mentions']:
            document_ids = parsed['mentioned_docs']
            print(f"📎 @Mentions found: {parsed['mentioned_names']}")
        elif request.document_ids:
            document_ids = request.document_ids
        
        # Execute query based on type
        if request.query_type == QueryType.ANSWER:
            result = await rag_engine.answer_question(
                question=clean_question,
                n_results=request.n_results,
                document_ids=document_ids,
                conversation_history=request.conversation_history
            )
        
        elif request.query_type == QueryType.SUMMARIZE:
            result = await rag_engine.summarize_documents(
                query=clean_question,
                n_results=request.n_results,
                document_ids=document_ids
            )
        
        elif request.query_type == QueryType.COMPARE:
            result = await rag_engine.compare_documents(
                query=clean_question,
                n_results=request.n_results,
                document_ids=document_ids
            )
        
        elif request.query_type == QueryType.EXTRACT:
            result = await rag_engine.extract_key_points(
                query=clean_question,
                n_results=request.n_results,
                document_ids=document_ids
            )
        
        elif request.query_type == QueryType.TIMELINE:
            result = await rag_engine.extract_timeline(
                query=clean_question,
                n_results=request.n_results,
                document_ids=document_ids
            )
        
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported query type: {request.query_type}"
            )
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Build citations
        citations = [
            Citation(
                document_id=cite["document_id"],
                document_name=cite["document_name"],
                chunk_id=cite["chunk_id"],
                page_number=cite.get("page_number"),
                relevance_score=cite["relevance_score"],
                text_snippet=cite["text_snippet"]
            )
            for cite in result["citations"]
        ]
        
        # Add mention info to metadata
        metadata = result.get("metadata", {})
        if parsed['has_mentions']:
            metadata['mentioned_documents'] = parsed['mentioned_names']
        
        return QueryResponse(
            success=True,
            answer=result["answer"],
            citations=citations,
            query_type=request.query_type,
            processing_time=processing_time,
            metadata=metadata
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )


@router.get("/query/history")
async def get_query_history(limit: int = 10):
    """
    Get recent query history
    
    Args:
        limit: Number of recent queries to return
    
    Returns:
        List of recent queries
    """
    try:
        history = await rag_engine.get_query_history(limit=limit)
        return {
            "success": True,
            "history": history,
            "count": len(history)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving query history: {str(e)}"
        )
