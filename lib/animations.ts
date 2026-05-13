/**
 * Shared GSAP animation utilities
 * Central place for all reusable scroll-driven animation patterns
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
export { useGSAP } from "@gsap/react";

// ── Char-by-char text scramble reveal ──────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export function scrambleText(
  el: HTMLElement,
  finalText: string,
  duration = 1000,
  onComplete?: () => void,
) {
  let frame = 0;
  const totalFrames = Math.round((duration / 1000) * 60);
  let raf: number;

  const tick = () => {
    frame++;
    const progress = frame / totalFrames;
    const revealedChars = Math.floor(progress * finalText.length);

    el.textContent =
      finalText.slice(0, revealedChars) +
      Array.from({ length: finalText.length - revealedChars }, () =>
        CHARS[Math.floor(Math.random() * CHARS.length)],
      ).join("");

    if (frame < totalFrames) {
      raf = requestAnimationFrame(tick);
    } else {
      el.textContent = finalText;
      onComplete?.();
    }
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

// ── GSAP scroll reveal batch ────────────────────────────────────────────
export function initScrollReveal(scope: HTMLElement | null) {
  if (!scope) return;

  // Fade + slide up
  ScrollTrigger.batch(scope.querySelectorAll("[data-reveal]"), {
    onEnter: (els) => {
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
      });
    },
    start: "top 88%",
  });

  // Left reveals
  ScrollTrigger.batch(scope.querySelectorAll("[data-reveal-left]"), {
    onEnter: (els) => {
      gsap.to(els, {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
      });
    },
    start: "top 88%",
  });

  // Right reveals
  ScrollTrigger.batch(scope.querySelectorAll("[data-reveal-right]"), {
    onEnter: (els) => {
      gsap.to(els, {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
      });
    },
    start: "top 88%",
  });

  // Scale reveals
  ScrollTrigger.batch(scope.querySelectorAll("[data-reveal-scale]"), {
    onEnter: (els) => {
      gsap.to(els, {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.5)",
        stagger: 0.08,
      });
    },
    start: "top 88%",
  });
}

// ── Set initial hidden states ───────────────────────────────────────────
export function setRevealDefaults(scope: HTMLElement | null) {
  if (!scope) return;
  gsap.set(scope.querySelectorAll("[data-reveal]"),       { opacity: 0, y: 50 });
  gsap.set(scope.querySelectorAll("[data-reveal-left]"),  { opacity: 0, x: -60 });
  gsap.set(scope.querySelectorAll("[data-reveal-right]"), { opacity: 0, x: 60 });
  gsap.set(scope.querySelectorAll("[data-reveal-scale]"), { opacity: 0, scale: 0.85 });
}

// ── Parallax helper ──────────────────────────────────────────────────────
export function addParallax(el: HTMLElement | null, speed = 0.2) {
  if (!el) return;
  ScrollTrigger.create({
    trigger: el,
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      gsap.set(el, { y: self.progress * speed * 120 - speed * 60 });
    },
  });
}
