"""Application entrypoint for the ArchitectIQ backend API server."""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.database import db
from app.routers import auth, design, validation, export, roast, collaborate
import app.services.rag_service as rag_service

# Allowed frontend origins for CORS
ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]

app = FastAPI(title="ArchitectIQ", description="AI-powered system design generator and validation engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
@app.get("/")
async def root():
    return {"message": "Welcome to ArchitectIQ API - Backend is running!"}

@app.on_event("startup")
async def startup_event():
    """Verify database connection and initialize Pinecone on startup."""
    await db.command("ping")
    rag_service.init_pinecone()

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Return a structured JSON error response for any unhandled exception."""
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred", "details": str(exc)},
        headers={
            "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0],
            "Access-Control-Allow-Credentials": "true"
        }
    )

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(design.router, prefix="/design", tags=["Design"])
app.include_router(validation.router, prefix="/validate", tags=["Validation"])
app.include_router(export.router, prefix="/export", tags=["Export"])
app.include_router(roast.router, prefix="/roast", tags=["Roast My Design"])
app.include_router(collaborate.router, prefix="/collaborate", tags=["Collaboration"])
app.include_router(collaborate.ws_router, tags=["WebSocket"])
