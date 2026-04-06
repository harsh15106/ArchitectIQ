from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Dict, Optional

class SessionModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    problem_statement: str
    qa_history: List[Dict[str, str]] = []
    status: str = "active"
    created_at: datetime = Field(default_factory=datetime.utcnow)
