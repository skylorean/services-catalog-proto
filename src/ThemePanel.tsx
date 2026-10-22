import { useEffect, useState } from 'react';
import { IMG_BASE } from './data.ts';

/** hero: a hex color, 'accent' (derived from the accent) or an image path starting with '/'. */
type Theme = { accent: string; radius: number; hero: string };

const DEFAULT_THEME: Theme = { accent: '#9A6B1C', radius: 1, hero: '#2F2A25' };

const ACCENT_PRESETS = [
  { name: 'Золото', accent: '#9A6B1C' },
  { name: 'Лес', accent: '#2F7D5B' },
  { name: 'Море', accent: '#2E5BBA' },
  { name: 'Терракота', accent: '#B5452B' },
  { name: 'Графит', accent: '#3A3836' },
];

const HERO_BY_ACCENT = 'color-mix(in srgb, var(--accent) 60%, #1c1b19)';

const HERO_PRESETS = [
  { name: 'Тёмный', hero: '#2F2A25', swatch: '#2F2A25' },
  { name: 'По акценту', hero: 'accent', swatch: HERO_BY_ACCENT },
  { name: 'Фото: бассейн', hero: `${IMG_BASE}hero-pool.webp`, swatch: `url(${IMG_BASE}hero-pool.webp) center / cover` },
  { name: 'Фото: отель', hero: `${IMG_BASE}hero.jpg`, swatch: `url(${IMG_BASE}hero.jpg) center / cover` },
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

/** Floating switcher that drives --accent, --rs (radius scale) and the hero background on :root; see styles.css. */
export function ThemePanel() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(loadTheme);

  useEffect(() => {
    const root = document.documentElement;
    const heroIsImage = theme.hero.startsWith('/');
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--rs', String(theme.radius));
    root.style.setProperty('--hero', theme.hero === 'accent' ? HERO_BY_ACCENT : heroIsImage ? DEFAULT_THEME.hero : theme.hero);
    root.style.setProperty('--hero-image', heroIsImage ? `url(${theme.hero})` : 'none');
    root.toggleAttribute('data-hero-image', heroIsImage);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {
      /* private mode: theme just does not persist */
    }
  }, [theme]);

  const heroIsHex = theme.hero.startsWith('#');

  return (
    <div className="theme">
      {open && (
        <div className="theme__panel" role="group" aria-label="Тема">
          <div className="theme__row">
            <span className="theme__label">Акцент</span>
            <div className="theme__swatches">
              {ACCENT_PRESETS.map((p) => (
                <button
                  key={p.accent}
                  type="button"
                  className="theme__swatch"
                  style={{ background: p.accent }}
                  aria-label={p.name}
                  title={p.name}
                  aria-pressed={p.accent.toLowerCase() === theme.accent.toLowerCase()}
                  onClick={() => setTheme({ ...theme, accent: p.accent })}
                />
              ))}
              <label className="theme__picker" title="Свой цвет">
                <span className="visually-hidden">Свой цвет акцента</span>
                <input type="color" value={theme.accent} onChange={(e) => setTheme({ ...theme, accent: e.target.value })} />
              </label>
            </div>
          </div>
          <div className="theme__row">
            <span className="theme__label">Шапка</span>
            <div className="theme__swatches">
              {HERO_PRESETS.map((p) => (
                <button
                  key={p.hero}
                  type="button"
                  className="theme__swatch"
                  style={{ background: p.swatch }}
                  aria-label={p.name}
                  title={p.name}
                  aria-pressed={p.hero.toLowerCase() === theme.hero.toLowerCase()}
                  onClick={() => setTheme({ ...theme, hero: p.hero })}
                />
              ))}
              <label className="theme__picker" title="Свой цвет шапки">
                <span className="visually-hidden">Свой цвет шапки</span>
                <input
                  type="color"
                  value={heroIsHex ? theme.hero : DEFAULT_THEME.hero}
                  onChange={(e) => setTheme({ ...theme, hero: e.target.value })}
                />
              </label>
            </div>
          </div>
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
