import { apiFetch } from './apiClient';

export async function fetchHomeContent() {
  return apiFetch('/home-content');
}

export async function updateHomeContent(data) {
  return apiFetch('/home-content', { method: 'PUT', body: data, auth: true });
}
