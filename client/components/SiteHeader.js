import React from 'react';
import { Link } from 'react-router-dom';
import { shell } from '../styles/globals';
import { useLanguage } from '../i18n';
import { useAuth } from '../auth';
import { LanguageMenu, AccountMenu } from './headerMenus';

const SiteHeader = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <header
      style={{
        background: '#0f172a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#fff',
      }}
    >
    <div
      className="top-nav"
      style={{
        ...shell,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        paddingBottom: '16px',
        paddingTop: '16px',
      }}
    >
      {/* ── Row 1: logo, nav, actions ── */}
      <div style={{ alignItems: 'center', display: 'flex', gap: '18px', minHeight: '52px' }}>
      <Link
        to="/"
        style={{
          alignItems: 'center',
          color: '#fff',
          display: 'flex',
          gap: '10px',
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            borderRadius: '14px',
            display: 'flex',
            fontSize: '18px',
            fontWeight: 700,
            height: '42px',
            justifyContent: 'center',
            width: '42px',
          }}
        >
          M
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>
            {t('Market')}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
            {t('buy. sell. upgrade.')}
          </div>
        </div>
      </Link>

      <div style={{ flex: 1 }} />

      <div
        className="nav-actions"
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: '12px',
        }}
      >
        <LanguageMenu />
        {user ? (
          <AccountMenu items={[{ key: 'listings', label: t('My listings'), to: '/user' }]} />
        ) : (
          <>
            <Link to="/login" style={{ color: '#cbd5e1', fontSize: '14px', textDecoration: 'none' }}>
              {t('Log in')}
            </Link>
            <Link
              to="/register"
              style={{
                background: '#ffffff',
                borderRadius: '999px',
                color: '#111827',
                fontSize: '14px',
                fontWeight: 700,
                padding: '10px 16px',
                textDecoration: 'none',
              }}
            >
              {t('Sign up')}
            </Link>
          </>
        )}
        <Link
          to="/sell"
          style={{
            background: '#06b6d4',
            borderRadius: '8px',
            color: '#0f172a',
            fontSize: '16px',
            fontWeight: 700,
            padding: '10px 20px',
            textDecoration: 'none',
          }}
        >
          {t('Sell')}
        </Link>
      </div>
      </div>

      {/* ── Row 2: search ── */}
      <div
        style={{
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          overflow: 'hidden',
        }}
      >
        <input
          placeholder={t('Search GPUs, parts, or sellers')}
          style={{
            background: 'transparent',
            border: 0,
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            padding: '14px 18px',
          }}
        />
        <button
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            border: 0,
            borderRadius: '999px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 700,
            margin: '6px',
            padding: '10px 22px',
          }}
        >
          {t('Search')}
        </button>
      </div>
    </div>
  </header>
  );
};

export default SiteHeader;
