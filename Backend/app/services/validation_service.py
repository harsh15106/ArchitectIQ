import json
from langchain.schema import HumanMessage, SystemMessage
from app.services.ai_service import llm

def validate(architecture: dict) -> dict:
    if not llm:
        return {
            "missing_components": ["Load Balancer", "Caching Layer"],
            "severities": {"critical": True, "warning": True},
            "scalability_score": 50,
            "security_score": 50,
            "recommendations": ["Fallback validation warning: Gemini not initialized."]
        }
        
    sys_msg = SystemMessage(content="You are a Cloud Security and Scalability expert. Analyze the given JSON architecture. Return exactly a JSON object with keys: missing_components (list array of strings), severities (object with boolean keys: critical, warning), scalability_score (int 0-100), security_score (int 0-100), recommendations (list array of strings). Do NOT wrap in markdown formatting like ```json.")
    
    prompt = f"Analyze this Architecture:\n{json.dumps(architecture)}"
    
    try:
        response = llm([sys_msg, HumanMessage(content=prompt)])
        data = response.content.strip()
        if data.startswith("```json"):
            data = data.strip("`").replace("json\n", "")
        return json.loads(data)
    except Exception as e:
        print(f"Validation parse error: {e}")
        return {
            "missing_components": ["API Gateway"], 
            "severities": {"critical": False, "warning": True}, 
            "scalability_score": 80, 
            "security_score": 70, 
            "recommendations": ["Could not parse LLM output exactly. Check logs."]
        }
