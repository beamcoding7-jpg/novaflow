import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pricingTiers, initPricing, _resetPricingInit } from '../js/modules/pricing.js';
import { state } from '../js/core/state.js';
import { eventBus } from '../js/core/event-bus.js';

test('pricingTiers contains correct monthly and annual discounted rates', () => {
  assert.equal(pricingTiers.starter.monthly, 99);
  assert.equal(pricingTiers.starter.annual, 79);
  assert.equal(pricingTiers.scale.monthly, 299);
  assert.equal(pricingTiers.scale.annual, 239);
  assert.equal(pricingTiers.enterprise.monthly, 'Custom');
  assert.equal(pricingTiers.enterprise.annual, 'Custom');
});

test('Task 8: CSS defines pricing table, billing switcher, and testimonials styles', () => {
  const css = fs.readFileSync('css/modules/pricing.css', 'utf-8');

  // Switcher styles
  assert.ok(css.includes('.pricing-switch-wrapper'), 'CSS must define .pricing-switch-wrapper');
  assert.ok(css.includes('.pricing-switch-label'), 'CSS must define .pricing-switch-label');
  assert.ok(css.includes('.pricing-switch-label.active'), 'CSS must define active state for switch label');
  assert.ok(css.includes('.switch-toggle'), 'CSS must define .switch-toggle');
  assert.ok(css.includes('.switch-toggle.active'), 'CSS must define active state for switch toggle');
  assert.ok(css.includes('.switch-toggle__handle'), 'CSS must define .switch-toggle__handle');
  assert.ok(css.includes('.pricing-save-badge'), 'CSS must define .pricing-save-badge');
  assert.ok(css.includes('pulse-subtle'), 'CSS must define pulse animation for save badge');
  assert.ok(css.includes('prefers-reduced-motion'), 'CSS must respect prefers-reduced-motion');

  // Pricing Cards
  assert.ok(css.includes('.pricing-grid'), 'CSS must define .pricing-grid');
  assert.ok(css.includes('.pricing-card'), 'CSS must define .pricing-card');
  assert.ok(css.includes('.pricing-card--popular'), 'CSS must define .pricing-card--popular');
  assert.ok(css.includes('.pricing-card__badge'), 'CSS must define .pricing-card__badge');
  assert.ok(css.includes('.pricing-card__name'), 'CSS must define .pricing-card__name');
  assert.ok(css.includes('.pricing-card__price-row'), 'CSS must define .pricing-card__price-row');
  assert.ok(css.includes('.pricing-card__amount'), 'CSS must define .pricing-card__amount');
  assert.ok(css.includes('.pricing-card__period'), 'CSS must define .pricing-card__period');
  assert.ok(css.includes('.pricing-features'), 'CSS must define .pricing-features');
  assert.ok(css.includes('.pricing-feature-item'), 'CSS must define .pricing-feature-item');

  // Testimonial Cards
  assert.ok(css.includes('.testimonials-grid'), 'CSS must define .testimonials-grid');
  assert.ok(css.includes('.testimonial-card'), 'CSS must define .testimonial-card');
  assert.ok(css.includes('.testimonial-quote'), 'CSS must define .testimonial-quote');
  assert.ok(css.includes('.testimonial-author'), 'CSS must define .testimonial-author');
  assert.ok(css.includes('.testimonial-avatar'), 'CSS must define .testimonial-avatar');

  // Responsive Breakpoints
  assert.ok(css.includes('@media (min-width: 960px)'), 'CSS must define 3-column pricing grid breakpoint');
  assert.ok(css.includes('@media (min-width: 860px)'), 'CSS must define 3-column testimonials grid breakpoint');
});

test('Task 8: index.html contains Pricing and Testimonials sections with required IDs and attributes', () => {
  const html = fs.readFileSync('index.html', 'utf-8');

  // Pricing section & IDs
  assert.ok(html.includes('id="pricing"'), 'index.html must include section with id="pricing"');
  assert.ok(html.includes('id="pricing-toggle"'), 'index.html must include billing switch button #pricing-toggle');
  assert.ok(html.includes('id="label-monthly"'), 'index.html must include #label-monthly');
  assert.ok(html.includes('id="label-annual"'), 'index.html must include #label-annual');
  assert.ok(html.includes('id="price-starter"'), 'index.html must include #price-starter');
  assert.ok(html.includes('id="price-scale"'), 'index.html must include #price-scale');
  assert.ok(html.includes('id="price-enterprise"'), 'index.html must include #price-enterprise');

  // Tiers and pricing details
  assert.ok(html.includes('$99'), 'index.html must show initial starter price $99');
  assert.ok(html.includes('$299'), 'index.html must show initial scale price $299');
  assert.ok(html.includes('pricing-card--popular'), 'index.html must include featured .pricing-card--popular card');
  assert.ok(html.includes('pricing-save-badge'), 'index.html must include animated save 20% badge');
  assert.ok(html.includes('Save 20%'), 'index.html must display "Save 20%" text');

  // Testimonials section & grid
  assert.ok(html.includes('id="testimonials"'), 'index.html must include section with id="testimonials"');
  assert.ok(html.includes('testimonials-grid'), 'index.html must include .testimonials-grid');
  assert.ok(html.includes('testimonial-card'), 'index.html must include .testimonial-card elements');

  // Verify at least 3 testimonial cards
  const cardMatches = html.match(/class="[^"]*testimonial-card[^"]*"/g) || [];
  assert.ok(cardMatches.length >= 3, 'index.html must contain at least 3 testimonial cards');

  // Verify enterprise leadership roles represented
  assert.ok(html.includes('Chief Financial Officer') || html.includes('CFO'), 'Testimonials must feature CFO');
  assert.ok(html.includes('Treasury') || html.includes('Finance'), 'Testimonials must feature Treasury/Finance leadership');

  // Accessibility checks
  assert.ok(html.includes('role="switch"'), 'Toggle button must have role="switch"');
  assert.ok(html.includes('aria-checked'), 'Toggle button must have aria-checked');
});

test('Task 8: js/modules/pricing.js initPricing handles switcher toggle, state sync, and DOM updates', () => {
  _resetPricingInit();

  // Test graceful handling of missing DOM
  const originalDoc = globalThis.document;
  globalThis.document = {
    getElementById: () => null
  };

  assert.doesNotThrow(() => {
    initPricing();
  }, 'initPricing must not throw when DOM elements are missing');

  // Create mock DOM elements
  const listeners = {
    toggle: {},
    monthly: {},
    annual: {}
  };

  const createMockElement = (id, initialText = '') => {
    const classList = new Set();
    const attrs = {};
    return {
      id,
      textContent: initialText,
      classList: {
        add: (c) => classList.add(c),
        remove: (c) => classList.delete(c),
        toggle: (c, force) => {
          if (force !== undefined) {
            if (force) classList.add(c);
            else classList.delete(c);
            return force;
          }
          if (classList.has(c)) {
            classList.delete(c);
            return false;
          }
          classList.add(c);
          return true;
        },
        contains: (c) => classList.has(c)
      },
      setAttribute: (k, v) => { attrs[k] = String(v); },
      getAttribute: (k) => attrs[k],
      hasAttribute: (k) => k in attrs,
      addEventListener: (evt, fn) => {
        if (id === 'pricing-toggle') listeners.toggle[evt] = fn;
        if (id === 'label-monthly') listeners.monthly[evt] = fn;
        if (id === 'label-annual') listeners.annual[evt] = fn;
      }
    };
  };

  const mockToggle = createMockElement('pricing-toggle');
  mockToggle.setAttribute('role', 'switch');
  mockToggle.setAttribute('aria-checked', 'false');

  const mockLabelMonthly = createMockElement('label-monthly');
  const mockLabelAnnual = createMockElement('label-annual');
  const mockStarterPrice = createMockElement('price-starter', '$99');
  const mockScalePrice = createMockElement('price-scale', '$299');
  const mockEnterprisePrice = createMockElement('price-enterprise', 'Custom');

  const elements = {
    'pricing-toggle': mockToggle,
    'label-monthly': mockLabelMonthly,
    'label-annual': mockLabelAnnual,
    'price-starter': mockStarterPrice,
    'price-scale': mockScalePrice,
    'price-enterprise': mockEnterprisePrice
  };

  globalThis.document = {
    getElementById: (id) => elements[id] || null
  };

  let emittedEvents = [];
  eventBus.on('pricing-changed', (detail) => {
    emittedEvents.push(detail);
  });

  _resetPricingInit();
  initPricing();

  // Initial state should be monthly
  assert.equal(state.get('billingPeriod'), 'monthly');
  assert.equal(mockStarterPrice.textContent, '$99');
  assert.equal(mockScalePrice.textContent, '$299');
  assert.equal(mockToggle.classList.contains('active'), false);
  assert.equal(mockToggle.getAttribute('aria-checked'), 'false');
  assert.equal(mockLabelMonthly.classList.contains('active'), true);
  assert.equal(mockLabelAnnual.classList.contains('active'), false);

  // Click toggle to switch to annual
  listeners.toggle['click']();
  assert.equal(state.get('billingPeriod'), 'annual');
  assert.equal(mockStarterPrice.textContent, '$79');
  assert.equal(mockScalePrice.textContent, '$239');
  assert.equal(mockToggle.classList.contains('active'), true);
  assert.equal(mockToggle.getAttribute('aria-checked'), 'true');
  assert.equal(mockLabelMonthly.classList.contains('active'), false);
  assert.equal(mockLabelAnnual.classList.contains('active'), true);

  // Check eventBus received event
  assert.ok(emittedEvents.some(e => e.period === 'annual'));

  // Click label-monthly to switch back to monthly
  listeners.monthly['click']();
  assert.equal(state.get('billingPeriod'), 'monthly');
  assert.equal(mockStarterPrice.textContent, '$99');
  assert.equal(mockScalePrice.textContent, '$299');
  assert.equal(mockToggle.classList.contains('active'), false);
  assert.equal(mockToggle.getAttribute('aria-checked'), 'false');

  // Click label-annual to switch to annual
  listeners.annual['click']();
  assert.equal(state.get('billingPeriod'), 'annual');
  assert.equal(mockStarterPrice.textContent, '$79');
  assert.equal(mockScalePrice.textContent, '$239');

  // Restore global document
  globalThis.document = originalDoc;
});

test('Task 8: initPricing is idempotent and supports keyboard navigation', () => {
  _resetPricingInit();

  const originalDoc = globalThis.document;
  let clickCount = 0;
  let keydownCount = 0;

  const mockToggle = {
    id: 'pricing-toggle',
    classList: { toggle: () => {}, contains: () => false },
    setAttribute: () => {},
    hasAttribute: () => true,
    getAttribute: () => 'switch',
    addEventListener: (evt) => {
      if (evt === 'click') clickCount++;
      if (evt === 'keydown') keydownCount++;
    }
  };

  globalThis.document = {
    getElementById: (id) => (id === 'pricing-toggle' ? mockToggle : null)
  };

  initPricing();
  initPricing(); // Second call should be a no-op

  assert.equal(clickCount, 1, 'Event listeners should only be attached once on multiple init calls');
  assert.equal(keydownCount, 1, 'Keydown listeners should only be attached once');

  globalThis.document = originalDoc;
  _resetPricingInit();
});
