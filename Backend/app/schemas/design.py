from pydantic import BaseModel

class RoastRequest(BaseModel):
    architecture_text: str

class CommentRequest(BaseModel):
    comment: str
