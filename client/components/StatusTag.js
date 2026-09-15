import React from 'react';

import { useLanguage } from '../i18n';

// One source of truth for listing status colors across the app
export const STATUS_STYLE = {
  active: { bg: '#d1fae5', color: '#059669', label: 'Active' },
  pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
  draft: { bg: '#f3f4f6', color: '#6b7280', label: 'Draft' },
  sold: { bg: '#e0e7ff', color: '#4f46e5', label: 'Sold' },
  rejected: { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' },
};

const StatusTag = ({ status, size = 'md' }) => {
  const { t } = useLanguage();
  if (!status) return null;

  const st = STATUS_STYLE[status] || { bg: '#f3f4f6', color: '#6b7280', label: status };
  const small = size === 'sm';

  return (
    <span
      style={{
        background: st.bg,
        borderRadius: '999px',
        color: st.color,
        display: 'inline-block',
        fontSize: small ? '11px' : '12px',
        fontWeight: 700,
        padding: small ? '3px 9px' : '6px 12px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {t(st.label)}
    </span>
  );
};

export default StatusTag;
