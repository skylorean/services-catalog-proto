import { useState } from 'react';
import { HOTEL } from './data.ts';
import { formatPrice, plural, SERVICES_WORD } from './format.ts';
import { Icon } from './icons.tsx';

export type CartSummary = { count: number; total: number; onOpen: () => void };

type HeaderProps = { cart?: CartSummary | null; currencyDisabled?: boolean };

export function Header({ cart, currencyDisabled }: HeaderProps) {
  return (
    <header className="topbar">
      <Logo />
      <span className="topbar__spacer" />
      {cart && (
        <button
          type="button"
          className="topbar__cart desktop-only"
          aria-label={`Корзина: ${cart.count} ${plural(cart.count, SERVICES_WORD)}, ${formatPrice(cart.total)}`}
          onClick={cart.onOpen}
        >
          <Icon name="cart" size={20} />
          <span className="badge badge--sm" aria-hidden="true">
            {cart.count}
          </span>
          <span>{formatPrice(cart.total)}</span>
        </button>
      )}
      <button type="button" className="topbar__pill" aria-label="Язык и валюта: русский, RUB" disabled={currencyDisabled}>
        <span className="flag" aria-hidden="true" />
        <span>RUB</span>
        {!currencyDisabled && <Icon name="chevronDown" size={14} strokeWidth={2.2} />}
      </button>
      <button type="button" className="topbar__pill topbar__login">
        <span className="topbar__avatar" aria-hidden="true">
          <Icon name="person" />
        </span>
        <span>Войти</span>
      </button>
    </header>
  );
}

/** Logo slot: white pill for a wide logo, white circle for a square one, hotel name when the image fails. */
function Logo() {
  const [shape, setShape] = useState<'wide' | 'square' | 'text'>('wide');
  if (shape === 'text') return <span className="logo logo--text">{HOTEL.name}</span>;
  return (
    <span className={`logo logo--${shape}`}>
      <img
        src={HOTEL.logo}
        alt={HOTEL.name}
        className="logo__img"
        onLoad={(e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget;
          if (naturalWidth / naturalHeight <= 1.3) setShape('square');
        }}
        onError={() => setShape('text')}
      />
    </span>
  );
}
