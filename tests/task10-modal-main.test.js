import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Task 10: Modal and Toast css and modules exist', () => {
  assert.ok(fs.existsSync('css/modules/modal-toast.css'), 'css/modules/modal-toast.css must exist');
  assert.ok(fs.existsSync('js/modules/modal.js'), 'js/modules/modal.js must exist');
  assert.ok(fs.existsSync('js/main.js'), 'js/main.js must exist');

  const mainJs = fs.readFileSync('js/main.js', 'utf-8');
  assert.ok(mainJs.includes('initTheme'), 'main.js must import initTheme');
  assert.ok(mainJs.includes('initNavigation'), 'main.js must import initNavigation');
  assert.ok(mainJs.includes('initDashboard'), 'main.js must import initDashboard');
  assert.ok(mainJs.includes('initStatsCounter'), 'main.js must import initStatsCounter');
  assert.ok(mainJs.includes('initCalculator'), 'main.js must import initCalculator');
  assert.ok(mainJs.includes('initPricing'), 'main.js must import initPricing');
  assert.ok(mainJs.includes('initAccordion'), 'main.js must import initAccordion');
  assert.ok(mainJs.includes('initModal'), 'main.js must import initModal');
  assert.ok(mainJs.includes('DOMContentLoaded') || mainJs.includes('addEventListener'), 'main.js must bootstrap on DOM ready');
});

test('Task 10: CSS defines modal dialog and floating toast notification styles', () => {
  assert.ok(fs.existsSync('css/modules/modal-toast.css'), 'modal-toast.css must exist');
  const css = fs.readFileSync('css/modules/modal-toast.css', 'utf-8');

  // Modal dialog styles
  assert.ok(css.includes('.modal-overlay'), 'CSS must define .modal-overlay');
  assert.ok(css.includes('.modal-overlay.open'), 'CSS must define .modal-overlay.open');
  assert.ok(css.includes('.modal-container'), 'CSS must define .modal-container');
  assert.ok(css.includes('.modal-close-btn'), 'CSS must define .modal-close-btn');
  assert.ok(css.includes('.modal-title'), 'CSS must define .modal-title');
  assert.ok(css.includes('.modal-form'), 'CSS must define .modal-form');
  assert.ok(css.includes('.form-group'), 'CSS must define .form-group');
  assert.ok(css.includes('.form-label'), 'CSS must define .form-label');
  assert.ok(css.includes('.form-input'), 'CSS must define .form-input');
  assert.ok(css.includes('.form-select'), 'CSS must define .form-select');

  // Toast notification styles
  assert.ok(css.includes('.toast-container'), 'CSS must define .toast-container');
  assert.ok(css.includes('.toast'), 'CSS must define .toast');
  assert.ok(css.includes('.toast--success'), 'CSS must define .toast--success');
  assert.ok(css.includes('@keyframes toastIn'), 'CSS must define toastIn animation');
  assert.ok(css.includes('prefers-reduced-motion'), 'CSS must support prefers-reduced-motion');
});

test('Task 10: index.html contains Demo Modal markup, accessible form controls, and toast container', () => {
  const html = fs.readFileSync('index.html', 'utf-8');

  // Link tag for stylesheet
  assert.ok(html.includes('href="css/modules/modal-toast.css"'), 'index.html must link modal-toast.css');

  // Modal Dialog Container & ARIA semantics
  assert.ok(html.includes('id="demo-modal"'), 'index.html must include element with id="demo-modal"');
  assert.ok(html.includes('role="dialog"'), 'modal must have role="dialog"');
  assert.ok(html.includes('aria-modal="true"'), 'modal must have aria-modal="true"');
  assert.ok(html.includes('aria-hidden="true"'), 'modal must initially have aria-hidden="true"');
  assert.ok(html.includes('aria-labelledby="'), 'modal must specify aria-labelledby');

  // Close Button
  assert.ok(html.includes('data-action="close-modal"'), 'modal must have close button with data-action="close-modal"');
  assert.ok(html.includes('aria-label="Close dialog"') || html.includes('aria-label="Close modal"'), 'close button must have accessible aria-label');

  // Modal Form
  assert.ok(html.includes('id="demo-form"'), 'modal must contain form with id="demo-form"');
  assert.ok(html.includes('type="email"'), 'form must include email input');
  assert.ok(html.includes('type="submit"'), 'form must include submit button');

  // Form label-input associations
  assert.ok(html.includes('for="demo-name"'), 'form must include label for demo-name');
  assert.ok(html.includes('id="demo-name"'), 'form must include input id="demo-name"');
  assert.ok(html.includes('for="demo-email"'), 'form must include label for demo-email');
  assert.ok(html.includes('id="demo-email"'), 'form must include input id="demo-email"');
  assert.ok(html.includes('for="demo-company"'), 'form must include label for demo-company');
  assert.ok(html.includes('id="demo-company"'), 'form must include input id="demo-company"');
  assert.ok(html.includes('for="demo-volume"'), 'form must include label for demo-volume');
  assert.ok(html.includes('id="demo-volume"'), 'form must include select id="demo-volume"');

  // Toast Container
  assert.ok(html.includes('id="toast-container"'), 'index.html must include #toast-container');
  assert.ok(html.includes('aria-live="polite"'), 'toast container must have aria-live="polite"');

  // Trigger buttons with data-action="open-demo-modal"
  const openButtons = html.match(/data-action="open-demo-modal"/g) || [];
  assert.ok(openButtons.length >= 1, 'index.html must contain at least one button with data-action="open-demo-modal"');
});

test('Task 10: js/modules/modal.js exports initModal, showToast, openModal, closeModal', async () => {
  const modalModule = await import('../js/modules/modal.js');
  assert.equal(typeof modalModule.initModal, 'function', 'initModal must be exported as a function');
  assert.equal(typeof modalModule.showToast, 'function', 'showToast must be exported as a function');
  assert.equal(typeof modalModule.openModal, 'function', 'openModal must be exported as a function');
  assert.equal(typeof modalModule.closeModal, 'function', 'closeModal must be exported as a function');
});

test('Task 10: Modal opens, closes, traps focus, and restores focus', async () => {
  const { initModal, openModal, closeModal, _resetModalInit } = await import('../js/modules/modal.js');
  const { state } = await import('../js/core/state.js');

  if (typeof _resetModalInit === 'function') _resetModalInit();

  // Mock DOM environment
  const originalDoc = globalThis.document;

  const overlayClasses = new Set();
  const overlayAttrs = { 'aria-hidden': 'true' };
  const overlayListeners = {};
  const docListeners = {};
  const formListeners = {};

  const outsideButton = {
    focusCalled: false,
    focus() { this.focusCalled = true; }
  };

  const closeBtn = {
    listeners: {},
    focusCalled: false,
    focus() { this.focusCalled = true; },
    addEventListener(event, fn) { this.listeners[event] = fn; }
  };

  const firstInput = {
    listeners: {},
    focusCalled: false,
    focus() { this.focusCalled = true; },
    addEventListener(event, fn) { this.listeners[event] = fn; }
  };

  const submitBtn = {
    listeners: {},
    focusCalled: false,
    textContent: 'Request Access',
    disabled: false,
    focus() { this.focusCalled = true; },
    addEventListener(event, fn) { this.listeners[event] = fn; }
  };

  const focusable = [closeBtn, firstInput, submitBtn];

  let formResetCalled = false;
  const mockForm = {
    listeners: formListeners,
    addEventListener(event, fn) { formListeners[event] = fn; },
    querySelector(selector) {
      if (selector.includes('submit')) return submitBtn;
      return null;
    },
    reset() { formResetCalled = true; }
  };

  const secondCloseBtn = {
    listeners: {},
    focusCalled: false,
    focus() { this.focusCalled = true; },
    addEventListener(event, fn) { this.listeners[event] = fn; }
  };

  const mockOverlay = {
    classList: {
      add: (c) => overlayClasses.add(c),
      remove: (c) => overlayClasses.delete(c),
      contains: (c) => overlayClasses.has(c)
    },
    contains: (node) => focusable.includes(node) || node === secondCloseBtn,
    setAttribute: (k, v) => { overlayAttrs[k] = String(v); },
    getAttribute: (k) => overlayAttrs[k],
    addEventListener: (event, fn) => { overlayListeners[event] = fn; },
    querySelector: (selector) => {
      if (selector.includes('input') || selector.includes('button')) return firstInput;
      return null;
    },
    querySelectorAll: () => focusable
  };

  const openBtn = {
    addEventListener: (event, fn) => {
      openBtn.listener = fn;
    }
  };

  globalThis.document = {
    activeElement: outsideButton,
    body: {
      style: { overflow: '' },
      appendChild: () => {}
    },
    getElementById: (id) => {
      if (id === 'demo-modal') return mockOverlay;
      if (id === 'demo-form') return mockForm;
      if (id === 'toast-container') return { appendChild: () => {} };
      return null;
    },
    querySelector: (sel) => {
      if (sel.includes('close-modal')) return closeBtn;
      if (sel.includes('open-demo-modal')) return openBtn;
      return null;
    },
    querySelectorAll: (sel) => {
      if (sel.includes('open-demo-modal') || sel.includes('open-demo')) return [openBtn];
      if (sel.includes('close-modal')) return [closeBtn, secondCloseBtn];
      return [];
    },
    addEventListener: (event, fn) => { docListeners[event] = fn; }
  };

  try {
    initModal();

    // Initial state
    assert.equal(state.get('isModalOpen'), false);
    assert.equal(mockOverlay.getAttribute('aria-hidden'), 'true');
    assert.equal(overlayClasses.has('open'), false);

    // 1. Open modal via openModal() or trigger button
    globalThis.document.activeElement = outsideButton;
    openModal();

    assert.equal(state.get('isModalOpen'), true, 'state.isModalOpen should be true');
    assert.equal(mockOverlay.getAttribute('aria-hidden'), 'false');
    assert.equal(overlayClasses.has('open'), true);
    assert.equal(globalThis.document.body.style.overflow, 'hidden');
    assert.equal(firstInput.focusCalled, true, 'first input should receive focus on open');

    // 2. Focus Trap on Tab
    const keydownHandler = docListeners['keydown'];
    assert.ok(keydownHandler, 'keydown handler must be registered');

    // Focus Containment Fallback: when activeElement is outside modalOverlay
    globalThis.document.activeElement = outsideButton;
    closeBtn.focusCalled = false;
    let fallbackPrevented = false;
    keydownHandler({
      key: 'Tab',
      shiftKey: false,
      preventDefault: () => { fallbackPrevented = true; }
    });
    assert.equal(fallbackPrevented, true, 'Tab when focus is outside modal must prevent default');
    assert.equal(closeBtn.focusCalled, true, 'Tab when focus is outside modal must return focus to first focusable element');

    // Shift+Tab on first element wraps to last
    globalThis.document.activeElement = closeBtn; // first element
    let defaultPrevented = false;
    keydownHandler({
      key: 'Tab',
      shiftKey: true,
      preventDefault: () => { defaultPrevented = true; }
    });
    assert.equal(defaultPrevented, true, 'Shift+Tab on first focusable element should prevent default');
    assert.equal(submitBtn.focusCalled, true, 'Shift+Tab should wrap focus to last element');

    // Tab on last element wraps to first
    globalThis.document.activeElement = submitBtn; // last element
    defaultPrevented = false;
    closeBtn.focusCalled = false;
    keydownHandler({
      key: 'Tab',
      shiftKey: false,
      preventDefault: () => { defaultPrevented = true; }
    });
    assert.equal(defaultPrevented, true, 'Tab on last focusable element should prevent default');
    assert.equal(closeBtn.focusCalled, true, 'Tab should wrap focus to first element');

    // 3. Escape key closes modal
    keydownHandler({ key: 'Escape' });
    assert.equal(state.get('isModalOpen'), false, 'Escape key should close modal');
    assert.equal(mockOverlay.getAttribute('aria-hidden'), 'true');
    assert.equal(overlayClasses.has('open'), false);
    assert.equal(globalThis.document.body.style.overflow, '');
    assert.equal(outsideButton.focusCalled, true, 'Focus should be restored to previously focused element');

    // 4. Backdrop click closes modal
    openModal();
    assert.equal(state.get('isModalOpen'), true);
    overlayListeners['click']({ target: mockOverlay });
    assert.equal(state.get('isModalOpen'), false, 'Clicking overlay backdrop should close modal');

    // 5. Clicking inside modal container does NOT close modal
    openModal();
    assert.equal(state.get('isModalOpen'), true);
    overlayListeners['click']({ target: {} }); // clicked inside
    assert.equal(state.get('isModalOpen'), true, 'Clicking inside modal should NOT close modal');

    // 6. Close button 1 click closes modal
    closeBtn.listeners['click']();
    assert.equal(state.get('isModalOpen'), false, 'Clicking close button 1 should close modal');

    // 7. Multiple close buttons: Close button 2 click also closes modal
    openModal();
    assert.equal(state.get('isModalOpen'), true);
    secondCloseBtn.listeners['click']();
    assert.equal(state.get('isModalOpen'), false, 'Clicking close button 2 should also close modal');

  } finally {
    globalThis.document = originalDoc;
  }
});

test('Task 10: Form submission resets form, closes modal, and triggers toast', async () => {
  const { initModal, openModal, showToast, _resetModalInit } = await import('../js/modules/modal.js');

  if (typeof _resetModalInit === 'function') _resetModalInit();

  const originalDoc = globalThis.document;

  const toastAppended = [];
  const mockToastContainer = {
    appendChild: (child) => toastAppended.push(child)
  };

  const overlayClasses = new Set();
  const formListeners = {};
  const submitBtn = {
    textContent: 'Request Sandbox Access',
    disabled: false
  };

  let formReset = false;
  const mockForm = {
    addEventListener: (event, fn) => { formListeners[event] = fn; },
    querySelector: (sel) => (sel.includes('submit') ? submitBtn : null),
    reset: () => { formReset = true; }
  };

  const mockOverlay = {
    classList: {
      add: (c) => overlayClasses.add(c),
      remove: (c) => overlayClasses.delete(c),
      contains: (c) => overlayClasses.has(c)
    },
    setAttribute: () => {},
    getAttribute: () => 'true',
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  };

  globalThis.document = {
    body: { style: { overflow: '' }, appendChild: () => {} },
    activeElement: null,
    getElementById: (id) => {
      if (id === 'demo-modal') return mockOverlay;
      if (id === 'demo-form') return mockForm;
      if (id === 'toast-container') return mockToastContainer;
      return null;
    },
    createElement: (tag) => {
      const el = {
        tagName: tag.toUpperCase(),
        className: '',
        style: {},
        innerHTML: '',
        appendChild: () => {},
        remove: () => {}
      };
      return el;
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  };

  try {
    initModal();
    openModal();

    let prevented = false;
    formListeners['submit']({
      preventDefault: () => { prevented = true; }
    });

    assert.equal(prevented, true, 'Form submit must prevent default');
    assert.equal(submitBtn.disabled, true, 'Submit button must be disabled during submission');
    assert.ok(submitBtn.textContent.includes('Provisioning'), 'Submit button must show Provisioning state');

    // Wait for the simulated async timeout (700ms in implementation)
    await new Promise((resolve) => setTimeout(resolve, 800));

    assert.equal(submitBtn.disabled, false, 'Submit button must be re-enabled after completion');
    assert.equal(formReset, true, 'Form must be reset after completion');
    assert.equal(overlayClasses.has('open'), false, 'Modal should be closed after submission');
    assert.ok(toastAppended.length >= 1, 'A toast notification should be appended');
    assert.ok(toastAppended[0].className.includes('toast'), 'Toast must have .toast class');
  } finally {
    globalThis.document = originalDoc;
  }
});

test('Task 10: showToast sanitizes message via textContent (XSS defense)', async () => {
  const { showToast } = await import('../js/modules/modal.js');

  const originalDoc = globalThis.document;
  const toastAppended = [];
  const mockToastContainer = {
    appendChild: (child) => toastAppended.push(child)
  };

  const createdElements = [];
  globalThis.document = {
    body: { appendChild: () => {} },
    getElementById: (id) => (id === 'toast-container' ? mockToastContainer : null),
    createElement: (tag) => {
      const el = {
        tagName: tag.toUpperCase(),
        children: [],
        className: '',
        style: {},
        innerHTML: '',
        textContent: '',
        appendChild: (child) => el.children.push(child),
        remove: () => {}
      };
      createdElements.push(el);
      return el;
    }
  };

  try {
    const maliciousPayload = '<img src=x onerror="alert(1)"> & <script>alert("hack")</script>';
    showToast(maliciousPayload, 'success');

    assert.equal(toastAppended.length, 1);
    const toast = toastAppended[0];

    // Verify innerHTML only contains SVG and does not contain the unescaped script tag
    assert.ok(!toast.innerHTML.includes('<script>'), 'toast innerHTML must not contain unescaped script tag');
    assert.ok(!toast.innerHTML.includes('onerror'), 'toast innerHTML must not contain unescaped onerror handler');

    // Verify textContent of the appended span child holds the raw payload safely
    const spanChild = toast.children.find((c) => c.tagName === 'SPAN');
    assert.ok(spanChild, 'Toast must append a text span element');
    assert.equal(spanChild.textContent, maliciousPayload, 'Span textContent must be set directly to the message');
  } finally {
    globalThis.document = originalDoc;
  }
});

