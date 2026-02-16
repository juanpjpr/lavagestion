import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser, getCurrentTenant } from '../services/api';

export function SettingsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const tenant = getCurrentTenant();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <div className="page-header">
        <h2>Ajustes</h2>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Cuenta</h3>
        <div className="card">
          <div className="settings-row">
            <span className="settings-label">Nombre</span>
            <span>{user?.name}</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Rol</span>
            <span className="badge badge-RECEIVED">{user?.role === 'OWNER' ? 'Dueño' : 'Empleado'}</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Negocio</h3>
        <div className="card">
          <div className="settings-row">
            <span className="settings-label">Lavadero</span>
            <span>{tenant?.name}</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">ID de Tienda</span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{tenant?.slug}</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <button className="btn btn-logout" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
