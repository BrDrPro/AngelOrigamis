import { apiFetch } from './apiClient';

export async function fetchAboutContent() {
  return apiFetch('/about');
}

export async function updateAboutContent(formData) {
  return apiFetch('/about', { method: 'PUT', body: formData, isFormData: true, auth: true });
}
