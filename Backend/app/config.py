import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GOOGLE_APPLICATION_CREDENTIALS: str = "google-credentials.json"
    GCP_PROJECT_ID: str = ""
    PINECONE_API_KEY: str = "dummy"
    PINECONE_INDEX: str = "dummy"
    MONGO_URI: str = "mongodb://mongodb:27017"
    JWT_SECRET: str = ""  # Must be set via .env
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    model_config = {"env_file": ".env", "extra": "ignore"}

settings = Settings()

# Critical: Set GOOGLE_APPLICATION_CREDENTIALS as an OS-level env var
# so that all Google Cloud SDKs (Vertex AI, etc.) can auto-discover it.
# Resolve to absolute path if relative.
_creds_path = settings.GOOGLE_APPLICATION_CREDENTIALS
if _creds_path and not os.path.isabs(_creds_path):
    _creds_path = os.path.join(os.getcwd(), _creds_path)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = _creds_path
print(f"[CONFIG] GOOGLE_APPLICATION_CREDENTIALS set to: {_creds_path}")
print(f"[CONFIG] GCP_PROJECT_ID: {settings.GCP_PROJECT_ID}")
print(f"[CONFIG] Credentials file exists: {os.path.exists(_creds_path)}")
