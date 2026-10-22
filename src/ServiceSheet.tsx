import { useState } from 'react';
import { calcOrderItem, type CartItem } from './cart.ts';
import { EXTEND_HOUR_PRICE, EXTRA_GUEST_PRICE, FIRST_DATE, SPECIALISTS, TIME_SLOTS, type Service } from './data.ts';
import { Dialog } from './Dialog.tsx';
import { addDays, formatMonth, formatPrice, formatWeekday, GUESTS, HOURS, plural, sameDay } from './format.ts';
import { Icon } from './icons.tsx';

let nextItemId = 1;

type ServiceSheetProps = { service: Service; onClose: () => void; onAdd: (item: CartItem) => void };

export function ServiceSheet({ service, onClose, onAdd }: ServiceSheetProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [date, setDate] = useState(() => addDays(FIRST_DATE, 2));
  const [time, setTime] = useState('17:00');
  const [specialist, setSpecialist] = useState(SPECIALISTS[0]);
  const [extraHours, setExtraHours] = useState(1);
  const [extraGuests, setExtraGuests] = useState(0);

  const week = Array.from({ length: 7 }, (_, i) => addDays(FIRST_DATE, weekOffset * 7 + i));
  const { guests, hours, price } = calcOrderItem({ service, extraHours, extraGuests });

  const add = () => onAdd({ id: nextItemId++, service, date, time, specialist, extraHours, extraGuests });

  return (
    <Dialog label={service.title} className="dialog--service" onClose={onClose}>
      <div className="gallery">
        {service.gallery.map((photo) => (
          <img key={photo.src} src={photo.src} alt={photo.alt} className="gallery__img" />
        ))}
        <button type="button" className="gallery__close" aria-label="Закрыть" onClick={onClose}>
          <Icon name="close" size={18} strokeWidth={2.2} />
        </button>
        <button type="button" className="gallery__all">
          Все фото ({service.gallery.length})
        </button>
      </div>

      <div className="sheet__body">
        <div className="sheet__head">
          <h2 className="sheet__title sheet__title--service">{service.title}</h2>
          <ul className="meta meta--lg">
            {service.meta.map((m) => (
              <li key={m.text} className="meta__item">
                <Icon name={m.icon} />
                {m.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="block">
          <h3 className="block__title">Дата и время</h3>
          <div className="month">
            <button
              type="button"
              className="month__nav"
              aria-label="Назад"
              disabled={weekOffset === 0}
              onClick={() => setWeekOffset(weekOffset - 1)}
            >
              <Icon name="chevronLeft" size={18} strokeWidth={2.2} />
            </button>
            <span className="month__label">{formatMonth(week[0])}</span>
            <button type="button" className="month__nav" aria-label="Вперёд" onClick={() => setWeekOffset(weekOffset + 1)}>
              <Icon name="chevronRight" size={18} strokeWidth={2.2} />
            </button>
          </div>
          <div className="days">
            {week.map((d) => (
              <button key={d.toDateString()} type="button" className="day" aria-pressed={sameDay(d, date)} onClick={() => setDate(d)}>
                <span className="day__wd">{formatWeekday(d)}</span>
                <span className="day__num">{d.getDate()}</span>
              </button>
            ))}
          </div>
          <div className="slots">
            {TIME_SLOTS.map((t) => (
              <button key={t} type="button" className="slot" aria-pressed={t === time} onClick={() => setTime(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <fieldset className="block">
          <legend className="block__title">Специалист</legend>
          <div className="specialists">
            {SPECIALISTS.map((name, i) => (
              <label key={name} className="specialist">
                <span className="specialist__avatar" aria-hidden="true">
                  <Icon name={i === 0 ? 'asterisk' : 'person'} />
                </span>
                <span className="specialist__name">{name}</span>
                <input
                  type="radio"
                  name="specialist"
                  value={name}
                  className="specialist__radio"
                  checked={name === specialist}
                  onChange={() => setSpecialist(name)}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="block block--extras">
          <h3 className="block__title">Дополнительно</h3>
          <Stepper
            title="Продлить услугу"
            hint={`${formatPrice(EXTEND_HOUR_PRICE)} за 1 час`}
            value={extraHours}
            price={extraHours * EXTEND_HOUR_PRICE}
            onChange={setExtraHours}
          />
          <Stepper
            title="Добавить ещё гостей"
            hint={`${formatPrice(EXTRA_GUEST_PRICE)} за гостя`}
            value={extraGuests}
            price={extraGuests * EXTRA_GUEST_PRICE}
            onChange={setExtraGuests}
          />
        </div>

        <p className="sheet__desc">{service.description}</p>
      </div>

      <div className="sheet__footer">
        <span className="sheet__summary">
          {guests} {plural(guests, GUESTS)} • {hours} {plural(hours, HOURS)}
        </span>
        <span className="sheet__price">{formatPrice(price)}</span>
        <button type="button" className="btn btn--primary btn--add" onClick={add}>
          Добавить
        </button>
      </div>
    </Dialog>
  );
}

type StepperProps = { title: string; hint: string; value: number; price: number; onChange: (value: number) => void };

function Stepper({ title, hint, value, price, onChange }: StepperProps) {
  return (
    <div className="stepper">
      <div className="stepper__text">
        <span className="stepper__title">{title}</span>
        <span className="stepper__hint">{hint}</span>
      </div>
      <span className={`stepper__price${price ? '' : ' stepper__price--zero'}`}>{formatPrice(price)}</span>
      <div className="stepper__control">
        <button
          type="button"
          className="stepper__btn"
          aria-label={`Уменьшить: ${title}`}
          disabled={value === 0}
          onClick={() => onChange(value - 1)}
        >
          <Icon name="minus" strokeWidth={2.2} />
        </button>
        <span className="stepper__value" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          className="stepper__btn"
          aria-label={`Увеличить: ${title}`}
          disabled={value >= 10}
          onClick={() => onChange(value + 1)}
        >
          <Icon name="plus" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
