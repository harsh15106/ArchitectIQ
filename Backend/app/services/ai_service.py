from app.config import settings
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

try:
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=settings.GEMINI_API_KEY)
except Exception as e:
    print(f"Error initializing Gemini: {e}")
    llm = None

def generate_clarifying_questions(problem_statement: str):
    if not llm:
        return [
            {"question": "What is your target scale?", "options": ["Small (< 1k users)", "Medium (10k+ users)", "Large (1M+ users)", "Undetermined"]},
            {"question": "Any compliance requirements?", "options": ["HIPAA", "GDPR", "None", "All standard"]},
            {"question": "Cloud provider preference?", "options": ["AWS", "Azure", "GCP", "No preference"]}
        ]
    
    prompt = f"Given this problem statement: '{problem_statement}', return exactly 3 to 5 clarifying questions for system architecture. For each question, provide 3 multiple-choice options. Return ONLY a valid JSON array of objects with 'question' and 'options' keys."
    
    try:
        response = llm([HumanMessage(content=prompt)])
        return json.loads(response.content)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return [
            {"question": "Which scale do you anticipate?", "options": ["Micro", "SaaS", "Enterprise"]},
            {"question": "Any data sensitivity?", "options": ["Low", "High", "Critical"]}
        ]

def generate_architecture(problem_statement: str, answers: list, rag_context: str):
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
    
    sys_msg = SystemMessage(content="You are an expert system architect. Return your output ONLY as a valid JSON object with keys: components (list of dicts with name, type, purpose, connections), data_flow (list of strings), tech_stack (dict), scalability_notes (string), security_notes (string).")
    prompt_text = f"Problem: {problem_statement}\nAnswers: {answers}\nContext: {rag_context}\nDesign the complete architecture."
    
    response = llm([sys_msg, HumanMessage(content=prompt_text)])
    try:
        return json.loads(response.content)
    except Exception as e:
        return {"error": "Failed to parse architecture JSON", "raw": str(response.content)}

def roast_architecture(architecture_text: str):
    if not llm:
        return {"flaws": [], "missing": ["Load Balancer"], "bottlenecks": ["Single DB"], "scalability_issues": ["Not distributed"], "score": 40, "summary": "It works, but it's fragile."}
        
    sys_msg = SystemMessage(content="You are a brutal, highly critical software architect. Analyze the architecture. Return ONLY valid JSON with keys: flaws (list of dicts with issue, severity: critical/major/minor), missing_components (list), bottlenecks (list), scalability_issues (list), score (int 0-100), summary (string).")
    response = llm([sys_msg, HumanMessage(content=architecture_text)])
    try:
        return json.loads(response.content)
    except:
        return {"score": 50, "summary": "Failed to parse roast response. It was too brutal to serialize."}
