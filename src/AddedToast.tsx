import { useEffect, useLayoutEffect, useRef } from 'react';
import { calcOrderItem, describeItem, type CartItem } from './cart.ts';
import { formatPrice } from './format.ts';
import { Icon } from './icons.tsx';

type AddedToastProps = { item: CartItem; onClose: () => void; onOpenCart: () => void };

/** Desktop-only popup under the header with a caret aimed at the cart button; the phone shows the cart bar instead. */
export function AddedToast({ item, onClose, onOpenCart }: AddedToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  useLayoutEffect(() => {
    const aimCaret = () => {
      const toast = toastRef.current;
      const cart = document.querySelector('.topbar__cart');
      if (!toast || !cart) return;
      const cartBox = cart.getBoundingClientRect();
      const toastBox = toast.getBoundingClientRect();
      const x = cartBox.left + cartBox.width / 2 - toastBox.left;
      toast.style.setProperty('--caret-x', `${Math.max(20, Math.min(toastBox.width - 20, x))}px`);
    };
    aimCaret();
    window.addEventListener('resize', aimCaret);
    return () => window.removeEventListener('resize', aimCaret);
  }, []);

  return (
    <div ref={toastRef} role="status" className="toast desktop-only">
      <div className="toast__head">
        <span className="toast__title">Добавлено в корзину</span>
        <button type="button" className="toast__close" aria-label="Закрыть" onClick={onClose}>
          <Icon name="close" strokeWidth={2.2} />
        </button>
      </div>
      <button type="button" className="toast__item" onClick={onOpenCart}>
        <img className="toast__img" src={item.service.image} alt="" />
        <span className="toast__text">
          <span className="toast__name">{item.service.title}</span>
          <span className="toast__details">{describeItem(item)}</span>
          <span className="toast__price">{formatPrice(calcOrderItem(item).price)}</span>
        </span>
      </button>
    </div>
  );
}
