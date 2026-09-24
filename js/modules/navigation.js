/**
 * จัดการระบบ Navigation: Sticky navbar, Mobile Drawer, Keyboard Escape และ Scroll Spy
 */
export function initNavigation() {
  const mobileToggle = document.querySelector('[data-action="toggle-mobile-menu"]');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawerBtn = document.querySelector('[data-action="close-mobile-menu"]');
  const navLinks = document.querySelectorAll('.mobile-drawer__nav a');

  /**
   * เปิด Mobile Drawer พร้อมล็อกการเลื่อนหน้าเว็บ และอัปเดต aria-expanded
   */
  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
      if (document.body) {
        document.body.style.overflow = 'hidden';
      }
    }
  }

  /**
   * ปิด Mobile Drawer พร้อมปลดล็อกการเลื่อนหน้าเว็บ คืนค่า aria-expanded และคืน focus ให้ปุ่มเปิด
   */
  function closeDrawer() {
    if (mobileDrawer) {
      const wasOpen = mobileDrawer.classList.contains('open');
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        if (wasOpen && typeof mobileToggle.focus === 'function') {
          mobileToggle.focus();
        }
      }
      if (document.body) {
        document.body.style.overflow = '';
      }
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);

  // ปิด Drawer เมื่อคลิกนอก Panel (คลิกที่ backdrop)
  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });
  }

  // ปิด Drawer เมื่อคลิกลิงก์นำทาง
  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ปิด Drawer เมื่อกดปุ่ม Escape บนคีย์บอร์ด
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // ระบบ Scroll spy เพื่อเน้น active link ของ navbar ตามตำแหน่ง scroll
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.navbar__link');

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset || window.scrollY || 0;
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight || 0;
        const sectionTop = (section.offsetTop || 0) - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          desktopLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
          });
        }
      });
    }, { passive: true });
  }
}
