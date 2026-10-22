export const GUESTS = ['гость', 'гостя', 'гостей'] as const;
export const HOURS = ['час', 'часа', 'часов'] as const;
export const SERVICES_WORD = ['услуга', 'услуги', 'услуг'] as const;

export function plural(n: number, forms: readonly [string, string, string]) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1];
  return forms[2];
}

export function formatPrice(n: number) {
  return `${n.toLocaleString('ru-RU')} ₽`;
}

const DAY_MONTH_YEAR = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
const MONTH_YEAR = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' });
const WEEKDAY = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' });

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "24 октября 2026" */
export function formatDate(d: Date) {
  return DAY_MONTH_YEAR.format(d).replace(' г.', '');
}

/** "24.10.2026" */
export function formatDateShort(d: Date) {
  return d.toLocaleDateString('ru-RU');
}

/** "Октябрь 2026" */
export function formatMonth(d: Date) {
  return capitalize(MONTH_YEAR.format(d).replace(' г.', ''));
}

/** "Сб" */
export function formatWeekday(d: Date) {
  return capitalize(WEEKDAY.format(d));
}

export function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
