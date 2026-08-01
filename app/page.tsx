"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { Hero } from "@/components/home/hero";
import { SkillsShowcase } from "@/components/home/skills-showcase";
import { Achievements } from "@/components/home/achievements";
import { SectionDivider } from "@/components/shared/section-divider";
import { projects } from "@/data/projects";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const featuredProjects = projects.filter((p) => p.featured);

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const featHeaderRef = useRef<HTMLDivElement>(null);

  /* ─────────────────────────────────────────────
     GSAP: Pinned Horizontal Showcase Reel
     Key fixes:
     1. No nested gsap.context() inside useGSAP (double-scoping bug)
     2. ScrollTrigger is properly imported
     3. onRefresh callback recalculates scroll amount
     4. Card entrance animations on pin start
  ───────────────────────────────────────────── */
  useGSAP(
    () => {
      const pinTarget = pinSectionRef.current;
      const track = horizontalTrackRef.current;
      if (!pinTarget || !track) return;

      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      // Animate the cards in with a stagger when the section first pins
      const cards = track.querySelectorAll<HTMLElement>(".h-project-card");
      gsap.set(cards, { opacity: 0, y: 40 });

      // Canonical GSAP horizontal scroll + pin pattern
      // scrub: 1 = smooth 1-second lag behind scroll
      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: pinTarget,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          refreshPriority: 2,
          onEnter: () => {
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.14,
              ease: "power3.out",
            });
          },
        },
      });

      // Force layout recalculation after fonts/images settle
      const timeout = setTimeout(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, 300);

      return () => {
        clearTimeout(timeout);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: containerRef }
  );

  /* ── GSAP: Featured Projects header — clip-path word lift ── */
  useGSAP(
    () => {
      const header = featHeaderRef.current;
      if (!header) return;

      const wordWraps = header.querySelectorAll<HTMLElement>(".fp-word");
      const label = header.querySelector(".fp-label");
      const hint = header.querySelector(".fp-hint");
      const cta = header.querySelector(".fp-cta");

      gsap.set(wordWraps, { y: "105%", opacity: 1 });
      gsap.set([label, hint, cta], { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      tl.to(label, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
        .to(wordWraps, {
          y: "0%",
          duration: 0.75,
          stagger: 0.09,
          ease: "power4.out",
        }, "-=0.2")
        .to([hint, cta], { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" }, "-=0.4");
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* ── Full Width Section Separator 01 ── */}
      <SectionDivider />

      {/* 2. Horizontal Showcase Reel (Featured Projects)
          IMPORTANT: NO overflow-hidden on the pinned element.
          overflow-hidden clips the element when GSAP sets position:fixed during pin,
          causing the "scroll-up-then-teleport" bug.
          The outer bg/style is handled by an absolutely-positioned backdrop instead. */}
      <div
        ref={pinSectionRef}
        className="relative w-full min-h-screen lg:h-screen flex flex-col justify-between pt-12 sm:pt-24 pb-8 sm:pb-12 z-10 bg-background"
      >
        {/* Background fill */}
        <div className="absolute inset-0 bg-secondary/15 dark:bg-zinc-950/60 pointer-events-none" />

        {/* Clean Editorial Section Header — GSAP clip-path word lift */}
        <div ref={featHeaderRef} className="relative px-8 md:px-14 lg:px-20 pt-2 pb-2 flex items-end justify-between z-10 shrink-0">
          <div>
            {/* Label fades up */}
            <span className="fp-label font-mono text-[10px] uppercase tracking-[0.25em] text-primary font-bold block mb-1" style={{ opacity: 0 }}>
              Selected Work
            </span>
            {/* H2 — each word is wrapped in overflow:hidden so words slide up from beneath */}
            <h2
              className="font-display font-black leading-none tracking-tight text-foreground flex flex-wrap gap-x-[0.25em] overflow-hidden"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              {["Featured", "Projects"].map((word) => (
                <span key={word} className="inline-block overflow-hidden pb-[0.05em]">
                  <span className="fp-word inline-block" style={{ transform: "translateY(105%)" }}>
                    {word}
                  </span>
                </span>
              ))}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <span className="fp-hint font-mono text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:inline-block" style={{ opacity: 0 }}>
              Scroll to explore →
            </span>
            <Link
              href="/projects"
              data-cursor="hover"
              className="fp-cta inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground hover:text-primary transition-colors font-bold border border-border/40 px-4 py-2 bg-background hover:border-primary relative z-10"
              style={{ opacity: 0 }}
            >
              All Projects <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Track Container */}
        <div className="relative w-full flex-1 flex items-center overflow-hidden">
          <div
            ref={horizontalTrackRef}
            className="flex items-stretch gap-6 sm:gap-10 md:gap-16 px-6 sm:px-10 md:px-20 lg:px-28 min-w-max will-change-transform py-4 sm:py-6"
          >
            {featuredProjects.map((project, i) => (
              <div
                key={project.id}
                className="h-project-card w-[82vw] max-w-[340px] sm:w-[480px] sm:max-w-none md:w-[560px] lg:w-[620px] shrink-0 group border border-border/30 bg-background/80 dark:bg-zinc-900/60 backdrop-blur-sm hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-500 p-5 sm:p-7 md:p-8 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top vermilion accent line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Project Header Info */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-primary font-bold">
                        0{i + 1}
                      </span>
                      <span className="text-muted-foreground/30 font-mono text-xs">/</span>
                      <span className="font-mono text-xs text-muted-foreground/50">
                        0{featuredProjects.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-end">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[8.5px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 bg-secondary/30 text-muted-foreground font-semibold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="font-display font-black text-xl sm:text-2xl md:text-3xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {project.title}
                  </h3>
                </div>

                {/* Clean Image Card Preview */}
                <div className="relative w-full aspect-[16/9] border border-border/20 my-3 sm:my-4 bg-secondary/20 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 480px, 620px"
                    priority
                  />
                </div>

                {/* Project Description & Action Buttons */}
                <div className="space-y-3 sm:space-y-4 shrink-0">
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-2 sm:gap-3 pt-3 border-t border-border/15">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="hover"
                        className="inline-flex items-center gap-1.5 sm:gap-2 bg-foreground text-background font-mono text-[9px] uppercase tracking-widest px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-primary hover:text-white transition-all duration-300 font-bold"
                      >
                        Live Demo ↗
                      </a>
                    )}
                    <Link
                      href={`/projects/${project.id}`}
                      data-cursor="hover"
                      className="inline-flex items-center gap-1.5 sm:gap-2 border border-border/40 hover:border-primary text-foreground hover:text-primary font-mono text-[9px] uppercase tracking-widest px-3 sm:px-4 py-2 sm:py-2.5 transition-all duration-300 font-bold"
                    >
                      Case Study →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll progress indicator bar */}
        <div className="relative px-8 md:px-14 lg:px-20 shrink-0 z-10">
          <div className="w-full h-[1px] bg-border/20">
            <div
              id="h-scroll-progress"
              className="h-full bg-primary/50 origin-left"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </div>

      {/* ── Full Width Section Separator 02 (Between Featured Projects & Tech Stack) ── */}
      <div className="relative z-20 bg-background">
        <SectionDivider />
      </div>

      {/* 3. Tech Stack & Skills Section */}
      <div className="relative z-10 bg-background">
        <SkillsShowcase />
      </div>

      {/* ── Full Width Section Separator 03 (Between Tech Stack & Milestones) ── */}
      <div className="relative z-20 bg-background">
        <SectionDivider />
      </div>

      {/* 4. Achievements & Milestones Section */}
      <div className="relative z-10 bg-background">
        <Achievements />
      </div>
    </div>
  );
}