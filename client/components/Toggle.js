import React from 'react';

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

export default Toggle;
