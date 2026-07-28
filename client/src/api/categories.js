import { apiFetch } from './apiClient';

export async function fetchCategories() {
  return apiFetch('/categories');
}

export async function updateCategoryVisibility(id, visible) {
  return apiFetch(`/categories/${id}/visibility`, { method: 'PATCH', body: { visible }, auth: true });
}

export async function updateCategoryDescription(id, description) {
  return apiFetch(`/categories/${id}/description`, { method: 'PATCH', body: { description }, auth: true });
}
