/**
 * NovaFlow — Interactive ROI & Savings Calculator Module
 * คำนวณผลตอบแทนการลงทุนและการประหยัดต้นทุนแบบ Reactive แบบ Real-Time
 */

import { state } from '../core/state.js';
import { eventBus } from '../core/event-bus.js';
import { formatCurrency } from '../utils/formatters.js';

let isInitialized = false;

/**
 * รีเซ็ตสถานะการเริ่มต้น (สำหรับ testing environment)
 */
export function _resetCalculatorInit() {
  isInitialized = false;
}

/**
 * คำนวณมูลค่าการประหยัดต้นทุนและระยะเวลาคืนทุน (ROI)
 * @param {Object} params
 * @param {number} params.volume - ปริมาณธุรกรรมต่อเดือน ($)
 * @param {number} params.manualHours - จำนวนชั่วโมงทำงานเอกสาร/กระทบยอดต่อเดือน (ชม.)
 * @returns {{ annualSavings: number, hoursSavedMonthly: number, paybackDays: number }}
 */
export function calculateRoi({ volume, manualHours }) {
  const hourlyRate = 65;
  const manualLaborCostAnnual = manualHours * hourlyRate * 12;
  const errorLeakageAnnual = volume * 0.003;
  const annualSavings = Math.round((manualLaborCostAnnual * 0.85) + (errorLeakageAnnual * 0.75));
  const hoursSavedMonthly = Math.round(manualHours * 0.85);

  const estimatedPlatformFee = 3588; // ค่าบริการแพ็กเกจ Scale ($299 * 12 เดือน)
  const paybackDays = Math.max(12, Math.round((estimatedPlatformFee / annualSavings) * 365));

  return {
    annualSavings,
    hoursSavedMonthly,
    paybackDays
  };
}

/**
 * อัปเดตการแสดงผลแถบสี Gradient ของ Custom Range Slider ตามค่าที่เลือก
 * @param {HTMLInputElement} slider
 */
function updateSliderVisual(slider) {
  if (!slider) return;
  const min = parseFloat(slider.min) || 0;
  const max = parseFloat(slider.max) || 100;
  const val = parseFloat(slider.value) || 0;
  const percentage = ((val - min) / (max - min)) * 100;
  slider.style.setProperty('--slider-progress', `${percentage}%`);
  if (typeof slider.setAttribute === 'function') {
    slider.setAttribute('aria-valuenow', val.toString());
  }
}

/**
 * เริ่มต้นการทำงานของ ROI Calculator
 * ผูก Event Listeners กับ Range Sliders และซิงค์ข้อมูลกับ State และ EventBus
 */
export function initCalculator() {
  if (typeof document === 'undefined') return;
  if (isInitialized) return;

  const volumeSlider = document.getElementById('calc-slider-volume');
  const volumeValEl = document.getElementById('calc-val-volume');
  const hoursSlider = document.getElementById('calc-slider-hours');
  const hoursValEl = document.getElementById('calc-val-hours');

  const savingsOutputEl = document.getElementById('calc-annual-savings');
  const hoursSavedOutputEl = document.getElementById('calc-hours-saved');
  const paybackDaysOutputEl = document.getElementById('calc-payback-days');

  if (!volumeSlider || !hoursSlider) {
    return;
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

  volumeSlider.addEventListener('input', recalculate);
  hoursSlider.addEventListener('input', recalculate);

  // คำนวณและอัปเดตสถานะเริ่มต้น
  recalculate();
  isInitialized = true;
}
