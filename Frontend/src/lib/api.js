export const API_BASE = 'http://localhost:8000';

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  return response;
};

export const startDesignSession = async (problemStatement) => {
  const res = await fetchWithAuth(`/design/start`, {
    method: 'POST',
    body: JSON.stringify({ problem_statement: problemStatement })
  });
  if (!res.ok) throw new Error('Failed to start design session');
  return res.json();
};

export const answerDesignQuestions = async (sessionId, answers) => {
  // Convert answers dict { "type": "Low Scale" } to list of strings ["Low Scale"] as backend expects list of strings
  const answerValues = Object.values(answers);
  const res = await fetchWithAuth(`/design/answer`, {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId, answers: answerValues })
  });
  if (!res.ok) throw new Error('Failed to generate architecture');
  return res.json();
};
