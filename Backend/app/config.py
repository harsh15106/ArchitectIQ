from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str = "dummy"
    PINECONE_API_KEY: str = "dummy"
    PINECONE_INDEX: str = "dummy"
    MONGO_URI: str = "mongodb://mongodb:27017"
    JWT_SECRET: str = "secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    model_config = {"env_file": ".env", "extra": "ignore"}

settings = Settings()
