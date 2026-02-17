import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
import { useI18n, LANG_OPTIONS } from '../i18n';

export function LoginPage() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useI18n();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
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
      setError(err.message || t('login_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="lang-selector">
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              className={`lang-btn ${lang === opt.code ? 'active' : ''}`}
              onClick={() => setLang(opt.code)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>

        <h1>{isRegister ? t('login_create_account') : t('login_sign_in')}</h1>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>{t('login_tenant_name')}</label>
                <input
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder={t('login_tenant_name_hint')}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('login_user_name')}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('login_user_name_hint')}
                  required
                />
              </div>
            </>
          )}

          {!isRegister && (
            <div className="form-group">
              <label>{t('login_tenant_slug')}</label>
              <input
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
                placeholder={t('login_tenant_slug_hint')}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>{t('login_email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login_email_hint')}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('login_password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? t('loading') : isRegister ? t('login_register_btn') : t('login_enter_btn')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
          {isRegister ? t('login_has_account') : t('login_no_account')}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isRegister ? t('login_sign_in_link') : t('login_register_link')}
          </button>
        </p>
      </div>
    </div>
  );
}
