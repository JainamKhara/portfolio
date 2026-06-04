"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";
import { DecoderText } from "@/components/decoder-text";
import { RevealLine } from "@/components/reveal-line";

const featured = projects.filter((p) => p.featured);

// Tactile 3D Specular Parallax Card Component
function ThreeDProjectCard({ src, alt, isHovered }: { src: string; alt: string; isHovered: boolean }) {
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
      rotateY: mouseX * 18,
      rotateX: -mouseY * 18,
      scale: 1.01,
      boxShadow: "0 15px 30px rgba(217, 40, 28, 0.12), 0 1px 3px rgba(0, 0, 0, 0.15)",
      ease: "power2.out",
      duration: 0.4,
    });

    // Translate the image in the opposite direction (stereoscopic parallax depth)
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: -mouseX * 10,
        y: -mouseY * 10,
        scale: 1.04,
        ease: "power2.out",
        duration: 0.4,
      });
    }

    // Dynamic light reflections (specular glare effect) shifting dynamically
    if (glareRef.current) {
      const glareX = (mouseX + 0.5) * 100;
      const glareY = (mouseY + 0.5) * 100;
      gsap.to(glareRef.current, {
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 60%)`,
        ease: "power2.out",
        duration: 0.4,
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
      duration: 0.6,
    });

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: 0,
        y: 0,
        scale: 1.0,
        ease: "power3.out",
        duration: 0.6,
      });
    }

    if (glareRef.current) {
      gsap.to(glareRef.current, {
        background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)",
        ease: "power3.out",
        duration: 0.6,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`w-full relative overflow-hidden border-[1.5px] bg-black transition-colors duration-500 ease-out ${
        isHovered 
          ? "border-primary/60" 
          : "border-border/40"
      }`}
      style={{
        aspectRatio: "16/9",
        transformStyle: "preserve-3d",
        perspective: "1000px",
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
          sizes="(max-width: 768px) 100vw, 600px"
          priority
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
          start: "top 82%",
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
            start: "top 84%",
          }
        }
      );
    }
  }, { scope: sectionRef });

  /* GSAP: staggered visual plate entrance */
  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll(".project-spread-plate");
    if (!cards) return;
    gsap.fromTo(cards,
      { opacity: 0, y: 35 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.75, 
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { 
          trigger: sectionRef.current, 
          start: "top 78%" 
        } 
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative bg-background pt-10 pb-0 md:pt-12 lg:pt-12 overflow-hidden">
      {/* Structural Brutalist paper borders connecting sections */}
      <div className="absolute inset-x-6 md:inset-x-12 lg:inset-x-20 top-0 h-[1px] bg-border/40 pointer-events-none" />
      <div className="absolute inset-y-0 left-6 md:left-12 lg:left-20 w-[1px] bg-border/10 pointer-events-none" />
      <div className="absolute inset-y-0 right-6 md:right-12 lg:right-20 w-[1px] bg-border/10 pointer-events-none" />

      <div className="px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Subtle line break divider */}
          <RevealLine className="mb-8 md:mb-10" />

          {/* Section title (Simple editorial header) */}
          <div className="section-header flex items-end justify-between pb-12 md:pb-16">
            <div>
              <p className="section-label mb-3 font-mono text-[10px] uppercase tracking-widest text-primary font-bold opacity-0">
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
              className="hidden md:inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors duration-300 mb-2 font-bold"
            >
              All work <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Compact 2-Column Staggered Magazine Spread Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 border-t border-border/40 pt-12">
            
            {featured.map((project, i) => {
              const isHovered = hoveredIndex === i;

              return (
                <div
                  key={project.id}
                  className="project-spread-plate group flex flex-col space-y-6"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Plate Header: Index / Title */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground/60 select-none">
                        0{i + 1}.
                      </span>
                      <h3 className={`font-display font-bold text-2xl md:text-3xl transition-colors duration-400 relative ${
                        isHovered ? "text-primary" : "text-foreground"
                      }`}>
                        {project.title}
                        {/* Horizontal slide-sweep line */}
                        <div className={`absolute -bottom-1.5 left-0 h-[2px] bg-primary transition-all duration-400 ${
                          isHovered ? "w-1/3" : "w-0"
                        }`} />
                      </h3>
                    </div>

                    {/* Technology Badges List */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-border/40 bg-secondary/10 text-foreground/75 select-none"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3D Specular Parallax Card View */}
                  <div className={`relative p-2.5 border transition-all duration-500 bg-card/10 ${
                    isHovered 
                      ? "border-primary/50 shadow-[0_12px_24px_rgba(217,40,28,0.06)]" 
                      : "border-border/30"
                  }`}>
                    <ThreeDProjectCard 
                      src={project.image} 
                      alt={project.title} 
                      isHovered={isHovered}
                    />
                  </div>

                  {/* Concise Description Context & Actions */}
                  <div className="space-y-4 pt-1 flex flex-col flex-1 justify-between">
                    <p className="text-[15px] text-muted-foreground leading-relaxed font-sans max-w-[48ch] group-hover:text-foreground/90 transition-colors duration-300">
                      {project.description}
                    </p>

                    {/* Triple Action Buttons (Live Demo, Case Study, Source Code) */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-border/10 mt-auto">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="hover"
                          className="group inline-flex items-center justify-center gap-1 bg-foreground text-background dark:bg-zinc-100 dark:text-black font-mono text-[9px] uppercase tracking-widest px-3 py-2 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors duration-300 font-bold border border-foreground dark:border-zinc-100 hover:border-primary dark:hover:border-primary flex-1 sm:flex-none text-center"
                        >
                          Live Demo ↗
                        </a>
                      ) : (
                        <span 
                          className="inline-flex items-center justify-center gap-1 border border-border/20 bg-secondary/5 text-foreground/30 font-mono text-[9px] uppercase tracking-widest px-3 py-2 cursor-not-allowed select-none flex-1 sm:flex-none text-center"
                          title="Demo coming soon"
                        >
                          Demo Soon
                        </span>
                      )}
                      
                      <Link
                        href={`/projects/${project.id}`}
                        data-cursor="hover"
                        className="group inline-flex items-center justify-center gap-1 border border-border/40 hover:border-primary/40 bg-secondary/5 text-foreground hover:text-primary font-mono text-[9px] uppercase tracking-widest px-3 py-2 transition-colors duration-300 font-bold flex-1 sm:flex-none text-center"
                      >
                        Case Study
                      </Link>

                      {project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="hover"
                          className="group inline-flex items-center justify-center gap-1 border border-border/30 hover:border-foreground/40 bg-card/5 hover:bg-card/20 text-foreground/60 hover:text-foreground font-mono text-[9px] uppercase tracking-widest px-3 py-2 transition-colors duration-300 flex-1 sm:flex-none text-center"
                        >
                          Source Code ↗
                        </a>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1 border border-border/20 bg-secondary/5 text-foreground/30 font-mono text-[9px] uppercase tracking-widest px-3 py-2 cursor-not-allowed select-none flex-1 sm:flex-none text-center">
                          Private Repo
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}

          </div>

          {/* Stately sequential footer transition line */}
          <div className="w-full h-[1px] bg-border/40 mt-16 mb-6" />

          {/* Compact bottom redirect strip */}
          <Link
            href="/projects"
            data-cursor="hover"
            className="group flex items-center justify-between py-5 px-3 hover:bg-secondary/5 transition-colors duration-300"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/85 group-hover:text-primary transition-colors duration-300 font-bold">
              See all projects index
            </span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/85 group-hover:text-primary transition-[color,transform] duration-300" />
          </Link>

        </div>
      </div>

      {/* Aesthetic infinite technology loop strip linking to the footer */}
      <div className="h-10 border-t border-border/40 flex items-center overflow-hidden bg-secondary/5 select-none pointer-events-none">
        <div className="marquee-track font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap">
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
