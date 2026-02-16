import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout, getCurrentTenant } from '../services/api';

export function DashboardLayout() {
  const navigate = useNavigate();
  const tenant = getCurrentTenant();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>{tenant?.name || 'Lavadero'}</h1>
        <nav>
          <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
            Pedidos
          </NavLink>
          <NavLink to="/orders/new" className={({ isActive }) => isActive ? 'active' : ''}>
            + Nuevo Pedido
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
            Reportes
          </NavLink>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
