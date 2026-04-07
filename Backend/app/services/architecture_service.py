"""Architecture normalization service."""


def build_architecture(ai_response: dict, session: dict) -> dict:
    """Normalize the AI-generated architecture output, ensuring required keys exist."""
    if 'components' not in ai_response:
        ai_response['components'] = []
    return ai_response


def extract_components(architecture: dict) -> list:
    """Extract the components list from an architecture dictionary."""
    return architecture.get('components', [])
