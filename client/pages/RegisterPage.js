import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { shell, card } from '../styles/globals';
import SiteHeader from '../components/SiteHeader';
import { register } from '../services/api';
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

const RegisterPage = () => {
  const history = useHistory();
  const { setAuth } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('seller');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) { setError('Username is required'); return; }
    if (username.trim().length > 50) { setError('Username must be 50 characters or fewer'); return; }
    if (!email.trim()) { setError('Email is required'); return; }
    if (!password) { setError('Password is required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setSubmitting(true);
    try {
      const result = await register({
        username: username.trim(),
        email: email.trim(),
        password,
        role,
        display_name: displayName.trim() || username.trim(),
        phone: phone.trim() || undefined,
      });
      setAuth(result);
      history.push('/user');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
            Create an account
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 28px', textAlign: 'center' }}>
            Join Market to buy and sell GPUs
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
            {/* Account type */}
            <div>
              <label style={{ color: '#374151', display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                I want to
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { value: 'seller', label: 'Sell GPUs' },
                  { value: 'buyer', label: 'Buy GPUs' },
                ].map((opt) => (
                  <span
                    key={opt.value}
                    onClick={() => setRole(opt.value)}
                    style={{
                      background: role === opt.value ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : '#fff',
                      border: `1px solid ${role === opt.value ? 'transparent' : '#e5e7eb'}`,
                      borderRadius: '999px',
                      color: role === opt.value ? '#fff' : '#475569',
                      cursor: 'pointer',
                      flex: 1,
                      fontSize: '14px',
                      fontWeight: 700,
                      padding: '10px 0',
                      textAlign: 'center',
                    }}
                  >
                    {opt.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label style={{ color: '#374151', display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                Username
              </label>
              <input
                placeholder="e.g. gpuking88"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
                autoComplete="username"
                maxLength={50}
              />
            </div>
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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label style={{ color: '#374151', display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                Display name <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                placeholder="Shown to other users"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={inputStyle}
                maxLength={100}
              />
            </div>
            <div>
              <label style={{ color: '#374151', display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                Phone <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. +852 9123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
                maxLength={20}
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
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '22px', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#8b5cf6', fontWeight: 600, textDecoration: 'none' }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
