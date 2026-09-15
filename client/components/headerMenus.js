import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { useAuth } from '../auth';

export const menuItemStyle = {
  background: 'transparent',
  border: 0,
  color: '#111827',
  cursor: 'pointer',
  display: 'block',
  fontFamily: 'inherit',
  fontSize: '14px',
  fontWeight: 600,
  padding: '11px 16px',
  textAlign: 'left',
  textDecoration: 'none',
  width: '100%',
};

export const dropdownPanel = {
  background: '#ffffff',
  border: '1px solid #ececf2',
  borderRadius: '14px',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)',
  overflow: 'hidden',
  padding: '6px',
  position: 'absolute',
  right: 0,
  top: 'calc(100% + 8px)',
  zIndex: 50,
};

export const pillButton = {
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '999px',
  color: '#fff',
  cursor: 'pointer',
  display: 'flex',
  fontFamily: 'inherit',
  fontSize: '14px',
  fontWeight: 600,
  gap: '8px',
};

// Language names always render in their own language so a user who picked the
// wrong one can still find their way back
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh-HK', label: '繁體中文' },
];

export const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.4 2.5 15.6 0 18M12 3c-2.5 2.4-2.5 15.6 0 18" />
  </svg>
);

// Close a dropdown when clicking anywhere outside of it. Clicking a sibling
// dropdown's trigger counts as "outside", so only one stays open at a time.
function useCloseOnOutsideClick(ref, close, active) {
  useEffect(() => {
    if (!active) return undefined;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps
}

export const LanguageMenu = () => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useCloseOnOutsideClick(ref, () => setOpen(false), open);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title={t('Language')}
        style={{ ...pillButton, gap: '6px', padding: '9px 12px' }}
      >
        <GlobeIcon />
        <span style={{ color: '#94a3b8', fontSize: '10px' }}>&#9660;</span>
      </button>
      {open && (
        <div style={{ ...dropdownPanel, minWidth: '150px' }}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              style={{
                ...menuItemStyle,
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {lang.label}
              {language === lang.code && (
                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>&#10003;</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// `items` are rendered above the shared Log out entry; each is
// { key, label, to } for a link or { key, label, onClick } for an action.
export const AccountMenu = ({ items = [] }) => {
  const { t } = useLanguage();
  const { user, clearAuth } = useAuth();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useCloseOnOutsideClick(ref, () => setOpen(false), open);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{ ...pillButton, padding: '5px 14px 5px 5px' }}
      >
        <div
          style={{
            alignItems: 'center',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            borderRadius: '50%',
            display: 'flex',
            fontSize: '13px',
            fontWeight: 700,
            height: '32px',
            justifyContent: 'center',
            width: '32px',
          }}
        >
          {(user.display_name || user.username || '?')[0].toUpperCase()}
        </div>
        {user.display_name || user.username}
        <span style={{ color: '#94a3b8', fontSize: '10px' }}>&#9660;</span>
      </button>
      {open && (
        <div style={{ ...dropdownPanel, minWidth: '170px' }}>
          {items.map((item) => (
            item.to ? (
              <Link key={item.key} to={item.to} onClick={() => setOpen(false)} style={menuItemStyle}>
                {item.label}
              </Link>
            ) : (
              <button
                key={item.key}
                type="button"
                onClick={() => { setOpen(false); item.onClick(); }}
                style={menuItemStyle}
              >
                {item.label}
              </button>
            )
          ))}
          {items.length > 0 && (
            <div style={{ background: '#ececf2', height: '1px', margin: '4px 0' }} />
          )}
          <button
            type="button"
            onClick={() => { setOpen(false); clearAuth(); history.push('/'); }}
            style={{ ...menuItemStyle, color: '#e11d48' }}
          >
            {t('Log out')}
          </button>
        </div>
      )}
    </div>
  );
};
