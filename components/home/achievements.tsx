"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DecoderText } from "@/components/decoder-text";
import { AnimatedIcon } from "@/components/animated-icon";

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

      /* ── 1. Heading Reveal ── */
      const chars = section.querySelectorAll(".char-letter");
      const sweeps = section.querySelectorAll(".sweep-line");
      const label = section.querySelector(".section-label");

      if (chars.length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
        tl.to(chars, { y: "0%", duration: 0.6, stagger: 0.02, ease: "power3.out" });
        tl.to(sweeps, { width: "100%", duration: 0.5, ease: "power2.inOut" }, "-=0.25");
      }

      if (label) {
        gsap.fromTo(label,
          { opacity: 0, y: 18 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 88%" },
          }
        );
      }

      /* ── 2. STAGGERED ELEVATION OF VERTICAL LIST ROWS ── */
      const rows = section.querySelectorAll(".index-row");
      gsap.fromTo(
        rows,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );

      /* ── 3. ODOMETER COUNTER ROLL-UP ── */
      const countNodes = section.querySelectorAll<HTMLElement>(".stat-num");
      countNodes.forEach((node) => {
        const target = parseFloat(node.getAttribute("data-target") || "0");
        const counterObj = { value: 0 };

        gsap.to(counterObj, {
          value: target,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 85%",
          },
          onUpdate() {
            const display = Math.min(Math.round(counterObj.value), target);
            node.textContent = display.toString();
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
        className="inline-block overflow-hidden relative pb-2 mr-3 last:mr-0"
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
      className="pt-16 pb-16 md:pt-20 md:pb-20 px-6 md:px-12 lg:px-20 relative bg-transparent overflow-hidden"
    >
      {/* Structural architectural border guides */}
      <div className="absolute inset-y-0 left-6 md:left-12 lg:left-20 w-[1px] bg-border/10 pointer-events-none" />
      <div className="absolute inset-y-0 right-6 md:right-12 lg:right-20 w-[1px] bg-border/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Editorial Header Block */}
        <div className="mb-12">
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

        {/* REFINED VERTICAL EDITORIAL LIST INDEX */}
        <div className="border-t-2 border-border flex flex-col w-full mt-10">
          {milestones.map((m, i) => {
            const isHovered = hoveredRow === i;

            return (
              <div
                key={m.label}
                className="index-row group relative border-b border-border/40 py-10 md:py-12 bg-background/30 hover:bg-primary/5 transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Left Vermilion accent border indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-[4px] bg-primary transition-transform duration-300 origin-center ${
                    isHovered ? "scale-y-100" : "scale-y-0"
                  }`}
                />

                {/* Editorial Columns Grid Structure */}
                <div className="grid grid-cols-1 md:grid-cols-[80px_160px_1fr_1.2fr] items-center gap-y-6 md:gap-y-0 md:gap-x-10 px-4 md:px-8">
                  
                  {/* Column 1: Index Number */}
                  <div className="font-mono text-xs font-bold text-muted-foreground/60 select-none">
                    0{i + 1}.
                  </div>

                  {/* Column 2: Giant Stat Number */}
                  <div className="flex items-center gap-4">
                    <p className="font-display font-black text-5xl md:text-6xl text-foreground group-hover:text-primary transition-colors duration-300 tabular-nums select-none tracking-tight">
                      <span className="stat-num" data-target={m.target}>
                        0
                      </span>
                      <span className="text-primary font-light">{m.suffix}</span>
                    </p>
                    <div className="md:hidden p-2 border border-border/40 bg-secondary/30">
                      <AnimatedIcon
                        name={m.iconName}
                        className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300"
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
                          className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors duration-300"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-foreground/75 dark:text-zinc-300 group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>

                  {/* Column 4: Dedicated Interactive Visual Showcase */}
                  <div className="relative min-h-[108px] md:min-h-[92px] py-3 w-full flex items-center border-t border-dashed border-border/30 pt-4 md:pt-0 md:border-t-0 md:border-l md:border-border/30 md:pl-8 overflow-hidden">
                    
                    {/* SHOWCASE 1: Projects Horizontal Marquee Stream */}
                    {i === 0 && (
                      <div 
                        className="w-full flex flex-col justify-center select-none pointer-events-none overflow-hidden"
                        style={{
                          maskImage: "linear-gradient(to right, transparent, white 12%, white 88%, transparent)",
                          WebkitMaskImage: "linear-gradient(to right, transparent, white 12%, white 88%, transparent)"
                        }}
                      >
                        <div className="marquee-track flex gap-8 py-1">
                          <span className={`font-display font-black text-sm uppercase tracking-tight transition-colors duration-300 whitespace-nowrap ${
                            isHovered ? "text-primary" : "text-foreground/50"
                          }`}>
                            Drop Of Hope • Skribbl Clone • Vehiql • Planet Shopify • Student Management System •&nbsp;
                          </span>
                          <span className={`font-display font-black text-sm uppercase tracking-tight transition-colors duration-300 whitespace-nowrap ${
                            isHovered ? "text-primary" : "text-foreground/50"
                          }`}>
                            Drop Of Hope • Skribbl Clone • Vehiql • Planet Shopify • Student Management System •&nbsp;
                          </span>
                        </div>
                        <div className="marquee-track flex gap-8 py-1 opacity-40" style={{ animationDirection: "reverse" }}>
                          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                            Next.js 15 • React.js • Node.js • Express • Supabase • PostgreSQL • Android SDK • Java • Firebase •&nbsp;
                          </span>
                          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                            Next.js 15 • React.js • Node.js • Express • Supabase • PostgreSQL • Android SDK • Java • Firebase •&nbsp;
                          </span>
                        </div>
                      </div>
                    )}

                    {/* SHOWCASE 2: LeetCode Progress Bar */}
                    {i === 1 && (
                      <div className="w-full flex flex-col justify-center space-y-3 select-none pointer-events-none pr-4">
                        <div className="flex justify-between font-mono text-[10px] tracking-widest text-muted-foreground/70 transition-colors duration-300 group-hover:text-foreground">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-foreground/30" /> Easy (45%)</span>
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-primary/50" /> Medium (43%)</span>
                          <span className="flex items-center gap-1.5 text-primary font-bold"><span className="w-2 h-2 bg-primary animate-pulse" /> Hard (12%)</span>
                        </div>
                        <div className={`w-full h-3 bg-secondary/30 border border-border/40 flex overflow-hidden transition-all duration-300 ${
                          isHovered ? "opacity-100 scale-y-110 border-primary/50 shadow-[0_0_12px_rgba(217,40,28,0.1)]" : "opacity-50"
                        }`}>
                          <div className="h-full bg-foreground/30 transition-all duration-700" style={{ width: "45%" }} />
                          <div className="h-full bg-primary/50 transition-all duration-700" style={{ width: "43%" }} />
                          <div className="h-full bg-primary transition-all duration-700" style={{ width: "12%" }} />
                        </div>
                      </div>
                    )}

                    {/* SHOWCASE 3: Timeline */}
                    {i === 2 && (
                      <div className="w-full flex flex-col justify-center px-4 py-2 space-y-3 pointer-events-auto">
                        <div className="relative w-full flex items-start justify-between font-mono text-[10px] select-none">
                          <div className="absolute inset-x-0 top-[5px] h-[1px] bg-border/40 -z-10" />
                          <div
                            className="absolute left-0 top-[5px] h-[1px] bg-primary -z-10 transition-all duration-500 origin-left"
                            style={{ width: isHovered ? "100%" : "0%" }}
                          />
                          {timelineData.map((node, dotIdx) => {
                            const isDotActive = hoveredDot === dotIdx || (hoveredDot === null && dotIdx === 4);
                            return (
                              <div
                                key={node.year}
                                className="flex flex-col items-center space-y-2 cursor-pointer"
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
                                  <span className={`transition-colors duration-300 ${isDotActive ? "text-primary font-bold" : "text-muted-foreground/60"}`}>{node.year}</span>
                                  <span className={`text-[8px] uppercase transition-colors duration-300 ${isDotActive ? "text-foreground font-bold" : "text-muted-foreground/40"}`}>{node.role}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="min-h-[52px] md:min-h-[44px] py-1 flex items-center justify-center border-t border-dashed border-border/20 pt-2 transition-all duration-300">
                          <p className="font-mono text-[10px] leading-relaxed text-foreground/80 dark:text-zinc-300 text-center max-w-full">
                            <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mr-2" /> {timelineData[hoveredDot !== null ? hoveredDot : 4].detail}
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
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
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
