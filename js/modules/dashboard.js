import { state } from '../core/state.js';
import { eventBus } from '../core/event-bus.js';
import { formatCurrency, formatPercent } from '../utils/formatters.js';
import { buildAreaChartSvg } from '../utils/chart-engine.js';

/**
 * ชุดข้อมูลจำลองสำหรับ Live Interactive Dashboard Preview
 * แยกตามช่วงเวลา: 7 วัน (7D), 30 วัน (30D), และ 1 ปี (1Y)
 */
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

/**
 * กำหนดค่าและจัดการ Live Dashboard Preview Card
 * รองรับการสลับช่วงเวลา 7D / 30D / 1Y, อัปเดตตัวเลขการเงิน และวาดกราฟ SVG ใหม่
 */
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
      const isActive = btn.getAttribute('data-timeframe') === timeframe;
      btn.classList.toggle('active', isActive);
      if (typeof btn.setAttribute === 'function') {
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      }
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

  // วาดข้อมูลเริ่มต้นตามค่าใน state หรือ 7D
  const initialTf = state.get('timeframe') || '7D';
  render(initialTf);

  // วาดกราฟใหม่เมื่อธีมเปลี่ยนเพื่อให้สี CSS variable ใน SVG อัปเดตตาม
  eventBus.on('theme-changed', () => {
    render(state.get('timeframe') || '7D');
  });
}
