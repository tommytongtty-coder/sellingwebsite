import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { shell, card } from '../styles/globals';
import SiteHeader from '../components/SiteHeader';
import { login } from '../services/api';
import { useAuth } from '../auth';

const inputStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxSizing: 'border-box',
  color: '#111827',
  fontSize: '15px',
  outline: 'none',
  padding: '14px 18px',
  width: '100%',
};

const LoginPage = () => {
  const history = useHistory();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    setSubmitting(true);
    try {
      const result = await login({ email: email.trim(), password });
      setAuth(result);
      history.push('/user');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background:
          'radial-gradient(circle at top left, rgba(139, 92, 246, 0.08), transparent 28%), #f6f7fb',
        color: '#111827',
        fontFamily: 'Roboto, sans-serif',
        minHeight: '100vh',
      }}
    >
      <SiteHeader />
      <div style={{ ...shell, maxWidth: '440px', paddingBottom: '60px', paddingTop: '60px' }}>
        <div style={{ ...card, padding: '36px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>
            Welcome back
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 28px', textAlign: 'center' }}>
            Log in to your Market account
          </p>

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                color: '#dc2626',
                fontSize: '14px',
                marginBottom: '18px',
                padding: '12px 16px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
            <div>
              <label style={{ color: '#374151', display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                autoComplete="email"
              />
            </div>
            <div>
              <label style={{ color: '#374151', display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting ? '#a78bfa' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                border: 0,
                borderRadius: '12px',
                color: '#fff',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 700,
                marginTop: '6px',
                padding: '14px',
              }}
            >
              {submitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '22px', textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ color: '#8b5cf6', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
