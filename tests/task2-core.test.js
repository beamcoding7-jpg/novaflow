import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventBus, eventBus } from '../js/core/event-bus.js';
import { StateStore, state } from '../js/core/state.js';
import { formatCurrency, formatCompactNumber, formatPercent } from '../js/utils/formatters.js';

test('EventBus publishes and subscribes to events', () => {
  const bus = new EventBus();
  let received = null;
  const handler = (detail) => { received = detail; };
  bus.on('test-event', handler);
  bus.emit('test-event', { value: 42 });
  assert.deepEqual(received, { value: 42 });
  bus.off('test-event', handler);
  bus.emit('test-event', { value: 99 });
  assert.deepEqual(received, { value: 42 }, 'Handler should not fire after off()');
});

test('EventBus singleton instance is exported and functional', () => {
  assert.ok(eventBus instanceof EventBus);
  let count = 0;
  const inc = () => { count++; };
  eventBus.on('inc', inc);
  eventBus.emit('inc');
  assert.equal(count, 1);
  eventBus.off('inc', inc);
  eventBus.emit('inc');
  assert.equal(count, 1);
});

test('StateStore gets, sets, and notifies subscribers', () => {
  const customState = new StateStore({ theme: 'light', timeframe: '7D' });
  assert.equal(customState.get('theme'), 'light');
  let notifiedTheme = null;
  let previousTheme = null;
  const unsubscribe = customState.subscribe('theme', (val, prev) => {
    notifiedTheme = val;
    previousTheme = prev;
  });
  customState.set('theme', 'dark');
  assert.equal(customState.get('theme'), 'dark');
  assert.equal(notifiedTheme, 'dark');
  assert.equal(previousTheme, 'light');

  // Same value should not trigger listeners
  let callCount = 0;
  customState.subscribe('theme', () => { callCount++; });
  customState.set('theme', 'dark');
  assert.equal(callCount, 0);

  // Unsubscribe should stop notifications
  unsubscribe();
  customState.set('theme', 'blue');
  assert.equal(notifiedTheme, 'dark');
});

test('StateStore singleton has expected initial state', () => {
  assert.ok(state instanceof StateStore);
  assert.equal(state.get('theme'), 'light');
  assert.equal(state.get('timeframe'), '7D');
  assert.equal(state.get('volume'), 1500000);
  assert.equal(state.get('manualHours'), 80);
  assert.equal(state.get('billingPeriod'), 'monthly');
  assert.equal(state.get('isModalOpen'), false);
});

test('Formatters format currency, compact numbers, and percentages correctly', () => {
  // Currency formatting
  assert.equal(formatCurrency(12458920.40), '$12,458,920.40');
  assert.equal(formatCurrency(50000, 'USD', 0), '$50,000');
  assert.equal(formatCurrency(1234.56, 'EUR', 2), '€1,234.56');

  // Compact number formatting
  assert.equal(formatCompactNumber(2500000000), '2.50B');
  assert.equal(formatCompactNumber(1000000000), '1B');
  assert.equal(formatCompactNumber(1450000), '1.45M');
  assert.equal(formatCompactNumber(1000000), '1M');
  assert.equal(formatCompactNumber(85000), '85K');
  assert.equal(formatCompactNumber(1200), '1.2K');
  assert.equal(formatCompactNumber(500), '500');

  // Percentage formatting
  assert.equal(formatPercent(0.148), '+14.8%');
  assert.equal(formatPercent(-0.032), '-3.2%');
  assert.equal(formatPercent(0.148, false), '14.8%');
  assert.equal(formatPercent(0), '0.0%');
});
