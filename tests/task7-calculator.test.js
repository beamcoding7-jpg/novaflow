import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { calculateRoi, initCalculator, _resetCalculatorInit } from '../js/modules/calculator.js';
import { state } from '../js/core/state.js';
import { eventBus } from '../js/core/event-bus.js';

test('calculateRoi correctly computes annual savings and hours saved', () => {
  const result = calculateRoi({ volume: 1500000, manualHours: 80 });

  // Manual cost = 80 * 65 * 12 = 62,400
  // Manual error leakage = 1,500,000 * 0.003 = 4,500
  // Annual savings = (62,400 * 0.85) + (4,500 * 0.75) = 53,040 + 3,375 = 56,415
  assert.equal(result.annualSavings, 56415);
  assert.equal(result.hoursSavedMonthly, 68);
  assert.ok(result.paybackDays > 0 && result.paybackDays < 100);
  assert.equal(result.paybackDays, 23);
});

test('calculateRoi handles boundary values and enforces min payback days', () => {
  // Test low volume and low hours
  const lowResult = calculateRoi({ volume: 50000, manualHours: 10 });
  // Manual cost = 10 * 65 * 12 = 7,800
  // Error leakage = 50,000 * 0.003 = 150
  // Annual savings = (7,800 * 0.85) + (150 * 0.75) = 6630 + 112.5 = 6743
  assert.equal(lowResult.annualSavings, 6743);
  assert.equal(lowResult.hoursSavedMonthly, 9);
  assert.ok(lowResult.paybackDays > 0);

  // Test extremely high volume where payback days formula might yield < 12
  // Platform fee = 3588; if savings = 1,000,000, 3588/1000000*365 = 1.3 -> clamped to 12
  const highResult = calculateRoi({ volume: 100000000, manualHours: 500 });
  assert.equal(highResult.paybackDays, 12, 'Payback days must be clamped to minimum 12 days');
});

test('Task 7: CSS contains ROI Calculator layout and custom slider styles', () => {
  const css = fs.readFileSync('css/modules/roi-calculator.css', 'utf-8');

  assert.ok(css.includes('.calculator-card'), 'CSS must define .calculator-card');
  assert.ok(css.includes('.calc-control'), 'CSS must define .calc-control');
  assert.ok(css.includes('.calc-control__header'), 'CSS must define .calc-control__header');
  assert.ok(css.includes('.calc-control__label'), 'CSS must define .calc-control__label');
  assert.ok(css.includes('.calc-control__val'), 'CSS must define .calc-control__val');
  assert.ok(css.includes('.calc-slider'), 'CSS must define .calc-slider');
  assert.ok(css.includes('--slider-progress'), 'CSS must use --slider-progress variable for slider gradient');
  assert.ok(css.includes('::-webkit-slider-thumb'), 'CSS must style webkit slider thumb');
  assert.ok(css.includes('::-moz-range-thumb'), 'CSS must style moz range thumb');
  assert.ok(css.includes('.calc-results'), 'CSS must define .calc-results');
  assert.ok(css.includes('.calc-results__headline'), 'CSS must define .calc-results__headline');
  assert.ok(css.includes('.calc-metrics-row'), 'CSS must define .calc-metrics-row');
  assert.ok(css.includes('.calc-metric-box__val'), 'CSS must define .calc-metric-box__val');
  assert.ok(css.includes('@media (min-width: 900px)'), 'CSS must have desktop breakpoint');
});

test('Task 7: index.html contains ROI Calculator section with accessible sliders and initial markup', () => {
  const html = fs.readFileSync('index.html', 'utf-8');

  assert.ok(html.includes('id="calculator"'), 'index.html must include section with id="calculator"');
  assert.ok(html.includes('id="calc-slider-volume"'), 'index.html must include volume slider');
  assert.ok(html.includes('id="calc-val-volume"'), 'index.html must include volume value display');
  assert.ok(html.includes('id="calc-slider-hours"'), 'index.html must include hours slider');
  assert.ok(html.includes('id="calc-val-hours"'), 'index.html must include hours value display');
  assert.ok(html.includes('id="calc-annual-savings"'), 'index.html must include annual savings output');
  assert.ok(html.includes('id="calc-hours-saved"'), 'index.html must include hours saved output');
  assert.ok(html.includes('id="calc-payback-days"'), 'index.html must include payback days output');

  // Progressive enhancement initial values
  assert.ok(html.includes('$56,415'), 'index.html must include default savings output for progressive enhancement');
  assert.ok(html.includes('68 hrs/mo'), 'index.html must include default hours saved output');
  assert.ok(html.includes('23 days'), 'index.html must include default payback days output');

  // Accessibility check
  assert.ok(html.includes('for="calc-slider-volume"'), 'Volume slider must have associated label');
  assert.ok(html.includes('for="calc-slider-hours"'), 'Hours slider must have associated label');
  assert.ok(html.includes('aria-label="Monthly Transaction Volume"') || html.includes('aria-labelledby'), 'Volume slider must have accessible name');
  assert.ok(html.includes('aria-valuemin="50000"'), 'Volume slider must declare aria-valuemin');
  assert.ok(html.includes('aria-valuemax="10000000"'), 'Volume slider must declare aria-valuemax');
});

test('Task 7: js/modules/calculator.js initCalculator binds sliders, updates state, and emits events', () => {
  // Test gracefully handling missing DOM
  const originalDoc = globalThis.document;
  globalThis.document = {
    getElementById: () => null
  };

  assert.doesNotThrow(() => {
    initCalculator();
  }, 'initCalculator must not throw when DOM elements are missing');

  // Mock DOM elements
  const listeners = {
    volume: {},
    hours: {}
  };

  const mockVolumeSlider = {
    min: '50000',
    max: '10000000',
    value: '2000000',
    attributes: {},
    style: {
      properties: {},
      setProperty(prop, val) { this.properties[prop] = val; }
    },
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k]; },
    addEventListener(evt, fn) { listeners.volume[evt] = fn; }
  };

  const mockHoursSlider = {
    min: '10',
    max: '200',
    value: '100',
    attributes: {},
    style: {
      properties: {},
      setProperty(prop, val) { this.properties[prop] = val; }
    },
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k]; },
    addEventListener(evt, fn) { listeners.hours[evt] = fn; }
  };

  const mockVolumeVal = { textContent: '' };
  const mockHoursVal = { textContent: '' };
  const mockSavings = { textContent: '' };
  const mockHoursSaved = { textContent: '' };
  const mockPayback = { textContent: '' };

  globalThis.document = {
    getElementById: (id) => {
      switch (id) {
        case 'calc-slider-volume': return mockVolumeSlider;
        case 'calc-slider-hours': return mockHoursSlider;
        case 'calc-val-volume': return mockVolumeVal;
        case 'calc-val-hours': return mockHoursVal;
        case 'calc-annual-savings': return mockSavings;
        case 'calc-hours-saved': return mockHoursSaved;
        case 'calc-payback-days': return mockPayback;
        default: return null;
      }
    }
  };

  let capturedEvent = null;
  const eventHandler = (detail) => { capturedEvent = detail; };
  eventBus.on('calculator-updated', eventHandler);

  // Initialize
  initCalculator();

  // Verify initial calculation based on slider values (2,000,000 and 100)
  // Manual cost = 100 * 65 * 12 = 78,000 -> 78000 * 0.85 = 66,300
  // Error leakage = 2,000,000 * 0.003 = 6,000 -> 6000 * 0.75 = 4,500
  // Total savings = 66,300 + 4,500 = 70,800
  assert.equal(mockVolumeVal.textContent, '$2,000,000');
  assert.equal(mockHoursVal.textContent, '100 hrs/mo');
  assert.equal(mockSavings.textContent, '$70,800');
  assert.equal(mockHoursSaved.textContent, '85 hrs/mo');
  assert.equal(mockPayback.textContent, '18 days');
  assert.equal(state.get('volume'), 2000000);
  assert.equal(state.get('manualHours'), 100);
  assert.ok(mockVolumeSlider.style.properties['--slider-progress']);
  assert.ok(mockHoursSlider.style.properties['--slider-progress']);
  assert.deepEqual(capturedEvent, { volume: 2000000, hours: 100, annualSavings: 70800 });

  // Simulate user changing hours slider to 120
  mockHoursSlider.value = '120';
  listeners.hours['input']();

  // Manual cost = 120 * 65 * 12 = 93,600 -> 93600 * 0.85 = 79,560
  // Total savings = 79,560 + 4,500 = 84,060
  // Hours saved = 120 * 0.85 = 102
  assert.equal(mockHoursVal.textContent, '120 hrs/mo');
  assert.equal(mockSavings.textContent, '$84,060');
  assert.equal(mockHoursSaved.textContent, '102 hrs/mo');
  assert.equal(state.get('manualHours'), 120);
  assert.deepEqual(capturedEvent, { volume: 2000000, hours: 120, annualSavings: 84060 });

  eventBus.off('calculator-updated', eventHandler);
  globalThis.document = originalDoc;
});

test('Task 7: initCalculator is idempotent and safe against multiple invocations', () => {
  _resetCalculatorInit();

  let addEventListenerCount = 0;
  const mockSlider = {
    min: '10',
    max: '200',
    value: '50',
    style: { setProperty() {} },
    setAttribute() {},
    addEventListener() { addEventListenerCount++; }
  };

  const origDoc = globalThis.document;
  globalThis.document = {
    getElementById: (id) => {
      if (id === 'calc-slider-volume' || id === 'calc-slider-hours') return mockSlider;
      return { textContent: '' };
    }
  };

  initCalculator();
  assert.equal(addEventListenerCount, 2, 'Should add 2 listeners on first init (volume and hours)');

  // Call second time without reset
  initCalculator();
  assert.equal(addEventListenerCount, 2, 'Should not add additional listeners when already initialized');

  globalThis.document = origDoc;
});
