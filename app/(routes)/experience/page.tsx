"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { experiences } from "@/data/experience";
import { education } from "@/data/education";
import { scrambleText } from "@/lib/animations";

export default function ExperiencePage() {
  const pageRef  = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const eduSpineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (titleRef.current) scrambleText(titleRef.current, "EXPERIENCE", 1100);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  /* GSAP: spine line draws down on scroll */
  useGSAP(() => {
    if (!spineRef.current) return;
    gsap.fromTo(spineRef.current,
      { scaleY: 0, transformOrigin: "top" },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: pageRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        },
      }
    );
  }, { scope: pageRef });

  /* GSAP: each card slides in */
  useGSAP(() => {
    const cards = pageRef.current?.querySelectorAll(".exp-card");
    if (!cards) return;
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
        {
          opacity: 1, x: 0,
          duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        }
      );
    });
  }, { scope: pageRef });

  /* GSAP: edu spine line draws down on scroll */
  useGSAP(() => {
    if (!eduSpineRef.current) return;
    gsap.fromTo(eduSpineRef.current,
      { scaleY: 0, transformOrigin: "top" },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: eduSpineRef.current.parentElement,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        },
      }
    );
  }, { scope: pageRef });

  /* GSAP: edu cards slide in */
  useGSAP(() => {
    const cards = pageRef.current?.querySelectorAll(".edu-card");
    if (!cards) return;
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
        {
          opacity: 1, x: 0,
          duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        }
      );
    });
  }, { scope: pageRef });

  return (
    <div ref={pageRef} className="min-h-screen bg-background">

      {/* Page hero */}
      <div className="relative border-b border-border overflow-hidden">
        <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display font-black text-[20vw] text-foreground/[0.015] leading-none select-none">
            EXP
          </span>
        </div>

        <div className="px-6 md:px-12 lg:px-16 pt-28 pb-12 relative z-10">
          <motion.p className="section-label mb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            03 / Experience
          </motion.p>
          <h1 ref={titleRef}
            className="font-display font-black text-[clamp(4rem,12vw,10rem)] leading-none tracking-tight mb-6">
            ██████████
          </h1>
          <div className="glow-line" />
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 md:px-12 lg:px-16 py-20">
        <div className="relative max-w-4xl mx-auto">

          {/* Vertical spine */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border">
            <div ref={spineRef} className="absolute inset-0 bg-primary" style={{ transform: "scaleY(0)", transformOrigin: "top" }} />
          </div>

          <div className="space-y-16">
            {experiences.map((exp, i) => (
              <div
                key={exp.id}
                className={`exp-card relative flex flex-col md:flex-row gap-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ opacity: 0 }}
              >
                {/* Dot on the spine */}
                <div className={`absolute left-4 md:left-1/2 top-4 w-3 h-3 border-2 border-primary bg-background -translate-x-[5px] md:-translate-x-1/2 z-10 ${
                  exp.current ? "bg-primary" : ""
                }`}>
                  {exp.current && (
                    <span className="absolute inset-0 animate-ping bg-primary/50" />
                  )}
                </div>

                {/* Card */}
                <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? "md:pr-8" : "md:pl-8"
                }`}>
                  <div className="border border-border bg-card p-6 hover:border-primary/40 transition-all duration-500 group relative overflow-hidden">
                    {/* Indigo accent stripe */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary/80 transition-all duration-500" />

                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="section-label text-primary/70 block mb-1">
                          {exp.type ?? "Work"}
                        </span>
                        <h3 className="font-display font-bold text-xl leading-tight group-hover:text-primary transition-colors duration-300">
                          {exp.title}
                        </h3>
                        <p className="font-mono text-xs text-foreground/60 mt-0.5">
                          {exp.company} · {exp.location}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    <ul className="space-y-1.5 mb-4">
                      {exp.achievements.slice(0, 2).map((a, ai) => (
                        <li key={ai} className="flex gap-2 text-sm text-foreground/70">
                          <span className="text-primary mt-0.5 shrink-0">›</span>
                          {a}
                        </li>
                      ))}
                    </ul>

                    <p className="font-mono text-xs text-foreground/50">
                      {exp.startDate} — {exp.endDate ?? "Present"}
                    </p>
                  </div>
                </div>

                {/* Date on opposite side (desktop) */}
                <div className={`hidden md:flex items-start md:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? "justify-start pl-8" : "justify-end pr-8"
                }`}>
                  <span className="font-mono text-xs uppercase tracking-widest text-foreground/40 pt-5">
                    {exp.startDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Education Header */}
      <div className="px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.p className="section-label mb-4"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            04 / Education
          </motion.p>
          <h2 className="font-display font-black text-4xl md:text-5xl mb-6">
            ACADEMIC BACKGROUND
          </h2>
          <div className="glow-line" />
        </div>
      </div>

      {/* Education Timeline */}
      <div className="px-6 md:px-12 lg:px-16 pb-20">
        <div className="relative max-w-4xl mx-auto">

          {/* Vertical spine */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border">
            <div ref={eduSpineRef} className="absolute inset-0 bg-primary" style={{ transform: "scaleY(0)", transformOrigin: "top" }} />
          </div>

          <div className="space-y-16">
            {education.map((edu, i) => (
              <div
                key={edu.id}
                className={`edu-card relative flex flex-col md:flex-row gap-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ opacity: 0 }}
              >
                {/* Dot on the spine */}
                <div className="absolute left-4 md:left-1/2 top-4 w-3 h-3 border-2 border-primary bg-background -translate-x-[5px] md:-translate-x-1/2 z-10">
                </div>

                {/* Card */}
                <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? "md:pr-8" : "md:pl-8"
                }`}>
                  <div className="border border-border bg-card p-6 hover:border-primary/40 transition-all duration-500 group relative overflow-hidden">
                    {/* Indigo accent stripe */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary/80 transition-all duration-500" />

                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="section-label text-primary/70 block mb-1">
                          Education
                        </span>
                        <h3 className="font-display font-bold text-xl leading-tight group-hover:text-primary transition-colors duration-300">
                          {edu.degree}
                        </h3>
                        <p className="font-mono text-xs text-muted-foreground mt-0.5">
                          {edu.institution}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground mt-0.5">
                          {edu.university} · {edu.location}
                        </p>
                      </div>
                    </div>

                    {edu.description && (
                      <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                        {edu.description}
                      </p>
                    )}

                    {edu.cgpa && (
                      <div className="mb-4">
                        <span className="text-xs font-medium text-foreground bg-primary/10 px-2 py-1 rounded border border-primary/20">
                          CGPA: {edu.cgpa}
                        </span>
                      </div>
                    )}

                    <p className="font-mono text-xs text-muted-foreground/60">
                      {edu.startDate} — {edu.endDate ?? "Present"}
                    </p>
                  </div>
                </div>

                {/* Date on opposite side (desktop) */}
                <div className={`hidden md:flex items-start md:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? "justify-start pl-8" : "justify-end pr-8"
                }`}>
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/50 pt-5">
                    {edu.startDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}