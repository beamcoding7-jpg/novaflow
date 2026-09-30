# NovaFlow — Intelligent Financial Operations & Global Treasury Platform

> **A production-grade, senior-crafted FinTech SaaS landing page built exclusively with pure semantic HTML5, modular CSS3, and modern Vanilla JavaScript (ES6+ Modules).**  
> Zero third-party runtime UI or charting dependencies. 100% native web standards.

[![Tests](https://img.shields.io/badge/Tests-50%2F50%20Passing-emerald?style=flat-square)](file:///home/boriphat/Projects/novaflow/tests)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA%20Compliant-blue?style=flat-square)]()
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20ES6%2B-indigo?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)]()

---

## 🌟 Overview & Key Features

NovaFlow delivers an enterprise-grade web experience inspired by modern FinTech leaders (such as Wise, Revolut, Stripe, and Mercury). Engineered to showcase **Senior Frontend Craftsmanship**, the codebase emphasizes modular design, decoupled state management, strict accessibility, and high performance.

### 🎨 1. Zero-FOUC Dual Themes (Light & Dark Mode)
- **Light Theme (Default):** Clean Corporate FinTech with crisp cobalt blue (`#2563EB`), emerald green (`#10B981`), and high-contrast slate.
- **Dark Theme:** Midnight Obsidian (`#080D1A`) with ambient glow and luminous accents.
- **Zero Flash of Unstyled Content (FOUC):** An inline script in `<head>` detects stored user preferences or OS `prefers-color-scheme` synchronously before first paint.

### 📈 2. Custom Vanilla SVG Chart Engine
- Pure mathematical **Cubic Bezier Curve** generator (`generateBezierCurvePath`) rendering responsive, fluid area charts with zero external charting libraries (no Chart.js or D3).
- Gradient fills, coordinate mapping, and dynamic path interpolation across **7D**, **30D**, and **1Y** timeframes.

### ⚡ 3. Live Interactive Hero Dashboard
- Live Treasury Balance (`$12,458,920.40`) and dynamic 24h delta calculations.
- W3C APG compliant timeframe tabs supporting full keyboard navigation (`ArrowLeft`, `ArrowRight`, `Home`, `End`) with roving tabindex.

### 🧮 4. Interactive ROI & Savings Simulator
- Dual custom range sliders controlling **Monthly Volume** ($50K–$10M) and **Manual Finance Hours** (10–200 hrs/mo).
- Real-time financial calculations for projected annual savings, monthly hours saved, and payback duration with dynamic CSS variable slider fill tracks (`--slider-progress`).

### 🍱 5. Asymmetric Bento Grid & Animated Stats
- 4-card modern Bento Grid detailing multi-currency clearing, AI anomaly detection, zero-touch reconciliation, and financial APIs.
- High-performance `IntersectionObserver` number ticker with cubic ease-out acceleration and full `@media (prefers-reduced-motion: reduce)` respect.

### 💳 6. Transparent Pricing Switcher & Testimonials
- Interactive billing switch between **Monthly** and **Annual (Save 20%)** with animated price flips and annual breakdown helper text.
- Customer review cards with accessible star ratings (`role="img"` and `aria-hidden` glyphs).

### 💬 7. Accessible Smooth FAQ Accordion
- Modern **Pure CSS Grid Height Transition** (`grid-template-rows: 0fr` to `1fr`), eliminating JavaScript height calculations and layout thrashing.
- Fully keyboard navigable with circular wrap-around and W3C APG semantic heading wrappers (`<h3>`).

### 🛡️ 8. Focus-Trapped Modal & XSS-Sanitized Toast
- Demo booking dialog with complete **Focus Trap** (cycling `Tab` / `Shift+Tab`, closing on `Escape`, and restoring focus to the trigger element).
- Floating toast notification system with defense-in-depth sanitization via `textContent`.

---

## 📂 Project Structure

```text
novaflow/
├── index.html                   # Semantic HTML5 with SEO & OpenGraph metadata
├── .gitignore                   # Git ignore specifications
├── README.md                    # Project documentation
├── css/
│   ├── tokens.css               # Design Tokens: CSS Custom Properties (Light/Dark)
│   ├── base.css                 # CSS Reset, typography, accessibility base
│   ├── layout.css               # Grid system, container constraints, flex helpers
│   ├── components.css           # Core components (Buttons, Badges, Cards, Bento, Navbar)
│   ├── modules/
│   │   ├── hero-dashboard.css   # Hero dashboard preview & SVG chart styles
│   │   ├── roi-calculator.css   # Custom range slider & dynamic metrics
│   │   ├── pricing.css          # Pricing cards, toggle switcher & testimonials
│   │   ├── accordion.css        # Smooth CSS Grid FAQ accordion
│   │   └── modal-toast.css      # W3C APG Modal dialog & floating toast alerts
│   └── utilities.css            # Screen reader helpers (.sr-only) & display utilities
├── js/
│   ├── main.js                  # Application bootstrap & module coordinator
│   ├── core/
│   │   ├── event-bus.js         # Decoupled EventTarget PubSub dispatcher
│   │   └── state.js             # Central reactive state store
│   ├── modules/
│   │   ├── theme.js             # Zero-FOUC theme switcher with localStorage sync
│   │   ├── navigation.js        # Sticky navbar, scroll spy & mobile drawer
│   │   ├── dashboard.js         # Live dashboard preview & timeframe tabs
│   │   ├── calculator.js        # Dynamic ROI & savings formula
│   │   ├── pricing.js           # Monthly/annual pricing switcher
│   │   ├── stats.js             # IntersectionObserver animated number counters
│   │   ├── accordion.js         # WAI-ARIA keyboard-friendly FAQ accordion
│   │   └── modal.js             # Focus-trapped demo booking modal & toast alerts
│   └── utils/
│       ├── chart-engine.js      # Pure Vanilla SVG cubic bezier path generator
│       └── formatters.js        # Intl.NumberFormat currency & compact number helpers
└── tests/                       # Automated test suite (11 suites, 50 tests)
    ├── task1-foundation.test.js
    ├── task2-core.test.js
    ├── task3-chart.test.js
    ├── task4-nav-theme.test.js
    ├── task5-dashboard.test.js
    ├── task6-bento-stats.test.js
    ├── task7-calculator.test.js
    ├── task8-pricing.test.js
    ├── task9-accordion.test.js
    ├── task10-modal-main.test.js
    └── task11-e2e.test.js
```

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge).
- Python 3 or Node.js (for running a local HTTP server to satisfy native ES6 module CORS security policies).

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/beamcoding7-jpg/novaflow.git
   cd novaflow
   ```

2. **Start a local development server:**
   - **Using Python:**
     ```bash
     python3 -m http.server 3000
     ```
   - **Or using Node.js / npx:**
     ```bash
     npx serve -l 3000
     ```

3. **Open in your browser:**
   ```text
   http://localhost:3000
   ```

---

## 🧪 Automated Testing

The project includes 50 comprehensive unit and integration tests written with Node.js's native test runner (`node:test` and `node:assert/strict`), requiring zero external test dependencies.

To execute the full test suite:
```bash
node --test tests/*.test.js
```

**Test Coverage Highlights:**
- DOM and ARIA attributes audit.
- Bezier curve coordinate calculations and mathematical smoothing.
- State store subscription, immutability, and EventBus lifecycle.
- Boundary conditions, clamp tests, and zero-division guards in financial formulas.
- Focus trap behavior, keydown navigation (`Tab`, `Escape`, `Arrow` keys), and form validation.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
