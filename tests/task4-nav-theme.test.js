import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Task 4: Component CSS defines button, badge, and navbar styles', () => {
  const css = fs.readFileSync('css/components.css', 'utf-8');
  assert.ok(css.includes('.btn'), 'components.css must define .btn');
  assert.ok(css.includes('.btn-primary'), 'components.css must define .btn-primary');
  assert.ok(css.includes('.btn-secondary'), 'components.css must define .btn-secondary');
  assert.ok(css.includes('.btn-outline'), 'components.css must define .btn-outline');
  assert.ok(css.includes('.badge'), 'components.css must define .badge');
  assert.ok(css.includes('.badge-success'), 'components.css must define .badge-success');
  assert.ok(css.includes('.navbar'), 'components.css must define .navbar');
  assert.ok(css.includes('.theme-toggle'), 'components.css must define .theme-toggle');
  assert.ok(css.includes('.mobile-menu-btn'), 'components.css must define .mobile-menu-btn');
  assert.ok(css.includes('.mobile-drawer'), 'components.css must define .mobile-drawer');
});

test('Task 4: index.html contains navbar, theme toggle, and mobile drawer markup', () => {
  const html = fs.readFileSync('index.html', 'utf-8');
  assert.ok(html.includes('class="navbar"'), 'index.html must include navbar');
  assert.ok(html.includes('data-action="toggle-theme"'), 'index.html must include toggle-theme action');
  assert.ok(html.includes('icon-sun'), 'index.html must include sun icon');
  assert.ok(html.includes('icon-moon'), 'index.html must include moon icon');
  assert.ok(html.includes('data-action="toggle-mobile-menu"'), 'index.html must include toggle-mobile-menu action');
  assert.ok(html.includes('id="mobile-drawer"'), 'index.html must include mobile-drawer');
  assert.ok(html.includes('data-action="close-mobile-menu"'), 'index.html must include close-mobile-menu action');
  assert.ok(html.includes('mobile-drawer__nav'), 'index.html must include mobile drawer nav');
});

test('Task 4: js/modules/theme.js exports initTheme and manages theme switching', async () => {
  const { initTheme } = await import('../js/modules/theme.js');
  assert.equal(typeof initTheme, 'function', 'initTheme must be a function');

  const { state } = await import('../js/core/state.js');
  const { eventBus } = await import('../js/core/event-bus.js');

  // จำลอง Minimal DOM Environment สำหรับทดสอบใน Node.js
  const attributes = { 'data-theme': 'light' };
  const storage = {};
  const eventListeners = {};

  const sunIcon = { style: { display: '' } };
  const moonIcon = { style: { display: '' } };
  const toggleBtnAttrs = {};
  const toggleBtnListeners = {};
  const toggleBtn = {
    setAttribute: (k, v) => { toggleBtnAttrs[k] = v; },
    getAttribute: (k) => toggleBtnAttrs[k],
    querySelector: (sel) => {
      if (sel === '.icon-sun') return sunIcon;
      if (sel === '.icon-moon') return moonIcon;
      return null;
    },
    addEventListener: (evt, handler) => {
      toggleBtnListeners[evt] = handler;
    }
  };

  const oldDoc = global.document;
  const oldStorage = global.localStorage;
  const oldWindow = global.window;

  let themeChangedEvent = null;
  eventBus.on('theme-changed', (detail) => {
    themeChangedEvent = detail;
  });

  try {
    global.document = {
      documentElement: {
        getAttribute: (attr) => attributes[attr] || null,
        setAttribute: (attr, val) => { attributes[attr] = val; }
      },
      querySelectorAll: (sel) => {
        if (sel === '[data-action="toggle-theme"]') return [toggleBtn];
        return [];
      }
    };

    global.localStorage = {
      getItem: (k) => storage[k] || null,
      setItem: (k, v) => { storage[k] = String(v); }
    };

    let mediaChangeHandler = null;
    global.window = {
      matchMedia: () => ({
        addEventListener: (event, handler) => {
          mediaChangeHandler = handler;
        }
      })
    };

    initTheme();

    // ตรวจสอบค่าเริ่มต้น
    assert.equal(state.get('theme'), 'light');
    assert.equal(sunIcon.style.display, 'none');
    assert.equal(moonIcon.style.display, 'block');

    // จำลองการคลิกปุ่มสลับธีม (เปลี่ยนเป็น dark)
    assert.ok(typeof toggleBtnListeners['click'] === 'function');
    toggleBtnListeners['click']();

    assert.equal(state.get('theme'), 'dark');
    assert.equal(attributes['data-theme'], 'dark');
    assert.equal(storage['novaflow-theme'], 'dark');
    assert.equal(sunIcon.style.display, 'block');
    assert.equal(moonIcon.style.display, 'none');
    assert.deepEqual(themeChangedEvent, { theme: 'dark' });

    // คลิกอีกรอบ (เปลี่ยนเป็น light)
    toggleBtnListeners['click']();
    assert.equal(state.get('theme'), 'light');
    assert.equal(attributes['data-theme'], 'light');
    assert.equal(storage['novaflow-theme'], 'light');
    assert.equal(sunIcon.style.display, 'none');
    assert.equal(moonIcon.style.display, 'block');
    assert.deepEqual(themeChangedEvent, { theme: 'light' });
  } finally {
    global.document = oldDoc;
    global.localStorage = oldStorage;
    global.window = oldWindow;
  }
});

test('Task 4: js/modules/navigation.js exports initNavigation and manages drawer state', async () => {
  const { initNavigation } = await import('../js/modules/navigation.js');
  assert.equal(typeof initNavigation, 'function', 'initNavigation must be a function');

  // Minimal DOM mocking
  const drawerClasses = new Set();
  const drawerAttrs = {};
  const drawerListeners = {};
  const mockDrawer = {
    classList: {
      add: (cls) => drawerClasses.add(cls),
      remove: (cls) => drawerClasses.delete(cls),
      contains: (cls) => drawerClasses.has(cls)
    },
    setAttribute: (k, v) => { drawerAttrs[k] = v; },
    getAttribute: (k) => drawerAttrs[k],
    addEventListener: (evt, handler) => {
      drawerListeners[evt] = handler;
    }
  };

  const toggleListeners = {};
  const mockToggle = {
    addEventListener: (evt, handler) => { toggleListeners[evt] = handler; }
  };

  const closeListeners = {};
  const mockCloseBtn = {
    addEventListener: (evt, handler) => { closeListeners[evt] = handler; }
  };

  const linkListeners = {};
  const mockLink = {
    addEventListener: (evt, handler) => { linkListeners[evt] = handler; },
    getAttribute: () => '#features',
    classList: { toggle: () => {} }
  };

  const docListeners = {};
  const winListeners = {};

  const oldDoc = global.document;
  const oldWin = global.window;

  try {
    global.document = {
      body: { style: { overflow: '' } },
      getElementById: (id) => (id === 'mobile-drawer' ? mockDrawer : null),
      querySelector: (sel) => {
        if (sel === '[data-action="toggle-mobile-menu"]') return mockToggle;
        if (sel === '[data-action="close-mobile-menu"]') return mockCloseBtn;
        if (sel === '#mobile-drawer') return mockDrawer;
        return null;
      },
      querySelectorAll: (sel) => {
        if (sel === '.mobile-drawer__nav a') return [mockLink];
        if (sel === 'section[id]') return [];
        if (sel === '.navbar__link') return [mockLink];
        return [];
      },
      addEventListener: (evt, handler) => {
        docListeners[evt] = handler;
      }
    };

    global.window = {
      pageYOffset: 0,
      addEventListener: (evt, handler) => {
        winListeners[evt] = handler;
      }
    };

    initNavigation();

    // ทดสอบเปิด drawer เมื่อกดปุ่ม hamburger
    toggleListeners['click']();
    assert.ok(mockDrawer.classList.contains('open'));
    assert.equal(drawerAttrs['aria-hidden'], 'false');
    assert.equal(document.body.style.overflow, 'hidden');

    // ทดสอบปิด drawer เมื่อกดปุ่มปิด
    closeListeners['click']();
    assert.ok(!mockDrawer.classList.contains('open'));
    assert.equal(drawerAttrs['aria-hidden'], 'true');
    assert.equal(document.body.style.overflow, '');

    // ทดสอบเปิดแล้วกดปุ่ม Escape
    toggleListeners['click']();
    assert.ok(mockDrawer.classList.contains('open'));
    docListeners['keydown']({ key: 'Escape' });
    assert.ok(!mockDrawer.classList.contains('open'));

    // ทดสอบเปิดแล้วคลิกลิงก์
    toggleListeners['click']();
    assert.ok(mockDrawer.classList.contains('open'));
    linkListeners['click']();
    assert.ok(!mockDrawer.classList.contains('open'));

    // ทดสอบคลิกที่ backdrop
    toggleListeners['click']();
    assert.ok(mockDrawer.classList.contains('open'));
    drawerListeners['click']({ target: mockDrawer });
    assert.ok(!mockDrawer.classList.contains('open'));
  } finally {
    global.document = oldDoc;
    global.window = oldWin;
  }
});
