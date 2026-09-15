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

const ListingPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    getListing(id)
      .then((row) => { setListing(row); setError(''); })
      .catch((err) => setError(err.message || 'Failed to load listing'))
      .finally(() => setLoading(false));
  }, [id]);

  const images = (listing && listing.images) || [];
  const status = listing && STATUS_STYLE[listing.status];

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
      </div>
    </div>
  );
};

export default ListingPage;
