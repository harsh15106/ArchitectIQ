"""Smoke tests for the ArchitectIQ backend."""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_app_starts():
    """Verify the FastAPI app instance is created and has a valid title."""
    assert app.title == "ArchitectIQ"


def test_models_endpoint():
    """Verify the /design/models endpoint returns a list of available models."""
    response = client.get("/design/models")
    assert response.status_code == 200
    data = response.json()
    assert "available_models" in data
    assert len(data["available_models"]) > 0
