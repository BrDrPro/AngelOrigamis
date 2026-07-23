import { apiFetch } from './apiClient';

export async function createContactRequest(data) {
  return apiFetch('/contact-requests', { method: 'POST', body: data });
}

export async function fetchContactRequests() {
  return apiFetch('/contact-requests', { auth: true });
}

export async function markContactRequestRead(id) {
  return apiFetch(`/contact-requests/${id}/read`, { method: 'PATCH', auth: true });
}

export async function deleteContactRequest(id) {
  return apiFetch(`/contact-requests/${id}`, { method: 'DELETE', auth: true });
}
