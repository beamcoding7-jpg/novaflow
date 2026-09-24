import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Task 5: dashboardDatasets provides correct datasets for 7D, 30D, 1Y', async () => {
  const { dashboardDatasets } = await import('../js/modules/dashboard.js');
  assert.ok(dashboardDatasets['7D'], '7D dataset must exist');
  assert.ok(dashboardDatasets['30D'], '30D dataset must exist');
  assert.ok(dashboardDatasets['1Y'], '1Y dataset must exist');

  assert.equal(dashboardDatasets['7D'].balance, 12458920.40);
  assert.equal(dashboardDatasets['7D'].growth, 0.148);
  assert.equal(dashboardDatasets['7D'].chartData.length, 7);
  assert.equal(dashboardDatasets['7D'].reconciled, '99.4%');
  assert.equal(dashboardDatasets['7D'].latency, '1.2s');
  assert.equal(dashboardDatasets['7D'].currencies, '38');

  assert.equal(dashboardDatasets['30D'].balance, 48912300.00);
  assert.equal(dashboardDatasets['30D'].growth, 0.284);
  assert.equal(dashboardDatasets['30D'].chartData.length, 12);
  assert.equal(dashboardDatasets['30D'].reconciled, '99.7%');
  assert.equal(dashboardDatasets['30D'].latency, '1.1s');
  assert.equal(dashboardDatasets['30D'].currencies, '42');

  assert.equal(dashboardDatasets['1Y'].balance, 184500000.00);
  assert.equal(dashboardDatasets['1Y'].growth, 1.421);
  assert.equal(dashboardDatasets['1Y'].chartData.length, 12);
  assert.equal(dashboardDatasets['1Y'].reconciled, '99.9%');
  assert.equal(dashboardDatasets['1Y'].latency, '0.9s');
  assert.equal(dashboardDatasets['1Y'].currencies, '54');
});

test('Task 5: CSS contains Hero Section and Interactive Dashboard definitions', () => {
  const css = fs.readFileSync('css/modules/hero-dashboard.css', 'utf-8');
  assert.ok(css.includes('.hero'), 'CSS must define .hero');
  assert.ok(css.includes('.hero__badge'), 'CSS must define .hero__badge');
  assert.ok(css.includes('.hero__title'), 'CSS must define .hero__title');
  assert.ok(css.includes('.hero__subtitle'), 'CSS must define .hero__subtitle');
  assert.ok(css.includes('.hero__cta-group'), 'CSS must define .hero__cta-group');
  assert.ok(css.includes('.hero__microcopy'), 'CSS must define .hero__microcopy');
  assert.ok(css.includes('.dashboard-card'), 'CSS must define .dashboard-card');
  assert.ok(css.includes('.dashboard-card__header'), 'CSS must define .dashboard-card__header');
  assert.ok(css.includes('.dashboard-card__balance-val'), 'CSS must define .dashboard-card__balance-val');
  assert.ok(css.includes('.timeframe-selector'), 'CSS must define .timeframe-selector');
  assert.ok(css.includes('.timeframe-btn'), 'CSS must define .timeframe-btn');
  assert.ok(css.includes('.timeframe-btn.active'), 'CSS must define .timeframe-btn.active');
  assert.ok(css.includes('.dashboard-card__chart-container'), 'CSS must define .dashboard-card__chart-container');
  assert.ok(css.includes('.novaflow-chart-svg'), 'CSS must define .novaflow-chart-svg');
  assert.ok(css.includes('.chart-line-stroke'), 'CSS must define .chart-line-stroke');
  assert.ok(css.includes('.chart-dot'), 'CSS must define .chart-dot');
  assert.ok(css.includes('.dashboard-kpis'), 'CSS must define .dashboard-kpis');
  assert.ok(css.includes('.kpi-item'), 'CSS must define .kpi-item');
});

test('Task 5: index.html contains Hero Section and Dashboard Preview markup', () => {
  const html = fs.readFileSync('index.html', 'utf-8');
  assert.ok(html.includes('class="hero"'), 'index.html must include hero section');
  assert.ok(html.includes('hero__title'), 'index.html must include hero title');
  assert.ok(html.includes('hero__subtitle'), 'index.html must include hero subtitle');
  assert.ok(html.includes('hero__badge'), 'index.html must include hero badge');
  assert.ok(html.includes('id="dashboard-balance"'), 'index.html must include #dashboard-balance');
  assert.ok(html.includes('id="dashboard-growth"'), 'index.html must include #dashboard-growth');
  assert.ok(html.includes('id="dashboard-chart"'), 'index.html must include #dashboard-chart');
  assert.ok(html.includes('data-timeframe="7D"'), 'index.html must include 7D timeframe button');
  assert.ok(html.includes('data-timeframe="30D"'), 'index.html must include 30D timeframe button');
  assert.ok(html.includes('data-timeframe="1Y"'), 'index.html must include 1Y timeframe button');
  assert.ok(html.includes('id="kpi-reconciled"'), 'index.html must include #kpi-reconciled');
  assert.ok(html.includes('id="kpi-latency"'), 'index.html must include #kpi-latency');
  assert.ok(html.includes('id="kpi-currencies"'), 'index.html must include #kpi-currencies');
});

test('Task 5: js/modules/dashboard.js exports initDashboard, manages timeframe tabs, updates state and chart', async () => {
  const { initDashboard, dashboardDatasets } = await import('../js/modules/dashboard.js');
  const { state } = await import('../js/core/state.js');
  const { eventBus } = await import('../js/core/event-bus.js');

  assert.equal(typeof initDashboard, 'function', 'initDashboard must be a function');

  // จำลอง Mock DOM Elements สำหรับการทดสอบ
  const balanceEl = { textContent: '' };
  const growthBadgeEl = { textContent: '' };
  const chartWrapper = { innerHTML: '' };
  const kpiReconciled = { textContent: '' };
  const kpiLatency = { textContent: '' };
  const kpiCurrencies = { textContent: '' };

  const buttons = ['7D', '30D', '1Y'].map(tf => {
    const classList = new Set();
    const listeners = {};
    const attrs = { 'data-timeframe': tf };
    return {
      classList: {
        add: (cls) => classList.add(cls),
        remove: (cls) => classList.delete(cls),
        contains: (cls) => classList.has(cls),
        toggle: (cls, force) => {
          if (force === undefined) {
            if (classList.has(cls)) classList.delete(cls);
            else classList.add(cls);
          } else if (force) {
            classList.add(cls);
          } else {
            classList.delete(cls);
          }
        }
      },
      getAttribute: (k) => attrs[k],
      setAttribute: (k, v) => { attrs[k] = v; },
      hasAttribute: (k) => k in attrs,
      addEventListener: (evt, handler) => { listeners[evt] = handler; },
      _trigger: (evt) => listeners[evt]?.()
    };
  });

  const oldDoc = global.document;

  let emittedEvents = [];
  const onTimeframeChange = (detail) => {
    emittedEvents.push(detail);
  };
  eventBus.on('timeframe-changed', onTimeframeChange);

  try {
    global.document = {
      getElementById: (id) => {
        if (id === 'dashboard-balance') return balanceEl;
        if (id === 'dashboard-growth') return growthBadgeEl;
        if (id === 'dashboard-chart') return chartWrapper;
        if (id === 'kpi-reconciled') return kpiReconciled;
        if (id === 'kpi-latency') return kpiLatency;
        if (id === 'kpi-currencies') return kpiCurrencies;
        return null;
      },
      querySelectorAll: (sel) => {
        if (sel === '[data-timeframe]') return buttons;
        return [];
      }
    };

    initDashboard();

    // ตรวจสอบ Initial Render (ค่าเริ่มต้น 7D)
    assert.equal(state.get('timeframe'), '7D');
    assert.equal(balanceEl.textContent, '$12,458,920.40');
    assert.equal(growthBadgeEl.textContent, '+14.8%');
    assert.equal(kpiReconciled.textContent, '99.4%');
    assert.equal(kpiLatency.textContent, '1.2s');
    assert.equal(kpiCurrencies.textContent, '38');
    assert.ok(buttons[0].classList.contains('active'), '7D button must be active');
    assert.ok(!buttons[1].classList.contains('active'), '30D button must not be active');
    assert.ok(!buttons[2].classList.contains('active'), '1Y button must not be active');
    assert.ok(chartWrapper.innerHTML.includes('<svg'), 'chartWrapper must contain SVG markup');
    assert.ok(chartWrapper.innerHTML.includes('hero-chart-gradient-7D'), 'chart SVG must include timeframe gradient ID');

    assert.equal(emittedEvents.length, 1);
    assert.equal(emittedEvents[0].timeframe, '7D');

    // จำลองคลิกเลือก 30D
    buttons[1]._trigger('click');
    assert.equal(state.get('timeframe'), '30D');
    assert.equal(balanceEl.textContent, '$48,912,300.00');
    assert.equal(growthBadgeEl.textContent, '+28.4%');
    assert.equal(kpiReconciled.textContent, '99.7%');
    assert.equal(kpiLatency.textContent, '1.1s');
    assert.equal(kpiCurrencies.textContent, '42');
    assert.ok(!buttons[0].classList.contains('active'));
    assert.ok(buttons[1].classList.contains('active'));
    assert.ok(!buttons[2].classList.contains('active'));
    assert.ok(chartWrapper.innerHTML.includes('hero-chart-gradient-30D'));
    assert.equal(emittedEvents.length, 2);
    assert.equal(emittedEvents[1].timeframe, '30D');

    // จำลองคลิกเลือก 1Y
    buttons[2]._trigger('click');
    assert.equal(state.get('timeframe'), '1Y');
    assert.equal(balanceEl.textContent, '$184,500,000.00');
    assert.equal(growthBadgeEl.textContent, '+142.1%');
    assert.equal(kpiReconciled.textContent, '99.9%');
    assert.equal(kpiLatency.textContent, '0.9s');
    assert.equal(kpiCurrencies.textContent, '54');
    assert.ok(!buttons[0].classList.contains('active'));
    assert.ok(!buttons[1].classList.contains('active'));
    assert.ok(buttons[2].classList.contains('active'));
    assert.ok(chartWrapper.innerHTML.includes('hero-chart-gradient-1Y'));
    assert.equal(emittedEvents.length, 3);
    assert.equal(emittedEvents[2].timeframe, '1Y');

    // จำลอง EventBus 'theme-changed'
    eventBus.emit('theme-changed', { theme: 'dark' });
    // ต้องยังคง timeframe 1Y และ re-render chart
    assert.equal(state.get('timeframe'), '1Y');
    assert.ok(chartWrapper.innerHTML.includes('hero-chart-gradient-1Y'));
  } finally {
    eventBus.off('timeframe-changed', onTimeframeChange);
    global.document = oldDoc;
  }
});
