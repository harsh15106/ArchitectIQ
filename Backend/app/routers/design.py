from fastapi import APIRouter, Depends, HTTPException
from app.schemas.session import SessionStart, SessionAnswer
from app.models.session import SessionModel
from app.models.design import DesignModel
from app.database import db
from app.utils.auth import get_current_user
from app.services.ai_service import generate_clarifying_questions, generate_architecture
from app.services.rag_service import retrieve_context, store_embedding
from app.services.architecture_service import build_architecture
from app.services.validation_service import validate
from app.services.cost_service import estimate_cost
from app.services.diagram_service import generate_mermaid
from bson import ObjectId

router = APIRouter()

@router.get("/models")
async def list_available_models():
    # Vertex AI models are structured differently, returning standard list
    return {"available_models": ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash", "gemini-1.5-pro"]}

@router.post("/start")
async def start_design(req: SessionStart, current_user: dict = Depends(get_current_user)):
    print(f"\n[INFO] --- Starting new design session ---")
    print(f"[INFO] Problem Statement: {req.problem_statement}")
    print(f"[INFO] Calling Gemini to generate clarifying questions...")
    questions = generate_clarifying_questions(req.problem_statement)
    print(f"[INFO] Received questions: {questions}")
    session_doc = SessionModel(
        user_id=current_user["id"],
        problem_statement=req.problem_statement
    )
    res = await db.sessions.insert_one(session_doc.dict(by_alias=True, exclude_none=True))
    return {"session_id": str(res.inserted_id), "questions": questions}

@router.post("/answer")
async def answer_questions(req: SessionAnswer, current_user: dict = Depends(get_current_user)):
    print(f"\n[INFO] --- Beginning Architecture Generation for session {req.session_id} ---")
    session_data = await db.sessions.find_one({"_id": ObjectId(req.session_id)})
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found")
        
    problem = session_data["problem_statement"]
    
    print("[INFO] Phase 1: Retrieving relevant design patterns from Pinecone RAG...")
    context = retrieve_context(problem)
    
    print("[INFO] Phase 2: Generating intelligent architecture via Gemini...")
    raw_arch = generate_architecture(problem, req.answers, context)
    architecture = build_architecture(raw_arch, session_data)
    
    print("[INFO] Phase 3: Validating architecture for security and scale...")
    validation_report = validate(architecture)
    
    print("[INFO] Phase 4: Estimating dynamic monthly costs...")
    cost = estimate_cost(architecture)
    
    print("[INFO] Phase 5: Designing clustered Mermaid.js topology...")
    mermaid = generate_mermaid(architecture)
    
    print("[INFO] Process completed successfully. Storing results to database...")
    design_doc = DesignModel(
        session_id=req.session_id,
        user_id=current_user["id"],
        architecture=architecture,
        mermaid_diagram=mermaid,
        validation_report=validation_report,
        cost_estimate=cost
    )
    res = await db.designs.insert_one(design_doc.dict(by_alias=True, exclude_none=True))
    design_id = str(res.inserted_id)
    
    await db.sessions.update_one({"_id": ObjectId(req.session_id)}, {"$set": {"status": "completed", "qa_history": req.answers}})
    
    store_embedding(design_id, str(architecture))
    
    return {"design_id": design_id, "architecture": architecture, "mermaid": mermaid, "validation": validation_report, "cost": cost}

@router.get("/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    cursor = db.designs.find({"user_id": current_user["id"]})
    designs = await cursor.to_list(length=100)
    for d in designs: d["_id"] = str(d["_id"])
    return designs

@router.get("/{design_id}")
async def get_design(design_id: str, current_user: dict = Depends(get_current_user)):
    design = await db.designs.find_one({"_id": ObjectId(design_id)})
    if not design or design["user_id"] != current_user["id"]:
        raise HTTPException(status_code=404, detail="Design not found")
    design["_id"] = str(design["_id"])
    return design
