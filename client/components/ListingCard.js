import React from 'react';
import { Link } from 'react-router-dom';

export function formatPrice(price) {
  const n = Number(price);
  if (isNaN(n)) return price;
  if (n === 0) return 'Free';
  return `HK$${n.toLocaleString('en-HK', { maximumFractionDigits: 0 })}`;
}

const thumbStyle = {
  background: '#f1f5f9',
  borderRadius: '10px',
  flexShrink: 0,
  height: '52px',
  objectFit: 'cover',
  width: '52px',
};

// Compact clickable listing card. Used as the pinned header of a chat thread
// and inside conversation lists, so the product is always one tap away.
const ListingCard = ({ listing, subtitle, onDark = false, to }) => {
  const body = (
    <>
      {listing.cover ? (
        <img src={listing.cover} alt="" style={thumbStyle} />
      ) : (
        <div style={thumbStyle} />
      )}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: onDark ? '#fff' : '#111827',
            fontSize: '15px',
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {listing.title}
        </div>
        <div style={{ color: onDark ? '#94a3b8' : '#64748b', fontSize: '13px', marginTop: '4px' }}>
          {subtitle || formatPrice(listing.price)}
        </div>
      </div>
    </>
  );

  const style = {
    alignItems: 'center',
    background: onDark ? 'rgba(255, 255, 255, 0.06)' : '#f8fafc',
    border: `1px solid ${onDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`,
    borderRadius: '14px',
    display: 'flex',
    gap: '12px',
    padding: '12px 14px',
    textDecoration: 'none',
  };

  if (!to) return <div style={style}>{body}</div>;

  return <Link to={to} style={style}>{body}</Link>;
};

export default ListingCard;
