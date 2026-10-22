import { calcOrderItem, cartTotal, describeItem, type CartItem } from './cart.ts';
import { BOOKING, HOTEL, type Customer } from './data.ts';
import { Footer } from './Footer.tsx';
import { formatPrice } from './format.ts';
import { Header } from './Header.tsx';
import { Icon } from './icons.tsx';

type CompletePageProps = { cart: CartItem[]; customer: Customer; onBack: () => void };

export function CompletePage({ cart, customer, onBack }: CompletePageProps) {
  return (
    <div className="page">
      <section className="hero hero--short" aria-label="Шапка">
        <div className="container hero__inner">
          <Header />
          <div className="hero__text">
            <button type="button" className="backlink" onClick={onBack}>
              <Icon name="arrowLeft" strokeWidth={2.2} />К услугам
            </button>
            <h1 className="hero__title hero__title--sm">Ваше бронирование</h1>
          </div>
        </div>
      </section>

      <main className="container status">
        <section className="panel status__main">
          <div className="panel__head">
            <span className="done-icon" aria-hidden="true">
              <Icon name="check" size={18} strokeWidth={2.6} />
            </span>
            <h2 className="panel__title">Услуги забронированы</h2>
          </div>
          <div className="panel__body panel__body--complete">
            <p className="notice">
              <Icon name="mail" size={18} className="notice__icon" />
              <span>
                {customer.firstName}, благодарим за выбор! Подтверждение бронирования отправим на <strong>{customer.email}</strong>.
              </span>
            </p>

            <div className="booking-ref">
              <h3 className="panel__subtitle">Услуги к бронированию</h3>
              <button type="button" className="ref-link phone-only">
                № {BOOKING.number}
                <Icon name="external" size={14} strokeWidth={2.2} />
              </button>
              <span className="booking-ref__stay phone-only">
                {BOOKING.stay} • {BOOKING.guests}
              </span>
            </div>

            <ul className="items__list">
              {cart.map((item) => (
                <li key={item.id} className="item item--done">
                  <img className="item__img" src={item.service.image} alt="" />
                  <div className="item__text">
                    <span className="item__name">{item.service.title}</span>
                    <span className="item__details">
                      {describeItem(item, true)}
                      <span className="desktop-only"> • Специалист: {item.specialist.toLowerCase()}</span>
                    </span>
                  </div>
                  <span className="item__price item__price--inline">{formatPrice(calcOrderItem(item).price)}</span>
                </li>
              ))}
            </ul>

            <div className="aside__total desktop-only">
              <span className="aside__hint">Оплачено онлайн</span>
              <span className="aside__sum">{formatPrice(cartTotal(cart))}</span>
            </div>

            <button type="button" className="btn btn--outline phone-only">
              Управлять бронированием
            </button>
          </div>
        </section>

        <aside className="panel panel--aside desktop-only" aria-label="Бронирование">
          <h3 className="aside__title">Бронирование</h3>
          <button type="button" className="ref-link ref-link--lg">
            № {BOOKING.number}
            <Icon name="external" strokeWidth={2.2} />
          </button>
          <ul className="facts">
            <li>
              <Icon name="calendar" />
              {BOOKING.stay}
            </li>
            <li>
              <Icon name="person" />
              {BOOKING.guests}
            </li>
            <li>
              <Icon name="banya" />
              {HOTEL.name}
            </li>
          </ul>
          <div className="divider" />
          <button type="button" className="btn btn--outline">
            Управлять бронированием
          </button>
          <button type="button" className="btn btn--primary" onClick={onBack}>
            Добавить ещё услуги
          </button>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
