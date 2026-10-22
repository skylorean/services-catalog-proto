import { useEffect, useState } from 'react';
import { IMG_BASE } from './data.ts';

/**
 * hero: a hex color, 'accent' (derived from the accent) or an image path under IMG_BASE.
 * topbar: 'glass' | 'glass-dark' | 'accent' | hex color.
 */
type Theme = { accent: string; radius: number; hero: string; topbar: string };

const DEFAULT_THEME: Theme = { accent: '#9A6B1C', radius: 1, hero: '#2F2A25', topbar: 'glass' };

const ACCENT_PRESETS = [
  { name: 'Золото', value: '#9A6B1C', swatch: '#9A6B1C' },
  { name: 'Лес', value: '#2F7D5B', swatch: '#2F7D5B' },
  { name: 'Море', value: '#2E5BBA', swatch: '#2E5BBA' },
  { name: 'Терракота', value: '#B5452B', swatch: '#B5452B' },
  { name: 'Графит', value: '#3A3836', swatch: '#3A3836' },
];

const HERO_BY_ACCENT = 'color-mix(in srgb, var(--accent) 60%, #1c1b19)';

const HERO_PRESETS = [
  { name: 'Тёмный', value: '#2F2A25', swatch: '#2F2A25' },
  { name: 'По акценту', value: 'accent', swatch: HERO_BY_ACCENT },
  { name: 'Фото: бассейн', value: `${IMG_BASE}hero-pool.webp`, swatch: `url(${IMG_BASE}hero-pool.webp) center / cover` },
  { name: 'Фото: отель', value: `${IMG_BASE}hero.jpg`, swatch: `url(${IMG_BASE}hero.jpg) center / cover` },
];

const TOPBAR_PRESETS = [
  { name: 'Стекло', value: 'glass', swatch: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15)), #2F2A25' },
  { name: 'Тёмное стекло', value: 'glass-dark', swatch: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), #2F2A25' },
  { name: 'Акцент', value: 'accent', swatch: 'var(--accent)' },
  { name: 'Белая', value: '#FFFFFF', swatch: '#FFFFFF' },
];

const STORAGE_KEY = 'catalog-proto-theme';

function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

/** Relative luminance of a #rrggbb color, 0..1. */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** CSS variables for the top bar; light bars get dark text and dark pills, the accent bar a translucent cart pill. */
function topbarVars(topbar: string, accent: string) {
  const glass = topbar === 'glass' || topbar === 'glass-dark';
  const onAccent = topbar === 'accent';
  const light = !glass && luminance(onAccent ? accent : topbar) > 0.6;
  return {
    '--topbar-bg':
      topbar === 'glass' ? 'rgba(255,255,255,0.2)' : topbar === 'glass-dark' ? 'rgba(20,18,14,0.4)' : onAccent ? 'var(--accent)' : topbar,
    '--topbar-blur': glass ? '14px' : '0px',
    '--topbar-text': light ? 'var(--text)' : '#fff',
    '--topbar-pill': light ? 'rgba(28,27,25,0.07)' : 'rgba(255,255,255,0.22)',
    '--topbar-pill-hover': light ? 'rgba(28,27,25,0.12)' : 'rgba(255,255,255,0.3)',
    '--topbar-avatar-bg': light ? 'var(--chip)' : '#fff',
    '--topbar-logo-bg': light ? 'var(--bg)' : '#fff',
    '--topbar-cart-bg': onAccent ? 'rgba(255,255,255,0.22)' : 'var(--accent)',
    '--topbar-cart-hover': onAccent ? 'rgba(255,255,255,0.3)' : 'var(--accent-hover)',
  };
}

type SwatchRowProps = {
  label: string;
  presets: { name: string; value: string; swatch: string }[];
  current: string;
  pickerValue: string;
  onPick: (value: string) => void;
};

function SwatchRow({ label, presets, current, pickerValue, onPick }: SwatchRowProps) {
  return (
    <div className="theme__row">
      <span className="theme__label">{label}</span>
      <div className="theme__swatches">
        {presets.map((p) => (
          <button
            key={p.value}
            type="button"
            className="theme__swatch"
            style={{ background: p.swatch }}
            aria-label={p.name}
            title={p.name}
            aria-pressed={p.value.toLowerCase() === current.toLowerCase()}
            onClick={() => onPick(p.value)}
          />
        ))}
        <label className="theme__picker" title="Свой цвет">
          <span className="visually-hidden">Свой цвет: {label}</span>
          <input type="color" value={pickerValue} onChange={(e) => onPick(e.target.value)} />
        </label>
      </div>
    </div>
  );
}

/** Floating switcher that drives --accent, --rs (radius scale), the hero and the top bar on :root; see styles.css. */
export function ThemePanel() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(loadTheme);

  useEffect(() => {
    const root = document.documentElement;
    const heroIsImage = theme.hero.startsWith(IMG_BASE);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--rs', String(theme.radius));
    root.style.setProperty('--hero', theme.hero === 'accent' ? HERO_BY_ACCENT : heroIsImage ? DEFAULT_THEME.hero : theme.hero);
    root.style.setProperty('--hero-image', heroIsImage ? `url(${theme.hero})` : 'none');
    root.toggleAttribute('data-hero-image', heroIsImage);
    for (const [name, value] of Object.entries(topbarVars(theme.topbar, theme.accent))) root.style.setProperty(name, value);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {
      /* private mode: theme just does not persist */
    }
  }, [theme]);

  return (
    <div className="theme">
      {open && (
        <div className="theme__panel" role="group" aria-label="Тема">
          <SwatchRow
            label="Акцент"
            presets={ACCENT_PRESETS}
            current={theme.accent}
            pickerValue={theme.accent}
            onPick={(accent) => setTheme({ ...theme, accent })}
          />
          <SwatchRow
            label="Фон шапки"
            presets={HERO_PRESETS}
            current={theme.hero}
            pickerValue={theme.hero.startsWith('#') ? theme.hero : DEFAULT_THEME.hero}
            onPick={(hero) => setTheme({ ...theme, hero })}
          />
          <SwatchRow
            label="Панель шапки"
            presets={TOPBAR_PRESETS}
            current={theme.topbar}
            pickerValue={theme.topbar.startsWith('#') ? theme.topbar : '#FFFFFF'}
            onPick={(topbar) => setTheme({ ...theme, topbar })}
          />
          <label className="theme__row">
            <span className="theme__label">
              Скругления <span className="theme__value">×{theme.radius.toFixed(1)}</span>
            </span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={theme.radius}
              onChange={(e) => setTheme({ ...theme, radius: Number(e.target.value) })}
            />
          </label>
          <button type="button" className="theme__reset" onClick={() => setTheme(DEFAULT_THEME)}>
            Сбросить
          </button>
        </div>
      )}
      <button type="button" className="theme__toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="theme__dot" aria-hidden="true" />
        Тема
      </button>
    </div>
  );
}
