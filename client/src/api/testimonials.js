import { apiFetch } from './apiClient';

export async function fetchTestimonials() {
  return apiFetch('/testimonials');
}

export async function fetchAllTestimonials() {
  return apiFetch('/testimonials/all', { auth: true });
}

export async function createTestimonial(name, message) {
  return apiFetch('/testimonials', { method: 'POST', body: { name, message } });
}

export async function approveTestimonial(id) {
  return apiFetch(`/testimonials/${id}/approve`, { method: 'PATCH', auth: true });
}

export async function deleteTestimonial(id) {
  return apiFetch(`/testimonials/${id}`, { method: 'DELETE', auth: true });
}
