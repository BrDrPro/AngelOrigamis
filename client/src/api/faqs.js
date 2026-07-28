import { apiFetch } from './apiClient';

export async function fetchFaqs() {
  return apiFetch('/faqs');
}

export async function createFaq(data) {
  return apiFetch('/faqs', { method: 'POST', body: data, auth: true });
}

export async function updateFaq(id, data) {
  return apiFetch(`/faqs/${id}`, { method: 'PUT', body: data, auth: true });
}

export async function deleteFaq(id) {
  return apiFetch(`/faqs/${id}`, { method: 'DELETE', auth: true });
}
