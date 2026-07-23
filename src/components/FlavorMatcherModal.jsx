import React, { useState } from 'react';
import { Sparkles, X, Sliders, ChevronRight, Check } from 'lucide-react';
import './FlavorMatcherModal.css';

export default function FlavorMatcherModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [cocoaPct, setCocoaPct] = useState(70);
  const [selectedNuts, setSelectedNuts] = useState(['Hazelnut', 'Almond']);
  const [texture, setTexture] = useState('Crunchy');
  const [ordered, setOrdered] = useState(false);

  const nutOptions = ['Hazelnut', 'Pistachio', 'Almond', 'Walnut', 'Pecan', 'Cashew'];
  const textureOptions = ['Smooth & Creamy', 'Crunchy', 'Extra Nutty Burst'];

  const toggleNut = (nut) => {
    if (selectedNuts.includes(nut)) {
      if (selectedNuts.length > 1) {
        setSelectedNuts(selectedNuts.filter((n) => n !== nut));
      }
    } else {
      setSelectedNuts([...selectedNuts, nut]);
    }
  };

  const getBlendName = () => {
    const nutPrefix = selectedNuts.join(' & ');
    if (cocoaPct < 60) return `Velvet ${nutPrefix} Milk Delight`;
    if (cocoaPct < 80) return `Artisanal ${nutPrefix} Dark Reserve`;
    return `Intense ${nutPrefix} Midnight 90%`;
  };

  const handleOrder = () => {
    setOrdered(true);
    setTimeout(() => {
      setOrdered(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        className="flavor-matcher-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Open Custom Chocolate Matcher"
      >
        <span className="flavor-matcher-badge">
          <Sparkles size={16} />
        </span>
        <span>Custom Blend Matcher</span>
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="flavor-matcher-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="flavor-matcher-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="flavor-matcher-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flavor-matcher-header">
              <h3 className="flavor-matcher-title">Craft Your Signature Chocolate</h3>
              <p className="flavor-matcher-subtitle">
                Select your preferred cocoa intensity, nut infusion, and texture finish.
              </p>
            </div>

            {/* Slider 1: Cocoa Percentage */}
            <div className="flavor-group">
              <div className="flavor-label">
                <span>Cocoa Intensity</span>
                <span className="flavor-val-badge">{cocoaPct}% Cocoa</span>
              </div>
              <input
                type="range"
                min="45"
                max="95"
                step="5"
                value={cocoaPct}
                onChange={(e) => setCocoaPct(Number(e.target.value))}
                className="cocoa-slider"
              />
            </div>

            {/* Select 2: Nut Combination */}
            <div className="flavor-group">
              <div className="flavor-label">
                <span>Roasted Nut Infusion</span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(250, 237, 205, 0.5)' }}>
                  (Pick multiple)
                </span>
              </div>
              <div className="nuts-grid">
                {nutOptions.map((nut) => {
                  const isSelected = selectedNuts.includes(nut);
                  return (
                    <button
                      key={nut}
                      type="button"
                      className={`nut-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleNut(nut)}
                    >
                      {nut} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select 3: Texture */}
            <div className="flavor-group">
              <div className="flavor-label">
                <span>Finish Texture</span>
              </div>
              <div className="texture-selector">
                {textureOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`texture-btn ${texture === opt ? 'active' : ''}`}
                    onClick={() => setTexture(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Result Box */}
            <div className="blend-result-box">
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d4a373', marginBottom: '0.2rem' }}>
                Your Recommended Blend
              </div>
              <div className="blend-name">{getBlendName()}</div>
              <div className="blend-desc">
                {cocoaPct}% single-origin cocoa layered with roasted {selectedNuts.join(', ')} in a {texture.toLowerCase()} finish.
              </div>

              <button className="action-btn" onClick={handleOrder}>
                {ordered ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={18} /> Recipe Saved to Cart!
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    Order This Blend <ChevronRight size={18} />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
