"""Mermaid.js diagram generation service."""

import json
import re
from langchain_core.messages import HumanMessage, SystemMessage
from app.services.ai_service import llm


def strip_markdown(text: str) -> str:
    """Remove markdown code fences from text."""
    text = text.strip()
    pattern = r"^```(?:mermaid)?\s*(.*?)\s*```$"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    if text.startswith("```"):
        return '\n'.join(text.split('\n')[1:-1]).strip()
    return text


def _sanitize_label(label: str) -> str:
    """Sanitize a label for mermaid node labels by removing problematic characters."""
    if not label:
        return "Unknown"
    # Remove characters that break mermaid syntax
    label = label.replace('"', "'").replace('<', '').replace('>', '')
    label = label.replace('(', '').replace(')', '').replace('[', '').replace(']', '')
    return label


def _build_fallback_diagram(architecture: dict) -> str:
    """Build a simple but valid mermaid diagram from the components list."""
    components = architecture.get("components", [])
    if not components:
        return "graph TD\n  A[No Data] --> B[Provided]"

    lines = ["graph TD"]
    name_map = {}

    for idx, comp in enumerate(components):
        node_id = f"N{idx}"
        raw_name = comp.get("name", f"Component {idx}")
        raw_type = comp.get("type", "Service")
        name_map[raw_name] = node_id
        safe_name = _sanitize_label(raw_name)
        safe_type = _sanitize_label(raw_type)
        lines.append(f'    {node_id}["{safe_name}<br/>{safe_type}"]')

    for idx, comp in enumerate(components):
        src = f"N{idx}"
        for conn in comp.get("connections", []):
            if conn in name_map:
                tgt = name_map[conn]
                lines.append(f"    {src} --> {tgt}")

    return "\n".join(lines)


def generate_mermaid(architecture: dict) -> str:
    """Generate a Mermaid.js diagram string from the architecture."""
    # Always build a fallback first from the raw component data
    fallback = _build_fallback_diagram(architecture)

    if not llm:
        print("[DIAGRAM] LLM not available, using fallback diagram.")
        return fallback

    sys_msg = SystemMessage(
        content=(
            "You are an expert Data Visualization Architect. "
            "Given the JSON system architecture, generate a Mermaid.js graph.\n"
            "STRICT RULES:\n"
            "1. Start with exactly 'graph TD'\n"
            "2. Use simple node IDs like A, B, C or N1, N2, N3\n"
            "3. Use square brackets for labels: A[\"Label\"]\n"
            "4. Use --> for connections\n"
            "5. You may use 'subgraph' for grouping\n"
            "6. Do NOT use style/classDef directives\n"
            "7. Do NOT use special shapes like [( )] or {{ }}\n"
            "8. Do NOT wrap output in markdown code fences\n"
            "9. Return ONLY the raw Mermaid syntax, nothing else"
        )
    )

    prompt = f"Convert this architecture to a Mermaid.js graph:\n{json.dumps(architecture)}"

    try:
        response = llm.invoke([sys_msg, HumanMessage(content=prompt)])
        raw = strip_markdown(response.content)
        print(f"[DIAGRAM] Generated mermaid ({len(raw)} chars): {raw[:200]}...")

        # Basic validation: must start with graph
        if raw and ("graph" in raw.lower() or "flowchart" in raw.lower()):
            return raw
        else:
            print("[DIAGRAM] LLM output doesn't look like valid mermaid, using fallback.")
            return fallback
    except Exception as e:
        print(f"[DIAGRAM] Mermaid Generation Error: {e}")
        return fallback
