import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';

import { shell, card } from '../styles/globals';
import SiteHeader from '../components/SiteHeader';
import { formatPrice } from '../components/ListingCard';
import MessageThread from '../components/MessageThread';
import { useAuth } from '../auth';
import { useLanguage } from '../i18n';
import {
  getListing,
  openBuyerAdminChat,
  getConversation,
  getMessages,
  sendMessage,
  markAsRead,
  createOffer,
} from '../services/api';

function formatCondition(c) {
  if (!c) return '';
  return c.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function fmtHKD(n) {
  return 'HK$' + Number(n).toLocaleString('en-HK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Shared styles
const radioRow = {
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  fontSize: '14px',
  gap: '10px',
  padding: '5px 0',
};
const radioCircle = (selected) => ({
  alignItems: 'center',
  border: `2px solid ${selected ? '#8b5cf6' : '#cbd5e1'}`,
  borderRadius: '50%',
  display: 'flex',
  flexShrink: 0,
  height: '20px',
  justifyContent: 'center',
  width: '20px',
});
const radioInner = { background: '#8b5cf6', borderRadius: '50%', height: '10px', width: '10px' };
const dividerLine = { background: '#e2e8f0', height: '1px', margin: '16px 0' };
const costRow = { display: 'flex', fontSize: '13px', justifyContent: 'space-between', padding: '4px 0' };

const NegotiatePage = () => {
  const { id } = useParams(); // listing id
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();

  // Listing data
  const [listing, setListing] = useState(null);
  const [listingError, setListingError] = useState('');
  const [listingLoading, setListingLoading] = useState(true);

  // Conversation / chat data
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);
  const markedRef = useRef(false);

  // Transaction form state
  const [offerInput, setOfferInput] = useState('');
  const [savedOffer, setSavedOffer] = useState(null);
  const [offerError, setOfferError] = useState('');
  const [delivery, setDelivery] = useState('meetup');
  const [payment, setPayment] = useState('payme');
  const [installation, setInstallation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load listing
  useEffect(() => {
    setListingLoading(true);
    getListing(id)
      .then((row) => { setListing(row); setListingError(''); })
      .catch((err) => setListingError(err.message || 'Failed to load listing'))
      .finally(() => setListingLoading(false));
  }, [id]);

  // Open buyer-admin conversation once user is loaded
  useEffect(() => {
    if (!user) return;
    setChatLoading(true);
    openBuyerAdminChat(id)
      .then((conv) => {
        setConversation(conv);
        return getMessages(conv.id).then((rows) => setMessages(rows));
      })
      .catch(() => {})
      .finally(() => setChatLoading(false));
  }, [id, user]);

  // Mark as read
  useEffect(() => {
    if (!conversation || markedRef.current) return;
    markedRef.current = true;
    markAsRead(conversation.id).catch(() => {});
  }, [conversation]);

  const loadMessages = useCallback(() => {
    if (!conversation) return Promise.resolve();
    return getMessages(conversation.id).then((rows) => setMessages(rows));
  }, [conversation]);

  const handleSend = (body) => sendMessage(conversation.id, body).then(loadMessages);

  if (!authLoading && !user) return <Redirect to="/login" />;

  // Price calculations
  const basePrice = listing ? Number(listing.price) || 0 : 0;
  const minOffer = Math.round(basePrice * 0.6);
  const maxOffer = Math.round(basePrice * 1.4);

  const commitOffer = () => {
    setOfferError('');
    if (!offerInput) { setSavedOffer(null); return; }
    const n = Number(offerInput);
    if (isNaN(n) || n <= 0) {
      setOfferError(t('Please enter a valid amount'));
      setSavedOffer(null);
      return;
    }
    if (n < minOffer) {
      setOfferError(t('Offer too low, minimum is') + ' ' + fmtHKD(minOffer));
      setSavedOffer(null);
      return;
    }
    if (n > maxOffer) {
      setOfferError(t('Offer too high, maximum is') + ' ' + fmtHKD(maxOffer));
      setSavedOffer(null);
      return;
    }
    setSavedOffer(n);
  };

  const calcPrice = savedOffer !== null ? savedOffer : basePrice;
  const platformFee = Math.round(calcPrice * 0.02 * 100) / 100;
  const paymentFee = payment === 'credit_card' ? Math.round(calcPrice * 0.05 * 100) / 100 : 0;
  const installFee = installation ? 200 : 0;
  const shippingFee = 0;
  const estimatedTotal = calcPrice + platformFee + paymentFee + installFee + shippingFee;

  // Submit offer: save to DB + auto-send summary message
  const handleSubmitOffer = () => {
    if (!savedOffer || !conversation || submitting) return;
    setSubmitting(true);

    const deliveryLabel = delivery === 'meetup' ? t('Meet-up / Pickup — Free') : t('Shipping — Buyer pays freight');
    const paymentLabel = payment === 'payme' ? t('PayMe — No surcharge') : t('Credit Card — Extra 5%');
    const installLabel = installation ? t('GPU installation service (+HK$200)') : t('Not required');

    const summary = [
      `${t('Offer amount')}: ${fmtHKD(savedOffer)}`,
      `${t('Delivery Method')}: ${deliveryLabel}`,
      `${t('Payment Method')}: ${paymentLabel}`,
      `${t('Installation Service')}: ${installLabel}`,
      `${t('Estimated Total')}: ${fmtHKD(estimatedTotal)}`,
    ].join('\n');

    createOffer({ listing_id: Number(id), amount: savedOffer, message: summary })
      .then(() => sendMessage(conversation.id, summary))
      .then(loadMessages)
      .catch((err) => console.error('Failed to submit offer:', err))
      .finally(() => setSubmitting(false));
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

      <div style={{ ...shell, paddingBottom: '60px', paddingTop: '28px' }}>
        <div style={{ color: '#7c3aed', fontSize: '13px', fontWeight: 700, marginBottom: '18px' }}>
          <Link to="/" style={{ color: '#7c3aed', textDecoration: 'none' }}>
            {t('Listings')}
          </Link>
          {' / '}
          <Link to={`/listing/${id}`} style={{ color: '#7c3aed', textDecoration: 'none' }}>
            {listing ? listing.title : '...'}
          </Link>
          {' / '}
          <span style={{ color: '#111827' }}>{t('Negotiate')}</span>
        </div>

        {listingLoading && (
          <div style={{ ...card, color: '#94a3b8', padding: '40px', textAlign: 'center' }}>
            {t('Loading listings...')}
          </div>
        )}

        {listingError && (
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
            {listingError}
          </div>
        )}

        {!listingLoading && listing && (
          <div
            style={{
              display: 'grid',
              gap: '20px',
              gridTemplateColumns: '2fr 3fr',
              alignItems: 'start',
            }}
          >
            {/* ═══ LEFT PANEL: Transaction Negotiation ═══ */}
            <div style={{ ...card, overflow: 'hidden', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
              {/* Item info header */}
              <div style={{ borderBottom: '1px solid #eef2f7', padding: '20px' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  {listing.images && listing.images[0] ? (
                    <img
                      src={listing.images[0].image_url}
                      alt=""
                      style={{ borderRadius: '12px', flexShrink: 0, height: '80px', objectFit: 'cover', width: '80px' }}
                    />
                  ) : (
                    <div style={{ background: '#e2e8f0', borderRadius: '12px', flexShrink: 0, height: '80px', width: '80px' }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                      {listing.title}
                    </div>
                    <div style={{ color: '#7c3aed', fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                      {formatPrice(listing.price)}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {[
                        listing.brand,
                        listing.gpu_model,
                        listing.vram_gb ? `${listing.vram_gb}GB` : null,
                        listing.condition ? t(formatCondition(listing.condition)) : null,
                      ].filter(Boolean).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: '#eef2f7',
                            borderRadius: '999px',
                            color: '#475569',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction form */}
              <div style={{ padding: '20px' }}>
                {/* Offer input */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>
                    {t('Your Offer')}
                  </div>
                  <div
                    style={{
                      alignItems: 'center',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      display: 'flex',
                      gap: '6px',
                      padding: '4px 12px',
                    }}
                  >
                    <span style={{ color: '#64748b', fontSize: '15px', fontWeight: 700 }}>HK$</span>
                    <input
                      type="number"
                      placeholder={t('Enter your offer amount')}
                      value={offerInput}
                      onChange={(e) => { setOfferInput(e.target.value); setOfferError(''); }}
                      onBlur={commitOffer}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.target.blur(); } }}
                      style={{
                        background: 'transparent',
                        border: 0,
                        color: '#111827',
                        flex: 1,
                        fontFamily: 'inherit',
                        fontSize: '15px',
                        fontWeight: 700,
                        outline: 'none',
                        padding: '10px 0',
                      }}
                    />
                    {savedOffer !== null && !offerError && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {offerError && (
                    <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: 600, marginTop: '6px' }}>
                      {offerError}
                    </div>
                  )}
                  <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
                    {t('Acceptable range:')} {fmtHKD(minOffer)} – {fmtHKD(maxOffer)}
                  </div>
                </div>

                <div style={dividerLine} />

                {/* Delivery */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ color: '#111827', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                    {t('Delivery Method')}
                  </div>
                  <div onClick={() => setDelivery('meetup')} style={radioRow}>
                    <div style={radioCircle(delivery === 'meetup')}>
                      {delivery === 'meetup' && <div style={radioInner} />}
                    </div>
                    <span>{t('Meet-up / Pickup — Free')}</span>
                  </div>
                  <div onClick={() => setDelivery('shipping')} style={radioRow}>
                    <div style={radioCircle(delivery === 'shipping')}>
                      {delivery === 'shipping' && <div style={radioInner} />}
                    </div>
                    <span>{t('Shipping — Buyer pays freight')}</span>
                  </div>
                </div>

                <div style={dividerLine} />

                {/* Payment */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ color: '#111827', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                    {t('Payment Method')}
                  </div>
                  <div onClick={() => setPayment('payme')} style={radioRow}>
                    <div style={radioCircle(payment === 'payme')}>
                      {payment === 'payme' && <div style={radioInner} />}
                    </div>
                    <span>{t('PayMe — No surcharge')}</span>
                  </div>
                  <div onClick={() => setPayment('credit_card')} style={radioRow}>
                    <div style={radioCircle(payment === 'credit_card')}>
                      {payment === 'credit_card' && <div style={radioInner} />}
                    </div>
                    <span>{t('Credit Card — Extra 5%')}</span>
                  </div>
                </div>

                <div style={dividerLine} />

                {/* Installation */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ color: '#111827', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                    {t('Installation Service')}
                  </div>
                  <div onClick={() => setInstallation((prev) => !prev)} style={radioRow}>
                    <div style={radioCircle(installation)}>
                      {installation && <div style={radioInner} />}
                    </div>
                    <span>{t('GPU installation service (+HK$200)')}</span>
                  </div>
                </div>

                <div style={dividerLine} />

                {/* Cost breakdown */}
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>
                  {t('Estimated Cost')}
                </div>
                <div style={costRow}>
                  <span style={{ color: '#64748b' }}>{t('Item Price')}</span>
                  <span style={{ fontWeight: 600 }}>{fmtHKD(calcPrice)}</span>
                </div>
                <div style={costRow}>
                  <span style={{ color: '#64748b' }}>{t('Platform Fee (2%)')}</span>
                  <span style={{ fontWeight: 600 }}>{fmtHKD(platformFee)}</span>
                </div>
                <div style={costRow}>
                  <span style={{ color: '#64748b' }}>{t('Payment Processing Fee')}</span>
                  <span style={{ fontWeight: 600 }}>{fmtHKD(paymentFee)}</span>
                </div>
                <div style={costRow}>
                  <span style={{ color: '#64748b' }}>{t('Installation Service')}</span>
                  <span style={{ fontWeight: 600 }}>{fmtHKD(installFee)}</span>
                </div>
                <div style={costRow}>
                  <span style={{ color: '#64748b' }}>{t('Shipping Fee')}</span>
                  <span style={{ fontWeight: 600 }}>{delivery === 'meetup' ? t('Free') : fmtHKD(shippingFee)}</span>
                </div>
                <div
                  style={{
                    borderTop: '2px solid #111827',
                    display: 'flex',
                    fontSize: '15px',
                    fontWeight: 700,
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    paddingTop: '10px',
                  }}
                >
                  <span>{t('Estimated Total')}</span>
                  <span>{fmtHKD(estimatedTotal)}</span>
                </div>

                {/* Submit offer button */}
                <button
                  type="button"
                  disabled={!savedOffer || submitting}
                  onClick={handleSubmitOffer}
                  style={{
                    background: !savedOffer ? '#94a3b8' : '#111827',
                    border: 0,
                    borderRadius: '12px',
                    color: '#fff',
                    cursor: !savedOffer || submitting ? 'default' : 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '15px',
                    fontWeight: 700,
                    marginTop: '16px',
                    opacity: submitting ? 0.7 : 1,
                    padding: '14px 0',
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  {submitting ? t('Submitting...') : t('Make offer to seller')}
                </button>
              </div>
            </div>

            {/* ═══ RIGHT PANEL: Chat ═══ */}
            <div style={{ ...card, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 120px)', overflow: 'hidden' }}>
              {/* Chat header */}
              <div style={{ borderBottom: '1px solid #eef2f7', padding: '16px 20px' }}>
                <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>
                    {t('Shop Admin')}
                  </div>
                  <span
                    style={{
                      background: '#ede9fe',
                      borderRadius: '999px',
                      color: '#7c3aed',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                    }}
                  >
                    {t('Support')}
                  </span>
                </div>
              </div>

              {chatLoading && (
                <div style={{ color: '#94a3b8', fontSize: '14px', padding: '40px', textAlign: 'center' }}>
                  {t('Loading messages...')}
                </div>
              )}

              {!chatLoading && conversation && (
                <MessageThread
                  messages={messages}
                  currentUserId={user.id}
                  onSend={handleSend}
                  height="calc(100vh - 290px)"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NegotiatePage;
