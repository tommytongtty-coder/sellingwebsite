import React from 'react';
import { Link } from 'react-router-dom';

import { shell } from '../styles/globals';
import { useLanguage } from '../i18n';
import { LanguageMenu, pillButton } from './headerMenus';

// Deliberately darker than the public header's #0f172a so it is always obvious
// you are looking at the moderation console and not the storefront.
const BAR_BG = '#0b1020';

const AdminHeader = ({ tabs, activeTab, onTabChange, search, onSearchChange, admin, onSignOut }) => {
  const { t } = useLanguage();

  return (
    <header
      style={{
        background: BAR_BG,
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
        {/* ── Row 1: brand, nav, actions ── */}
        <div style={{ alignItems: 'center', display: 'flex', gap: '18px', minHeight: '52px' }}>
          <div style={{ alignItems: 'center', display: 'flex', gap: '10px' }}>
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
            <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>
              {t('Market')}
            </div>
            <span
              style={{
                background: '#e11d48',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                marginLeft: '4px',
                padding: '4px 8px',
              }}
            >
              ADMIN
            </span>
          </div>

          <nav style={{ alignItems: 'center', display: 'flex', gap: '4px', marginLeft: '14px' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                style={{
                  background: activeTab === tab ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: 0,
                  borderRadius: '999px',
                  color: activeTab === tab ? '#fff' : '#94a3b8',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  fontWeight: activeTab === tab ? 700 : 600,
                  padding: '9px 16px',
                }}
              >
                {t(tab)}
              </button>
            ))}
          </nav>

          <div style={{ flex: 1 }} />

          <div
            className="nav-actions"
            style={{ alignItems: 'center', display: 'flex', gap: '12px' }}
          >
            <LanguageMenu />
            {admin && (
              <div style={{ ...pillButton, cursor: 'default', padding: '5px 6px 5px 14px' }}>
                <span>{admin.username}</span>
                <button
                  type="button"
                  onClick={onSignOut}
                  style={{
                    background: 'rgba(225, 29, 72, 0.18)',
                    border: '1px solid rgba(225, 29, 72, 0.4)',
                    borderRadius: '999px',
                    color: '#fda4af',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '6px 12px',
                  }}
                >
                  {t('Log out')}
                </button>
              </div>
            )}
            <Link
              to="/"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '8px',
                color: '#cbd5e1',
                fontSize: '14px',
                fontWeight: 700,
                padding: '9px 16px',
                textDecoration: 'none',
              }}
            >
              {t('Exit to site')}
            </Link>
          </div>
        </div>

        {/* ── Row 2: admin search ── */}
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
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('Search by title, seller, or ID')}
            style={{
              background: 'transparent',
              border: 0,
              color: '#fff',
              fontSize: '15px',
              outline: 'none',
              padding: '14px 18px',
            }}
          />
          {search ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 0,
                borderRadius: '999px',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: 700,
                margin: '6px',
                padding: '10px 22px',
              }}
            >
              {t('Clear')}
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
