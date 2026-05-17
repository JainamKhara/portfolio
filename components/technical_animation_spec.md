# Technical Animation Spec: Premium CAD Blueprint Animation Suite

This document establishes the architecture, design tokens, and implementation specifications for the high-impact portfolio animation suite.

---

## 1. Core Architecture & Components

We will introduce four highly optimized React component files inside the components directory:

### A. CAD Crosshair Follower (`cad-crosshair.tsx`)

A viewport-level overlay that renders thin crosshairs (1px Vermilion lines with low opacity) centered on the cursor, accompanied by live coordinate text.

- **Trigger**: Desktop mouse movements (`mousemove`).
- **Optimization**: Direct DOM reflow bypass. Instead of rendering cursor coordinates through React state, we bind a listener that directly updates the absolute elements' `style.transform` properties utilizing hardware-accelerated `translate3d(x, y, 0)`.
- **Mobile-Filter**: Check if the device has hover support (`(hover: hover)` media query) and unmount completely on mobile viewports.

### B. Typographic Glitch Decoder (`decoder-text.tsx`)

A reusable heading component that scrambles random characters before locking onto the final text.

- **Trigger**: Entry into the viewport (using Framer Motion `useInView` or standard intersection observers).
- **Characters**: Alphanumeric and technical blueprint glyphs (`█`, `[`, `]`, `_`, `//`, `0`, `1`).
- **Hydration Safety**: Mounts cleanly as a client-only execution post-hydration to avoid Next.js server-side markup mismatches.
- **Accessibility**: Includes the fully resolved static string inside an `aria-label` attribute to remain fully readable by screen readers.

### C. SVG Wireframe Line-Tracing Icons (`animated-icon.tsx`)

Interactive, vector icons housing outline drawings of technical themes.

- **Trigger**: Mount or container hover.
- **Optimization**: Uses native SVG path `stroke-dasharray` and `stroke-dashoffset` parameters driven by CSS transitions, maintaining zero CPU overhead.

### D. Architectural Reveal Line (`reveal-line.tsx`)

A structural coordinate grid line that animates its size horizontally when scrolled into view.

- **Trigger**: Viewport intersection.
- **Implementation**: Framer Motion `<motion.div>` scaling from 0 to 1 with an elegant `easeOutPower4` curve.

---

## 2. Decision Log

| Decision | Alternatives | Why Chosen |
| :--- | :--- | :--- |
| **Approach 1 (Modular React + Framer)** | Centralized GSAP scroll orchestration timeline | Exceptional performance, easy modular imports, Next.js hydration friendly. |
| **translate3d layout positioning** | Top/left styling adjustments | Avoids browser layout reflows; renders entirely on GPU at a locked 60fps. |
| **Client-side only mounting for Decoders** | Server-side text scrambling | Prevents Next.js rendering mismatches on mount. |

---

## 3. Verification Plan

1. **FPS Profiling**: Inspect framerates during intensive mouse movements over WebGL canvas to ensure the crosshairs do not trigger frame drops.
2. **Accessibility Audits**: Verify that screen-reading software reads the resolved headings cleanly.
3. **Responsive Testing**: Confirm the crosshairs automatically unmount on viewports without mouse/hover capability.
