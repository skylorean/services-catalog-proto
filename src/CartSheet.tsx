import { calcOrderItem, cartTotal, describeItem, type CartItem } from './cart.ts';
import type { Customer } from './data.ts';
import { Dialog } from './Dialog.tsx';
import { formatPrice } from './format.ts';
import { Icon } from './icons.tsx';

type CartSheetProps = {
  cart: CartItem[];
  customer: Customer | null;
  onClose: () => void;
  onRemove: (id: number) => void;
  onEditCustomer: () => void;
  onCheckout: () => void;
};

export function CartSheet({ cart, customer, onClose, onRemove, onEditCustomer, onCheckout }: CartSheetProps) {
  return (
    <Dialog label="Корзина" className="dialog--cart" onClose={onClose}>
      <div className="sheet__top">
        <h2 className="sheet__title">Корзина</h2>
        <button type="button" className="iconbtn" aria-label="Закрыть" onClick={onClose}>
          <Icon name="close" size={18} strokeWidth={2.2} />
        </button>
      </div>

      <div className="sheet__body sheet__body--cart">
        <section className={`customer${customer ? ' customer--filled' : ''}`} aria-label="Данные гостя">
          {customer ? (
            <>
              <span className="customer__avatar" aria-hidden="true">
                <Icon name="person" size={18} />
              </span>
              <div className="customer__text">
                <span className="customer__name">
                  Заказчик: {customer.firstName} {customer.lastName}
                </span>
                <span className="customer__hint">Подтверждение придёт на {customer.email}</span>
              </div>
              <button type="button" className="customer__edit" aria-label="Изменить данные заказчика" onClick={onEditCustomer}>
                <Icon name="pencil" size={18} />
              </button>
            </>
          ) : (
            <>
              <div className="customer__text">
                <span className="customer__name">На кого оформить заказ?</span>
                <span className="customer__hint">Укажите имя и контакты для связи</span>
              </div>
              <button type="button" className="btn btn--primary btn--sm" onClick={onEditCustomer}>
                Ввести данные
              </button>
            </>
          )}
        </section>

        <section className="items" aria-label="Заказанные услуги">
          <h3 className="items__title">Заказанные услуги</h3>
          <ul className="items__list">
            {cart.map((item) => (
              <li key={item.id} className="item">
                <img className="item__img" src={item.service.image} alt="" />
                <div className="item__text">
                  <span className="item__name">{item.service.title}</span>
                  <span className="item__details">{describeItem(item)}</span>
                  <span className="item__price">{formatPrice(calcOrderItem(item).price)}</span>
                </div>
                <button type="button" className="item__remove" aria-label={`Удалить: ${item.service.title}`} onClick={() => onRemove(item.id)}>
                  <Icon name="trash" size={18} />
                </button>
              </li>
            ))}
          </ul>
          {cart.length === 0 && <p className="items__empty">В корзине пока пусто</p>}
        </section>
      </div>

      <div className="sheet__footer">
        <div className="total">
          <span className="total__sum">{formatPrice(cartTotal(cart))}</span>
          <span className="total__hint">Оплата онлайн</span>
        </div>
        <button type="button" className="btn btn--primary" disabled={!customer || cart.length === 0} onClick={onCheckout}>
          Оформить заказ
        </button>
      </div>
    </Dialog>
  );
}
