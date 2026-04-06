from fastapi import APIRouter, Depends, HTTPException
from app.database import db
from app.utils.auth import get_current_user
from app.services.validation_service import validate
from bson import ObjectId

router = APIRouter()

@router.post("/{design_id}")
async def validate_design(design_id: str, current_user: dict = Depends(get_current_user)):
    design = await db.designs.find_one({"_id": ObjectId(design_id)})
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
        
    report = validate(design.get("architecture", {}))
    await db.designs.update_one({"_id": ObjectId(design_id)}, {"$set": {"validation_report": report}})
    return report
