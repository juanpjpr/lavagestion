import { useState, useEffect } from 'react';
import { getDailyReport } from '../services/api';
import type { DailyReport } from '../types';

const STATUS_LABELS = {
  RECEIVED: 'Recibido',
  WASHING: 'Lavando',
  READY: 'Listo',
  DELIVERED: 'Entregado',
};

export function ReportsPage() {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDailyReport(date)
      .then((res) => setReport(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <div>
      <div className="page-header">
        <h2>Reporte Diario</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--gray-300)' }}
        />
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : report ? (
        <>
          <div className="stat-grid">
            <div className="card stat-card">
              <div className="stat-value">{report.totalOrders}</div>
              <div className="stat-label">Pedidos del día</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">${report.totalIncome.toLocaleString('es-AR')}</div>
              <div className="stat-label">Ingresos del día</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">${report.averageTicket.toLocaleString('es-AR')}</div>
              <div className="stat-label">Ticket promedio</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Pedidos por Estado</h3>
            <div className="stat-grid">
              {(Object.entries(report.byStatus) as [string, number][]).map(([status, count]) => (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge badge-${status}`} style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>
                    {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                  </span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p>No hay datos</p>
      )}
    </div>
  );
}
