import React, { useState, useRef } from 'react';
import { Switch, Route, Link, useHistory } from 'react-router-dom';

const categories = ['Graphics Cards', 'PC Builds', 'Monitors', 'Accessories'];

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

const featuredItems = [
  {
    title: 'ASUS Dual GeForce RTX 4070 Super 12GB',
    price: 'HK$4,980',
    seller: 'Northside Components',
    shipping: 'Buyer Protection',
    badge: 'Top Rated',
    accent: '#8b5cf6',
    location: 'Mong Kok',
    condition: 'Used',
  },
  {
    title: 'MSI GeForce RTX 3080 Ti Ventus 3X',
    price: 'HK$3,580',
    seller: 'Titan Forge Parts',
    shipping: 'Make Offer',
    badge: 'Sale',
    accent: '#ec4899',
    location: 'Kwun Tong',
    condition: 'Used',
  },
  {
    title: 'SAPPHIRE NITRO+ Radeon RX 7900 XT',
    price: 'HK$4,888',
    seller: 'FrameCraft PCs',
    shipping: 'Buyer Protection',
    badge: 'Verified',
    accent: '#06b6d4',
    location: 'Central',
    condition: 'Like New',
  },
  {
    title: 'EVGA GeForce GTX 1080 Ti SC Black',
    price: 'HK$1,180',
    seller: 'Official Store',
    shipping: 'Meet-up',
    badge: 'Budget Pick',
    accent: '#f59e0b',
    location: 'Tsuen Wan',
    condition: 'Used',
  },
  {
    title: 'PNY RTX 5060 Ti RGB OC 8GB',
    price: 'HK$3,280',
    seller: 'Echo Ops Gaming',
    shipping: 'Buyer Protection',
    badge: 'Fresh Drop',
    accent: '#10b981',
    location: 'Sha Tin',
    condition: 'New',
  },
  {
    title: 'Gigabyte Radeon RX 7800 XT Gaming OC',
    price: 'HK$3,950',
    seller: 'Circuit City Hub',
    shipping: 'Make Offer',
    badge: 'Hot Deal',
    accent: '#ef4444',
    location: 'Tsim Sha Tsui',
    condition: 'Used',
  },
];

const shell = {
  margin: '0 auto',
  maxWidth: '1240px',
  padding: '0 20px',
};

const card = {
  background: '#ffffff',
  border: '1px solid #ececf2',
  borderRadius: '22px',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
};

// ── Shared toggle switch ──────────────────────────────────────────────────────

const Toggle = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      background: checked
        ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
        : '#e2e8f0',
      borderRadius: '999px',
      cursor: 'pointer',
      flexShrink: 0,
      height: '26px',
      position: 'relative',
      transition: 'background 0.2s',
      width: '48px',
    }}
  >
    <div
      style={{
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        height: '22px',
        left: checked ? '24px' : '2px',
        position: 'absolute',
        top: '2px',
        transition: 'left 0.2s',
        width: '22px',
      }}
    />
  </div>
);

// ── Shared site header ────────────────────────────────────────────────────────

const SiteHeader = () => (
  <header
    style={{
      background: '#0f172a',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      color: '#fff',
    }}
  >
    <div
      className="top-nav"
      style={{
        ...shell,
        alignItems: 'center',
        display: 'grid',
        gap: '18px',
        gridTemplateColumns: '160px minmax(0, 1fr) auto',
        minHeight: '76px',
      }}
    >
      <Link
        to="/"
        style={{
          alignItems: 'center',
          color: '#fff',
          display: 'flex',
          gap: '10px',
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            borderRadius: '14px',
            display: 'flex',
            fontSize: '18px',
            fontWeight: 700,
            height: '42px',
            justifyContent: 'center',
            width: '42px',
          }}
        >
          M
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>
            Market
          </div>
          <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
            buy. sell. upgrade.
          </div>
        </div>
      </Link>

      <div
        style={{
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          overflow: 'hidden',
        }}
      >
        <input
          placeholder="Search GPUs, parts, or sellers"
          style={{
            background: 'transparent',
            border: 0,
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            padding: '14px 18px',
          }}
        />
        <button
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            border: 0,
            borderRadius: '999px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 700,
            margin: '6px',
            padding: '10px 18px',
          }}
        >
          Search
        </button>
        <Link
          to="/admin"
          style={{
            background: '#ffffff',
            borderRadius: '999px',
            color: '#111827',
            fontSize: '14px',
            fontWeight: 700,
            margin: '6px 6px 6px 0',
            padding: '10px 18px',
            textDecoration: 'none',
          }}
        >
          Admin Page
        </Link>
      </div>

      <div
        className="nav-actions"
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: '12px',
        }}
      >
        <Link
          to="/sell"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            padding: '10px 20px',
            textDecoration: 'none',
          }}
        >
          Sell
        </Link>
        <a href="/" style={{ color: '#cbd5e1', fontSize: '14px', textDecoration: 'none' }}>
          Log in
        </a>
        <a
          href="/"
          style={{
            background: '#ffffff',
            borderRadius: '999px',
            color: '#111827',
            fontSize: '14px',
            fontWeight: 700,
            padding: '10px 16px',
            textDecoration: 'none',
          }}
        >
          Sign up
        </a>
      </div>
    </div>
  </header>
);

// ── Home page ─────────────────────────────────────────────────────────────────

const HomePage = () => {
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
              Sort by <strong style={{ color: '#111827' }}>Best Match</strong>
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
            {featuredItems.map((item) => (
              <article
                key={item.title}
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

// ── Admin page ────────────────────────────────────────────────────────────────

const adminDetailFields = [
  { key: 'title', label: 'Product' },
  { key: 'seller', label: 'Seller' },
  { key: 'price', label: 'Price' },
  { key: 'condition', label: 'Condition' },
  { key: 'location', label: 'Location' },
  { key: 'shipping', label: 'Deal Type' },
  { key: 'badge', label: 'Status' },
];

const AdminPage = () => {
  const [adminItems, setAdminItems] = useState(featuredItems);
  const [activeAdminTab, setActiveAdminTab] = useState('All Product');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const adminTabs = ['All Product', 'Messages'];
  const buyerItems = adminItems.slice(0, 4).map((item) => ({
    ...item,
    status: 'Active',
  }));

  const handlePriceChange = (title, nextPrice) => {
    setAdminItems((items) =>
      items.map((item) => (item.title === title ? { ...item, price: nextPrice } : item))
    );
  };

  const openProductDetail = (item) => {
    setSelectedProduct({ ...item, originalTitle: item.title });
  };

  const closeProductDetail = () => setSelectedProduct(null);

  const handleProductDetailChange = (key, value) => {
    setSelectedProduct((product) => (product ? { ...product, [key]: value } : product));
  };

  const saveProductDetail = () => {
    if (!selectedProduct) return;
    const { originalTitle, ...updatedProduct } = selectedProduct;
    setAdminItems((items) =>
      items.map((item) => (item.title === originalTitle ? updatedProduct : item))
    );
    setSelectedProduct(null);
  };

  const approveProductDetail = () => {
    if (!selectedProduct) return;
    const { originalTitle, ...updatedProduct } = { ...selectedProduct, condition: 'approved' };
    setAdminItems((items) =>
      items.map((item) => (item.title === originalTitle ? updatedProduct : item))
    );
    setSelectedProduct(null);
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
        <Link to="/" style={{ color: '#7c3aed', textDecoration: 'none' }}>Listings</Link>
        {' / '}
        <span style={{ color: '#111827' }}>Admin Page</span>
      </div>

      <section style={{ ...card, overflow: 'hidden' }}>
        <div
          style={{
            alignItems: 'center',
            borderBottom: '1px solid #eef2f7',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '24px 26px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '30px', margin: '0 0 6px' }}>Admin Page</h1>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              All listed products in the marketplace.
            </div>
          </div>
          <div
            style={{
              background: '#f5f3ff',
              borderRadius: '999px',
              color: '#7c3aed',
              fontSize: '14px',
              fontWeight: 700,
              padding: '10px 14px',
            }}
          >
            {adminItems.length} products
          </div>
        </div>

        <div
          style={{
            borderBottom: '1px solid #eef2f7',
            display: 'flex',
            gap: '4px',
            padding: '0 26px',
          }}
        >
          {adminTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveAdminTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeAdminTab === tab ? '3px solid #8b5cf6' : '3px solid transparent',
                color: activeAdminTab === tab ? '#8b5cf6' : '#64748b',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: activeAdminTab === tab ? 700 : 500,
                marginBottom: '-2px',
                padding: '14px 20px',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeAdminTab === 'All Product' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', minWidth: '960px', width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '12px', textAlign: 'left' }}>
                {['Product', 'Seller', 'Price', 'Condition', 'Location', 'Deal Type', 'Certified?', 'Waiting List'].map((heading) => (
                  <th key={heading} style={{ padding: '14px 18px', textTransform: 'uppercase' }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adminItems.map((item) => (
                <tr key={item.title} style={{ borderTop: '1px solid #eef2f7' }}>
                  <td style={{ padding: '18px' }}>
                    <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
                      <div
                        style={{
                          background: item.accent,
                          borderRadius: '12px',
                          boxShadow: `0 0 0 6px ${item.accent}18`,
                          flexShrink: 0,
                          height: '38px',
                          width: '38px',
                        }}
                      />
                      <div>
                        <button
                          type="button"
                          onClick={() => openProductDetail(item)}
                          aria-label={`Open details for ${item.title}`}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#111827',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '15px',
                            fontWeight: 700,
                            padding: 0,
                            textAlign: 'left',
                          }}
                        >
                          {item.title}
                        </button>
                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                          {item.badge}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: '#475569', fontSize: '14px', padding: '18px' }}>{item.seller}</td>
                  <td style={{ padding: '18px' }}>
                    <input
                      type="text"
                      aria-label={`Price for ${item.title}`}
                      value={item.price}
                      onChange={(e) => handlePriceChange(item.title, e.target.value)}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        color: '#111827',
                        fontSize: '15px',
                        fontWeight: 700,
                        outline: 'none',
                        padding: '9px 11px',
                        width: '110px',
                      }}
                    />
                  </td>
                  <td style={{ color: '#475569', fontSize: '14px', padding: '18px' }}>{item.condition}</td>
                  <td style={{ color: '#475569', fontSize: '14px', padding: '18px' }}>{item.location}</td>
                  <td style={{ color: '#475569', fontSize: '14px', padding: '18px' }}>{item.shipping}</td>
                  <td style={{ padding: '18px' }}>
                    <input
                      type="checkbox"
                      aria-label={`Certified ${item.title}`}
                      style={{
                        accentColor: '#7c3aed',
                        cursor: 'pointer',
                        height: '18px',
                        width: '18px',
                      }}
                    />
                  </td>
                  <td style={{ padding: '18px' }}>
                    <button
                      type="button"
                      aria-label={`Waiting List ${item.title}`}
                      style={{
                        background: '#f4f959',
                        border: '1px solid #fecaca',
                        borderRadius: '999px',
                        color: '#000000',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 700,
                        padding: '9px 14px',
                      }}
                    >
                      Pending
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {activeAdminTab === 'Messages' && (
          <div style={{ display: 'grid', gap: '14px', padding: '24px 26px' }}>
            {buyerItems.map((item) => (
              <div
                key={item.title}
                style={{
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid #eef2f7',
                  borderRadius: '16px',
                  display: 'grid',
                  gap: '18px',
                  gridTemplateColumns: 'minmax(0, 1fr) 130px minmax(220px, 1fr) 110px 170px 140px',
                  padding: '16px 18px',
                }}
              >
                <div style={{ alignItems: 'center', display: 'flex', gap: '12px', minWidth: 0 }}>
                  <div
                    style={{
                      background: item.accent,
                      borderRadius: '12px',
                      boxShadow: `0 0 0 6px ${item.accent}18`,
                      flexShrink: 0,
                      height: '38px',
                      width: '38px',
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: '#111827', fontSize: '15px', fontWeight: 700 }}>
                      {item.title}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                      {item.seller}
                    </div>
                  </div>
                </div>
                <div style={{ color: '#111827', fontSize: '15px', fontWeight: 700 }}>
                  {item.price}
                </div>
                <div style={{ color: '#475569', fontSize: '14px', lineHeight: 1.5 }}>
                  I'm interested! I have make a appointment to the shop.
                </div>
                <div
                  style={{
                    background: '#d1fae5',
                    borderRadius: '999px',
                    color: '#10b981',
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '8px 12px',
                    textAlign: 'center',
                  }}
                >
                  {item.status}
                </div>
                <button
                  type="button"
                  aria-label={`View appointment for ${item.title}`}
                  style={{
                    background: '#ede9fe',
                    border: '1px solid #ddd6fe',
                    borderRadius: '999px',
                    color: '#7c3aed',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '9px 12px',
                  }}
                >
                  View the Appointment
                </button>
                <button
                  type="button"
                  aria-label={`Replay to buyer for ${item.title}`}
                  style={{
                    background: '#111827',
                    border: '1px solid #111827',
                    borderRadius: '999px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '9px 12px',
                  }}
                >
                  Reply to buyer
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>

    {selectedProduct && (
      <div
        role="presentation"
        onClick={closeProductDetail}
        style={{
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.55)',
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          left: 0,
          padding: '20px',
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: 99,
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Product detail card"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#ffffff',
            borderRadius: '22px',
            boxShadow: '0 30px 80px rgba(15, 23, 42, 0.28)',
            maxHeight: '88vh',
            maxWidth: '620px',
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <div
            style={{
              alignItems: 'flex-start',
              borderBottom: '1px solid #eef2f7',
              display: 'flex',
              gap: '16px',
              justifyContent: 'space-between',
              padding: '24px 26px',
            }}
          >
            <div style={{ alignItems: 'center', display: 'flex', gap: '14px', minWidth: 0 }}>
              <div
                style={{
                  background: selectedProduct.accent,
                  borderRadius: '16px',
                  boxShadow: `0 0 0 7px ${selectedProduct.accent}18`,
                  flexShrink: 0,
                  height: '48px',
                  width: '48px',
                }}
              />
              <div style={{ minWidth: 0 }}>
                <h2 style={{ color: '#111827', fontSize: '22px', margin: '0 0 6px' }}>
                  Product Detail Card
                </h2>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  View and edit this product information.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={closeProductDetail}
              aria-label="Close product detail card"
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '999px',
                color: '#475569',
                cursor: 'pointer',
                flexShrink: 0,
                fontSize: '18px',
                height: '36px',
                lineHeight: 1,
                width: '36px',
              }}
            >
              x
            </button>
          </div>

          <div style={{ display: 'grid', gap: '14px', padding: '24px 26px' }}>
            {adminDetailFields.map((field) => (
              <label key={field.key} style={{ display: 'grid', gap: '7px' }}>
                <span style={{ color: '#475569', fontSize: '13px', fontWeight: 700 }}>
                  {field.label}
                </span>
                <input
                  type="text"
                  value={selectedProduct[field.key] || ''}
                  onChange={(e) => handleProductDetailChange(field.key, e.target.value)}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#111827',
                    fontFamily: 'inherit',
                    fontSize: '15px',
                    outline: 'none',
                    padding: '11px 12px',
                    width: '100%',
                  }}
                />
              </label>
            ))}
          </div>

          <div
            style={{
              borderTop: '1px solid #eef2f7',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              padding: '18px 26px',
            }}
          >
            <button
              type="button"
              onClick={closeProductDetail}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '999px',
                color: '#475569',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                padding: '11px 18px',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={approveProductDetail}
              style={{
                background: '#10b981',
                border: '1px solid #10b981',
                borderRadius: '999px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                padding: '11px 18px',
              }}
            >
              Approve
            </button>
            <button
              type="button"
              onClick={saveProductDetail}
              style={{
                background: '#7c3aed',
                border: '1px solid #7c3aed',
                borderRadius: '999px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                padding: '11px 18px',
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

// ── Sell page ─────────────────────────────────────────────────────────────────

const gpuModels = [
  'RTX 5090', 'RTX 5080', 'RTX 5070 Ti', 'RTX 5070', 'RTX 5060 Ti', 'RTX 5060',
  'RTX 4090', 'RTX 4080 Super', 'RTX 4080', 'RTX 4070 Ti Super', 'RTX 4070 Super',
  'RTX 4070', 'RTX 4060 Ti', 'RTX 4060', 'RTX 3090 Ti', 'RTX 3090', 'RTX 3080 Ti',
  'RTX 3080', 'RTX 3070 Ti', 'RTX 3070', 'RTX 3060 Ti', 'RTX 3060',
  'RX 9070 XT', 'RX 9070', 'RX 7900 XTX', 'RX 7900 XT', 'RX 7800 XT', 'RX 7700 XT',
  'RX 7600', 'RX 6950 XT', 'RX 6900 XT', 'RX 6800 XT', 'RX 6800', 'RX 6700 XT',
  'Arc B580', 'Arc A770', 'Other',
];

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

const SellPage = () => {
  const history = useHistory();
  const [photos, setPhotos] = useState([]);
  const [condition, setCondition] = useState('');
  const [title, setTitle] = useState('');
  const [gpuModel, setGpuModel] = useState('');
  const [brand, setBrand] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [vram, setVram] = useState('');
  const [description, setDescription] = useState('');
  const [multipleQty, setMultipleQty] = useState(false);
  const [priceMode, setPriceMode] = useState('For Sale');
  const [price, setPrice] = useState('');
  const [fixedPrice, setFixedPrice] = useState(false);
  const [meetup, setMeetup] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotos(urls);
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
        {/* Breadcrumb */}
        <div style={{ color: '#7c3aed', fontSize: '13px', fontWeight: 700, marginBottom: '18px' }}>
          <Link to="/" style={{ color: '#7c3aed', textDecoration: 'none' }}>Listings</Link>
          {' / '}PC Parts{' / '}
          <span style={{ color: '#111827' }}>Sell GPU</span>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 28px' }}>
          List your GPU
        </h1>

        <div
          style={{
            alignItems: 'start',
            display: 'grid',
            gap: '22px',
            gridTemplateColumns: '400px minmax(0, 1fr)',
          }}
        >
          {/* ── LEFT: photo upload ── */}
          <div style={{ ...card, padding: '22px' }}>
            <div
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{
                alignItems: 'center',
                background:
                  'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(236,72,153,0.04))',
                border: '2px dashed #d8b4fe',
                borderRadius: '18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                justifyContent: 'center',
                minHeight: '210px',
                padding: '30px',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  borderRadius: '50%',
                  color: '#fff',
                  display: 'flex',
                  fontSize: '26px',
                  fontWeight: 300,
                  height: '54px',
                  justifyContent: 'center',
                  lineHeight: 1,
                  width: '54px',
                }}
              >
                +
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current && fileInputRef.current.click();
                }}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  border: 0,
                  borderRadius: '999px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '12px 28px',
                }}
              >
                Select photos
              </button>
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center' }}>
                or drag photos here
                <br />
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>(Up to 10 photos)</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handlePhotos}
              />
            </div>

            {photos.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                {photos.map((url, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img
                      src={url}
                      alt=""
                      style={{
                        borderRadius: '12px',
                        height: '80px',
                        objectFit: 'cover',
                        width: '80px',
                      }}
                    />
                    {i === 0 && (
                      <div
                        style={{
                          background: 'rgba(15,23,42,0.7)',
                          borderRadius: '6px',
                          bottom: '4px',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 700,
                          left: '4px',
                          padding: '2px 6px',
                          position: 'absolute',
                        }}
                      >
                        COVER
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                color: '#94a3b8',
                fontSize: '12px',
                marginTop: '14px',
                textAlign: 'center',
              }}
            >
              Tip: Re-arrange photos to change cover
            </div>
          </div>

          {/* ── RIGHT: form sections ── */}
          <div style={{ display: 'grid', gap: '18px' }}>

            {/* Category */}
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                Category
              </div>
              <div
                style={{
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  color: '#111827',
                  cursor: 'default',
                  display: 'flex',
                  fontSize: '14px',
                  fontWeight: 600,
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                }}
              >
                <div>
                  <div>Graphics Cards</div>
                  <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 400, marginTop: '3px' }}>
                    in PC Parts &gt; Graphics Cards
                  </div>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '20px' }}>›</span>
              </div>
            </div>

            {/* Condition */}
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                Condition
              </div>
              <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
                Select the condition of your GPU
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['New', 'Like New', 'Used', 'Open Box', 'Damaged'].map((c) => (
                  <span
                    key={c}
                    onClick={() => setCondition(c)}
                    style={{
                      background: condition === c ? '#111827' : '#fff',
                      border: `1px solid ${condition === c ? '#111827' : '#e5e7eb'}`,
                      borderRadius: '999px',
                      color: condition === c ? '#fff' : '#475569',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: condition === c ? 700 : 500,
                      padding: '9px 18px',
                      transition: 'all 0.15s',
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '14px' }}>
                Tip: Add close-up photos to show defects, if any
              </div>
            </div>

            {/* Item details */}
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px' }}>
                Item details
              </div>
              <div style={{ display: 'grid', gap: '14px' }}>
                <input
                  placeholder="Listing title  e.g. ASUS RTX 4070 Ti Super OC 16GB"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle}
                />

                <select
                  value={gpuModel}
                  onChange={(e) => setGpuModel(e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    color: gpuModel ? '#111827' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" disabled>GPU Model</option>
                  {gpuModels.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr' }}>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    style={{
                      ...inputStyle,
                      appearance: 'none',
                      color: brand ? '#111827' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    <option value="" disabled>Brand (GPU Chip)</option>
                    <option value="NVIDIA">NVIDIA</option>
                    <option value="AMD">AMD</option>
                    <option value="Intel">Intel</option>
                  </select>

                  <select
                    value={vram}
                    onChange={(e) => setVram(e.target.value)}
                    style={{
                      ...inputStyle,
                      appearance: 'none',
                      color: vram ? '#111827' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    <option value="" disabled>VRAM</option>
                    {['8GB', '10GB', '12GB', '16GB', '20GB', '24GB', '32GB'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <select
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    color: manufacturer ? '#111827' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" disabled>Card Manufacturer</option>
                  {['ASUS', 'MSI', 'Gigabyte', 'Sapphire', 'EVGA', 'PNY', 'Zotac', 'PowerColor', 'XFX', 'Palit', 'Other'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <textarea
                  placeholder="Description (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  style={{
                    ...inputStyle,
                    fontFamily: 'Roboto, sans-serif',
                    resize: 'vertical',
                  }}
                />

                <label
                  style={{
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '12px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={multipleQty}
                    onChange={(e) => setMultipleQty(e.target.checked)}
                    style={{
                      accentColor: '#8b5cf6',
                      flexShrink: 0,
                      height: '18px',
                      marginTop: '2px',
                      width: '18px',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>
                      I have more than one of the same item
                    </div>
                    <div style={{ color: '#64748b', fontSize: '12px', marginTop: '3px' }}>
                      Don&apos;t mark listing as reserved when I accept an offer
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Price */}
            <div style={{ ...card, padding: '24px' }}>
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 700 }}>Price</div>
                <span style={{ color: '#8b5cf6', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  How suggestions work ›
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
                {['For Sale', 'For Free'].map((mode) => (
                  <span
                    key={mode}
                    onClick={() => setPriceMode(mode)}
                    style={{
                      background:
                        priceMode === mode
                          ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                          : '#fff',
                      border: `1px solid ${priceMode === mode ? 'transparent' : '#e5e7eb'}`,
                      borderRadius: '999px',
                      color: priceMode === mode ? '#fff' : '#475569',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 700,
                      padding: '9px 22px',
                      transition: 'all 0.15s',
                    }}
                  >
                    {mode}
                  </span>
                ))}
              </div>

              {priceMode === 'For Sale' && (
                <div
                  style={{
                    alignItems: 'center',
                    borderBottom: '2px solid #e2e8f0',
                    display: 'flex',
                    marginBottom: '22px',
                    paddingBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      color: '#111827',
                      fontSize: '22px',
                      fontWeight: 700,
                      marginRight: '12px',
                    }}
                  >
                    HK$
                  </span>
                  <input
                    type="number"
                    placeholder="Price of your listing"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 0,
                      color: '#111827',
                      flex: 1,
                      fontSize: '18px',
                      outline: 'none',
                      padding: '4px 0',
                    }}
                  />
                </div>
              )}

              <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>Fixed price</div>
                  <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                    Buyers can only make an offer at your listed price
                  </div>
                </div>
                <Toggle checked={fixedPrice} onChange={setFixedPrice} />
              </div>
            </div>

            {/* Deal methods */}
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px' }}>
                Deal methods
              </div>

              <div
                style={{
                  alignItems: 'center',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  paddingBottom: '16px',
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: 600 }}>Meet-up</div>
                <Toggle checked={meetup} onChange={setMeetup} />
              </div>

              <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>Delivery</div>
                <Toggle checked={delivery} onChange={setDelivery} />
              </div>
            </div>

            {/* List now */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => history.push('/user')}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  border: 0,
                  borderRadius: '14px',
                  boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '17px',
                  fontWeight: 700,
                  padding: '16px 52px',
                }}
              >
                List now
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// ── User page ─────────────────────────────────────────────────────────────────

const sellingItems = [
  {
    id: 1,
    title: 'ASUS Dual GeForce RTX 4070 Super 12GB',
    price: 'HK$4,200',
    status: 'Active',
    statusColor: '#10b981',
    statusBg: '#d1fae5',
    date: 'Listed today',
    views: 24,
    offers: 2,
    accent: '#8b5cf6',
    condition: 'Used',
  },
  {
    id: 2,
    title: 'MSI GeForce RTX 3060 Ti Gaming X Trio',
    price: 'HK$1,850',
    status: 'Pending',
    statusColor: '#d97706',
    statusBg: '#fef3c7',
    date: 'Listed 3 days ago',
    views: 87,
    offers: 5,
    accent: '#ec4899',
    condition: 'Used',
  },
  {
    id: 3,
    title: 'Gigabyte GTX 1660 Super OC 6GB',
    price: 'HK$680',
    status: 'Sold',
    statusColor: '#6b7280',
    statusBg: '#f3f4f6',
    date: 'Sold 1 week ago',
    views: 143,
    offers: 9,
    accent: '#64748b',
    condition: 'Used',
  },
];

const buyingItems = [
  {
    id: 1,
    title: 'PNY RTX 5060 Ti RGB OC 8GB',
    price: 'HK$3,280',
    seller: 'Echo Ops Gaming',
    status: 'Offer Sent',
    statusColor: '#8b5cf6',
    statusBg: '#ede9fe',
    date: 'Offer sent today',
    accent: '#10b981',
  },
  {
    id: 2,
    title: 'SAPPHIRE NITRO+ Radeon RX 7900 XT',
    price: 'HK$4,888',
    seller: 'FrameCraft PCs',
    status: 'Watching',
    statusColor: '#0284c7',
    statusBg: '#e0f2fe',
    date: 'Added 2 days ago',
    accent: '#06b6d4',
  },
];

const messageList = [
  {
    id: 1,
    name: 'Echo Ops Gaming',
    avatar: 'E',
    avatarColor: '#10b981',
    lastMessage: 'Sure, I can do HK$3,100. Meet at Mong Kok MTR?',
    time: '2m ago',
    unread: 2,
    item: 'PNY RTX 5060 Ti RGB OC 8GB',
  },
  {
    id: 2,
    name: 'Alex Chan',
    avatar: 'A',
    avatarColor: '#8b5cf6',
    lastMessage: 'Is the RTX 4070 Super still available?',
    time: '1h ago',
    unread: 1,
    item: 'ASUS RTX 4070 Super 12GB',
  },
  {
    id: 3,
    name: 'TechParts HK',
    avatar: 'T',
    avatarColor: '#ec4899',
    lastMessage: 'Thanks for the purchase! Let me know when...',
    time: 'Yesterday',
    unread: 0,
    item: 'Gigabyte GTX 1660 Super OC',
  },
];

const UserPage = () => {
  const [activeTab, setActiveTab] = useState('Selling');
  const tabs = ['Selling', 'Buying', 'Messages'];

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
        {/* Profile banner */}
        <div
          style={{
            ...card,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            marginBottom: '24px',
            overflow: 'hidden',
            padding: '32px',
            position: 'relative',
          }}
        >
          <div
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
              borderRadius: '50%',
              height: '300px',
              pointerEvents: 'none',
              position: 'absolute',
              right: '-60px',
              top: '-80px',
              width: '300px',
            }}
          />
          <div style={{ alignItems: 'center', display: 'flex', gap: '20px', position: 'relative' }}>
            <div
              style={{
                alignItems: 'center',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                borderRadius: '50%',
                color: '#fff',
                display: 'flex',
                flexShrink: 0,
                fontSize: '28px',
                fontWeight: 700,
                height: '72px',
                justifyContent: 'center',
                width: '72px',
              }}
            >
              U
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: '22px', fontWeight: 700 }}>My Account</div>
              <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
                @username · Member since 2024
              </div>
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              {[
                { label: 'Listings', value: '3' },
                { label: 'Sold', value: '1' },
                { label: 'Rating', value: '★ 5.0' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ color: '#fff', fontSize: '22px', fontWeight: 700 }}>{s.value}</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            borderBottom: '2px solid #e2e8f0',
            display: 'flex',
            gap: '4px',
            marginBottom: '24px',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #8b5cf6' : '3px solid transparent',
                color: activeTab === tab ? '#8b5cf6' : '#64748b',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: activeTab === tab ? 700 : 500,
                marginBottom: '-2px',
                padding: '12px 20px',
                transition: 'all 0.15s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Selling tab */}
        {activeTab === 'Selling' && (
          <div style={{ display: 'grid', gap: '14px' }}>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 700 }}>
                Your Listings ({sellingItems.length})
              </div>
              <Link
                to="/sell"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '10px 20px',
                  textDecoration: 'none',
                }}
              >
                + New Listing
              </Link>
            </div>
            {sellingItems.map((item) => (
              <div
                key={item.id}
                style={{
                  ...card,
                  alignItems: 'center',
                  display: 'flex',
                  gap: '18px',
                  padding: '20px 24px',
                }}
              >
                <div
                  style={{
                    background: `linear-gradient(135deg, ${item.accent}33, ${item.accent}11)`,
                    border: `1.5px solid ${item.accent}44`,
                    borderRadius: '14px',
                    flexShrink: 0,
                    height: '60px',
                    width: '60px',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                    {item.title}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>
                    {item.condition} · {item.date}
                  </div>
                </div>
                <div
                  style={{
                    alignItems: 'flex-end',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ color: '#111827', fontSize: '18px', fontWeight: 700 }}>
                    {item.price}
                  </div>
                  <div
                    style={{
                      background: item.statusBg,
                      borderRadius: '999px',
                      color: item.statusColor,
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '3px 10px',
                    }}
                  >
                    {item.status}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '24px', marginLeft: '12px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 700 }}>{item.views}</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>Views</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 700 }}>{item.offers}</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>Offers</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Buying tab */}
        {activeTab === 'Buying' && (
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
              Watching & Offers ({buyingItems.length})
            </div>
            {buyingItems.map((item) => (
              <div
                key={item.id}
                style={{
                  ...card,
                  alignItems: 'center',
                  display: 'flex',
                  gap: '18px',
                  padding: '20px 24px',
                }}
              >
                <div
                  style={{
                    background: `linear-gradient(135deg, ${item.accent}33, ${item.accent}11)`,
                    border: `1.5px solid ${item.accent}44`,
                    borderRadius: '14px',
                    flexShrink: 0,
                    height: '60px',
                    width: '60px',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                    {item.title}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>
                    Seller: {item.seller} · {item.date}
                  </div>
                </div>
                <div
                  style={{
                    alignItems: 'flex-end',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{item.price}</div>
                  <div
                    style={{
                      background: item.statusBg,
                      borderRadius: '999px',
                      color: item.statusColor,
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '3px 10px',
                    }}
                  >
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages tab */}
        {activeTab === 'Messages' && (
          <div style={{ ...card, overflow: 'hidden' }}>
            {messageList.map((msg, i) => (
              <div
                key={msg.id}
                style={{
                  alignItems: 'center',
                  borderBottom: i < messageList.length - 1 ? '1px solid #f1f5f9' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '14px',
                  padding: '18px 24px',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  style={{
                    alignItems: 'center',
                    background: msg.avatarColor,
                    borderRadius: '50%',
                    color: '#fff',
                    display: 'flex',
                    flexShrink: 0,
                    fontSize: '16px',
                    fontWeight: 700,
                    height: '46px',
                    justifyContent: 'center',
                    width: '46px',
                  }}
                >
                  {msg.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '2px',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{msg.name}</div>
                    <div style={{ color: '#94a3b8', flexShrink: 0, fontSize: '12px' }}>{msg.time}</div>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '2px' }}>
                    re: {msg.item}
                  </div>
                  <div
                    style={{
                      color: msg.unread > 0 ? '#111827' : '#94a3b8',
                      fontSize: '13px',
                      fontWeight: msg.unread > 0 ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {msg.lastMessage}
                  </div>
                </div>
                {msg.unread > 0 && (
                  <div
                    style={{
                      alignItems: 'center',
                      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                      borderRadius: '50%',
                      color: '#fff',
                      display: 'flex',
                      flexShrink: 0,
                      fontSize: '11px',
                      fontWeight: 700,
                      height: '20px',
                      justifyContent: 'center',
                      width: '20px',
                    }}
                  >
                    {msg.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── App (routes only — router wrapper provided by caller) ────────────────────

const App = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route path="/admin" component={AdminPage} />
    <Route path="/sell" component={SellPage} />
    <Route path="/user" component={UserPage} />
  </Switch>
);

export default App;
