"""Cost estimation service using Vertex AI Gemini."""

import json
from langchain_core.messages import HumanMessage, SystemMessage
from app.services.ai_service import llm

def estimate_cost(architecture: dict) -> dict:
    """Estimate monthly cloud infrastructure costs for the given architecture."""
    if not llm:
        return {
            "itemized": [{"name": "Fallback compute", "type": "EC2", "monthly_cost": 20}],
            "total_monthly_usd_estimate": 20
        }
        
    sys_msg = SystemMessage(content="You are an AWS/GCP Cost Estimation Architect. Given this architecture JSON, return exactly a JSON object with: itemized (list array of objects with name, type, and monthly_cost), and total_monthly_usd_estimate (int). Assume moderate production traffic. Return ONLY the raw JSON object, no markdown blocks like ```json.")

    prompt = f"Architecture:\n{json.dumps(architecture)}"
    
    try:
        response = llm.invoke([sys_msg, HumanMessage(content=prompt)])
        data = response.content.strip()
        if data.startswith("```json"):
            data = data.strip("`").replace("json\n", "")
        return json.loads(data)
    except Exception as e:
        print(f"Cost calc error: {e}")
        return {"itemized": [], "total_monthly_usd_estimate": 0}
