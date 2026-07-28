import { apiFetch } from './apiClient';

export async function fetchAboutContent() {
  return apiFetch('/about');
}

export async function updateAboutContent(data) {
  return apiFetch('/about', { method: 'PUT', body: data, auth: true });
}
