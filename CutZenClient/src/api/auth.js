// api/auth.js
const API_BASE = '/api';

async function fetchWithAuth(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    error.response = response;        // ← adjunta la respuesta para parseError
    error.status = response.status;   // ← adjunta el status code
    throw error;
  }

  return response.json();
}

export const authApi = {
  login: (userName, password) => 
    fetchWithAuth('/auth/login', { 
      method: 'POST', 
      body: JSON.stringify({ userName, password }) 
    }),
  
  register: (data) => 
    fetchWithAuth('/auth/register', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
};