def build_architecture(ai_response: dict, session: dict) -> dict:
    # Normalize AI output if needed
    if 'components' not in ai_response:
        ai_response['components'] = []
    return ai_response

def extract_components(architecture: dict) -> list:
    return architecture.get('components', [])
