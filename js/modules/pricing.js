/**
 * NovaFlow — Transparent Pricing Table & Billing Switcher Module
 * จัดการการสลับรอบบิล รายเดือน (Monthly) และ รายปี (Annual) พร้อมคำนวณส่วนลด 20%
 */

import { state } from '../core/state.js';
import { eventBus } from '../core/event-bus.js';

let isInitialized = false;

/**
 * รีเซ็ตสถานะการเริ่มต้น (สำหรับ testing environment)
 */
export function _resetPricingInit() {
  isInitialized = false;
}

/**
 * อัตราค่าบริการของแต่ละแพ็กเกจ (รายเดือน และ รายปีพร้อมส่วนลด 20%)
 */
export const pricingTiers = {
  starter: { monthly: 99, annual: 79 },
  scale: { monthly: 299, annual: 239 },
  enterprise: { monthly: 'Custom', annual: 'Custom' }
};

/**
 * กำหนดค่าเริ่มต้นและผูก Event Listeners สำหรับ Billing Switcher
 */
export function initPricing() {
  if (typeof document === 'undefined') return;
  if (isInitialized) return;

  const toggleBtn = document.getElementById('pricing-toggle');
  const labelMonthly = document.getElementById('label-monthly');
  const labelAnnual = document.getElementById('label-annual');
  const starterPriceEl = document.getElementById('price-starter');
  const scalePriceEl = document.getElementById('price-scale');
  const enterprisePriceEl = document.getElementById('price-enterprise');
  const starterSubtextEl = document.getElementById('subtext-starter');
  const scaleSubtextEl = document.getElementById('subtext-scale');
  const enterpriseSubtextEl = document.getElementById('subtext-enterprise');

  // ตรวจสอบความปลอดภัยกรณีไม่มี element ใน DOM
  if (!toggleBtn && !starterPriceEl && !scalePriceEl) {
    return;
  }

  isInitialized = true;

  let currentPeriod = state.get('billingPeriod') || 'monthly';

  /**
   * อัปเดตสถานะรอบบิล ราคาใน DOM และแจ้งเตือนผ่าน EventBus
   * @param {'monthly' | 'annual'} period
   */
  function updatePricing(period) {
    currentPeriod = period;
    state.set('billingPeriod', period);

    const isAnnual = period === 'annual';
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', isAnnual);
      if (typeof toggleBtn.setAttribute === 'function') {
        toggleBtn.setAttribute('aria-checked', String(isAnnual));
      }
    }

    if (labelMonthly) {
      if (labelMonthly.classList) labelMonthly.classList.toggle('active', !isAnnual);
      if (typeof labelMonthly.setAttribute === 'function') {
        labelMonthly.setAttribute('aria-pressed', String(!isAnnual));
      }
    }

    if (labelAnnual) {
      if (labelAnnual.classList) labelAnnual.classList.toggle('active', isAnnual);
      if (typeof labelAnnual.setAttribute === 'function') {
        labelAnnual.setAttribute('aria-pressed', String(isAnnual));
      }
    }

    if (starterPriceEl) {
      starterPriceEl.textContent = `$${pricingTiers.starter[period]}`;
    }
    if (scalePriceEl) {
      scalePriceEl.textContent = `$${pricingTiers.scale[period]}`;
    }
    if (enterprisePriceEl) {
      enterprisePriceEl.textContent = pricingTiers.enterprise[period] === 'Custom' 
        ? 'Custom' 
        : `$${pricingTiers.enterprise[period]}`;
    }

    // อัปเดตคำอธิบายเพิ่มเติมสำหรับรอบบิล (Helper Text)
    if (starterSubtextEl) {
      starterSubtextEl.textContent = isAnnual ? 'Billed annually ($948/yr)' : 'Billed monthly';
    }
    if (scaleSubtextEl) {
      scaleSubtextEl.textContent = isAnnual ? 'Billed annually ($2,868/yr)' : 'Billed monthly';
    }
    if (enterpriseSubtextEl) {
      enterpriseSubtextEl.textContent = isAnnual ? 'Billed annually or multi-year contract' : 'Custom billing terms';
    }

    eventBus.emit('pricing-changed', { period });
  }

  // Bi-directional State Sync: ติดตามการเปลี่ยนแปลงภายนอกของ billingPeriod
  state.subscribe('billingPeriod', (newPeriod) => {
    if (newPeriod && newPeriod !== currentPeriod) {
      updatePricing(newPeriod);
    }
  });

  if (toggleBtn && typeof toggleBtn.addEventListener === 'function') {
    toggleBtn.addEventListener('click', () => {
      const next = currentPeriod === 'monthly' ? 'annual' : 'monthly';
      updatePricing(next);
    });

    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const next = currentPeriod === 'monthly' ? 'annual' : 'monthly';
        updatePricing(next);
      }
    });
  }

  if (labelMonthly && typeof labelMonthly.addEventListener === 'function') {
    labelMonthly.addEventListener('click', () => updatePricing('monthly'));
    labelMonthly.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        updatePricing('monthly');
      }
    });
  }

  if (labelAnnual && typeof labelAnnual.addEventListener === 'function') {
    labelAnnual.addEventListener('click', () => updatePricing('annual'));
    labelAnnual.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        updatePricing('annual');
      }
    });
  }

  // ซิงค์ UI กับค่าปัจจุบัน
  updatePricing(currentPeriod);
}
