import json
import re
from langchain_core.messages import HumanMessage, SystemMessage
from app.services.ai_service import llm

def strip_markdown(text: str) -> str:
    text = text.strip()
    pattern = r"^```(?:mermaid)?\s*(.*?)\s*```$"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    if text.startswith("```"):
        return '\n'.join(text.split('\n')[1:-1]).strip()
    return text

def generate_mermaid(architecture: dict) -> str:
    if not llm:
        components = architecture.get("components", [])
        if not components:
            return "graph TD\n  A[No Data] --> B[Provided]"
        lines = ["graph TD"]
        name_map = {}
        for idx, c in enumerate(components):
            node_id = f"node{idx}"
            name_map[c.get("name")] = node_id
            lines.append(f"    {node_id}[\"{c.get('name')} <br/>({c.get('type')})\"]")
        for idx, c in enumerate(components):
            src = f"node{idx}"
            for conn in c.get("connections", []):
                if conn in name_map:
                    tgt = name_map[conn]
                    lines.append(f"    {src} --> {tgt}")
        return "\n".join(lines)
        
    sys_msg = SystemMessage(content="You are an expert Data Visualization Architect. Given the JSON system architecture, generate a highly structured, accurate Mermaid.js graph. Requirements:\n1. Use 'graph TD' or 'graph LR'.\n2. Group similar components into 'subgraph' clusters (e.g., VPC, Public Subnet, Private Subnet, Database Layer).\n3. Use different node shapes for databases ([(Database)]) vs compute ([Compute]).\n4. Add styling and colors if appropriate. \n5. Return ONLY the raw Mermaid syntax string, NO markdown backticks like ```mermaid.")

    prompt = f"Convert this architecture to a styled Mermaid.js graph:\n{json.dumps(architecture)}"
    
    try:
        response = llm([sys_msg, HumanMessage(content=prompt)])
        return strip_markdown(response.content)
    except Exception as e:
        print(f"Mermaid Generation Error: {e}")
        return "graph TD\n  Err[Error Generating Graph] --> Logs[Check Backend Logs]"
