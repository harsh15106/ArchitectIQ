from pydantic import BaseModel, Field
from datetime import datetime
from typing import Dict, Optional

class DesignModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    session_id: str
    user_id: str
    architecture: Dict
    mermaid_diagram: str
    validation_report: Dict
    cost_estimate: Dict
    created_at: datetime = Field(default_factory=datetime.utcnow)
