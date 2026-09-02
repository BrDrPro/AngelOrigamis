import { apiFetch } from './apiClient';

export async function fetchProducts() {
  return apiFetch('/products');
}

export async function fetchAllProducts() {
  return apiFetch('/products/all', { auth: true });
}

export async function fetchFeaturedProducts() {
  return apiFetch('/products/featured');
}

export async function updateProductVisibility(id, visible) {
  return apiFetch(`/products/${id}/visibility`, { method: 'PATCH', body: { visible }, auth: true });
}

export async function updateProductFeatured(id, featured) {
  return apiFetch(`/products/${id}/featured`, { method: 'PATCH', body: { featured }, auth: true });
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
