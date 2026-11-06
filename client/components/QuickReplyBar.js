import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useLanguage } from '../i18n';
import { adminGetQuickReplies, adminSetQuickReplies } from '../services/api';

const DEFAULTS_SELLER = ['收到', '已確認', '請提供更多資料', '商品已審核', '請修改商品資訊'];
const DEFAULTS_BUYER = ['收到', '已確認', '請提供地址', '明天交收', '價格已更新'];

const QuickReplyBar = ({ tabType, onSelect }) => {
  const { t } = useLanguage();
  const [replies, setReplies] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newText, setNewText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const dragIdx = useRef(null);

  // Load from API
  useEffect(() => {
    adminGetQuickReplies(tabType)
      .then((data) => {
        const arr = Array.isArray(data) && data.length > 0
          ? data
          : (tabType === 'seller' ? DEFAULTS_SELLER : DEFAULTS_BUYER);
        setReplies(arr);
        setLoaded(true);
      })
      .catch(() => {
        setReplies(tabType === 'seller' ? DEFAULTS_SELLER : DEFAULTS_BUYER);
        setLoaded(true);
      });
  }, [tabType]);

  const persist = useCallback((next) => {
    setReplies(next);
    adminSetQuickReplies(tabType, next).catch(() => {});
  }, [tabType]);

  const handleAdd = () => {
    const trimmed = newText.trim();
    if (!trimmed || replies.includes(trimmed)) return;
    persist([...replies, trimmed]);
    setNewText('');
  };

  const handleRemove = (idx) => {
    persist(replies.filter((_, i) => i !== idx));
  };

  // Drag-and-drop
  const handleDragStart = (idx) => { dragIdx.current = idx; };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (targetIdx) => {
    const from = dragIdx.current;
    if (from === null || from === targetIdx) return;
    const next = [...replies];
    const [moved] = next.splice(from, 1);
    next.splice(targetIdx, 0, moved);
    persist(next);
    dragIdx.current = null;
  };

  if (!loaded) return null;

  const pillBase = {
    border: 0,
    borderRadius: '999px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: 600,
    padding: '6px 12px',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{ borderBottom: '1px solid #eef2f7', padding: '10px 18px' }}>
      <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {/* Edit / Done toggle */}
        <button
          type="button"
          onClick={() => setEditMode((v) => !v)}
          style={{
            ...pillBase,
            background: editMode ? '#7c3aed' : '#f1f5f9',
            color: editMode ? '#fff' : '#7c3aed',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {editMode ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              {t('Done')}
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              {t('Edit')}
            </>
          )}
        </button>

        {/* Quick reply pills */}
        {replies.map((text, idx) => (
          <button
            key={idx}
            type="button"
            draggable={editMode}
            onDragStart={() => handleDragStart(idx)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(idx)}
            onClick={() => {
              if (editMode) return;
              onSelect(text);
            }}
            style={{
              ...pillBase,
              background: editMode ? '#fef3c7' : '#ede9fe',
              color: editMode ? '#92400e' : '#6d28d9',
              cursor: editMode ? 'grab' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {text}
            {editMode && (
              <span
                onClick={(e) => { e.stopPropagation(); handleRemove(idx); }}
                style={{
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  lineHeight: 1,
                  marginLeft: '2px',
                }}
              >
                &times;
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Add input — only in edit mode */}
      {editMode && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
            placeholder={t('New keyword...')}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#111827',
              flex: 1,
              fontFamily: 'inherit',
              fontSize: '13px',
              outline: 'none',
              padding: '8px 12px',
            }}
          />
          <button
            type="button"
            disabled={!newText.trim()}
            onClick={handleAdd}
            style={{
              ...pillBase,
              background: '#7c3aed',
              color: '#fff',
              fontSize: '13px',
              opacity: newText.trim() ? 1 : 0.5,
              padding: '8px 16px',
            }}
          >
            + {t('Add')}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickReplyBar;
