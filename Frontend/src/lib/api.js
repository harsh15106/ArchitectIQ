const API_BASE = 'http://localhost:8000';

export const startDesignSession = async (problemStatement) => {
  const res = await fetch(`${API_BASE}/design/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem_statement: problemStatement })
  });
  if (!res.ok) throw new Error('Failed to start design session');
  return res.json();
};

export const answerDesignQuestions = async (sessionId, answers) => {
  // Convert answers dict { "type": "Low Scale" } to list of strings ["Low Scale"] as backend expects list of strings
  const answerValues = Object.values(answers);
  const res = await fetch(`${API_BASE}/design/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, answers: answerValues })
  });
  if (!res.ok) throw new Error('Failed to generate architecture');
  return res.json();
};
