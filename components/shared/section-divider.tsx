"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function SectionDivider() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  /* ── GSAP: Line & Badge Reveal Animation ── */
  useGSAP(
    () => {
      const badge = badgeRef.current;
      const line = lineRef.current;
      if (!badge || !line) return;

      const particles = badge.querySelectorAll<HTMLElement>(".spark");
      gsap.set(particles, { x: 0, y: 0, scale: 0, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: badge,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        line,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: "power3.inOut" }
      );

      tl.fromTo(
        badge,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
        "-=0.4"
      );

      const angles = [0, 45, 90, 135, 180, 225, 270, 315];
      particles.forEach((p, i) => {
        const angle = (angles[i] * Math.PI) / 180;
        const dist = 28 + Math.random() * 12;
        tl.to(
          p,
          {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            scale: 1,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          "-=0.15"
        );
        tl.to(
          p,
          { opacity: 0, scale: 0, duration: 0.4, ease: "power2.in" },
          "-=0.05"
        );
      });
    },
    { scope: badgeRef }
  );

  return (
    <div className="w-full relative py-4 sm:py-6 bg-transparent select-none pointer-events-none z-30">
      <div className="w-full relative flex items-center justify-center">
        {/* Soft background glow pulse */}
        <div className="absolute inset-x-0 h-4 bg-primary/10 blur-md rounded-full pointer-events-none" />

        {/* The main line — drawn by GSAP scaleX */}
        <div
          ref={lineRef}
          className="w-full h-[3px] bg-primary origin-center shadow-[0_0_18px_rgba(217,40,28,0.85),0_0_6px_rgba(217,40,28,0.9)]"
          style={{ transform: "scaleX(0)" }}
        />

        {/* Center badge with spark particles */}
        <div
          ref={badgeRef}
          className="absolute"
          style={{ opacity: 0 }}
        >
          {/* The 8 spark particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="spark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rotate-45 shadow-[0_0_6px_#D9281C]"
              style={{ opacity: 0 }}
            />
          ))}

          {/* Badge body */}
          <div className="relative bg-background/95 backdrop-blur-md px-6 py-2 border-2 border-primary shadow-[0_4px_24px_rgba(217,40,28,0.4)] flex items-center gap-3">
            <span className="w-3 h-3 bg-primary rotate-45 shadow-[0_0_8px_#D9281C]" />
            <span className="w-2 h-2 bg-primary/70 rounded-full" />
            <span className="w-3 h-3 bg-primary rotate-45 shadow-[0_0_8px_#D9281C]" />
          </div>
        </div>
      </div>
    </div>
  );
}
