import type { Customer } from './data.ts';

export type CustomerErrors = Partial<Record<keyof Customer | 'consent', string>>;

export function validateCustomer(c: Customer, consent: boolean): CustomerErrors {
  const errors: CustomerErrors = {};
  if (!c.lastName.trim()) errors.lastName = 'Укажите фамилию';
  if (!c.firstName.trim()) errors.firstName = 'Укажите имя';
  if (c.phone.replace(/\D/g, '').length < 10) errors.phone = 'Нужно 10 цифр номера';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) errors.email = 'Проверьте адрес почты';
  if (!consent) errors.consent = 'Без согласия оформить заказ нельзя';
  return errors;
}
