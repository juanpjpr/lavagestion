import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser, getCurrentTenant } from '../services/api';
import { useI18n, LANG_OPTIONS } from '../i18n';

export function SettingsPage() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useI18n();
  const user = getCurrentUser();
  const tenant = getCurrentTenant();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <div className="page-header">
        <h2>{t('settings_title')}</h2>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">{t('settings_language')}</h3>
        <div className="card">
          <div className="lang-grid">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                className={`lang-option ${lang === opt.code ? 'active' : ''}`}
                onClick={() => setLang(opt.code)}
              >
                <span className="lang-option-code">{opt.label}</span>
                <span className="lang-option-name">{opt.name}</span>
                {lang === opt.code && <span className="lang-option-check">&#10003;</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">{t('settings_account')}</h3>
        <div className="card">
          <div className="settings-row">
            <span className="settings-label">{t('settings_name')}</span>
            <span>{user?.name}</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">{t('settings_email')}</span>
            <span>{user?.email}</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">{t('settings_role')}</span>
            <span className="badge badge-RECEIVED">{user?.role === 'OWNER' ? t('role_owner') : t('role_employee')}</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">{t('settings_business')}</h3>
        <div className="card">
          <div className="settings-row">
            <span className="settings-label">{t('settings_laundry')}</span>
            <span>{tenant?.name}</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">{t('settings_store_id')}</span>
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
          {t('settings_logout')}
        </button>
      </div>
    </div>
  );
}
