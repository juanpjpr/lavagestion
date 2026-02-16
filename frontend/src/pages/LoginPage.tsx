import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';

export function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');

  // Register fields
  const [tenantName, setTenantName] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(tenantName, name, email, password);
      } else {
        await login(email, password, tenantSlug);
      }
      navigate('/orders');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h1>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>Nombre de tu Lavadero</label>
                <input
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="Lavandería Don Pedro"
                  required
                />
              </div>
              <div className="form-group">
                <label>Tu Nombre</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Pedro García"
                  required
                />
              </div>
            </>
          )}

          {!isRegister && (
            <div className="form-group">
              <label>ID de Tienda</label>
              <input
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
                placeholder="lavanderia-don-pedro"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@milavadero.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Cargando...' : isRegister ? 'Crear Cuenta' : 'Entrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
          {isRegister ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isRegister ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </p>
      </div>
    </div>
  );
}
