"""RAG service using Pinecone vector store and Vertex AI embeddings."""

from app.config import settings
import os
try:
    from pinecone import Pinecone, ServerlessSpec
except Exception as e:
    print(f"Warning: Pinecone SDK import failed: {e}")
    Pinecone = None
    ServerlessSpec = None
from langchain_google_vertexai import VertexAIEmbeddings
import time

EMBEDDING_DIMENSION = 768
METADATA_TEXT_LIMIT = 1000
DEFAULT_TOP_K = 5

pc = None
index = None
embeddings = None


def init_pinecone():
    """Initialize the Pinecone vector index and Vertex AI embedding model."""
    global pc, index, embeddings
    if not settings.PINECONE_API_KEY or settings.PINECONE_API_KEY == "dummy":
        print("[RAG] Pinecone API key not provided, skipping init.")
        return

    try:
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        index_name = settings.PINECONE_INDEX

        existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]

        if index_name not in existing_indexes:
            print(f"[RAG] Creating Pinecone index '{index_name}'...")
            pc.create_index(
                name=index_name,
                dimension=EMBEDDING_DIMENSION,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
            # TODO: review this — polling with time.sleep inside a loop
            while not pc.describe_index(index_name).status["ready"]:
                time.sleep(1)

        index = pc.Index(index_name)

        # Only init embeddings if GCP credentials are available
        creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "")
        if os.path.exists(creds_path):
            embeddings = VertexAIEmbeddings(
                model_name="text-embedding-004",
                project=settings.GCP_PROJECT_ID
            )
            print(f"[RAG] Pinecone index '{index_name}' initialized with Vertex AI embeddings.")
        else:
            print(f"[RAG] Pinecone index '{index_name}' initialized WITHOUT embeddings (no GCP credentials).")
    except Exception as e:
        print(f"[RAG] Failed to initialize Pinecone: {e}")


def store_embedding(design_id: str, text: str):
    """Store a design's text embedding in the Pinecone vector index."""
    if not index or not embeddings:
        return
    try:
        vector = embeddings.embed_query(text)
        index.upsert(vectors=[{
            "id": str(design_id),
            "values": vector,
            "metadata": {"text": text[:METADATA_TEXT_LIMIT]}
        }])
    except Exception as e:
        print(f"[RAG] Error storing embedding: {e}")


def retrieve_context(query: str, top_k: int = DEFAULT_TOP_K) -> str:
    """Retrieve relevant design context from the Pinecone vector store."""
    if not index or not embeddings:
        return "Follow microservices patterns. Ensure high availability. Use caching."
    try:
        query_vec = embeddings.embed_query(query)
        res = index.query(vector=query_vec, top_k=top_k, include_metadata=True)
        contexts = [match["metadata"]["text"] for match in res["matches"] if "metadata" in match]
        if not contexts:
            return "No historical context found."
        return "\n---\n".join(contexts)
    except Exception as e:
        print(f"[RAG] Error retrieving context: {e}")
        return "Error fetching context. Default to standard patterns."
