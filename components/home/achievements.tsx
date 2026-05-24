"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DecoderText } from "@/components/decoder-text";
import { AnimatedIcon } from "@/components/animated-icon";
import { RevealLine } from "@/components/reveal-line";

interface MilestoneData {
  iconName: "cube" | "atom" | "synapse";
  target: number;
  suffix: string;
  label: string;
  desc: string;
}

const milestones: MilestoneData[] = [
  {
    iconName: "cube",
    target: 10,
    suffix: "+",
    label: "Projects Shipped",
    desc: "Fullstack apps, ML systems, and real-time platforms deployed.",
  },
  {
    iconName: "atom",
    target: 100,
    suffix: "+",
    label: "LeetCode Solved",
    desc: "Algorithmic engineering across dynamic programming, graphs & trees.",
  },
  {
    iconName: "synapse",
    target: 4,
    suffix: "+",
    label: "Years Shifting Code",
    desc: "From first styling script to building scalable production systems.",
  },
];

const timelineData = [
  { year: "'22", role: "Basics", detail: "Basic Programming: Mastered core fundamentals in C, C++, Python, HTML5, CSS3, and PHP to compile procedural logic." },
  { year: "'23", role: "Web Dev", detail: "Fullstack Web Dev: Engineered web applications using JavaScript, React.js, Node.js, Express.js, Tailwind CSS, and MongoDB." },
  { year: "'24", role: "Android", detail: "Fullstack Android: Developed native and cross-platform apps using Android SDK, Java, SQLite, Firebase, and React Native." },
  { year: "'25", role: "NextJS", detail: "Scalable Serverless: Engineered Next.js platforms using TypeScript, PostgreSQL, SQL, Docker, and GCP deployments." },
  { year: "'26", role: "AI / ML", detail: "AI/ML & 3D: Integrating intelligent ML pipelines using Python, TensorFlow, PyTorch, Scikit-learn; deploying Three.js WebGL shaders." },
];

export function Achievements() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const chars = section.querySelectorAll(".char-letter");
      const sweeps = section.querySelectorAll(".sweep-line");
      const label = section.querySelector(".section-label");

      // Heading letters reveal
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

      // Staggered entrance for list rows
      const rows = section.querySelectorAll(".index-row");
      gsap.fromTo(
        rows,
        { opacity: 0, y: 30 },
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
        }
      );

      // Counters scroll-triggered reveal & physics interpolation
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
    },
    { scope: sectionRef }
  );

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

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 px-6 md:px-12 lg:px-20 relative bg-background overflow-hidden"
    >
      {/* Structural clean architectural borders */}
      <div className="absolute inset-x-6 md:inset-x-12 lg:inset-x-20 top-0 h-[1px] bg-border/40 pointer-events-none" />
      <div className="absolute inset-y-0 left-6 md:left-12 lg:left-20 w-[1px] bg-border/10 pointer-events-none" />
      <div className="absolute inset-y-0 right-6 md:right-12 lg:right-20 w-[1px] bg-border/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <RevealLine className="mb-16" />

        {/* Editorial Header Block */}
        <div className="mb-20">
          <p className="section-label mb-4 opacity-0 font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
            <DecoderText text="BY THE NUMBERS" delay={0.2} />
          </p>
          <h2
            className="font-display font-black text-5xl md:text-7xl leading-none flex flex-wrap"
            style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)" }}
          >
            {renderSplitHeading("Milestones")}
          </h2>
        </div>

        {/* 1. Typographic Accented Grid List (The Editorial Index) */}
        <div className="border-t border-border/40 flex flex-col w-full mt-12">
          {milestones.map((m, i) => {
            const isHovered = hoveredRow === i;

            return (
              <div
                key={m.label}
                className="index-row group relative border-b border-border/40 transition-colors duration-500 py-10 md:py-12 bg-background/5 overflow-hidden"
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Subtle highlight backstrip */}
                <div
                  className={`absolute inset-0 bg-secondary/20 -z-10 origin-left transition-transform duration-500 ${
                    isHovered ? "scale-x-100" : "scale-x-0"
                  }`}
                />

                {/* Left Vermilion accent indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-[3px] bg-primary transition-transform duration-500 origin-bottom ${
                    isHovered ? "scale-y-100" : "scale-y-0"
                  }`}
                />

                {/* Editorial Columns Grid Structure */}
                {/* Col layout details: Col 1 is Index (80px), Col 2 is Stat (160px), Col 3 is Text Metadata (Flexible), Col 4 is Visual Graphic (Spacious) */}
                <div className="grid grid-cols-1 md:grid-cols-[80px_160px_1fr_1.2fr] items-center gap-y-6 md:gap-y-0 md:gap-x-10 px-4 md:px-8">
                  
                  {/* Column 1: Index Number */}
                  <div className="font-mono text-xs text-muted-foreground/60 select-none">
                    0{i + 1}.
                  </div>

                  {/* Column 2: Giant Stat Number */}
                  <div className="flex items-center gap-4">
                    <p className="font-display font-black text-5xl md:text-6xl text-foreground group-hover:text-primary transition-colors duration-500 tabular-nums select-none tracking-tight">
                      <span className="stat-num" data-target={m.target}>
                        0
                      </span>
                      <span className="text-primary font-light">{m.suffix}</span>
                    </p>
                    <div className="md:hidden p-2 border border-border/40 bg-secondary/30 rounded-none">
                      <AnimatedIcon
                        name={m.iconName}
                        className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors duration-500"
                      />
                    </div>
                  </div>

                  {/* Column 3: Text Metadata Block */}
                  <div className="flex flex-col space-y-1 max-w-[90%] md:max-w-[320px]">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs uppercase tracking-widest text-foreground font-bold group-hover:text-primary transition-colors duration-300">
                        {m.label}
                      </p>
                      <div className="hidden md:block">
                        <AnimatedIcon
                          name={m.iconName}
                          className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors duration-500"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-foreground/75 dark:text-zinc-300 group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>

                  {/* Column 4: Dedicated Visual Showcase Card (Perfect Alignment, Zero Text Overlap!) */}
                  <div className="relative min-h-[108px] md:min-h-[92px] py-3 w-full flex items-center border-t border-dashed border-border/30 pt-4 md:pt-0 md:border-t-0 md:border-l md:border-border/30 md:pl-8 overflow-hidden">
                    
                    {/* SHOWCASE 1: Projects Typographic Horizontal Marquee */}
                    {i === 0 && (
                      <div 
                        className="w-full flex flex-col justify-center select-none pointer-events-none overflow-hidden"
                        style={{
                          maskImage: "linear-gradient(to right, transparent, white 12%, white 88%, transparent)",
                          WebkitMaskImage: "linear-gradient(to right, transparent, white 12%, white 88%, transparent)"
                        }}
                      >
                        {/* Seamless loop marquee 1 */}
                        <div className="marquee-track flex gap-8 py-1">
                          <span className={`font-display font-black text-sm uppercase tracking-tight transition-colors duration-500 whitespace-nowrap ${
                            isHovered ? "text-primary" : "text-foreground/40"
                          }`}>
                            Drop Of Hope • Skribbl Clone • Vehiql • Planet Shopify • Student Management System •&nbsp;
                          </span>
                          <span className={`font-display font-black text-sm uppercase tracking-tight transition-colors duration-500 whitespace-nowrap ${
                            isHovered ? "text-primary" : "text-foreground/40"
                          }`}>
                            Drop Of Hope • Skribbl Clone • Vehiql • Planet Shopify • Student Management System •&nbsp;
                          </span>
                        </div>
                        {/* Reverse looping marquee 2 */}
                        <div className="marquee-track flex gap-8 py-1 opacity-40" style={{ animationDirection: "reverse" }}>
                          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                            Next.js 15 • React.js • Node.js • Express • Supabase • PostgreSQL • Android SDK • Java • Firebase • SQLite • Python • Gemini AI • Clerk •&nbsp;
                          </span>
                          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                            Next.js 15 • React.js • Node.js • Express • Supabase • PostgreSQL • Android SDK • Java • Firebase • SQLite • Python • Gemini AI • Clerk •&nbsp;
                          </span>
                        </div>
                      </div>
                    )}

                    {/* SHOWCASE 2: LeetCode Stacked Category Progress Bars */}
                    {i === 1 && (
                      <div className="w-full flex flex-col justify-center space-y-3 select-none pointer-events-none pr-4">
                        <div className="flex justify-between font-mono text-[10px] tracking-widest text-muted-foreground/60 transition-colors duration-300 group-hover:text-foreground">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-foreground/30 rounded-none" /> Easy (45%)
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-primary/50 rounded-none" /> Medium (43%)
                          </span>
                          <span className="flex items-center gap-1.5 text-primary font-bold">
                            <span className="w-2 h-2 bg-primary rounded-none animate-pulse" /> Hard (12%)
                          </span>
                        </div>
                        {/* Always-filled stacked progress bar with hover-glow scale and color activation */}
                        <div className={`w-full h-3 bg-secondary/20 border border-border/20 flex overflow-hidden transition-all duration-500 origin-center ${
                          isHovered ? "opacity-100 scale-y-110 border-primary/30 shadow-[0_0_12px_rgba(217,40,28,0.06)]" : "opacity-35"
                        }`}>
                          <div
                            className="h-full bg-foreground/30 transition-all duration-700"
                            style={{ width: "45%" }}
                          />
                          <div
                            className="h-full bg-primary/50 transition-all duration-700"
                            style={{ width: "43%" }}
                          />
                          <div
                            className="h-full bg-primary transition-all duration-700"
                            style={{ width: "12%" }}
                          />
                        </div>
                      </div>
                    )}

                    {/* SHOWCASE 3: Chronological segmented timeline */}
                    {i === 2 && (
                      <div className="w-full flex flex-col justify-center px-4 py-2 space-y-3 pointer-events-auto">
                        <div className="relative w-full flex items-start justify-between font-mono text-[10px] select-none">
                          {/* Minimalist linking axis line */}
                          <div className="absolute inset-x-0 top-[5px] h-[1px] bg-border/40 -z-10" />
                          <div
                            className="absolute left-0 top-[5px] h-[1px] bg-primary -z-10 transition-all duration-1000 origin-left"
                            style={{ width: isHovered ? "100%" : "0%" }}
                          />

                          {timelineData.map((node, dotIdx) => {
                            const isDotActive = hoveredDot === dotIdx || (hoveredDot === null && dotIdx === 4);

                            return (
                              <div
                                key={node.year}
                                className="flex flex-col items-center space-y-2 cursor-pointer group/node"
                                onMouseEnter={() => setHoveredDot(dotIdx)}
                                onMouseLeave={() => setHoveredDot(null)}
                                data-cursor="hover"
                              >
                                <span className={`w-2.5 h-2.5 rounded-full border bg-background transition-all duration-300 ${
                                  isDotActive
                                    ? "border-primary bg-primary scale-125 shadow-[0_0_10px_rgba(217,40,28,0.6)]"
                                    : "border-border"
                                }`} />
                                <div className="flex flex-col items-center">
                                  <span className={`transition-colors duration-300 ${isDotActive ? "text-primary font-bold" : "text-muted-foreground/60"}`}>
                                    {node.year}
                                  </span>
                                  <span className={`text-[8px] uppercase transition-colors duration-300 ${isDotActive ? "text-foreground font-bold" : "text-muted-foreground/40"}`}>
                                    {node.role}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {/* Dynamic detailed milestone chronicle readout */}
                        <div className="min-h-[52px] md:min-h-[44px] py-1 flex items-center justify-center border-t border-dashed border-border/20 pt-2 transition-all duration-300">
                          <p className="font-mono text-[10px] leading-relaxed text-foreground/80 dark:text-zinc-300 text-center max-w-full">
                            <span className="text-primary font-bold animate-pulse">&gt;</span> {timelineData[hoveredDot !== null ? hoveredDot : 4].detail}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        /* Slow typographic marquee loop */
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 24s linear infinite;
        }
        .group:hover .marquee-track {
          animation-play-state: running;
        }
      `}</style>
    </section>
  );
}
