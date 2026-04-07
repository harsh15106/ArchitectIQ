"""WebSocket connection manager for real-time collaboration."""

from fastapi import WebSocket
from typing import Dict, List


class ConnectionManager:
    """Manages active WebSocket connections grouped by design session ID."""

    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, design_id: str):
        """Accept a new WebSocket connection and register it under a design ID."""
        await websocket.accept()
        if design_id not in self.active_connections:
            self.active_connections[design_id] = []
        self.active_connections[design_id].append(websocket)

    def disconnect(self, websocket: WebSocket, design_id: str):
        """Remove a WebSocket connection from the active connections pool."""
        if design_id in self.active_connections:
            try:
                self.active_connections[design_id].remove(websocket)
            except ValueError:
                pass

    async def broadcast(self, message: str, design_id: str):
        """Send a message to all active connections for a given design session."""
        if design_id in self.active_connections:
            for connection in self.active_connections[design_id]:
                await connection.send_text(message)


manager = ConnectionManager()
