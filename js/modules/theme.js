import { state } from '../core/state.js';
import { eventBus } from '../core/event-bus.js';

/**
 * จัดการการสลับธีม (Light / Dark mode) แบบไม่มีอาการกระพริบ (zero-flicker)
 * ซิงค์สถานะเข้ากับ DOM, localStorage, StateStore และแจ้งเตือนผ่าน EventBus
 */
export function initTheme() {
  // ดึงธีมปัจจุบันที่ถูก hydrate มาจาก inline script ใน <head>
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  state.set('theme', currentTheme);

  const toggleButtons = document.querySelectorAll('[data-action="toggle-theme"]');

  /**
   * อัปเดตไอคอนดวงอาทิตย์ / พระจันทร์และ aria-label บนปุ่มทั้งหมด
   * @param {string} theme - 'light' | 'dark'
   */
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

  /**
   * บันทึกธีมใหม่และกระจายการเปลี่ยนแปลงไปยังระบบที่เกี่ยวข้อง
   * @param {string} theme - 'light' | 'dark'
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('novaflow-theme', theme);
    state.set('theme', theme);
    updateIcons(theme);
    eventBus.emit('theme-changed', { theme });
  }

  // ดักจับการคลิกปุ่มสลับธีมทุกปุ่ม (ทั้ง desktop navbar และ mobile drawer)
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newTheme = state.get('theme') === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  updateIcons(currentTheme);

  // ดักจับการเปลี่ยนธีมระดับ OS ในกรณีที่ผู้ใช้ยังไม่เคยกดเลือกธีมเองใน localStorage
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery && typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('novaflow-theme')) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }
}
