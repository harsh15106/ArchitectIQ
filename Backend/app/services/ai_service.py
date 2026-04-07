"""AI service for generating architecture designs using Vertex AI Gemini."""

from app.config import settings
import os
import json
from langchain_google_vertexai import ChatVertexAI
from langchain_core.messages import HumanMessage, SystemMessage

# Initialize LLM using Vertex AI with service account credentials
llm = None
try:
    creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "")
    if os.path.exists(creds_path):
        llm = ChatVertexAI(
            model_name="gemini-2.5-pro",
            project=settings.GCP_PROJECT_ID,
            convert_system_message_to_human=True,
        )
        print(f"[AI] Vertex AI Gemini 2.5 Pro initialized successfully (project: {settings.GCP_PROJECT_ID})")
    else:
        print(f"[AI] WARNING: Credentials file not found at '{creds_path}'. LLM will use fallback responses.")
except Exception as e:
    print(f"[AI] Error initializing Vertex AI Gemini: {e}")
    llm = None


def _strip_markdown_fences(raw: str) -> str:
    """Strip markdown code fences (e.g. ```json ... ```) from LLM output."""
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
        raw = raw.rsplit("```", 1)[0]
    return raw.strip()


def generate_clarifying_questions(problem_statement: str):
    """Generate 3-5 clarifying questions for a given problem statement."""
    if not llm:
        return ["What is your target scale?", "Any compliance requirements?", "Which cloud provider do you prefer?"]

    prompt = f"Given this problem statement: '{problem_statement}', return exactly 3 to 5 clarifying questions to design the architecture. Return ONLY a valid JSON array of strings, nothing else."

    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        return json.loads(_strip_markdown_fences(response.content))
    except Exception as e:
        print(f"[AI] Gemini API Error: {e}")
        return ["What is your target scale?", "Any compliance requirements?", "Which cloud provider do you prefer?"]


def generate_architecture(problem_statement: str, answers: list, rag_context: str):
    """Generate a complete system architecture from the problem statement and user answers."""
    if not llm:
        return {
            "components": [
                {"name": "Web Server", "type": "EC2/Compute", "purpose": "Serve frontend", "connections": ["Database"]},
                {"name": "Database", "type": "RDS/PostgreSQL", "purpose": "Store data", "connections": []}
            ],
            "data_flow": ["User accesses server", "Server queries DB"],
            "tech_stack": {"frontend": "React", "backend": "FastAPI", "database": "PostgreSQL"},
            "scalability_notes": "Use a load balancer later.",
            "security_notes": "Ensure HTTPS."
        }

    sys_msg = SystemMessage(content="You are an expert system architect. Return your output ONLY as a valid JSON object with keys: components (list of dicts with name, type, purpose, connections), data_flow (list of strings), tech_stack (dict), scalability_notes (string), security_notes (string). Do NOT wrap in markdown code fences.")
    prompt_text = f"Problem: {problem_statement}\nAnswers: {answers}\nContext: {rag_context}\nDesign the complete architecture."

    try:
        response = llm.invoke([sys_msg, HumanMessage(content=prompt_text)])
        return json.loads(_strip_markdown_fences(response.content))
    except Exception as e:
        print(f"[AI] Architecture parse error: {e}")
        return {"error": "Failed to parse architecture JSON", "raw": str(e)}


def roast_architecture(architecture_text: str):
    """Critically analyze an architecture and return a detailed roast report."""
    if not llm:
        return {"flaws": [], "missing": ["Load Balancer"], "bottlenecks": ["Single DB"], "scalability_issues": ["Not distributed"], "score": 40, "summary": "It works, but it's fragile."}

    sys_msg = SystemMessage(content="You are a brutal, highly critical software architect. Analyze the architecture. Return ONLY valid JSON with keys: flaws (list of dicts with issue, severity: critical/major/minor), missing_components (list), bottlenecks (list), scalability_issues (list), score (int 0-100), summary (string). Do NOT wrap in markdown code fences.")
    try:
        response = llm.invoke([sys_msg, HumanMessage(content=architecture_text)])
        return json.loads(_strip_markdown_fences(response.content))
    except Exception:
        return {"score": 50, "summary": "Failed to parse roast response."}
