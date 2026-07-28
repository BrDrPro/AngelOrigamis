import { apiFetch } from './apiClient';

export async function pingVisit(path) {
  return apiFetch('/visits', { method: 'POST', body: { path } });
}

export async function fetchTodayVisitCount() {
  return apiFetch('/visits/today', { auth: true });
}
