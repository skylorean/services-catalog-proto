import { useState, type FormEvent, type ReactNode } from 'react';
import type { Customer } from './data.ts';
import { Dialog } from './Dialog.tsx';
import { Icon } from './icons.tsx';
import { validateCustomer, type CustomerErrors } from './validateCustomer.ts';

/** Prefilled as on the artboard so the happy path is one click. */
const DEMO_CUSTOMER: Customer = {
  lastName: 'Смирнова',
  firstName: 'Анна',
  phone: '(912) 345-67-89',
  email: 'anna.smirnova@example.com',
};

type CustomerFormProps = { customer: Customer | null; onClose: () => void; onSave: (customer: Customer) => void };

export function CustomerForm({ customer, onClose, onSave }: CustomerFormProps) {
  const [form, setForm] = useState<Customer>(customer ?? DEMO_CUSTOMER);
  const [consent, setConsent] = useState(true);
  const [errors, setErrors] = useState<CustomerErrors>({});

  const set = (key: keyof Customer) => (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validateCustomer(form, consent);
    setErrors(next);
    if (Object.keys(next).length === 0) onSave(form);
  };

  return (
    <Dialog label="Данные заказчика" className="dialog--customer" onClose={onClose} onSubmit={submit}>
      <div className="sheet__top">
        <h2 className="sheet__title">Данные заказчика</h2>
        <button type="button" className="iconbtn" aria-label="Закрыть" onClick={onClose}>
          <Icon name="close" size={18} strokeWidth={2.2} />
        </button>
      </div>

      <div className="sheet__body sheet__body--form">
        <div className="fields--2">
          <Field label="Фамилия" error={errors.lastName}>
            <input type="text" className="input" name="lastName" autoComplete="family-name" value={form.lastName} onChange={set('lastName')} />
          </Field>
          <Field label="Имя" error={errors.firstName}>
            <input type="text" className="input" name="firstName" autoComplete="given-name" value={form.firstName} onChange={set('firstName')} />
          </Field>
        </div>

        <div className={`field${errors.phone ? ' field--error' : ''}`}>
          <span className="field__label" id="phone-label">
            Номер телефона
          </span>
          <div className="phone">
            <button type="button" className="phone__code" aria-label="Выберите страну с кодом: Россия (+7)">
              <span className="flag flag--light" aria-hidden="true" />
              <span>+7</span>
              <Icon name="chevronDown" size={14} strokeWidth={2.2} />
            </button>
            <input
              type="tel"
              className="input"
              name="phone"
              aria-labelledby="phone-label"
              autoComplete="tel-national"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>
          {errors.phone && <span className="field__error">{errors.phone}</span>}
        </div>

        <Field label="Электронная почта" hint="Отправим подтверждение и чек" error={errors.email}>
          <span className="input-icon">
            <Icon name="mail" size={18} />
            <input type="email" className="input input--icon" name="email" autoComplete="email" value={form.email} onChange={set('email')} />
          </span>
        </Field>

        <div className={`field${errors.consent ? ' field--error' : ''}`}>
          <label className="consent">
            <input type="checkbox" name="consent" className="consent__box" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              Я подтверждаю ознакомление с <a href="#terms">пользовательским соглашением</a> и{' '}
              <a href="#privacy">политикой в отношении обработки персональных данных</a>
            </span>
          </label>
          {errors.consent && <span className="field__error">{errors.consent}</span>}
        </div>
      </div>

      <div className="sheet__footer sheet__footer--plain">
        <button type="submit" className="btn btn--primary btn--save">
          Сохранить
        </button>
      </div>
    </Dialog>
  );
}

type FieldProps = { label: string; hint?: string; error?: string; children: ReactNode };

function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className={`field${error ? ' field--error' : ''}`}>
      <span className="field__label">{label}</span>
      {children}
      {error ? <span className="field__error">{error}</span> : hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}
