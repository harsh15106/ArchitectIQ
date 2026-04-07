from pydantic import BaseModel
from typing import List

class SessionStart(BaseModel):
    problem_statement: str

class SessionAnswer(BaseModel):
    session_id: str
    answers: List[str]
