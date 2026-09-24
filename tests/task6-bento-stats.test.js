import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Task 6: CSS contains Bento grid, social proof, and stats layout definitions', () => {
  const css = fs.readFileSync('css/components.css', 'utf-8');

  // Bento grid classes
  assert.ok(css.includes('.bento-grid'), 'components.css must define .bento-grid');
  assert.ok(css.includes('.bento-card'), 'components.css must define .bento-card');
  assert.ok(css.includes('.bento-card--span-8'), 'components.css must define .bento-card--span-8');
  assert.ok(css.includes('.bento-card--span-4'), 'components.css must define .bento-card--span-4');
  assert.ok(css.includes('.bento-card__icon'), 'components.css must define .bento-card__icon');
  assert.ok(css.includes('.bento-card__title'), 'components.css must define .bento-card__title');
  assert.ok(css.includes('.bento-card__desc'), 'components.css must define .bento-card__desc');
  assert.ok(css.includes('.bento-card__visual'), 'components.css must define .bento-card__visual');
  assert.ok(css.includes('.treasury-row'), 'components.css must define .treasury-row');
  assert.ok(css.includes('flex-wrap: wrap'), 'treasury-row must have flex-wrap: wrap for ultra-small mobile screens');

  // Social proof classes
  assert.ok(css.includes('.social-proof'), 'components.css must define .social-proof');
  assert.ok(css.includes('.social-proof__heading'), 'components.css must define .social-proof__heading');
  assert.ok(css.includes('.social-proof__logos'), 'components.css must define .social-proof__logos');
  assert.ok(css.includes('.client-logo'), 'components.css must define .client-logo');
  assert.ok(css.includes('.trust-badges'), 'components.css must define .trust-badges');
  assert.ok(css.includes('.trust-badge-pill'), 'components.css must define .trust-badge-pill');

  // Stats counter classes
  assert.ok(css.includes('.stats-grid'), 'components.css must define .stats-grid');
  assert.ok(css.includes('.stat-card'), 'components.css must define .stat-card');
});

test('Task 6: index.html contains Social Proof, Bento Grid, and Stats Counter sections with Progressive Enhancement', () => {
  const html = fs.readFileSync('index.html', 'utf-8');

  // Social Proof Bar
  assert.ok(html.includes('class="social-proof"'), 'index.html must include .social-proof');
  assert.ok(html.includes('social-proof__heading'), 'index.html must include .social-proof__heading');
  assert.ok(html.includes('social-proof__logos'), 'index.html must include .social-proof__logos');
  assert.ok(html.includes('SOC2 Type II'), 'index.html must include SOC2 Type II compliance badge');
  assert.ok(html.includes('ISO 27001'), 'index.html must include ISO 27001 compliance badge');
  assert.ok(html.includes('PCI-DSS Level 1'), 'index.html must include PCI-DSS Level 1 compliance badge');

  // Bento Grid Section
  assert.ok(html.includes('id="features"'), 'index.html must include section with id="features"');
  assert.ok(html.includes('bento-grid'), 'index.html must include .bento-grid container');
  assert.ok(html.includes('Real-Time Multi-Currency Treasury'), 'Bento grid must include Multi-Currency Treasury capability');
  assert.ok(html.includes('AI Anomaly &amp; Fraud Shield') || html.includes('AI Anomaly & Fraud Shield'), 'Bento grid must include AI Anomaly & Fraud Shield capability');
  assert.ok(html.includes('Zero-Touch Ledger Reconciliation'), 'Bento grid must include Zero-Touch Ledger Reconciliation capability');
  assert.ok(html.includes('Developer-First Financial API'), 'Bento grid must include Developer-First Financial API capability');

  // Stats Counter Section with Progressive Enhancement default values
  assert.ok(html.includes('data-counter-target'), 'index.html must include elements with data-counter-target');
  assert.ok(html.includes('stats-grid'), 'index.html must include .stats-grid');
  assert.ok(html.includes('$48B+'), 'index.html must display $48B+ for progressive enhancement');
  assert.ok(html.includes('99.99%'), 'index.html must display 99.99% for progressive enhancement');
  assert.ok(html.includes('&lt;85ms') || html.includes('<85ms'), 'index.html must display <85ms for progressive enhancement');
  assert.ok(html.includes('140+'), 'index.html must display 140+ for progressive enhancement');
});

test('Task 6: js/modules/stats.js exports initStatsCounter and animates counters via IntersectionObserver', async () => {
  const { initStatsCounter, _resetStatsInit } = await import('../js/modules/stats.js');
  assert.equal(typeof initStatsCounter, 'function', 'initStatsCounter must be a function');

  // Test gracefully handling empty DOM
  const originalDoc = globalThis.document;
  globalThis.document = {
    querySelectorAll: () => []
  };

  assert.doesNotThrow(() => {
    initStatsCounter();
  }, 'initStatsCounter should not throw when no elements are found');

  // Mock DOM elements and IntersectionObserver
  const mockElements = [
    {
      attributes: {
        'data-counter-target': '48',
        'data-counter-prefix': '$',
        'data-counter-suffix': 'B+',
        'data-counter-decimals': '0'
      },
      getAttribute(name) { return this.attributes[name] || null; },
      textContent: '$48B+' // Progressive enhancement default in HTML
    },
    {
      attributes: {
        'data-counter-target': '99.99',
        'data-counter-prefix': '',
        'data-counter-suffix': '%',
        'data-counter-decimals': '2'
      },
      getAttribute(name) { return this.attributes[name] || null; },
      textContent: '99.99%' // Progressive enhancement default in HTML
    }
  ];

  globalThis.document = {
    querySelectorAll: (selector) => {
      if (selector === '[data-counter-target]') return mockElements;
      return [];
    }
  };

  let observerCallback = null;
  const observedElements = [];
  const unobservedElements = [];

  class MockIntersectionObserver {
    constructor(callback, options) {
      observerCallback = callback;
      this.options = options;
    }
    observe(el) {
      observedElements.push(el);
    }
    unobserve(el) {
      unobservedElements.push(el);
    }
    disconnect() {}
  }

  globalThis.IntersectionObserver = MockIntersectionObserver;

  // Mock performance.now and requestAnimationFrame
  const originalPerf = globalThis.performance;
  const originalRAF = globalThis.requestAnimationFrame;

  let rafQueue = [];
  globalThis.requestAnimationFrame = (fn) => {
    rafQueue.push(fn);
    return rafQueue.length;
  };

  let mockTime = 1000;
  globalThis.performance = {
    now: () => mockTime
  };

  try {
    initStatsCounter();

    assert.equal(observedElements.length, 2, 'All counter elements should be observed');

    // Idempotency test: repeated calls should not duplicate observers
    initStatsCounter();
    assert.equal(observedElements.length, 2, 'initStatsCounter() must be idempotent');

    // Simulate element 0 coming into viewport
    assert.ok(observerCallback, 'Observer callback must be registered');
    observerCallback([
      { target: mockElements[0], isIntersecting: true }
    ]);

    // Counter animation must begin from 0
    assert.equal(mockElements[0].textContent, '$0B+', 'Counter animation must begin at 0');
    assert.ok(unobservedElements.includes(mockElements[0]), 'Target must be unobserved once intersecting');

    // Fast-forward animation frames to complete animation
    mockTime = 1000 + 2000; // Duration is 1600ms
    while (rafQueue.length > 0) {
      const step = rafQueue.shift();
      step(mockTime);
    }
    assert.equal(mockElements[0].textContent, '$48B+', 'First element must animate to $48B+');

    // Simulate element 1 coming into viewport
    mockTime = 5000;
    observerCallback([
      { target: mockElements[1], isIntersecting: true }
    ]);
    assert.equal(mockElements[1].textContent, '0.00%', 'Second element animation must begin at 0.00%');

    mockTime = 5000 + 2000;
    while (rafQueue.length > 0) {
      const step = rafQueue.shift();
      step(mockTime);
    }
    assert.equal(mockElements[1].textContent, '99.99%', 'Second element must animate with decimals');

  } finally {
    if (typeof _resetStatsInit === 'function') {
      _resetStatsInit();
    }
    // Restore globals
    globalThis.document = originalDoc;
    globalThis.performance = originalPerf;
    globalThis.requestAnimationFrame = originalRAF;
    delete globalThis.IntersectionObserver;
  }
});

test('Task 6: js/modules/stats.js fallback handles missing target and undefined IntersectionObserver', async () => {
  const { initStatsCounter, _resetStatsInit } = await import('../js/modules/stats.js');
  _resetStatsInit();

  const originalDoc = globalThis.document;
  const originalIO = globalThis.IntersectionObserver;
  delete globalThis.IntersectionObserver;

  const fallbackElements = [
    {
      attributes: {},
      getAttribute(name) { return this.attributes[name] || null; },
      textContent: ''
    }
  ];

  globalThis.document = {
    querySelectorAll: (selector) => selector === '[data-counter-target]' ? fallbackElements : []
  };

  try {
    initStatsCounter();
    assert.equal(fallbackElements[0].textContent, '0', 'Fallback should default to 0 when data-counter-target is missing');
  } finally {
    _resetStatsInit();
    globalThis.document = originalDoc;
    if (originalIO) globalThis.IntersectionObserver = originalIO;
  }
});
