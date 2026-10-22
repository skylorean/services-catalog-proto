import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cartTotal, type CartItem } from './cart.ts';
import { CATEGORIES, SERVICES, type CategoryId, type Service } from './data.ts';
import { Footer } from './Footer.tsx';
import { formatPrice, plural, SERVICES_WORD } from './format.ts';
import { Header } from './Header.tsx';
import { Icon, type IconName } from './icons.tsx';

type CatalogProps = {
  cart: CartItem[];
  toast?: ReactNode;
  onOpenService: (service: Service) => void;
  onOpenCart: () => void;
};

export function Catalog({ cart, toast, onOpenService, onOpenCart }: CatalogProps) {
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [query, setQuery] = useState('');

  const needle = query.trim().toLowerCase();
  const visible = SERVICES.filter(
    (s) => (category === 'all' || s.category === category) && s.title.toLowerCase().includes(needle),
  );
  const inCart = new Set(cart.map((item) => item.service.id));
  const count = cart.length;
  const total = cartTotal(cart);
  const cartSummary = count ? { count, total, onOpen: onOpenCart } : null;
  const title = category === 'all' ? 'Все услуги' : CATEGORIES.find((c) => c.id === category)!.title;

  return (
    <div className={`page${cartSummary ? ' page--cartbar' : ''}`}>
      <section className="hero" aria-label="Шапка">
        <div className="container hero__inner">
          <Header cart={cartSummary} />
          {toast}
          <div className="hero__text">
            <h1 className="hero__title">Дополните проживание</h1>
            <p className="hero__subtitle">Сделайте отдых ещё комфортнее</p>
          </div>
        </div>
      </section>

      <div className="container catalog">
        <CategoryStrip>
          <CategoryButton active={category === 'all'} icon="grid" short="Все" long="Все" onClick={() => setCategory('all')} />
          {CATEGORIES.map((c) => (
            <CategoryButton
              key={c.id}
              active={category === c.id}
              icon={c.icon}
              short={c.shortTitle}
              long={c.title}
              onClick={() => setCategory(c.id)}
            />
          ))}
        </CategoryStrip>

        <div className="catalog__head">
          <h2 className="catalog__title">{title}</h2>
          <label className="search">
            <Icon name="search" />
            <span className="visually-hidden">Поиск услуг</span>
            <input
              type="search"
              className="search__input"
              placeholder="Поиск услуг…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        <div className="grid">
          {visible.map((s) => (
            <ServiceCard key={s.id} service={s} inCart={inCart.has(s.id)} onOpen={() => onOpenService(s)} />
          ))}
          {visible.length === 0 && <p className="grid__empty">Ничего не нашлось</p>}
        </div>
      </div>

      <Footer className="desktop-only" />

      {cartSummary && (
        <div className="cartbar phone-only">
          <button
            type="button"
            className="cartbar__button"
            aria-label={`Корзина: ${count} ${plural(count, SERVICES_WORD)}, ${formatPrice(total)}`}
            onClick={onOpenCart}
          >
            <span className="cartbar__icon">
              <Icon name="cart" size={22} />
              <span className="badge" aria-hidden="true">
                {count}
              </span>
            </span>
            <span className="cartbar__total">{formatPrice(total)}</span>
            <span className="cartbar__label">Корзина</span>
          </button>
        </div>
      )}
    </div>
  );
}

/** Horizontal scroller with edge fades and arrow buttons for the directions that still have room. */
function CategoryStrip({ children }: { children: ReactNode }) {
  const scroller = useRef<HTMLElement>(null);
  const [room, setRoom] = useState({ left: false, right: false });

  useEffect(() => {
    const el = scroller.current!;
    const update = () => {
      const left = el.scrollLeft > 1;
      const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setRoom((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
    };
    update();
    document.fonts?.ready.then(update);
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, []);

  const scrollBy = (direction: -1 | 1) => {
    const el = scroller.current!;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const cls = `categories-wrap${room.left ? ' categories-wrap--left' : ''}${room.right ? ' categories-wrap--right' : ''}`;
  return (
    <div className={cls}>
      <nav ref={scroller} className="categories" aria-label="Категории услуг">
        {children}
      </nav>
      {room.left && (
        <button
          type="button"
          className="categories__arrow categories__arrow--left"
          aria-label="Прокрутить категории назад"
          onClick={() => scrollBy(-1)}
        >
          <Icon name="chevronLeft" size={18} strokeWidth={2.2} />
        </button>
      )}
      {room.right && (
        <button
          type="button"
          className="categories__arrow categories__arrow--right"
          aria-label="Прокрутить категории вперёд"
          onClick={() => scrollBy(1)}
        >
          <Icon name="chevronRight" size={18} strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}

type CategoryButtonProps = { active: boolean; icon: IconName; short: string; long: string; onClick: () => void };

function CategoryButton({ active, icon, short, long, onClick }: CategoryButtonProps) {
  return (
    <button type="button" className="cat" aria-label={long} aria-pressed={active} onClick={onClick}>
      <span className="cat__icon" aria-hidden="true">
        <Icon name={icon} strokeWidth={1.8} />
      </span>
      <span className="cat__label cat__label--short">{short}</span>
      <span className="cat__label cat__label--long">{long}</span>
    </button>
  );
}

type ServiceCardProps = { service: Service; inCart: boolean; onOpen: () => void };

function ServiceCard({ service, inCart, onOpen }: ServiceCardProps) {
  return (
    <article className="card">
      <button type="button" className="card__photo" aria-label={service.title} onClick={onOpen}>
        <img src={service.image} alt="" />
      </button>
      <div className="card__body">
        <button type="button" className="card__title" onClick={onOpen}>
          {service.title}
        </button>
        <ul className="meta">
          {service.meta.map((m) => (
            <li key={m.text} className="meta__item">
              <Icon name={m.icon} />
              {m.text}
            </li>
          ))}
        </ul>
        <div className="card__foot">
          <span className="card__price">
            {service.priceFrom && <span className="card__from">от </span>}
            {formatPrice(service.basePrice)}
          </span>
          {inCart ? (
            <button type="button" className="card__more" aria-label={`Добавить ещё: ${service.title}`} onClick={onOpen}>
              <Icon name="plus" strokeWidth={2.5} />
              Ещё
            </button>
          ) : (
            <button type="button" className="card__add" aria-label={`Добавить: ${service.title}`} onClick={onOpen}>
              <Icon name="plus" size={20} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
