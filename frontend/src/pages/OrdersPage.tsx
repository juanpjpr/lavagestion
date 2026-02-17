import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../services/api';
import { useI18n } from '../i18n';
import type { Order, OrderStatus } from '../types';

const STATUS_KEYS: Record<OrderStatus, string> = {
  RECEIVED: 'status_received',
  WASHING: 'status_washing',
  READY: 'status_ready',
  DELIVERED: 'status_delivered',
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
  const { t } = useI18n();
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
      `${t('notify_whatsapp_pre')}${order.ticketNumber}${t('notify_whatsapp_post')}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    setWhatsappDialog(null);
  };

  const statusLabel = (status: OrderStatus) => t(STATUS_KEYS[status]);

  return (
    <div>
      <div className="page-header">
        <h2>{t('orders_title')}</h2>
        <button className="btn btn-primary" onClick={() => navigate('/orders/new')}>
          {t('orders_new')}
        </button>
      </div>

      <div className="form-group" style={{ maxWidth: 400 }}>
        <input
          placeholder={t('orders_search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === '' ? 'active' : ''}`}
          onClick={() => setFilter('')}
        >
          {t('filter_all')}
        </button>
        {(['RECEIVED', 'WASHING', 'READY', 'DELIVERED'] as OrderStatus[]).map((status) => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {statusLabel(status)}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="card orders-table-desktop">
        {loading ? (
          <p>{t('loading')}</p>
        ) : orders.length === 0 ? (
          <p style={{ color: 'var(--gray-500)' }}>{t('orders_empty')}</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t('th_ticket')}</th>
                  <th>{t('th_client')}</th>
                  <th>{t('th_phone')}</th>
                  <th>{t('th_items')}</th>
                  <th>{t('th_total')}</th>
                  <th>{t('th_status')}</th>
                  <th>{t('th_action')}</th>
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
                    <td>{order.items.length} {t('orders_items')}</td>
                    <td>${Number(order.totalPrice).toLocaleString('es-AR')}</td>
                    <td>
                      <span className={`badge badge-${order.status}`}>
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {NEXT_STATUS[order.status] && (
                          <button
                            className={STATUS_BTN_CLASS[NEXT_STATUS[order.status]!]}
                            onClick={() => handleStatusChange(order, NEXT_STATUS[order.status]!)}
                          >
                            {statusLabel(NEXT_STATUS[order.status]!)}
                          </button>
                        )}
                        {order.status === 'READY' && (
                          <button
                            className="btn btn-sm btn-whatsapp"
                            onClick={() => sendWhatsApp(order)}
                            title={t('notify_btn')}
                          >
                            {t('notify_btn')}
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
          <p>{t('loading')}</p>
        ) : orders.length === 0 ? (
          <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '2rem' }}>{t('orders_empty')}</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <strong>#{order.ticketNumber}</strong>
                <span className={`badge badge-${order.status}`}>
                  {statusLabel(order.status)}
                </span>
              </div>
              <div className="order-card-client">
                <span>{order.client.name}</span>
                <a href={`tel:${order.client.phone}`} className="phone-link">
                  {order.client.phone}
                </a>
              </div>
              <div className="order-card-details">
                <span>{order.items.length} {t('orders_items')}</span>
                <strong>${Number(order.totalPrice).toLocaleString('es-AR')}</strong>
              </div>
              <div className="order-card-actions">
                {NEXT_STATUS[order.status] && (
                  <button
                    className={STATUS_BTN_CLASS[NEXT_STATUS[order.status]!]}
                    onClick={() => handleStatusChange(order, NEXT_STATUS[order.status]!)}
                  >
                    {t('orders_advance_to')} {statusLabel(NEXT_STATUS[order.status]!)}
                  </button>
                )}
                {order.status === 'READY' && (
                  <button
                    className="btn btn-sm btn-whatsapp"
                    onClick={() => sendWhatsApp(order)}
                  >
                    {t('notify_btn')}
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
            <h3>{t('notify_title')}</h3>
            <p>
              {t('notify_message_pre')} <strong>{whatsappDialog.client.name}</strong> {t('notify_message_post')}
            </p>
            <div className="dialog-actions">
              <button className="btn" onClick={() => setWhatsappDialog(null)}>
                {t('notify_no')}
              </button>
              <button className="btn btn-whatsapp" onClick={() => sendWhatsApp(whatsappDialog)}>
                {t('notify_yes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
