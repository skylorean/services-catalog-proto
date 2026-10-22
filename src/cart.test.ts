import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calcOrderItem, cartTotal, describeItem } from './cart.ts';
import { SERVICES } from './data.ts';
import { plural, GUESTS, HOURS } from './format.ts';
import { validateCustomer } from './validateCustomer.ts';

const banya = SERVICES.find((s) => s.id === 'banya')!;

test('banya: 2 base hours + 1 extension for 4 guests = 4500', () => {
  assert.deepEqual(calcOrderItem({ service: banya, extraHours: 1, extraGuests: 0 }), { guests: 4, hours: 3, price: 4500 });
});

test('extra guests add 500 each', () => {
  assert.equal(calcOrderItem({ service: banya, extraHours: 0, extraGuests: 2 }).price, 4000);
});

test('describeItem matches the artboard line', () => {
  const item = { id: 1, service: banya, date: new Date(2026, 9, 24), time: '17:00', specialist: 'Любой', extraHours: 1, extraGuests: 0 };
  assert.equal(describeItem(item), '24 октября 2026 • 17:00 • 4 гостя • 3 часа');
  assert.equal(describeItem(item, true), '24.10.2026 • 17:00 • 4 гостя • 3 часа');
  assert.equal(cartTotal([item, item]), 9000);
});

test('russian plurals', () => {
  assert.equal(`1 ${plural(1, GUESTS)}`, '1 гость');
  assert.equal(`4 ${plural(4, GUESTS)}`, '4 гостя');
  assert.equal(`11 ${plural(11, HOURS)}`, '11 часов');
  assert.equal(`21 ${plural(21, HOURS)}`, '21 час');
});

test('validateCustomer', () => {
  const ok = { lastName: 'Смирнова', firstName: 'Анна', phone: '(912) 345-67-89', email: 'anna.smirnova@example.com' };
  assert.deepEqual(validateCustomer(ok, true), {});
  const bad = validateCustomer({ lastName: ' ', firstName: '', phone: '123', email: 'nope' }, false);
  assert.deepEqual(Object.keys(bad).sort(), ['consent', 'email', 'firstName', 'lastName', 'phone']);
});
