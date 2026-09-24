/**
 * NovaFlow — Accessible FAQ Accordion Module
 * จัดการ Accordion แบบเข้าถึงได้ (WAI-ARIA compliant) พร้อม CSS Grid height transition
 * และ Keyboard Navigation (ArrowUp, ArrowDown, Home, End)
 */

let isInitialized = false;

/**
 * รีเซ็ตสถานะการเริ่มต้น (สำหรับ testing environment)
 */
export function _resetAccordionInit() {
  isInitialized = false;
}

/**
 * เริ่มต้นการทำงานของ FAQ Accordion และผูก Event Listeners
 */
export function initAccordion() {
  if (typeof document === 'undefined') return;
  if (isInitialized) return;

  const triggers = Array.from(document.querySelectorAll('[data-accordion-trigger]'));
  if (triggers.length === 0) return;

  isInitialized = true;

  triggers.forEach((trigger, index) => {
    // การคลิกเพื่อเปิด/ปิด Accordion
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      if (!item) return;

      const isOpen = item.classList.contains('open');

      // ปิดรายการอื่นๆ ทั้งหมดเพื่อให้เปิดได้ทีละข้อ (Single-panel Accordion behavior)
      const allItems = document.querySelectorAll('.faq-item');
      allItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherTrigger = other.querySelector('[data-accordion-trigger]');
          if (otherTrigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // สลับสถานะของรายการที่ถูกคลิก
      const willOpen = !isOpen;
      item.classList.toggle('open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    // Keyboard Navigation สำหรับเข้าถึงด้วยแป้นพิมพ์ตามมาตรฐาน W3C APG
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = triggers[(index + 1) % triggers.length];
        next?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = triggers[(index - 1 + triggers.length) % triggers.length];
        prev?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        triggers[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        triggers[triggers.length - 1]?.focus();
      }
    });
  });
}
