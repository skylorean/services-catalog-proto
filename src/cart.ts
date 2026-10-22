import { EXTEND_HOUR_PRICE, EXTRA_GUEST_PRICE, type Service } from './data.ts';
import { formatDate, formatDateShort, GUESTS, HOURS, plural } from './format.ts';

export type CartItem = {
  id: number;
  service: Service;
  date: Date;
  time: string;
  specialist: string;
  extraHours: number;
  extraGuests: number;
};

export type OrderItemTotals = { guests: number; hours: number; price: number };

export function calcOrderItem(item: Pick<CartItem, 'service' | 'extraHours' | 'extraGuests'>): OrderItemTotals {
  const { service, extraHours, extraGuests } = item;
  return {
    guests: service.baseGuests + extraGuests,
    hours: service.baseHours + extraHours,
    price: service.basePrice + extraHours * EXTEND_HOUR_PRICE + extraGuests * EXTRA_GUEST_PRICE,
  };
}

export function cartTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + calcOrderItem(item).price, 0);
}

/** "24 октября 2026 • 17:00 • 4 гостя • 3 часа" (short: "24.10.2026 • ...") */
export function describeItem(item: CartItem, short = false) {
  const { guests, hours } = calcOrderItem(item);
  return [
    short ? formatDateShort(item.date) : formatDate(item.date),
    item.time,
    `${guests} ${plural(guests, GUESTS)}`,
    `${hours} ${plural(hours, HOURS)}`,
  ].join(' • ');
}
