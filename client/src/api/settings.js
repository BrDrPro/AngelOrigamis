import { apiFetch } from './apiClient';

export async function fetchSettings() {
  return apiFetch('/settings');
}

export async function updateSettings(data) {
  return apiFetch('/settings', { method: 'PUT', body: data, auth: true });
}
