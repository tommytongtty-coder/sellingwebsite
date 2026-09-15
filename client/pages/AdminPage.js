import React, { useState, useEffect, useCallback } from 'react';

import { shell, card } from '../styles/globals';
import {
  adminGetListings,
  adminGetLogs,
  adminUpdateListing,
  adminApproveListing,
  adminRejectListing,
  adminGetConversations,
  adminOpenListingChat,
  adminGetMessages,
  adminSendMessage,
  adminMarkAsRead,
} from '../services/api';
import AdminHeader from '../components/AdminHeader';
import AdminLogin from '../components/AdminLogin';
import MessageThread from '../components/MessageThread';
import StatusTag from '../components/StatusTag';
import { useAdminAuth } from '../adminAuth';
import { useLanguage } from '../i18n';

const adminDetailFields = [
  { key: 'title', label: 'Product' },
  { key: 'seller_name', label: 'Seller' },
  { key: 'price', label: 'Price' },
  { key: 'condition', label: 'Condition' },
  { key: 'location', label: 'Location' },
  { key: 'gpu_model', label: 'GPU Model' },
  { key: 'status', label: 'Status' },
];

// The two states the admin moderates between. 'active' is labelled "Approve"
// in the UI because that is the action, while the DB stores the resulting state.
const MODERATION_STATUSES = ['pending', 'active'];

function formatStatusLabel(status) {
  if (!status) return '';
  return status.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}

const fieldInputStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxSizing: 'border-box',
  color: '#111827',
  fontFamily: 'inherit',
  fontSize: '15px',
  outline: 'none',
  padding: '11px 12px',
  width: '100%',
};

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

const AdminPage = () => {
  const { admin, loading: adminLoading, signIn, signOut } = useAdminAuth();
  const [adminItems, setAdminItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [openThreadId, setOpenThreadId] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeAdminTab, setActiveAdminTab] = useState('All Product');
  const [search, setSearch] = useState('');
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const { t } = useLanguage();

  const loadListings = useCallback(() => {
    adminGetListings()
      .then((rows) => { setAdminItems(rows); setLoadError(''); })
      .catch((err) => setLoadError(err.message || 'Failed to load listings'));
  }, []);

  useEffect(() => { if (admin) loadListings(); }, [admin, loadListings]);

  useEffect(() => {
    if (!admin || activeAdminTab !== 'Logs' || logs.length > 0) return;
    adminGetLogs()
      .then((rows) => setLogs(rows))
      .catch((err) => setActionError(err.message || 'Failed to load logs'));
  }, [admin, activeAdminTab, logs.length]);

  const loadConversations = useCallback(() => {
    adminGetConversations()
      .then((rows) => setConversations(rows))
      .catch((err) => setActionError(err.message || 'Failed to load conversations'));
  }, []);

  useEffect(() => {
    if (!admin || activeAdminTab !== 'Messages') return;
    loadConversations();
  }, [admin, activeAdminTab, loadConversations]);

  const loadThread = useCallback((conversationId) => (
    adminGetMessages(conversationId)
      .then((rows) => setThreadMessages(rows))
      .catch((err) => setActionError(err.message || 'Failed to load messages'))
  ), []);

  const openThreadById = useCallback((conversationId) => {
    setOpenThreadId(conversationId);
    setThreadMessages([]);
    setActionError('');
    return loadThread(conversationId).then(() => {
      adminMarkAsRead(conversationId).then(loadConversations).catch(() => {});
    });
  }, [loadThread, loadConversations]);

  // Collapse an open thread, or open it and clear its unread badge
  const openThread = (conv) => {
    if (openThreadId === conv.id) {
      setOpenThreadId(null);
      setThreadMessages([]);
      return;
    }
    openThreadById(conv.id);
  };

  // From the product detail card: open (or create) that listing's thread and
  // jump to it in the Messages tab
  const chatAboutProduct = () => {
    if (!selectedProduct) return;
    setActionError('');
    adminOpenListingChat(selectedProduct.id)
      .then((conv) => {
        setSelectedProduct(null);
        setActiveAdminTab('Messages');
        loadConversations();
        return openThreadById(conv.id);
      })
      .catch((err) => setActionError(err.message || 'Could not open chat'));
  };

  const adminTabs = ['All Product', 'Messages', 'Logs'];

  // Filter by title, seller, or listing id
  const query = search.trim().toLowerCase();
  const visibleItems = query
    ? adminItems.filter((item) =>
        String(item.id) === query ||
        (item.title || '').toLowerCase().includes(query) ||
        (item.seller_name || '').toLowerCase().includes(query)
      )
    : adminItems;

  const handlePriceChange = (id, nextPrice) => {
    setAdminItems((items) =>
      items.map((item) => (item.id === id ? { ...item, price: nextPrice } : item))
    );
  };

  // originalStatus lets save tell an intentional moderation change apart from
  // a status the admin never touched
  const openProductDetail = (item) => setSelectedProduct({ ...item, originalStatus: item.status });

  const closeProductDetail = () => setSelectedProduct(null);

  const handleProductDetailChange = (key, value) => {
    setSelectedProduct((product) => (product ? { ...product, [key]: value } : product));
  };

  // Each action persists server-side and is written to admin_logs, then we
  // refetch so the table reflects what the database actually holds
  const runAction = (action) => {
    if (!selectedProduct) return;
    setActionError('');
    action(selectedProduct)
      .then(() => { setSelectedProduct(null); setLogs([]); loadListings(); })
      .catch((err) => setActionError(err.message || 'Action failed'));
  };

  // Saves the edited fields, then applies a moderation change if the admin
  // switched the Status dropdown. Choosing "Approve" runs the real approve
  // action (sets active + certified, logs 'approve_listing') and runs last so
  // its write is not overwritten by the field update.
  const saveProductDetail = () => runAction((product) => {
    const statusChanged = product.status !== product.originalStatus;
    const approving = statusChanged && product.status === 'active';

    const fields = {
      title: product.title,
      price: product.price,
      condition: product.condition,
      location: product.location,
      gpu_model: product.gpu_model,
    };
    // Only touch status when it was deliberately changed to something other
    // than Approve; untouched statuses are left exactly as they were
    if (statusChanged && !approving) fields.status = product.status;

    return adminUpdateListing(product.id, fields)
      .then(() => (approving ? adminApproveListing(product.id) : null));
  });

  const rejectProductDetail = () => runAction((product) => adminRejectListing(product.id));

  // Wait for any stored admin token to be validated before deciding what to show
  if (adminLoading) {
    return <div style={{ background: '#0b1020', minHeight: '100vh' }} />;
  }

  if (!admin) {
    return <AdminLogin onSignIn={signIn} />;
  }

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
    <AdminHeader
      tabs={adminTabs}
      activeTab={activeAdminTab}
      onTabChange={setActiveAdminTab}
      search={search}
      onSearchChange={setSearch}
      admin={admin}
      onSignOut={signOut}
    />

    <div style={{ ...shell, paddingBottom: '60px', paddingTop: '28px' }}>
      {(loadError || actionError) && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '14px',
            color: '#b91c1c',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 1.6,
            marginBottom: '18px',
            padding: '16px 18px',
          }}
        >
          {loadError || actionError}
        </div>
      )}

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
            <h1 style={{ fontSize: '30px', margin: '0 0 6px' }}>{t('Admin Page')}</h1>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              {t('All listed products in the marketplace.')}
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
            {visibleItems.length} {t('products')}
          </div>
        </div>

        {activeAdminTab === 'All Product' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', minWidth: '960px', width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '12px', textAlign: 'left' }}>
                {['Product', 'Seller', 'Price', 'Condition', 'Location', 'Deal Type', 'Certified?', 'Status'].map((heading) => (
                  <th key={heading} style={{ padding: '14px 18px', textTransform: 'uppercase' }}>
                    {t(heading)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item) => (
                <tr key={item.id} style={{ borderTop: '1px solid #eef2f7' }}>
                  <td style={{ padding: '18px' }}>
                    <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
                      <div
                        style={{
                          background: getAccent(item),
                          borderRadius: '12px',
                          boxShadow: `0 0 0 6px ${getAccent(item)}18`,
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
                          #{item.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: '#475569', fontSize: '14px', padding: '18px' }}>{item.seller_name}</td>
                  <td style={{ padding: '18px' }}>
                    <input
                      type="text"
                      aria-label={`Price for ${item.title}`}
                      value={item.price}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
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
                  <td style={{ color: '#475569', fontSize: '14px', padding: '18px' }}>{formatCondition(item.condition)}</td>
                  <td style={{ color: '#475569', fontSize: '14px', padding: '18px' }}>{item.location}</td>
                  <td style={{ color: '#475569', fontSize: '14px', padding: '18px' }}>{getDealType(item)}</td>
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
                    <StatusTag status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {activeAdminTab === 'Messages' && (
          <div style={{ display: 'grid', gap: '14px', padding: '24px 26px' }}>
            {conversations.length === 0 && (
              <div style={{ color: '#94a3b8', fontSize: '14px', padding: '20px', textAlign: 'center' }}>
                {t('No conversations yet')}
              </div>
            )}

            {conversations.map((conv) => (
              <div
                key={conv.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #eef2f7',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => openThread(conv)}
                  style={{
                    alignItems: 'center',
                    background: 'none',
                    border: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    fontFamily: 'inherit',
                    gap: '14px',
                    padding: '16px 18px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  {conv.listing_cover ? (
                    <img
                      src={conv.listing_cover}
                      alt=""
                      style={{ borderRadius: '12px', flexShrink: 0, height: '44px', objectFit: 'cover', width: '44px' }}
                    />
                  ) : (
                    <div style={{ background: '#f1f5f9', borderRadius: '12px', flexShrink: 0, height: '44px', width: '44px' }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
                      <span
                        style={{
                          color: '#111827',
                          fontSize: '15px',
                          fontWeight: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {conv.listing_title}
                      </span>
                      <StatusTag status={conv.listing_status} size="sm" />
                    </div>
                    <div style={{ color: '#64748b', fontSize: '13px', marginTop: '3px' }}>
                      {conv.seller_name}
                      {conv.type === 'admin_support' ? ` \u00b7 ${t('Support')}` : ''}
                    </div>
                  </div>
                  <div
                    style={{
                      color: '#475569',
                      fontSize: '13px',
                      maxWidth: '280px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {conv.last_message_body || t('No messages yet.')}
                  </div>
                  <div style={{ color: '#111827', fontSize: '15px', fontWeight: 700, minWidth: '90px', textAlign: 'right' }}>
                    {formatPrice(conv.listing_price)}
                  </div>
                  {Number(conv.unread_count) > 0 && (
                    <span
                      style={{
                        background: '#ec4899',
                        borderRadius: '999px',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                      }}
                    >
                      {conv.unread_count}
                    </span>
                  )}
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                    {openThreadId === conv.id ? '\u25b2' : '\u25bc'}
                  </span>
                </button>

                {openThreadId === conv.id && (
                  <div style={{ borderTop: '1px solid #eef2f7' }}>
                    <MessageThread
                      messages={threadMessages}
                      currentUserId={admin.id}
                      onSend={(body) => adminSendMessage(conv.id, body).then(() => loadThread(conv.id))}
                      height="320px"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeAdminTab === 'Logs' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', minWidth: '760px', width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '12px', textAlign: 'left' }}>
                  {['When', 'Admin', 'Action', 'Target'].map((heading) => (
                    <th key={heading} style={{ padding: '14px 18px', textTransform: 'uppercase' }}>
                      {t(heading)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderTop: '1px solid #eef2f7' }}>
                    <td style={{ color: '#475569', fontSize: '14px', padding: '16px 18px' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td style={{ color: '#111827', fontSize: '14px', fontWeight: 700, padding: '16px 18px' }}>
                      {log.admin_name || log.admin_id}
                    </td>
                    <td style={{ color: '#475569', fontSize: '14px', padding: '16px 18px' }}>
                      {log.action}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '14px', padding: '16px 18px' }}>
                      {log.target_table} #{log.target_id}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ color: '#94a3b8', fontSize: '14px', padding: '26px', textAlign: 'center' }}>
                      {t('No admin activity yet.')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
          aria-label={t('Product detail card')}
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
                  background: getAccent(selectedProduct),
                  borderRadius: '16px',
                  boxShadow: `0 0 0 7px ${getAccent(selectedProduct)}18`,
                  flexShrink: 0,
                  height: '48px',
                  width: '48px',
                }}
              />
              <div style={{ minWidth: 0 }}>
                <h2 style={{ color: '#111827', fontSize: '22px', margin: '0 0 6px' }}>
                  {t('Product Detail Card')}
                </h2>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  {t('View and edit this product information.')}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={closeProductDetail}
              aria-label={t('Close product detail card')}
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
                  {t(field.label)}
                </span>
                {field.key === 'status' ? (
                  <select
                    value={selectedProduct.status || 'pending'}
                    onChange={(e) => handleProductDetailChange('status', e.target.value)}
                    style={fieldInputStyle}
                  >
                    <option value="pending">{t('Pending')}</option>
                    <option value="active">{t('Approve')}</option>
                    {/* Shown only so the card never misreports the stored value */}
                    {!MODERATION_STATUSES.includes(selectedProduct.status) && (
                      <option value={selectedProduct.status}>
                        {formatStatusLabel(selectedProduct.status)}
                      </option>
                    )}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedProduct[field.key] || ''}
                    onChange={(e) => handleProductDetailChange(field.key, e.target.value)}
                    style={fieldInputStyle}
                  />
                )}
              </label>
            ))}

            <button
              type="button"
              onClick={chatAboutProduct}
              style={{
                alignItems: 'center',
                background: '#ede9fe',
                border: '1px solid #ddd6fe',
                borderRadius: '12px',
                color: '#7c3aed',
                cursor: 'pointer',
                display: 'flex',
                fontFamily: 'inherit',
                fontSize: '15px',
                fontWeight: 700,
                gap: '8px',
                justifyContent: 'center',
                marginTop: '6px',
                padding: '13px',
                width: '100%',
              }}
            >
              {t('Chat')}
              <span style={{ fontSize: '13px', fontWeight: 500 }}>
                {'\u00b7'} {selectedProduct.seller_name}
              </span>
            </button>
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
              {t('Cancel')}
            </button>
            <button
              type="button"
              onClick={rejectProductDetail}
              style={{
                background: '#ffffff',
                border: '1px solid #fecaca',
                borderRadius: '999px',
                color: '#e11d48',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                padding: '11px 18px',
              }}
            >
              {t('Reject')}
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
              {t('Save Changes')}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default AdminPage;
