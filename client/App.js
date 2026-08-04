import React, { useState, useRef } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

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
          gridTemplateColumns: '1fr auto',
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

const HomePage = () => (
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
              A cleaner marketplace template with local Hong Kong listing ideas:
              chat before buying, make offers, arrange meet-ups, and highlight
              Buyer Protection on eligible listings.
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
                style={{
                  ...card,
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
  </div>
);

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

// ── App (routes only — router wrapper provided by caller) ────────────────────

const App = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route path="/sell" component={SellPage} />
  </Switch>
);

export default App;
