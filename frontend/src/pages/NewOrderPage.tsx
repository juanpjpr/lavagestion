import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';

interface ItemForm {
  description: string;
  quantity: number;
  unitPrice: number;
}

const emptyItem = (): ItemForm => ({ description: '', quantity: 1, unitPrice: 0 });

export function NewOrderPage() {
  const navigate = useNavigate();
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
      setError('Agregá al menos una prenda con precio');
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
      setError(err.message || 'Error al crear pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Nuevo Pedido</h2>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '1rem' }}>Datos del Cliente</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="María García"
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="1155551234"
                required
              />
            </div>
          </div>

          <h3 style={{ margin: '1.5rem 0 1rem' }}>Prendas</h3>
          <div className="items-list">
            <div className="item-row" style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
              <span>Descripción</span>
              <span>Cant.</span>
              <span>Precio</span>
              <span></span>
            </div>
            {items.map((item, i) => (
              <div className="item-row" key={i}>
                <input
                  placeholder="Camisa blanca"
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
            + Agregar prenda
          </button>

          <div className="total-display">Total: ${total.toLocaleString('es-AR')}</div>

          <div className="form-group">
            <label>Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mancha en el cuello, tratar con cuidado..."
              rows={2}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn" onClick={() => navigate('/orders')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
