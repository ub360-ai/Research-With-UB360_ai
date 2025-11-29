"""
Example API requests for Research With UB360.ai
Run the backend first: python main.py
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("\n" + "="*60)
    print("Testing Health Endpoint")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/api/v1/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


def upload_document(file_path):
    """Upload a document"""
    print("\n" + "="*60)
    print("Uploading Document")
    print("="*60)
    
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(f"{BASE_URL}/api/v1/documents/upload", files=files)
    
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    return result.get('document_id')


def list_documents():
    """List all documents"""
    print("\n" + "="*60)
    print("Listing Documents")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/api/v1/documents")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


def query_answer(question):
    """Ask a question"""
    print("\n" + "="*60)
    print(f"Querying: {question}")
    print("="*60)
    
    payload = {
        "question": question,
        "query_type": "answer",
        "n_results": 5
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/query", json=payload)
    print(f"Status: {response.status_code}")
    result = response.json()
    
    print(f"\nAnswer: {result['answer']}")
    print(f"\nCitations ({len(result['citations'])}):")
    for i, citation in enumerate(result['citations'], 1):
        print(f"\n  {i}. {citation['document_name']}")
        print(f"     Score: {citation['relevance_score']:.2f}")
        print(f"     Snippet: {citation['text_snippet'][:100]}...")


def query_summarize(topic):
    """Summarize documents"""
    print("\n" + "="*60)
    print(f"Summarizing: {topic}")
    print("="*60)
    
    payload = {
        "question": topic,
        "query_type": "summarize",
        "n_results": 10
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/query", json=payload)
    print(f"Status: {response.status_code}")
    result = response.json()
    
    print(f"\nSummary:\n{result['answer']}")


def main():
    """Run example requests"""
    print("\n" + "="*60)
    print("Research With UB360.ai - API Examples")
    print("="*60)
    print("\nMake sure the backend is running: python main.py")
    print("Press Enter to continue...")
    input()
    
    # Test health
    test_health()
    
    # Upload a document (create a sample file first)
    print("\n\nTo upload a document, uncomment the following lines:")
    print("# document_id = upload_document('path/to/your/file.txt')")
    
    # List documents
    list_documents()
    
    # Example queries (uncomment after uploading documents)
    print("\n\nTo run queries, uncomment the following lines:")
    print("# query_answer('What is machine learning?')")
    print("# query_summarize('artificial intelligence')")
    
    print("\n" + "="*60)
    print("Examples completed!")
    print("="*60)


if __name__ == "__main__":
    main()
