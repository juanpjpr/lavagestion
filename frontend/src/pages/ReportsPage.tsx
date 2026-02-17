import { useState, useEffect } from 'react';
import { getDailyReport } from '../services/api';
import { useI18n } from '../i18n';
import type { DailyReport, OrderStatus } from '../types';

const STATUS_KEYS: Record<string, string> = {
  RECEIVED: 'status_received',
  WASHING: 'status_washing',
  READY: 'status_ready',
  DELIVERED: 'status_delivered',
};

export function ReportsPage() {
  const { t } = useI18n();
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
        <h2>{t('reports_title')}</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--gray-300)' }}
        />
      </div>

      {loading ? (
        <p>{t('loading')}</p>
      ) : report ? (
        <>
          <div className="stat-grid">
            <div className="card stat-card">
              <div className="stat-value">{report.totalOrders}</div>
              <div className="stat-label">{t('reports_orders')}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">${report.totalIncome.toLocaleString('es-AR')}</div>
              <div className="stat-label">{t('reports_income')}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">${report.averageTicket.toLocaleString('es-AR')}</div>
              <div className="stat-label">{t('reports_average')}</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>{t('reports_by_status')}</h3>
            <div className="stat-grid">
              {(Object.entries(report.byStatus) as [string, number][]).map(([status, count]) => (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge badge-${status}`} style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>
                    {t(STATUS_KEYS[status as OrderStatus])}
                  </span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p>{t('reports_no_data')}</p>
      )}
    </div>
  );
}
