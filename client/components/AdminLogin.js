import React, { useState } from 'react';

import { useLanguage } from '../i18n';

const fieldStyle = {
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.14)',
  borderRadius: '12px',
  boxSizing: 'border-box',
  color: '#fff',
  fontFamily: 'inherit',
  fontSize: '15px',
  outline: 'none',
  padding: '13px 15px',
  width: '100%',
};

const AdminLogin = ({ onSignIn }) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    onSignIn(username.trim(), password)
      .catch((err) => setError(err.message || 'Sign in failed'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div
      style={{
        alignItems: 'center',
        background: '#0b1020',
        display: 'flex',
        fontFamily: 'Roboto, sans-serif',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '22px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.45)',
          boxSizing: 'border-box',
          maxWidth: '400px',
          padding: '36px',
          width: '100%',
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: '10px', marginBottom: '26px' }}>
          <div
            style={{
              alignItems: 'center',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              borderRadius: '14px',
              color: '#fff',
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
          <div style={{ color: '#fff', fontSize: '22px', fontWeight: 700 }}>{t('Market')}</div>
          <span
            style={{
              background: '#e11d48',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '4px 8px',
            }}
          >
            ADMIN
          </span>
        </div>

        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: '0 0 8px' }}>
          {t('Admin sign in')}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>
          {t('This console is separate from your shopper account.')}
        </p>

        {error && (
          <div
            style={{
              background: 'rgba(225, 29, 72, 0.12)',
              border: '1px solid rgba(225, 29, 72, 0.35)',
              borderRadius: '12px',
              color: '#fda4af',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '18px',
              padding: '12px 14px',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gap: '14px' }}>
          <label style={{ display: 'grid', gap: '7px' }}>
            <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 700 }}>
              {t('Username')}
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              style={fieldStyle}
            />
          </label>
          <label style={{ display: 'grid', gap: '7px' }}>
            <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 700 }}>
              {t('Password')}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={fieldStyle}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            background: '#e11d48',
            border: 0,
            borderRadius: '12px',
            color: '#fff',
            cursor: submitting ? 'default' : 'pointer',
            fontFamily: 'inherit',
            fontSize: '15px',
            fontWeight: 700,
            marginTop: '24px',
            opacity: submitting ? 0.7 : 1,
            padding: '14px',
            width: '100%',
          }}
        >
          {submitting ? t('Signing in...') : t('Sign in')}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
