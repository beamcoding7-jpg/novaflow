import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { initAccordion, _resetAccordionInit } from '../js/modules/accordion.js';

test('Task 9: CSS defines grid-template-rows smooth accordion animation and complete styling', () => {
  const css = fs.readFileSync('css/modules/accordion.css', 'utf-8');

  // FAQ Accordion styles
  assert.ok(css.includes('grid-template-rows: 0fr'), 'accordion.css must use 0fr for collapsed state');
  assert.ok(css.includes('grid-template-rows: 1fr'), 'accordion.css must use 1fr for expanded state');
  assert.ok(css.includes('.faq-list'), 'CSS must define .faq-list');
  assert.ok(css.includes('.faq-item'), 'CSS must define .faq-item');
  assert.ok(css.includes('.faq-item.open'), 'CSS must define .faq-item.open');
  assert.ok(css.includes('.faq-trigger'), 'CSS must define .faq-trigger');
  assert.ok(css.includes('.faq-chevron'), 'CSS must define .faq-chevron');
  assert.ok(css.includes('.faq-content-wrapper'), 'CSS must define .faq-content-wrapper');
  assert.ok(css.includes('.faq-content-inner'), 'CSS must define .faq-content-inner');
  assert.ok(css.includes('.faq-answer'), 'CSS must define .faq-answer');

  // Closing CTA Banner styles
  assert.ok(css.includes('.cta-banner'), 'CSS must define .cta-banner');
  assert.ok(css.includes('.cta-banner__title'), 'CSS must define .cta-banner__title');
  assert.ok(css.includes('.cta-banner__desc'), 'CSS must define .cta-banner__desc');

  // Footer styles
  assert.ok(css.includes('.footer'), 'CSS must define .footer');
  assert.ok(css.includes('.footer__grid'), 'CSS must define .footer__grid');
  assert.ok(css.includes('.footer__col-title'), 'CSS must define .footer__col-title');
  assert.ok(css.includes('.footer__links'), 'CSS must define .footer__links');
  assert.ok(css.includes('.footer__link'), 'CSS must define .footer__link');
  assert.ok(css.includes('.footer__bottom'), 'CSS must define .footer__bottom');

  // Motion sensitivity
  assert.ok(css.includes('prefers-reduced-motion'), 'CSS must respect prefers-reduced-motion');
});

test('Task 9: index.html contains FAQ accordion, Closing CTA banner, and 4-column Footer with required markup', () => {
  const html = fs.readFileSync('index.html', 'utf-8');

  // FAQ Section & Header
  assert.ok(html.includes('id="faq"'), 'index.html must include section with id="faq"');
  assert.ok(html.includes('class="faq-list"'), 'index.html must include .faq-list');

  // Verify at least 5 FAQ items with data-accordion-trigger
  const triggerMatches = html.match(/data-accordion-trigger/g) || [];
  assert.ok(triggerMatches.length >= 5, `index.html must include at least 5 FAQ items, found ${triggerMatches.length}`);

  // WAI-ARIA and accessibility attributes on FAQ
  assert.ok(html.includes('aria-expanded="false"'), 'FAQ triggers must initially have aria-expanded="false"');
  assert.ok(html.includes('aria-controls="'), 'FAQ triggers must declare aria-controls');
  assert.ok(html.includes('role="region"'), 'FAQ answer wrappers must specify role="region"');
  assert.ok(html.includes('aria-labelledby="'), 'FAQ answer regions must declare aria-labelledby');

  // FAQ Topics Coverage
  assert.ok(/SOC\s*2|encryption|security|AES-256/i.test(html), 'FAQ must cover data encryption and security compliance');
  assert.ok(/ERP|NetSuite|SAP|accounting/i.test(html), 'FAQ must cover ERP and accounting integrations');
  assert.ok(/99\.99%|uptime|SLA|availability/i.test(html), 'FAQ must cover uptime guarantee and SLA');
  assert.ok(/multi-currency|currencies|foreign exchange|rails|SEPA/i.test(html), 'FAQ must cover multi-currency and payment rails');
  assert.ok(/migration|onboarding|timeline|implementation/i.test(html), 'FAQ must cover migration timeline');

  // Closing CTA Banner
  assert.ok(html.includes('cta-banner'), 'index.html must contain .cta-banner');
  assert.ok(html.includes('cta-banner__title'), 'index.html must contain .cta-banner__title');
  assert.ok(html.includes('cta-banner__desc'), 'index.html must contain .cta-banner__desc');

  // 4-Column Footer
  assert.ok(html.includes('class="footer"'), 'index.html must contain .footer');
  assert.ok(html.includes('footer__grid'), 'index.html must contain .footer__grid');
  assert.ok(/Product/i.test(html), 'Footer must contain Product column');
  assert.ok(/Solutions/i.test(html), 'Footer must contain Solutions column');
  assert.ok(/Company/i.test(html), 'Footer must contain Company column');
  assert.ok(/Legal/i.test(html), 'Footer must contain Legal column');
  assert.ok(html.includes('footer__bottom'), 'Footer must contain .footer__bottom');
  assert.ok(/NovaFlow.*All rights reserved/i.test(html), 'Footer must contain copyright notice');
  assert.ok(/operational|systems operational|status/i.test(html), 'Footer must include operational status indicator');
});

test('Task 9: js/modules/accordion.js initAccordion handles click toggle, single-open behavior, ARIA attributes, and keyboard navigation', () => {
  _resetAccordionInit();

  // Test graceful handling when document is missing or empty
  const originalDoc = globalThis.document;
  globalThis.document = {
    querySelectorAll: () => []
  };

  assert.doesNotThrow(() => {
    initAccordion();
  }, 'initAccordion must not throw when elements are not present');

  _resetAccordionInit();

  // Setup mock DOM for 3 accordion items
  const triggers = [];
  const items = [];

  for (let i = 0; i < 3; i++) {
    const itemClassList = new Set(['faq-item']);
    const triggerAttrs = {
      'aria-expanded': 'false',
      'aria-controls': `faq-answer-${i}`,
      'id': `faq-trigger-${i}`
    };
    const triggerListeners = {};

    let isFocused = false;

    const mockItem = {
      classList: {
        add: (c) => itemClassList.add(c),
        remove: (c) => itemClassList.delete(c),
        toggle: (c, force) => {
          if (force !== undefined) {
            if (force) itemClassList.add(c);
            else itemClassList.delete(c);
            return force;
          }
          if (itemClassList.has(c)) {
            itemClassList.delete(c);
            return false;
          }
          itemClassList.add(c);
          return true;
        },
        contains: (c) => itemClassList.has(c)
      },
      querySelector: (selector) => {
        if (selector === '[data-accordion-trigger]') return mockTrigger;
        return null;
      }
    };

    const mockTrigger = {
      closest: (selector) => {
        if (selector === '.faq-item') return mockItem;
        return null;
      },
      setAttribute: (k, v) => { triggerAttrs[k] = String(v); },
      getAttribute: (k) => triggerAttrs[k],
      hasAttribute: (k) => k in triggerAttrs,
      addEventListener: (evt, fn) => {
        triggerListeners[evt] = triggerListeners[evt] || [];
        triggerListeners[evt].push(fn);
      },
      dispatchEvent: (evt) => {
        const handlers = triggerListeners[evt.type] || [];
        for (const h of handlers) h(evt);
      },
      focus: () => {
        triggers.forEach(t => { t._isFocused = false; });
        mockTrigger._isFocused = true;
      },
      _isFocused: false,
      _listeners: triggerListeners
    };

    items.push(mockItem);
    triggers.push(mockTrigger);
  }

  globalThis.document = {
    querySelectorAll: (selector) => {
      if (selector === '[data-accordion-trigger]') return triggers;
      if (selector === '.faq-item') return items;
      return [];
    }
  };

  initAccordion();

  // Test 1: Click first trigger -> opens item 0
  const clickEvent0 = { type: 'click', preventDefault: () => {} };
  triggers[0].dispatchEvent(clickEvent0);

  assert.equal(items[0].classList.contains('open'), true, 'Item 0 should be open after click');
  assert.equal(triggers[0].getAttribute('aria-expanded'), 'true', 'Trigger 0 aria-expanded should be true');
  assert.equal(items[1].classList.contains('open'), false, 'Item 1 should remain closed');

  // Test 2: Click second trigger -> opens item 1, closes item 0
  const clickEvent1 = { type: 'click', preventDefault: () => {} };
  triggers[1].dispatchEvent(clickEvent1);

  assert.equal(items[0].classList.contains('open'), false, 'Item 0 should be closed when Item 1 is clicked');
  assert.equal(triggers[0].getAttribute('aria-expanded'), 'false', 'Trigger 0 aria-expanded should be false');
  assert.equal(items[1].classList.contains('open'), true, 'Item 1 should be open');
  assert.equal(triggers[1].getAttribute('aria-expanded'), 'true', 'Trigger 1 aria-expanded should be true');

  // Test 3: Click second trigger again -> toggles closed
  triggers[1].dispatchEvent(clickEvent1);
  assert.equal(items[1].classList.contains('open'), false, 'Item 1 should be closed on second click');
  assert.equal(triggers[1].getAttribute('aria-expanded'), 'false', 'Trigger 1 aria-expanded should be false');

  // Test 4: Keyboard navigation - ArrowDown moves focus from index 0 to 1
  let defaultPrevented = false;
  const arrowDownEvent = {
    type: 'keydown',
    key: 'ArrowDown',
    preventDefault: () => { defaultPrevented = true; }
  };
  triggers[0].dispatchEvent(arrowDownEvent);
  assert.equal(triggers[1]._isFocused, true, 'ArrowDown from trigger 0 should focus trigger 1');
  assert.equal(defaultPrevented, true, 'ArrowDown should call preventDefault');

  // Test 5: Keyboard navigation - ArrowDown wrap from last trigger (2) to first (0)
  defaultPrevented = false;
  triggers[2].dispatchEvent(arrowDownEvent);
  assert.equal(triggers[0]._isFocused, true, 'ArrowDown from trigger 2 should wrap focus to trigger 0');

  // Test 6: Keyboard navigation - ArrowUp wrap from first trigger (0) to last (2)
  defaultPrevented = false;
  const arrowUpEvent = {
    type: 'keydown',
    key: 'ArrowUp',
    preventDefault: () => { defaultPrevented = true; }
  };
  triggers[0].dispatchEvent(arrowUpEvent);
  assert.equal(triggers[2]._isFocused, true, 'ArrowUp from trigger 0 should wrap focus to trigger 2');

  // Test 7: Keyboard navigation - Home moves to first (0), End moves to last (2)
  const homeEvent = {
    type: 'keydown',
    key: 'Home',
    preventDefault: () => {}
  };
  triggers[2].dispatchEvent(homeEvent);
  assert.equal(triggers[0]._isFocused, true, 'Home key should focus first trigger');

  const endEvent = {
    type: 'keydown',
    key: 'End',
    preventDefault: () => {}
  };
  triggers[0].dispatchEvent(endEvent);
  assert.equal(triggers[2]._isFocused, true, 'End key should focus last trigger');

  // Cleanup
  globalThis.document = originalDoc;
});
