import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { shell, card } from '../styles/globals';
import { useCategories, useListings, getMyFavorites, addFavorite, removeFavorite } from '../services/api';
import SiteHeader from '../components/SiteHeader';
import GpuThumb from '../components/GpuThumb';
import { useLanguage } from '../i18n';
import { useAuth } from '../auth';

// ── Static filter options ─────────────────────────────────────
const BRANDS = ['All', 'NVIDIA', 'AMD', 'Intel'];
const GPU_MODELS = {
  '': ['All Models'],
  NVIDIA: ['All Models', 'RTX 50 Series', 'RTX 40 Series', 'RTX 30 Series'],
  AMD: ['All Models', 'RX 9000 Series', 'RX 7000 Series'],
  Intel: ['All Models', 'Arc Series'],
};
const CONDITIONS = ['All', 'New', 'Used', 'Open Box', 'Like New'];
const DEAL_TYPES = ['All', 'Meet-up', 'Delivery', 'Buyer Protection'];
const AREAS = ['All Areas', 'Mong Kok', 'Kwun Tong', 'Tsuen Wan', 'Central', 'Sham Shui Po'];

const INITIAL_FILTERS = {
  priceMin: '',
  priceMax: '',
  brand: 'All',
  model: 'All Models',
  condition: 'All',
  dealType: 'All',
  area: 'All Areas',
};

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

// ── Reusable filter pill styles ────────────────────────────────
const sectionLabel = {
  color: '#475569',
  fontSize: '13px',
  fontWeight: 700,
  marginBottom: '10px',
  textTransform: 'uppercase',
};

const selectStyle = {
  appearance: 'none',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  color: '#111827',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '14px',
  padding: '12px 14px',
  width: '100%',
};

const inputStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  color: '#111827',
  fontFamily: 'inherit',
  fontSize: '14px',
  outline: 'none',
  padding: '12px 14px',
  width: '100%',
  boxSizing: 'border-box',
};

function pillStyle(active) {
  return {
    background: active ? '#111827' : '#f8fafc',
    border: `1px solid ${active ? '#111827' : '#e2e8f0'}`,
    borderRadius: '999px',
    color: active ? '#fff' : '#475569',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 600,
    padding: '9px 14px',
  };
}

const divider = { background: '#e2e8f0', height: '1px', margin: '6px 0 18px' };

const HomePage = () => {
  const categories = useCategories();
  const { listings: featuredItems, loading: listingsLoading } = useListings();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS });
  const [favorites, setFavorites] = useState({});      // { [id]: true }
  const [toast, setToast] = useState({ msg: '', visible: false });

  // Load existing favorites so hearts are pre-filled for logged-in users
  useEffect(() => {
    if (!user) return;
    getMyFavorites()
      .then((rows) => {
        if (!Array.isArray(rows)) return;
        const map = {};
        rows.forEach((r) => { map[r.listing_id || r.id] = true; });
        setFavorites(map);
      })
      .catch(() => {});
  }, [user]);

  const toggleFav = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    const wasFav = !!favorites[itemId];
    // Optimistic UI update
    setFavorites((prev) => {
      const next = { ...prev };
      if (wasFav) { delete next[itemId]; } else { next[itemId] = true; }
      return next;
    });
    const msg = wasFav ? t('Removed from your favorites') : t('Added to your favorites');
    setToast({ msg, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 1800);
    // Persist to API
    if (wasFav) {
      removeFavorite(itemId).catch(() => {
        setFavorites((prev) => ({ ...prev, [itemId]: true }));
      });
    } else {
      addFavorite(itemId).catch(() => {
        setFavorites((prev) => {
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
      });
    }
  };

  const set = (key, value) => setFilters((prev) => {
    const next = { ...prev, [key]: value };
    if (key === 'brand') next.model = 'All Models';
    return next;
  });
  const resetFilters = () => setFilters({ ...INITIAL_FILTERS });

  const availableModels = GPU_MODELS[filters.brand === 'All' ? '' : filters.brand] || GPU_MODELS[''];

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
          gridTemplateColumns: showFilters ? '280px minmax(0, 1fr)' : 'minmax(0, 1fr)',
        }}
      >
        {/* ── Combined filter sidebar ── */}
        {showFilters && (
        <aside>
          <div style={{ ...card, padding: '22px' }}>
            {/* Header */}
            <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{t('Filters')}</div>
              <span
                onClick={resetFilters}
                style={{ color: '#8b5cf6', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
              >
                {t('Reset')}
              </span>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: '18px' }}>
              <div style={sectionLabel}>{t('Price (HK$)')}</div>
              <div style={{ alignItems: 'center', display: 'grid', gap: '8px', gridTemplateColumns: '1fr auto 1fr' }}>
                <input
                  type="number"
                  placeholder={t('Min')}
                  value={filters.priceMin}
                  onChange={(e) => set('priceMin', e.target.value)}
                  style={inputStyle}
                />
                <span style={{ color: '#94a3b8' }}>–</span>
                <input
                  type="number"
                  placeholder={t('Max')}
                  value={filters.priceMax}
                  onChange={(e) => set('priceMax', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={divider} />

            {/* GPU Brand */}
            <div style={{ marginBottom: '18px' }}>
              <div style={sectionLabel}>{t('GPU Brand')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {BRANDS.map((b) => (
                  <button key={b} type="button" onClick={() => set('brand', b)} style={pillStyle(filters.brand === b)}>
                    {t(b)}
                  </button>
                ))}
              </div>
            </div>

            {/* GPU Model */}
            <div style={{ marginBottom: '18px' }}>
              <div style={sectionLabel}>{t('GPU Model')}</div>
              <div style={{ position: 'relative' }}>
                <select
                  value={filters.model}
                  onChange={(e) => set('model', e.target.value)}
                  style={selectStyle}
                >
                  {availableModels.map((m) => (
                    <option key={m} value={m}>{t(m)}</option>
                  ))}
                </select>
                <span style={{ color: '#94a3b8', fontSize: '12px', pointerEvents: 'none', position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>&#9660;</span>
              </div>
            </div>
            <div style={divider} />

            {/* Condition */}
            <div style={{ marginBottom: '18px' }}>
              <div style={sectionLabel}>{t('Condition')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {CONDITIONS.map((c) => (
                  <button key={c} type="button" onClick={() => set('condition', c)} style={pillStyle(filters.condition === c)}>
                    {t(c)}
                  </button>
                ))}
              </div>
            </div>
            <div style={divider} />

            {/* Deal Type */}
            <div style={{ marginBottom: '18px' }}>
              <div style={sectionLabel}>{t('Deal Type')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {DEAL_TYPES.map((d) => (
                  <button key={d} type="button" onClick={() => set('dealType', d)} style={pillStyle(filters.dealType === d)}>
                    {t(d)}
                  </button>
                ))}
              </div>
            </div>

            {/* Area */}
            <div style={{ marginBottom: '18px' }}>
              <div style={sectionLabel}>{t('Location')}</div>
              <div style={{ position: 'relative' }}>
                <select
                  value={filters.area}
                  onChange={(e) => set('area', e.target.value)}
                  style={selectStyle}
                >
                  {AREAS.map((a) => (
                    <option key={a} value={a}>{t(a)}</option>
                  ))}
                </select>
                <span style={{ color: '#94a3b8', fontSize: '12px', pointerEvents: 'none', position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>&#9660;</span>
              </div>
            </div>

            {/* Bottom actions */}
            <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr', marginTop: '8px' }}>
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  color: '#475569',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '12px 0',
                }}
              >
                {t('Reset')}
              </button>
              <button
                type="button"
                style={{
                  background: '#111827',
                  border: 0,
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '12px 0',
                }}
              >
                {t('Apply Filters')}
              </button>
            </div>
          </div>
        </aside>
        )}

        <main>
          {/* Toolbar: toggle + sort */}
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
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              style={{
                alignItems: 'center',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '999px',
                color: '#111827',
                cursor: 'pointer',
                display: 'inline-flex',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: 700,
                gap: '8px',
                padding: '12px 18px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              {showFilters ? t('Hide Filters') : t('Show Filters')}
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
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
                  <button
                    type="button"
                    onClick={(e) => toggleFav(e, item.id)}
                    style={{
                      background: 'none',
                      border: 0,
                      cursor: 'pointer',
                      lineHeight: 0,
                      padding: '4px',
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24"
                      fill={favorites[item.id] ? '#ef4444' : 'none'}
                      stroke={favorites[item.id] ? '#ef4444' : '#94a3b8'}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
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


              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>

    {/* Toast notification */}
    {toast.msg && (
      <div
        style={{
          alignItems: 'center',
          background: '#111827',
          borderRadius: '14px',
          bottom: '32px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          color: '#fff',
          display: 'flex',
          fontSize: '14px',
          fontWeight: 600,
          gap: '10px',
          left: '50%',
          opacity: toast.visible ? 1 : 0,
          padding: '14px 22px',
          pointerEvents: 'none',
          position: 'fixed',
          transform: 'translateX(-50%)',
          transition: 'opacity 0.4s ease',
          zIndex: 9999,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="none">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {toast.msg}
      </div>
    )}
    </div>
  );
};

export default HomePage;
