import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { shell, card } from '../styles/globals';
import SiteHeader from '../components/SiteHeader';

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

export default UserPage;
