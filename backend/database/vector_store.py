"""
Enhanced Vector Store using ChromaDB
"""
import chromadb
from typing import List, Dict, Any, Optional
from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter

from config import settings


class VectorStore:
    """Enhanced vector database wrapper using ChromaDB"""
    
    def __init__(self):
        """Initialize ChromaDB and embedding model"""
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
        
        # Load embedding model
        print(f"📦 Loading embedding model: {settings.EMBEDDING_MODEL}")
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION_NAME,
            metadata={"description": "Research documents collection"}
        )
        
        print(f"✅ Vector store initialized: {settings.CHROMA_COLLECTION_NAME}")
    
    def _chunk_text(self, text: str) -> List[str]:
        """
        Split text into chunks using RecursiveCharacterTextSplitter
        
        Args:
            text: Input text to chunk
        
        Returns:
            List of text chunks
        """
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        return splitter.split_text(text)
    
    async def add_document(
        self,
        document_id: str,
        text: str,
        metadata: Dict[str, Any],
        pages: List[Dict[str, Any]] = None
    ) -> int:
        """
        Add document to vector store
        
        Args:
            document_id: Unique document identifier
            text: Document text content
            metadata: Document metadata
            pages: Optional list of pages with page numbers (for PDFs)
        
        Returns:
            Number of chunks created
        """
        # Chunk the text
        chunks = self._chunk_text(text)
        
        if not chunks:
            return 0
        
        # Prepare data for ChromaDB
        chunk_ids = []
        chunk_metadatas = []
        chunk_texts = []
        
        # If pages are provided, try to map chunks to pages
        page_mapping = {}
        if pages:
            # Create a mapping of text positions to page numbers
            current_pos = 0
            for page in pages:
                page_text = page["text"]
                page_num = page["page_number"]
                page_mapping[(current_pos, current_pos + len(page_text))] = page_num
                current_pos += len(page_text) + 4  # Account for "\n\n[Page X]\n"
        
        for idx, chunk in enumerate(chunks):
            if not chunk.strip():
                continue
            
            chunk_id = f"{document_id}_chunk_{idx}"
            
            # Determine page number for this chunk
            page_number = None
            if pages:
                # Find which page this chunk belongs to
                chunk_start = text.find(chunk)
                if chunk_start != -1:
                    for (start, end), page_num in page_mapping.items():
                        if start <= chunk_start < end:
                            page_number = page_num
                            break
            
            chunk_metadata = {
                **metadata,
                "document_id": document_id,
                "chunk_index": idx,
                "chunk_id": chunk_id
            }
            
            # Add page number if available
            if page_number:
                chunk_metadata["page_number"] = page_number
            
            chunk_ids.append(chunk_id)
            chunk_metadatas.append(chunk_metadata)
            chunk_texts.append(chunk)
        
        if not chunk_ids:
            return 0
        
        # Generate embeddings
        print(f"🔄 Generating embeddings for {len(chunk_ids)} chunks...")
        embeddings = self.embedding_model.encode(
            chunk_texts,
            show_progress_bar=False
        ).tolist()
        
        # Add to ChromaDB
        self.collection.add(
            ids=chunk_ids,
            embeddings=embeddings,
            documents=chunk_texts,
            metadatas=chunk_metadatas
        )
        
        print(f"✅ Added {len(chunk_ids)} chunks to vector store")
        return len(chunk_ids)
    
    async def search(
        self,
        query: str,
        n_results: int = 5,
        document_ids: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Search for similar chunks
        
        Args:
            query: Search query
            n_results: Number of results to return
            document_ids: Optional filter by document IDs
        
        Returns:
            List of search results with metadata
        """
        # Generate query embedding
        query_embedding = self.embedding_model.encode([query]).tolist()
        
        # Build where filter if document_ids provided
        where_filter = None
        if document_ids:
            where_filter = {"document_id": {"$in": document_ids}}
        
        # Query ChromaDB
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=n_results,
            where=where_filter,
            include=["documents", "metadatas", "distances"]
        )
        
        # Format results
        search_results = []
        if results["documents"] and results["documents"][0]:
            documents = results["documents"][0]
            metadatas = results["metadatas"][0]
            distances = results["distances"][0]
            
            for i in range(len(documents)):
                # Convert distance to similarity score (lower distance = higher similarity)
                similarity_score = 1 / (1 + distances[i])
                
                search_results.append({
                    "chunk_text": documents[i],
                    "metadata": metadatas[i],
                    "distance": distances[i],
                    "similarity_score": similarity_score,
                    "document_id": metadatas[i].get("document_id", "unknown"),
                    "chunk_id": metadatas[i].get("chunk_id", "unknown")
                })
        
        return search_results
    
    async def delete_document(self, document_id: str) -> bool:
        """
        Delete all chunks for a document
        
        Args:
            document_id: Document ID to delete
        
        Returns:
            Success status
        """
        try:
            # Get all chunk IDs for this document
            results = self.collection.get(
                where={"document_id": document_id}
            )
            
            if results["ids"]:
                self.collection.delete(ids=results["ids"])
                print(f"✅ Deleted {len(results['ids'])} chunks for document {document_id}")
            
            return True
        except Exception as e:
            print(f"❌ Error deleting document {document_id}: {e}")
            return False
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """
        Get collection statistics
        
        Returns:
            Collection statistics
        """
        count = self.collection.count()
        return {
            "total_chunks": count,
            "collection_name": settings.CHROMA_COLLECTION_NAME,
            "embedding_model": settings.EMBEDDING_MODEL
        }
