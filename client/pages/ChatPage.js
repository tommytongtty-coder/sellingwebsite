import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';

import { shell, card } from '../styles/globals';
import SiteHeader from '../components/SiteHeader';
import ListingCard from '../components/ListingCard';
import MessageThread from '../components/MessageThread';
import { useAuth } from '../auth';
import { getConversation, getMessages, sendMessage, markAsRead } from '../services/api';
import { useLanguage } from '../i18n';

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

              <ListingCard
                listing={{
                  title: conversation.listing_title,
                  price: conversation.listing_price,
                  cover: conversation.listing_cover,
                }}
                to={`/listing/${conversation.listing_id}`}
              />
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
