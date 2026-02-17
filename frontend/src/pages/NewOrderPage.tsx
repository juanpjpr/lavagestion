import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import { useI18n } from '../i18n';

interface ItemForm {
  description: string;
  quantity: number;
  unitPrice: number;
}

const emptyItem = (): ItemForm => ({ description: '', quantity: 1, unitPrice: 0 });

export function NewOrderPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ItemForm[]>([emptyItem()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

  const updateItem = (index: number, field: keyof ItemForm, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const validItems = items.filter((it) => it.description.trim() && it.unitPrice > 0);
    if (validItems.length === 0) {
      setError(t('new_order_error'));
      return;
    }

    setLoading(true);
    try {
      await createOrder({
        clientName,
        clientPhone,
        items: validItems,
        notes: notes || undefined,
      });
      navigate('/orders');
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>{t('new_order_title')}</h2>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '1rem' }}>{t('new_order_client_section')}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>{t('new_order_name')}</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={t('new_order_name_hint')}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('new_order_phone')}</label>
              <input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder={t('new_order_phone_hint')}
                required
              />
            </div>
          </div>

          <h3 style={{ margin: '1.5rem 0 1rem' }}>{t('new_order_items_section')}</h3>
          <div className="items-list">
            <div className="item-row" style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
              <span>{t('new_order_description')}</span>
              <span>{t('new_order_qty')}</span>
              <span>{t('new_order_price')}</span>
              <span></span>
            </div>
            {items.map((item, i) => (
              <div className="item-row" key={i}>
                <input
                  placeholder={t('new_order_description_hint')}
                  value={item.description}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))}
                />
                <input
                  type="number"
                  min="0"
                  step="50"
                  placeholder="$500"
                  value={item.unitPrice || ''}
                  onChange={(e) => updateItem(i, 'unitPrice', Number(e.target.value))}
                />
                <button type="button" className="remove-btn" onClick={() => removeItem(i)}>
                  x
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="btn" onClick={addItem} style={{ marginBottom: '1rem' }}>
            {t('new_order_add')}
          </button>

          <div className="total-display">{t('new_order_total')}: ${total.toLocaleString('es-AR')}</div>

          <div className="form-group">
            <label>{t('new_order_notes')}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('new_order_notes_hint')}
              rows={2}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn" onClick={() => navigate('/orders')}>
              {t('new_order_cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t('new_order_creating') : t('new_order_submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
