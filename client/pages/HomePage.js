import React, { useState } from 'react';

import { shell, card } from '../styles/globals';
import { useCategories, useListings } from '../services/api';
import SiteHeader from '../components/SiteHeader';

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

const HomePage = () => {
  const categories = useCategories();
  const { listings: featuredItems, loading: listingsLoading } = useListings();
  const [selectedProduct, setSelectedProduct] = useState(null);

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
        Listings / PC Parts / Graphics Cards
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
              Hong Kong Graphics Cards
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
              Buy and sell second-hand graphics cards in Hong Kong. Every listing
              includes fair market pricing so you always know the deal is worth it.
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
                Active listings
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
                Avg seller rating
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
              key={item}
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
              {item}
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
              {feature.title}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>
              {feature.text}
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
              <div style={{ fontSize: '18px', fontWeight: 700 }}>Filters</div>
              <span style={{ color: '#8b5cf6', fontSize: '13px', fontWeight: 700 }}>
                Reset
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
                  {group.title}
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
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...card, padding: '22px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>
              Filter + Sort
            </div>
            <div style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>
              Keep the listing flow local: chat first, negotiate if needed, then
              choose meet-up or protected payment.
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
              Filter + Sort
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
              Sort by <strong style={{ color: '#111827' }}>Most Recent</strong>
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
              <p style={{ color: '#64748b', gridColumn: '1/-1' }}>Loading listings…</p>
            )}
            {featuredItems.map((item) => (
              <article
                key={item.id || item.title}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedProduct(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedProduct(item);
                  }
                }}
                style={{
                  ...card,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  padding: '16px',
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
                      background: `${item.accent}14`,
                      borderRadius: '999px',
                      color: item.accent,
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '7px 10px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.badge}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 700 }}>
                    Save
                  </span>
                </div>

                <div
                  style={{
                    alignItems: 'center',
                    background:
                      'radial-gradient(circle at top, rgba(139,92,246,0.12), rgba(255,255,255,0.92) 60%)',
                    border: '1px solid #eef0f6',
                    borderRadius: '18px',
                    display: 'flex',
                    height: '180px',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      background: '#111827',
                      borderRadius: '18px',
                      boxShadow: '0 18px 26px rgba(15, 23, 42, 0.18)',
                      height: '112px',
                      position: 'relative',
                      transform: 'rotate(-8deg)',
                      width: '168px',
                    }}
                  >
                    <div
                      style={{
                        background: item.accent,
                        borderRadius: '50%',
                        boxShadow: `0 0 0 6px ${item.accent}22`,
                        height: '42px',
                        left: '18px',
                        position: 'absolute',
                        top: '35px',
                        width: '42px',
                      }}
                    />
                    <div
                      style={{
                        background: item.accent,
                        borderRadius: '50%',
                        boxShadow: `0 0 0 6px ${item.accent}22`,
                        height: '42px',
                        left: '64px',
                        position: 'absolute',
                        top: '35px',
                        width: '42px',
                      }}
                    />
                    <div
                      style={{
                        background: item.accent,
                        borderRadius: '50%',
                        boxShadow: `0 0 0 6px ${item.accent}22`,
                        height: '42px',
                        left: '110px',
                        position: 'absolute',
                        top: '35px',
                        width: '42px',
                      }}
                    />
                  </div>
                </div>

                <div style={{ color: '#111827', fontSize: '17px', fontWeight: 700, lineHeight: 1.4 }}>
                  {item.title}
                </div>

                <div style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
                  {item.seller}
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
                    {item.condition}
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
                    {item.price}
                  </div>
                  <div
                    style={{
                      color: item.shipping.includes('Protection')
                        ? '#7c3aed'
                        : item.shipping.includes('Offer')
                        ? '#ea580c'
                        : '#0f766e',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {item.shipping}
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
                  <a
                    href="/"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #dbe1ea',
                      borderRadius: '999px',
                      color: '#111827',
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '11px 0',
                      textAlign: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    Chat
                  </a>
                  <a
                    href="/"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: '#111827',
                      borderRadius: '999px',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '11px 0',
                      textAlign: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    Make Offer
                  </a>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          style={{
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.52)',
            display: 'flex',
            inset: 0,
            justifyContent: 'center',
            padding: '20px',
            position: 'fixed',
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              ...card,
              maxWidth: '560px',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <div
              style={{
                alignItems: 'center',
                background:
                  'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(255,255,255,0.98))',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '22px 24px',
              }}
            >
              <div>
                <div
                  style={{
                    color: selectedProduct.accent,
                    fontSize: '12px',
                    fontWeight: 800,
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedProduct.badge}
                </div>
                <h2 style={{ fontSize: '24px', lineHeight: 1.25, margin: 0 }}>
                  {selectedProduct.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product details"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '999px',
                  color: '#111827',
                  cursor: 'pointer',
                  fontSize: '20px',
                  height: '38px',
                  lineHeight: 1,
                  width: '38px',
                }}
              >
                x
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div
                style={{
                  alignItems: 'center',
                  background:
                    'radial-gradient(circle at top, rgba(139,92,246,0.12), rgba(255,255,255,0.92) 60%)',
                  border: '1px solid #eef0f6',
                  borderRadius: '18px',
                  display: 'flex',
                  height: '180px',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    background: '#111827',
                    borderRadius: '18px',
                    boxShadow: '0 18px 26px rgba(15, 23, 42, 0.18)',
                    height: '112px',
                    position: 'relative',
                    transform: 'rotate(-8deg)',
                    width: '168px',
                  }}
                >
                  {[18, 64, 110].map((left) => (
                    <div
                      key={left}
                      style={{
                        background: selectedProduct.accent,
                        borderRadius: '50%',
                        boxShadow: `0 0 0 6px ${selectedProduct.accent}22`,
                        height: '42px',
                        left,
                        position: 'absolute',
                        top: '35px',
                        width: '42px',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gap: '14px' }}>
                {[
                  ['Price', selectedProduct.price],
                  ['Seller', selectedProduct.seller],
                  ['Condition', selectedProduct.condition],
                  ['Location', selectedProduct.location],
                  ['Deal Type', selectedProduct.shipping],
                  ['Status', 'Active'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      alignItems: 'center',
                      borderBottom: '1px solid #eef2f7',
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBottom: '12px',
                    }}
                  >
                    <span style={{ color: '#64748b', fontSize: '14px' }}>{label}</span>
                    <span
                      style={{
                        background: label === 'Status' ? '#d1fae5' : 'transparent',
                        borderRadius: label === 'Status' ? '999px' : 0,
                        color: label === 'Status' ? '#10b981' : '#111827',
                        fontSize: '15px',
                        fontWeight: 700,
                        padding: label === 'Status' ? '7px 12px' : 0,
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
