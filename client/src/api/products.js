import { apiFetch } from './apiClient';

export async function fetchProducts() {
  return apiFetch('/products');
}

export async function createProduct(formData) {
  return apiFetch('/products', { method: 'POST', body: formData, isFormData: true, auth: true });
}

export async function updateProduct(id, formData) {
  return apiFetch(`/products/${id}`, { method: 'PUT', body: formData, isFormData: true, auth: true });
}

export async function deleteProduct(id) {
  return apiFetch(`/products/${id}`, { method: 'DELETE', auth: true });
}
