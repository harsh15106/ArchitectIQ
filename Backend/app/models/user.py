from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional

class UserModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    email: EmailStr
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
