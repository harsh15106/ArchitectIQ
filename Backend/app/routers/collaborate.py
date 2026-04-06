from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from app.schemas.design import CommentRequest
from app.websocket.collaboration import manager
import json

router = APIRouter()
ws_router = APIRouter()

@router.get("/{design_id}")
async def get_collaboration_state(design_id: str):
    return {"message": "State logic implementation", "design_id": design_id}

@router.post("/{design_id}/comment")
async def add_comment(design_id: str, req: CommentRequest):
    await manager.broadcast(json.dumps({"type": "comment", "comment": req.comment}), design_id)
    return {"status": "Comment added and broadcasted"}

@ws_router.websocket("/ws/collaborate/{design_id}")
async def websocket_endpoint(websocket: WebSocket, design_id: str):
    await manager.connect(websocket, design_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Session {design_id} update: {data}", design_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, design_id)
        await manager.broadcast(f"A user disconnected from {design_id}", design_id)
