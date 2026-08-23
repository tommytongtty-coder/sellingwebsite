import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { shell, card } from '../styles/globals';
import Toggle from '../components/Toggle';
import SiteHeader from '../components/SiteHeader';

const gpuModels = [
  'RTX 5090', 'RTX 5080', 'RTX 5070 Ti', 'RTX 5070', 'RTX 5060 Ti', 'RTX 5060',
  'RTX 4090', 'RTX 4080 Super', 'RTX 4080', 'RTX 4070 Ti Super', 'RTX 4070 Super',
  'RTX 4070', 'RTX 4060 Ti', 'RTX 4060', 'RTX 3090 Ti', 'RTX 3090', 'RTX 3080 Ti',
  'RTX 3080', 'RTX 3070 Ti', 'RTX 3070', 'RTX 3060 Ti', 'RTX 3060',
  'RX 9070 XT', 'RX 9070', 'RX 7900 XTX', 'RX 7900 XT', 'RX 7800 XT', 'RX 7700 XT',
  'RX 7600', 'RX 6950 XT', 'RX 6900 XT', 'RX 6800 XT', 'RX 6800', 'RX 6700 XT',
  'Arc B580', 'Arc A770', 'Other',
];

const inputStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxSizing: 'border-box',
  color: '#111827',
  fontSize: '15px',
  outline: 'none',
  padding: '14px 18px',
  width: '100%',
};

const SellPage = () => {
  const history = useHistory();
  const [photos, setPhotos] = useState([]);
  const [condition, setCondition] = useState('');
  const [title, setTitle] = useState('');
  const [gpuModel, setGpuModel] = useState('');
  const [brand, setBrand] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [vram, setVram] = useState('');
  const [description, setDescription] = useState('');
  const [multipleQty, setMultipleQty] = useState(false);
  const [priceMode, setPriceMode] = useState('For Sale');
  const [price, setPrice] = useState('');
  const [fixedPrice, setFixedPrice] = useState(false);
  const [meetup, setMeetup] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotos(urls);
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
        {/* Breadcrumb */}
        <div style={{ color: '#7c3aed', fontSize: '13px', fontWeight: 700, marginBottom: '18px' }}>
          <Link to="/" style={{ color: '#7c3aed', textDecoration: 'none' }}>Listings</Link>
          {' / '}PC Parts{' / '}
          <span style={{ color: '#111827' }}>Sell GPU</span>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 28px' }}>
          List your GPU
        </h1>

        <div
          style={{
            alignItems: 'start',
            display: 'grid',
            gap: '22px',
            gridTemplateColumns: '400px minmax(0, 1fr)',
          }}
        >
          {/* ── LEFT: photo upload ── */}
          <div style={{ ...card, padding: '22px' }}>
            <div
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{
                alignItems: 'center',
                background:
                  'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(236,72,153,0.04))',
                border: '2px dashed #d8b4fe',
                borderRadius: '18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                justifyContent: 'center',
                minHeight: '210px',
                padding: '30px',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  borderRadius: '50%',
                  color: '#fff',
                  display: 'flex',
                  fontSize: '26px',
                  fontWeight: 300,
                  height: '54px',
                  justifyContent: 'center',
                  lineHeight: 1,
                  width: '54px',
                }}
              >
                +
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current && fileInputRef.current.click();
                }}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  border: 0,
                  borderRadius: '999px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '12px 28px',
                }}
              >
                Select photos
              </button>
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center' }}>
                or drag photos here
                <br />
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>(Up to 10 photos)</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handlePhotos}
              />
            </div>

            {photos.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                {photos.map((url, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img
                      src={url}
                      alt=""
                      style={{
                        borderRadius: '12px',
                        height: '80px',
                        objectFit: 'cover',
                        width: '80px',
                      }}
                    />
                    {i === 0 && (
                      <div
                        style={{
                          background: 'rgba(15,23,42,0.7)',
                          borderRadius: '6px',
                          bottom: '4px',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 700,
                          left: '4px',
                          padding: '2px 6px',
                          position: 'absolute',
                        }}
                      >
                        COVER
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                color: '#94a3b8',
                fontSize: '12px',
                marginTop: '14px',
                textAlign: 'center',
              }}
            >
              Tip: Re-arrange photos to change cover
            </div>
          </div>

          {/* ── RIGHT: form sections ── */}
          <div style={{ display: 'grid', gap: '18px' }}>

            {/* Category */}
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                Category
              </div>
              <div
                style={{
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  color: '#111827',
                  cursor: 'default',
                  display: 'flex',
                  fontSize: '14px',
                  fontWeight: 600,
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                }}
              >
                <div>
                  <div>Graphics Cards</div>
                  <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 400, marginTop: '3px' }}>
                    in PC Parts &gt; Graphics Cards
                  </div>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '20px' }}>›</span>
              </div>
            </div>

            {/* Condition */}
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                Condition
              </div>
              <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
                Select the condition of your GPU
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['New', 'Like New', 'Used', 'Open Box', 'Damaged'].map((c) => (
                  <span
                    key={c}
                    onClick={() => setCondition(c)}
                    style={{
                      background: condition === c ? '#111827' : '#fff',
                      border: `1px solid ${condition === c ? '#111827' : '#e5e7eb'}`,
                      borderRadius: '999px',
                      color: condition === c ? '#fff' : '#475569',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: condition === c ? 700 : 500,
                      padding: '9px 18px',
                      transition: 'all 0.15s',
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '14px' }}>
                Tip: Add close-up photos to show defects, if any
              </div>
            </div>

            {/* Item details */}
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px' }}>
                Item details
              </div>
              <div style={{ display: 'grid', gap: '14px' }}>
                <input
                  placeholder="Listing title  e.g. ASUS RTX 4070 Ti Super OC 16GB"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle}
                />

                <select
                  value={gpuModel}
                  onChange={(e) => setGpuModel(e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    color: gpuModel ? '#111827' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" disabled>GPU Model</option>
                  {gpuModels.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr' }}>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    style={{
                      ...inputStyle,
                      appearance: 'none',
                      color: brand ? '#111827' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    <option value="" disabled>Brand (GPU Chip)</option>
                    <option value="NVIDIA">NVIDIA</option>
                    <option value="AMD">AMD</option>
                    <option value="Intel">Intel</option>
                  </select>

                  <select
                    value={vram}
                    onChange={(e) => setVram(e.target.value)}
                    style={{
                      ...inputStyle,
                      appearance: 'none',
                      color: vram ? '#111827' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    <option value="" disabled>VRAM</option>
                    {['8GB', '10GB', '12GB', '16GB', '20GB', '24GB', '32GB'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <select
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    color: manufacturer ? '#111827' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" disabled>Card Manufacturer</option>
                  {['ASUS', 'MSI', 'Gigabyte', 'Sapphire', 'EVGA', 'PNY', 'Zotac', 'PowerColor', 'XFX', 'Palit', 'Other'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <textarea
                  placeholder="Description (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  style={{
                    ...inputStyle,
                    fontFamily: 'Roboto, sans-serif',
                    resize: 'vertical',
                  }}
                />

                <label
                  style={{
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '12px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={multipleQty}
                    onChange={(e) => setMultipleQty(e.target.checked)}
                    style={{
                      accentColor: '#8b5cf6',
                      flexShrink: 0,
                      height: '18px',
                      marginTop: '2px',
                      width: '18px',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>
                      I have more than one of the same item
                    </div>
                    <div style={{ color: '#64748b', fontSize: '12px', marginTop: '3px' }}>
                      Don&apos;t mark listing as reserved when I accept an offer
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Price */}
            <div style={{ ...card, padding: '24px' }}>
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 700 }}>Price</div>
                <span style={{ color: '#8b5cf6', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  How suggestions work ›
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
                {['For Sale', 'For Free'].map((mode) => (
                  <span
                    key={mode}
                    onClick={() => setPriceMode(mode)}
                    style={{
                      background:
                        priceMode === mode
                          ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                          : '#fff',
                      border: `1px solid ${priceMode === mode ? 'transparent' : '#e5e7eb'}`,
                      borderRadius: '999px',
                      color: priceMode === mode ? '#fff' : '#475569',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 700,
                      padding: '9px 22px',
                      transition: 'all 0.15s',
                    }}
                  >
                    {mode}
                  </span>
                ))}
              </div>

              {priceMode === 'For Sale' && (
                <div
                  style={{
                    alignItems: 'center',
                    borderBottom: '2px solid #e2e8f0',
                    display: 'flex',
                    marginBottom: '22px',
                    paddingBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      color: '#111827',
                      fontSize: '22px',
                      fontWeight: 700,
                      marginRight: '12px',
                    }}
                  >
                    HK$
                  </span>
                  <input
                    type="number"
                    placeholder="Price of your listing"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 0,
                      color: '#111827',
                      flex: 1,
                      fontSize: '18px',
                      outline: 'none',
                      padding: '4px 0',
                    }}
                  />
                </div>
              )}

              <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>Fixed price</div>
                  <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                    Buyers can only make an offer at your listed price
                  </div>
                </div>
                <Toggle checked={fixedPrice} onChange={setFixedPrice} />
              </div>
            </div>

            {/* Deal methods */}
            <div style={{ ...card, padding: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px' }}>
                Deal methods
              </div>

              <div
                style={{
                  alignItems: 'center',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  paddingBottom: '16px',
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: 600 }}>Meet-up</div>
                <Toggle checked={meetup} onChange={setMeetup} />
              </div>

              <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>Delivery</div>
                <Toggle checked={delivery} onChange={setDelivery} />
              </div>
            </div>

            {/* List now */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => history.push('/user')}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  border: 0,
                  borderRadius: '14px',
                  boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '17px',
                  fontWeight: 700,
                  padding: '16px 52px',
                }}
              >
                List now
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
