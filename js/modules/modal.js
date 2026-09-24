/**
 * Modal & Toast Module — จัดการ Demo Booking Modal Dialog (W3C APG Focus Trap) และ Toast Notifications
 */
import { state } from '../core/state.js';

let isModalInitialized = false;
let previouslyFocusedElement = null;

/**
 * รีเซ็ต flag สถานะการเริ่มต้น สำหรับใช้ในการทดสอบ Unit Test
 */
export function _resetModalInit() {
  isModalInitialized = false;
  previouslyFocusedElement = null;
}

/**
 * แสดง Floating Toast Notification ที่มุมขวาล่างของหน้าจอ
 * @param {string} message - ข้อความแจ้งเตือน
 * @param {'success'|'error'|'info'} [type='success'] - ประเภทของการแจ้งเตือน
 */
export function showToast(message, type = 'success') {
  if (typeof document === 'undefined') return;

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;

  const iconSvg = type === 'error'
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // ตั้งเวลาลบ Toast หลังจาก 4 วินาที พร้อมแอนิเมชัน Fade-out
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (typeof toast.remove === 'function') {
        toast.remove();
      } else if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

/**
 * เปิด Demo Modal Dialog พร้อมจัดการ Focus และ Aria State
 */
export function openModal(e) {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  if (typeof document === 'undefined') return;
  const modalOverlay = document.getElementById('demo-modal');
  if (!modalOverlay) return;

  previouslyFocusedElement = document.activeElement;
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');

  if (document.body && document.body.style) {
    document.body.style.overflow = 'hidden';
  }

  state.set('isModalOpen', true);

  // โฟกัสไปที่ Element ตัวแรกภายใน Modal (เช่น input หรือปุ่มปิด)
  const firstFocusable = modalOverlay.querySelector('input:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])');
  if (firstFocusable && typeof firstFocusable.focus === 'function') {
    firstFocusable.focus();
  }
}

/**
 * ปิด Demo Modal Dialog และคืนค่า Focus กลับไปยังจุดเดิม
 */
export function closeModal() {
  if (typeof document === 'undefined') return;
  const modalOverlay = document.getElementById('demo-modal');
  if (!modalOverlay) return;

  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');

  if (document.body && document.body.style) {
    document.body.style.overflow = '';
  }

  state.set('isModalOpen', false);

  if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
    previouslyFocusedElement.focus();
  }
}

/**
 * เริ่มต้นการทำงานของ Modal และระบบ Event Listeners
 */
export function initModal() {
  if (typeof document === 'undefined') return;

  const modalOverlay = document.getElementById('demo-modal');
  const openButtons = document.querySelectorAll('[data-action="open-demo-modal"], [data-action="open-demo"], [data-modal-open]');
  const closeButton = document.querySelector('[data-action="close-modal"]');
  const form = document.getElementById('demo-form');

  // ป้องกันการผูก Event Listener ซ้ำซ้อน (Idempotent)
  if (isModalInitialized) return;
  isModalInitialized = true;

  // ผูกการกดปุ่มเปิด Modal จากทุกจุดบนหน้าเว็บ
  openButtons.forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  // ผูกปุ่มปิด Modal
  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  // ปิดเมื่อคลิกที่ Overlay พื้นหลังภายนอกคอนเทนเนอร์
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // จัดการ Focus Trap และปุ่มคีย์ลัด Escape ตามมาตรฐาน W3C WAI-ARIA APG
  document.addEventListener('keydown', (e) => {
    if (!state.get('isModalOpen') || !modalOverlay) return;

    // กด Escape เพื่อปิด Modal
    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    // จัดการ Tab และ Shift+Tab ให้วนลูปอยู่ภายใน Modal
    if (e.key === 'Tab') {
      const focusableElements = Array.from(
        modalOverlay.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );

      if (focusableElements.length === 0) return;

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

  // จัดการการส่งฟอร์ม Demo Request แบบจำลองการทำงาน
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Provisioning Sandbox...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        if (typeof form.reset === 'function') {
          form.reset();
        }
        closeModal();
        showToast('Success! Your personalized sandbox credentials have been generated and sent to your work email.');
      }, 700);
    });
  }
}
