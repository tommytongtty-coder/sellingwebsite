import React, { useState, useEffect } from 'react';

// Decorative stand-in used when a listing has no photo, or its photo fails to
// load (several seeded rows point at files that were never uploaded).
const GpuGraphic = ({ accent }) => (
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
    {[18, 64, 110].map((left) => (
      <div
        key={left}
        style={{
          background: accent,
          borderRadius: '50%',
          boxShadow: `0 0 0 6px ${accent}22`,
          height: '42px',
          left,
          position: 'absolute',
          top: '35px',
          width: '42px',
        }}
      />
    ))}
  </div>
);

// Listing cover image with a graceful fallback to the decorative graphic.
const GpuThumb = ({ src, alt, accent = '#8b5cf6', height = '180px', radius = '18px', fit = 'cover' }) => {
  const [failed, setFailed] = useState(false);

  // A new src deserves a fresh attempt
  useEffect(() => { setFailed(false); }, [src]);

  const showImage = src && !failed;

  return (
    <div
      style={{
        alignItems: 'center',
        background: showImage
          ? '#f1f5f9'
          : 'radial-gradient(circle at top, rgba(139,92,246,0.12), rgba(255,255,255,0.92) 60%)',
        border: '1px solid #eef0f6',
        borderRadius: radius,
        display: 'flex',
        height,
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || ''}
          onError={() => setFailed(true)}
          style={{ height: '100%', objectFit: fit, width: '100%' }}
        />
      ) : (
        <GpuGraphic accent={accent} />
      )}
    </div>
  );
};

export default GpuThumb;
