export type OrderStatus = 'RECEIVED' | 'WASHING' | 'READY' | 'DELIVERED';

export interface OrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface Order {
  id: string;
  ticketNumber: number;
  status: OrderStatus;
  totalPrice: number;
  notes?: string;
  estimatedDate?: string;
  deliveredAt?: string;
  createdAt: string;
  client: Pick<Client, 'name' | 'phone'>;
  items: OrderItem[];
}

export interface DailyReport {
  date: string;
  totalOrders: number;
  totalIncome: number;
  averageTicket: number;
  byStatus: Record<OrderStatus, number>;
}

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string; role: string };
  tenant: { id: string; name: string; slug: string };
}

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  ok: boolean;
  data: T[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}
