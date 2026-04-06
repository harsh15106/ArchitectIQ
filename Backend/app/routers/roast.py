from fastapi import APIRouter, Depends
from app.schemas.design import RoastRequest
from app.services.ai_service import roast_architecture
from app.utils.auth import get_current_user

router = APIRouter()

@router.post("/")
async def roast(req: RoastRequest, current_user: dict = Depends(get_current_user)):
    return roast_architecture(req.architecture_text)
