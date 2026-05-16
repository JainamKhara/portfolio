"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { ArrowUpRight, ChevronDown } from "lucide-react";

const featured = projects.filter((p) => p.featured);

export function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  /* GSAP: section header */
  useGSAP(() => {
    const header = sectionRef.current?.querySelector(".section-header");
    if (!header) return;
    gsap.fromTo(header,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.75, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" } }
    );
  }, { scope: sectionRef });

  /* GSAP: stagger rows */
  useGSAP(() => {
    const rows = sectionRef.current?.querySelectorAll(".proj-row");
    if (!rows) return;
    rows.forEach((row) => {
      gsap.fromTo(row,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 91%" } }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative border-t border-border bg-background pt-24 md:pt-32">
      <div className="px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="section-header flex items-end justify-between pb-12 md:pb-16">
        <div>
          <p className="section-label mb-3">02 / Selected Work</p>
          <h2
            className="font-display font-black leading-none tracking-tight"
            style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)" }}
          >
            Projects
          </h2>
        </div>
        <Link
          href="/projects"
          data-cursor="hover"
          className="hidden md:inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors duration-300 mb-2"
        >
          All work <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="w-full h-px bg-border" />

      {/* Rows */}
      <div className="pb-4 md:pb-8">
        {featured.map((project, i) => {
          const isOpen = expanded === project.id;

          return (
            <div key={project.id} className="proj-row border-b border-border" style={{ opacity: 0 }}>

              {/* ── Clickable row header ── */}
              <button
                onClick={() => setExpanded(isOpen ? null : project.id)}
                data-cursor="hover"
                className="w-full group relative text-left"
              >
                {/* Hover / open bg */}
                <div
                  className="absolute inset-0 bg-card/70 transition-opacity duration-300 pointer-events-none"
                  style={{ opacity: isOpen ? 1 : 0 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
                  onMouseLeave={(e) => { if (!isOpen) (e.currentTarget as HTMLDivElement).style.opacity = "0"; }}
                />

                {/* Left accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary transition-transform duration-300 pointer-events-none origin-top"
                  style={{ transform: isOpen ? "scaleY(1)" : "scaleY(0)" }}
                />

                <div className="relative z-10 py-6 flex items-center gap-4 md:gap-6">
                  {/* Index */}
                  <span className="font-mono text-[11px] text-foreground/50 w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <div className="flex-1">
                    <h3
                      className="font-display font-bold leading-tight transition-colors duration-300"
                      style={{
                        fontSize: "clamp(1.1rem,2.6vw,1.7rem)",
                        color: isOpen ? "#D9281C" : undefined,
                      }}
                    >
                      {project.title}
                    </h3>
                  </div>

                  {/* 3 tech badges — desktop */}
                  <div className="hidden md:flex items-center gap-1.5 shrink-0">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-border text-foreground/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Chevron */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.28 }}
                    className="shrink-0 text-muted-foreground/60"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </div>
              </button>

              {/* ── Inline panel ── */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-8">
                      <div className="flex flex-col md:flex-row gap-6 items-start">

                        {/* Project screenshot */}
                        <div
                          className="w-full md:w-80 lg:w-96 shrink-0 relative overflow-hidden border-[1.5px] border-primary/60 group/img"
                          style={{ aspectRatio: "16/9" }}
                        >
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover object-top transition-transform duration-700 group-hover/img:scale-105"
                            sizes="(max-width: 768px) 100vw, 384px"
                          />
                          <div className="absolute inset-0 bg-primary/5 group-hover/img:bg-transparent transition-colors duration-300" />
                        </div>

                        {/* Right: essentials only */}
                        <div className="flex flex-col gap-4 flex-1 pt-1">
                          <p className="text-sm text-foreground/80 leading-relaxed max-w-[55ch]">
                            {project.description}
                          </p>

                          {/* CTA */}
                          <div className="flex items-center gap-3 mt-auto pt-2">
                            <Link
                              href={`/projects/${project.id}`}
                              data-cursor="hover"
                              className="inline-flex items-center gap-2 bg-primary text-white font-mono text-[9px] uppercase tracking-widest px-5 py-2.5 hover:bg-white hover:text-background transition-all duration-300 group"
                            >
                              Case Study
                              <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            </Link>
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-cursor="hover"
                                className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-200"
                              >
                                GitHub ↗
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Footer CTA */}
        <Link
          href="/projects"
          data-cursor="hover"
          className="group flex items-center justify-between py-6 hover:bg-card/50 transition-colors duration-300"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80 group-hover:text-primary transition-colors duration-300">
            See all projects
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground/80 group-hover:text-primary transition-all duration-300" />
        </Link>
      </div>
      </div>
      </div>

      {/* Tech marquee */}
      <div className="h-9 border-t border-border flex items-center overflow-hidden bg-muted/10 select-none">
        <div className="marquee-track font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 whitespace-nowrap">
          {[0, 1, 2, 3].map((_, k) => (
            <span key={k} className="px-3">
              Next.js · React · TypeScript · Node.js · Python · TailwindCSS
              · MongoDB · Firebase · Android · Machine Learning · GSAP · Framer Motion · Three.js · PostgreSQL · Docker · Cloud Native · Git · System Design ·&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
