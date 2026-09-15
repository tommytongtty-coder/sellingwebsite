import React, { useState, useRef, useEffect } from 'react';

import { useLanguage } from '../i18n';

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-HK', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  });
}

// Message list plus composer. Shared by the seller's chat page and the admin
// console, so both sides of a thread look and behave the same.
const MessageThread = ({ messages, currentUserId, onSend, height = '420px' }) => {
  const { t } = useLanguage();
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  // Keep the newest message in view
  useEffect(() => {
    if (bottomRef.current && bottomRef.current.scrollIntoView) {
      bottomRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [messages.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setError('');
    Promise.resolve(onSend(body))
      .then(() => setDraft(''))
      .catch((err) => setError(err.message || 'Failed to send'))
      .finally(() => setSending(false));
  };

  return (
    <>
      <div style={{ display: 'grid', gap: '12px', height, overflowY: 'auto', padding: '20px 22px' }}>
        {messages.length === 0 && (
          <div style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
            {t('No messages yet.')}
          </div>
        )}
        {messages.map((msg) => {
          const mine = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}
            >
              <div style={{ maxWidth: '78%' }}>
                <div
                  style={{
                    background: mine ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : '#f1f5f9',
                    borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    color: mine ? '#fff' : '#111827',
                    fontSize: '15px',
                    lineHeight: 1.55,
                    padding: '11px 14px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.body}
                </div>
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: '11px',
                    marginTop: '5px',
                    textAlign: mine ? 'right' : 'left',
                  }}
                >
                  {mine ? t('You') : msg.sender_name} {'\u00b7'} {formatTime(msg.created_at)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ borderTop: '1px solid #eef2f7', display: 'grid', gap: '10px', padding: '16px 22px' }}
      >
        {error && (
          <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 600 }}>{error}</div>
        )}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('Write a message...')}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '999px',
              color: '#111827',
              flex: 1,
              fontFamily: 'inherit',
              fontSize: '15px',
              outline: 'none',
              padding: '13px 18px',
            }}
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              border: 0,
              borderRadius: '999px',
              color: '#fff',
              cursor: sending || !draft.trim() ? 'default' : 'pointer',
              fontFamily: 'inherit',
              fontSize: '14px',
              fontWeight: 700,
              opacity: sending || !draft.trim() ? 0.6 : 1,
              padding: '13px 24px',
            }}
          >
            {sending ? t('Sending...') : t('Send')}
          </button>
        </div>
      </form>
    </>
  );
};

export default MessageThread;
