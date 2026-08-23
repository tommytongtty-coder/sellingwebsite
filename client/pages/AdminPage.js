import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { shell, card } from '../styles/globals';
import { useListings } from '../services/api';
import SiteHeader from '../components/SiteHeader';

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
  const { listings: dbListings } = useListings();
  const [adminItems, setAdminItems] = useState([]);
  const [activeAdminTab, setActiveAdminTab] = useState('All Product');

  // Sync adminItems when DB listings load
  useEffect(() => {
    if (dbListings.length > 0) setAdminItems(dbListings);
  }, [dbListings]);
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

export default AdminPage;
