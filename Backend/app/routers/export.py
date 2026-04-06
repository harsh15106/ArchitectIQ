from fastapi import APIRouter, Depends, HTTPException, Response
from app.database import db
from app.utils.auth import get_current_user
from app.services.export_service import to_pdf, to_terraform, to_cloudformation
from bson import ObjectId

router = APIRouter()

async def get_design_doc(design_id: str, user_id: str):
    design = await db.designs.find_one({"_id": ObjectId(design_id)})
    if not design or design["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Design not found")
    return design

@router.get("/{design_id}/pdf")
async def export_pdf(design_id: str, current_user: dict = Depends(get_current_user)):
    design = await get_design_doc(design_id, current_user["id"])
    pdf_bytes = to_pdf(design)
    return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=design_{design_id}.pdf"})

@router.get("/{design_id}/mermaid")
async def export_mermaid(design_id: str, current_user: dict = Depends(get_current_user)):
    design = await get_design_doc(design_id, current_user["id"])
    return Response(content=design.get("mermaid_diagram", ""), media_type="text/plain")

@router.get("/{design_id}/terraform")
async def export_terraform(design_id: str, current_user: dict = Depends(get_current_user)):
    design = await get_design_doc(design_id, current_user["id"])
    tf = to_terraform(design.get("architecture", {}))
    return Response(content=tf, media_type="text/plain", headers={"Content-Disposition": f"attachment; filename=main_{design_id}.tf"})

@router.get("/{design_id}/cloudformation")
async def export_cloudformation(design_id: str, current_user: dict = Depends(get_current_user)):
    design = await get_design_doc(design_id, current_user["id"])
    yaml = to_cloudformation(design.get("architecture", {}))
    return Response(content=yaml, media_type="text/yaml", headers={"Content-Disposition": f"attachment; filename=template_{design_id}.yaml"})
