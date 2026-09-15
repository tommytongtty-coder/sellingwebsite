import React from 'react';
import { Link } from 'react-router-dom';

import { shell, card } from '../styles/globals';
import { useCategories, useListings } from '../services/api';
import SiteHeader from '../components/SiteHeader';
import GpuThumb from '../components/GpuThumb';
import { useLanguage } from '../i18n';

// ── Static data (not stored in DB) ───────────────────────────
const filterGroups = [
  {
    title: 'Condition',
    items: ['New', 'Used', 'Open Box'],
  },
  {
    title: 'Deal Type',
    items: ['Meet-up', 'Delivery', 'Buyer Protection'],
  },
  {
    title: 'Area',
    items: ['Mong Kok', 'Kwun Tong', 'Tsuen Wan', 'Central'],
  },
];

const trustFeatures = [
  {
    title: 'Chat instantly',
    text: 'Keep the conversation on-platform so buyers and sellers can ask questions quickly.',
  },
  {
    title: 'Make an offer',
    text: 'Let buyers negotiate the price before confirming the deal.',
  },
  {
    title: 'Meet in person',
    text: 'Support local Hong Kong meet-ups for quick handoff around MTR areas.',
  },
  {
    title: 'Buyer Protection',
    text: 'Show protected listings with payment support and a refund path when eligible.',
  },
];

// Helper: derive a UI accent color from listing id
const accentColors = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];
function getAccent(item) {
  return accentColors[(item.id || 0) % accentColors.length];
}

// Helper: format price number as "HK$X,XXX"
function formatPrice(price) {
  const n = Number(price);
  if (isNaN(n)) return price;
  return 'HK$' + n.toLocaleString('en-HK', { maximumFractionDigits: 0 });
}

// Helper: derive deal type label from booleans
function getDealType(item) {
  if (item.allow_meetup && item.allow_delivery) return 'Meet-up / Delivery';
  if (item.allow_meetup) return 'Meet-up';
  if (item.allow_delivery) return 'Delivery';
  return 'Meet-up';
}

// Helper: map condition enum to display label
function formatCondition(c) {
  const map = { new: 'New', like_new: 'Like New', used: 'Used', open_box: 'Open Box' };
  return map[c] || c;
}

const HomePage = () => {
  const categories = useCategories();
  const { listings: featuredItems, loading: listingsLoading } = useListings();
  const { t } = useLanguage();

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

    <div style={{ ...shell, paddingTop: '28px', paddingBottom: '34px' }}>
      <div style={{ color: '#7c3aed', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
        {t('Listings')} / {t('PC Parts')} / {t('Graphics Cards')}
      </div>

      <section
        style={{
          ...card,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(245,243,255,0.98))',
          marginBottom: '22px',
          padding: '28px',
        }}
      >
        <div
          className="hero-row"
          style={{
            alignItems: 'end',
            display: 'grid',
            gap: '24px',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
          }}
        >
          <div>
            <h1 style={{ fontSize: '42px', lineHeight: 1.05, margin: '0 0 10px' }}>
              {t('Hong Kong Graphics Cards')}
            </h1>
            <p
              style={{
                color: '#64748b',
                fontSize: '16px',
                lineHeight: 1.7,
                margin: 0,
                maxWidth: '720px',
              }}
            >
              {t('Buy and sell second-hand graphics cards in Hong Kong. Every listing includes fair market pricing so you always know the deal is worth it.')}
            </p>
          </div>

          <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
            <div
              style={{
                ...card,
                padding: '16px 18px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '28px', fontWeight: 700 }}>1.2k+</div>
              <div style={{ color: '#64748b', fontSize: '12px', marginTop: '3px' }}>
                {t('Active listings')}
              </div>
            </div>
            <div
              style={{
                ...card,
                padding: '16px 18px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '28px', fontWeight: 700 }}>4.8★</div>
              <div style={{ color: '#64748b', fontSize: '12px', marginTop: '3px' }}>
                {t('Avg seller rating')}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '20px',
          }}
        >
          {categories.map((item, index) => (
            <span
              key={item.id}
              style={{
                background: index === 0 ? '#111827' : '#fff',
                border: `1px solid ${index === 0 ? '#111827' : '#e5e7eb'}`,
                borderRadius: '999px',
                color: index === 0 ? '#fff' : '#475569',
                fontSize: '13px',
                fontWeight: 700,
                padding: '9px 14px',
              }}
            >
              {t(item.name)}
            </span>
          ))}
        </div>
      </section>

      <section
        className="feature-grid"
        style={{
          display: 'grid',
          gap: '14px',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          marginBottom: '22px',
        }}
      >
        {trustFeatures.map((feature, index) => (
          <div
            key={feature.title}
            style={{
              ...card,
              padding: '18px 18px 20px',
            }}
          >
            <div
              style={{
                alignItems: 'center',
                background: index === 3 ? '#f3e8ff' : '#f8fafc',
                borderRadius: '12px',
                color: index === 3 ? '#7c3aed' : '#334155',
                display: 'inline-flex',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '12px',
                padding: '7px 10px',
                textTransform: 'uppercase',
              }}
            >
              {t(feature.title)}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>
              {t(feature.text)}
            </div>
          </div>
        ))}
      </section>

      <div
        className="content-layout"
        style={{
          alignItems: 'start',
          display: 'grid',
          gap: '22px',
          gridTemplateColumns: '280px minmax(0, 1fr)',
        }}
      >
        <aside style={{ display: 'grid', gap: '16px' }}>
          <div style={{ ...card, padding: '22px' }}>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '18px',
              }}
            >
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{t('Filters')}</div>
              <span style={{ color: '#8b5cf6', fontSize: '13px', fontWeight: 700 }}>
                {t('Reset')}
              </span>
            </div>

            {filterGroups.map((group) => (
              <div key={group.title} style={{ marginBottom: '18px' }}>
                <div
                  style={{
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 700,
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                  }}
                >
                  {t(group.title)}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {group.items.map((item, index) => (
                    <span
                      key={item}
                      style={{
                        background: index === 0 && group.title === 'Condition' ? '#f3e8ff' : '#f8fafc',
                        border: `1px solid ${
                          index === 0 && group.title === 'Condition' ? '#d8b4fe' : '#e2e8f0'
                        }`,
                        borderRadius: '999px',
                        color: index === 0 && group.title === 'Condition' ? '#7c3aed' : '#475569',
                        fontSize: '13px',
                        fontWeight: 500,
                        padding: '9px 12px',
                      }}
                    >
                      {t(item)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...card, padding: '22px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>
              {t('Filter + Sort')}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>
              {t('Keep the listing flow local: chat first, negotiate if needed, then choose meet-up or protected payment.')}
            </div>
          </div>
        </aside>

        <main>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'space-between',
              marginBottom: '18px',
            }}
          >
            <button
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '999px',
                color: '#111827',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                padding: '12px 16px',
              }}
            >
              {t('Filter + Sort')}
            </button>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '999px',
                color: '#475569',
                fontSize: '14px',
                padding: '12px 16px',
              }}
            >
              {t('Sort by')} <strong style={{ color: '#111827' }}>{t('Most Recent')}</strong>
            </div>
          </div>

          <div
            className="listing-grid"
            style={{
              display: 'grid',
              gap: '18px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {listingsLoading && (
              <p style={{ color: '#64748b', gridColumn: '1/-1' }}>{t('Loading listings...')}</p>
            )}
            {featuredItems.map((item) => (
              <Link
                key={item.id || item.title}
                to={`/listing/${item.id}`}
                style={{
                  ...card,
                  color: 'inherit',
                  cursor: 'pointer',
                  display: 'block',
                  overflow: 'hidden',
                  padding: '16px',
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      background: `${getAccent(item)}14`,
                      borderRadius: '999px',
                      color: getAccent(item),
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '7px 10px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t(formatCondition(item.condition))}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 700 }}>
                    {t('Save')}
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <GpuThumb
                    src={item.cover_image}
                    alt={item.title}
                    accent={getAccent(item)}
                  />
                </div>

                <div style={{ color: '#111827', fontSize: '17px', fontWeight: 700, lineHeight: 1.4 }}>
                  {item.title}
                </div>

                <div style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
                  {item.seller_name}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginTop: '12px',
                  }}
                >
                  <span
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '999px',
                      color: '#475569',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '7px 10px',
                    }}
                  >
                    {t(formatCondition(item.condition))}
                  </span>
                  <span
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '999px',
                      color: '#475569',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '7px 10px',
                    }}
                  >
                    {item.location}
                  </span>
                </div>

                <div
                  style={{
                    alignItems: 'end',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                  }}
                >
                  <div style={{ color: '#111827', fontSize: '28px', fontWeight: 700 }}>
                    {formatPrice(item.price)}
                  </div>
                  <div
                    style={{
                      color: item.allow_delivery ? '#7c3aed' : '#0f766e',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {t(getDealType(item))}
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gap: '10px',
                    gridTemplateColumns: '1fr 1fr',
                    marginTop: '16px',
                  }}
                >
                  {/* Placeholders: buttons rather than links so they do not
                      nest an anchor inside the card's own link */}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #dbe1ea',
                      borderRadius: '999px',
                      color: '#111827',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '11px 0',
                      textAlign: 'center',
                    }}
                  >
                    {t('Chat')}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    style={{
                      background: '#111827',
                      border: 0,
                      borderRadius: '999px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '11px 0',
                      textAlign: 'center',
                    }}
                  >
                    {t('Make Offer')}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
    </div>
  );
};

export default HomePage;
