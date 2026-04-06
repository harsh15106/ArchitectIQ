from pydantic import BaseModel
from typing import List, Dict

class SessionStart(BaseModel):
    problem_statement: str

class SessionAnswer(BaseModel):
    session_id: str
    answers: List[Dict[str, str]]
