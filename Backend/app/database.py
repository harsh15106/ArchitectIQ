"""Database connection module for ArchitectIQ."""

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

DATABASE_NAME = "architectiq_db"

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client.get_database(DATABASE_NAME)
