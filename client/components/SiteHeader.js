import React from 'react';
import { Link } from 'react-router-dom';
import { shell } from '../styles/globals';
import { useLanguage } from '../i18n';

const SiteHeader = () => {
  const { language, setLanguage, t } = useLanguage();

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
        display: 'grid',
        gap: '18px',
        gridTemplateColumns: '160px minmax(0, 1fr) auto',
        minHeight: '76px',
      }}
    >
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

      <div
        style={{
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
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
            padding: '10px 18px',
          }}
        >
          {t('Search')}
        </button>
        <Link
          to="/admin"
          style={{
            background: '#ffffff',
            borderRadius: '999px',
            color: '#111827',
            fontSize: '14px',
            fontWeight: 700,
            margin: '6px 6px 6px 0',
            padding: '10px 18px',
            textDecoration: 'none',
          }}
        >
          {t('Admin Page')}
        </Link>
      </div>

      <div
        className="nav-actions"
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: '12px',
        }}
      >
        <Link
          to="/sell"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            padding: '10px 20px',
            textDecoration: 'none',
          }}
        >
          {t('Sell')}
        </Link>
        <a href="/" style={{ color: '#cbd5e1', fontSize: '14px', textDecoration: 'none' }}>
          {t('Log in')}
        </a>
        <a
          href="/"
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
        </a>
        <button
          type="button"
          onClick={() => setLanguage(language === 'zh-HK' ? 'en' : 'zh-HK')}
          style={{
            background: language === 'zh-HK' ? '#fef3c7' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '999px',
            color: language === 'zh-HK' ? '#92400e' : '#ffffff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 700,
            padding: '10px 14px',
          }}
        >
          {language === 'zh-HK' ? t('English') : '繁體中文'}
        </button>
      </div>
    </div>
  </header>
  );
};

export default SiteHeader;
