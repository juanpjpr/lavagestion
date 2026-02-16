import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../services/api';
import type { Order, OrderStatus } from '../types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: 'Recibido',
  WASHING: 'Lavando',
  READY: 'Listo',
  DELIVERED: 'Entregado',
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  RECEIVED: 'WASHING',
  WASHING: 'READY',
  READY: 'DELIVERED',
};

const STATUS_BTN_CLASS: Record<string, string> = {
  WASHING: 'btn btn-sm btn-warning',
  READY: 'btn btn-sm btn-success',
  DELIVERED: 'btn btn-sm btn-danger',
};

export function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | ''>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrders({
        status: filter || undefined,
        search: search || undefined,
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Pedidos</h2>
        <button className="btn btn-primary" onClick={() => navigate('/orders/new')}>
          + Nuevo Pedido
        </button>
      </div>

      {/* Search */}
      <div className="form-group" style={{ maxWidth: 300 }}>
        <input
          placeholder="Buscar por nombre, teléfono o ticket..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === '' ? 'active' : ''}`}
          onClick={() => setFilter('')}
        >
          Todos
        </button>
        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((status) => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <p>Cargando...</p>
        ) : orders.length === 0 ? (
          <p style={{ color: 'var(--gray-500)' }}>No hay pedidos</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Cliente</th>
                  <th>Teléfono</th>
                  <th>Prendas</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.ticketNumber}</strong></td>
                    <td>{order.client.name}</td>
                    <td>{order.client.phone}</td>
                    <td>{order.items.length} prenda(s)</td>
                    <td>${Number(order.totalPrice).toLocaleString('es-AR')}</td>
                    <td>
                      <span className={`badge badge-${order.status}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td>
                      {NEXT_STATUS[order.status] && (
                        <button
                          className={STATUS_BTN_CLASS[NEXT_STATUS[order.status]!]}
                          onClick={() =>
                            handleStatusChange(order.id, NEXT_STATUS[order.status]!)
                          }
                        >
                          {STATUS_LABELS[NEXT_STATUS[order.status]!]}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
