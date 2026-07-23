import { apiFetch } from './apiClient';

export async function createOrder(data) {
  return apiFetch('/orders', { method: 'POST', body: data });
}

export async function fetchOrders() {
  return apiFetch('/orders', { auth: true });
}

export async function updateOrderStatus(id, status) {
  return apiFetch(`/orders/${id}/status`, { method: 'PATCH', body: { status }, auth: true });
}

export async function deleteOrder(id) {
  return apiFetch(`/orders/${id}`, { method: 'DELETE', auth: true });
}
