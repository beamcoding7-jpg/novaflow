import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Task 11: End-to-End file completeness and integrity audit', () => {
  const html = fs.readFileSync('index.html', 'utf-8');

  // Verify all interactive IDs exist in HTML
  const criticalIds = [
    'dashboard-balance',
    'dashboard-chart',
    'calc-slider-volume',
    'calc-slider-hours',
    'calc-annual-savings',
    'pricing-toggle',
    'price-starter',
    'price-scale',
    'demo-modal',
    'demo-form'
  ];

  for (const id of criticalIds) {
    assert.ok(html.includes(`id="${id}"`), `HTML must contain element with id="${id}"`);
  }

  // Verify WAI-ARIA attributes
  assert.ok(html.includes('role="dialog"'), 'HTML must include role="dialog"');
  assert.ok(html.includes('aria-modal="true"'), 'HTML must include aria-modal="true"');
  assert.ok(html.includes('aria-expanded'), 'HTML must include aria-expanded');
});

test('Task 11: All referenced CSS stylesheets exist and have non-zero size', () => {
  const html = fs.readFileSync('index.html', 'utf-8');
  const cssMatches = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/g)];

  assert.ok(cssMatches.length >= 8, 'HTML should reference at least 8 stylesheets');

  for (const match of cssMatches) {
    const cssPath = match[1];
    if (cssPath.startsWith('http')) continue;
    assert.ok(fs.existsSync(cssPath), `CSS file must exist: ${cssPath}`);
    const stats = fs.statSync(cssPath);
    assert.ok(stats.size > 0, `CSS file must not be empty: ${cssPath}`);
  }
});

test('Task 11: Main entry script and all application JS modules exist', () => {
  const html = fs.readFileSync('index.html', 'utf-8');
  assert.ok(
    html.includes('type="module"') && html.includes('src="js/main.js"'),
    'index.html must load js/main.js as an ES module'
  );

  const requiredModules = [
    'js/main.js',
    'js/core/event-bus.js',
    'js/core/state.js',
    'js/utils/formatters.js',
    'js/utils/chart-engine.js',
    'js/modules/theme.js',
    'js/modules/navigation.js',
    'js/modules/dashboard.js',
    'js/modules/stats.js',
    'js/modules/calculator.js',
    'js/modules/pricing.js',
    'js/modules/accordion.js',
    'js/modules/modal.js'
  ];

  for (const mod of requiredModules) {
    assert.ok(fs.existsSync(mod), `Required module file must exist: ${mod}`);
    const stats = fs.statSync(mod);
    assert.ok(stats.size > 0, `Module file must not be empty: ${mod}`);
  }
});

test('Task 11: Semantic HTML5 structure and critical sections are complete', () => {
  const html = fs.readFileSync('index.html', 'utf-8');

  // Verify semantic landmarks
  assert.ok(html.includes('<header class="navbar"'), 'HTML must include semantic navbar header');
  assert.ok(html.includes('<nav class="navbar__nav"'), 'HTML must include primary nav');
  assert.ok(html.includes('<footer class="footer"'), 'HTML must include semantic footer');

  // Verify critical landing page sections
  const sectionIds = ['features', 'calculator', 'pricing', 'faq'];
  for (const id of sectionIds) {
    assert.ok(
      html.includes(`id="${id}"`),
      `HTML must contain major landmark section id="${id}" for navbar linking`
    );
  }
});

test('Task 11: Accessibility attributes verification (WAI-ARIA, labels, and roles)', () => {
  const html = fs.readFileSync('index.html', 'utf-8');

  // Navigation & Drawer
  assert.ok(html.includes('aria-controls="mobile-drawer"'), 'Mobile toggle must have aria-controls');
  assert.ok(html.includes('id="mobile-drawer"'), 'Mobile drawer must exist');

  // Theme toggle
  assert.ok(html.includes('data-action="toggle-theme"'), 'Theme toggle button must be present');
  assert.ok(html.includes('aria-label="Switch to dark mode"') || html.includes('aria-label="Toggle color theme"'), 'Theme toggle must have accessible aria-label');

  // Dashboard Tablist
  assert.ok(html.includes('role="tablist"'), 'Dashboard must contain role="tablist"');
  assert.ok(html.includes('role="tab"'), 'Dashboard timeframe buttons must have role="tab"');

  // Pricing Switcher
  assert.ok(html.includes('role="switch"'), 'Pricing billing switch must have role="switch"');
  assert.ok(html.includes('aria-checked='), 'Pricing switch must have aria-checked attribute');

  // Accordion
  assert.ok(html.includes('aria-controls="faq-answer-'), 'Accordion triggers must have aria-controls');

  // Toast container
  assert.ok(html.includes('aria-live="polite"'), 'Toast container must have aria-live="polite"');
});
