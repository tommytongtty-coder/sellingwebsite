import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { shell, card } from '../styles/globals';
import SiteHeader from '../components/SiteHeader';
import GpuThumb from '../components/GpuThumb';
import { formatPrice } from '../components/ListingCard';
import { getListing } from '../services/api';
import { useLanguage } from '../i18n';

const STATUS_STYLE = {
  active: { bg: '#d1fae5', color: '#10b981' },
  pending: { bg: '#fef3c7', color: '#d97706' },
  draft: { bg: '#f3f4f6', color: '#6b7280' },
  sold: { bg: '#f3f4f6', color: '#6b7280' },
  rejected: { bg: '#fef2f2', color: '#dc2626' },
};

function formatCondition(c) {
  if (!c) return '';
  return c.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}

// Shared styles for the transaction panel
const radioRow = {
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  fontSize: '15px',
  gap: '12px',
  padding: '6px 0',
};
const radioCircle = (selected) => ({
  alignItems: 'center',
  border: `2px solid ${selected ? '#8b5cf6' : '#cbd5e1'}`,
  borderRadius: '50%',
  display: 'flex',
  flexShrink: 0,
  height: '22px',
  justifyContent: 'center',
  width: '22px',
});
const radioInner = { background: '#8b5cf6', borderRadius: '50%', height: '12px', width: '12px' };
const sectionTitle = { fontSize: '17px', fontWeight: 700, margin: '0 0 14px' };
const dividerLine = { background: '#e2e8f0', height: '1px', margin: '20px 0' };
const costRow = { display: 'flex', fontSize: '14px', justifyContent: 'space-between', padding: '6px 0' };

function fmtHKD(n) {
  return 'HK$' + Number(n).toLocaleString('en-HK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const ListingPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Offer / transaction state
  const [offerInput, setOfferInput] = useState('');     // live input value
  const [savedOffer, setSavedOffer] = useState(null);   // validated & saved amount (number | null)
  const [offerError, setOfferError] = useState('');
  const [delivery, setDelivery] = useState('meetup');   // 'meetup' | 'shipping'
  const [payment, setPayment] = useState('payme');      // 'payme' | 'credit_card'
  const [installation, setInstallation] = useState(false);

  useEffect(() => {
    setLoading(true);
    getListing(id)
      .then((row) => { setListing(row); setError(''); })
      .catch((err) => setError(err.message || 'Failed to load listing'))
      .finally(() => setLoading(false));
  }, [id]);

  const images = (listing && listing.images) || [];
  const status = listing && STATUS_STYLE[listing.status];

  // Price bounds (±40% of listing price)
  const basePrice = listing ? Number(listing.price) || 0 : 0;
  const minOffer = Math.round(basePrice * 0.6);
  const maxOffer = Math.round(basePrice * 1.4);

  // Validate and save the offer on blur / Enter
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

  // Cost calculations — based on saved offer if available, otherwise listing price
  const calcPrice = savedOffer !== null ? savedOffer : basePrice;
  const platformFee = Math.round(calcPrice * 0.02 * 100) / 100;
  const paymentFee = payment === 'credit_card' ? Math.round(calcPrice * 0.05 * 100) / 100 : 0;
  const installFee = installation ? 200 : 0;
  const shippingFee = 0; // free for now
  const estimatedTotal = calcPrice + platformFee + paymentFee + installFee + shippingFee;

  const detailRows = listing ? [
    ['GPU Model', listing.gpu_model],
    ['Brand', listing.brand],
    ['Manufacturer', listing.manufacturer],
    ['VRAM', listing.vram_gb ? `${listing.vram_gb}GB` : null],
    ['Condition', formatCondition(listing.condition)],
    ['Location', listing.location],
    ['Category', listing.category],
    ['Quantity', listing.quantity],
  ].filter(([, value]) => value !== null && value !== undefined && value !== '') : [];

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
          <Link to="/" style={{ color: '#7c3aed', textDecoration: 'none' }}>{t('Listings')}</Link>
          {' / '}
          <span style={{ color: '#111827' }}>{listing ? listing.title : ''}</span>
        </div>

        {loading && (
          <div style={{ ...card, color: '#94a3b8', padding: '40px', textAlign: 'center' }}>
            {t('Loading listings...')}
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '14px',
              color: '#b91c1c',
              fontSize: '14px',
              fontWeight: 600,
              padding: '16px 18px',
            }}
          >
            {error}
          </div>
        )}

        {!loading && listing && (
          <div
            style={{
              alignItems: 'start',
              display: 'grid',
              gap: '22px',
              gridTemplateColumns: 'minmax(0, 1fr) 380px',
            }}
          >
            {/* Gallery */}
            <div style={{ ...card, overflow: 'hidden', padding: '22px' }}>
              <GpuThumb
                src={images[activeImage] && images[activeImage].image_url}
                alt={listing.title}
                accent="#8b5cf6"
                height="380px"
                radius="16px"
                fit="contain"
              />

              {images.length > 1 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      style={{
                        background: 'none',
                        border: i === activeImage ? '2px solid #8b5cf6' : '2px solid transparent',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        lineHeight: 0,
                        padding: '2px',
                      }}
                    >
                      <img
                        src={img.image_url}
                        alt=""
                        style={{ borderRadius: '9px', height: '64px', objectFit: 'cover', width: '64px' }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {listing.description && (
                <div style={{ marginTop: '22px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px' }}>
                    {t('Description')}
                  </h2>
                  <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {listing.description}
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ alignItems: 'center', display: 'flex', gap: '10px', marginBottom: '14px' }}>
                {status && (
                  <span
                    style={{
                      background: status.bg,
                      borderRadius: '999px',
                      color: status.color,
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '6px 12px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {listing.status}
                  </span>
                )}
                {listing.is_certified ? (
                  <span
                    style={{
                      background: '#ede9fe',
                      borderRadius: '999px',
                      color: '#7c3aed',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '6px 12px',
                    }}
                  >
                    {t('Buyer Protection')}
                  </span>
                ) : null}
              </div>

              <h1 style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1.3, margin: '0 0 10px' }}>
                {listing.title}
              </h1>
              <div style={{ color: '#111827', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>
                {formatPrice(listing.price)}
              </div>
              <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                {listing.is_fixed_price ? t('Fixed price') : t('Open to offers')}
                {' · '}
                {listing.views || 0} {t('views')}
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                {detailRows.map(([label, value]) => (
                  <div
                    key={label}
                    style={{ display: 'flex', fontSize: '14px', justifyContent: 'space-between' }}
                  >
                    <span style={{ color: '#64748b' }}>{t(label)}</span>
                    <span style={{ color: '#111827', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  borderTop: '1px solid #eef2f7',
                  display: 'flex',
                  gap: '10px',
                  marginTop: '20px',
                  paddingTop: '18px',
                }}
              >
                <div
                  style={{
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    borderRadius: '50%',
                    color: '#fff',
                    display: 'flex',
                    fontSize: '15px',
                    fontWeight: 700,
                    height: '38px',
                    justifyContent: 'center',
                    width: '38px',
                  }}
                >
                  {(listing.seller_name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{listing.seller_name}</div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>
                    {'\u2605'} {Number(listing.seller_rating || 0).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Transaction panel (always visible below main grid) ── */}
        {!loading && listing && (
          <div style={{ marginTop: '22px' }}>
              <div style={{ ...card, padding: '28px 28px 24px' }}>

                {/* Offer amount input */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={sectionTitle}>{t('Your Offer')}</h3>
                  <div
                    style={{
                      alignItems: 'center',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      display: 'flex',
                      gap: '6px',
                      padding: '4px 14px',
                    }}
                  >
                    <span style={{ color: '#64748b', fontSize: '16px', fontWeight: 700 }}>HK$</span>
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
                        fontSize: '16px',
                        fontWeight: 700,
                        outline: 'none',
                        padding: '12px 0',
                      }}
                    />
                    {savedOffer !== null && !offerError && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {offerError && (
                    <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 600, marginTop: '8px' }}>
                      {offerError}
                    </div>
                  )}
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '6px' }}>
                    {t('Acceptable range:')} {fmtHKD(minOffer)} – {fmtHKD(maxOffer)}
                  </div>
                </div>

                <div style={dividerLine} />

                {/* Transaction Info */}
                <h3 style={sectionTitle}>{t('Transaction Info')}</h3>

                {/* Delivery Method */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ color: '#111827', fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
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

                {/* Payment Method */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ color: '#111827', fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
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

                {/* Installation Service */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ color: '#111827', fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
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

                {/* Estimated Cost Breakdown */}
                <h3 style={{ ...sectionTitle, marginBottom: '16px' }}>{t('Estimated Cost')}</h3>
                <div style={costRow}>
                  <span style={{ color: '#64748b' }}>{t('Item Price')}</span>
                  <span style={{ fontWeight: 600 }}>{fmtHKD(basePrice)}</span>
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
                    fontSize: '16px',
                    fontWeight: 700,
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    paddingTop: '14px',
                  }}
                >
                  <span>{t('Estimated Total')}</span>
                  <span>{fmtHKD(estimatedTotal)}</span>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, marginTop: '18px' }}>
                  {t('Disclaimer: This is an interactive demo. Buyers pay a platform fee; platform and credit card fees are calculated based on item price. Actual pricing rules to be confirmed. Not connected to an order system.')}
                </p>

                {/* Submit button */}
                <button
                  type="button"
                  style={{
                    background: '#111827',
                    border: 0,
                    borderRadius: '12px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '16px',
                    fontWeight: 700,
                    marginTop: '18px',
                    padding: '16px 0',
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  {t('Make offer to seller')}
                </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingPage;
