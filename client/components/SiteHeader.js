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
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px 18px',
          minHeight: '76px',
          paddingBottom: '16px',
          paddingTop: '16px',
        }}
      >
        <Link
          to="/"
          className="top-nav-brand"
          style={{
            alignItems: 'center',
            color: '#fff',
            display: 'flex',
            flexShrink: 0,
            gap: '10px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              borderRadius: '14px',
              display: 'flex',
              flexShrink: 0,
              fontSize: '18px',
              fontWeight: 700,
              height: '42px',
              justifyContent: 'center',
              width: '42px',
            }}
          >
            M
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1, whiteSpace: 'nowrap' }}>
              {t('Market')}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px', whiteSpace: 'nowrap' }}>
              {t('buy. sell. upgrade.')}
            </div>
          </div>
        </Link>

        <div
          className="top-nav-search"
          style={{
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '999px',
            display: 'flex',
            flex: '1 1 260px',
            minWidth: '220px',
            overflow: 'hidden',
          }}
        >
          <input
            placeholder={t('Search GPUs, parts, or sellers')}
            style={{
              background: 'transparent',
              border: 0,
              color: '#fff',
              flex: 1,
              fontSize: '15px',
              minWidth: 0,
              outline: 'none',
              padding: '14px 18px',
            }}
          />
          <button
            type="button"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              border: 0,
              borderRadius: '999px',
              color: '#fff',
              cursor: 'pointer',
              flexShrink: 0,
              fontSize: '14px',
              fontWeight: 700,
              margin: '6px',
              padding: '10px 22px',
              whiteSpace: 'nowrap',
            }}
          >
            {t('Search')}
          </button>
        </div>

        <div
          className="nav-actions"
          style={{
            alignItems: 'center',
            display: 'flex',
            flexShrink: 0,
            gap: '12px',
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <LanguageMenu />
          {user ? (
            <AccountMenu items={[{ key: 'listings', label: t('My listings'), to: '/user' }]} />
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: '#cbd5e1',
                  flexShrink: 0,
                  fontSize: '14px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('Log in')}
              </Link>
              <Link
                to="/register"
                style={{
                  background: '#ffffff',
                  borderRadius: '999px',
                  color: '#111827',
                  flexShrink: 0,
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '10px 16px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
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
              flexShrink: 0,
              fontSize: '16px',
              fontWeight: 700,
              padding: '10px 20px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {t('Sell')}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
