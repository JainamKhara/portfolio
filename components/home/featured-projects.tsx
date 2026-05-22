"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { DecoderText } from "@/components/decoder-text";
import { RevealLine } from "@/components/reveal-line";

const featured = projects.filter((p) => p.featured);

// Tactile 3D Specular Glare Card Component
function ThreeDProjectCard({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Cursor position normalized relative to center of the card (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Tilt card dynamically in 3D (max 18 degrees tilt)
    gsap.to(el, {
      rotateY: mouseX * 22,
      rotateX: -mouseY * 22,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(217, 40, 28, 0.15), 0 1px 3px rgba(0, 0, 0, 0.2)",
      ease: "power2.out",
      duration: 0.45,
    });

    // Translate the image in the opposite direction (stereoscopic parallax depth)
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: -mouseX * 12,
        y: -mouseY * 12,
        scale: 1.05,
        ease: "power2.out",
        duration: 0.45,
      });
    }

    // Dynamic light reflections (specular glare effect) shifting dynamically
    if (glareRef.current) {
      const glareX = (mouseX + 0.5) * 100;
      const glareY = (mouseY + 0.5) * 100;
      gsap.to(glareRef.current, {
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 65%)`,
        ease: "power2.out",
        duration: 0.45,
      });
    }
  };

  const handleMouseLeave = () => {
    const el = containerRef.current;
    if (!el) return;

    // Smoothly snap back to original resting position
    gsap.to(el, {
      rotateY: 0,
      rotateX: 0,
      scale: 1.0,
      boxShadow: "0 0px 0px rgba(0, 0, 0, 0), 0 0px 0px rgba(0, 0, 0, 0)",
      ease: "power3.out",
      duration: 0.7,
    });

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: 0,
        y: 0,
        scale: 1.0,
        ease: "power3.out",
        duration: 0.7,
      });
    }

    if (glareRef.current) {
      gsap.to(glareRef.current, {
        background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)",
        ease: "power3.out",
        duration: 0.7,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full md:w-80 lg:w-96 shrink-0 relative overflow-hidden border-[1.5px] border-primary/60 bg-black transition-[border-color,transform,box-shadow] duration-300"
      style={{
        aspectRatio: "16/9",
        transformStyle: "preserve-3d",
        perspective: "1200px",
      }}
    >
      {/* Inner Image Container with dynamic opposite offset */}
      <div
        ref={imageRef}
        className="w-full h-full relative pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 384px"
        />
        <div className="absolute inset-0 bg-primary/5" />
      </div>

      {/* Dynamic Specular Glare Sheet */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)",
        }}
      />
    </div>
  );
}

export function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const renderSplitHeading = (text: string) => {
    return text.split(" ").map((word, wIdx) => (
      <span key={wIdx} className="inline-block overflow-hidden relative pb-2 mr-3 last:mr-0 group/word">
        {word.split("").map((char, cIdx) => (
          <span key={cIdx} className="char-letter inline-block translate-y-[110%] select-none">
            {char}
          </span>
        ))}
        <div className="sweep-line absolute bottom-0 left-0 h-[2.5px] bg-primary w-0" />
      </span>
    ));
  };

  /* GSAP: section header kinetic reveal & sweep */
  useGSAP(() => {
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
        }
      });

      tl.to(chars, {
        y: "0%",
        duration: 0.55,
        stagger: 0.02,
        ease: "power3.out",
      });

      tl.to(sweeps, {
        width: "100%",
        duration: 0.45,
        ease: "power2.inOut",
      }, "-=0.25");
    }

    if (label) {
      gsap.fromTo(label,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
          }
        }
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
        }
      });
    }
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
    <section ref={sectionRef} className="relative bg-background pt-24 md:pt-32">
      <div className="px-6 md:px-12 lg:px-20 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Animated Blueprint divider reveal lines */}
          <RevealLine className="mb-16" />

      {/* Header */}
      <div className="section-header flex items-end justify-between pb-12 md:pb-16">
        <div>
          <p className="section-label mb-3 font-mono text-[11px] uppercase tracking-widest text-primary/70 font-semibold opacity-0">
            <DecoderText text="02 / SELECTED WORK" delay={0.2} />
          </p>
          <h2
            className="font-display font-black leading-none tracking-tight flex flex-wrap"
            style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)" }}
          >
            {renderSplitHeading("Projects")}
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
                ref={(el) => {
                  if (el) {
                    el.setAttribute("aria-expanded", isOpen ? "true" : "false");
                    el.setAttribute("aria-controls", `proj-content-${project.id}`);
                  }
                }}
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
                    id={`proj-content-${project.id}`}
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-8">
                      <div className="flex flex-col md:flex-row gap-6 items-start">

                        {/* 3D Specular Parallax Card */}
                        <ThreeDProjectCard src={project.image} alt={project.title} />

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
                              className="inline-flex items-center gap-2 bg-primary text-white font-mono text-[9px] uppercase tracking-widest px-5 py-2.5 hover:bg-[#c22016] hover:text-white transition-colors duration-300 group"
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
          <ArrowUpRight className="h-4 w-4 text-muted-foreground/80 group-hover:text-primary transition-[color,transform] duration-300" />
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
