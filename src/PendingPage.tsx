import { calcOrderItem, cartTotal, describeItem, type CartItem } from './cart.ts';
import { BOOKING, type Customer } from './data.ts';
import { Footer } from './Footer.tsx';
import { formatPrice } from './format.ts';
import { Header } from './Header.tsx';
import { Icon } from './icons.tsx';

type PendingPageProps = { cart: CartItem[]; customer: Customer };

export function PendingPage({ cart, customer }: PendingPageProps) {
  return (
    <div className="page">
      <section className="hero hero--short" aria-label="Шапка">
        <div className="container hero__inner">
          <Header currencyDisabled />
          <div className="hero__text">
            <h1 className="hero__title hero__title--sm">Оформление заказа</h1>
          </div>
        </div>
      </section>

      <main className="container status">
        <section className="panel status__main" aria-live="polite">
          <div className="panel__head">
            <h2 className="panel__title">Подтверждаем бронирование…</h2>
          </div>
          <div className="panel__body">
            <div className="pending">
              <span className="pending__icon" aria-hidden="true">
                <Icon name="clock" size={20} />
              </span>
              <span className="pending__text">
                <span className="pending__title">Проверяем оплату по заказу № {BOOKING.number}</span>
                <span className="pending__hint">Не закрывайте страницу — подтверждение займёт не больше 15 минут</span>
              </span>
            </div>
            <div className="progress" aria-hidden="true">
              <div className="progress__bar" />
            </div>
            <ul className="steps desktop-only">
              <li className="step step--done">
                <span className="step__dot" aria-hidden="true">
                  <Icon name="check" size={12} strokeWidth={3} />
                </span>
                Заказ создан
              </li>
              <li className="step step--active">
                <span className="step__dot" aria-hidden="true" />
                Ждём ответ платёжного сервиса
              </li>
              <li className="step step--todo">
                <span className="step__dot" aria-hidden="true" />
                Отправим подтверждение на почту
              </li>
            </ul>
          </div>
        </section>

        <aside className="panel panel--aside desktop-only" aria-label="Заказ">
          <h3 className="aside__title">Заказ</h3>
          {cart.map((item) => (
            <div key={item.id} className="order-item">
              <img className="order-item__img" src={item.service.image} alt="" />
              <div className="order-item__text">
                <span className="order-item__name">{item.service.title}</span>
                <span className="order-item__details">{describeItem(item)}</span>
              </div>
              <span className="order-item__price">{formatPrice(calcOrderItem(item).price)}</span>
            </div>
          ))}
          <div className="divider" />
          <div className="aside__total">
            <span className="aside__hint">Оплата онлайн</span>
            <span className="aside__sum">{formatPrice(cartTotal(cart))}</span>
          </div>
          <div className="aside__customer">
            <span className="customer__avatar customer__avatar--sm" aria-hidden="true">
              <Icon name="person" />
            </span>
            <span className="aside__customer-text">
              <span className="aside__customer-name">
                {customer.firstName} {customer.lastName}
              </span>
              <span className="aside__customer-email">{customer.email}</span>
            </span>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
