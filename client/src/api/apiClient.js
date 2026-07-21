export const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://angelorigamis.com.br/api'
    : 'http://localhost:3001/api';

export function getAdminToken() {
  return localStorage.getItem('adminToken');
}

export async function apiFetch(path, { method = 'GET', body, isFormData = false, auth = false, signal } = {}) {
  const headers = {};

  if (body && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAdminToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    signal,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // resposta sem corpo JSON
  }

  if (!response.ok) {
    const error = new Error((data && data.message) || 'Erro na requisição');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
