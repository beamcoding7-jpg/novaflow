# NovaFlow FinTech SaaS Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, senior-crafted FinTech SaaS landing page for "NovaFlow" using pure HTML5, CSS3, and ES6+ Vanilla JavaScript with zero third-party framework runtime dependencies.

**Architecture:** Modular architecture with dedicated CSS design tokens and component sheets, paired with native ES6 JavaScript modules coordinated by a decoupled EventTarget PubSub event bus and central reactive state store. Features a custom vanilla SVG cubic bezier chart engine, CSS Grid smooth accordion, focus-trapped modal dialog, and zero-FOUC theme switcher.

**Tech Stack:** Semantic HTML5, Modular CSS3 (Custom Properties, Grid, Flexbox), Vanilla JavaScript (ES6 Modules), Node.js (for headless automated unit testing).

**Spec:** `docs/superpowers/specs/2026-09-24-novaflow-fintech-landing-page-design.md`

## Global Constraints

- Tech Stack: Pure HTML5, CSS3, and Vanilla JavaScript. Zero external runtime UI/charting dependencies (No React, No Tailwind, No Chart.js).
- Design Direction: Clean Corporate FinTech (Light-first style of Wise/Revolut) with complete Dark Mode parity (Midnight Obsidian).
- Typography: Inter / system sans-serif font stack with tabular numeric figures for financial data.
- Accessibility: WCAG 2.1 AA compliant contrast, full keyboard navigation, WAI-ARIA attributes, and `prefers-reduced-motion` support.
- File Protocol & Server: Native ES6 modules (`type="module"`) tested via standard HTTP local server (`python3 -m http.server 3000` or Node.js).
- Directory Root: `/home/boriphat/Projects/novaflow`.

---

### Task 1: Project Foundation, CSS Design Tokens & Base Styles

**Files:**
- Create: `index.html`
- Create: `css/tokens.css`
- Create: `css/base.css`
- Create: `css/layout.css`
- Create: `css/utilities.css`
- Test: `tests/task1-foundation.test.js`

**Interfaces:**
- Consumes: Nothing
- Produces: CSS custom properties (`--bg-primary`, `--text-primary`, `--accent-primary`, etc.), responsive container classes (`.container`, `.grid-12`), and zero-FOUC inline hydration script in `index.html`.

- [ ] **Step 1: Write the automated test to verify foundation files and tokens**

Create `tests/task1-foundation.test.js`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve('.');

test('Task 1: Foundation files exist and contain required tokens', () => {
  const requiredFiles = [
    'index.html',
    'css/tokens.css',
    'css/base.css',
    'css/layout.css',
    'css/utilities.css'
  ];

  for (const file of requiredFiles) {
    assert.ok(fs.existsSync(path.join(rootDir, file)), `File ${file} should exist`);
  }

  const tokens = fs.readFileSync(path.join(rootDir, 'css/tokens.css'), 'utf-8');
  assert.ok(tokens.includes('--bg-primary'), 'tokens.css must define --bg-primary');
  assert.ok(tokens.includes('--text-primary'), 'tokens.css must define --text-primary');
  assert.ok(tokens.includes('--accent-primary'), 'tokens.css must define --accent-primary');
  assert.ok(tokens.includes('[data-theme="dark"]'), 'tokens.css must define dark theme overrides');

  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(html.includes('novaflow-theme'), 'index.html must include zero-FOUC theme script');
  assert.ok(html.includes('css/tokens.css'), 'index.html must link tokens.css');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/task1-foundation.test.js`
Expected: FAIL (files do not exist yet)

- [ ] **Step 3: Implement tokens.css, base.css, layout.css, utilities.css and index.html shell**

Create `css/tokens.css`:
```css
:root {
  /* Color Palette - Primitives */
  --blue-50: #eff6ff;
  --blue-100: #dbeafe;
  --blue-200: #bfdbfe;
  --blue-400: #60a5fa;
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --blue-700: #1d4ed8;
  --blue-900: #1e3a8a;

  --emerald-50: #ecfdf5;
  --emerald-100: #d1fae5;
  --emerald-400: #34d399;
  --emerald-500: #10b981;
  --emerald-600: #059669;

  --slate-50: #f8fafc;
  --slate-100: #f1f5f9;
  --slate-200: #e2e8f0;
  --slate-300: #cbd5e1;
  --slate-400: #94a3b8;
  --slate-500: #64748b;
  --slate-600: #475569;
  --slate-700: #334155;
  --slate-800: #1e293b;
  --slate-900: #0f172a;
  --slate-950: #020617;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Border Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Container */
  --container-max: 1200px;
}

/* Light Theme (Default: Clean Corporate FinTech) */
[data-theme="light"], :root:not([data-theme="dark"]) {
  color-scheme: light;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --bg-card: #ffffff;
  --bg-card-hover: #fcfdfe;
  --border-subtle: #f1f5f9;
  --border-default: #e2e8f0;
  --border-strong: #cbd5e1;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --accent-primary: #2563eb;
  --accent-primary-hover: #1d4ed8;
  --accent-secondary: #10b981;
  --accent-surface: #eff6ff;
  --nav-backdrop: rgba(255, 255, 255, 0.85);
  --shadow-sm: 0 1px 2px 0 rgba(15, 23, 42, 0.05);
  --shadow-md: 0 4px 12px -2px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 12px 24px -4px rgba(15, 23, 42, 0.08);
  --shadow-glow: 0 0 20px -5px rgba(37, 99, 235, 0.2);
}

/* Dark Theme (Midnight Obsidian) */
[data-theme="dark"] {
  color-scheme: dark;
  --bg-primary: #080d1a;
  --bg-secondary: #0f172a;
  --bg-tertiary: #1e293b;
  --bg-card: #111b2e;
  --bg-card-hover: #16223b;
  --border-subtle: #1e293b;
  --border-default: #26354f;
  --border-strong: #3b4e70;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --accent-primary: #3b82f6;
  --accent-primary-hover: #60a5fa;
  --accent-secondary: #34d399;
  --accent-surface: rgba(59, 130, 246, 0.15);
  --nav-backdrop: rgba(8, 13, 26, 0.85);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 12px 24px -4px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 24px -4px rgba(59, 130, 246, 0.3);
}
```

Create `css/base.css`:
```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.5;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  transition: background-color var(--transition-normal), color var(--transition-normal);
  overflow-x: hidden;
}

img, svg {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

button, input, select, textarea {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  border: none;
  background: none;
}

:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 3px;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Create `css/layout.css`:
```css
.container {
  width: 100%;
  max-width: var(--container-max);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-6);
  padding-right: var(--space-6);
}

.section {
  padding-top: var(--space-20);
  padding-bottom: var(--space-20);
  position: relative;
}

.section--alt {
  background-color: var(--bg-secondary);
}

.section-header {
  text-align: center;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: var(--space-12);
}

.section-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent-primary);
  background: var(--accent-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-4);
}

.section-title {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  letter-spacing: -0.025em;
}

.section-desc {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
}
```

Create `css/utilities.css`:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.flex { display: flex; }
.flex-col { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.gap-2 { gap: var(--space-2); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }

.w-full { width: 100%; }
```

Create `index.html` shell with head script and structure:
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NovaFlow — Intelligent Financial Operations & Global Treasury Platform</title>
  <meta name="description" content="Automate reconciliation, execute instant cross-border payouts, and monitor global liquidity in real-time. Built for high-growth enterprises.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <script>
    (function() {
      const saved = localStorage.getItem('novaflow-theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/modules/hero-dashboard.css">
  <link rel="stylesheet" href="css/modules/roi-calculator.css">
  <link rel="stylesheet" href="css/modules/pricing.css">
  <link rel="stylesheet" href="css/modules/accordion.css">
  <link rel="stylesheet" href="css/modules/modal-toast.css">
  <link rel="stylesheet" href="css/utilities.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/task1-foundation.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html css/ tests/task1-foundation.test.js
git commit -m "feat: setup project foundation, design tokens and base styles"
```

---

### Task 2: Core Utilities, Event Bus, State Store & Formatters

**Files:**
- Create: `js/core/event-bus.js`
- Create: `js/core/state.js`
- Create: `js/utils/formatters.js`
- Test: `tests/task2-core.test.js`

**Interfaces:**
- Consumes: Nothing
- Produces:
  - `eventBus`: `emit(event, detail)`, `on(event, callback)`, `off(event, callback)`
  - `state`: `get(key)`, `set(key, value)`, `subscribe(key, callback)`
  - `formatters`: `formatCurrency(amount, currency = 'USD')`, `formatCompactNumber(num)`, `formatPercent(decimal)`

- [ ] **Step 1: Write automated tests for core utilities**

Create `tests/task2-core.test.js`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventBus } from '../js/core/event-bus.js';
import { StateStore } from '../js/core/state.js';
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

test('StateStore gets, sets, and notifies subscribers', () => {
  const state = new StateStore({ theme: 'light', timeframe: '7D' });
  assert.equal(state.get('theme'), 'light');
  let notifiedTheme = null;
  state.subscribe('theme', (val) => { notifiedTheme = val; });
  state.set('theme', 'dark');
  assert.equal(state.get('theme'), 'dark');
  assert.equal(notifiedTheme, 'dark');
});

test('Formatters format currency, compact numbers, and percentages correctly', () => {
  assert.equal(formatCurrency(12458920.40), '$12,458,920.40');
  assert.equal(formatCurrency(50000, 'USD', 0), '$50,000');
  assert.equal(formatCompactNumber(1450000), '1.45M');
  assert.equal(formatPercent(0.148), '+14.8%');
  assert.equal(formatPercent(-0.032), '-3.2%');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/task2-core.test.js`
Expected: FAIL (modules not created)

- [ ] **Step 3: Implement EventBus, StateStore, and Formatters**

Create `js/core/event-bus.js`:
```javascript
export class EventBus {
  constructor() {
    this.target = new EventTarget();
  }

  emit(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    this.target.dispatchEvent(event);
  }

  on(eventName, callback) {
    const listener = (event) => callback(event.detail);
    callback._wrapped = listener;
    this.target.addEventListener(eventName, listener);
  }

  off(eventName, callback) {
    const listener = callback._wrapped || callback;
    this.target.removeEventListener(eventName, listener);
  }
}

export const eventBus = new EventBus();
```

Create `js/core/state.js`:
```javascript
export class StateStore {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = new Map();
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    if (this.state[key] === value) return;
    const prev = this.state[key];
    this.state[key] = value;
    if (this.listeners.has(key)) {
      for (const listener of this.listeners.get(key)) {
        listener(value, prev);
      }
    }
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key).delete(callback);
  }
}

export const state = new StateStore({
  theme: 'light',
  timeframe: '7D',
  volume: 1500000,
  manualHours: 80,
  billingPeriod: 'monthly',
  isModalOpen: false
});
```

Create `js/utils/formatters.js`:
```javascript
export function formatCurrency(amount, currency = 'USD', decimals = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
}

export function formatCompactNumber(num) {
  if (Math.abs(num) >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + 'B';
  }
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export function formatPercent(decimal, showSign = true) {
  const percent = decimal * 100;
  const formatted = percent.toFixed(1) + '%';
  if (showSign && percent > 0) return '+' + formatted;
  return formatted;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/task2-core.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add js/core/ js/utils/ tests/task2-core.test.js
git commit -m "feat: implement event bus, state store, and financial formatters"
```

---

### Task 3: Custom Vanilla SVG Chart Engine

**Files:**
- Create: `js/utils/chart-engine.js`
- Test: `tests/task3-chart.test.js`

**Interfaces:**
- Consumes: Raw numerical data arrays `[{ x: number, y: number, label: string }]`
- Produces: `renderAreaChart(options)` returning `{ pathD, areaD, points, svgString }` with smooth cubic bezier curve coordinates.

- [ ] **Step 1: Write automated test for SVG chart engine**

Create `tests/task3-chart.test.js`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateBezierCurvePath, buildAreaChartSvg } from '../js/utils/chart-engine.js';

test('generateBezierCurvePath computes valid cubic bezier SVG path commands', () => {
  const points = [
    { x: 0, y: 100 },
    { x: 50, y: 40 },
    { x: 100, y: 80 }
  ];
  const pathD = generateBezierCurvePath(points);
  assert.ok(pathD.startsWith('M 0,100'), 'Path must begin with MoveTo first point');
  assert.ok(pathD.includes('C'), 'Path must contain Cubic Bezier commands (C)');
});

test('buildAreaChartSvg returns complete SVG with gradient and stroke path', () => {
  const data = [10, 25, 45, 30, 60, 85, 95];
  const { strokeD, fillD, svgMarkup } = buildAreaChartSvg({
    data,
    width: 600,
    height: 240,
    gradientId: 'test-chart-gradient'
  });

  assert.ok(strokeD.startsWith('M'), 'strokeD should be a valid SVG path');
  assert.ok(fillD.endsWith('Z'), 'fillD must close path with Z');
  assert.ok(svgMarkup.includes('<svg'), 'svgMarkup must be valid svg string');
  assert.ok(svgMarkup.includes('test-chart-gradient'), 'svgMarkup must include specified gradient');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/task3-chart.test.js`
Expected: FAIL

- [ ] **Step 3: Implement Vanilla SVG Chart Engine**

Create `js/utils/chart-engine.js`:
```javascript
/**
 * Calculates cubic bezier control points between sequential coordinates
 */
export function generateBezierCurvePath(points, smoothing = 0.2) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  const line = (pointA, pointB) => {
    const lengthX = pointB.x - pointA.x;
    const lengthY = pointB.y - pointA.y;
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    };
  };

  const controlPoint = (current, previous, next, reverse) => {
    const p = previous || current;
    const n = next || current;
    const l = line(p, n);
    const angle = l.angle + (reverse ? Math.PI : 0);
    const length = l.length * smoothing;
    const x = current.x + Math.cos(angle) * length;
    const y = current.y + Math.sin(angle) * length;
    return { x, y };
  };

  return points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    const cps = controlPoint(a[i - 1], a[i - 2], point, false);
    const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
    return `${acc} C ${cps.x.toFixed(1)},${cps.y.toFixed(1)} ${cpe.x.toFixed(1)},${cpe.y.toFixed(1)} ${point.x.toFixed(1)},${point.y.toFixed(1)}`;
  }, '');
}

/**
 * Builds area and stroke paths mapped to SVG viewport
 */
export function buildAreaChartSvg({
  data,
  width = 600,
  height = 240,
  padding = { top: 20, right: 20, bottom: 30, left: 20 },
  gradientId = 'chart-gradient',
  strokeColor = 'var(--accent-primary)',
  accentColor = 'var(--accent-secondary)'
}) {
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minVal = Math.min(...data) * 0.95;
  const maxVal = Math.max(...data) * 1.05;
  const range = maxVal - minVal || 1;

  const points = data.map((val, index) => {
    const x = padding.left + (index / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((val - minVal) / range) * chartHeight;
    return { x, y, value: val };
  });

  const strokeD = generateBezierCurvePath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const groundY = height - padding.bottom;
  const fillD = `${strokeD} L ${lastPoint.x.toFixed(1)},${groundY} L ${firstPoint.x.toFixed(1)},${groundY} Z`;

  const svgMarkup = `
    <svg viewBox="0 0 ${width} ${height}" class="novaflow-chart-svg" preserveAspectRatio="none" role="img" aria-label="Interactive Financial Analytics Chart">
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.32" />
          <stop offset="85%" stop-color="${strokeColor}" stop-opacity="0.02" />
          <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path class="chart-area-fill" d="${fillD}" fill="url(#${gradientId})" />
      <path class="chart-line-stroke" d="${strokeD}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <g class="chart-points">
        ${points.map((p, idx) => `
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" class="chart-dot" data-index="${idx}" data-val="${p.value}" fill="var(--bg-primary)" stroke="${strokeColor}" stroke-width="2" />
        `).join('')}
      </g>
    </svg>
  `;

  return { points, strokeD, fillD, svgMarkup };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/task3-chart.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add js/utils/chart-engine.js tests/task3-chart.test.js
git commit -m "feat: implement vanilla SVG bezier curve chart engine"
```

---

### Task 4: UI Components, Theme Manager & Sticky Navigation Bar

**Files:**
- Create: `css/components.css`
- Create: `js/modules/theme.js`
- Create: `js/modules/navigation.js`
- Modify: `index.html` (add Header & Navigation markup)
- Test: `tests/task4-nav-theme.test.js`

**Interfaces:**
- Consumes: `state`, `eventBus`
- Produces:
  - Theme switching logic with storage persistence and instant toggle.
  - Sticky glassmorphic navbar with mobile hamburger menu and scroll spy.

- [ ] **Step 1: Write test for theme switching and navigation logic**

Create `tests/task4-nav-theme.test.js`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Task 4: Component CSS defines button, badge, and navbar styles', () => {
  const css = fs.readFileSync('css/components.css', 'utf-8');
  assert.ok(css.includes('.btn-primary'), 'components.css must define .btn-primary');
  assert.ok(css.includes('.badge'), 'components.css must define .badge');
  assert.ok(css.includes('.navbar'), 'components.css must define .navbar');
  assert.ok(css.includes('.theme-toggle'), 'components.css must define .theme-toggle');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/task4-nav-theme.test.js`
Expected: FAIL

- [ ] **Step 3: Implement components.css, theme.js, navigation.js and update index.html**

Create `css/components.css`:
```css
/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-primary {
  background-color: var(--accent-primary);
  color: #ffffff;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  background-color: var(--accent-primary-hover);
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}

.btn-secondary:hover {
  background-color: var(--border-default);
  border-color: var(--border-strong);
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}

.btn-outline:hover {
  background-color: var(--accent-surface);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-full);
}

.badge-success {
  background-color: var(--emerald-50);
  color: var(--emerald-600);
  border: 1px solid var(--emerald-400);
}

[data-theme="dark"] .badge-success {
  background-color: rgba(16, 185, 129, 0.15);
  color: var(--emerald-400);
  border-color: rgba(52, 211, 153, 0.3);
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--nav-backdrop);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-default);
  transition: background-color var(--transition-normal), border-color var(--transition-normal);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.25rem;
}

.navbar__logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.navbar__logo-icon {
  width: 2rem;
  height: 2rem;
  color: var(--accent-primary);
}

.navbar__nav {
  display: none;
}

@media (min-width: 860px) {
  .navbar__nav {
    display: flex;
    align-items: center;
    gap: var(--space-8);
  }
}

.navbar__link {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.navbar__link:hover, .navbar__link.active {
  color: var(--accent-primary);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.375rem;
  height: 2.375rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  background-color: var(--bg-card);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  color: var(--text-primary);
  border-color: var(--border-strong);
  background-color: var(--bg-tertiary);
}

.theme-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
}

.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.375rem;
  height: 2.375rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
}

@media (min-width: 860px) {
  .mobile-menu-btn {
    display: none;
  }
}

.mobile-drawer {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-normal);
}

.mobile-drawer.open {
  opacity: 1;
  pointer-events: auto;
}

.mobile-drawer__panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(85vw, 340px);
  background-color: var(--bg-primary);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  transform: translateX(100%);
  transition: transform var(--transition-normal);
  box-shadow: var(--shadow-xl);
}

.mobile-drawer.open .mobile-drawer__panel {
  transform: translateX(0);
}
```

Create `js/modules/theme.js`:
```javascript
import { state } from '../core/state.js';
import { eventBus } from '../core/event-bus.js';

export function initTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  state.set('theme', currentTheme);

  const toggleButtons = document.querySelectorAll('[data-action="toggle-theme"]');

  function updateIcons(theme) {
    toggleButtons.forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
          btn.setAttribute('aria-label', 'Switch to light mode');
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
          btn.setAttribute('aria-label', 'Switch to dark mode');
        }
      }
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('novaflow-theme', theme);
    state.set('theme', theme);
    updateIcons(theme);
    eventBus.emit('theme-changed', { theme });
  }

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newTheme = state.get('theme') === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  updateIcons(currentTheme);

  // OS theme change listener
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('novaflow-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}
```

Create `js/modules/navigation.js`:
```javascript
export function initNavigation() {
  const mobileToggle = document.querySelector('[data-action="toggle-mobile-menu"]');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawerBtn = document.querySelector('[data-action="close-mobile-menu"]');
  const navLinks = document.querySelectorAll('.mobile-drawer__nav a');

  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Scroll spy active indicator
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.navbar__link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  }, { passive: true });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/task4-nav-theme.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add css/components.css js/modules/theme.js js/modules/navigation.js tests/task4-nav-theme.test.js
git commit -m "feat: implement components css, theme switcher, and navigation modules"
```

---

### Task 5: Hero Section & Live Dashboard Preview Module

**Files:**
- Create: `css/modules/hero-dashboard.css`
- Create: `js/modules/dashboard.js`
- Modify: `index.html` (integrate Hero & Dashboard preview section)
- Test: `tests/task5-dashboard.test.js`

**Interfaces:**
- Consumes: `state`, `eventBus`, `formatCurrency`, `formatPercent`, `buildAreaChartSvg`
- Produces: Live Interactive Hero Dashboard Card with dynamic 7D, 30D, and 1Y timeframe dataset switching and SVG animation.

- [ ] **Step 1: Write test for dashboard preview datasets and calculations**

Create `tests/task5-dashboard.test.js`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dashboardDatasets } from '../js/modules/dashboard.js';

test('dashboardDatasets provides correct datasets for 7D, 30D, 1Y', () => {
  assert.ok(dashboardDatasets['7D'], '7D dataset must exist');
  assert.ok(dashboardDatasets['30D'], '30D dataset must exist');
  assert.ok(dashboardDatasets['1Y'], '1Y dataset must exist');

  assert.equal(dashboardDatasets['7D'].balance, 12458920.40);
  assert.equal(dashboardDatasets['7D'].growth, 0.148);
  assert.equal(dashboardDatasets['7D'].chartData.length, 7);
  assert.equal(dashboardDatasets['30D'].chartData.length, 12);
  assert.equal(dashboardDatasets['1Y'].chartData.length, 12);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/task5-dashboard.test.js`
Expected: FAIL

- [ ] **Step 3: Implement hero-dashboard.css and dashboard.js**

Create `css/modules/hero-dashboard.css`:
```css
/* Hero Section */
.hero {
  padding-top: var(--space-16);
  padding-bottom: var(--space-20);
  overflow: hidden;
  position: relative;
}

.hero__badge-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-6);
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.375rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-full);
  background-color: var(--accent-surface);
  border: 1px solid var(--border-default);
  color: var(--accent-primary);
  box-shadow: var(--shadow-sm);
}

.hero__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.035em;
  text-align: center;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: var(--space-6);
}

.hero__subtitle {
  font-size: clamp(1.125rem, 2vw, 1.3125rem);
  color: var(--text-secondary);
  line-height: 1.6;
  text-align: center;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: var(--space-8);
}

.hero__cta-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.hero__microcopy {
  text-align: center;
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: var(--space-16);
}

/* Interactive Dashboard Card */
.dashboard-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl), var(--shadow-glow);
  padding: var(--space-6);
  position: relative;
  transition: all var(--transition-normal);
}

@media (min-width: 768px) {
  .dashboard-card {
    padding: var(--space-8);
  }
}

.dashboard-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

@media (min-width: 640px) {
  .dashboard-card__header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.dashboard-card__balance-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: var(--space-1);
}

.dashboard-card__balance-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
}

.dashboard-card__balance-val {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-primary);
}

.timeframe-selector {
  display: inline-flex;
  background-color: var(--bg-tertiary);
  padding: 0.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.timeframe-btn {
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.timeframe-btn.active {
  background-color: var(--bg-card);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.dashboard-card__chart-container {
  width: 100%;
  height: 240px;
  margin-bottom: var(--space-6);
  position: relative;
}

.novaflow-chart-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.chart-line-stroke {
  transition: stroke 0.3s ease;
}

.chart-dot {
  cursor: pointer;
  transition: r 0.2s ease;
}

.chart-dot:hover {
  r: 6;
}

/* Quick Metrics Grid */
.dashboard-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-4);
  border-top: 1px solid var(--border-default);
  padding-top: var(--space-6);
}

.kpi-item {
  display: flex;
  flex-direction: column;
}

.kpi-item__label {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: var(--space-1);
}

.kpi-item__val {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}
```

Create `js/modules/dashboard.js`:
```javascript
import { state } from '../core/state.js';
import { eventBus } from '../core/event-bus.js';
import { formatCurrency, formatPercent } from '../utils/formatters.js';
import { buildAreaChartSvg } from '../utils/chart-engine.js';

export const dashboardDatasets = {
  '7D': {
    balance: 12458920.40,
    growth: 0.148,
    reconciled: '99.4%',
    latency: '1.2s',
    currencies: '38',
    chartData: [8400000, 9200000, 9800000, 10500000, 11200000, 11900000, 12458920]
  },
  '30D': {
    balance: 48912300.00,
    growth: 0.284,
    reconciled: '99.7%',
    latency: '1.1s',
    currencies: '42',
    chartData: [32000000, 34500000, 36000000, 39000000, 41200000, 43000000, 44100000, 45800000, 46900000, 47800000, 48200000, 48912300]
  },
  '1Y': {
    balance: 184500000.00,
    growth: 1.421,
    reconciled: '99.9%',
    latency: '0.9s',
    currencies: '54',
    chartData: [62000000, 71000000, 84000000, 98000000, 110000000, 124000000, 138000000, 149000000, 160000000, 169000000, 178000000, 184500000]
  }
};

export function initDashboard() {
  const balanceEl = document.getElementById('dashboard-balance');
  const growthBadgeEl = document.getElementById('dashboard-growth');
  const chartWrapper = document.getElementById('dashboard-chart');
  const timeframeBtns = document.querySelectorAll('[data-timeframe]');
  const kpiReconciled = document.getElementById('kpi-reconciled');
  const kpiLatency = document.getElementById('kpi-latency');
  const kpiCurrencies = document.getElementById('kpi-currencies');

  function render(timeframe) {
    const data = dashboardDatasets[timeframe];
    if (!data) return;

    if (balanceEl) balanceEl.textContent = formatCurrency(data.balance);
    if (growthBadgeEl) growthBadgeEl.textContent = formatPercent(data.growth);
    if (kpiReconciled) kpiReconciled.textContent = data.reconciled;
    if (kpiLatency) kpiLatency.textContent = data.latency;
    if (kpiCurrencies) kpiCurrencies.textContent = data.currencies;

    timeframeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-timeframe') === timeframe);
    });

    if (chartWrapper) {
      const { svgMarkup } = buildAreaChartSvg({
        data: data.chartData,
        width: 600,
        height: 240,
        gradientId: `hero-chart-gradient-${timeframe}`
      });
      chartWrapper.innerHTML = svgMarkup;
    }

    state.set('timeframe', timeframe);
    eventBus.emit('timeframe-changed', { timeframe, data });
  }

  timeframeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tf = btn.getAttribute('data-timeframe');
      render(tf);
    });
  });

  // Initial render
  render('7D');

  // Re-render chart on theme change to update CSS variable colors
  eventBus.on('theme-changed', () => {
    render(state.get('timeframe') || '7D');
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/task5-dashboard.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add css/modules/hero-dashboard.css js/modules/dashboard.js tests/task5-dashboard.test.js
git commit -m "feat: implement hero section and live dashboard preview module"
```

---

### Task 6: Bento Grid Features, Social Proof & Stats Counter

**Files:**
- Create: `js/modules/stats.js`
- Modify: `css/components.css` (add Bento Grid & Social Proof styles)
- Modify: `index.html` (add Social Proof bar and Bento Grid section)
- Test: `tests/task6-bento-stats.test.js`

**Interfaces:**
- Consumes: Nothing
- Produces: `initStatsCounter()` using `IntersectionObserver` with smooth ease-out numeric animation.

- [ ] **Step 1: Write test for stats counter module**

Create `tests/task6-bento-stats.test.js`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Task 6: CSS contains Bento grid layout definitions', () => {
  const css = fs.readFileSync('css/components.css', 'utf-8');
  assert.ok(css.includes('.bento-grid'), 'components.css must define .bento-grid');
  assert.ok(css.includes('.bento-card'), 'components.css must define .bento-card');
  assert.ok(css.includes('.social-proof'), 'components.css must define .social-proof');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/task6-bento-stats.test.js`
Expected: FAIL

- [ ] **Step 3: Implement Bento Grid CSS, Social Proof styles and stats.js**

Add to `css/components.css`:
```css
/* Social Proof Bar */
.social-proof {
  padding-top: var(--space-8);
  padding-bottom: var(--space-12);
  border-bottom: 1px solid var(--border-default);
}

.social-proof__heading {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: var(--space-6);
}

.social-proof__logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-10);
  opacity: 0.75;
}

.client-logo {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: -0.02em;
}

.trust-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.trust-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.3125rem 0.75rem;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(12, 1fr);
  }
}

.bento-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.bento-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border-strong);
}

.bento-card--span-8 {
  grid-column: span 12;
}

.bento-card--span-4 {
  grid-column: span 12;
}

@media (min-width: 768px) {
  .bento-card--span-8 {
    grid-column: span 8;
  }
  .bento-card--span-4 {
    grid-column: span 4;
  }
}

.bento-card__icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-md);
  background: var(--accent-surface);
  color: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-6);
}

.bento-card__title {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  letter-spacing: -0.02em;
}

.bento-card__desc {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.bento-card__visual {
  margin-top: var(--space-6);
  padding: var(--space-4);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
}
```

Create `js/modules/stats.js`:
```javascript
export function initStatsCounter() {
  const statElements = document.querySelectorAll('[data-counter-target]');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  statElements.forEach(el => observer.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-counter-target'));
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
    const duration = 1600;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;

      el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/task6-bento-stats.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add css/components.css js/modules/stats.js tests/task6-bento-stats.test.js
git commit -m "feat: implement bento grid showcase and animated stats counter"
```

---

### Task 7: Interactive ROI & Savings Simulator

**Files:**
- Create: `css/modules/roi-calculator.css`
- Create: `js/modules/calculator.js`
- Modify: `index.html` (integrate ROI Calculator section)
- Test: `tests/task7-calculator.test.js`

**Interfaces:**
- Consumes: `state`, `eventBus`, `formatCurrency`
- Produces: `calculateSavings({ volume, hours })` and dual range-slider real-time sync with CSS `--slider-progress`.

- [ ] **Step 1: Write test for ROI calculation algorithm**

Create `tests/task7-calculator.test.js`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateRoi } from '../js/modules/calculator.js';

test('calculateRoi correctly computes annual savings and hours saved', () => {
  const result = calculateRoi({ volume: 1500000, manualHours: 80 });

  // Manual cost = 80 * 65 * 12 = 62,400
  // Manual error leakage = 1,500,000 * 0.003 = 4,500
  // Annual savings = (62,400 * 0.85) + (4,500 * 0.75) = 53,040 + 3,375 = 56,415
  assert.equal(result.annualSavings, 56415);
  assert.equal(result.hoursSavedMonthly, 68);
  assert.ok(result.paybackDays > 0 && result.paybackDays < 100);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/task7-calculator.test.js`
Expected: FAIL

- [ ] **Step 3: Implement roi-calculator.css and calculator.js**

Create `css/modules/roi-calculator.css`:
```css
.calculator-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--space-8);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-10);
}

@media (min-width: 900px) {
  .calculator-card {
    grid-template-columns: 1.2fr 1fr;
    padding: var(--space-10);
  }
}

.calc-control {
  margin-bottom: var(--space-8);
}

.calc-control__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.calc-control__label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.calc-control__val {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--accent-primary);
  font-family: var(--font-mono);
}

/* Custom Range Slider */
.calc-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: var(--radius-full);
  background: linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) var(--slider-progress, 50%), var(--border-default) var(--slider-progress, 50%), var(--border-default) 100%);
  outline: none;
  cursor: pointer;
}

.calc-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid var(--accent-primary);
  box-shadow: var(--shadow-md);
  cursor: grab;
  transition: transform var(--transition-fast);
}

.calc-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.calc-slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid var(--accent-primary);
  box-shadow: var(--shadow-md);
  cursor: grab;
}

/* Results Display Box */
.calc-results {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.calc-results__primary {
  margin-bottom: var(--space-6);
}

.calc-results__label {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: var(--space-1);
}

.calc-results__headline {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 800;
  color: var(--emerald-500);
  letter-spacing: -0.03em;
}

.calc-metrics-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  border-top: 1px solid var(--border-default);
  padding-top: var(--space-6);
  margin-bottom: var(--space-6);
}

.calc-metric-box__val {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}
```

Create `js/modules/calculator.js`:
```javascript
import { state } from '../core/state.js';
import { eventBus } from '../core/event-bus.js';
import { formatCurrency } from '../utils/formatters.js';

export function calculateRoi({ volume, manualHours }) {
  const hourlyRate = 65;
  const manualLaborCostAnnual = manualHours * hourlyRate * 12;
  const errorLeakageAnnual = volume * 0.003;
  const annualSavings = Math.round((manualLaborCostAnnual * 0.85) + (errorLeakageAnnual * 0.75));
  const hoursSavedMonthly = Math.round(manualHours * 0.85);

  const estimatedPlatformFee = 3588; // Scale plan $299 * 12
  const paybackDays = Math.max(12, Math.round((estimatedPlatformFee / annualSavings) * 365));

  return {
    annualSavings,
    hoursSavedMonthly,
    paybackDays
  };
}

export function initCalculator() {
  const volumeSlider = document.getElementById('calc-slider-volume');
  const volumeValEl = document.getElementById('calc-val-volume');
  const hoursSlider = document.getElementById('calc-slider-hours');
  const hoursValEl = document.getElementById('calc-val-hours');

  const savingsOutputEl = document.getElementById('calc-annual-savings');
  const hoursSavedOutputEl = document.getElementById('calc-hours-saved');
  const paybackDaysOutputEl = document.getElementById('calc-payback-days');

  function updateSliderVisual(slider) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const val = parseFloat(slider.value);
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.setProperty('--slider-progress', `${percentage}%`);
  }

  function recalculate() {
    const volume = parseFloat(volumeSlider.value);
    const hours = parseFloat(hoursSlider.value);

    updateSliderVisual(volumeSlider);
    updateSliderVisual(hoursSlider);

    if (volumeValEl) volumeValEl.textContent = formatCurrency(volume, 'USD', 0);
    if (hoursValEl) hoursValEl.textContent = `${hours} hrs/mo`;

    const { annualSavings, hoursSavedMonthly, paybackDays } = calculateRoi({ volume, manualHours: hours });

    if (savingsOutputEl) savingsOutputEl.textContent = formatCurrency(annualSavings, 'USD', 0);
    if (hoursSavedOutputEl) hoursSavedOutputEl.textContent = `${hoursSavedMonthly} hrs/mo`;
    if (paybackDaysOutputEl) paybackDaysOutputEl.textContent = `${paybackDays} days`;

    state.set('volume', volume);
    state.set('manualHours', hours);
    eventBus.emit('calculator-updated', { volume, hours, annualSavings });
  }

  if (volumeSlider && hoursSlider) {
    volumeSlider.addEventListener('input', recalculate);
    hoursSlider.addEventListener('input', recalculate);
    recalculate();
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/task7-calculator.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add css/modules/roi-calculator.css js/modules/calculator.js tests/task7-calculator.test.js
git commit -m "feat: implement interactive ROI and savings simulator module"
```

---

### Task 8: Transparent Pricing Table, Switcher & Testimonials

**Files:**
- Create: `css/modules/pricing.css`
- Create: `js/modules/pricing.js`
- Modify: `index.html` (integrate Pricing & Testimonials sections)
- Test: `tests/task8-pricing.test.js`

**Interfaces:**
- Consumes: `state`, `eventBus`
- Produces: Monthly/Annual billing switcher with price update animations.

- [ ] **Step 1: Write test for pricing tier calculations**

Create `tests/task8-pricing.test.js`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pricingTiers } from '../js/modules/pricing.js';

test('pricingTiers contains correct monthly and annual discounted rates', () => {
  assert.equal(pricingTiers.starter.monthly, 99);
  assert.equal(pricingTiers.starter.annual, 79);
  assert.equal(pricingTiers.scale.monthly, 299);
  assert.equal(pricingTiers.scale.annual, 239);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/task8-pricing.test.js`
Expected: FAIL

- [ ] **Step 3: Implement pricing.css and pricing.js**

Create `css/modules/pricing.css`:
```css
/* Pricing Switcher Toggle */
.pricing-switch-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-12);
}

.pricing-switch-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
}

.pricing-switch-label.active {
  color: var(--text-primary);
}

.switch-toggle {
  position: relative;
  width: 3.25rem;
  height: 1.875rem;
  background-color: var(--border-strong);
  border-radius: var(--radius-full);
  padding: 0.1875rem;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.switch-toggle.active {
  background-color: var(--accent-primary);
}

.switch-toggle__handle {
  width: 1.5rem;
  height: 1.5rem;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
}

.switch-toggle.active .switch-toggle__handle {
  transform: translateX(1.375rem);
}

/* Pricing Cards */
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 960px) {
  .pricing-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.pricing-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: all var(--transition-normal);
}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.pricing-card--popular {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.pricing-card__badge {
  position: absolute;
  top: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--accent-primary);
  color: #ffffff;
  padding: 0.25rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: var(--radius-full);
}

.pricing-card__name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.pricing-card__price-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  margin-top: var(--space-4);
  margin-bottom: var(--space-6);
}

.pricing-card__amount {
  font-size: 2.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.pricing-card__period {
  font-size: 0.9375rem;
  color: var(--text-muted);
}

.pricing-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

.pricing-feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.pricing-feature-item svg {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--emerald-500);
  flex-shrink: 0;
}

/* Testimonial Cards */
.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 860px) {
  .testimonials-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.testimonial-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.testimonial-quote {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.testimonial-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--accent-surface);
  color: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
```

Create `js/modules/pricing.js`:
```javascript
import { state } from '../core/state.js';
import { eventBus } from '../core/event-bus.js';

export const pricingTiers = {
  starter: { monthly: 99, annual: 79 },
  scale: { monthly: 299, annual: 239 },
  enterprise: { monthly: 'Custom', annual: 'Custom' }
};

export function initPricing() {
  const toggleBtn = document.getElementById('pricing-toggle');
  const labelMonthly = document.getElementById('label-monthly');
  const labelAnnual = document.getElementById('label-annual');
  const starterPriceEl = document.getElementById('price-starter');
  const scalePriceEl = document.getElementById('price-scale');

  let currentPeriod = 'monthly';

  function updatePricing(period) {
    currentPeriod = period;
    state.set('billingPeriod', period);

    const isAnnual = period === 'annual';
    if (toggleBtn) toggleBtn.classList.toggle('active', isAnnual);
    if (labelMonthly) labelMonthly.classList.toggle('active', !isAnnual);
    if (labelAnnual) labelAnnual.classList.toggle('active', isAnnual);

    if (starterPriceEl) starterPriceEl.textContent = `$${pricingTiers.starter[period]}`;
    if (scalePriceEl) scalePriceEl.textContent = `$${pricingTiers.scale[period]}`;

    eventBus.emit('pricing-changed', { period });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const next = currentPeriod === 'monthly' ? 'annual' : 'monthly';
      updatePricing(next);
    });
  }

  if (labelMonthly) labelMonthly.addEventListener('click', () => updatePricing('monthly'));
  if (labelAnnual) labelAnnual.addEventListener('click', () => updatePricing('annual'));

  updatePricing('monthly');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/task8-pricing.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add css/modules/pricing.css js/modules/pricing.js tests/task8-pricing.test.js
git commit -m "feat: implement pricing table, billing switcher, and testimonials"
```

---

### Task 9: Accessible FAQ Accordion, Closing CTA & Footer

**Files:**
- Create: `css/modules/accordion.css`
- Create: `js/modules/accordion.js`
- Modify: `index.html` (integrate Accordion FAQ, CTA banner, and Footer)
- Test: `tests/task9-accordion.test.js`

**Interfaces:**
- Consumes: Nothing
- Produces: `initAccordion()` with WAI-ARIA attributes, Enter/Space/Arrow key navigation, and smooth CSS Grid row expansion.

- [ ] **Step 1: Write test for accordion DOM and ARIA attributes**

Create `tests/task9-accordion.test.js`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Task 9: CSS defines grid-template-rows smooth accordion animation', () => {
  const css = fs.readFileSync('css/modules/accordion.css', 'utf-8');
  assert.ok(css.includes('grid-template-rows: 0fr'), 'accordion.css must use 0fr for collapsed state');
  assert.ok(css.includes('grid-template-rows: 1fr'), 'accordion.css must use 1fr for expanded state');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/task9-accordion.test.js`
Expected: FAIL

- [ ] **Step 3: Implement accordion.css and accordion.js**

Create `css/modules/accordion.css`:
```css
.faq-list {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.faq-item {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color var(--transition-fast);
}

.faq-item.open {
  border-color: var(--accent-primary);
}

.faq-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: left;
  transition: color var(--transition-fast);
}

.faq-trigger:hover {
  color: var(--accent-primary);
}

.faq-chevron {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform var(--transition-normal);
  color: var(--text-muted);
  flex-shrink: 0;
}

.faq-item.open .faq-chevron {
  transform: rotate(180deg);
  color: var(--accent-primary);
}

/* CSS Grid Smooth Height Expansion */
.faq-content-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--transition-normal);
}

.faq-item.open .faq-content-wrapper {
  grid-template-rows: 1fr;
}

.faq-content-inner {
  overflow: hidden;
}

.faq-answer {
  padding: 0 var(--space-6) var(--space-6) var(--space-6);
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.9375rem;
}

/* Closing CTA Banner */
.cta-banner {
  background: linear-gradient(135deg, var(--blue-600) 0%, var(--blue-900) 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-12) var(--space-8);
  color: #ffffff;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-banner__title {
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: var(--space-4);
}

.cta-banner__desc {
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: var(--space-8);
}

/* Footer */
.footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-default);
  padding-top: var(--space-16);
  padding-bottom: var(--space-12);
}

.footer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-8);
  margin-bottom: var(--space-12);
}

.footer__col-title {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-4);
  color: var(--text-primary);
}

.footer__links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer__link {
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.footer__link:hover {
  color: var(--accent-primary);
}

.footer__bottom {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-default);
  padding-top: var(--space-6);
  font-size: 0.8125rem;
  color: var(--text-muted);
}

@media (min-width: 640px) {
  .footer__bottom {
    flex-direction: row;
  }
}
```

Create `js/modules/accordion.js`:
```javascript
export function initAccordion() {
  const triggers = document.querySelectorAll('[data-accordion-trigger]');

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close other items for clean accordion behavior
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('[data-accordion-trigger]')?.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });

    // Keyboard arrow navigation
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = triggers[(index + 1) % triggers.length];
        next?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = triggers[(index - 1 + triggers.length) % triggers.length];
        prev?.focus();
      }
    });
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/task9-accordion.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add css/modules/accordion.css js/modules/accordion.js tests/task9-accordion.test.js
git commit -m "feat: implement accessible FAQ accordion, CTA banner, and footer"
```

---

### Task 10: Accessible Focus-Trapped Modal & Toast Notification System

**Files:**
- Create: `css/modules/modal-toast.css`
- Create: `js/modules/modal.js`
- Create: `js/main.js` (application entry point bootstrapping all modules)
- Modify: `index.html` (include modal markup & full semantic structure)
- Test: `tests/task10-modal-main.test.js`

**Interfaces:**
- Consumes: `initTheme`, `initNavigation`, `initDashboard`, `initStatsCounter`, `initCalculator`, `initPricing`, `initAccordion`
- Produces: `showToast(message, type = 'success')`, `openModal()`, `closeModal()` compliant with W3C APG focus trap guidelines.

- [ ] **Step 1: Write test for modal focus trap and toast exports**

Create `tests/task10-modal-main.test.js`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Task 10: Modal and Toast css and modules exist', () => {
  assert.ok(fs.existsSync('css/modules/modal-toast.css'));
  assert.ok(fs.existsSync('js/modules/modal.js'));
  assert.ok(fs.existsSync('js/main.js'));

  const mainJs = fs.readFileSync('js/main.js', 'utf-8');
  assert.ok(mainJs.includes('initTheme'));
  assert.ok(mainJs.includes('initDashboard'));
  assert.ok(mainJs.includes('initCalculator'));
  assert.ok(mainJs.includes('initPricing'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/task10-modal-main.test.js`
Expected: FAIL

- [ ] **Step 3: Implement modal-toast.css, modal.js, and main.js**

Create `css/modules/modal-toast.css`:
```css
/* Modal Dialog */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-normal);
}

.modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.modal-container {
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--space-8);
  position: relative;
  transform: scale(0.95) translateY(10px);
  transition: transform var(--transition-normal);
}

.modal-overlay.open .modal-container {
  transform: scale(1) translateY(0);
}

.modal-close-btn {
  position: absolute;
  top: var(--space-6);
  right: var(--space-6);
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  transition: all var(--transition-fast);
}

.modal-close-btn:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.modal-header {
  margin-bottom: var(--space-6);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.modal-desc {
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input, .form-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  transition: border-color var(--transition-fast);
}

.form-input:focus, .form-select:focus {
  border-color: var(--accent-primary);
}

/* Floating Toast Notifications */
.toast-container {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  background-color: var(--bg-card);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 500;
  max-width: 420px;
  animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.toast--success svg {
  color: var(--emerald-500);
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Create `js/modules/modal.js`:
```javascript
import { state } from '../core/state.js';

export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

export function initModal() {
  const modalOverlay = document.getElementById('demo-modal');
  const openButtons = document.querySelectorAll('[data-action="open-demo-modal"]');
  const closeButton = document.querySelector('[data-action="close-modal"]');
  const form = document.getElementById('demo-form');
  let previouslyFocusedElement = null;

  function open() {
    if (!modalOverlay) return;
    previouslyFocusedElement = document.activeElement;
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    state.set('isModalOpen', true);

    const firstInput = modalOverlay.querySelector('input, button');
    firstInput?.focus();
  }

  function close() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.set('isModalOpen', false);
    previouslyFocusedElement?.focus();
  }

  openButtons.forEach(btn => btn.addEventListener('click', open));
  if (closeButton) closeButton.addEventListener('click', close);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) close();
    });
  }

  // W3C APG Focus Trap
  document.addEventListener('keydown', (e) => {
    if (!state.get('isModalOpen')) return;

    if (e.key === 'Escape') {
      close();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = modalOverlay.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Provisioning Sandbox...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        form.reset();
        close();
        showToast('Success! Your personalized sandbox credentials have been generated and sent to your work email.');
      }, 700);
    });
  }
}
```

Create `js/main.js`:
```javascript
import { initTheme } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initDashboard } from './modules/dashboard.js';
import { initStatsCounter } from './modules/stats.js';
import { initCalculator } from './modules/calculator.js';
import { initPricing } from './modules/pricing.js';
import { initAccordion } from './modules/accordion.js';
import { initModal } from './modules/modal.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    initTheme();
    initNavigation();
    initDashboard();
    initStatsCounter();
    initCalculator();
    initPricing();
    initAccordion();
    initModal();
  } catch (err) {
    console.error('NovaFlow Initialization error:', err);
  }
});
```

- [ ] **Step 4: Update `index.html` with full semantic content integrating all sections and modal**

Ensure `index.html` contains:
- Header & Sticky Navbar with Theme toggle button
- Hero section with title, subtitle, CTA buttons, and `#dashboard-balance`, `#dashboard-growth`, `#dashboard-chart`, Timeframe buttons (`7D`, `30D`, `1Y`)
- Social proof logos & trust badges (SOC2 Type II, ISO 27001, PCI-DSS Level 1)
- Bento Grid section with 4 capability cards
- Stats counter section with `data-counter-target` attributes
- ROI Calculator section with `#calc-slider-volume`, `#calc-slider-hours`, `#calc-annual-savings`, `#calc-hours-saved`, `#calc-payback-days`
- Pricing section with toggle switcher and 3 cards
- Testimonials section
- FAQ accordion with 5 questions and `data-accordion-trigger`
- Conversion CTA banner
- Multi-column footer
- Accessible `#demo-modal` dialog

- [ ] **Step 5: Run test to verify it passes**

Run: `node tests/task10-modal-main.test.js`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add css/modules/modal-toast.css js/modules/modal.js js/main.js index.html tests/task10-modal-main.test.js
git commit -m "feat: complete application assembly with modal, toast, and all sections"
```

---

### Task 11: End-to-End Verification & Quality Polish

**Files:**
- Test: `tests/task11-e2e.test.js`
- Modify: Any files needing polish based on verification

**Interfaces:**
- Consumes: Complete website running on local server
- Produces: 100% verified interactive functionality, zero console errors, full keyboard navigation check, and responsive design verification.

- [ ] **Step 1: Write comprehensive automated verification test**

Create `tests/task11-e2e.test.js`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

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
```

- [ ] **Step 2: Run verification test**

Run: `node tests/task11-e2e.test.js`
Expected: PASS

- [ ] **Step 3: Launch local server and test browser rendering with DevTools / Playwright**

Run local server in background:
`python3 -m http.server 3000 --directory /home/boriphat/Projects/novaflow`

Verify:
- Theme toggle: clicks and checks attribute `data-theme` switches between `light` and `dark`.
- Dashboard tabs: clicks `7D`, `30D`, `1Y` and verifies balance updates.
- ROI sliders: moves volume and hours sliders and checks output values.
- Pricing switcher: clicks toggle and checks price amounts.
- Modal: clicks "Book a Demo", verifies modal appears, submits form, verifies toast notification appears.

- [ ] **Step 4: Commit any final visual adjustments**

```bash
git add .
git commit -m "chore: final end-to-end verification and quality polish"
```
