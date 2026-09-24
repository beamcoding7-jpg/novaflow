/**
 * NovaFlow Stats Counter Module
 * Uses IntersectionObserver for high-performance viewport trigger
 * with ease-out cubic numeric animation.
 */
export function initStatsCounter() {
  const statElements = document.querySelectorAll('[data-counter-target]');
  if (!statElements.length) return;

  // Fallback for environments lacking IntersectionObserver (e.g., headless Node tests)
  if (typeof IntersectionObserver === 'undefined') {
    statElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-counter-target')) || 0;
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
      el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
    });
    return;
  }

  // Respect user's motion preferences
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  statElements.forEach(el => observer.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-counter-target'));
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);

    // If reduced motion is requested, instantly set target without animation
    if (prefersReducedMotion) {
      el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      return;
    }

    const duration = 1600;
    const start = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

    function update(now) {
      const currentTime = typeof now === 'number' ? now : ((typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now());
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic: 1 - (1 - progress)^3
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;

      el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(update);
        } else {
          el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
        }
      } else {
        el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      }
    }

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(update);
    } else {
      el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
    }
  }
}
