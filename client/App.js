import React from 'react';

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

const App = () => {
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
          <div style={{ alignItems: 'center', display: 'flex', gap: '10px' }}>
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
          </div>

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
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                margin: '6px',
                padding: '10px 18px',
                borderRadius: '999px',
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
            <a href="/" style={{ color: '#cbd5e1', fontSize: '14px' }}>Sell</a>
            <a href="/" style={{ color: '#cbd5e1', fontSize: '14px' }}>Log in</a>
            <a
              href="/"
              style={{
                background: '#ffffff',
                borderRadius: '999px',
                color: '#111827',
                fontSize: '14px',
                fontWeight: 700,
                padding: '10px 16px',
              }}
            >
              Sign up
            </a>
          </div>
        </div>
      </header>

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

            <div style={{ color: '#475569', fontSize: '14px', fontWeight: 700 }}>
              164 Listings
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
              {featuredItems.map((item, index) => (
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
};

export default App;
