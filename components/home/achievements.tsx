"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { DecoderText } from "@/components/shared/decoder-text";
import { AnimatedIcon } from "@/components/shared/animated-icon";

const milestoneStages = [
  {
    id: "01",
    label: "PROJECTS SHIPPED",
    target: 10,
    suffix: "+",
    badge: "PRODUCTION DEPLOYMENTS",
    subtext: "Fullstack apps, ML systems, and real-time microservices deployed to production environments.",
    details: ["SurSangeet", "Drop Of Hope", "Skribbl Clone", "Vehiql", "Planet Shopify", "Student Management System"],
    statLabel: "LIVE SERVICES",
    iconName: "cube" as const,
  },
  {
    id: "02",
    label: "LEETCODE SOLVED",
    target: 100,
    suffix: "+",
    badge: "ALGORITHMIC COMPETENCE",
    subtext: "Rigorous problem solving in Dynamic Programming, Graph Traversals, Trees & Matrix logic.",
    stats: { easy: 45, medium: 43, hard: 12 },
    statLabel: "PROBLEMS CLEARED",
    iconName: "atom" as const,
  },
  {
    id: "03",
    label: "YEARS SHIFTING CODE",
    target: 4,
    suffix: "+",
    badge: "ENGINEERING TIMELINE",
    subtext: "From fundamental C/C++ scripts to serverless architectures, WebGL shaders & ML pipelines.",
    timeline: [
      { year: "'22", role: "Basics", desc: "Procedural logic in C, C++, Python & Web basics." },
      { year: "'23", role: "Web Dev", desc: "Fullstack Web: React.js, Node.js, Express & MongoDB." },
      { year: "'24", role: "Android", desc: "Fullstack Mobile: Android SDK, Java, Firebase & React Native." },
      { year: "'25", role: "Next.js", desc: "Serverless Cloud: Next.js 15, TypeScript, PostgreSQL & Docker." },
      { year: "'26", role: "AI / ML", desc: "Intelligent Systems: Python, PyTorch, TensorFlow & Three.js." },
    ],
    statLabel: "YEARS ACTIVE",
    iconName: "synapse" as const,
  },
];

export function Achievements() {
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [activeTimelineDot, setActiveTimelineDot] = useState(4);

  /* ── GSAP PINNED CYBER COCKPIT SEQUENCER ── */
  useGSAP(
    () => {
      const pinTarget = pinTargetRef.current;
      const hud = hudRef.current;
      if (!pinTarget || !hud) return;

      // stageNodes removed


      const trigger = ScrollTrigger.create({
        trigger: pinTarget,
        pin: true,
        pinSpacing: true,
        start: "top top+=64px",
        end: "+=2000",
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const total = milestoneStages.length;
          const index = Math.min(Math.floor(progress * total), total - 1);
          setActiveStage(index);

          /* HUD Rotation and Pulse according to scroll progress */
          gsap.to(hud, {
            rotate: progress * 360,
            duration: 0.1,
            overwrite: "auto",
          });
        },
      });

      /* Odometer roll-up trigger */
      const countNodes = pinTarget.querySelectorAll<HTMLElement>(".stat-num");
      countNodes.forEach((node) => {
        const target = parseFloat(node.getAttribute("data-target") || "0");
        const counterObj = { value: 0 };
        gsap.to(counterObj, {
          value: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pinTarget,
            start: "top 80%",
          },
          onUpdate() {
            const display = Math.min(Math.round(counterObj.value), target);
            node.textContent = display.toString();
          },
        });
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: pinTargetRef }
  );

  const currentStageData = milestoneStages[activeStage];

  return (
    <div
      ref={pinTargetRef}
      className="relative w-full py-6 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 lg:px-20 bg-background z-10 overflow-hidden flex flex-col justify-start"
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 border-y border-border/20 pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/30 pb-4 mb-4 sm:mb-8">
        <div>
          <p className="section-label mb-1 font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
            <DecoderText text="BY THE NUMBERS" delay={0.2} />
          </p>
          <h2
            className="font-display font-black text-4xl sm:text-5xl leading-none"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            Key Milestones
          </h2>
        </div>

        {/* Scroll Phase Indicator Bar */}
        <div className="flex items-center gap-4 font-mono text-[10px]">
          <span className="text-muted-foreground/70">STAGE:</span>
          <span className="text-primary font-bold">0{activeStage + 1} / 03</span>
        </div>
      </div>

      {/* CENTER INTERACTIVE EDITORIAL SHOWCASE */}
      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Stage Selector Deck */}
        <div className="lg:col-span-5 space-y-3">
          {milestoneStages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`stage-nav-item w-full p-4 border text-left transition-all duration-500 relative overflow-hidden group ${
                  isActive
                    ? "border-primary bg-primary/[0.06] shadow-[0_0_20px_rgba(217,40,28,0.12)]"
                    : "border-border/30 bg-background/50 hover:border-border"
                }`}
              >
                {/* Active Vermilion Line Indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-primary transition-transform duration-300 ${
                    isActive ? "scale-y-100" : "scale-y-0"
                  }`}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs font-bold ${isActive ? "text-primary" : "text-muted-foreground/60"}`}>
                      0{idx + 1}.
                    </span>
                    <h3 className={`font-mono text-xs uppercase tracking-wider font-bold transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {stage.label}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-display font-black text-2xl text-foreground">
                      <span className="stat-num" data-target={stage.target}>0</span>{stage.suffix}
                    </span>
                    <AnimatedIcon
                      name={stage.iconName}
                      className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground/40"}`}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Central Morphing Editorial Panel */}
        <div className="lg:col-span-7 h-[380px] sm:h-[400px] w-full border border-border/40 bg-secondary/10 dark:bg-zinc-950/80 p-6 sm:p-8 relative flex flex-col justify-between overflow-hidden shadow-2xl">
          
          {/* Subtle Ambient Ring Background Accent */}
          <div
            ref={hudRef}
            className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border border-dashed border-primary/20 pointer-events-none flex items-center justify-center"
          >
            <div className="w-60 h-60 rounded-full border border-primary/10" />
            <div className="w-40 h-40 rounded-full border border-dotted border-primary/25" />
          </div>

          {/* Top Panel Header */}
          <div className="flex items-center justify-between border-b border-border/20 pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                {currentStageData.badge}
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground/60">
              FEATURE HIGHLIGHT
            </span>
          </div>

          {/* Center Dynamic Content Viewport */}
          <div className="relative z-10 my-auto space-y-4">
            <div className="flex items-baseline gap-4">
              <p className="font-display font-black text-6xl sm:text-7xl text-foreground tracking-tight leading-none">
                <span>{currentStageData.target}</span>
                <span className="text-primary font-light">{currentStageData.suffix}</span>
              </p>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/80 font-bold">
                {currentStageData.statLabel}
              </span>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed max-w-[50ch] font-medium">
              {currentStageData.subtext}
            </p>

            {/* STAGE 01: Project Pills Stream */}
            {activeStage === 0 && currentStageData.details && (
              <div className="flex flex-wrap gap-2 pt-2">
                {currentStageData.details.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 border border-primary/40 bg-primary/[0.08] font-mono text-[10px] text-foreground font-bold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {/* STAGE 02: LeetCode Ratio Meter */}
            {activeStage === 1 && currentStageData.stats && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between font-mono text-[10px] font-bold">
                  <span>Easy ({currentStageData.stats.easy}%)</span>
                  <span className="text-primary/80">Medium ({currentStageData.stats.medium}%)</span>
                  <span className="text-primary font-bold">Hard ({currentStageData.stats.hard}%)</span>
                </div>
                <div className="w-full h-3 bg-secondary/40 border border-border/40 flex overflow-hidden">
                  <div className="h-full bg-foreground/40" style={{ width: `${currentStageData.stats.easy}%` }} />
                  <div className="h-full bg-primary/60" style={{ width: `${currentStageData.stats.medium}%` }} />
                  <div className="h-full bg-primary" style={{ width: `${currentStageData.stats.hard}%` }} />
                </div>
              </div>
            )}

            {/* STAGE 03: Timeline Node Detail Switcher */}
            {activeStage === 2 && currentStageData.timeline && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between border-b border-border/20 pb-2">
                  {currentStageData.timeline.map((node, dotIdx) => (
                    <button
                      key={node.year}
                      onClick={() => setActiveTimelineDot(dotIdx)}
                      className={`flex flex-col items-center gap-1 transition-all ${
                        activeTimelineDot === dotIdx
                          ? "text-primary scale-110 font-bold"
                          : "text-muted-foreground/50 hover:text-foreground"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full border ${activeTimelineDot === dotIdx ? "bg-primary border-primary" : "border-border"}`} />
                      <span className="font-mono text-[9px]">{node.year}</span>
                    </button>
                  ))}
                </div>
                <p className="font-mono text-[10px] leading-relaxed text-foreground font-semibold bg-background/60 p-2.5 border border-border/30">
                  <span className="text-primary font-bold">▸</span> {currentStageData.timeline[activeTimelineDot].desc}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
