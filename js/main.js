/**
 * NovaFlow — Application Bootstrap Entry Point
 * นำเข้าและเริ่มต้นโมดูล UI ทั้ง 8 โมดูลของระบบ
 */
import { initTheme } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initDashboard } from './modules/dashboard.js';
import { initStatsCounter } from './modules/stats.js';
import { initCalculator } from './modules/calculator.js';
import { initPricing } from './modules/pricing.js';
import { initAccordion } from './modules/accordion.js';
import { initModal } from './modules/modal.js';

/**
 * ฟังก์ชันเริ่มต้นระบบทั้งหมด
 */
function bootstrap() {
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
}

// ตรวจสอบความพร้อมของ DOM ก่อนทำการเริ่มต้นระบบ
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
