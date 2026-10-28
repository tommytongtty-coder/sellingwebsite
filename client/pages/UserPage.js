import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { shell, card } from '../styles/globals';
import SiteHeader from '../components/SiteHeader';
import { useAuth } from '../auth';
import { useLanguage } from '../i18n';
import { getMyListings, getMyFavorites, getMyOffers, getConversations } from '../services/api';

const STATUS_STYLE = {
  active:   { color: '#10b981', bg: '#d1fae5', label: 'Active' },
  pending:  { color: '#d97706', bg: '#fef3c7', label: 'Pending' },
  draft:    { color: '#6b7280', bg: '#f3f4f6', label: 'Draft' },
  sold:     { color: '#6b7280', bg: '#f3f4f6', label: 'Sold' },
  rejected: { color: '#dc2626', bg: '#fef2f2', label: 'Rejected' },
};

function formatPrice(price) {
  const n = Number(price);
  if (isNaN(n) || n === 0) return 'Free';
  return `HK$${n.toLocaleString()}`;
}

function formatCondition(c) {
  if (!c) return '';
  return c.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function timeAgo(dateStr, t) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('Just now');
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return t('Yesterday');
  return `${days}d`;
}

const HeartIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const UserPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Selling');
  const tabs = ['Selling', 'Buying', 'Messages', 'Favorites'];

  const [sellingItems, setSellingItems] = useState([]);
  const [buyingItems, setBuyingItems] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loadingSelling, setLoadingSelling] = useState(true);
  const [loadingBuying, setLoadingBuying] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingFavs, setLoadingFavs] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyListings()
      .then((rows) => setSellingItems(rows))
      .catch((err) => console.error('Failed to load listings:', err))
      .finally(() => setLoadingSelling(false));

    getMyOffers()
      .then((rows) => setBuyingItems(rows))
      .catch((err) => console.error('Failed to load offers:', err))
      .finally(() => setLoadingBuying(false));

    getConversations()
      .then((rows) => setConversations(rows))
      .catch((err) => console.error('Failed to load conversations:', err))
      .finally(() => setLoadingChats(false));

    getMyFavorites()
      .then((rows) => setFavoriteItems(Array.isArray(rows) ? rows : []))
      .catch(() => setFavoriteItems([]))
      .finally(() => setLoadingFavs(false));
  }, [user]);

  if (!authLoading && !user) {
    return <Redirect to="/login" />;
  }

  const soldCount = sellingItems.filter((i) => i.status === 'sold').length;
  const userRating = user && user.rating ? Number(user.rating).toFixed(1) : '0.0';

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
              {user ? (user.display_name || user.username || '?')[0].toUpperCase() : '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: '22px', fontWeight: 700 }}>
                {user ? (user.display_name || user.username) : 'My Account'}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
                @{user ? user.username : '...'} · {t('Member since')} {user && user.created_at ? new Date(user.created_at).getFullYear() : '...'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              {[
                { label: t('Listings'), value: String(sellingItems.length) },
                { label: t('Sold'), value: String(soldCount) },
                { label: t('Rating'), value: `\u2605 ${userRating}` },
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
                alignItems: 'center',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #8b5cf6' : '3px solid transparent',
                color: activeTab === tab ? '#8b5cf6' : '#64748b',
                cursor: 'pointer',
                display: 'inline-flex',
                fontSize: '15px',
                fontWeight: activeTab === tab ? 700 : 500,
                gap: '6px',
                marginBottom: '-2px',
                padding: '12px 20px',
                transition: 'all 0.15s',
              }}
            >
              {tab === 'Favorites' ? <HeartIcon size={16} /> : t(tab)}
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
                {t('Your Listings')} ({sellingItems.length})
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
                {t('+ New Listing')}
              </Link>
            </div>

            {loadingSelling && (
              <div style={{ color: '#64748b', fontSize: '14px', padding: '20px', textAlign: 'center' }}>
                {t('Loading listings...')}
              </div>
            )}

            {!loadingSelling && sellingItems.length === 0 && (
              <div style={{ ...card, padding: '40px', textAlign: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '14px' }}>
                  {t("You don't have any listings yet")}
                </div>
                <Link
                  to="/sell"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 700,
                    padding: '12px 24px',
                    textDecoration: 'none',
                  }}
                >
                  {t('Create your first listing')}
                </Link>
              </div>
            )}

            {sellingItems.map((item) => {
              const st = STATUS_STYLE[item.status] || STATUS_STYLE.draft;
              return (
                <Link
                  key={item.id}
                  to={`/listing/${item.id}`}
                  style={{
                    ...card,
                    alignItems: 'center',
                    color: 'inherit',
                    display: 'flex',
                    gap: '18px',
                    padding: '20px 24px',
                    textDecoration: 'none',
                  }}
                >
                  {item.cover_image ? (
                    <img
                      src={item.cover_image}
                      alt=""
                      style={{
                        borderRadius: '14px',
                        flexShrink: 0,
                        height: '60px',
                        objectFit: 'cover',
                        width: '60px',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf633, #8b5cf611)',
                        border: '1.5px solid #8b5cf644',
                        borderRadius: '14px',
                        flexShrink: 0,
                        height: '60px',
                        width: '60px',
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                      {item.title}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '13px' }}>
                      {formatCondition(item.condition)} · {timeAgo(item.created_at, t)}
                    </div>
                  </div>
                  <div style={{ color: '#111827', fontSize: '16px', fontWeight: 700, minWidth: '90px', textAlign: 'right' }}>
                    {formatPrice(item.price)}
                  </div>
                  <span
                    style={{
                      background: st.bg,
                      borderRadius: '999px',
                      color: st.color,
                      fontSize: '12px',
                      fontWeight: 700,
                      minWidth: '64px',
                      padding: '6px 14px',
                      textAlign: 'center',
                    }}
                  >
                    {st.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Buying tab */}
        {activeTab === 'Buying' && (
          <div style={{ display: 'grid', gap: '14px' }}>
            {loadingBuying && (
              <div style={{ color: '#64748b', fontSize: '14px', padding: '20px', textAlign: 'center' }}>
                {t('Loading offers...')}
              </div>
            )}

            {!loadingBuying && buyingItems.length === 0 && (
              <div style={{ ...card, padding: '40px', textAlign: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '15px' }}>
                  {t("You haven't made any offers yet")}
                </div>
              </div>
            )}

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
                {item.cover_image ? (
                  <img
                    src={item.cover_image}
                    alt=""
                    style={{
                      borderRadius: '14px',
                      flexShrink: 0,
                      height: '60px',
                      objectFit: 'cover',
                      width: '60px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #10b98133, #10b98111)',
                      border: '1.5px solid #10b98144',
                      borderRadius: '14px',
                      flexShrink: 0,
                      height: '60px',
                      width: '60px',
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                    {item.title}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>
                    {t('Your offer:')} HK${Number(item.amount).toLocaleString()} · {timeAgo(item.created_at, t)}
                  </div>
                </div>
                <div style={{ color: '#111827', fontSize: '16px', fontWeight: 700, minWidth: '90px', textAlign: 'right' }}>
                  HK${Number(item.price).toLocaleString()}
                </div>
                <span
                  style={{
                    background: item.offer_status === 'accepted' ? '#d1fae5' : item.offer_status === 'rejected' ? '#fef2f2' : '#ede9fe',
                    borderRadius: '999px',
                    color: item.offer_status === 'accepted' ? '#10b981' : item.offer_status === 'rejected' ? '#dc2626' : '#8b5cf6',
                    fontSize: '12px',
                    fontWeight: 700,
                    minWidth: '64px',
                    padding: '6px 14px',
                    textAlign: 'center',
                    textTransform: 'capitalize',
                  }}
                >
                  {item.offer_status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Messages tab */}
        {activeTab === 'Messages' && (
          <div style={{ display: 'grid', gap: '14px' }}>
            {loadingChats && (
              <div style={{ color: '#64748b', fontSize: '14px', padding: '20px', textAlign: 'center' }}>
                {t('Loading messages...')}
              </div>
            )}

            {!loadingChats && conversations.length === 0 && (
              <div style={{ ...card, padding: '40px', textAlign: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '15px' }}>
                  {t('No conversations yet')}
                </div>
              </div>
            )}

            {conversations.map((conv) => (
              <Link
                key={conv.id}
                to={`/chat/${conv.id}`}
                style={{
                  ...card,
                  alignItems: 'center',
                  color: 'inherit',
                  display: 'flex',
                  gap: '18px',
                  padding: '18px 22px',
                  textDecoration: 'none',
                }}
              >
                {conv.listing_cover ? (
                  <img
                    src={conv.listing_cover}
                    alt=""
                    style={{
                      borderRadius: '14px',
                      flexShrink: 0,
                      height: '56px',
                      objectFit: 'cover',
                      width: '56px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf633, #8b5cf611)',
                      border: '1.5px solid #8b5cf644',
                      borderRadius: '14px',
                      flexShrink: 0,
                      height: '56px',
                      width: '56px',
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ alignItems: 'center', display: 'flex', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700 }}>
                      {conv.type === 'admin_support' ? t('Shop Admin') : conv.other_user_name}
                    </span>
                    {conv.type === 'admin_support' && (
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
                        Support
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#111827', fontSize: '13px', marginBottom: '3px' }}>
                    {conv.listing_title}
                  </div>
                  <div
                    style={{
                      color: '#64748b',
                      fontSize: '13px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {conv.last_message_body || t('No messages yet')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>
                    {timeAgo(conv.last_message_time || conv.updated_at, t)}
                  </div>
                  {Number(conv.unread_count) > 0 && (
                    <span
                      style={{
                        background: '#ec4899',
                        borderRadius: '999px',
                        color: '#fff',
                        display: 'inline-block',
                        fontSize: '11px',
                        fontWeight: 700,
                        marginTop: '6px',
                        padding: '3px 8px',
                      }}
                    >
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Favorites tab */}
        {activeTab === 'Favorites' && (
          <div style={{ display: 'grid', gap: '14px' }}>
            {loadingFavs && (
              <div style={{ color: '#64748b', fontSize: '14px', padding: '20px', textAlign: 'center' }}>
                {t('Loading favorites...')}
              </div>
            )}

            {!loadingFavs && favoriteItems.length === 0 && (
              <div style={{ ...card, padding: '40px', textAlign: 'center' }}>
                <div style={{ color: '#ef4444', marginBottom: '10px' }}>
                  <HeartIcon size={32} />
                </div>
                <div style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '6px' }}>
                  {t('No favorites yet')}
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  {t('Browse listings to add favorites')}
                </div>
              </div>
            )}

            {favoriteItems.map((item) => (
              <Link
                key={item.id}
                to={`/listing/${item.listing_id || item.id}`}
                style={{
                  ...card,
                  alignItems: 'center',
                  color: 'inherit',
                  display: 'flex',
                  gap: '18px',
                  padding: '20px 24px',
                  textDecoration: 'none',
                }}
              >
                {item.cover_image ? (
                  <img
                    src={item.cover_image}
                    alt=""
                    style={{
                      borderRadius: '14px',
                      flexShrink: 0,
                      height: '60px',
                      objectFit: 'cover',
                      width: '60px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #ef444433, #ef444411)',
                      border: '1.5px solid #ef444444',
                      borderRadius: '14px',
                      flexShrink: 0,
                      height: '60px',
                      width: '60px',
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                    {item.title}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>
                    {item.seller_name || ''} {item.condition ? `· ${formatCondition(item.condition)}` : ''}
                  </div>
                </div>
                <div style={{ color: '#111827', fontSize: '16px', fontWeight: 700, minWidth: '90px', textAlign: 'right' }}>
                  {formatPrice(item.price)}
                </div>
                <span style={{ color: '#ef4444', flexShrink: 0 }}>
                  <HeartIcon size={20} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
