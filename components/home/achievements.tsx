"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DecoderText } from "@/components/decoder-text";
import { AnimatedIcon } from "@/components/animated-icon";
import { RevealLine } from "@/components/reveal-line";

const milestones = [
  {
    iconName: "cube" as const,
    target: 10,
    suffix: "+",
    label: "Projects Completed",
    desc: "Fullstack apps, ML systems, and real-time platforms shipped.",
  },
  {
    iconName: "atom" as const,
    target: 100,
    suffix: "+",
    label: "LeetCode Problems",
    desc: "Consistent algorithmic practice across arrays, graphs & DP.",
  },
  {
    iconName: "synapse" as const,
    target: 4,
    suffix: "+",
    label: "Years of Development",
    desc: "From first HTML page to production-ready systems.",
  },
];

export function Achievements() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const renderSplitHeading = (text: string) => {
    return text.split(" ").map((word, wIdx) => (
      <span
        key={wIdx}
        className="inline-block overflow-hidden relative pb-2 mr-3 last:mr-0 group/word"
      >
        {word.split("").map((char, cIdx) => (
          <span
            key={cIdx}
            className="char-letter inline-block translate-y-[110%] select-none"
          >
            {char}
          </span>
        ))}
        <div className="sweep-line absolute bottom-0 left-0 h-[2.5px] bg-primary w-0" />
      </span>
    ));
  };

  /* GSAP: section header reveal & counter physics */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const chars = section.querySelectorAll(".char-letter");
      const sweeps = section.querySelectorAll(".sweep-line");
      const label = section.querySelector(".section-label");

      if (chars.length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        tl.to(chars, {
          y: "0%",
          duration: 0.55,
          stagger: 0.02,
          ease: "power3.out",
        });

        tl.to(
          sweeps,
          {
            width: "100%",
            duration: 0.45,
            ease: "power2.inOut",
          },
          "-=0.25",
        );
      }

      if (label) {
        gsap.fromTo(
          label,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
            },
          },
        );

        // Scroll Parallax on label
        gsap.to(label, {
          yPercent: 16,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Counters reveal
      const countNodes = section.querySelectorAll(".stat-num");
      countNodes.forEach((node) => {
        const target = parseFloat(node.getAttribute("data-target") || "0");
        const counterObj = { value: 0 };
        gsap.to(counterObj, {
          value: target,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 88%",
          },
          onUpdate: () => {
            node.textContent = Math.floor(counterObj.value).toString();
          },
        });
      });

      // Milestone cards entrance fade stagger
      const cards = section.querySelectorAll(".milestone-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
          },
        },
      );

      // Hover watermark shift effects
      cards.forEach((card) => {
        const watermark = card.querySelector(".card-watermark");
        if (!watermark) return;

        card.addEventListener("mouseenter", () => {
          gsap.to(watermark, {
            y: -14,
            duration: 0.5,
            ease: "back.out(2.2)", // bouncy spring effect
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(watermark, {
            y: 0,
            duration: 0.45,
            ease: "power2.out",
          });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 px-6 md:px-12 lg:px-20 relative bg-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Animated Blueprint divider reveal line */}
        <RevealLine className="mb-16" />

        {/* Header */}
        <div className="mb-16">
          <p className="section-label mb-3 opacity-0 font-mono text-[11px] uppercase tracking-widest text-primary/70 font-semibold">
            <DecoderText text="BY THE NUMBERS" delay={0.2} />
          </p>
          <h2
            className="font-display font-black text-5xl md:text-7xl leading-none flex flex-wrap"
            style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)" }}
          >
            {renderSplitHeading("Milestones")}
          </h2>
        </div>

        {/* Milestone technical grid dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60 border border-border/60 bg-black/10 relative overflow-hidden">
          {milestones.map((m, i) => (
            <div
              key={m.label}
              className="milestone-card group relative p-8 md:p-10 flex flex-col justify-between transition-colors duration-500 overflow-hidden bg-background/5 min-h-[320px] opacity-0"
            >


              {/* Huge number & icon overlay */}
              <div className="relative my-8 flex items-baseline justify-between">
                <p className="font-display font-black text-6xl md:text-7xl lg:text-8xl text-foreground group-hover:text-primary transition-colors duration-500 tabular-nums select-none">
                  <span className="stat-num" data-target={m.target}>
                    0
                  </span>
                  <span className="text-primary">{m.suffix}</span>
                </p>
                <AnimatedIcon name={m.iconName} className="h-6 w-6 text-muted-foreground/30 group-hover:text-primary transition-all duration-500" />
              </div>

              {/* Text metadata */}
              <div className="relative z-10">
                <p className="font-mono text-[11px] uppercase tracking-wider text-foreground mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  {m.label}
                </p>
                <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-[90%]">
                  {m.desc}
                </p>
              </div>

              {/* Interactive background watermark index */}
              <span
                aria-hidden
                className="card-watermark absolute bottom-2 right-2 font-mono font-black text-[3.8rem] leading-none text-foreground/[0.015] select-none pointer-events-none"
              >
                0{i + 1}
              </span>

              {/* Specular Glare overlay on hover */}
              <div className="glare-overlay absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-primary/5 via-transparent to-transparent" />

              {/* Bottom dynamic light line */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-[width] duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
