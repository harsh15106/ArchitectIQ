from pydantic import BaseModel
from typing import Dict, List, Optional

class RoastRequest(BaseModel):
    architecture_text: str

class CommentRequest(BaseModel):
    comment: str
