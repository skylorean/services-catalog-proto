import type { IconName } from './icons.tsx';

export type CategoryId = 'food' | 'spa' | 'kids' | 'rent' | 'banya' | 'transfer' | 'tours' | 'laundry' | 'parking';

export type Category = { id: CategoryId; title: string; shortTitle: string; icon: IconName };

export type ServiceMeta = { icon: 'person' | 'clock' | 'age'; text: string };

export type Service = {
  id: string;
  title: string;
  category: CategoryId | null;
  image: string;
  gallery: { src: string; alt: string }[];
  meta: ServiceMeta[];
  priceFrom: boolean;
  basePrice: number;
  baseGuests: number;
  baseHours: number;
  description: string;
};

export type Customer = { lastName: string; firstName: string; phone: string; email: string };

// ?. и ?? — для node --test, где import.meta.env нет.
export const IMG_BASE = `${import.meta.env?.BASE_URL ?? '/'}img/`;

export const HOTEL = { name: 'CITYTEL отель Санкт-Петербург', logo: `${IMG_BASE}logo-citytel.png` };

export const BOOKING = { number: '1234567', stay: '24 – 26 октября 2026 • 2 ночи', guests: '2 взрослых' };

export const FOOTER_TEXT = '© TravelLine: Platform — автоматизация процессов для гостиничного бизнеса. 2026';

/** Demo "today": the date strip starts here, the booking is 24-26 Oct. */
export const FIRST_DATE = new Date(2026, 9, 22);

// ponytail: one tariff for every service, as on the artboard; make it per-service when real data arrives.
export const EXTEND_HOUR_PRICE = 1500;
export const EXTRA_GUEST_PRICE = 500;

export const SPECIALISTS = ['Любой', 'Иван', 'Алексей'];

export const TIME_SLOTS = ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];

export const CATEGORIES: Category[] = [
  { id: 'food', title: 'Питание', shortTitle: 'Питание', icon: 'food' },
  { id: 'spa', title: 'СПА', shortTitle: 'СПА', icon: 'spa' },
  { id: 'kids', title: 'Услуги для детей', shortTitle: 'Для детей', icon: 'kids' },
  { id: 'rent', title: 'Прокат оборудования', shortTitle: 'Прокат', icon: 'rent' },
  { id: 'banya', title: 'Баня', shortTitle: 'Баня', icon: 'banya' },
  { id: 'transfer', title: 'Трансфер', shortTitle: 'Трансфер', icon: 'transfer' },
  // ponytail: three empty demo categories so the desktop strip overflows and shows its arrows at 1280px.
  { id: 'tours', title: 'Экскурсии', shortTitle: 'Экскурсии', icon: 'compass' },
  { id: 'laundry', title: 'Прачечная', shortTitle: 'Прачечная', icon: 'shirt' },
  { id: 'parking', title: 'Парковка', shortTitle: 'Парковка', icon: 'parking' },
];

const IMG = {
  bike: `${IMG_BASE}bike.jpg`,
  banya: `${IMG_BASE}banya.jpg`,
  room: `${IMG_BASE}room.jpg`,
  breakfast: `${IMG_BASE}breakfast.jpg`,
  massage: `${IMG_BASE}massage.jpg`,
  hotTub: `${IMG_BASE}hot-tub.jpg`,
  hero: `${IMG_BASE}hero.jpg`,
};

export const SERVICES: Service[] = [
  {
    id: 'bike',
    title: 'Прокат горного велосипеда',
    category: 'rent',
    image: IMG.bike,
    gallery: [
      { src: IMG.bike, alt: 'Горный велосипед' },
      { src: IMG.hero, alt: 'Территория отеля' },
      { src: IMG.room, alt: 'Пункт проката' },
    ],
    meta: [
      { icon: 'person', text: 'От 1 гостя' },
      { icon: 'clock', text: 'От 1 часа' },
      { icon: 'age', text: '10+ лет' },
    ],
    priceFrom: true,
    basePrice: 500,
    baseGuests: 1,
    baseHours: 1,
    description: 'Горные велосипеды с амортизацией и шлемом в комплекте. Маршруты по парку и набережной подскажем на стойке проката.',
  },
  {
    id: 'banya',
    title: 'Баня на дровах',
    category: 'banya',
    image: IMG.banya,
    gallery: [
      { src: IMG.banya, alt: 'Парная бани на дровах' },
      { src: IMG.hotTub, alt: 'Купель' },
      { src: IMG.massage, alt: 'Комната отдыха' },
    ],
    meta: [
      { icon: 'person', text: 'От 4 гостей' },
      { icon: 'clock', text: 'От 2 часов' },
    ],
    priceFrom: true,
    basePrice: 3000,
    baseGuests: 4,
    baseHours: 2,
    description: 'Русская баня на берёзовых дровах: парная на шесть человек, комната отдыха с самоваром и выход к купели. Веники, простыни и травяной чай входят в стоимость.',
  },
  {
    id: 'late-checkout',
    title: 'Поздний выезд',
    category: null,
    image: IMG.room,
    gallery: [
      { src: IMG.room, alt: 'Номер' },
      { src: IMG.breakfast, alt: 'Завтрак' },
      { src: IMG.hero, alt: 'Отель' },
    ],
    meta: [{ icon: 'clock', text: 'До 18:00' }],
    priceFrom: false,
    basePrice: 2000,
    baseGuests: 1,
    baseHours: 1,
    description: 'Останьтесь в номере до 18:00 в день выезда. Услуга оформляется на номер, количество гостей не влияет на цену.',
  },
  {
    id: 'breakfast',
    title: 'Завтрак шведский стол',
    category: 'food',
    image: IMG.breakfast,
    gallery: [
      { src: IMG.breakfast, alt: 'Шведский стол' },
      { src: IMG.room, alt: 'Ресторан' },
      { src: IMG.hero, alt: 'Отель' },
    ],
    meta: [
      { icon: 'person', text: 'От 1 гостя' },
      { icon: 'clock', text: '08:00–11:00' },
    ],
    priceFrom: false,
    basePrice: 600,
    baseGuests: 1,
    baseHours: 1,
    description: 'Горячие блюда, выпечка, свежие фрукты и кофе из зерна. Ресторан на первом этаже, с 08:00 до 11:00.',
  },
  {
    id: 'massage',
    title: 'Массаж расслабляющий',
    category: 'spa',
    image: IMG.massage,
    gallery: [
      { src: IMG.massage, alt: 'Массажный кабинет' },
      { src: IMG.hotTub, alt: 'Купель' },
      { src: IMG.banya, alt: 'Парная' },
    ],
    meta: [
      { icon: 'person', text: '1 гость' },
      { icon: 'clock', text: '1 час' },
    ],
    priceFrom: false,
    basePrice: 3500,
    baseGuests: 1,
    baseHours: 1,
    description: 'Классический расслабляющий массаж всего тела с ароматическими маслами. Сеанс проводит специалист СПА-центра.',
  },
  {
    id: 'hot-tub',
    title: 'Купель с горячей водой',
    category: 'banya',
    image: IMG.hotTub,
    gallery: [
      { src: IMG.hotTub, alt: 'Купель' },
      { src: IMG.banya, alt: 'Парная' },
      { src: IMG.hero, alt: 'Территория отеля' },
    ],
    meta: [
      { icon: 'person', text: 'От 2 гостей' },
      { icon: 'clock', text: '1 час' },
    ],
    priceFrom: false,
    basePrice: 2000,
    baseGuests: 2,
    baseHours: 1,
    description: 'Кедровая купель под открытым небом с подогревом до 40 °C. Халаты и полотенца выдаём на месте.',
  },
];
