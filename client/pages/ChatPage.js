import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';

import { shell, card } from '../styles/globals';
import SiteHeader from '../components/SiteHeader';
import { formatPrice } from '../components/ListingCard';
import MessageThread from '../components/MessageThread';
import { useAuth } from '../auth';
import { getConversation, getMessages, sendMessage, markAsRead } from '../services/api';
import { useLanguage } from '../i18n';

function formatCondition(c) {
  if (!c) return '';
  return c.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}

const ChatPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const markedRef = useRef(false);

  const loadMessages = useCallback(() => (
    getMessages(id).then((rows) => setMessages(rows))
  ), [id]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([getConversation(id), loadMessages()])
      .then(([conv]) => { setConversation(conv); setError(''); })
      .catch((err) => setError(err.message || 'Failed to load conversation'))
      .finally(() => setLoading(false));
  }, [id, user, loadMessages]);

  // Clear the unread badge once, after the thread is on screen
  useEffect(() => {
    if (!conversation || markedRef.current) return;
    markedRef.current = true;
    markAsRead(id).catch(() => {});
  }, [conversation, id]);

  const handleSend = (body) => sendMessage(id, body).then(loadMessages);

  if (!authLoading && !user) return <Redirect to="/login" />;

  const isAdminThread = conversation && conversation.type === 'admin_support';
  const otherName = conversation
    ? (conversation.buyer_id === user.id ? conversation.seller_name : conversation.buyer_name)
    : '';

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

      <div style={{ ...shell, maxWidth: '820px', paddingBottom: '60px', paddingTop: '28px' }}>
        <div style={{ color: '#7c3aed', fontSize: '13px', fontWeight: 700, marginBottom: '18px' }}>
          <Link to="/user" style={{ color: '#7c3aed', textDecoration: 'none' }}>
            {t('My listings')}
          </Link>
          {' / '}
          <span style={{ color: '#111827' }}>{t('Chat')}</span>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '14px',
              color: '#b91c1c',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '18px',
              padding: '16px 18px',
            }}
          >
            {error}
          </div>
        )}

        {loading && !conversation && (
          <div style={{ ...card, color: '#94a3b8', padding: '40px', textAlign: 'center' }}>
            {t('Loading listings...')}
          </div>
        )}

        {conversation && (
          <section style={{ ...card, overflow: 'hidden' }}>
            <div style={{ borderBottom: '1px solid #eef2f7', padding: '20px 22px' }}>
              <div style={{ alignItems: 'center', display: 'flex', gap: '10px', marginBottom: '14px' }}>
                <div style={{ fontSize: '17px', fontWeight: 700 }}>
                  {isAdminThread ? t('Shop Admin') : otherName}
                </div>
                {isAdminThread && (
                  <span
                    style={{
                      background: '#ede9fe',
                      borderRadius: '999px',
                      color: '#7c3aed',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      padding: '4px 9px',
                    }}
                  >
                    {t('Support')}
                  </span>
                )}
              </div>

              {/* Item detail card (non-clickable) */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                }}
              >
                {conversation.listing_cover ? (
                  <img
                    src={conversation.listing_cover}
                    alt=""
                    style={{
                      borderRadius: '12px',
                      flexShrink: 0,
                      height: '100px',
                      objectFit: 'cover',
                      width: '100px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      background: '#e2e8f0',
                      borderRadius: '12px',
                      flexShrink: 0,
                      height: '100px',
                      width: '100px',
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                    {conversation.listing_title}
                  </div>
                  <div style={{ color: '#7c3aed', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                    {formatPrice(conversation.listing_price)}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      conversation.listing_brand,
                      conversation.listing_gpu_model,
                      conversation.listing_vram_gb ? `${conversation.listing_vram_gb}GB` : null,
                      conversation.listing_condition ? t(formatCondition(conversation.listing_condition)) : null,
                      conversation.listing_location,
                    ].filter(Boolean).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: '#eef2f7',
                          borderRadius: '999px',
                          color: '#475569',
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '4px 10px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {conversation.listing_description && (
                    <div
                      style={{
                        color: '#64748b',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        marginTop: '8px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {conversation.listing_description}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <MessageThread
              messages={messages}
              currentUserId={user.id}
              onSend={handleSend}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
