"""Export service for generating PDF, Terraform, and CloudFormation outputs."""

import json
import re
from io import BytesIO
from reportlab.pdfgen import canvas
from langchain_core.messages import HumanMessage, SystemMessage
from app.services.ai_service import llm

def to_pdf(design: dict) -> bytes:
    """Generate a PDF report from a design document."""
    buffer = BytesIO()
    c = canvas.Canvas(buffer)
    c.drawString(100, 800, "ArchitectIQ - System Design Report")
    c.drawString(100, 780, f"Design ID: {design.get('_id', 'unknown')}")
    c.drawString(100, 760, "Exported successfully from Backend AI engine.")
    c.save()
    buffer.seek(0)
    return buffer.getvalue()

def strip_markdown(text: str, lang: str) -> str:
    """Strip markdown code fences for a specific language tag."""
    text = text.strip()
    pattern = rf"^```{lang}\s*(.*?)\s*```$"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    if text.startswith("```"):
        return '\n'.join(text.split('\n')[1:-1]).strip()
    return text

def to_terraform(architecture: dict) -> str:
    """Convert an architecture to Terraform HCL code via Gemini."""
    if not llm:
        return "# Error: AI LLM is not initialized for Terraform generation."
        
    sys_msg = SystemMessage(content="You are an elite DevOps Cloud Infrastructure Engineer. You must translate the provided JSON system architecture into syntactically perfect, production-grade AWS Terraform (HCL) code. Map components to appropriate aws_* resources (e.g., aws_instance, aws_db_instance, aws_lb, aws_elasticache_cluster). Assume a standard VPC setup. DO NOT include ANY conversational text, notes, or explanations. ONLY output the raw Terraform code.")
    prompt = f"Convert this architecture to Terraform:\n{json.dumps(architecture)}"
    
    try:
        response = llm.invoke([sys_msg, HumanMessage(content=prompt)])
        return strip_markdown(response.content, "hcl") or strip_markdown(response.content, "terraform")
    except Exception as e:
        print(f"Terraform Generation Error: {e}")
        return "# Error generating Terraform. Check backend logs."

def to_cloudformation(architecture: dict) -> str:
    """Convert an architecture to AWS CloudFormation YAML via Gemini."""
    if not llm:
        return "Error: AI LLM is not initialized for CloudFormation generation."
        
    sys_msg = SystemMessage(content="You are an elite DevOps Cloud Infrastructure Engineer. You must translate the provided JSON system architecture into a syntactically flawless AWS CloudFormation template (YAML format). Map components to accurate AWS::* resources (e.g., AWS::EC2::Instance, AWS::RDS::DBInstance). DO NOT include ANY conversational text, notes, or explanations. ONLY output the raw YAML template.")
    prompt = f"Convert this architecture to CloudFormation YAML:\n{json.dumps(architecture)}"
    
    try:
        response = llm.invoke([sys_msg, HumanMessage(content=prompt)])
        return strip_markdown(response.content, "yaml")
    except Exception as e:
        print(f"CloudFormation Generation Error: {e}")
        return "Error generating CloudFormation. Check backend logs."
