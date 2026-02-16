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
  DELIVERED: 'btn btn-sm btn-outline',
};

export function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | ''>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [whatsappDialog, setWhatsappDialog] = useState<Order | null>(null);

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

  useEffect(() => {
    const timer = setTimeout(() => { fetchOrders(); }, 300);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    // If advancing to READY, show WhatsApp dialog
    if (newStatus === 'READY') {
      try {
        await updateOrderStatus(order.id, newStatus);
        setWhatsappDialog(order);
        fetchOrders();
      } catch (err: any) {
        alert(err.message);
      }
      return;
    }

    try {
      await updateOrderStatus(order.id, newStatus);
      fetchOrders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const sendWhatsApp = (order: Order) => {
    const phone = order.client.phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hola! Tu pedido #${order.ticketNumber} está listo para retirar. Te esperamos!`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    setWhatsappDialog(null);
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
      <div className="form-group" style={{ maxWidth: 400 }}>
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

      {/* Desktop Table */}
      <div className="card orders-table-desktop">
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
                    <td>
                      <a href={`tel:${order.client.phone}`} className="phone-link">
                        {order.client.phone}
                      </a>
                    </td>
                    <td>{order.items.length} prenda(s)</td>
                    <td>${Number(order.totalPrice).toLocaleString('es-AR')}</td>
                    <td>
                      <span className={`badge badge-${order.status}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {NEXT_STATUS[order.status] && (
                          <button
                            className={STATUS_BTN_CLASS[NEXT_STATUS[order.status]!]}
                            onClick={() => handleStatusChange(order, NEXT_STATUS[order.status]!)}
                          >
                            {STATUS_LABELS[NEXT_STATUS[order.status]!]}
                          </button>
                        )}
                        {order.status === 'READY' && (
                          <button
                            className="btn btn-sm btn-whatsapp"
                            onClick={() => sendWhatsApp(order)}
                            title="Avisar por WhatsApp"
                          >
                            WhatsApp
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="orders-cards-mobile">
        {loading ? (
          <p>Cargando...</p>
        ) : orders.length === 0 ? (
          <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '2rem' }}>No hay pedidos</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <strong>#{order.ticketNumber}</strong>
                <span className={`badge badge-${order.status}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="order-card-client">
                <span>{order.client.name}</span>
                <a href={`tel:${order.client.phone}`} className="phone-link">
                  {order.client.phone}
                </a>
              </div>
              <div className="order-card-details">
                <span>{order.items.length} prenda(s)</span>
                <strong>${Number(order.totalPrice).toLocaleString('es-AR')}</strong>
              </div>
              <div className="order-card-actions">
                {NEXT_STATUS[order.status] && (
                  <button
                    className={STATUS_BTN_CLASS[NEXT_STATUS[order.status]!]}
                    onClick={() => handleStatusChange(order, NEXT_STATUS[order.status]!)}
                  >
                    Pasar a {STATUS_LABELS[NEXT_STATUS[order.status]!]}
                  </button>
                )}
                {order.status === 'READY' && (
                  <button
                    className="btn btn-sm btn-whatsapp"
                    onClick={() => sendWhatsApp(order)}
                  >
                    Avisar por WhatsApp
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* WhatsApp Dialog */}
      {whatsappDialog && (
        <div className="dialog-overlay" onClick={() => setWhatsappDialog(null)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Avisar al cliente</h3>
            <p>
              ¿Querés avisarle a <strong>{whatsappDialog.client.name}</strong> por WhatsApp
              que su pedido está listo?
            </p>
            <div className="dialog-actions">
              <button className="btn" onClick={() => setWhatsappDialog(null)}>
                No
              </button>
              <button className="btn btn-whatsapp" onClick={() => sendWhatsApp(whatsappDialog)}>
                Sí, avisar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
