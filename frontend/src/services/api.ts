import type { ApiResponse, PaginatedResponse, AuthResponse, Order, Client, DailyReport, OrderStatus } from '../types';

const BASE_URL = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }

  return data;
}

// --- Auth ---
export async function login(email: string, password: string, tenantSlug: string) {
  const res = await request<ApiResponse<AuthResponse>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, tenantSlug }),
  });
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('tenant', JSON.stringify(res.data.tenant));
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data;
}

export async function register(tenantName: string, name: string, email: string, password: string) {
  const res = await request<ApiResponse<AuthResponse>>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ tenantName, name, email, password }),
  });
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('tenant', JSON.stringify(res.data.tenant));
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('tenant');
  localStorage.removeItem('user');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getCurrentTenant() {
  const tenant = localStorage.getItem('tenant');
  return tenant ? JSON.parse(tenant) : null;
}

// --- Orders ---
export async function getOrders(params?: { status?: OrderStatus; search?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  return request<PaginatedResponse<Order>>(`/orders?${query}`);
}

export async function createOrder(data: {
  clientName: string;
  clientPhone: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  notes?: string;
  estimatedDate?: string;
}) {
  return request<ApiResponse<Order>>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return request<ApiResponse<Order>>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// --- Clients ---
export async function getClients(params?: { search?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  return request<PaginatedResponse<Client>>(`/clients?${query}`);
}

// --- Reports ---
export async function getDailyReport(date?: string) {
  const query = date ? `?date=${date}` : '';
  return request<ApiResponse<DailyReport>>(`/reports/daily${query}`);
}
