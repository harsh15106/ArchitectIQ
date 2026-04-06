from app.config import settings
try:
    from pinecone import Pinecone, ServerlessSpec
except Exception as e:
    print(f"Warning: Pinecone SDK import failed: {e}")
    Pinecone = None
    ServerlessSpec = None
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import time

pc = None
index = None
embeddings = None

def init_pinecone():
    global pc, index, embeddings
    if not settings.PINECONE_API_KEY or settings.PINECONE_API_KEY == "dummy":
        print("Pinecone API key not provided, skipping init.")
        return

    try:
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        index_name = settings.PINECONE_INDEX

        existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]

        if index_name not in existing_indexes:
            print(f"Creating Pinecone index '{index_name}'...")
            pc.create_index(
                name=index_name,
                dimension=768,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
            while not pc.describe_index(index_name).status["ready"]:
                time.sleep(1)

        index = pc.Index(index_name)
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=settings.GEMINI_API_KEY
        )
        print(f"Pinecone index '{index_name}' initialized.")
    except Exception as e:
        print(f"Failed to initialize Pinecone: {e}")

def store_embedding(design_id: str, text: str):
    if not index or not embeddings:
        return
    try:
        vector = embeddings.embed_query(text)
        index.upsert(vectors=[{
            "id": str(design_id),
            "values": vector,
            "metadata": {"text": text}
        }])
    except Exception as e:
        print(f"Error storing embedding: {e}")

def retrieve_context(query: str, top_k: int = 5) -> str:
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
        print(f"Error retrieving context: {e}")
        return "Error fetching context. Default to standard patterns."
