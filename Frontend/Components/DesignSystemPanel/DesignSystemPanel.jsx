import { useTheme } from '../../Context/ThemeContext';
import { X, Palette, Layout, Type, Settings2 } from 'lucide-react';
import './DesignSystemPanel.css';

export default function DesignSystemPanel({ onClose }) {
  const { theme, setTheme, density, setDensity, motion, setMotion } = useTheme();

  const colors = [
    { label: 'Primary Accent', color: 'var(--accent)', desc: 'Action highlight' },
    { label: 'Secondary base', color: 'var(--secondary-base)', desc: 'Alternative highlights' },
    { label: 'Base Background', color: 'var(--bg-base)', desc: 'App backdrop' },
    { label: 'Surface color', color: 'var(--bg-surface)', desc: 'Card layers' },
    { label: 'Elevated layer', color: 'var(--bg-elevated)', desc: 'Borders & inputs' },
    { label: 'Primary text', color: 'var(--text-primary)', desc: 'Main text headers' }
  ];

  const spaces = [
    { label: '--space-2 (8px)', size: 'var(--space-2)' },
    { label: '--space-4 (16px)', size: 'var(--space-4)' },
    { label: '--space-6 (24px)', size: 'var(--space-6)' },
    { label: '--space-8 (32px)', size: 'var(--space-8)' }
  ];

  return (
    <div className="design-system-panel surface-floating animate-slide-down">
      <header className="ds-header">
        <div className="ds-header-title">
          <Settings2 size={16} className="text-accent" />
          <h3>System Token Inspector</h3>
        </div>
        <button className="ds-close" onClick={onClose} aria-label="Close Inspector"><X size={14} /></button>
      </header>

      <div className="ds-body">
        {/* Color Palette Tokens */}
        <section className="ds-section">
          <h4><Palette size={12} /> Color Swatches</h4>
          <div className="ds-colors-grid">
            {colors.map((c, i) => (
              <div key={i} className="ds-color-card">
                <div className="ds-color-circle" style={{ backgroundColor: c.color }} />
                <div className="ds-color-info">
                  <span className="ds-color-label">{c.label}</span>
                  <span className="ds-color-desc">{c.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Layout Density & Spacing */}
        <section className="ds-section">
          <h4><Layout size={12} /> Spacing Paddings</h4>
          <div className="ds-spaces-list">
            {spaces.map((s, i) => (
              <div key={i} className="ds-space-row">
                <span className="ds-space-label">{s.label}</span>
                <div className="ds-space-visual" style={{ width: s.size, height: '12px', background: 'var(--accent-glow)' }} />
              </div>
            ))}
          </div>
        </section>

        {/* Typographic Preview */}
        <section className="ds-section">
          <h4><Type size={12} /> Typography Rules</h4>
          <div className="ds-type-preview">
            <h1 style={{ fontSize: 'var(--text-xl)', margin: '0 0 var(--space-1) 0', fontFamily: 'var(--font-display)' }}>Display Geist Header</h1>
            <p style={{ fontSize: 'var(--text-xs)', margin: 0, fontFamily: 'var(--font-body)' }}>Humanist sans-serif body copy using Inter for max readability.</p>
          </div>
        </section>

        {/* Dynamic Context Overrides */}
        <section className="ds-section">
          <h4>Visual Controls Override</h4>
          <div className="ds-controls-group">
            <div className="ds-control">
              <span>Theme Preset</span>
              <select value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
                <option value="dim">Dim Contrast</option>
                <option value="amoled">Pure AMOLED</option>
              </select>
            </div>
            <div className="ds-control">
              <span>Density Layout</span>
              <select value={density} onChange={e => setDensity(e.target.value)}>
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact Pad</option>
              </select>
            </div>
            <div className="ds-control">
              <span>Animations preference</span>
              <select value={motion} onChange={e => setMotion(e.target.value)}>
                <option value="full">Enable transitions</option>
                <option value="reduced">Reduced motion</option>
                <option value="none">Disable motion</option>
              </select>
            </div>
          </div>
        </section>
      </div>
      
      <footer className="ds-footer">
        <span>Press Shift+D+E+V to toggle panel</span>
      </footer>
    </div>
  );
}
