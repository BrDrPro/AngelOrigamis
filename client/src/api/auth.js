import { apiFetch } from './apiClient';

export async function login(email, password, signal) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password }, signal });
}

export async function verifyAdmin() {
  return apiFetch('/auth/verify', { auth: true });
}

export async function changePassword(currentPassword, newPassword) {
  return apiFetch('/auth/password', { method: 'PATCH', body: { currentPassword, newPassword }, auth: true });
}

export async function updateAdminName(name) {
  return apiFetch('/auth/name', { method: 'PATCH', body: { name }, auth: true });
}
